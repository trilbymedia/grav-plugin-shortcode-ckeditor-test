import './settings.css';

const { showSettingsPopup } = window.nextgenEditor.exports;

export default {};

const reUpcastShortcodeContent = (editor, modelShortcode) => {
  const { shortcodeData } = modelShortcode;
  const { shortcode, modelContent, modelTitlebar, modelShortcodeChildren, modelParentShortcode, viewShortcodeChildren } = shortcodeData;

  const attributes = Object.keys(shortcode.attributes).reduce((acc, attrName) => {
    acc[attrName] = modelShortcode.getAttribute(`sc-${attrName}`);
    return acc;
  }, {});

  const parentAttributes = shortcode.parent
    ? Object.keys(shortcode.parent.attributes).reduce((acc, attrName) => {
      acc[attrName] = modelParentShortcode.getAttribute(`sc-${attrName}`);
      return acc;
    }, {})
    : {};

  const childAttributes = shortcode.child
    ? [...modelShortcodeChildren.getChildren()].map((modelChild) => Object.keys(shortcode.child.attributes).reduce((acc, attrName) => {
      acc[attrName] = modelChild.getAttribute(`sc-${attrName}`);
      return acc;
    }, {}))
    : [];

  editor.model.change((modelWriter) => {
    const modelContentChildren = [...modelContent.getChildren()];

    const argsForRender = {
      editor,
      writer: modelWriter,
      data: shortcodeData,
      children: [...viewShortcodeChildren.getChildren()],
      attributes,
      parentAttributes,
      childAttributes,
    };

    if (shortcode.type === 'block') {
      [...modelTitlebar.getChildren()].forEach((modelChild) => {
        modelWriter.remove(modelChild);
      });

      shortcode.titlebar({ ...argsForRender, container: modelTitlebar });
    }

    const newModelShortcodeChildren = shortcode.content({ ...argsForRender, container: modelContent });
    newModelShortcodeChildren.shortcodeData = shortcodeData;
    newModelShortcodeChildren.isShortcodeChildren = true;

    [...modelShortcodeChildren.getChildren()].forEach((modelChild) => {
      modelWriter.append(modelChild, newModelShortcodeChildren);
    });

    modelContentChildren.forEach((modelChild) => {
      modelWriter.remove(modelChild);
    });

    shortcodeData.modelShortcodeChildren = newModelShortcodeChildren;

    if (shortcode.parent) {
      const { shortcodeData: shortcodeDataParent } = modelParentShortcode;
      const { shortcode: shortcodeParent, modelTitlebar: modelTitlebarParent, modelShortcodeChildren: modelShortcodeChildrenParent } = shortcodeDataParent;

      if (shortcodeParent.type === 'block') {
        [...modelTitlebarParent.getChildren()].forEach((modelChild) => {
          modelWriter.remove(modelChild);
        });

        const argsForRenderParent = {
          editor,
          writer: modelWriter,
          data: shortcodeDataParent,
          attributes: parentAttributes,
          parentAttributes: {},
          childAttributes: [...modelShortcodeChildrenParent.getChildren()].map((modelChild) => Object.keys(shortcode.attributes).reduce((acc, attrName) => {
            acc[attrName] = modelChild.getAttribute(`sc-${attrName}`);
            return acc;
          }, {})),
        };

        shortcodeParent.titlebar({ ...argsForRenderParent, container: modelTitlebarParent });
      }
    }
  });

  if (shortcode.child) {
    const children = [...shortcodeData.modelShortcodeChildren.getChildren()];

    const subchildren = children.reduce((acc, modelChild) => {
      if (modelChild.getChildren) {
        return acc.concat([...modelChild.getChildren()]);
      }
      return acc;
    }, []);

    children.concat(subchildren).forEach((modelChild) => {
      if (modelChild.isShortcode && modelChild.shortcodeData.modelParentShortcode === modelShortcode) {
        reUpcastShortcodeContent(editor, modelChild);
      }
    });
  }
};

export function displaySettings(editor, modelShortcode) {
  const { shortcodeData } = modelShortcode;
  const { shortcode, domShortcode, modelShortcodeChildren, modelParentShortcode } = shortcodeData;

  const plugin = window.nextgenEditor.shortcodePlugins[shortcode.plugin];

  const currentAttributes = Object.keys(shortcode.attributes).reduce((acc, attrName) => {
    acc[attrName] = modelShortcode.getAttribute(`sc-${attrName}`);
    return acc;
  }, {});

  const parentAttributes = shortcode.parent
    ? Object.keys(shortcode.parent.attributes).reduce((acc, attrName) => {
      acc[attrName] = modelParentShortcode.getAttribute(`sc-${attrName}`);
      return acc;
    }, {})
    : {};

  const childAttributes = shortcode.child
    ? [...modelShortcodeChildren.getChildren()].map((modelChild) => Object.keys(shortcode.child.attributes).reduce((acc, attrName) => {
      acc[attrName] = modelChild.getAttribute(`sc-${attrName}`);
      return acc;
    }, {}))
    : [];

  let domDisplayPoint = domShortcode;

  if (shortcode.type === 'block') {
    domDisplayPoint = domShortcode.querySelector('.sc-header > .sc-settings');
  }

  const changeAttribute = (attrName, attrValue) => {
    editor.model.change((modelWriter) => {
      modelWriter.setAttribute(`sc-${attrName}`, attrValue, modelShortcode);
    });

    reUpcastShortcodeContent(editor, modelShortcode);
  };

  const deleteShortcode = () => {
    editor.model.change((modelWriter) => {
      if (shortcode.type === 'block') {
        if (modelShortcode.parent.isShortcodeChildren && modelShortcode.parent.childCount === 1) {
          modelWriter.appendElement('paragraph', modelShortcode.parent);
        }

        modelWriter.remove(modelShortcode);
      }

      if (shortcode.type === 'inline') {
        let start = modelWriter.createPositionBefore(modelShortcode);
        let end = modelWriter.createPositionAfter(modelShortcode);

        if (modelShortcode.previousSibling && modelShortcode.previousSibling.data && modelShortcode.previousSibling.data.endsWith('\u200b')) {
          start = modelWriter.createPositionAt(modelShortcode.parent, modelShortcode.previousSibling.startOffset + modelShortcode.previousSibling.offsetSize - 1);
        }

        if (modelShortcode.nextSibling && modelShortcode.nextSibling.data && modelShortcode.nextSibling.data.startsWith('\u200b')) {
          end = modelWriter.createPositionAt(modelShortcode.parent, modelShortcode.nextSibling.startOffset + 1);
        }

        modelWriter.remove(modelWriter.createRange(start, end));
      }
    });
  };

  let popupTitle = [
    (plugin && plugin.title) || '',
    (shortcode.parent && shortcode.parent.title) || '',
    shortcode.title || '',
  ];

  popupTitle = popupTitle.filter((item) => !!item).join(' / ');

  showSettingsPopup({
    title: popupTitle,
    domDisplayPoint,
    attributes: shortcode.attributes,
    currentAttributes,
    parentAttributes,
    childAttributes,
    changeAttribute,
    deleteItem: deleteShortcode,
  });
}

import widgets from './widgets';
import './settings.css';

export default {};

const reUpcastShortcodeContent = (editor, modelShortcode) => {
  const { shortcodeData } = modelShortcode;
  const { shortcode, modelContent, modelTitlebar, modelShortcodeChildren, modelParentShortcode } = shortcodeData;

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

const changeAttribute = (editor, modelShortcode, attrName, attrValue) => {
  const { shortcodeData } = modelShortcode;
  const { shortcode } = shortcodeData;

  const attribute = shortcode.attributes[attrName];
  let newValue = attrValue;

  if (attribute.type === Boolean && typeof newValue === 'string') {
    newValue = newValue === 'true';
  }

  if (attribute.type === Number && typeof newValue === 'string') {
    newValue = +newValue;
  }

  editor.model.change((modelWriter) => {
    modelWriter.setAttribute(`sc-${attrName}`, newValue, modelShortcode);
  });

  reUpcastShortcodeContent(editor, modelShortcode);
};

export function displaySettings(editor, modelShortcode) {
  const { shortcodeData } = modelShortcode;
  const { shortcode, domShortcode, modelShortcodeChildren, modelParentShortcode } = shortcodeData;

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

  const domPopup = document.createElement('div');
  domPopup.classList.add('ck-shortcode-settings-popup');
  domPopup.style.visibility = 'hidden';

  const domBackdrop = document.createElement('div');
  domBackdrop.classList.add('backdrop');
  domPopup.appendChild(domBackdrop);

  const domInside = document.createElement('div');
  domInside.classList.add('inside');
  domPopup.appendChild(domInside);

  Object.keys(shortcode.attributes).forEach((attrName) => {
    const attribute = shortcode.attributes[attrName];

    const widget = typeof attribute.widget === 'string'
      ? { type: attribute.widget }
      : attribute.widget;

    const argsForWidget = {
      attributes: currentAttributes,
      parentAttributes,
      childAttributes,
      widget,
    };

    if (widget.visible && !widget.visible(argsForWidget)) {
      return;
    }

    const domAttribute = document.createElement('div');
    domAttribute.classList.add('attribute', `attribute-${widget.type}`);
    domInside.appendChild(domAttribute);

    const domAttributeTitle = document.createElement('div');
    domAttributeTitle.classList.add('title');
    domAttributeTitle.innerHTML = `${attribute.title}:`;
    domAttribute.appendChild(domAttributeTitle);

    if (widgets[widget.type]) {
      const attrValue = modelShortcode.getAttribute(`sc-${attrName}`);

      widgets[widget.type].render({
        ...argsForWidget,
        parent: domAttribute,
        value: attrValue,
        change: (newValue) => {
          changeAttribute(editor, modelShortcode, attrName, newValue);
        },
      });
    }
  });

  const domButtons = document.createElement('div');
  domButtons.classList.add('buttons');
  domInside.appendChild(domButtons);

  const domButtonCancel = document.createElement('button');
  domButtonCancel.classList.add('cancel');
  domButtonCancel.innerHTML = 'Cancel';
  domButtons.appendChild(domButtonCancel);

  const domButtonSave = document.createElement('button');
  domButtonSave.classList.add('save');
  domButtonSave.innerHTML = 'Save';
  domButtons.appendChild(domButtonSave);

  const domButtonDelete = document.createElement('div');
  domButtonDelete.title = 'delete shortcode';
  domButtonDelete.classList.add('delete');
  domButtonDelete.innerHTML = '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>';
  domInside.appendChild(domButtonDelete);

  document.body.appendChild(domPopup);

  let rectDisplayPoint = null;

  if (shortcode.type === 'block') {
    rectDisplayPoint = domShortcode.querySelector('.sc-header > .sc-settings').getBoundingClientRect();
  }

  if (shortcode.type === 'inline') {
    rectDisplayPoint = domShortcode.getBoundingClientRect();
  }

  domInside.style.top = `${rectDisplayPoint.top}px`;
  domInside.style.left = `${rectDisplayPoint.left + rectDisplayPoint.width}px`;

  setTimeout(() => {
    const rectBody = document.body.getBoundingClientRect();
    const rectInside = domInside.getBoundingClientRect();

    if (rectInside.top + rectInside.height > rectBody.height) {
      domInside.style.top = `${rectDisplayPoint.top + rectDisplayPoint.height - rectInside.height}px`;
    }

    if (rectInside.left + rectInside.width > rectBody.width) {
      domInside.style.left = `${rectDisplayPoint.left - rectInside.width}px`;
    }

    domPopup.style.visibility = null;
  });

  const deleteShortcode = () => {
    document.body.removeChild(domPopup);

    editor.model.change((modelWriter) => {
      // const range = modelWriter.createRangeIn(shortcodeData.modelShortcodeChildren);
      // modelWriter.move(range, modelWriter.createPositionAfter(modelShortcode));
      modelWriter.remove(modelShortcode);
    });
  };

  const cancelPopup = () => {
    document.body.removeChild(domPopup);

    Object.keys(currentAttributes).forEach((attrName) => {
      if (currentAttributes[attrName] !== modelShortcode.getAttribute(`sc-${attrName}`)) {
        changeAttribute(editor, modelShortcode, attrName, currentAttributes[attrName]);
      }
    });
  };

  const savePopup = () => {
    document.body.removeChild(domPopup);
  };

  domBackdrop.addEventListener('click', cancelPopup);
  domButtonDelete.addEventListener('click', deleteShortcode);
  domButtonCancel.addEventListener('click', cancelPopup);
  domButtonSave.addEventListener('click', savePopup);
}

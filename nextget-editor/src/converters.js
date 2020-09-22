import { displaySettings } from './settings';

export default {};

export const reservedAttributes = [
  'style',
];

const HtmlDataProcessor = window.nextgenEditor.classes.engine.dataprocessor.htmldataprocessor.class;
const toMap = window.nextgenEditor.classes.utils.tomap;

const htmlDataProcessorToData = HtmlDataProcessor.prototype.toData;

export function createModelShortcode(editor, shortcode, modelWriter, viewItem) {
  const shortcodeData = { shortcode };

  const attributes = Object.keys(shortcode.attributes).reduce((acc, attrName) => {
    const attribute = shortcode.attributes[attrName];

    acc[attrName] = viewItem.getAttribute(attrName.toLowerCase());

    if (reservedAttributes.includes(attrName)) {
      acc[attrName] = viewItem.getAttribute(`data-${attrName.toLowerCase()}`);
    }

    if (attribute.type === Boolean) {
      acc[attrName] = acc[attrName] === 'true';
    }

    if (attribute.type === Number) {
      acc[attrName] = +acc[attrName];
    }

    return acc;
  }, {});

  const prefixedAttributes = Object.keys(attributes).reduce((acc, attrName) => {
    acc[`sc-${attrName}`] = attributes[attrName];
    return acc;
  }, {});

  let parentAttributes = {};

  if (shortcode.parent) {
    const viewParent = viewItem.parent
      ? viewItem.parent.name === 'paragraph'
        ? viewItem.parent.parent
        : viewItem.parent
      : viewItem.parentNode;

    parentAttributes = Object.keys(shortcode.parent.attributes).reduce((acc, attrName) => {
      acc[attrName] = viewParent.getAttribute(attrName);
      return acc;
    }, {});
  }

  const viewChildren = [...(viewItem.getChildren
    ? viewItem.getChildren()
    : viewItem.children
  )];

  const childAttributes = shortcode.child
    ? viewChildren.map((viewChild) => Object.keys(shortcode.child.attributes).reduce((acc, attrName) => {
      acc[attrName] = viewChild.getAttribute(attrName);
      return acc;
    }, {}))
    : [];

  const modelShortcode = modelWriter.createElement(`shortcode-${shortcode.name}`, prefixedAttributes);
  modelShortcode.shortcodeData = shortcodeData;
  modelShortcode.isShortcode = true;

  shortcodeData.modelShortcode = modelShortcode;

  const argsForRender = {
    editor,
    writer: modelWriter,
    data: shortcodeData,
    children: viewChildren,
    attributes,
    parentAttributes,
    childAttributes,
  };

  let modelContent = null;

  const modelSettingsSvg = modelWriter.createElement('svg', {
    viewBox: '0 0 24 24',
    fill: 'currentColor',
    stroke: 'none',
    events: {
      click() {
        displaySettings(editor, modelShortcode);
      },
    },
  });

  const modelSettingsSvgPath = modelWriter.createElement('path', {
    d: 'M9 4.58V4c0-1.1.9-2 2-2h2a2 2 0 0 1 2 2v.58a8 8 0 0 1 1.92 1.11l.5-.29a2 2 0 0 1 2.74.73l1 1.74a2 2 0 0 1-.73 2.73l-.5.29a8.06 8.06 0 0 1 0 2.22l.5.3a2 2 0 0 1 .73 2.72l-1 1.74a2 2 0 0 1-2.73.73l-.5-.3A8 8 0 0 1 15 19.43V20a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-.58a8 8 0 0 1-1.92-1.11l-.5.29a2 2 0 0 1-2.74-.73l-1-1.74a2 2 0 0 1 .73-2.73l.5-.29a8.06 8.06 0 0 1 0-2.22l-.5-.3a2 2 0 0 1-.73-2.72l1-1.74a2 2 0 0 1 2.73-.73l.5.3A8 8 0 0 1 9 4.57zM7.88 7.64l-.54.51-1.77-1.02-1 1.74 1.76 1.01-.17.73a6.02 6.02 0 0 0 0 2.78l.17.73-1.76 1.01 1 1.74 1.77-1.02.54.51a6 6 0 0 0 2.4 1.4l.72.2V20h2v-2.04l.71-.2a6 6 0 0 0 2.41-1.4l.54-.51 1.77 1.02 1-1.74-1.76-1.01.17-.73a6.02 6.02 0 0 0 0-2.78l-.17-.73 1.76-1.01-1-1.74-1.77 1.02-.54-.51a6 6 0 0 0-2.4-1.4l-.72-.2V4h-2v2.04l-.71.2a6 6 0 0 0-2.41 1.4zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-2a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
  });

  modelWriter.append(modelSettingsSvgPath, modelSettingsSvg);

  const modelSelect = modelWriter.createElement('div', {
    class: 'sc-select',
    title: 'Select shortcode',
    events: {
      click() {
        /*
        editor.model.change((modelWriter2) => {
          modelWriter2.setSelection(modelShortcode, 'on');
        });
        */
      },
    },
  });

  modelWriter.append(modelSelect, modelShortcode);

  const modelSelectSvg = modelWriter.createElement('svg', {
    viewBox: '0 0 16 16',
    fill: 'currentColor',
    stroke: 'none',
  });

  modelWriter.append(modelSelectSvg, modelSelect);

  const modelSelectSvgPath1 = modelWriter.createElement('path', {
    d: 'M4 0v1H1v3H0V.5A.5.5 0 0 1 .5 0H4zm8 0h3.5a.5.5 0 0 1 .5.5V4h-1V1h-3V0zM4 16H.5a.5.5 0 0 1-.5-.5V12h1v3h3v1zm8 0v-1h3v-3h1v3.5a.5.5 0 0 1-.5.5H12z',
  });

  modelWriter.append(modelSelectSvgPath1, modelSelectSvg);

  const modelSelectSvgPath2 = modelWriter.createElement('path', {
    d: 'M1 1h14v14H1z',
  });

  modelWriter.append(modelSelectSvgPath2, modelSelectSvg);

  if (shortcode.type === 'block') {
    const modelHeader = modelWriter.createElement('div_readonly', { class: 'sc-header' });
    modelWriter.append(modelHeader, modelShortcode);

    const modelTitle = modelWriter.createElement('div', { value: 'sc-title' });
    modelWriter.append(modelTitle, modelHeader);

    const modelTitleValue = modelWriter.createElement('span', { class: 'sc-value' });
    modelWriter.append(modelWriter.createText(shortcode.title), modelTitleValue);

    modelWriter.append(modelWriter.createText('Shortcode - '), modelTitle);
    modelWriter.append(modelTitleValue, modelTitle);

    const modelTitlebar = modelWriter.createElement('div', { class: 'sc-titlebar' });
    modelWriter.append(modelTitlebar, modelHeader);
    shortcodeData.modelTitlebar = modelTitlebar;

    shortcode.titlebar({ ...argsForRender, container: modelTitlebar });

    const modelSettings = modelWriter.createElement('div', { class: 'sc-settings' });
    modelWriter.append(modelSettings, modelHeader);

    modelWriter.append(modelSettingsSvg, modelSettings);

    modelContent = modelWriter.createElement('div', { class: 'sc-content' });
    modelWriter.append(modelContent, modelShortcode);
    shortcodeData.modelContent = modelContent;

    if (!shortcode.parent) {
      ['before', 'after'].forEach((where) => {
        const modelInsert = modelWriter.createElement('div', {
          class: `sc-insert sc-insert-${where}`,
          title: `Insert paragraph ${where} shortcode`,
          events: {
            click() {
              editor.execute('insertParagraph', {
                position: editor.model.createPositionAt(modelShortcode, where),
              });
            },
          },
        });

        modelWriter.append(modelInsert, modelShortcode);

        const modelInsertSvg = modelWriter.createElement('svg', {
          viewBox: '0 0 10 8',
          fill: 'currentColor',
          stroke: 'none',
        });

        modelWriter.append(modelInsertSvg, modelInsert);

        const modelInsertSvgPolyline = modelWriter.createElement('polyline', {
          points: '8.05541992 0.263427734 8.05541992 4.23461914 1.28417969 4.23461914',
          transform: 'translate(1,0)',
        });

        modelWriter.append(modelInsertSvgPolyline, modelInsertSvg);

        const modelInsertSvgLine1 = modelWriter.createElement('line', {
          x1: '0',
          y1: '4.21581031',
          x2: '2',
          y2: '2.17810059',
          transform: 'translate(1, 0)',
        });

        modelWriter.append(modelInsertSvgLine1, modelInsertSvg);

        const modelInsertSvgLine2 = modelWriter.createElement('line', {
          x1: '0',
          y1: '6.21581031',
          x2: '2',
          y2: '4.17810059',
          transform: 'translate(2, 5.196955) scale(1, -1) translate(-1, -5.196955)',
        });

        modelWriter.append(modelInsertSvgLine2, modelInsertSvg);
      });
    }

    if (shortcode.parent) {
      ['before', 'after'].forEach((where) => {
        const modelAdd = modelWriter.createElement('div', {
          class: `sc-add sc-add-${where}`,
          title: `Insert new ${shortcode.title} ${where}`,
          events: {
            click() {
              editor.model.change((modelWriter2) => {
                modelWriter2.setSelection(modelShortcode, where);
                editor.execute(modelShortcode.name);
              });
            },
          },
        });

        modelWriter.append(modelAdd, modelShortcode);

        const modelAddSvg = modelWriter.createElement('svg', {
          viewBox: '0 0 24 24',
          fill: 'currentColor',
          stroke: 'none',
        });

        modelWriter.append(modelAddSvg, modelAdd);

        const modelAddSvgPath = modelWriter.createElement('path', {
          d: 'M17 11a1 1 0 0 1 0 2h-4v4a1 1 0 0 1-2 0v-4H7a1 1 0 0 1 0-2h4V7a1 1 0 0 1 2 0v4h4z',
        });

        modelWriter.append(modelAddSvgPath, modelAddSvg);
      });

      ['up', 'down'].forEach((where) => {
        const modelMove = modelWriter.createElement('div', {
          class: `sc-move sc-move-${where}`,
          title: `Move ${where}`,
          events: {
            click() {
              editor.model.change((modelWriter2) => {
                const range = modelWriter2.createRange(
                  modelWriter2.createPositionBefore(modelShortcode),
                  modelWriter2.createPositionAfter(modelShortcode),
                );

                if (where === 'up') {
                  modelWriter2.move(range, modelShortcode.previousSibling, 'before');
                } else {
                  modelWriter2.move(range, modelShortcode.nextSibling, 'after');
                }
              });
            },
          },
        });

        modelWriter.append(modelMove, modelShortcode);

        const modelAddSvg = modelWriter.createElement('svg', {
          viewBox: '0 0 24 24',
          fill: 'currentColor',
          stroke: 'none',
        });

        modelWriter.append(modelAddSvg, modelMove);

        const modelMoveSvgPath = modelWriter.createElement('path', {
          d: 'M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z',
          'fill-rule': 'evenodd',
          'clip-rule': 'evenodd',
        });

        modelWriter.append(modelMoveSvgPath, modelAddSvg);
      });
    }
  }

  if (shortcode.type === 'inline') {
    modelContent = modelWriter.createElement('span', { class: 'sc-content' });
    modelWriter.append(modelContent, modelShortcode);
    shortcodeData.modelContent = modelContent;

    const modelSettings = modelWriter.createElement('span_readonly', { class: 'sc-settings' });
    modelWriter.append(modelSettings, modelShortcode);

    modelWriter.append(modelSettingsSvg, modelSettings);
  }

  if (shortcode.extra) {
    shortcode.extra({ ...argsForRender, container: modelShortcode });
  }

  const modelShortcodeChildren = shortcode.content({ ...argsForRender, container: modelContent });

  if (modelShortcodeChildren) {
    modelShortcodeChildren.shortcodeData = shortcodeData;
    modelShortcodeChildren.isShortcodeChildren = true;
  }

  shortcodeData.modelShortcodeChildren = modelShortcodeChildren;

  return modelShortcode;
}

window.nextgenEditor.exports.createModelShortcode = createModelShortcode;

window.nextgenEditor.addPlugin('GravShortcodeCoreConverters', {
  init() {
    Object.values(window.nextgenEditor.shortcodes).forEach((shortcode) => {
      const allowAttributes = Object.keys(shortcode.attributes).map((attrName) => `sc-${attrName}`);

      if (shortcode.type === 'block') {
        this.editor.model.schema.register(`shortcode-${shortcode.name}`, {
          allowWhere: '$block',
          allowContentOf: '$root',
          allowAttributes,
        });
      }

      if (shortcode.type === 'inline') {
        this.editor.model.schema.register(`shortcode-${shortcode.name}`, {
          allowWhere: '$text',
          allowContentOf: '$block',
          allowAttributes,
        });
      }

      this.editor.conversion.for('upcast').add((dispatcher) => dispatcher.on(`element:shortcode-${shortcode.name}`, (evt, data, conversionApi) => {
        const { consumable, writer: modelWriter } = conversionApi;

        if (!consumable.test(data.viewItem, { name: true })) {
          return;
        }

        const modelShortcode = createModelShortcode(this.editor, shortcode, modelWriter, data.viewItem);

        const { shortcodeData } = modelShortcode;
        const { modelShortcodeChildren } = shortcodeData;

        if (shortcode.type === 'block' && data.viewItem.childCount === 0 && modelShortcodeChildren.name !== 'paragraph' && modelShortcodeChildren.childCount === 0) {
          modelWriter.append(modelWriter.createElement('paragraph'), modelShortcodeChildren);
        }

        const splitResult = conversionApi.splitToAllowedParent(modelShortcode, data.modelCursor);

        if (!splitResult) {
          return;
        }

        modelWriter.insert(modelShortcode, splitResult.position);

        conversionApi.convertChildren(data.viewItem, modelWriter.createPositionAt(modelShortcodeChildren, 0));

        consumable.consume(data.viewItem, { name: true });

        const parts = conversionApi.getSplitParts(modelShortcode);

        data.modelRange = modelWriter.createRange(
          modelWriter.createPositionBefore(modelShortcode),
          modelWriter.createPositionAfter(parts[parts.length - 1]),
        );

        if (splitResult.cursorParent) {
          data.modelCursor = modelWriter.createPositionAt(splitResult.cursorParent, 0);
        } else {
          data.modelCursor = data.modelRange.end;
        }
      }));

      this.editor.conversion.for('downcast').add((dispatcher) => dispatcher.on(`insert:shortcode-${shortcode.name}`, (evt, data, conversionApi) => {
        const { mapper, consumable, writer: viewWriter } = conversionApi;
        const { shortcodeData } = data.item;

        if (!consumable.consume(data.item, 'insert')) {
          return;
        }

        if (shortcode.parent) {
          let modelParentShortcode = data.item.parent;

          while (modelParentShortcode && (!modelParentShortcode.isShortcode || modelParentShortcode.shortcodeData.shortcode !== shortcode.parent)) {
            modelParentShortcode = modelParentShortcode.parent;
          }

          shortcodeData.modelParentShortcode = modelParentShortcode;
        }

        const targetViewPosition = mapper.toViewPosition(this.editor.model.createPositionBefore(data.item));

        const attributes = toMap(data.item.getAttributes());
        const viewShortcode = viewWriter.createContainerElement(`shortcode-${shortcode.name}`, attributes);

        viewShortcode.shortcodeData = shortcodeData;
        viewShortcode.isShortcode = true;

        shortcodeData.viewShortcode = viewShortcode;

        viewWriter.insert(targetViewPosition, viewShortcode);
        mapper.bindElements(data.item, viewShortcode);

        viewWriter.addClass('ck-shortcode', viewShortcode);
        viewWriter.addClass(`ck-shortcode-${shortcode.type}`, viewShortcode);

        if (shortcode.child) {
          viewWriter.addClass('ck-shortcode-parent', viewShortcode);
        }
        if (shortcode.parent) {
          viewWriter.addClass('ck-shortcode-child', viewShortcode);
        }

        setTimeout(() => {
          const domShortcode = this.editor.editing.view.domConverter.mapViewToDom(viewShortcode);

          if (domShortcode) {
            shortcodeData.domShortcode = domShortcode;
          }
        });
      }));
    });

    this.editor.conversion.for('downcast').add((dispatcher) => dispatcher.on('insert', (evt, data, conversionApi) => {
      if (data.item.isShortcodeChildren) {
        const { shortcodeData } = data.item;
        const viewShortcodeChildren = conversionApi.mapper.toViewElement(data.item);
        viewShortcodeChildren.shortcodeData = shortcodeData;
        viewShortcodeChildren.isShortcodeChildren = true;

        shortcodeData.viewShortcodeChildren = viewShortcodeChildren;
      }
    }, { priority: 'lowest' }));
  },
});

HtmlDataProcessor.prototype.toData = function toData(viewFragment) {
  const modelShortcodes = [];

  const recursive = (viewElement) => {
    if (viewElement.isShortcode) {
      modelShortcodes.push(viewElement);
    }

    if (viewElement.getChildren) {
      [...viewElement.getChildren()].forEach(recursive);
    }
  };

  recursive(viewFragment);

  modelShortcodes.forEach((viewShortcode) => {
    const { viewShortcodeChildren } = viewShortcode.shortcodeData;

    // eslint-disable-next-line no-underscore-dangle
    viewShortcode._removeChildren(0, viewShortcode.childCount);
    // eslint-disable-next-line no-underscore-dangle
    viewShortcode._appendChild(viewShortcodeChildren.getChildren());
  });

  return htmlDataProcessorToData.call(this, viewFragment);
};

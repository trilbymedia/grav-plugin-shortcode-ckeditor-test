import { displaySettings } from './settings';

export default {};

export const reservedAttributes = [
  'style',
];

const HtmlDataProcessor = window.ckeditor5.classes.engine.dataprocessor.htmldataprocessor.class;
const toMap = window.ckeditor5.classes.utils.tomap;

const htmlDataProcessorToData = HtmlDataProcessor.prototype.toData;

export function createModelShortcode(editor, shortcode, modelWriter, viewItem) {
  const shortcodeData = { shortcode };

  const attributes = Object.keys(shortcode.attributes).reduce((acc, attrName) => {
    const attribute = shortcode.attributes[attrName];

    acc[attrName] = viewItem.getAttribute(attrName);

    if (reservedAttributes.includes(attrName)) {
      acc[attrName] = viewItem.getAttribute(`data-${attrName}`);
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

  const childAttributes = shortcode.child
    ? [...(viewItem.getChildren ? viewItem.getChildren() : viewItem.children)].map((viewChild) => Object.keys(shortcode.child.attributes).reduce((acc, attrName) => {
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

  if (shortcode.extra) {
    const modelExtra = modelWriter.createElement('div', { class: 'sc-extra' });
    modelWriter.append(modelExtra, modelShortcode);

    shortcode.extra({ ...argsForRender, container: modelExtra });
  }

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
  }

  if (shortcode.type === 'inline') {
    modelContent = modelWriter.createElement('span', { class: 'sc-content' });
    modelWriter.append(modelContent, modelShortcode);
    shortcodeData.modelContent = modelContent;

    const modelSettings = modelWriter.createElement('span_readonly', { class: 'sc-settings' });
    modelWriter.append(modelSettings, modelShortcode);

    modelWriter.append(modelSettingsSvg, modelSettings);
  }

  const modelShortcodeChildren = shortcode.content({ ...argsForRender, container: modelContent });
  modelShortcodeChildren.shortcodeData = shortcodeData;
  modelShortcodeChildren.isShortcodeChildren = true;

  shortcodeData.modelShortcodeChildren = modelShortcodeChildren;

  return modelShortcode;
}

window.ckeditor5.exports.createModelShortcode = createModelShortcode;

window.ckeditor5.addPlugin('GravShortcodeCoreConverters', {
  init() {
    Object.values(window.ckeditor5.shortcodes).forEach((shortcode) => {
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

window.nextgenEditor.addShortcode('ui-tabs', {
  type: 'block',
  plugin: 'shortcode-ui',
  title: 'UI Tabs',
  button: {
    group: 'shortcode-ui',
    label: 'UI Tabs',
  },
  attributes: {
    theme: {
      type: String,
      title: 'Theme',
      widget: {
        type: 'radios',
        values: [
          { value: 'default', label: 'Default' },
          { value: 'lite', label: 'Lite' },
          { value: 'badges', label: 'Badges' },
        ],
      },
      default: 'default',
    },
    position: {
      type: String,
      title: 'Position',
      widget: {
        type: 'radios',
        values: [
          { value: 'top-left', label: 'Top Left' },
          { value: 'top-right', label: 'Top Right' },
          { value: 'bottom-left', label: 'Bottom Left' },
          { value: 'bottom-right', label: 'Bottom Right' },
        ],
      },
      default: 'top-left',
    },
    active: {
      type: Number,
      title: 'Active Tab',
      widget: {
        type: 'radios',
        values: ({ childAttributes }) => childAttributes.map((child, index) => ({
          value: index,
          label: child.title,
        })),
      },
      default: 0,
    },
  },
  titlebar({ writer, container, attributes, childAttributes }) {
    const theme = attributes.theme
      ? this.attributes.theme.widget.values.find((item) => item.value === attributes.theme)
      : '';

    const position = attributes.position
      ? this.attributes.position.widget.values.find((item) => item.value === attributes.position)
      : '';

    const active = childAttributes[attributes.active];

    const themeBlock = writer.createElement('span', { class: 'sc-theme' });
    const themeValue = writer.createElement('span', { class: 'sc-value' });
    writer.appendText(theme ? theme.label : '', themeValue);
    writer.appendText('theme: ', themeBlock);
    writer.append(themeValue, themeBlock);
    writer.append(themeBlock, container);

    writer.appendText(', ', container);

    const positionBlock = writer.createElement('span', { class: 'sc-position' });
    const positionValue = writer.createElement('span', { class: 'sc-value' });
    writer.appendText(position ? position.label : '', positionValue);
    writer.appendText('position: ', positionBlock);
    writer.append(positionValue, positionBlock);
    writer.append(positionBlock, container);

    writer.appendText(', ', container);

    const activeBlock = writer.createElement('span', { class: 'sc-active' });
    const activeValue = writer.createElement('span', { class: 'sc-value' });
    writer.appendText(active ? active.title : '', activeValue);
    writer.appendText('active: ', activeBlock);
    writer.append(activeValue, activeBlock);
    writer.append(activeBlock, container);
  },
  content({ writer, container }) {
    const content = writer.createElement('div', { class: 'sc-tabs' });
    writer.append(content, container);

    const pEmpty = writer.createElement('p_empty');
    writer.append(pEmpty, content);

    return pEmpty;
  },
  extra(args) {
    const { writer, container } = args;
    writer.append(this.getAddButton(args), container);
  },
  getAddButton({ writer, editor, data }) {
    const addButton = writer.createElement('div', {
      class: 'add-button',
      title: 'Add new tab',
    });

    const addButtonSvg = writer.createElement('svg', {
      viewBox: '0 0 24 24',
      fill: 'currentColor',
      stroke: 'none',
      events: {
        click() {
          editor.model.change((writer2) => {
            writer2.setSelection(data.modelShortcodeChildren, 'end');
            editor.execute('shortcode_ui-tabs_ui-tab');
          });
        },
      },
    });

    writer.append(addButtonSvg, addButton);

    const addButtonPath = writer.createElement('path', {
      d: 'M17 11a1 1 0 0 1 0 2h-4v4a1 1 0 0 1-2 0v-4H7a1 1 0 0 1 0-2h4V7a1 1 0 0 1 2 0v4h4z',
    });

    writer.append(addButtonPath, addButtonSvg);

    return addButton;
  },
});

window.nextgenEditor.addShortcode('ui-tab', {
  type: 'block',
  plugin: 'shortcode-ui',
  parent: 'ui-tabs',
  title: 'UI Tab',
  attributes: {
    id: {
      type: String,
      title: 'ID',
      widget: 'input-text',
      default: '',
    },
    title: {
      type: String,
      title: 'Title',
      widget: 'input-text',
      default: '',
    },
  },
  titlebar({ writer, container, attributes }) {
    writer.append(writer.createText('title: '), container);

    const strong = writer.createElement('strong');
    writer.append(writer.createText(attributes.title), strong);
    writer.append(strong, container);
  },
  content({ writer, container, attributes }) {
    const tab = writer.createElement('div', { class: 'sc-tab' });
    writer.append(tab, container);

    const body = writer.createElement('div', { class: 'sc-body' });
    writer.append(body, tab);

    return body;
  },
  extra(args) {
    const { writer, container } = args;

    writer.append(this.getAddButton(args), container);
    writer.append(this.getUpButton(args), container);
    writer.append(this.getDownButton(args), container);
  },
  getAddButton({ writer, editor, data }) {
    const addButton = writer.createElement('div', {
      class: 'add-button',
      title: 'Add new link',
    });

    const addButtonSvg = writer.createElement('svg', {
      viewBox: '0 0 24 24',
      fill: 'currentColor',
      stroke: 'none',
      events: {
        click() {
          editor.model.change((writer2) => {
            writer2.setSelection(data.modelShortcode, 'before');
            editor.execute('shortcode_ui-tabs_ui-tab');
          });
        },
      },
    });

    writer.append(addButtonSvg, addButton);

    const addButtonPath = writer.createElement('path', {
      d: 'M17 11a1 1 0 0 1 0 2h-4v4a1 1 0 0 1-2 0v-4H7a1 1 0 0 1 0-2h4V7a1 1 0 0 1 2 0v4h4z',
    });

    writer.append(addButtonPath, addButtonSvg);

    return addButton;
  },
  getUpButton({ writer, editor, data }) {
    const upButton = writer.createElement('div', {
      class: 'up-button',
      title: 'Move up',
    });

    const upButtonSvg = writer.createElement('svg', {
      viewBox: '0 0 24 24',
      fill: 'currentColor',
      stroke: 'none',
      events: {
        click() {
          editor.model.change((writer2) => {
            const range = writer2.createRange(
              writer2.createPositionBefore(data.modelShortcode),
              writer2.createPositionAfter(data.modelShortcode),
            );

            writer2.move(range, data.modelShortcode.previousSibling, 'before');
          });
        },
      },
    });

    writer.append(upButtonSvg, upButton);

    const upButtonPath = writer.createElement('path', {
      d: 'M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z',
      'fill-rule': 'evenodd',
      'clip-rule': 'evenodd',
    });

    writer.append(upButtonPath, upButtonSvg);

    return upButton;
  },
  getDownButton({ writer, editor, data }) {
    const downButton = writer.createElement('div', {
      class: 'down-button',
      title: 'Move down',
    });

    const downButtonSvg = writer.createElement('svg', {
      viewBox: '0 0 24 24',
      fill: 'currentColor',
      stroke: 'none',
      events: {
        click() {
          editor.model.change((writer2) => {
            const range = writer2.createRange(
              writer2.createPositionBefore(data.modelShortcode),
              writer2.createPositionAfter(data.modelShortcode),
            );

            writer2.move(range, data.modelShortcode.nextSibling, 'after');
          });
        },
      },
    });

    writer.append(downButtonSvg, downButton);

    const downButtonPath = writer.createElement('path', {
      d: 'M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z',
      'fill-rule': 'evenodd',
      'clip-rule': 'evenodd',
    });

    writer.append(downButtonPath, downButtonSvg);

    return downButton;
  },
});

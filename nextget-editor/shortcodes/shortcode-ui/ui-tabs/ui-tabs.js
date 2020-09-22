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
  content({ writer, container }) {
    const tab = writer.createElement('div', { class: 'sc-tab' });
    writer.append(tab, container);

    const body = writer.createElement('div', { class: 'sc-body' });
    writer.append(body, tab);

    return body;
  },
});

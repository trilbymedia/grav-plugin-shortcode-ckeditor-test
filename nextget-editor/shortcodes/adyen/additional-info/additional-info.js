window.nextgenEditor.addShortcode('additional-info', {
  type: 'block',
  plugin: 'adyen',
  title: 'Additional Info',
  button: {
    group: 'adyen',
    label: 'Additional Info',
  },
  attributes: {
    title: {
      type: String,
      title: 'Title',
      widget: 'input-text',
      default: '',
    },
    linkTitle: {
      type: String,
      title: 'Link Title',
      widget: 'input-text',
      default: '',
    },
    linkUrl: {
      type: String,
      title: 'Link Url',
      widget: 'input-text',
      default: '',
    },
    linkExternal: {
      type: Number,
      title: 'Link External',
      widget: {
        type: 'input-number',
        min: 0,
        max: 1,
      },
      default: 0,
    },
  },
  titlebar({ writer, container, attributes }) {
    writer.append(writer.createText('title: '), container);

    const strong = writer.createElement('strong');
    writer.append(writer.createText(attributes.title), strong);
    writer.append(strong, container);
  },
  content({ writer, container, attributes }) {
    if (attributes.title) {
      const title = writer.createElement('div_readonly', { class: 'sc-title' });
      writer.append(writer.createText(attributes.title), title);
      writer.append(title, container);
    }

    const body = writer.createElement('div', { class: 'sc-body' });
    writer.append(body, container);

    if (attributes.linkTitle) {
      const title = writer.createElement('div_readonly', { class: 'sc-link' });
      writer.append(writer.createText(attributes.linkTitle), title);
      writer.append(title, container);
    }

    return body;
  },
});

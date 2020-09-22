window.nextgenEditor.addShortcode('tabs', {
  type: 'block',
  plugin: 'adyen',
  title: 'Tabs',
  button: {
    group: 'adyen',
    label: 'Tabs',
  },
  content({ writer, container }) {
    const content = writer.createElement('div', { class: 'sc-tabs' });
    writer.append(content, container);

    const pEmpty = writer.createElement('p_empty');
    writer.append(pEmpty, content);

    return pEmpty;
  },
});

window.nextgenEditor.addShortcode('tab', {
  type: 'block',
  plugin: 'adyen',
  parent: 'tabs',
  title: 'Tab',
  attributes: {
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

    if (attributes.title) {
      const title = writer.createElement('div_readonly', { class: 'sc-title' });
      writer.append(writer.createText(attributes.title), title);
      writer.append(title, tab);
    }

    const body = writer.createElement('div', { class: 'sc-body' });
    writer.append(body, tab);

    return body;
  },
});

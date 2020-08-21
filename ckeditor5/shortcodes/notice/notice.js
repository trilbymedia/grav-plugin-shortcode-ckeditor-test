window.ckeditor5.addShortcode('notice', {
  type: 'block',
  title: 'Notice',
  button: {
    group: 'shortcode-core',
    label: 'Notice',
  },
  attributes: {
    notice: {
      type: String,
      title: 'Type',
      bbcode: true,
      widget: {
        type: 'radios',
        values: {
          info: 'Info',
          warning: 'Warning',
          note: 'Note',
          tip: 'Tip',
        },
      },
      default: 'info',
    },
  },
  titlebar({ writer, container, attributes }) {
    writer.append(writer.createText('type: '), container);

    const strong = writer.createElement('strong');
    writer.append(writer.createText(attributes.notice), strong);
    writer.append(strong, container);
  },
  content({ writer, container, attributes }) {
    const div = writer.createElement('div', { class: `sc-notice sc-${attributes.notice}` });
    writer.append(div, container);

    const innerDiv = writer.createElement('div');
    writer.append(innerDiv, div);

    return innerDiv;
  },
});

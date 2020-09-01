window.ckeditor5.addShortcode('fieldset', {
  type: 'block',
  title: 'Fieldset',
  button: {
    group: 'shortcode-core',
    label: 'Fieldset',
  },
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
    writer.appendText(attributes.title, strong);
    writer.append(strong, container);
  },
  content({ writer, container, attributes }) {
    const fieldset = writer.createElement('fieldset');
    writer.append(fieldset, container);

    const legend = writer.createElement('legend_readonly');
    writer.appendText(attributes.title, legend);
    writer.append(legend, fieldset);

    const content = writer.createElement('div');
    writer.append(content, fieldset);

    return content;
  },
  preserve: {
    block: [
      'fieldset',
      'legend_readonly',
    ],
  },
});

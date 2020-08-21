window.ckeditor5.addShortcode('color', {
  type: 'inline',
  title: 'Color',
  button: {
    group: 'shortcode-core',
    label: 'Color',
  },
  attributes: {
    color: {
      type: String,
      title: 'Color',
      bbcode: true,
      widget: 'input-text',
      default: '',
    },
  },
  content({ writer, container, attributes }) {
    const span = writer.createElement('span', { style: `color:${attributes.color}` });
    writer.append(span, container);

    return span;
  },
});

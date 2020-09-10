window.nextgenEditor.addShortcode('size', {
  type: 'inline',
  title: 'Font Size',
  button: {
    group: 'shortcode-core',
    label: 'Font Size',
  },
  attributes: {
    size: {
      type: String,
      title: 'Color',
      bbcode: true,
      widget: 'input-text',
      default: '14',
    },
  },
  content({ writer, container, attributes }) {
    const size = !isNaN(+attributes.size)
      ? `${attributes.size}px`
      : attributes.size;

    const span = writer.createElement('span', { style: `font-size:${size}` });
    writer.append(span, container);

    return span;
  },
});

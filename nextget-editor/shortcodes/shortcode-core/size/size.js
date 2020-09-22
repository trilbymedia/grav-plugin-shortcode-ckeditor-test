window.nextgenEditor.addShortcode('size', {
  type: 'inline',
  plugin: 'shortcode-core',
  title: 'Font Size',
  button: {
    group: 'shortcode-core',
    label: 'Font Size',
  },
  attributes: {
    size: {
      type: String,
      title: 'Size',
      bbcode: true,
      widget: 'input-text',
      default: '14',
    },
  },
  content({ writer, container, attributes }) {
    const size = !Number.isNaN(+attributes.size)
      ? `${attributes.size}px`
      : attributes.size;

    const span = writer.createElement('span', { style: `font-size:${size}` });
    writer.append(span, container);

    return span;
  },
});

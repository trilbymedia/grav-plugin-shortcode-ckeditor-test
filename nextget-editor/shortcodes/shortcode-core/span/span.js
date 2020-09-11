window.nextgenEditor.addShortcode('span', {
  type: 'inline',
  plugin: 'shortcode-core',
  title: 'Span',
  button: {
    group: 'shortcode-core',
    label: 'Span',
  },
  attributes: {
    id: {
      type: String,
      title: 'ID',
      widget: 'input-text',
      default: '',
    },
    class: {
      type: String,
      title: 'Class',
      widget: 'input-text',
      default: '',
    },
    style: {
      type: String,
      title: 'Style',
      widget: 'input-text',
      default: '',
    },
  },
  content({ writer, container, attributes }) {
    const span = writer.createElement('span', {
      id: attributes.id,
      class: attributes.class,
      style: attributes.style,
    });

    writer.append(span, container);

    return span;
  },
});

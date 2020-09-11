window.nextgenEditor.addShortcode('mark', {
  type: 'inline',
  plugin: 'shortcode-core',
  title: 'Mark',
  button: {
    group: 'shortcode-core',
    label: 'Mark',
  },
  attributes: {
    style: {
      type: String,
      title: 'Style',
      bbcode: true,
      widget: {
        type: 'radios',
        values: [
          { value: 'inline', label: 'Inline' },
          { value: 'block', label: 'Block' },
        ],
      },
      default: 'inline',
    },
    class: {
      type: String,
      title: 'Class',
      widget: 'input-text',
      default: '',
    },
  },
  titlebar({ writer, container, attributes }) {
    if (attributes.style) {
      writer.appendText('style: ', container);
      writer.append(writer.createElement('strong'), container);
      writer.appendText(attributes.style, [...container.getChildren()].pop());
    }

    if (attributes.class) {
      if (attributes.id) {
        writer.appendText(', ', container);
      }
      writer.appendText('class: ', container);
      writer.append(writer.createElement('strong'), container);
      writer.appendText(attributes.class, [...container.getChildren()].pop());
    }
  },
  content({ writer, container, attributes }) {
    const span = writer.createElement('span', {
      style: attributes.style === 'block' ? 'display:block' : '',
      class: `mark-class-${attributes.class}`,
    });

    writer.append(span, container);

    return span;
  },
});

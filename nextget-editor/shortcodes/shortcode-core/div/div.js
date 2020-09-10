window.nextgenEditor.addShortcode('div', {
  type: 'block',
  title: 'Div',
  button: {
    group: 'shortcode-core',
    label: 'Div',
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
  titlebar({ writer, container, attributes }) {
    if (attributes.id) {
      writer.appendText('id: ', container);
      writer.append(writer.createElement('strong'), container);
      writer.appendText(attributes.id, [...container.getChildren()].pop());
    }

    if (attributes.class) {
      if (attributes.id) {
        writer.appendText(', ', container);
      }
      writer.appendText('class: ', container);
      writer.append(writer.createElement('strong'), container);
      writer.appendText(attributes.class, [...container.getChildren()].pop());
    }

    if (attributes.style) {
      if (attributes.id || attributes.class) {
        writer.appendText(', ', container);
      }
      writer.appendText('style: ', container);
      writer.append(writer.createElement('strong'), container);
      writer.appendText(attributes.style, [...container.getChildren()].pop());
    }
  },
  content({ writer, container, attributes }) {
    const div = writer.createElement('div', {
      id: attributes.id,
      class: attributes.class,
      style: attributes.style,
    });

    writer.append(div, container);

    return div;
  },
});

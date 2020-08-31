window.ckeditor5.addShortcode('div', {
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
      writer.append(writer.createText('id: '), container);

      const strong = writer.createElement('strong');
      writer.append(writer.createText(attributes.id), strong);
      writer.append(strong, container);
    }

    if (attributes.class) {
      if (attributes.id) {
        writer.append(writer.createText(', '), container);
      }

      writer.append(writer.createText('class: '), container);

      const strong = writer.createElement('strong');
      writer.append(writer.createText(attributes.class), strong);
      writer.append(strong, container);
    }

    if (attributes.style) {
      if (attributes.id || attributes.class) {
        writer.append(writer.createText(', '), container);
      }

      writer.append(writer.createText('style: '), container);

      const strong = writer.createElement('strong');
      writer.append(writer.createText(attributes.style), strong);
      writer.append(strong, container);
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

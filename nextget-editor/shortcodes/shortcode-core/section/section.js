window.nextgenEditor.addShortcode('section', {
  type: 'block',
  title: 'Section',
  button: {
    group: 'shortcode-core',
    label: 'Section',
  },
  attributes: {
    name: {
      type: String,
      title: 'Name',
      widget: 'input-text',
      default: '',
    },
  },
  titlebar({ writer, container, attributes }) {
    if (attributes.name) {
      writer.appendText('name: ', container);
      writer.append(writer.createElement('strong'), container);
      writer.appendText(attributes.name, [...container.getChildren()].pop());
    }
  },
  content({ writer, container, attributes }) {
    const section = writer.createElement('div', { name: attributes.name });
    writer.append(section, container);

    return section;
  },
});

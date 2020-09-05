window.ckeditor5.addHook('hookInit', () => {
  window.ckeditor5.addButtonGroup('shortcode-core-headers', {
    label: 'SC Headers',
  });
});

for (let i = 1; i <= 6; i++) {
  window.ckeditor5.addShortcode(`h${i}`, {
    type: 'block',
    title: `H${i}`,
    button: {
      group: 'shortcode-core-headers',
      label: `H${i}`,
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
    },
    content({ writer, container, attributes }) {
      const header = writer.createElement('div', {
        id: attributes.id,
        class: attributes.class,
      });

      writer.append(header, container);

      return header;
    },
  });
}

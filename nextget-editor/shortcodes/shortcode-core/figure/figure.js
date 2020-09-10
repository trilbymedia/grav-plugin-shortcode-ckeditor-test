window.nextgenEditor.addShortcode('figure', {
  type: 'block',
  title: 'Figure',
  button: {
    group: 'shortcode-core',
    label: 'Figure',
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
    caption: {
      type: String,
      title: 'Caption',
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
  content({ editor, writer, container, attributes }) {
    const wrapper = writer.createElement('div', {
      id: attributes.id,
      class: attributes.class,
    });

    writer.append(wrapper, container);

    const content = writer.createElement('div');
    writer.append(content, wrapper);

    if (attributes.caption) {
      const caption = writer.createElement('div_readonly');
      writer.appendText(attributes.caption, caption);
      writer.append(caption, wrapper);

      /*
      setTimeout(() => {
        const view = editor.data.processor.toView(attributes.caption);
        const model = editor.data.toModel(view, 'paragraph');
        
        editor.model.change((writer) => {
          writer.append(model, caption);
        });
      });
      */
    }

    return content;
  },
});

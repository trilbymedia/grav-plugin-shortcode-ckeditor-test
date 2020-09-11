window.nextgenEditor.addShortcode('details', {
  type: 'block',
  plugin: 'shortcode-core',
  title: 'Details',
  button: {
    group: 'shortcode-core',
    label: 'Details',
  },
  attributes: {
    summary: {
      type: String,
      title: 'Summary',
      bbcode: true,
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
    if (attributes.class) {
      writer.appendText('class: ', container);
      writer.append(writer.createElement('strong'), container);
      writer.appendText(attributes.class, [...container.getChildren()].pop());
    }
  },
  content({ writer, container, attributes }) {
    const details = writer.createElement('details', {
      class: attributes.class,
    });

    writer.append(details, container);

    if (attributes.summary) {
      const summary = writer.createElement('summary_readonly');
      writer.appendText(attributes.summary, summary);
      writer.append(summary, details);
    }

    const content = writer.createElement('div');
    writer.append(content, details);

    return content;
  },
  preserve: {
    block: [
      'details',
      'summary_readonly',
    ],
  },
});

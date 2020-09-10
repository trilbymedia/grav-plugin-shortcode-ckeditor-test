window.nextgenEditor.addShortcode('u', {
  type: 'inline',
  title: 'Underline',
  button: {
    group: 'shortcode-core',
    label: 'Underline',
  },
  content({ writer, container }) {
    const span = writer.createElement('span', { style: 'text-decoration:underline' });
    writer.append(span, container);

    return span;
  },
});

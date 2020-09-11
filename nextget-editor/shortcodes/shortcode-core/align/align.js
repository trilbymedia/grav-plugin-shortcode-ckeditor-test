window.nextgenEditor.addHook('hookInit', () => {
  window.nextgenEditor.addButtonGroup('shortcode-core-align', {
    label: 'SC Align',
  });
});

window.nextgenEditor.addShortcode('left', {
  type: 'block',
  plugin: 'shortcode-core',
  title: 'Left',
  button: {
    group: 'shortcode-core-align',
    label: 'Left',
  },
  content({ writer, container }) {
    const div = writer.createElement('div');
    writer.append(div, container);

    return div;
  },
});

window.nextgenEditor.addShortcode('center', {
  type: 'block',
  title: 'Center',
  button: {
    group: 'shortcode-core-align',
    label: 'Center',
  },
  content({ writer, container }) {
    const div = writer.createElement('div');
    writer.append(div, container);

    return div;
  },
});

window.nextgenEditor.addShortcode('right', {
  type: 'block',
  title: 'Right',
  button: {
    group: 'shortcode-core-align',
    label: 'Right',
  },
  content({ writer, container }) {
    const div = writer.createElement('div');
    writer.append(div, container);

    return div;
  },
});

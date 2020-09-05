window.ckeditor5.addHook('hookInit', () => {
  window.ckeditor5.addButtonGroup('shortcode-core-align', {
    label: 'SC Align',
  });
});

window.ckeditor5.addShortcode('left', {
  type: 'block',
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

window.ckeditor5.addShortcode('center', {
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

window.ckeditor5.addShortcode('right', {
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

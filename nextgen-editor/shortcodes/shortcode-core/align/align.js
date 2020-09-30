window.nextgenEditor.addHook('hookInit', () => {
  window.nextgenEditor.addButtonGroup('shortcode-core-align', {
    label: 'SC Align',
  });
});

window.nextgenEditor.addShortcode('left', {
  type: 'block',
  plugin: 'shortcode-core',
  title: 'Align Left',
  button: {
    group: 'shortcode-core-align',
    label: 'Align Left',
  },
  content() {
    return '<div style="text-align:left">{{content_editable}}</div>';
  },
});

window.nextgenEditor.addShortcode('center', {
  type: 'block',
  title: 'Align Center',
  button: {
    group: 'shortcode-core-align',
    label: 'Align Center',
  },
  content() {
    return '<div style="text-align:center">{{content_editable}}</div>';
  },
});

window.nextgenEditor.addShortcode('right', {
  type: 'block',
  title: 'Align Right',
  button: {
    group: 'shortcode-core-align',
    label: 'Align Right',
  },
  content() {
    return '<div style="text-align:right">{{content_editable}}</div>';
  },
});

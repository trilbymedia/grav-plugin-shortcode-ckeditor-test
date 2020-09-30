window.nextgenEditor.addShortcode('tabs', {
  type: 'block',
  plugin: 'adyen',
  title: 'Tabs',
  button: {
    group: 'adyen',
    label: 'Tabs',
  },
  content() {
    return '{{content_readonly}}';
  },
});

window.nextgenEditor.addShortcode('tab', {
  type: 'block',
  plugin: 'adyen',
  parent: 'tabs',
  title: 'Tab',
  attributes: {
    title: {
      type: String,
      title: 'Title',
      widget: 'input-text',
      default: '',
    },
  },
  titlebar({ attributes }) {
    return `title: <strong>${attributes.title || ''}</strong>`;
  },
  content() {
    return '{{content_editable}}';
  },
});

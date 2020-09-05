window.ckeditor5.addShortcode('lang', {
  type: 'inline',
  title: 'Language',
  button: {
    group: 'shortcode-core',
    label: 'Language',
  },
  attributes: {
    lang: {
      type: String,
      title: 'Language',
      bbcode: true,
      widget: 'input-text',
      default: 'en',
    },
  },
  content({ writer, container }) {
    const span = writer.createElement('span');
    writer.append(span, container);

    return span;
  },
});
window.ckeditor5.addShortcode('safe-email', {
  type: 'inline',
  title: 'Safe Email',
  button: {
    group: 'shortcode-core',
    label: 'Safe Email',
  },
  attributes: {
    icon: {
      type: String,
      title: 'Icon',
      bbcode: true,
      widget: 'input-text',
      default: 'grav',
    },
    autolink: {
      type: Boolean,
      title: 'Autolink',
      widget: {
        type: 'checkbox',
        label: 'Yes',
      },
      default: false,
    },
  },
  content({ writer, container, children, attributes }) {
    const wrapper = attributes.autolink
      ? writer.createElement('a', { href: `mailto:example@gmail.com` })
      : writer.createElement('span');

    writer.append(wrapper, container);

    if (attributes.icon) {
      const icon = writer.createElement('span', { class: `fa fa-${attributes.icon}` });
      writer.append(icon, wrapper);
    }

    const span = writer.createElement('span');
    writer.append(span, wrapper);

    return span;
  },
});

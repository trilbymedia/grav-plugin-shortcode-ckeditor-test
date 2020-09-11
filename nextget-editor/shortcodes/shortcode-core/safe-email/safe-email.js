window.nextgenEditor.addShortcode('safe-email', {
  type: 'inline',
  plugin: 'shortcode-core',
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
      type: String,
      title: 'Autolink',
      widget: {
        type: 'checkbox',
        valueType: String,
        label: 'Yes',
      },
      default: 'false',
    },
  },
  content({ writer, container, children, attributes }) {
    const wrapper = attributes.autolink === 'true'
      ? writer.createElement('a_reserved', { href: `mailto:example@gmail.com` })
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

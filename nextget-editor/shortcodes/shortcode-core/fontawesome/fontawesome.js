window.nextgenEditor.addShortcode('fa', {
  type: 'inline',
  title: 'Font Awesome',
  button: {
    group: 'shortcode-core',
    label: 'Font Awesome',
  },
  attributes: {
    icon: {
      type: String,
      title: 'Icon',
      bbcode: true,
      widget: 'input-text',
      default: 'grav',
    },
    extras: {
      type: String,
      title: 'Extras',
      widget: 'input-text',
      default: '',
    },
  },
  content({ writer, container, attributes }) {
    let faclass = 'fa';

    let icon = !attributes.icon.startsWith('fa-')
      ? `fa-${attributes.icon}`
      : attributes.icon;

    if (attributes.extras) {
      attributes.extras.split(',').forEach((extra) => {
        if (extra) {
          if (['fab', 'fal', 'fas', 'far'].includes(extra)) {
            faclass = extra;
            return;
          }

          icon += !extra.startsWith('fa-')
            ? ` fa-${extra}`
            : ` ${extra}`
        }
      });
    }

    const span = writer.createElement('span', { class: `${faclass} ${icon}` });
    writer.append(span, container);

    return span;
  },
});

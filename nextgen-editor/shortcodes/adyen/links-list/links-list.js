window.nextgenEditor.addShortcode('links-list', {
  type: 'block',
  plugin: 'adyen',
  title: 'Links List',
  button: {
    group: 'adyen',
    label: 'Links List',
  },
  attributes: {
    template: {
      type: String,
      title: 'Template',
      widget: {
        type: 'radios',
        values: [
          { value: 'fingerposts', label: 'Fingerposts' },
          { value: 'next-steps', label: 'Next Steps' },
          { value: 'see-also', label: 'See Also' },
        ],
      },
      default: {
        value: 'fingerposts',
        preserve: true,
      },
    },
  },
  titlebar({ attributes }) {
    const template = attributes.template
      ? this.attributes.template.widget.values.find((item) => item.value === attributes.template)
      : '';

    const templateLabel = template
      ? template.label
      : '';

    return `template: <strong>${templateLabel}</strong>`;
  },
  content({ attributes }) {
    return `<div class="sc-links-list sc-${attributes.template}">{{content_readonly}}</div>`;
  },
});

window.nextgenEditor.addShortcode('block', {
  type: 'block',
  plugin: 'adyen',
  parent: 'links-list',
  title: 'Block',
  attributes: {
    url: {
      type: String,
      title: 'URL',
      widget: 'input-text',
      default: '',
    },
    title: {
      type: String,
      title: 'Title',
      widget: {
        type: 'input-text',
        visible: ({ parentAttributes }) => parentAttributes.template === 'fingerposts' || parentAttributes.template === 'next-steps',
      },
      default: '',
    },
    required: {
      type: Boolean,
      title: 'Required',
      widget: {
        type: 'checkbox',
        label: 'Yes',
        visible: ({ parentAttributes }) => parentAttributes.template === 'next-steps',
      },
      default: false,
    },
    external: {
      type: Boolean,
      title: 'External',
      widget: {
        type: 'checkbox',
        label: 'Yes',
        visible: ({ parentAttributes }) => parentAttributes.template === 'fingerposts' || parentAttributes.template === 'next-steps',
      },
      default: false,
    },
    size: {
      type: String,
      title: 'Size',
      widget: {
        type: 'radios',
        values: [
          { value: 'small', label: 'Small' },
          { value: 'medium', label: 'Medium' },
          { value: 'large', label: 'Large' },
        ],
        visible: ({ parentAttributes }) => parentAttributes.template === 'fingerposts',
      },
      default: 'medium',
    },
  },
  content({ attributes, parentAttributes }) {
    let output = '';

    if (parentAttributes.template === 'fingerposts') {
      output += `<div class="sc-link sc-size-${attributes.size}">`;

      if (attributes.title) {
        output += `<div class="sc-title">${attributes.title}</div>`;
      }

      output += '<div class="sc-body">{{content_editable}}</div>';
      output += '</div>';

      return output;
    }

    if (parentAttributes.template === 'next-steps') {
      output += `<div class="sc-link sc-size-${attributes.size}">`;

      if (attributes.required) {
        output += '<div class="sc-required">required</div>';
      }

      if (attributes.title) {
        output += `<div class="sc-title">${attributes.title}</div>`;
      }

      output += '<div class="sc-body">{{content_editable}}</div>';
      output += '</div>';

      return output;
    }

    if (parentAttributes.template === 'see-also') {
      return '<div class="sc-body">{{content_editable}}</div>';
    }

    return '';
  },
});

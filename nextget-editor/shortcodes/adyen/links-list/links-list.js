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
  titlebar({ writer, container, attributes }) {
    const template = attributes.template
      ? this.attributes.template.widget.values.find((item) => item.value === attributes.template)
      : '';

    writer.append(writer.createText('template: '), container);
    const strong = writer.createElement('strong');
    writer.appendText(template ? template.label : '', strong);
    writer.append(strong, container);
  },
  content({ writer, container, attributes }) {
    const content = writer.createElement('div', { class: `sc-links-list sc-${attributes.template}` });
    writer.append(content, container);

    const pEmpty = writer.createElement('p_empty');
    writer.append(pEmpty, content);

    return pEmpty;
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
        visible: ({ attributes, parentAttributes }) => parentAttributes.template === 'fingerposts' || parentAttributes.template === 'next-steps',
      },
      default: '',
    },
    required: {
      type: Boolean,
      title: 'Required',
      widget: {
        type: 'checkbox',
        label: 'Yes',
        visible: ({ attributes, parentAttributes }) => parentAttributes.template === 'next-steps',
      },
      default: false,
    },
    external: {
      type: Boolean,
      title: 'External',
      widget: {
        type: 'checkbox',
        label: 'Yes',
        visible: ({ attributes, parentAttributes }) => parentAttributes.template === 'fingerposts' || parentAttributes.template === 'next-steps',
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
  content({ writer, container, attributes, parentAttributes }) {
    if (parentAttributes.template === 'fingerposts') {
      const link = writer.createElement('div', { class: `sc-link sc-size-${attributes.size}` });
      writer.append(link, container);

      if (attributes.title) {
        const title = writer.createElement('div_readonly', { class: 'sc-title' });
        writer.append(writer.createText(attributes.title), title);
        writer.append(title, link);
      }

      const body = writer.createElement('div', { class: 'sc-body' });
      writer.append(body, link);

      return body;
    }

    if (parentAttributes.template === 'next-steps') {
      const link = writer.createElement('div', { class: 'sc-link' });
      writer.append(link, container);

      if (attributes.required) {
        const required = writer.createElement('div_readonly', { class: 'sc-required' });
        writer.append(writer.createText('required'), required);
        writer.append(required, link);
      }

      if (attributes.title) {
        const title = writer.createElement('div_readonly', { class: 'sc-title' });
        writer.append(writer.createText(attributes.title), title);
        writer.append(title, link);
      }

      const body = writer.createElement('div', { class: 'sc-body' });
      writer.append(body, link);

      return body;
    }

    if (parentAttributes.template === 'see-also') {
      const link = writer.createElement('div', { class: 'sc-body' });
      writer.append(link, container);

      return link;
    }

    return writer.createElement('div');
  },
});

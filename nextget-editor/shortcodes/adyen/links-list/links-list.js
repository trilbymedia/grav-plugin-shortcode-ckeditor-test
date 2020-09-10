window.nextgenEditor.addShortcode('links-list', {
  type: 'block',
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
  extra(args) {
    const { writer, container } = args;
    writer.append(this.getAddButton(args), container);
  },
  getAddButton({ writer, editor, data }) {
    const addButton = writer.createElement('div', {
      class: 'add-button',
      title: 'Add new link',
    });

    const addButtonSvg = writer.createElement('svg', {
      viewBox: '0 0 24 24',
      fill: 'currentColor',
      stroke: 'none',
      events: {
        click() {
          editor.model.change((writer2) => {
            writer2.setSelection(data.modelShortcodeChildren, 'end');
            editor.execute('shortcode_links-list_block');
          });
        },
      },
    });

    writer.append(addButtonSvg, addButton);

    const addButtonPath = writer.createElement('path', {
      d: 'M17 11a1 1 0 0 1 0 2h-4v4a1 1 0 0 1-2 0v-4H7a1 1 0 0 1 0-2h4V7a1 1 0 0 1 2 0v4h4z',
    });

    writer.append(addButtonPath, addButtonSvg);

    return addButton;
  },
});

window.nextgenEditor.addShortcode('block', {
  type: 'block',
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
        visible: ({ attributes, parentAttributes }) => parentAttributes.template === 'fingerposts',
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

    return null;
  },
  extra(args) {
    const { writer, container } = args;

    writer.append(this.getAddButton(args), container);
    writer.append(this.getUpButton(args), container);
    writer.append(this.getDownButton(args), container);
  },
  getAddButton({ writer, editor, data }) {
    const addButton = writer.createElement('div', {
      class: 'add-button',
      title: 'Add new link',
    });

    const addButtonSvg = writer.createElement('svg', {
      viewBox: '0 0 24 24',
      fill: 'currentColor',
      stroke: 'none',
      events: {
        click() {
          editor.model.change((writer2) => {
            writer2.setSelection(data.modelShortcode, 'before');
            editor.execute('shortcode_links-list_block');
          });
        },
      },
    });

    writer.append(addButtonSvg, addButton);

    const addButtonPath = writer.createElement('path', {
      d: 'M17 11a1 1 0 0 1 0 2h-4v4a1 1 0 0 1-2 0v-4H7a1 1 0 0 1 0-2h4V7a1 1 0 0 1 2 0v4h4z',
    });

    writer.append(addButtonPath, addButtonSvg);

    return addButton;
  },
  getUpButton({ writer, editor, data }) {
    const upButton = writer.createElement('div', {
      class: 'up-button',
      title: 'Move up',
    });

    const upButtonSvg = writer.createElement('svg', {
      viewBox: '0 0 24 24',
      fill: 'currentColor',
      stroke: 'none',
      events: {
        click() {
          editor.model.change((writer2) => {
            const range = writer2.createRange(
              writer2.createPositionBefore(data.modelShortcode),
              writer2.createPositionAfter(data.modelShortcode),
            );

            writer2.move(range, data.modelShortcode.previousSibling, 'before');
          });
        },
      },
    });

    writer.append(upButtonSvg, upButton);

    const upButtonPath = writer.createElement('path', {
      d: 'M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z',
      'fill-rule': 'evenodd',
      'clip-rule': 'evenodd',
    });

    writer.append(upButtonPath, upButtonSvg);

    return upButton;
  },
  getDownButton({ writer, editor, data }) {
    const downButton = writer.createElement('div', {
      class: 'down-button',
      title: 'Move down',
    });

    const downButtonSvg = writer.createElement('svg', {
      viewBox: '0 0 24 24',
      fill: 'currentColor',
      stroke: 'none',
      events: {
        click() {
          editor.model.change((writer2) => {
            const range = writer2.createRange(
              writer2.createPositionBefore(data.modelShortcode),
              writer2.createPositionAfter(data.modelShortcode),
            );

            writer2.move(range, data.modelShortcode.nextSibling, 'after');
          });
        },
      },
    });

    writer.append(downButtonSvg, downButton);

    const downButtonPath = writer.createElement('path', {
      d: 'M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z',
      'fill-rule': 'evenodd',
      'clip-rule': 'evenodd',
    });

    writer.append(downButtonPath, downButtonSvg);

    return downButton;
  },
});

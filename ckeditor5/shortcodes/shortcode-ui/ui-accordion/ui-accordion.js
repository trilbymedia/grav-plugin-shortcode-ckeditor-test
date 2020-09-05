window.ckeditor5.addShortcode('ui-accordion', {
  type: 'block',
  title: 'UI Accordion',
  button: {
    group: 'shortcode-ui',
    label: 'UI Accordion',
  },
  attributes: {
    independent: {
      type: String,
      title: 'Independent',
      widget: {
        type: 'checkbox',
        valueType: String,
        label: 'Yes',
      },
      default: 'false',
    },
    open: {
      type: String,
      title: 'Open Section',
      widget: {
        type: 'radios',
        values: ({ childAttributes }) => [
          { value: 'all', label: 'All Open' },
          { value: 'none', label: 'All Closed' },
          ...childAttributes.map((child, index) => ({
            value: index,
            label: child.title,
          })),
        ],
      },
      default: 'all',
    },
  },
  titlebar({ writer, container, attributes, childAttributes }) {
    writer.appendText('independent: ', container);
    writer.append(writer.createElement('strong'), container);
    writer.appendText(attributes.independent === 'true' ? 'Yes' : 'No', [...container.getChildren()].pop());

    writer.appendText(', ', container);

    const openValues = this.attributes.open.widget.values({ childAttributes })
      .reduce((acc, item) => ({ ...acc, [item.value]: item.label }), {});

    const openValue = !isNaN(+attributes.open) && childAttributes[attributes.open]
      ? childAttributes[attributes.open].title
      :  openValues[attributes.open];

    writer.appendText('open: ', container);
    writer.append(writer.createElement('strong'), container);
    writer.appendText(openValue, [...container.getChildren()].pop());
  },
  content({ writer, container }) {
    const content = writer.createElement('div', { class: 'sc-accordion' });
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
      title: 'Add new item',
    });

    const addButtonSvg = writer.createElement('svg', {
      viewBox: '0 0 24 24',
      fill: 'currentColor',
      stroke: 'none',
      events: {
        click() {
          editor.model.change((writer2) => {
            writer2.setSelection(data.modelShortcodeChildren, 'end');
            editor.execute('shortcode_ui-accordion_ui-accordion-item');
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

window.ckeditor5.addShortcode('ui-accordion-item', {
  type: 'block',
  parent: 'ui-accordion',
  title: 'UI Accordion Item',
  attributes: {
    title: {
      type: String,
      title: 'Title',
      widget: 'input-text',
      default: '',
    },
  },
  titlebar({ writer, container, attributes }) {
    writer.append(writer.createText('title: '), container);

    const strong = writer.createElement('strong');
    writer.append(writer.createText(attributes.title), strong);
    writer.append(strong, container);
  },
  content({ writer, container, attributes }) {
    const item = writer.createElement('div', { class: 'sc-accordion-item' });
    writer.append(item, container);

    return item;
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
      title: 'Add new item',
    });

    const addButtonSvg = writer.createElement('svg', {
      viewBox: '0 0 24 24',
      fill: 'currentColor',
      stroke: 'none',
      events: {
        click() {
          editor.model.change((writer2) => {
            writer2.setSelection(data.modelShortcode, 'before');
            editor.execute('shortcode_ui-accordion_ui-accordion-item');
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

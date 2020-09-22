window.nextgenEditor.addShortcode('ui-accordion', {
  type: 'block',
  plugin: 'shortcode-ui',
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

    const openValue = !Number.isNaN(+attributes.open) && childAttributes[attributes.open]
      ? childAttributes[attributes.open].title
      : openValues[attributes.open];

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
});

window.nextgenEditor.addShortcode('ui-accordion-item', {
  type: 'block',
  plugin: 'shortcode-ui',
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
  content({ writer, container }) {
    const item = writer.createElement('div', { class: 'sc-accordion-item' });
    writer.append(item, container);

    return item;
  },
});

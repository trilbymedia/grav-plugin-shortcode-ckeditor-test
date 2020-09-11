window.nextgenEditor.addShortcode('columns', {
  type: 'block',
  plugin: 'shortcode-core',
  title: 'Columns',
  button: {
    group: 'shortcode-core',
    label: 'Columns',
  },
  attributes: {
    count: {
      type: Number,
      title: 'Count',
      widget: {
        type: 'input-number',
        min: 1,
        max: 12,
      },
      default: 2,
    },
    width: {
      type: String,
      title: 'Width',
      widget: 'input-text',
      default: 'auto',
    },
    gap: {
      type: String,
      title: 'Gap',
      widget: 'input-text',
      default: 'normal',
    },
    rule: {
      type: String,
      title: 'Rule',
      widget: 'input-text',
      default: '',
    },
  },
  titlebar({ writer, container, attributes }) {
    writer.appendText('count: ', container);
    writer.append(writer.createElement('strong'), container);
    writer.appendText(`${attributes.count}`, [...container.getChildren()].pop());
  },
  content({ writer, container, attributes }) {
    let style = '';

    style += `columns:${attributes.count} ${attributes.width};`;
    style += `-moz-columns:${attributes.count} ${attributes.width};`;

    style += `column-gap:${attributes.gap};`;
    style += `-moz-column-gap:${attributes.gap};`;

    if (attributes.rule) {
      style += `column-rule:${attributes.rule};`;
      style += `-moz-column-rule:${attributes.rule};`;
    }

    const div = writer.createElement('div', {
      style,
    });

    writer.append(div, container);

    return div;
  },
});

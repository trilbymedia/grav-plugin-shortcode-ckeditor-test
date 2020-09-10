window.nextgenEditor.addShortcode('notice', {
  type: 'block',
  title: 'Notice',
  button: {
    group: 'shortcode-core',
    label: 'Notice',
  },
  attributes: {
    notice: {
      type: String,
      title: 'Type',
      bbcode: true,
      widget: {
        type: 'radios',
        values: [
          { value: 'info', label: 'Info' },
          { value: 'warning', label: 'Warning' },
          { value: 'note', label: 'Note' },
          { value: 'tip', label: 'Tip' },
        ],
      },
      default: 'info',
    },
  },
  titlebar({ writer, container, attributes }) {
    const notice = attributes.notice
      ? this.attributes.notice.widget.values.find((item) => item.value === attributes.notice)
      : '';

    writer.appendText('type: ', container);
    writer.append(writer.createElement('strong'), container);
    writer.appendText(notice ? notice.label : '', [...container.getChildren()].pop());
  },
  content({ writer, container, attributes }) {
    const div = writer.createElement('div', { class: `sc-notice sc-${attributes.notice}` });
    writer.append(div, container);

    const innerDiv = writer.createElement('div');
    writer.append(innerDiv, div);

    return innerDiv;
  },
});

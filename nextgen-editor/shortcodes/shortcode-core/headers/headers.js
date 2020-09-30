const fontSizes = {
  1: '30px',
  2: '24px',
  3: '20px',
  4: '18px',
  5: '16px',
  6: '14px',
};

window.nextgenEditor.addHook('hookInit', () => {
  window.nextgenEditor.addButtonGroup('shortcode-core-headers', {
    label: 'SC Headers',
  });
});

for (let i = 1; i <= 6; i += 1) {
  window.nextgenEditor.addShortcode(`h${i}`, {
    type: 'block',
    plugin: 'shortcode-core',
    title: `H${i}`,
    button: {
      group: 'shortcode-core-headers',
      label: `H${i}`,
    },
    attributes: {
      id: {
        type: String,
        title: 'ID',
        widget: 'input-text',
        default: '',
      },
      class: {
        type: String,
        title: 'Class',
        widget: 'input-text',
        default: '',
      },
    },
    titlebar({ attributes }) {
      return []
        .concat([
          attributes.id ? `id: <strong>${attributes.id}</strong>` : null,
          attributes.class ? `class: <strong>${attributes.class}</strong>` : null,
        ])
        .filter((item) => !!item)
        .join(', ');
    },
    content({ attributes }) {
      const id = attributes.id || '';
      const cclass = attributes.class || '';

      return `<div id="${id}" class="${cclass}" style="font-size:${fontSizes[i]};font-weight:700">{{content_editable}}</div>`;
    },
  });
}

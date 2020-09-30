window.nextgenEditor.addShortcode('additional-info', {
  type: 'block',
  plugin: 'adyen',
  title: 'Additional Info',
  button: {
    group: 'adyen',
    label: 'Additional Info',
  },
  attributes: {
    title: {
      type: String,
      title: 'Title',
      widget: 'input-text',
      default: '',
    },
    linkTitle: {
      type: String,
      title: 'Link Title',
      widget: 'input-text',
      default: '',
    },
    linkUrl: {
      type: String,
      title: 'Link Url',
      widget: 'input-text',
      default: '',
    },
    linkExternal: {
      type: Number,
      title: 'Link External',
      widget: {
        type: 'input-number',
        min: 0,
        max: 1,
      },
      default: 0,
    },
  },
  titlebar({ attributes }) {
    return `title: <strong>${attributes.title || ''}</strong>`;
  },
  content({ attributes }) {
    let output = '';

    if (attributes.title) {
      output += `<div class="sc-title">${attributes.title}</div>`;
    }

    output += '<div class="sc-body">{{content_editable}}</div>';

    if (attributes.linkUrl) {
      const label = attributes.linkTitle || attributes.linkUrl;
      output += `<div class="sc-link"><a_reserved target="_blank" href="${attributes.linkUrl}">${label}</a_reserved></div>`;
    }

    return output;
  },
});

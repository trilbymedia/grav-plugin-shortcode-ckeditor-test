window.ckeditor5.addHook('hookInit', () => {
  Object.values(window.ckeditor5.shortcodes).forEach((shortcode) => {
    shortcode.attributes = shortcode.attributes || {};

    if (!shortcode.button) {
      shortcode.button = { label: shortcode.title };
    }

    Object.values(shortcode.attributes).forEach((attribute) => {
      if (attribute.default === undefined) {
        attribute.default = '';
      }
      if (typeof attribute.default !== 'object') {
        attribute.default = { value: attribute.default };
      }
    });

    if (shortcode.type === 'block' && !shortcode.titlebar) {
      shortcode.titlebar = () => {};
    }
    if (!shortcode.content) {
      shortcode.content = ({ container }) => container;
    }

    if (shortcode.preserve) {
      if (shortcode.preserve.block) {
        window.ckeditor5.addVariable('preserveBlockTags', shortcode.preserve.block);
      }

      if (shortcode.preserve.inline) {
        window.ckeditor5.addVariable('preserveInlineTags', shortcode.preserve.inline);
      }
    }

    if (!shortcode.parent) {
      window.ckeditor5.addButton(`shortcode_${shortcode.name}`, {
        command: `shortcode_${shortcode.name}`,
        ...shortcode.button,
      });
    }
  });
});

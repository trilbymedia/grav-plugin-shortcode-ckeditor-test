window.ckeditor5.addHook('hookHTMLtoMarkdown', {
  weight: -50,
  handler(options, editor, input) {
    let output = input;

    let shortcodeCounter = 1;

    const openingRegexp = Object.keys(window.ckeditor5.shortcodes)
      .map((name) => `ck-shortcode-${name}`)
      .filter((value, index, self) => self.indexOf(value) === index)
      .map((tagName) => `(<${tagName}[^>]*>)`)
      .join('|');

    while (shortcodeCounter > 0) {
      shortcodeCounter = 0;

      // eslint-disable-next-line no-loop-func
      Object.values(window.ckeditor5.shortcodes).forEach((shortcode) => {
        let regexp = '';

        const tagName = `shortcode-${shortcode.name}`;
        regexp += `<${tagName}[^>]*>(?<content>(((?!(${openingRegexp}|(<\\/${tagName}>))).)|\\n)*)<\\/${tagName}>`;

        output = output.replace(new RegExp(regexp, 'g'), (...matches) => {
          shortcodeCounter += 1;

          let replacement = '';
          const groups = matches.pop();

          const domShortcode = new DOMParser().parseFromString(matches[0], 'text/html').body.firstChild;

          const attrLine = Object.keys(shortcode.attributes).reduce((acc, attrName) => {
            const attribute = shortcode.attributes[attrName];

            let value = domShortcode.getAttribute(`sc-${attrName}`);

            if (attribute.type === Boolean) {
              if (value === 'true') {
                return `${acc} ${attrName}`;
              }
              return acc;
            }

            if (attribute.type === Number) {
              value = +value;
            }

            if (value === attribute.default.value && !attribute.default.preserve) {
              return acc;
            }

            return !attribute.bbcode
              ? `${acc} ${attrName}="${value}"`
              : `="${value}"${acc}`;
          }, '');

          let { content } = groups;

          if (shortcode.type === 'block') {
            if (content === '<p>&nbsp;</p>') {
              content = '';
            }

            if (content === '') {
              replacement += `<p>[${shortcode.realName}${attrLine} /]</p>`;
            } else {
              replacement += `<p>[${shortcode.realName}${attrLine}]</p>${content}<p>[/${shortcode.realName}]</p>`;
            }
          }

          if (shortcode.type === 'inline') {
            if (content === '&nbsp;') {
              content = '';
            }

            if (content === '') {
              replacement += `[${shortcode.realName}${attrLine} /]`;
            } else {
              replacement += `[${shortcode.realName}${attrLine}]${content}[/${shortcode.realName}]`;
            }
          }

          return replacement;
        });
      });
    }

    return output;
  },
});

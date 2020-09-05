window.ckeditor5.addHook('hookMarkdowntoHTML', {
  weight: 50,
  handler(options, input) {
    let output = input;

    let shortcodeCounter = 1;
    const openingRegexp = Object.keys(window.ckeditor5.shortcodes).map((name) => `(\\[${name}[^\\]]*\\])`).join('|');

    while (shortcodeCounter > 0) {
      shortcodeCounter = 0;

      // eslint-disable-next-line no-loop-func
      Object.values(window.ckeditor5.shortcodes).forEach((shortcode) => {
        const regexp = `(?<p1><p>)?\\[${shortcode.name}(?<attributes>(=| +)[^\\]]*)?\\](<\\/p>)?(?<content>(((?!(${openingRegexp}|(\\[\\/${shortcode.name}\\]))).)|\\n)*)\\[\\/${shortcode.name}\\](?<p2><\\/p>)?`;

        output = output.replace(new RegExp(regexp, 'g'), (...matches) => {
          shortcodeCounter += 1;

          const groups = matches.pop();

          const content = shortcode.type === 'block'
            ? groups.content.replace(/<p>$/, '')
            : groups.content;

          let replacement = `<shortcode-${shortcode.name}${groups.attributes || ''}>${content}</shortcode-${shortcode.name}>`;

          if (shortcode.type === 'inline') {
            replacement = `${groups.p1 || ''}${replacement}${groups.p2 || ''}`;
          }

          return replacement;
        });
      });
    }

    return output;
  },
});

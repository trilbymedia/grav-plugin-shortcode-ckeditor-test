import { reservedAttributes } from './converters';

window.ckeditor5.addHook('hookMarkdowntoHTML', {
  weight: -50,
  handler(options, input) {
    let output = input;

    const realNames = Object.values(window.ckeditor5.shortcodes).map((shortcode) => shortcode.realName)
      .filter((value, index, self) => self.indexOf(value) === index);

    const openingRegexp = realNames
      .map((name) => `(\\[${name}[^\\]]*\\])`).join('|');

    realNames.forEach((name) => {
      const regexp = `\\[${name}(?<attributes>(=| )[^/]*)?\\/\\]`;

      output = output.replace(new RegExp(regexp, 'g'), (...matches) => {
        const groups = matches.pop();

        const attributes = groups.attributes.trim()
          ? ` ${groups.attributes.trim()}`
          : '';

        return `[${name}${attributes}][/${name}]`;
      });
    });

    const hashMap = {};
    let shortcodeCounter = 1;

    while (shortcodeCounter > 0) {
      shortcodeCounter = 0;

      // eslint-disable-next-line no-loop-func
      Object.values(window.ckeditor5.shortcodes).forEach((shortcode) => {
        const regexp = `(?<spaces_before> *)\\[${shortcode.realName}(?<attributes>(=| )[^\\]]*)?\\](?<content>(((?!(${openingRegexp}|(\\[\\/${shortcode.realName}\\]))).)|\\n)*)\\[\\/${shortcode.realName}\\](?<spaces_after> *)`;

        output = output.replace(new RegExp(regexp, 'g'), (...matches) => {
          shortcodeCounter += 1;

          const hash = Math.random().toString(36).slice(2);
          hashMap[hash] = { shortcode, matches };

          if (shortcode.child) {
            const childName = shortcode.child.realName;

            Object.keys(hashMap).forEach((childHash) => {
              const childShortcode = hashMap[childHash].shortcode;

              if (childShortcode === shortcode.child && childShortcode.name !== `${shortcode.realName}_${childName}` && matches[0].includes(childHash)) {
                hashMap[childHash].shortcode = window.ckeditor5.shortcodes[`${shortcode.realName}_${childName}`];
              }
            });
          }

          return hash;
        });
      });
    }

    shortcodeCounter = 1;

    while (shortcodeCounter > 0) {
      shortcodeCounter = 0;

      // eslint-disable-next-line no-loop-func
      Object.keys(hashMap).forEach((hash) => {
        if (!output.includes(hash)) {
          return;
        }

        shortcodeCounter += 1;

        const { shortcode, matches } = hashMap[hash];
        const groups = matches.pop();

        const domAttributes = new DOMParser().parseFromString(`<div ${groups.attributes}></div>`, 'text/html').body.firstChild.attributes;

        const attrLine = Object.keys(shortcode.attributes).reduce((acc, attrName) => {
          const attribute = shortcode.attributes[attrName];

          let attrValue = (domAttributes.getNamedItem(attrName) && domAttributes.getNamedItem(attrName).value) || undefined;

          if (attribute.bbcode && domAttributes.getNamedItem(attrName) === null && domAttributes.item(0) !== null && domAttributes.item(0).name.startsWith('=')) {
            attrValue = domAttributes.item(0).name.slice(1).replace(/^'|"/, '').replace(/'|"$/, '');
          }

          if (attribute.type === Boolean && domAttributes.getNamedItem(attrName)) {
            attrValue = attrValue !== 'false';
          }

          if (attrValue === undefined) {
            attrValue = attribute.default.value;
          }

          const newAttrName = reservedAttributes.includes(attrName)
            ? `data-${attrName}`
            : attrName;

          return `${acc} ${newAttrName}="${attrValue}"`;
        }, '');

        const spacesBefore = groups.spaces_before.replace(/ /g, '&nbsp;');
        const spacesAfter = groups.spaces_after.replace(/ /g, '&nbsp;');

        if (shortcode.type === 'block') {
          let content = groups.content.trim();

          if (groups.spaces_before.length) {
            content = content.replace(new RegExp(`^( ){${groups.spaces_before.length}}`, 'gm'), '');
          }

          const replacement = `\n\n[${shortcode.name}${attrLine}]\n\n${content}\n\n[/${shortcode.name}]\n\n`;

          output = output.replace(new RegExp(`(\\n)?(\\n)?${hash}(\\n)?(\\n)?`), replacement);
        }

        if (shortcode.type === 'inline') {
          output = output.replace(hash, `${spacesBefore}[${shortcode.name}${attrLine}]${groups.content}[/${shortcode.name}]${spacesAfter}`);
        }
      });
    }

    output = output.replace(/^\n\n/, '').replace(/\n\n$/, '');

    return output;
  },
});

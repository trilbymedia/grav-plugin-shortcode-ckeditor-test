const sentence = 'Lorem ipsum dolor sit amet consectetur adipiscing elit, molestie tortor cubilia eu facilisi ex varius, convallis pretium dapibus fusce porta ligula.';
const words = [].concat(...Array(1000).fill(sentence.toLowerCase().replace(/[.|,]/g, '').split(' ')));
const paragraph = Array(2).fill(sentence).join(' ');

window.ckeditor5.addShortcode('lorem', {
  type: 'block',
  title: 'Lorem',
  button: {
    group: 'shortcode-core',
    label: 'Lorem',
  },
  attributes: {
    p: {
      type: Number,
      title: 'Paragraphs',
      bbcode: true,
      widget: {
        type: 'input-number',
        min: 0,
        max: 10,
      },
      default: 2,
    },
    tag: {
      type: String,
      title: 'Tag',
      widget: 'input-text',
      default: 'p',
    },
    s: {
      type: Number,
      title: 'Sentences',
      widget: 'input-number',
      default: 0,
    },
    w: {
      type: Number,
      title: 'Words',
      widget: 'input-number',
      default: 0,
    },
  },
  titlebar({ writer, container, attributes }) {
    if (attributes.w) {
      writer.append(writer.createText('words: '), container);

      const strong = writer.createElement('strong');
      writer.append(writer.createText(`${attributes.w}`), strong);
      writer.append(strong, container);
    } else if (attributes.s) {
      writer.append(writer.createText('sentences: '), container);

      const strong = writer.createElement('strong');
      writer.append(writer.createText(`${attributes.s}`), strong);
      writer.append(strong, container);
    } else {
      writer.append(writer.createText('paragraphs: '), container);

      const strong = writer.createElement('strong');
      writer.append(writer.createText(`${attributes.p}`), strong);
      writer.append(strong, container);
    }
  },
  content({ writer, container, attributes }) {
    const content = writer.createElement('div_readonly');
    writer.append(content, container);

    if (!attributes.w && !attributes.s && !attributes.p) {
      const pEmpty = writer.createElement('p_empty');
      writer.append(pEmpty, content);
    }

    if (attributes.w) {
      const text = words.slice(0, attributes.w).join(' ');
      writer.append(writer.createText(text), content);
    } else if (attributes.s) {
      const text = Array(attributes.s).fill(sentence).join(' ');
      writer.append(writer.createText(text), content);
    } else {
      [...Array(attributes.p)].forEach(() => {
        const p = writer.createElement('paragraph');
        writer.append(writer.createText(paragraph), p);
        writer.append(p, content);
      });
    }

    const fake = writer.createElement('div', { class: 'fake' });
    writer.append(fake, container);

    return fake;
  },
});

const sentence = 'Lorem ipsum dolor sit amet consectetur adipiscing elit, molestie tortor cubilia eu facilisi ex varius, convallis pretium dapibus fusce porta ligula.';
const words = [].concat(...Array(1000).fill(sentence.toLowerCase().replace(/[.|,]/g, '').split(' ')));
const paragraph = Array(2).fill(sentence).join(' ');

window.nextgenEditor.addShortcode('lorem', {
  type: 'block',
  plugin: 'shortcode-core',
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
      writer.appendText('words: ', container);
      writer.append(writer.createElement('strong'), container);
      writer.appendText(`${attributes.w}`, [...container.getChildren()].pop());
    } else if (attributes.s) {
      writer.appendText('sentences: ', container);
      writer.append(writer.createElement('strong'), container);
      writer.appendText(`${attributes.s}`, [...container.getChildren()].pop());
    } else {
      writer.appendText('paragraphs: ', container);
      writer.append(writer.createElement('strong'), container);
      writer.appendText(`${attributes.p}`, [...container.getChildren()].pop());
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
      writer.appendText(text, content);
    } else if (attributes.s) {
      const text = Array(attributes.s).fill(sentence).join(' ');
      writer.appendText(text, content);
    } else {
      [...Array(attributes.p)].forEach(() => {
        const p = writer.createElement('paragraph');
        writer.appendText(paragraph, p);
        writer.append(p, content);
      });
    }

    const fake = writer.createElement('div', { class: 'fake' });
    writer.append(fake, container);

    return fake;
  },
});

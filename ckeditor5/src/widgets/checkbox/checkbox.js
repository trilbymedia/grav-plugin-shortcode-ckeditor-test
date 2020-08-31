import './checkbox.css';

export default {
  render(args) {
    const { parent, widget, value, change } = args;

    const label = document.createElement('label');
    parent.appendChild(label);

    const input = document.createElement('input');

    input.type = 'checkbox';
    input.checked = value;

    input.addEventListener('input', () => {
      change(input.checked);
    });

    label.appendChild(input);

    const text = document.createElement('span');

    text.innerHTML = typeof widget.label === 'function'
      ? widget.label(args)
      : widget.label;

    label.appendChild(text);
  },
};

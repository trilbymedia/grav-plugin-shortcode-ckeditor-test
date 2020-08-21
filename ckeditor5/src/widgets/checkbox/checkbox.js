import './checkbox.css';

export default {
  render(parent, widget, value, change) {
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
    text.innerHTML = widget.label;

    label.appendChild(text);
  },
};

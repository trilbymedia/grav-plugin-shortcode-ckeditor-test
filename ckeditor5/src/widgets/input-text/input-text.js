import './input-text.css';

export default {
  render(parent, widget, value, change) {
    const input = document.createElement('input');

    input.type = 'text';
    input.value = value;

    input.addEventListener('input', (event) => {
      change(event.target.value);
    });

    parent.appendChild(input);
  },
};

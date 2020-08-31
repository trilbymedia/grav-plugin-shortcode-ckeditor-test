import './input-text.css';

export default {
  render(args) {
    const { parent, value, change } = args;

    const input = document.createElement('input');

    input.type = 'text';
    input.value = value;

    input.addEventListener('input', (event) => {
      change(event.target.value);
    });

    parent.appendChild(input);
  },
};

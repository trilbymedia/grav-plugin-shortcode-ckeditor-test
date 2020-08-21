import './input-number.css';

export default {
  render(parent, widget, value, change) {
    const input = document.createElement('input');

    input.type = 'number';
    input.min = widget.min || 0;
    input.max = widget.max || 1000;
    input.step = widget.step || 1;
    input.value = value;

    input.addEventListener('input', (event) => {
      change(+event.target.value);
    });

    parent.appendChild(input);
  },
};

import './radios.css';

export default {
  render(parent, widget, value, change) {
    const inputs = [];

    Object.keys(widget.values).forEach((subValue) => {
      const line = document.createElement('div');
      line.classList.add('line');

      parent.appendChild(line);

      const input = document.createElement('input');

      input.type = 'radio';
      input.value = subValue;

      if (value === subValue) {
        input.checked = true;
      }

      line.addEventListener('click', () => {
        inputs.forEach((subInput) => {
          subInput.checked = input === subInput;
        });

        change(subValue);
      });

      inputs.push(input);
      line.appendChild(input);

      const label = document.createElement('span');
      label.innerHTML = widget.values[subValue];

      line.appendChild(label);
    });
  },
};

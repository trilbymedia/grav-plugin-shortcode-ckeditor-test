import './select.css';

export default {
  render(parent, widget, value, change) {
    const select = document.createElement('select');

    parent.appendChild(select);

    Object.keys(widget.values).forEach((subValue) => {
      const option = document.createElement('option');

      option.value = subValue;
      option.innerHTML = widget.values[subValue];

      if (value === subValue) {
        option.selected = true;
      }

      select.appendChild(option);
    });

    select.addEventListener('change', () => {
      change(select.options[select.selectedIndex].value);
    });
  },
};

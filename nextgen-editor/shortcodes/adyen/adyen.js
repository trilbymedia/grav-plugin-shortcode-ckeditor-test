window.nextgenEditor.addHook('hookInit', () => {
  window.nextgenEditor.addShortcodePlugin('adyen', {
    title: 'Adyen',
  });

  window.nextgenEditor.addButtonGroup('adyen', {
    icon: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 66 65" fill="#fff" fill-rule="evenodd" stroke="#000" stroke-linecap="round" stroke-linejoin="round"><use xlink:href="#A" x=".5" y=".5"/><symbol id="A" overflow="visible"><path d="M51.128 0H1.073v16.1h32.894c2.145 0 3.575 1.788 3.575 3.575V47.9h-7.15c-2.145 0-3.575-1.788-3.575-3.575v-20.38H12.872A12.83 12.83 0 0 0 0 36.827V51.13C0 58.28 5.72 64 12.872 64H64V12.872C64 5.72 58.28 0 51.128 0z" stroke="none" fill="currentColor" fill-rule="nonzero"/></symbol></svg>',
    label: 'Adyen',
  });
});

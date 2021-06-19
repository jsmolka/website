class Theme {
  constructor() {
    const theme = localStorage.getItem('theme');
    if (theme) {
      document.body.classList.toggle('dark', theme === 'dark');
    }

    this.onChanged = dark => {};
  }

  get isDark() {
    return document.body.classList.contains('dark');
  }

  toggle() {
    const dark = document.body.classList.toggle('dark');
    localStorage.setItem('theme', dark ? 'dark' : 'light');
    this.onChanged(dark);

    return dark;
  }
}

window.theme = new Theme();

const themeButtons = document.getElementsByClassName('theme-button');

for (const themeButton of themeButtons) {
  themeButton.addEventListener('click', () => {
    window.theme.toggle();
  });
}

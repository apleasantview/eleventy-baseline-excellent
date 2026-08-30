const storageKey = 'theme-preference';
const themeColors = {
  dark: '{{ meta.themeDark }}',
  light: '{{ meta.themeLight }}'
};

const theme = {
  value: getColorPreference()
};

window.addEventListener('load', () => {
  const lightThemeToggle = document.querySelector('#light-theme-toggle');
  const darkThemeToggle = document.querySelector('#dark-theme-toggle');
  const switcher = document.querySelector('[data-theme-switcher]');

  if (!switcher) {
    return;
  }

  reflectPreference();
  updateMetaThemeColor();

  lightThemeToggle.addEventListener('click', () => onClick('light'));
  darkThemeToggle.addEventListener('click', () => onClick('dark'));

  lightThemeToggle.setAttribute('aria-pressed', theme.value === 'light');
  darkThemeToggle.setAttribute('aria-pressed', theme.value === 'dark');
});

// sync with system changes only while the visitor has not picked a theme
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', ({matches: isDark}) => {
  if (getStoredPreference()) {
    return;
  }

  theme.value = isDark ? 'dark' : 'light';
  reflectPreference();
  updateMetaThemeColor();

  const lightThemeToggle = document.querySelector('#light-theme-toggle');
  const darkThemeToggle = document.querySelector('#dark-theme-toggle');
  lightThemeToggle?.setAttribute('aria-pressed', theme.value === 'light');
  darkThemeToggle?.setAttribute('aria-pressed', theme.value === 'dark');
});

function onClick(themeValue) {
  theme.value = themeValue;
  document.querySelector('#light-theme-toggle').setAttribute('aria-pressed', themeValue === 'light');
  document.querySelector('#dark-theme-toggle').setAttribute('aria-pressed', themeValue === 'dark');
  setPreference();
  updateMetaThemeColor();
}

function getStoredPreference() {
  // storage can be blocked entirely, the toggle should still work
  try {
    return localStorage.getItem(storageKey);
  } catch (error) {
    return null;
  }
}

function getColorPreference() {
  return (
    getStoredPreference() || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  );
}

function setPreference() {
  try {
    localStorage.setItem(storageKey, theme.value);
  } catch (error) {
    // not persisted, but the current page still reflects the choice
  }
  reflectPreference();
  updateMetaThemeColor();
}

function reflectPreference() {
  document.firstElementChild.setAttribute('data-theme', theme.value);
}

function updateMetaThemeColor() {
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  const newColor = theme.value === 'dark' ? themeColors.dark : themeColors.light;
  metaThemeColor.setAttribute('content', newColor);
}

// set early so no page flashes / CSS is made aware
reflectPreference();

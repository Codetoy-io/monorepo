export function detectSystemTheme() {
  if (window.matchMedia) {
    // Check if the dark-mode media query matches
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    } else {
      return 'light';
    }
  } else {
    // Fallback for browsers that don't support matchMedia (less common now)
    // You might default to a specific theme or implement a custom logic here.
    return 'light'; // Default to light if not supported
  }
}

// Function to react to theme changes
export function watchSystemThemeChanges(callback: (theme: 'dark' | 'light') => void) {
  if (window.matchMedia) {
    const mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQueryList.addEventListener('change', (event) => {
      if (event.matches) {
        callback('dark');
      } else {
        callback('light');
      }
    });
  }
}

/*
// Example usage:
const currentTheme = detectSystemTheme();
console.log(`Current system theme: ${currentTheme}`);

watchSystemThemeChanges((newTheme) => {
  console.log(`System theme changed to: ${newTheme}`);
  // Implement your theme switching logic here, e.g.,
  // document.documentElement.setAttribute('data-theme', newTheme);
});
*/
document.addEventListener('DOMContentLoaded', function () {
  const notesTextarea = document.getElementById('notes');
  const themeToggle = document.getElementById('theme-toggle');
  const themeToggleIcon = themeToggle.querySelector('i');

  const themes = ['dark-theme', 'light-theme', 'borland-theme', 'solarized-dark', 'solarized-light', 'dracula'];
  let currentThemeIndex = 0;

  // Function to auto-expand textarea
  function autoExpandTextarea() {
    notesTextarea.style.height = 'auto';
    notesTextarea.style.height = notesTextarea.scrollHeight + 'px';
  }

  // Load single note from storage
  chrome.storage.local.get('singleNote', function (data) {
    if (data.singleNote) {
      notesTextarea.value = data.singleNote;
      autoExpandTextarea(); // Expand on load
    }
  });

  // Autosave single note on input change and auto-expand
  notesTextarea.addEventListener('input', function () {
    chrome.storage.local.set({ singleNote: notesTextarea.value });
    autoExpandTextarea(); // Expand on input
  });

  function applyTheme(theme) {
    document.body.classList.remove(...themes);
    document.body.classList.add(theme);
    chrome.storage.local.set({ theme: theme });

    if (theme === 'light-theme') {
      themeToggleIcon.classList.remove('fa-sun', 'fa-terminal');
      themeToggleIcon.classList.add('fa-moon');
    } else if (theme === 'borland-theme') {
      themeToggleIcon.classList.remove('fa-sun', 'fa-moon');
      themeToggleIcon.classList.add('fa-terminal');
    } else if (theme === 'solarized-dark' || theme === 'dracula') {
      // Use moon icon for dark-like themes
      themeToggleIcon.classList.remove('fa-sun', 'fa-terminal');
      themeToggleIcon.classList.add('fa-moon');
    } else if (theme === 'solarized-light') {
      // Use sun icon for light-like theme
      themeToggleIcon.classList.remove('fa-moon', 'fa-terminal');
      themeToggleIcon.classList.add('fa-sun');
    } else {
      // Fallback to dark theme icon
      themeToggleIcon.classList.remove('fa-sun', 'fa-moon', 'fa-terminal');
      themeToggleIcon.classList.add('fa-moon');
    }
  }

  chrome.storage.local.get('theme', function (data) {
    if (data.theme) {
      applyTheme(data.theme);
      currentThemeIndex = themes.indexOf(data.theme);
    } else {
      applyTheme('dark-theme'); // Default theme
    }
  });

  themeToggle.addEventListener('click', function () {
    currentThemeIndex = (currentThemeIndex + 1) % themes.length;
    applyTheme(themes[currentThemeIndex]);
  });
});
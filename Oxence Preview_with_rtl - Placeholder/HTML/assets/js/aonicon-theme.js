/**
 * Aonicon Digital & AI Agency - Theme Toggle & Preferences Engine
 * Handles Light/Dark mode switching with persistent local storage
 */

(function () {
  'use strict';

  // Apply stored theme immediately before DOM fully renders to prevent flash
  const savedTheme = localStorage.getItem('aonicon_theme') || 'light';
  if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark-version');
    if (document.body) {
      document.body.classList.add('dark-version');
    }
  }

  function initThemeToggle() {
    // Sync body class with html class
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-version');
    } else {
      document.body.classList.remove('dark-version');
    }

    const toggleButtons = document.querySelectorAll('.theme-toggle-btn');
    if (!toggleButtons.length) return;

    toggleButtons.forEach(btn => {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        const isDark = document.body.classList.toggle('dark-version');
        document.documentElement.classList.toggle('dark-version', isDark);
        
        // Save state
        localStorage.setItem('aonicon_theme', isDark ? 'dark' : 'light');

        // Optional: trigger resize or refresh for charts/sliders if any
        if (window.dispatchEvent) {
          window.dispatchEvent(new Event('themechange'));
        }
      });
    });
  }

  // Bind on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThemeToggle);
  } else {
    initThemeToggle();
  }
})();

(function() {
  function getTheme() {
    return localStorage.getItem('theme') || 'dark';
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    updateToggleIcon(theme);
  }

  function updateToggleIcon(theme) {
    var toggles = document.querySelectorAll('.theme-toggle');
    toggles.forEach(function(btn) {
      if (theme === 'light') {
        // Moon icon
        btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
      } else {
        // Sun icon
        btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>';
      }
    });
  }

  // Apply immediately to prevent FOUC
  var initialTheme = getTheme();
  document.documentElement.setAttribute('data-theme', initialTheme);

  // Expose to window
  window.ShaderStudyTheme = {
    toggle: function() {
      var current = getTheme();
      var next = current === 'dark' ? 'light' : 'dark';
      setTheme(next);
    },
    init: function() {
      var toggles = document.querySelectorAll('.theme-toggle');
      toggles.forEach(function(btn) {
        btn.addEventListener('click', window.ShaderStudyTheme.toggle);
      });
      updateToggleIcon(getTheme());
    }
  };

  // Wait for DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.ShaderStudyTheme.init);
  } else {
    window.ShaderStudyTheme.init();
  }
})();

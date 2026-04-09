/**
 * ShaderStudy – Learn Page Main Controller (global)
 */

var _currentLessonId = null;

document.addEventListener('DOMContentLoaded', function() {
  _initSidebarToggle();
  _initMobileBackdrop();

  var initialId = location.hash.replace('#', '') || _getFirstLessonId();
  if (initialId) {
    _selectLesson(initialId, false);
  } else {
    ShaderStudy.renderSidebar(null, _selectLesson);
    ShaderStudy.renderWelcome();
  }
});

function _selectLesson(lessonId, updateHash) {
  if (updateHash === undefined) updateHash = true;
  _currentLessonId = lessonId;

  if (updateHash) history.replaceState(null, '', '#' + lessonId);
  _closeMobileSidebar();

  ShaderStudy.renderSidebar(lessonId, _selectLesson);
  ShaderStudy.renderLesson(lessonId, function(changedId) {
    if (changedId !== lessonId) {
      _selectLesson(changedId);
    } else {
      ShaderStudy.renderSidebar(lessonId, _selectLesson);
    }
  });
  ShaderStudy.setActiveLessonInSidebar(lessonId);
}

function _initSidebarToggle() {
  document.querySelectorAll('.sidebar-toggle, .topbar-toggle').forEach(function(btn) {
    btn.addEventListener('click', function() {
      if (window.innerWidth <= 768) {
        _toggleMobileSidebar();
      } else {
        document.getElementById('sidebar')?.classList.toggle('collapsed');
      }
    });
  });
}

function _toggleMobileSidebar() {
  var sidebar  = document.getElementById('sidebar');
  var backdrop = document.getElementById('sidebar-backdrop');
  if (sidebar?.classList.contains('mobile-open')) {
    _closeMobileSidebar();
  } else {
    sidebar?.classList.add('mobile-open');
    backdrop?.classList.add('visible');
    document.body.style.overflow = 'hidden';
  }
}

function _closeMobileSidebar() {
  document.getElementById('sidebar')?.classList.remove('mobile-open');
  document.getElementById('sidebar-backdrop')?.classList.remove('visible');
  document.body.style.overflow = '';
}

function _initMobileBackdrop() {
  document.getElementById('sidebar-backdrop')?.addEventListener('click', _closeMobileSidebar);
}

function _getFirstLessonId() {
  return ShaderStudy.curriculum[0]?.lessons[0]?.id || null;
}

window.addEventListener('hashchange', function() {
  var id = location.hash.replace('#', '');
  if (id && id !== _currentLessonId) _selectLesson(id, false);
});

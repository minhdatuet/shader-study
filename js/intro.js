/**
 * ShaderStudy – Intro Page Script (global)
 */

document.addEventListener('DOMContentLoaded', function() {
  _renderStats();
  _renderCurriculumList();
});

function _renderStats() {
  var chapEl   = document.getElementById('stat-chapters');
  var lessonEl = document.getElementById('stat-lessons');
  if (chapEl)   chapEl.textContent   = ShaderStudy.curriculum.length;
  if (lessonEl) lessonEl.textContent = ShaderStudy.getTotalLessons();
}

function _renderCurriculumList() {
  var list = document.getElementById('curriculum-list');
  if (!list) return;

  if (ShaderStudy.curriculum.length === 0) {
    list.innerHTML = `
      <div class="curriculum-empty">
        <div class="curriculum-empty-icon">📖</div>
        <p>Nội dung đang được chuẩn bị.<br>Hãy quay lại sớm nhé!</p>
      </div>`;
    return;
  }

  list.innerHTML = ShaderStudy.curriculum.map(function(chapter, i) {
    return `
      <div class="chapter-card" data-chapter="${chapter.id}">
        <div class="chapter-header" role="button" tabindex="0"
             aria-expanded="false">
          <div class="chapter-number" aria-hidden="true">${String(i + 1).padStart(2, '0')}</div>
          <div class="chapter-title">${_esc(chapter.title)}</div>
          <div class="chapter-meta">${chapter.lessons.length} bài</div>
          <svg class="chapter-chevron" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/>
          </svg>
        </div>
        <div class="chapter-lessons" role="list">
          ${chapter.lessons.map(function(lesson) {
            return `<a href="learn.html#${lesson.id}" class="chapter-lesson-item" role="listitem">
              <span class="lesson-dot" aria-hidden="true"></span>
              ${_esc(lesson.title)}
            </a>`;
          }).join('')}
        </div>
      </div>`;
  }).join('');

  // Chapter toggle
  list.querySelectorAll('.chapter-header').forEach(function(header) {
    var toggle = function() {
      var card = header.closest('.chapter-card');
      var isOpen = card.classList.toggle('open');
      header.setAttribute('aria-expanded', isOpen);
    };
    header.addEventListener('click', toggle);
    header.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
    });
  });

  // Auto-open first
  var first = list.querySelector('.chapter-card');
  if (first && ShaderStudy.curriculum[0]?.lessons.length > 0) {
    first.classList.add('open');
    first.querySelector('.chapter-header')?.setAttribute('aria-expanded', 'true');
  }
}

function _esc(str) {
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

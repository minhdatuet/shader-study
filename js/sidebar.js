/**
 * ShaderStudy – Sidebar Renderer (global)
 */

window.ShaderStudy = window.ShaderStudy || {};

ShaderStudy.renderSidebar = function(activeLessonId, onLessonSelect) {
  _renderProgressBar();
  _renderNavTree(activeLessonId, onLessonSelect);
};

ShaderStudy.setActiveLessonInSidebar = function(lessonId) {
  document.querySelectorAll('.lesson-item').forEach(el => {
    el.classList.toggle('active', el.dataset.lessonId === lessonId);
  });
  const active = document.querySelector(`.lesson-item[data-lesson-id="${lessonId}"]`);
  if (active) {
    const group = active.closest('.chapter-group');
    if (group && !group.classList.contains('open')) group.classList.add('open');
    active.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }
  _renderProgressBar();
};

function _renderProgressBar() {
  const total = ShaderStudy.curriculum.reduce((acc, ch) => acc + ch.lessons.length, 0);
  const done  = ShaderStudy.getCompletedCount();
  const pct   = total > 0 ? Math.round((done / total) * 100) : 0;

  const fill  = document.querySelector('.progress-fill');
  const lDone = document.getElementById('progress-label-done');
  const lTot  = document.getElementById('progress-label-total');
  if (fill)  fill.style.width = pct + '%';
  if (lDone) lDone.textContent = done;
  if (lTot)  lTot.textContent  = total;
}

function _renderNavTree(activeLessonId, onLessonSelect) {
  const nav = document.getElementById('sidebar-nav');
  if (!nav) return;

  if (ShaderStudy.curriculum.length === 0) {
    nav.innerHTML = `
      <div style="padding:24px 20px;text-align:center;color:var(--text-muted);font-size:13px;line-height:1.6">
        <div style="font-size:32px;margin-bottom:12px">📖</div>
        <p>Chưa có bài học nào.<br>Nội dung sẽ được thêm sớm!</p>
      </div>`;
    return;
  }

  nav.innerHTML = ShaderStudy.curriculum.map((chapter, chIdx) => {
    const isOpen = chapter.lessons.some(l => l.id === activeLessonId) || chIdx === 0;
    const lessonsHTML = chapter.lessons.map(lesson => {
      const done   = ShaderStudy.isLessonDone(lesson.id);
      const active = lesson.id === activeLessonId;
      return `
        <div class="lesson-item ${done ? 'done' : ''} ${active ? 'active' : ''}"
             data-lesson-id="${lesson.id}" role="button" tabindex="0">
          <span class="lesson-item-status" aria-hidden="true"></span>
          <span class="lesson-item-title">${_esc(lesson.title)}</span>
        </div>`;
    }).join('');

    return `
      <div class="chapter-group ${isOpen ? 'open' : ''}" data-chapter-id="${chapter.id}">
        <div class="chapter-group-header" role="button" tabindex="0" aria-expanded="${isOpen}">
          <svg class="chapter-group-toggle" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
          </svg>
          <span class="chapter-group-title">${_esc(chapter.title)}</span>
          <span class="chapter-group-count">${chapter.lessons.length}</span>
        </div>
        <div class="lesson-list" aria-hidden="${!isOpen}">${lessonsHTML}</div>
      </div>`;
  }).join('');

  // Chapter toggle
  nav.querySelectorAll('.chapter-group-header').forEach(header => {
    const toggle = () => {
      const group = header.closest('.chapter-group');
      const open = group.classList.toggle('open');
      header.setAttribute('aria-expanded', open);
      group.querySelector('.lesson-list')?.setAttribute('aria-hidden', !open);
    };
    header.addEventListener('click', toggle);
    header.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
  });

  // Lesson select
  nav.querySelectorAll('.lesson-item').forEach(item => {
    const handler = () => {
      const id = item.dataset.lessonId;
      if (id && typeof onLessonSelect === 'function') onLessonSelect(id);
    };
    item.addEventListener('click', handler);
    item.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handler(); } });
  });
}

function _esc(str) {
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

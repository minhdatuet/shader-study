/**
 * ShaderStudy – Lesson Renderer (global)
 */

window.ShaderStudy = window.ShaderStudy || {};

ShaderStudy.renderLesson = function(lessonId, onLessonChange) {
  const result = ShaderStudy.getLessonById(lessonId);
  if (!result) { ShaderStudy.renderWelcome(); return; }

  const main = document.getElementById('lesson-content');
  
  if (window.ShaderStudy.Theory && window.ShaderStudy.Theory[lessonId]) {
    _doRender(lessonId, result, onLessonChange, main);
  } else {
    if (main) main.innerHTML = '<div style="padding:40px;text-align:center;color:var(--text-muted);">⏳ Đang tải nội dung...</div>';
    
    const script = document.createElement('script');
    script.src = `js/lessons/${lessonId}.js`;
    script.onload = () => {
      _doRender(lessonId, result, onLessonChange, main);
    };
    script.onerror = () => {
      if (main) main.innerHTML = '<div style="padding:40px;text-align:center;color:#ef4444;">⚠️ Lỗi tải bài học. Thiếu file dữ liệu.</div>';
    };
    document.head.appendChild(script);
  }
};

function _doRender(lessonId, result, onLessonChange, main) {
  const { lesson, chapter } = result;
  const adj = ShaderStudy.getAdjacentLessons(lessonId);
  const theoryContent = (window.ShaderStudy.Theory && window.ShaderStudy.Theory[lessonId]) || '<p style="color:var(--text-muted)">Nội dung đang được chuẩn bị...</p>';

  // Breadcrumb
  const bc = document.getElementById('breadcrumb-chapter');
  const bl = document.getElementById('breadcrumb-lesson');
  if (bc) bc.textContent = chapter.title;
  if (bl) bl.textContent = lesson.title;
  document.title = `${lesson.title} – ShaderStudy`;

  if (!main) return;

  main.innerHTML = `
    <div class="lesson-container animate-fade-in">
      <header class="lesson-header">
        <span class="lesson-chapter-tag">${_esc(chapter.title)}</span>
        <h1 class="lesson-title">${_esc(lesson.title)}</h1>
        <div class="lesson-meta">
          ${lesson.readingTime ? `<span class="lesson-meta-item">
            <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/></svg>
            ${lesson.readingTime} phút đọc
          </span>` : ''}
          ${(lesson.quiz && lesson.quiz.length > 0) ? `<span class="lesson-meta-item">
            <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/><path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
            ${lesson.quiz.length} câu trắc nghiệm
          </span>` : ''}
        </div>
      </header>

      <article class="lesson-theory" id="lesson-theory">
        ${theoryContent}
      </article>

      <div id="quiz-container"></div>

      <nav class="lesson-nav" aria-label="Điều hướng bài học">
        <button class="lesson-nav-btn prev" id="btn-prev" ${!adj.prev ? 'disabled' : ''}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
          <div>
            <div class="lesson-nav-dir">Trước</div>
            <div class="lesson-nav-title">${adj.prev ? _esc(adj.prev.lesson.title) : '—'}</div>
          </div>
        </button>
        <button class="lesson-nav-btn next" id="btn-next" ${!adj.next ? 'disabled' : ''}>
          <div style="text-align:right">
            <div class="lesson-nav-dir">Tiếp theo</div>
            <div class="lesson-nav-title">${adj.next ? _esc(adj.next.lesson.title) : '—'}</div>
          </div>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"/></svg>
        </button>
      </nav>
    </div>`;

  // Code highlight
  _applyHighlight();

  // Process figures (convert placeholders to images if they exist)
  _processFigures();

  // Init quiz
  if (lesson.quiz && lesson.quiz.length > 0) {
    const qc = document.getElementById('quiz-container');
    ShaderStudy.Quiz.init(lesson.quiz, qc, function(score, total) {
      if (score > 0) {
        ShaderStudy.markLessonDone(lessonId);
        if (typeof onLessonChange === 'function') onLessonChange(lessonId);
      }
    });
  }

  // Nav buttons
  document.getElementById('btn-prev')?.addEventListener('click', () => {
    if (adj.prev && typeof onLessonChange === 'function') onLessonChange(adj.prev.lesson.id);
  });
  document.getElementById('btn-next')?.addEventListener('click', () => {
    if (adj.next && typeof onLessonChange === 'function') onLessonChange(adj.next.lesson.id);
  });

  main.scrollTo({ top: 0, behavior: 'smooth' });
}

ShaderStudy.renderWelcome = function() {
  const bc = document.getElementById('breadcrumb-chapter');
  const bl = document.getElementById('breadcrumb-lesson');
  if (bc) bc.textContent = '';
  if (bl) bl.textContent = 'Chào mừng';
  document.title = 'ShaderStudy – Học Shader cho Unity';

  const main = document.getElementById('lesson-content');
  if (!main) return;

  const hasContent = ShaderStudy.curriculum.length > 0;
  main.innerHTML = `
    <div class="welcome-state animate-fade-in">
      <div class="welcome-icon" aria-hidden="true">${hasContent ? '📖' : '🚀'}</div>
      <h1 class="welcome-title">${hasContent ? 'Chọn một bài học để bắt đầu' : 'Sắp có nội dung!'}</h1>
      <p class="welcome-desc">
        ${hasContent
          ? 'Khám phá các chương bên trái và bắt đầu hành trình chinh phục Shader của bạn.'
          : 'Nền tảng đang được xây dựng. Nội dung bài học sẽ sớm xuất hiện ở đây.'}
      </p>
      ${hasContent ? `<button class="btn btn-primary" onclick="document.querySelector('.lesson-item')?.click()">Bắt đầu bài đầu tiên →</button>` : ''}
    </div>`;
};

function _applyHighlight() {
  if (!window.hljs) return;
  document.querySelectorAll('.lesson-theory pre code').forEach(block => {
    hljs.highlightElement(block);
    const pre = block.parentElement;
    if (pre && pre.tagName === 'PRE' && !pre.classList.contains('hljs-pre')) {
      pre.classList.add('hljs-pre');
      const wrap = document.createElement('div');
      wrap.className = 'hljs-wrapper';
      wrap.innerHTML = `<button class="hljs-copy-btn" title="Copy code">Copy</button>`;
      pre.parentNode.insertBefore(wrap, pre);
      wrap.appendChild(pre);
      wrap.querySelector('.hljs-copy-btn')?.addEventListener('click', function() {
        navigator.clipboard?.writeText(block.textContent).then(() => {
          this.textContent = 'Copied!';
          this.classList.add('copied');
          setTimeout(() => { this.textContent = 'Copy'; this.classList.remove('copied'); }, 2000);
        });
      });
    }
  });
}

function _esc(str) {
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/**
 * Thể quét các placeholder hình ảnh và thay thế bằng thẻ <img> nếu ảnh tồn tại.
 */
function _processFigures() {
  const placeholders = document.querySelectorAll('.fig-placeholder');
  
  placeholders.forEach(ph => {
    const pathEl = ph.querySelector('.fig-placeholder-path');
    if (!pathEl) return;
    
    const path = pathEl.textContent.trim();
    if (!path) return;

    // Tạo một đối tượng Image để kiểm tra sự tồn tại của file
    const imgTester = new Image();
    
    imgTester.onload = function() {
      // Nếu ảnh tải được, tạo thẻ img mới
      const img = document.createElement('img');
      img.src = path;
      img.alt = ph.querySelector('.fig-placeholder-text')?.textContent || "Lesson Figure";
      img.loading = "lazy";
      
      // Thêm class để áp dụng hiệu ứng fade-in (nếu có trong CSS)
      img.className = "animate-fade-in";
      
      // Thay thế placeholder bằng thẻ img
      ph.replaceWith(img);
    };

    imgTester.onerror = function() {
      // Nếu không tìm thấy ảnh, giữ nguyên placeholder
      console.warn(`[ShaderStudy] Không tìm thấy ảnh tại: ${path}`);
    };

    imgTester.src = path;
  });
}

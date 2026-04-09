/**
 * ShaderStudy – Quiz Engine (global)
 */

window.ShaderStudy = window.ShaderStudy || {};

ShaderStudy.Quiz = (function() {
  let _data      = [];
  let _current   = 0;
  let _score     = 0;
  let _answered  = false;
  let _container = null;
  let _onComplete = null;

  const LETTERS = ['A', 'B', 'C', 'D', 'E'];

  function _esc(str) {
    return String(str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function init(quizData, container, onComplete) {
    _data       = quizData || [];
    _container  = container;
    _onComplete = onComplete;
    _current    = 0;
    _score      = 0;
    _answered   = false;
    _render();
  }

  function _render() {
    if (!_container || _data.length === 0) { _container && (_container.innerHTML = ''); return; }
    if (_current >= _data.length) { _renderResult(); return; }

    const q     = _data[_current];
    const num   = _current + 1;
    const total = _data.length;
    _answered   = false;

    _container.innerHTML = `
      <div class="quiz-section" id="quiz-section">
        <div class="quiz-header">
          <div class="quiz-icon" aria-hidden="true">🧠</div>
          <div>
            <div class="quiz-title">Trắc Nghiệm</div>
          </div>
          <span class="quiz-progress-text" aria-live="polite">Câu ${num} / ${total}</span>
        </div>
        <div class="quiz-question-card" id="quiz-card">
          <div class="quiz-question-number">Câu hỏi ${num}</div>
          <div class="quiz-question-text">${_esc(q.question)}</div>
          <div class="quiz-options" role="radiogroup" aria-label="Lựa chọn đáp án">
            ${q.options.map((opt, i) => `
              <button class="quiz-option" data-index="${i}"
                      role="radio" aria-checked="false"
                      aria-label="Đáp án ${LETTERS[i]}: ${_esc(opt)}">
                <span class="option-letter" aria-hidden="true">${LETTERS[i]}</span>
                <span>${_esc(opt)}</span>
              </button>`).join('')}
          </div>
          ${q.explanation ? `<div class="quiz-explanation" id="quiz-explanation">
            <strong>Giải thích:</strong> ${q.explanation}
          </div>` : ''}
        </div>
        <div class="quiz-nav">
          <span id="quiz-hint" style="font-size:13px; color: var(--text-muted);">Chọn một đáp án để tiếp tục</span>
          <button class="btn btn-primary" id="quiz-next-btn" style="display:none;">
            ${_current < _data.length - 1 ? 'Câu tiếp theo →' : 'Xem kết quả →'}
          </button>
        </div>
      </div>`;

    _container.querySelectorAll('.quiz-option').forEach(btn => {
      btn.addEventListener('click', () => _handleAnswer(btn, q));
    });
  }

  function _handleAnswer(selectedBtn, q) {
    if (_answered) return;
    _answered = true;

    const idx       = parseInt(selectedBtn.dataset.index);
    const isCorrect = idx === q.correct;
    if (isCorrect) _score++;

    _container.querySelectorAll('.quiz-option').forEach((btn, i) => {
      btn.disabled = true;
      btn.setAttribute('aria-checked', 'false');
      if (i === q.correct) btn.classList.add('correct');
      else if (i === idx && !isCorrect) btn.classList.add('wrong');
    });
    selectedBtn.setAttribute('aria-checked', 'true');

    const exp = _container.querySelector('#quiz-explanation');
    if (exp) exp.classList.add('visible');

    const hint = _container.querySelector('#quiz-hint');
    if (hint) {
      hint.textContent = isCorrect ? '✅ Chính xác!' : '❌ Chưa đúng, xem giải thích bên dưới.';
      hint.style.color = isCorrect ? '#4ade80' : '#f87171';
    }

    const nextBtn = _container.querySelector('#quiz-next-btn');
    if (nextBtn) {
      nextBtn.style.display = 'inline-flex';
      nextBtn.addEventListener('click', () => { _current++; _render(); }, { once: true });
    }
  }

  function _renderResult() {
    const total = _data.length;
    const pct   = Math.round((_score / total) * 100);
    const emoji = pct === 100 ? '🏆' : pct >= 80 ? '🎉' : pct >= 60 ? '👍' : '📚';
    const msg   = pct === 100 ? 'Xuất sắc! Bạn trả lời đúng tất cả!'
                : pct >= 80   ? 'Rất tốt! Bạn nắm vững kiến thức này.'
                : pct >= 60   ? 'Khá! Hãy ôn lại những phần còn thiếu.'
                :               'Hãy đọc lại lý thuyết và thử lại nhé!';

    _container.innerHTML = `
      <div class="quiz-section">
        <div class="quiz-header">
          <div class="quiz-icon" aria-hidden="true">🧠</div>
          <div class="quiz-title">Kết Quả</div>
        </div>
        <div class="quiz-result">
          <div class="quiz-result-emoji">${emoji}</div>
          <div class="quiz-result-score gradient-text">${_score}/${total}</div>
          <div class="quiz-result-label">${pct}% chính xác – ${msg}</div>
          <div class="quiz-result-actions">
            <button class="btn btn-ghost" id="quiz-retry-btn">🔄 Làm lại</button>
          </div>
        </div>
      </div>`;

    _container.querySelector('#quiz-retry-btn')?.addEventListener('click', () => {
      init(_data, _container, _onComplete);
    });

    if (typeof _onComplete === 'function') _onComplete(_score, total);
  }

  return { init };
})();

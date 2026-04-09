/**
 * ShaderStudy – Progress Manager (global)
 */

window.ShaderStudy = window.ShaderStudy || {};

const STORAGE_KEY = 'shaderstudy_progress';

function _loadProgress() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
  catch { return {}; }
}

function _saveProgress(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

ShaderStudy.markLessonDone = function(lessonId) {
  const p = _loadProgress();
  p[lessonId] = { done: true, completedAt: Date.now() };
  _saveProgress(p);
};

ShaderStudy.isLessonDone = function(lessonId) {
  return !!_loadProgress()[lessonId]?.done;
};

ShaderStudy.getCompletedCount = function() {
  return Object.values(_loadProgress()).filter(v => v.done).length;
};

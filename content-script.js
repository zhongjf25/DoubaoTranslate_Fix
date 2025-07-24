/**
 * 阻止事件冒泡（核心：拦截顶层事件委托）
 */
function preventEventBubbling(el) {
  // 拦截 mousedown 事件（文本选择的起点）
  el.addEventListener('mousedown', (e) => {
    e.stopPropagation(); // 阻止事件向上传播
  }, true); // 捕获阶段执行

  // 拦截 click 事件（防止全选触发）
  el.addEventListener('click', (e) => {
    e.stopPropagation();
  }, true);
}

/**
 * 修改顶层事件处理（兜底方案）
 */
function overrideTopLevelEvents() {
  // 保存原事件处理函数
  const originalDocumentMousedown = document.onmousedown;
  const originalBodyClick = document.body.onclick;

  // 重写 document 的 mousedown 事件
  document.onmousedown = function(e) {
    // 若事件源是翻译文本，不执行原逻辑
    if (e.target.closest('.paragraph-JOTKXA.paragraph-element')) {
      return;
    }
    // 否则执行原逻辑
    if (originalDocumentMousedown) {
      originalDocumentMousedown(e);
    }
  };

  // 重写 body 的 click 事件
  document.body.onclick = function(e) {
    if (e.target.closest('.paragraph-JOTKXA.paragraph-element')) {
      return;
    }
    if (originalBodyClick) {
      originalBodyClick(e);
    }
  };
}

/**
 * 主修复逻辑（新增事件阻止和顶层事件修改）
 */
function fixDoubaoTranslateSelection() {
  const translateElements = getDoubaoTranslateElements();
  if (translateElements.length === 0) {
    console.log('未检测到豆包翻译文本元素');
    return;
  }
  
  translateElements.forEach(el => {
    fixDoubaoSelectStyle(el);
    removeDoubaoClickEvents(el);
    preventEventBubbling(el); // 新增：阻止事件冒泡
  });
  
  overrideTopLevelEvents(); // 新增：修改顶层事件处理
  console.log(`已修复 ${translateElements.length} 个豆包翻译文本元素`);
}
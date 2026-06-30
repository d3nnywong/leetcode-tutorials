/*
 * 轻量国际化（i18n）—— 负责「中 / EN」切换。
 *
 * 设计：题目标题与界面文案双语；深入的讲解正文保持中文（按需求范围）。
 *  - getLang() / setLang() / onLang()：读写当前语言、订阅变化
 *  - t(key)：取界面文案；applyStatic()：把带 data-i18n* 的元素填好
 *  - difficulty() / tag()：题目难度与标签的翻译
 * 语言选择存到 localStorage，刷新保持。
 */

const KEY = 'lc-lang'
const listeners = new Set()

export function getLang() {
  try {
    return localStorage.getItem(KEY) === 'en' ? 'en' : 'zh'
  } catch {
    return 'zh'
  }
}

export function setLang(lang) {
  const l = lang === 'en' ? 'en' : 'zh'
  try {
    localStorage.setItem(KEY, l)
  } catch {
    /* 隐私模式下忽略 */
  }
  document.documentElement.lang = l === 'en' ? 'en' : 'zh-CN'
  applyStatic()
  listeners.forEach((fn) => fn(l))
}

export function onLang(cb) {
  listeners.add(cb)
  return () => listeners.delete(cb)
}

/* ---------- 界面文案字典 ---------- */
const UI = {
  'nav.title': { zh: '题目', en: 'Problems' },
  'search.ph': { zh: '搜索题号 / 标题 / 标签…', en: 'Search id / title / tag…' },
  'search.empty': { zh: '没有匹配的题目 🔍', en: 'No matching problems 🔍' },
  'sidebar.foot': {
    zh: '本地学习项目 · Vite + 原生 JS',
    en: 'Local learning project · Vite + Vanilla JS',
  },
  'sidebar.soon': { zh: '待更新', en: 'Soon' },

  'hero.eyebrow': { zh: '从零开始 · 看得见的算法', en: 'From scratch · See it run' },
  'hero.title': {
    zh: '把 LeetCode 讲到<br />你真的能听懂',
    en: 'Make LeetCode<br />actually click',
  },
  'hero.lead': {
    zh: '不背模板，不跳步骤。每道题都从「人话」讲起，配上可以亲手点的动画，让你看见算法每一步到底在做什么。左侧可搜索题目，右下角可随手记笔记。',
    en: 'No memorizing templates, no skipped steps. Every problem starts in plain language, with a hands-on animation so you can see exactly what each step does. Search on the left, take notes on the bottom right.',
  },
  'list.title': { zh: '题目列表', en: 'Problems' },
  'toc.title': { zh: '本页目录', en: 'On this page' },
  'card.soon': { zh: '敬请期待', en: 'Coming soon' },
  'back.list': { zh: '← 返回题目列表', en: '← Back to problems' },

  'stmt.heading': { zh: '📋 原题描述', en: '📋 Problem statement' },
  'stmt.src': { zh: 'LeetCode 原题 ↗', en: 'View on LeetCode ↗' },
  'stmt.tip': {
    zh: '右上角 <strong>中 / EN</strong> 可切换官方中文 / 英文题面，下面的讲解保持中文。',
    en: 'Use <strong>中 / EN</strong> at the top right to switch the official statement. The walkthrough below stays in Chinese.',
  },
  'stmt.srcHref': {
    zh: 'https://leetcode.cn/problems/longest-common-subsequence/',
    en: 'https://leetcode.com/problems/longest-common-subsequence/',
  },

  'notes.fab': { zh: '笔记', en: 'Notes' },
  'notes.ph': {
    zh: '在这里记录你的思路、易错点、AC 心得、模板…\n内容会自动保存到本机浏览器。',
    en: 'Jot down your ideas, pitfalls, takeaways, templates…\nSaved automatically in this browser.',
  },
  'notes.export': { zh: '导出 .md', en: 'Export .md' },
  'notes.clear': { zh: '清空', en: 'Clear' },
  'notes.clearConfirm': { zh: '确认清空?', en: 'Confirm?' },
  'notes.close': { zh: '关闭笔记', en: 'Close notes' },
  'notes.empty': { zh: '尚无内容', en: 'Empty' },
  'notes.typing': { zh: '输入中…', en: 'Typing…' },
  'notes.saved': { zh: '已保存 ✓', en: 'Saved ✓' },
  'notes.unit': { zh: '字', en: 'chars' },
  'notes.failed': {
    zh: '⚠️ 保存失败（浏览器禁用了本地存储）',
    en: '⚠️ Save failed (local storage disabled)',
  },

  'code.copy': { zh: '复制', en: 'Copy' },
  'code.copied': { zh: '已复制 ✓', en: 'Copied ✓' },
  'code.failed': { zh: '复制失败', en: 'Failed' },
  'code.aria': { zh: '复制这段代码', en: 'Copy code to clipboard' },
}

export function t(key, lang = getLang()) {
  const entry = UI[key]
  if (!entry) return key
  return entry[lang] ?? entry.zh
}

/* 把页面上带 data-i18n* 的元素按当前语言填好 */
export function applyStatic(root = document) {
  const lang = getLang()
  root.querySelectorAll('[data-i18n]').forEach((el) => {
    el.textContent = t(el.dataset.i18n, lang)
  })
  root.querySelectorAll('[data-i18n-html]').forEach((el) => {
    el.innerHTML = t(el.dataset.i18nHtml, lang)
  })
  root.querySelectorAll('[data-i18n-ph]').forEach((el) => {
    el.setAttribute('placeholder', t(el.dataset.i18nPh, lang))
  })
  root.querySelectorAll('[data-i18n-aria]').forEach((el) => {
    el.setAttribute('aria-label', t(el.dataset.i18nAria, lang))
  })
  root.querySelectorAll('[data-i18n-href]').forEach((el) => {
    el.setAttribute('href', t(el.dataset.i18nHref, lang))
  })
}

/* ---------- 题目元信息翻译 ---------- */
const DIFFICULTY = {
  简单: 'Easy',
  中等: 'Medium',
  困难: 'Hard',
}

const TAGS = {
  动态规划: 'Dynamic Programming',
  字符串: 'String',
  数组: 'Array',
  哈希表: 'Hash Table',
  双指针: 'Two Pointers',
  二叉树: 'Binary Tree',
  回溯: 'Backtracking',
  贪心: 'Greedy',
  排序: 'Sorting',
  栈: 'Stack',
  队列: 'Queue',
  链表: 'Linked List',
  二分查找: 'Binary Search',
}

export function difficulty(zh, lang = getLang()) {
  return lang === 'en' ? (DIFFICULTY[zh] ?? zh) : zh
}

export function tag(zh, lang = getLang()) {
  return lang === 'en' ? (TAGS[zh] ?? zh) : zh
}

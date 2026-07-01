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
  滑动窗口: 'Sliding Window',
  递归: 'Recursion',
  分治: 'Divide and Conquer',
  堆: 'Heap',
  归并排序: 'Merge Sort',
  数学: 'Math',
  矩阵: 'Matrix',
  记忆化: 'Memoization',
  深度优先搜索: 'DFS',
  广度优先搜索: 'BFS',
  树: 'Tree',
  二叉搜索树: 'BST',
  并查集: 'Union Find',
  图: 'Graph',
  位运算: 'Bit Manipulation',
  拓扑排序: 'Topological Sort',
  设计: 'Design',
  字典树: 'Trie',
  前缀和: 'Prefix Sum',
  组合数学: 'Combinatorics',
  模拟: 'Simulation',
  数据流: 'Data Stream',
  字符串匹配: 'String Matching',
}

export function difficulty(zh, lang = getLang()) {
  return lang === 'en' ? (DIFFICULTY[zh] ?? zh) : zh
}

export function tag(zh, lang = getLang()) {
  return lang === 'en' ? (TAGS[zh] ?? zh) : zh
}

/* ---------- 专题分类（首页 / 侧边栏分组，顺序即展示顺序）---------- */
export const CATEGORIES = [
  {
    zh: '数组与哈希',
    en: 'Arrays & Hashing',
    descZh: '最基础的一类——数据排成一行（数组），或用「查号簿」式的哈希表做到瞬间查找。',
    descEn: 'The most basic group — data in a row (arrays), or instant lookup via a phone-book-like hash table.',
  },
  {
    zh: '双指针',
    en: 'Two Pointers',
    descZh: '用两个位置标记从两端或同向移动，往往一趟扫描就能解决问题。',
    descEn: 'Two position markers move from both ends or in tandem, often solving it in a single pass.',
  },
  {
    zh: '滑动窗口',
    en: 'Sliding Window',
    descZh: '维护一个可伸缩的「窗口」在字符串/数组上滑动，求满足条件的最优子段。',
    descEn: 'Slide a stretchable "window" across a string/array to find the best qualifying subsegment.',
  },
  {
    zh: '栈',
    en: 'Stack',
    descZh: '像一摞盘子，只能从顶上放和取（后进先出），适合处理「就近配对 / 撤销」。',
    descEn: 'Like a stack of plates — add and remove only at the top (LIFO); great for nearest-match or undo.',
  },
  {
    zh: '二分查找',
    en: 'Binary Search',
    descZh: '在有序数据里每次砍掉一半范围地猜，像猜数字游戏，极快。',
    descEn: 'In sorted data, halve the search range with each guess — like the number-guessing game, very fast.',
  },
  {
    zh: '链表',
    en: 'Linked List',
    descZh: '一串珠子，每颗攥着下一颗的位置；练的是指针的穿针引线。',
    descEn: "A string of beads, each holding the next one's location; it's all about pointer wiring.",
  },
  {
    zh: '树',
    en: 'Trees',
    descZh: '像家谱，一个节点下面挂着子节点；大量问题靠「递归地处理左右子树」。',
    descEn: 'Like a family tree, each node hanging children; many problems recurse over the left and right subtrees.',
  },
  {
    zh: '字典树',
    en: 'Tries',
    descZh: '把很多单词按字母一层层挂成一棵树，公共前缀共用一条路，查前缀飞快。',
    descEn: 'Hang many words letter by letter into a tree; shared prefixes share a path, making prefix lookup fast.',
  },
  {
    zh: '堆',
    en: 'Heap / Priority Queue',
    descZh: '一个能随时快速取出最大或最小值的「桶」，完全不用把所有数排序。',
    descEn: 'A "bucket" that instantly hands you the largest or smallest value without sorting everything.',
  },
  {
    zh: '回溯',
    en: 'Backtracking',
    descZh: '像走迷宫，一条路走到黑，不行就退回上个岔口换一条，穷举所有可能。',
    descEn: 'Like a maze — go until stuck, back up to the last fork, try another branch; enumerate every option.',
  },
  {
    zh: '图',
    en: 'Graphs',
    descZh: '一堆点和连着它们的线（像地图上的城市与公路），用 DFS/BFS 遍历。',
    descEn: 'Dots and the lines connecting them (like cities and roads on a map), traversed with DFS/BFS.',
  },
  {
    zh: '高级图论',
    en: 'Advanced Graphs',
    descZh: '图的进阶玩法，比如按依赖关系排出先后顺序（拓扑排序）。',
    descEn: 'Advanced graph techniques, such as ordering things by their dependencies (topological sort).',
  },
  {
    zh: '一维 DP',
    en: '1-D DP',
    descZh: '动态规划：把大问题拆成小问题，答案记在一排格子里、每个只算一次。',
    descEn: 'Dynamic programming: break a big problem into small ones and cache each answer in a row of cells.',
  },
  {
    zh: '二维 DP',
    en: '2-D DP',
    descZh: '动态规划的进阶，答案记在一张二维表里（常见于两个序列或网格）。',
    descEn: 'DP on a 2-D table — common when comparing two sequences or walking a grid.',
  },
  {
    zh: '贪心',
    en: 'Greedy',
    descZh: '每一步都只挑「眼前最划算」的选择、绝不回头，却正好能得到最优解。',
    descEn: 'At each step pick the locally best option and never look back — yet still reach the optimum.',
  },
  {
    zh: '区间',
    en: 'Intervals',
    descZh: '处理一段段「开始-结束」的区间（如会议时段），常靠先排序再扫描。',
    descEn: 'Handle "start–end" ranges (like meeting slots), usually by sorting first and then sweeping.',
  },
  {
    zh: '数学与几何',
    en: 'Math & Geometry',
    descZh: '靠数字规律，或在网格/矩阵上按几何方式操作，少套路、多观察。',
    descEn: 'Number patterns, or geometric moves on a grid/matrix — more observation than templates.',
  },
  {
    zh: '位运算',
    en: 'Bit Manipulation',
    descZh: '数字在计算机里都是 0/1 组成的，直接逐位操作，又快又省。',
    descEn: 'Numbers are made of 0s and 1s inside a computer; operate bit by bit — fast and lean.',
  },
]

export function categoryName(zh, lang = getLang()) {
  const c = CATEGORIES.find((x) => x.zh === zh)
  return c ? (lang === 'en' ? c.en : c.zh) : zh
}

export function categoryDesc(zh, lang = getLang()) {
  const c = CATEGORIES.find((x) => x.zh === zh)
  return c ? (lang === 'en' ? c.descEn : c.descZh) : ''
}

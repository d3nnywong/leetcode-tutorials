/*
 * 题目清单。以后新增一道题，只要在这个数组里加一条记录，
 * 再建一个对应的页面文件夹即可，首页会自动列出来。
 */
export const problems = [
  {
    id: 1,
    slug: '1-two-sum',
    title: '两数之和',
    titleEn: 'Two Sum',
    difficulty: '简单',
    tags: ['数组', '哈希表'],
    summary:
      '在数组里找出和为 target 的两个数，返回下标。用哈希表「边走边记」，把暴力两层循环压成一遍 O(n)——空间换时间的经典起点。',
    summaryEn:
      'Find the two numbers in an array that add up to target and return their indices. A hash map turns the brute-force double loop into a single O(n) pass — the classic "trade space for time" starter.',
    url: 'src/problems/1-two-sum/index.html',
    status: 'done',
  },
  {
    id: 11,
    slug: '11-container-with-most-water',
    title: '盛最多水的容器',
    titleEn: 'Container With Most Water',
    difficulty: '中等',
    tags: ['贪心', '数组', '双指针'],
    summary:
      '一排竖线里选两条装最多的水。面积由矮边决定，双指针每次只移矮的那根，扫一遍 O(n)。双指针「确定性排除」论证的最佳一课。',
    summaryEn:
      'Pick two of the vertical lines that hold the most water. Area is capped by the shorter line, so two pointers always move the shorter one inward — one O(n) pass. The cleanest lesson in the two-pointer pruning argument.',
    url: 'src/problems/11-container-with-most-water/index.html',
    status: 'done',
  },
  {
    id: 139,
    slug: '139-word-break',
    title: '单词拆分',
    titleEn: 'Word Break',
    difficulty: '中等',
    tags: ['动态规划', '字符串', '哈希表'],
    summary:
      '给一个字符串和一个词典，问能不能把字符串切成若干段、每段都是词典里的词。经典的一维动态规划，从「暴力试切」一步步走到「记账式 DP」。',
    summaryEn:
      'Given a string and a dictionary, decide whether the string can be segmented into dictionary words. A classic 1-D dynamic programming problem — from brute-force "try every cut" to a tidy bookkeeping DP.',
    url: 'src/problems/139-word-break/index.html',
    status: 'done', // done | planned
  },
  {
    id: 1143,
    slug: '1143-lcs',
    title: '最长公共子序列',
    titleEn: 'Longest Common Subsequence',
    difficulty: '中等',
    tags: ['动态规划', '字符串'],
    summary:
      '给两个字符串，求它们最长的「公共子序列」长度。经典的二维动态规划入门题，零基础理解 DP 的最佳起点。',
    summaryEn:
      'Given two strings, find the length of their longest common subsequence. A classic 2-D dynamic programming starter — the best place to truly grasp DP from zero.',
    url: 'src/problems/1143-lcs/index.html',
    status: 'done', // done | planned
  },
]

export const difficultyColor = {
  简单: 'oklch(60% 0.15 145)',
  中等: 'oklch(70% 0.15 60)',
  困难: 'oklch(60% 0.2 25)',
}

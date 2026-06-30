/*
 * 题目清单。以后新增一道题，只要在这个数组里加一条记录，
 * 再建一个对应的页面文件夹即可，首页会自动列出来。
 */
export const problems = [
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

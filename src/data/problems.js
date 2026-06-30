/*
 * 题目清单。以后新增一道题，只要在这个数组里加一条记录，
 * 再建一个对应的页面文件夹即可，首页会自动列出来。
 */
export const problems = [
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

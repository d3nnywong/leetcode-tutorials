/* 212. 单词搜索 II 官方题面（leetcode.cn / .com，文字与示例与官方一致，结构重排）。 */

export const src = {
  zh: 'https://leetcode.cn/problems/word-search-ii/',
  en: 'https://leetcode.com/problems/word-search-ii/',
}

export const statement = {
  zh: `
    <p>给定一个 <code>m x n</code> 二维字符网格 <code>board</code> 和一个单词（字符串）列表
    <code>words</code>，返回所有二维网格上的单词。</p>

    <p>单词必须按照字母顺序，通过 <strong>相邻的单元格</strong> 内的字母构成，其中“相邻”单元格
    是那些水平相邻或垂直相邻的单元格。同一个单元格内的字母在一个单词中不允许被重复使用。</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">示例 1</span>
        <div class="stmt-kv"><span>输入</span><code>board = [["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]], words = ["oath","pea","eat","rain"]</code></div>
        <div class="stmt-kv"><span>输出</span><code>["eat","oath"]</code></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">示例 2</span>
        <div class="stmt-kv"><span>输入</span><code>board = [["a","b"],["c","d"]], words = ["abcb"]</code></div>
        <div class="stmt-kv"><span>输出</span><code>[]</code></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>提示：</strong>
      <ul>
        <li><code>m == board.length</code></li>
        <li><code>n == board[i].length</code></li>
        <li><code>1 &lt;= m, n &lt;= 12</code></li>
        <li><code>board[i][j]</code> 是一个小写英文字母</li>
        <li><code>1 &lt;= words.length &lt;= 3 * 10^4</code></li>
        <li><code>1 &lt;= words[i].length &lt;= 10</code></li>
        <li><code>words[i]</code> 由小写英文字母组成</li>
        <li><strong>words 中的所有字符串互不相同。</strong></li>
      </ul>
    </div>
  `,

  en: `
    <p>Given an <code>m x n</code> <code>board</code> of characters and a list of strings
    <code>words</code>, return <em>all words on the board</em>.</p>

    <p>Each word must be constructed from letters of sequentially adjacent cells, where
    <strong>adjacent cells</strong> are horizontally or vertically neighboring. The same letter
    cell may not be used more than once in a word.</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">Example 1</span>
        <div class="stmt-kv"><span>Input</span><code>board = [["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]], words = ["oath","pea","eat","rain"]</code></div>
        <div class="stmt-kv"><span>Output</span><code>["eat","oath"]</code></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">Example 2</span>
        <div class="stmt-kv"><span>Input</span><code>board = [["a","b"],["c","d"]], words = ["abcb"]</code></div>
        <div class="stmt-kv"><span>Output</span><code>[]</code></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>Constraints:</strong>
      <ul>
        <li><code>m == board.length</code></li>
        <li><code>n == board[i].length</code></li>
        <li><code>1 &lt;= m, n &lt;= 12</code></li>
        <li><code>board[i][j]</code> is a lowercase English letter.</li>
        <li><code>1 &lt;= words.length &lt;= 3 * 10^4</code></li>
        <li><code>1 &lt;= words[i].length &lt;= 10</code></li>
        <li><code>words[i]</code> consists of lowercase English letters.</li>
        <li><strong>All the strings of <code>words</code> are unique.</strong></li>
      </ul>
    </div>
  `,
}

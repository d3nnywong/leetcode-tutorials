/* 79. 单词搜索 官方题面（leetcode.cn / .com，文字与示例与官方一致，结构重排）。 */

export const src = {
  zh: 'https://leetcode.cn/problems/word-search/',
  en: 'https://leetcode.com/problems/word-search/',
}

export const statement = {
  zh: `
    <p>给定一个 <code>m x n</code> 二维字符网格 <code>board</code> 和一个字符串单词 <code>word</code>。
    如果 <code>word</code> 存在于网格中，返回 <code>true</code> ；否则，返回 <code>false</code> 。</p>

    <p>单词必须按照字母顺序，通过相邻的单元格内的字母构成，其中“相邻”单元格是那些水平相邻或垂直相邻的单元格。
    同一个单元格内的字母不允许被重复使用。</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">示例 1</span>
        <div class="stmt-kv"><span>输入</span><code>board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"</code></div>
        <div class="stmt-kv"><span>输出</span><code>true</code></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">示例 2</span>
        <div class="stmt-kv"><span>输入</span><code>board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "SEE"</code></div>
        <div class="stmt-kv"><span>输出</span><code>true</code></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">示例 3</span>
        <div class="stmt-kv"><span>输入</span><code>board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCB"</code></div>
        <div class="stmt-kv"><span>输出</span><code>false</code></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>提示：</strong>
      <ul>
        <li><code>m == board.length</code></li>
        <li><code>n = board[i].length</code></li>
        <li><code>1 &lt;= m, n &lt;= 6</code></li>
        <li><code>1 &lt;= word.length &lt;= 15</code></li>
        <li><code>board</code> 和 <code>word</code> 仅由大小写英文字母组成</li>
      </ul>
      <p class="dp-step__hint">进阶：你可以使用搜索剪枝的技术来优化解决方案，使其在 <code>board</code> 更大的情况下可以更快解决问题？</p>
    </div>
  `,

  en: `
    <p>Given an <code>m x n</code> grid of characters <code>board</code> and a string <code>word</code>,
    return <code>true</code> if <code>word</code> exists in the grid.</p>

    <p>The word can be constructed from letters of sequentially adjacent cells, where adjacent cells
    are horizontally or vertically neighboring. The same letter cell may not be used more than once.</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">Example 1</span>
        <div class="stmt-kv"><span>Input</span><code>board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"</code></div>
        <div class="stmt-kv"><span>Output</span><code>true</code></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">Example 2</span>
        <div class="stmt-kv"><span>Input</span><code>board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "SEE"</code></div>
        <div class="stmt-kv"><span>Output</span><code>true</code></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">Example 3</span>
        <div class="stmt-kv"><span>Input</span><code>board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCB"</code></div>
        <div class="stmt-kv"><span>Output</span><code>false</code></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>Constraints:</strong>
      <ul>
        <li><code>m == board.length</code></li>
        <li><code>n = board[i].length</code></li>
        <li><code>1 &lt;= m, n &lt;= 6</code></li>
        <li><code>1 &lt;= word.length &lt;= 15</code></li>
        <li><code>board</code> and <code>word</code> consists of only lowercase and uppercase English letters.</li>
      </ul>
      <p class="dp-step__hint">Follow up: Could you use search pruning to make your solution faster with a larger <code>board</code>?</p>
    </div>
  `,
}

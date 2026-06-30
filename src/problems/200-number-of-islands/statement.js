/* 200. 岛屿数量 官方题面（leetcode.cn / .com，文字与示例与官方一致，结构重排）。 */

export const src = {
  zh: 'https://leetcode.cn/problems/number-of-islands/',
  en: 'https://leetcode.com/problems/number-of-islands/',
}

export const statement = {
  zh: `
    <p>给你一个由 <code>'1'</code>（陆地）和 <code>'0'</code>（水）组成的二维网格，请你计算
    网格中<strong>岛屿</strong>的数量。</p>

    <p>岛屿总是被水包围，并且每座岛屿只能由水平方向和/或竖直方向上相邻的陆地连接形成。</p>

    <p>此外，你可以假设该网格的四条边均被水包围。</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">示例 1</span>
        <div class="stmt-kv"><span>输入</span><code>grid = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]</code></div>
        <div class="stmt-kv"><span>输出</span><code>1</code></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">示例 2</span>
        <div class="stmt-kv"><span>输入</span><code>grid = [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]</code></div>
        <div class="stmt-kv"><span>输出</span><code>3</code></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>提示：</strong>
      <ul>
        <li><code>m == grid.length</code></li>
        <li><code>n == grid[i].length</code></li>
        <li><code>1 &lt;= m, n &lt;= 300</code></li>
        <li><code>grid[i][j]</code> 的值为 <code>'0'</code> 或 <code>'1'</code></li>
      </ul>
    </div>
  `,

  en: `
    <p>Given an <code>m x n</code> 2D binary grid <code>grid</code> which represents a map of
    <code>'1'</code>s (land) and <code>'0'</code>s (water), return <em>the number of islands</em>.</p>

    <p>An <strong>island</strong> is surrounded by water and is formed by connecting adjacent
    lands horizontally or vertically. You may assume all four edges of the grid are all
    surrounded by water.</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">Example 1</span>
        <div class="stmt-kv"><span>Input</span><code>grid = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]</code></div>
        <div class="stmt-kv"><span>Output</span><code>1</code></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">Example 2</span>
        <div class="stmt-kv"><span>Input</span><code>grid = [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]</code></div>
        <div class="stmt-kv"><span>Output</span><code>3</code></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>Constraints:</strong>
      <ul>
        <li><code>m == grid.length</code></li>
        <li><code>n == grid[i].length</code></li>
        <li><code>1 &lt;= m, n &lt;= 300</code></li>
        <li><code>grid[i][j]</code> is <code>'0'</code> or <code>'1'</code>.</li>
      </ul>
    </div>
  `,
}

/* 54. 螺旋矩阵 官方题面（leetcode.cn / .com，文字与示例与官方一致，结构重排）。 */

export const src = {
  zh: 'https://leetcode.cn/problems/spiral-matrix/',
  en: 'https://leetcode.com/problems/spiral-matrix/',
}

export const statement = {
  zh: `
    <p>给你一个 <code>m</code> 行 <code>n</code> 列的矩阵 <code>matrix</code>，请按照
    <strong>顺时针螺旋顺序</strong>，返回矩阵中的所有元素。</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">示例 1</span>
        <div class="stmt-kv"><span>输入</span><code>matrix = [[1,2,3],[4,5,6],[7,8,9]]</code></div>
        <div class="stmt-kv"><span>输出</span><code>[1,2,3,6,9,8,7,4,5]</code></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">示例 2</span>
        <div class="stmt-kv"><span>输入</span><code>matrix = [[1,2,3,4],[5,6,7,8],[9,10,11,12]]</code></div>
        <div class="stmt-kv"><span>输出</span><code>[1,2,3,4,8,12,11,10,9,5,6,7]</code></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>提示：</strong>
      <ul>
        <li><code>m == matrix.length</code></li>
        <li><code>n == matrix[i].length</code></li>
        <li><code>1 &lt;= m, n &lt;= 10</code></li>
        <li><code>-100 &lt;= matrix[i][j] &lt;= 100</code></li>
      </ul>
    </div>
  `,

  en: `
    <p>Given an <code>m x n</code> <code>matrix</code>, return <em>all elements of the</em>
    <code>matrix</code> <em>in spiral order</em>.</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">Example 1</span>
        <div class="stmt-kv"><span>Input</span><code>matrix = [[1,2,3],[4,5,6],[7,8,9]]</code></div>
        <div class="stmt-kv"><span>Output</span><code>[1,2,3,6,9,8,7,4,5]</code></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">Example 2</span>
        <div class="stmt-kv"><span>Input</span><code>matrix = [[1,2,3,4],[5,6,7,8],[9,10,11,12]]</code></div>
        <div class="stmt-kv"><span>Output</span><code>[1,2,3,4,8,12,11,10,9,5,6,7]</code></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>Constraints:</strong>
      <ul>
        <li><code>m == matrix.length</code></li>
        <li><code>n == matrix[i].length</code></li>
        <li><code>1 &lt;= m, n &lt;= 10</code></li>
        <li><code>-100 &lt;= matrix[i][j] &lt;= 100</code></li>
      </ul>
    </div>
  `,
}

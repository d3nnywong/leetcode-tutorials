/* 73. 矩阵置零 官方题面（leetcode.cn / .com，文字与示例与官方一致，结构重排）。 */

export const src = {
  zh: 'https://leetcode.cn/problems/set-matrix-zeroes/',
  en: 'https://leetcode.com/problems/set-matrix-zeroes/',
}

export const statement = {
  zh: `
    <p>给定一个 <code>m x n</code> 的矩阵，如果一个元素为 <strong>0</strong>，则将其所在行和列的所有
    元素都设为 <strong>0</strong>。请使用<strong>原地</strong>算法。</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">示例 1</span>
        <div class="stmt-kv"><span>输入</span><code>matrix = [[1,1,1],[1,0,1],[1,1,1]]</code></div>
        <div class="stmt-kv"><span>输出</span><code>[[1,0,1],[0,0,0],[1,0,1]]</code></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">示例 2</span>
        <div class="stmt-kv"><span>输入</span><code>matrix = [[0,1,2,0],[3,4,5,2],[1,3,1,5]]</code></div>
        <div class="stmt-kv"><span>输出</span><code>[[0,0,0,0],[0,4,5,0],[0,3,1,0]]</code></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>提示：</strong>
      <ul>
        <li><code>m == matrix.length</code></li>
        <li><code>n == matrix[0].length</code></li>
        <li><code>1 &lt;= m, n &lt;= 200</code></li>
        <li><code>-2^31 &lt;= matrix[i][j] &lt;= 2^31 - 1</code></li>
      </ul>
      <p class="dp-step__hint">
        进阶：一个直观的解决方案是使用 <code>O(mn)</code> 的额外空间，但这并不是一个好的解决方案。
        一个简单的改进方案是使用 <code>O(m + n)</code> 的额外空间，但这仍然不是最好的解决方案。
        你能想出一个仅使用<strong>常量空间</strong>的解决方案吗？
      </p>
    </div>
  `,

  en: `
    <p>Given an <code>m x n</code> integer matrix <code>matrix</code>, if an element is
    <code>0</code>, set its entire row and column to <code>0</code>'s.</p>

    <p>You must do it <strong>in place</strong>.</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">Example 1</span>
        <div class="stmt-kv"><span>Input</span><code>matrix = [[1,1,1],[1,0,1],[1,1,1]]</code></div>
        <div class="stmt-kv"><span>Output</span><code>[[1,0,1],[0,0,0],[1,0,1]]</code></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">Example 2</span>
        <div class="stmt-kv"><span>Input</span><code>matrix = [[0,1,2,0],[3,4,5,2],[1,3,1,5]]</code></div>
        <div class="stmt-kv"><span>Output</span><code>[[0,0,0,0],[0,4,5,0],[0,3,1,0]]</code></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>Constraints:</strong>
      <ul>
        <li><code>m == matrix.length</code></li>
        <li><code>n == matrix[0].length</code></li>
        <li><code>1 &lt;= m, n &lt;= 200</code></li>
        <li><code>-2^31 &lt;= matrix[i][j] &lt;= 2^31 - 1</code></li>
      </ul>
      <p class="dp-step__hint">
        Follow up: A straightforward solution using <code>O(mn)</code> space is probably a bad idea.
        A simple improvement uses <code>O(m + n)</code> space, but still not the best solution.
        Could you devise a <strong>constant space</strong> solution?
      </p>
    </div>
  `,
}

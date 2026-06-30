/* 48. 旋转图像 官方题面（leetcode.cn / .com，文字与示例与官方一致，结构重排）。 */

export const src = {
  zh: 'https://leetcode.cn/problems/rotate-image/',
  en: 'https://leetcode.com/problems/rotate-image/',
}

export const statement = {
  zh: `
    <p>给定一个 <em>n</em> × <em>n</em> 的二维矩阵 <code>matrix</code> 表示一个图像。请你将图像
    <strong>顺时针旋转 90 度</strong>。</p>

    <p>你必须在<strong>原地</strong>旋转图像，这意味着你需要直接修改输入的二维矩阵。
    <strong>请不要</strong>使用另一个矩阵来旋转图像。</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">示例 1</span>
        <div class="stmt-kv"><span>输入</span><code>matrix = [[1,2,3],[4,5,6],[7,8,9]]</code></div>
        <div class="stmt-kv"><span>输出</span><code>[[7,4,1],[8,5,2],[9,6,3]]</code></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">示例 2</span>
        <div class="stmt-kv"><span>输入</span><code>matrix = [[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]]</code></div>
        <div class="stmt-kv"><span>输出</span><code>[[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]]</code></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>提示：</strong>
      <ul>
        <li><code>n == matrix.length == matrix[i].length</code></li>
        <li><code>1 &lt;= n &lt;= 20</code></li>
        <li><code>-1000 &lt;= matrix[i][j] &lt;= 1000</code></li>
      </ul>
    </div>
  `,

  en: `
    <p>You are given an <em>n</em> x <em>n</em> 2D <code>matrix</code> representing an image,
    rotate the image by <strong>90</strong> degrees (clockwise).</p>

    <p>You have to rotate the image <strong>in-place</strong>, which means you have to modify
    the input 2D matrix directly. <strong>DO NOT</strong> allocate another 2D matrix and do the
    rotation.</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">Example 1</span>
        <div class="stmt-kv"><span>Input</span><code>matrix = [[1,2,3],[4,5,6],[7,8,9]]</code></div>
        <div class="stmt-kv"><span>Output</span><code>[[7,4,1],[8,5,2],[9,6,3]]</code></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">Example 2</span>
        <div class="stmt-kv"><span>Input</span><code>matrix = [[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]]</code></div>
        <div class="stmt-kv"><span>Output</span><code>[[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]]</code></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>Constraints:</strong>
      <ul>
        <li><code>n == matrix.length == matrix[i].length</code></li>
        <li><code>1 &lt;= n &lt;= 20</code></li>
        <li><code>-1000 &lt;= matrix[i][j] &lt;= 1000</code></li>
      </ul>
    </div>
  `,
}

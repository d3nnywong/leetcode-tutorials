/* 62. 不同路径 官方题面（leetcode.cn / .com，文字与示例与官方一致，结构重排）。 */

export const src = {
  zh: 'https://leetcode.cn/problems/unique-paths/',
  en: 'https://leetcode.com/problems/unique-paths/',
}

export const statement = {
  zh: `
    <p>一个机器人位于一个 <code>m x n</code> 网格的左上角（起始点在下图中标记为 “Start” ）。</p>

    <p>机器人每次只能向下或者向右移动一步。机器人试图达到网格的右下角（在下图中标记为 “Finish” ）。</p>

    <p>问总共有多少条不同的路径？</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">示例 1</span>
        <div class="stmt-kv"><span>输入</span><code>m = 3, n = 7</code></div>
        <div class="stmt-kv"><span>输出</span><code>28</code></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">示例 2</span>
        <div class="stmt-kv"><span>输入</span><code>m = 3, n = 2</code></div>
        <div class="stmt-kv"><span>输出</span><code>3</code></div>
        <div class="stmt-kv"><span>解释</span><span>从左上角开始，总共有 3 条路径可以到达右下角：
          1. 向右 -&gt; 向下 -&gt; 向下；
          2. 向下 -&gt; 向下 -&gt; 向右；
          3. 向下 -&gt; 向右 -&gt; 向下。</span></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">示例 3</span>
        <div class="stmt-kv"><span>输入</span><code>m = 7, n = 3</code></div>
        <div class="stmt-kv"><span>输出</span><code>28</code></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">示例 4</span>
        <div class="stmt-kv"><span>输入</span><code>m = 3, n = 3</code></div>
        <div class="stmt-kv"><span>输出</span><code>6</code></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>提示：</strong>
      <ul>
        <li><code>1 &lt;= m, n &lt;= 100</code></li>
        <li>题目数据保证答案小于等于 <code>2 * 10^9</code></li>
      </ul>
    </div>
  `,

  en: `
    <p>There is a robot on an <code>m x n</code> grid. The robot is initially located at the
    <strong>top-left corner</strong> (i.e., <code>grid[0][0]</code>). The robot tries to move to the
    <strong>bottom-right corner</strong> (i.e., <code>grid[m - 1][n - 1]</code>). The robot can only
    move either down or right at any point in time.</p>

    <p>Given the two integers <code>m</code> and <code>n</code>, return <em>the number of possible
    unique paths that the robot can take to reach the bottom-right corner</em>.</p>

    <p>The test cases are generated so that the answer will be less than or equal to <code>2 * 10^9</code>.</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">Example 1</span>
        <div class="stmt-kv"><span>Input</span><code>m = 3, n = 7</code></div>
        <div class="stmt-kv"><span>Output</span><code>28</code></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">Example 2</span>
        <div class="stmt-kv"><span>Input</span><code>m = 3, n = 2</code></div>
        <div class="stmt-kv"><span>Output</span><code>3</code></div>
        <div class="stmt-kv"><span>Explanation</span><span>From the top-left corner, there are a total of
          3 ways to reach the bottom-right corner:
          1. Right -&gt; Down -&gt; Down
          2. Down -&gt; Down -&gt; Right
          3. Down -&gt; Right -&gt; Down</span></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">Example 3</span>
        <div class="stmt-kv"><span>Input</span><code>m = 7, n = 3</code></div>
        <div class="stmt-kv"><span>Output</span><code>28</code></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">Example 4</span>
        <div class="stmt-kv"><span>Input</span><code>m = 3, n = 3</code></div>
        <div class="stmt-kv"><span>Output</span><code>6</code></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>Constraints:</strong>
      <ul>
        <li><code>1 &lt;= m, n &lt;= 100</code></li>
        <li>The answer is guaranteed to be less than or equal to <code>2 * 10^9</code>.</li>
      </ul>
    </div>
  `,
}

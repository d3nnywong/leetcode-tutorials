/* 70. 爬楼梯 官方题面（leetcode.cn / .com，文字与示例与官方一致，结构重排）。 */

export const src = {
  zh: 'https://leetcode.cn/problems/climbing-stairs/',
  en: 'https://leetcode.com/problems/climbing-stairs/',
}

export const statement = {
  zh: `
    <p>假设你正在爬楼梯。需要 <code>n</code> 阶你才能到达楼顶。</p>

    <p>每次你可以爬 <code>1</code> 或 <code>2</code> 个台阶。你有多少种不同的方法可以爬到楼顶呢？</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">示例 1</span>
        <div class="stmt-kv"><span>输入</span><code>n = 2</code></div>
        <div class="stmt-kv"><span>输出</span><code>2</code></div>
        <div class="stmt-kv"><span>解释</span><span>有两种方法可以爬到楼顶。<br/>1. 1 阶 + 1 阶<br/>2. 2 阶</span></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">示例 2</span>
        <div class="stmt-kv"><span>输入</span><code>n = 3</code></div>
        <div class="stmt-kv"><span>输出</span><code>3</code></div>
        <div class="stmt-kv"><span>解释</span><span>有三种方法可以爬到楼顶。<br/>1. 1 阶 + 1 阶 + 1 阶<br/>2. 1 阶 + 2 阶<br/>3. 2 阶 + 1 阶</span></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>提示：</strong>
      <ul>
        <li><code>1 &lt;= n &lt;= 45</code></li>
      </ul>
    </div>
  `,

  en: `
    <p>You are climbing a staircase. It takes <code>n</code> steps to reach the top.</p>

    <p>Each time you can either climb <code>1</code> or <code>2</code> steps. In how many distinct
    ways can you climb to the top?</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">Example 1</span>
        <div class="stmt-kv"><span>Input</span><code>n = 2</code></div>
        <div class="stmt-kv"><span>Output</span><code>2</code></div>
        <div class="stmt-kv"><span>Explanation</span><span>There are two ways to climb to the top.<br/>1. 1 step + 1 step<br/>2. 2 steps</span></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">Example 2</span>
        <div class="stmt-kv"><span>Input</span><code>n = 3</code></div>
        <div class="stmt-kv"><span>Output</span><code>3</code></div>
        <div class="stmt-kv"><span>Explanation</span><span>There are three ways to climb to the top.<br/>1. 1 step + 1 step + 1 step<br/>2. 1 step + 2 steps<br/>3. 2 steps + 1 step</span></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>Constraints:</strong>
      <ul>
        <li><code>1 &lt;= n &lt;= 45</code></li>
      </ul>
    </div>
  `,
}

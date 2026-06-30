/* 191. 位1的个数 官方题面（leetcode.cn / .com，文字与示例与官方一致，结构重排）。 */

export const src = {
  zh: 'https://leetcode.cn/problems/number-of-1-bits/',
  en: 'https://leetcode.com/problems/number-of-1-bits/',
}

export const statement = {
  zh: `
    <p>给定一个正整数 <code>n</code>，编写一个函数，获取一个正整数的二进制形式并返回其二进制
    表达式中<strong>设置位</strong>（即二进制位为 <code>1</code> 的位）的个数，也被称为
    「<strong>汉明重量</strong>」。</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">示例 1</span>
        <div class="stmt-kv"><span>输入</span><code>n = 11</code></div>
        <div class="stmt-kv"><span>输出</span><code>3</code></div>
        <div class="stmt-kv"><span>解释</span><span>输入的二进制串 <code>1011</code> 中，共有 3 个设置位。</span></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">示例 2</span>
        <div class="stmt-kv"><span>输入</span><code>n = 128</code></div>
        <div class="stmt-kv"><span>输出</span><code>1</code></div>
        <div class="stmt-kv"><span>解释</span><span>输入的二进制串 <code>10000000</code> 中，共有 1 个设置位。</span></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">示例 3</span>
        <div class="stmt-kv"><span>输入</span><code>n = 2147483645</code></div>
        <div class="stmt-kv"><span>输出</span><code>30</code></div>
        <div class="stmt-kv"><span>解释</span><span>输入的二进制串 <code>1111111111111111111111111111101</code> 中，共有 30 个设置位。</span></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>提示：</strong>
      <ul>
        <li><code>1 &lt;= n &lt;= 2^31 - 1</code></li>
      </ul>
      <p class="dp-step__hint">进阶：如果多次调用这个函数，你将如何优化你的算法？</p>
    </div>
  `,

  en: `
    <p>Given a positive integer <code>n</code>, write a function that returns the number of
    <strong>set bits</strong> in its binary representation (also known as the
    <strong>Hamming weight</strong>).</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">Example 1</span>
        <div class="stmt-kv"><span>Input</span><code>n = 11</code></div>
        <div class="stmt-kv"><span>Output</span><code>3</code></div>
        <div class="stmt-kv"><span>Explanation</span><span>The input binary string <code>1011</code> has a total of three set bits.</span></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">Example 2</span>
        <div class="stmt-kv"><span>Input</span><code>n = 128</code></div>
        <div class="stmt-kv"><span>Output</span><code>1</code></div>
        <div class="stmt-kv"><span>Explanation</span><span>The input binary string <code>10000000</code> has a total of one set bit.</span></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">Example 3</span>
        <div class="stmt-kv"><span>Input</span><code>n = 2147483645</code></div>
        <div class="stmt-kv"><span>Output</span><code>30</code></div>
        <div class="stmt-kv"><span>Explanation</span><span>The input binary string <code>1111111111111111111111111111101</code> has a total of thirty set bits.</span></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>Constraints:</strong>
      <ul>
        <li><code>1 &lt;= n &lt;= 2^31 - 1</code></li>
      </ul>
      <p class="dp-step__hint">Follow-up: If this function is called many times, how would you optimize your algorithm?</p>
    </div>
  `,
}

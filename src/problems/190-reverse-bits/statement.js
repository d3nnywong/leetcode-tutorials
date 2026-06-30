/* 190. 颠倒二进制位 官方题面（leetcode.cn / .com，文字与示例与官方一致，结构重排）。 */

export const src = {
  zh: 'https://leetcode.cn/problems/reverse-bits/',
  en: 'https://leetcode.com/problems/reverse-bits/',
}

export const statement = {
  zh: `
    <p>颠倒给定的 32 位有符号整数的二进制位。</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">示例 1</span>
        <div class="stmt-kv"><span>输入</span><code>n = 43261596</code></div>
        <div class="stmt-kv"><span>输出</span><code>964176192</code></div>
        <div class="stmt-kv">
          <span>解释</span>
          <span>43261596 的 32 位二进制是 <code>00000010100101000001111010011100</code>，
          把这串二进制位整体左右翻转，得到 <code>00111001011110000010100101000000</code>，
          也就是十进制的 964176192。</span>
        </div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">示例 2</span>
        <div class="stmt-kv"><span>输入</span><code>n = 2147483644</code></div>
        <div class="stmt-kv"><span>输出</span><code>1073741822</code></div>
        <div class="stmt-kv">
          <span>解释</span>
          <span>2147483644 的 32 位二进制是 <code>01111111111111111111111111111100</code>，
          翻转后得到 <code>00111111111111111111111111111110</code>，
          也就是十进制的 1073741822。</span>
        </div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>提示：</strong>
      <ul>
        <li><code>0 &lt;= n &lt;= 2^31 - 2</code></li>
        <li><code>n</code> 为偶数</li>
      </ul>
      <p class="dp-step__hint">进阶：如果多次调用这个函数，你将如何优化你的算法？</p>
    </div>
  `,

  en: `
    <p>Reverse bits of a given 32 bits signed integer.</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">Example 1</span>
        <div class="stmt-kv"><span>Input</span><code>n = 43261596</code></div>
        <div class="stmt-kv"><span>Output</span><code>964176192</code></div>
        <div class="stmt-kv">
          <span>Explanation</span>
          <span>The 32-bit binary of 43261596 is <code>00000010100101000001111010011100</code>.
          Reversing the bits gives <code>00111001011110000010100101000000</code>,
          which is 964176192 in decimal.</span>
        </div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">Example 2</span>
        <div class="stmt-kv"><span>Input</span><code>n = 2147483644</code></div>
        <div class="stmt-kv"><span>Output</span><code>1073741822</code></div>
        <div class="stmt-kv">
          <span>Explanation</span>
          <span>The 32-bit binary of 2147483644 is <code>01111111111111111111111111111100</code>.
          Reversing the bits gives <code>00111111111111111111111111111110</code>,
          which is 1073741822 in decimal.</span>
        </div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>Constraints:</strong>
      <ul>
        <li><code>0 &lt;= n &lt;= 2^31 - 2</code></li>
        <li><code>n</code> is even</li>
      </ul>
      <p class="dp-step__hint">Follow up: If this function is called many times, how would you optimize it?</p>
    </div>
  `,
}

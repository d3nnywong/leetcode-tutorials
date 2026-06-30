/* 125. 验证回文串 官方题面（leetcode.cn / .com，文字与示例与官方一致，结构重排）。 */

export const src = {
  zh: 'https://leetcode.cn/problems/valid-palindrome/',
  en: 'https://leetcode.com/problems/valid-palindrome/',
}

export const statement = {
  zh: `
    <p>如果在将所有大写字符转换为小写字符、并移除所有非字母数字字符之后，
    短语正着读和反着读都一样。则可以认为该短语是一个 <strong>回文串</strong> 。</p>

    <p>字母和数字都属于字母数字字符。</p>

    <p>给你一个字符串 <code>s</code>，如果它是 <strong>回文串</strong> ，返回 <code>true</code> ；
    否则，返回 <code>false</code> 。</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">示例 1</span>
        <div class="stmt-kv"><span>输入</span><code>s = "A man, a plan, a canal: Panama"</code></div>
        <div class="stmt-kv"><span>输出</span><code>true</code></div>
        <div class="stmt-kv"><span>解释</span><span>"amanaplanacanalpanama" 是回文串。</span></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">示例 2</span>
        <div class="stmt-kv"><span>输入</span><code>s = "race a car"</code></div>
        <div class="stmt-kv"><span>输出</span><code>false</code></div>
        <div class="stmt-kv"><span>解释</span><span>"raceacar" 不是回文串。</span></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">示例 3</span>
        <div class="stmt-kv"><span>输入</span><code>s = " "</code></div>
        <div class="stmt-kv"><span>输出</span><code>true</code></div>
        <div class="stmt-kv"><span>解释</span><span>在移除非字母数字字符之后，s 是一个空字符串 "" 。
          由于空字符串正着反着读都一样，所以是回文串。</span></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>提示：</strong>
      <ul>
        <li><code>1 &lt;= s.length &lt;= 2 * 10^5</code></li>
        <li><code>s</code> 仅由可打印的 ASCII 字符组成</li>
      </ul>
    </div>
  `,

  en: `
    <p>A phrase is a <strong>palindrome</strong> if, after converting all uppercase letters into
    lowercase letters and removing all non-alphanumeric characters, it reads the same forward and
    backward. Alphanumeric characters include letters and numbers.</p>

    <p>Given a string <code>s</code>, return <code>true</code> if it is a <strong>palindrome</strong>,
    or <code>false</code> otherwise.</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">Example 1</span>
        <div class="stmt-kv"><span>Input</span><code>s = "A man, a plan, a canal: Panama"</code></div>
        <div class="stmt-kv"><span>Output</span><code>true</code></div>
        <div class="stmt-kv"><span>Explanation</span><span>"amanaplanacanalpanama" is a palindrome.</span></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">Example 2</span>
        <div class="stmt-kv"><span>Input</span><code>s = "race a car"</code></div>
        <div class="stmt-kv"><span>Output</span><code>false</code></div>
        <div class="stmt-kv"><span>Explanation</span><span>"raceacar" is not a palindrome.</span></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">Example 3</span>
        <div class="stmt-kv"><span>Input</span><code>s = " "</code></div>
        <div class="stmt-kv"><span>Output</span><code>true</code></div>
        <div class="stmt-kv"><span>Explanation</span><span>s is an empty string "" after removing
          non-alphanumeric characters. Since an empty string reads the same forward and backward,
          it is a palindrome.</span></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>Constraints:</strong>
      <ul>
        <li><code>1 &lt;= s.length &lt;= 2 * 10^5</code></li>
        <li><code>s</code> consists only of printable ASCII characters.</li>
      </ul>
    </div>
  `,
}

/* 242. 有效的字母异位词 官方题面（leetcode.cn / .com，文字与示例与官方一致，结构重排）。 */

export const src = {
  zh: 'https://leetcode.cn/problems/valid-anagram/',
  en: 'https://leetcode.com/problems/valid-anagram/',
}

export const statement = {
  zh: `
    <p>给定两个字符串 <code>s</code> 和 <code>t</code>，编写一个函数来判断 <code>t</code>
    是否是 <code>s</code> 的字母异位词。</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">示例 1</span>
        <div class="stmt-kv"><span>输入</span><code>s = "anagram", t = "nagaram"</code></div>
        <div class="stmt-kv"><span>输出</span><code>true</code></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">示例 2</span>
        <div class="stmt-kv"><span>输入</span><code>s = "rat", t = "car"</code></div>
        <div class="stmt-kv"><span>输出</span><code>false</code></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>提示：</strong>
      <ul>
        <li><code>1 &lt;= s.length, t.length &lt;= 5 * 10^4</code></li>
        <li><code>s</code> 和 <code>t</code> 仅包含小写字母</li>
      </ul>
      <p class="dp-step__hint">进阶：如果输入字符串包含 unicode 字符怎么办？你能否调整你的解法来应对这种情况？</p>
    </div>
  `,

  en: `
    <p>Given two strings <code>s</code> and <code>t</code>, return <code>true</code> if
    <code>t</code> is an anagram of <code>s</code>, and <code>false</code> otherwise.</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">Example 1</span>
        <div class="stmt-kv"><span>Input</span><code>s = "anagram", t = "nagaram"</code></div>
        <div class="stmt-kv"><span>Output</span><code>true</code></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">Example 2</span>
        <div class="stmt-kv"><span>Input</span><code>s = "rat", t = "car"</code></div>
        <div class="stmt-kv"><span>Output</span><code>false</code></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>Constraints:</strong>
      <ul>
        <li><code>1 &lt;= s.length, t.length &lt;= 5 * 10^4</code></li>
        <li><code>s</code> and <code>t</code> consist of lowercase English letters.</li>
      </ul>
      <p class="dp-step__hint">Follow up: What if the inputs contain Unicode characters? How would you adapt your solution to such a case?</p>
    </div>
  `,
}

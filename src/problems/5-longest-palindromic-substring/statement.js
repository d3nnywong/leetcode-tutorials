/* 5. 最长回文子串 官方题面（leetcode.cn / .com，文字与示例与官方一致，结构重排）。 */

export const src = {
  zh: 'https://leetcode.cn/problems/longest-palindromic-substring/',
  en: 'https://leetcode.com/problems/longest-palindromic-substring/',
}

export const statement = {
  zh: `
    <p>给你一个字符串 <code>s</code>，找到 <code>s</code> 中最长的<strong>回文</strong>子串。</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">示例 1</span>
        <div class="stmt-kv"><span>输入</span><code>s = "babad"</code></div>
        <div class="stmt-kv"><span>输出</span><code>"bab"</code></div>
        <div class="stmt-kv"><span>解释</span><span>"aba" 同样是符合题意的答案。</span></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">示例 2</span>
        <div class="stmt-kv"><span>输入</span><code>s = "cbbd"</code></div>
        <div class="stmt-kv"><span>输出</span><code>"bb"</code></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>提示：</strong>
      <ul>
        <li><code>1 &lt;= s.length &lt;= 1000</code></li>
        <li><code>s</code> 仅由数字和英文字母组成</li>
      </ul>
    </div>
  `,

  en: `
    <p>Given a string <code>s</code>, return <em>the longest</em>
    <strong>palindromic</strong> <em>substring</em> in <code>s</code>.</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">Example 1</span>
        <div class="stmt-kv"><span>Input</span><code>s = "babad"</code></div>
        <div class="stmt-kv"><span>Output</span><code>"bab"</code></div>
        <div class="stmt-kv"><span>Explanation</span><span>"aba" is also a valid answer.</span></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">Example 2</span>
        <div class="stmt-kv"><span>Input</span><code>s = "cbbd"</code></div>
        <div class="stmt-kv"><span>Output</span><code>"bb"</code></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>Constraints:</strong>
      <ul>
        <li><code>1 &lt;= s.length &lt;= 1000</code></li>
        <li><code>s</code> consist of only digits and English letters.</li>
      </ul>
    </div>
  `,
}

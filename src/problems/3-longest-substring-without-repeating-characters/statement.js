/* 3. 无重复字符的最长子串 官方题面（leetcode.cn / .com，文字与示例与官方一致，结构重排）。 */

export const src = {
  zh: 'https://leetcode.cn/problems/longest-substring-without-repeating-characters/',
  en: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
}

export const statement = {
  zh: `
    <p>给定一个字符串 <code>s</code> ，请你找出其中不含有重复字符的
    <strong>最长子串</strong> 的长度。</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">示例 1</span>
        <div class="stmt-kv"><span>输入</span><code>s = "abcabcbb"</code></div>
        <div class="stmt-kv"><span>输出</span><code>3</code></div>
        <div class="stmt-kv"><span>解释</span><span>因为无重复字符的最长子串是 "abc"，所以其长度为 3。注意 "bca" 和 "cab" 也是正确答案。</span></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">示例 2</span>
        <div class="stmt-kv"><span>输入</span><code>s = "bbbbb"</code></div>
        <div class="stmt-kv"><span>输出</span><code>1</code></div>
        <div class="stmt-kv"><span>解释</span><span>因为无重复字符的最长子串是 "b"，所以其长度为 1。</span></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">示例 3</span>
        <div class="stmt-kv"><span>输入</span><code>s = "pwwkew"</code></div>
        <div class="stmt-kv"><span>输出</span><code>3</code></div>
        <div class="stmt-kv"><span>解释</span><span>因为无重复字符的最长子串是 "wke"，所以其长度为 3。请注意，你的答案必须是 <strong>子串</strong> 的长度，"pwke" 是一个子序列，不是子串。</span></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>提示：</strong>
      <ul>
        <li><code>0 &lt;= s.length &lt;= 5 * 10^4</code></li>
        <li><code>s</code> 由英文字母、数字、符号和空格组成</li>
      </ul>
    </div>
  `,

  en: `
    <p>Given a string <code>s</code>, find the length of the <strong>longest
    substring</strong> without duplicate characters.</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">Example 1</span>
        <div class="stmt-kv"><span>Input</span><code>s = "abcabcbb"</code></div>
        <div class="stmt-kv"><span>Output</span><code>3</code></div>
        <div class="stmt-kv"><span>Explanation</span><span>The answer is "abc", with the length of 3. Note that "bca" and "cab" are also correct answers.</span></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">Example 2</span>
        <div class="stmt-kv"><span>Input</span><code>s = "bbbbb"</code></div>
        <div class="stmt-kv"><span>Output</span><code>1</code></div>
        <div class="stmt-kv"><span>Explanation</span><span>The answer is "b", with the length of 1.</span></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">Example 3</span>
        <div class="stmt-kv"><span>Input</span><code>s = "pwwkew"</code></div>
        <div class="stmt-kv"><span>Output</span><code>3</code></div>
        <div class="stmt-kv"><span>Explanation</span><span>The answer is "wke", with the length of 3. Notice that the answer must be a <strong>substring</strong>, "pwke" is a subsequence and not a substring.</span></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>Constraints:</strong>
      <ul>
        <li><code>0 &lt;= s.length &lt;= 5 * 10^4</code></li>
        <li><code>s</code> consists of English letters, digits, symbols and spaces.</li>
      </ul>
    </div>
  `,
}

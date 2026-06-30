/* 76. 最小覆盖子串 官方题面（leetcode.cn / .com，文字与示例与官方一致，结构重排）。 */

export const src = {
  zh: 'https://leetcode.cn/problems/minimum-window-substring/',
  en: 'https://leetcode.com/problems/minimum-window-substring/',
}

export const statement = {
  zh: `
    <p>给定两个字符串 <code>s</code> 和 <code>t</code>，长度分别是 <code>m</code> 和 <code>n</code>，
    返回 s 中的 <strong>最短覆盖子串</strong>，使得该子串包含 <code>t</code> 中的每一个字符
    （<strong>包括重复字符</strong>）。如果没有这样的子串，返回空字符串 <code>""</code>。</p>

    <p>测试用例保证答案唯一。</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">示例 1</span>
        <div class="stmt-kv"><span>输入</span><code>s = "ADOBECODEBANC", t = "ABC"</code></div>
        <div class="stmt-kv"><span>输出</span><code>"BANC"</code></div>
        <div class="stmt-kv"><span>解释</span><span>最小覆盖子串 "BANC" 包含来自字符串 t 的 'A'、'B' 和 'C'。</span></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">示例 2</span>
        <div class="stmt-kv"><span>输入</span><code>s = "a", t = "a"</code></div>
        <div class="stmt-kv"><span>输出</span><code>"a"</code></div>
        <div class="stmt-kv"><span>解释</span><span>整个字符串 s 是最小覆盖子串。</span></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">示例 3</span>
        <div class="stmt-kv"><span>输入</span><code>s = "a", t = "aa"</code></div>
        <div class="stmt-kv"><span>输出</span><code>""</code></div>
        <div class="stmt-kv"><span>解释</span><span>t 中两个字符 'a' 均应包含在 s 的子串中，因此没有符合条件的子字符串，返回空字符串。</span></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>提示：</strong>
      <ul>
        <li><code>m == s.length</code></li>
        <li><code>n == t.length</code></li>
        <li><code>1 &lt;= m, n &lt;= 10^5</code></li>
        <li><code>s</code> 和 <code>t</code> 由英文字母组成</li>
      </ul>
      <p class="dp-step__hint">进阶：你能设计一个在 <code>O(m + n)</code> 时间内解决此问题的算法吗？</p>
    </div>
  `,

  en: `
    <p>Given two strings <code>s</code> and <code>t</code> of lengths <code>m</code> and
    <code>n</code> respectively, return <em>the <strong>minimum window</strong> substring</em>
    of <code>s</code> such that every character in <code>t</code>
    (<strong>including duplicates</strong>) is included in the window. If there is no such
    substring, return <em>the empty string</em> <code>""</code>.</p>

    <p>The testcases will be generated such that the answer is <strong>unique</strong>.</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">Example 1</span>
        <div class="stmt-kv"><span>Input</span><code>s = "ADOBECODEBANC", t = "ABC"</code></div>
        <div class="stmt-kv"><span>Output</span><code>"BANC"</code></div>
        <div class="stmt-kv"><span>Explanation</span><span>The minimum window substring "BANC" includes 'A', 'B', and 'C' from string t.</span></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">Example 2</span>
        <div class="stmt-kv"><span>Input</span><code>s = "a", t = "a"</code></div>
        <div class="stmt-kv"><span>Output</span><code>"a"</code></div>
        <div class="stmt-kv"><span>Explanation</span><span>The entire string s is the minimum window.</span></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">Example 3</span>
        <div class="stmt-kv"><span>Input</span><code>s = "a", t = "aa"</code></div>
        <div class="stmt-kv"><span>Output</span><code>""</code></div>
        <div class="stmt-kv"><span>Explanation</span><span>Both 'a's from t must be included in the window. Since the largest window of s only has one 'a', return empty string.</span></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>Constraints:</strong>
      <ul>
        <li><code>m == s.length</code></li>
        <li><code>n == t.length</code></li>
        <li><code>1 &lt;= m, n &lt;= 10^5</code></li>
        <li><code>s</code> and <code>t</code> consist of uppercase and lowercase English letters.</li>
      </ul>
      <p class="dp-step__hint">Follow up: Could you find an algorithm that runs in <code>O(m + n)</code> time?</p>
    </div>
  `,
}

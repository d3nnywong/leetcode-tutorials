/* 424. 替换后的最长重复字符 官方题面（leetcode.cn / .com，文字与示例与官方一致，结构重排）。 */

export const src = {
  zh: 'https://leetcode.cn/problems/longest-repeating-character-replacement/',
  en: 'https://leetcode.com/problems/longest-repeating-character-replacement/',
}

export const statement = {
  zh: `
    <p>给你一个字符串 <code>s</code> 和一个整数 <code>k</code>。你可以选择字符串中的任一字符，
    并将其更改为任何其他大写英文字符。该操作最多可执行 <code>k</code> 次。</p>

    <p>在执行上述操作后，返回<em>包含相同字母的最长子字符串的长度。</em></p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">示例 1</span>
        <div class="stmt-kv"><span>输入</span><code>s = "ABAB", k = 2</code></div>
        <div class="stmt-kv"><span>输出</span><code>4</code></div>
        <div class="stmt-kv"><span>解释</span><span>用两个 'A' 替换为两个 'B',反之亦然。</span></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">示例 2</span>
        <div class="stmt-kv"><span>输入</span><code>s = "AABABBA", k = 1</code></div>
        <div class="stmt-kv"><span>输出</span><code>4</code></div>
        <div class="stmt-kv"><span>解释</span><span>
          将中间的一个 'A' 替换为 'B',字符串变为 "AABBBBA"。
          子串 "BBBB" 有最长重复字母,答案为 4。
          可能存在其他的方法来得到同样的结果。
        </span></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>提示：</strong>
      <ul>
        <li><code>1 &lt;= s.length &lt;= 10^5</code></li>
        <li><code>s</code> 仅由大写英文字母组成</li>
        <li><code>0 &lt;= k &lt;= s.length</code></li>
      </ul>
    </div>
  `,

  en: `
    <p>You are given a string <code>s</code> and an integer <code>k</code>. You can choose any
    character of the string and change it to any other uppercase English character. You can
    perform this operation at most <code>k</code> times.</p>

    <p>Return <em>the length of the longest substring containing the same letter you can get
    after performing the above operations</em>.</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">Example 1</span>
        <div class="stmt-kv"><span>Input</span><code>s = "ABAB", k = 2</code></div>
        <div class="stmt-kv"><span>Output</span><code>4</code></div>
        <div class="stmt-kv"><span>Explanation</span><span>Replace the two 'A's with two 'B's or vice versa.</span></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">Example 2</span>
        <div class="stmt-kv"><span>Input</span><code>s = "AABABBA", k = 1</code></div>
        <div class="stmt-kv"><span>Output</span><code>4</code></div>
        <div class="stmt-kv"><span>Explanation</span><span>
          Replace the one 'A' in the middle with 'B' and form "AABBBBA".
          The substring "BBBB" has the longest repeating letters, which is 4.
          There may exists other ways to achieve this answer too.
        </span></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>Constraints:</strong>
      <ul>
        <li><code>1 &lt;= s.length &lt;= 10^5</code></li>
        <li><code>s</code> consists of only uppercase English letters.</li>
        <li><code>0 &lt;= k &lt;= s.length</code></li>
      </ul>
    </div>
  `,
}

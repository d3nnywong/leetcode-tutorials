/* 647. 回文子串 官方题面（leetcode.cn / .com，文字与示例与官方一致，结构重排）。 */

export const src = {
  zh: 'https://leetcode.cn/problems/palindromic-substrings/',
  en: 'https://leetcode.com/problems/palindromic-substrings/',
}

export const statement = {
  zh: `
    <p>给你一个字符串 <code>s</code> ，请你统计并返回这个字符串中
    <strong>回文子串</strong> 的数目。</p>

    <p><strong>回文字符串</strong> 是正着读和倒过来读一样的字符串。</p>

    <p><strong>子字符串</strong> 是字符串中的由连续字符组成的一个序列。</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">示例 1</span>
        <div class="stmt-kv"><span>输入</span><code>s = "abc"</code></div>
        <div class="stmt-kv"><span>输出</span><code>3</code></div>
        <div class="stmt-kv"><span>解释</span><span>三个回文子串: "a", "b", "c"</span></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">示例 2</span>
        <div class="stmt-kv"><span>输入</span><code>s = "aaa"</code></div>
        <div class="stmt-kv"><span>输出</span><code>6</code></div>
        <div class="stmt-kv"><span>解释</span><span>6个回文子串: "a", "a", "a", "aa", "aa", "aaa"</span></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>提示：</strong>
      <ul>
        <li><code>1 &lt;= s.length &lt;= 1000</code></li>
        <li><code>s</code> 由小写英文字母组成</li>
      </ul>
    </div>
  `,

  en: `
    <p>Given a string <code>s</code>, return <em>the number of</em> <strong>palindromic substrings</strong>
    <em>in it</em>.</p>

    <p>A string is a <strong>palindrome</strong> when it reads the same backward as forward.</p>

    <p>A <strong>substring</strong> is a contiguous sequence of characters within the string.</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">Example 1</span>
        <div class="stmt-kv"><span>Input</span><code>s = "abc"</code></div>
        <div class="stmt-kv"><span>Output</span><code>3</code></div>
        <div class="stmt-kv"><span>Explanation</span><span>Three palindromic strings: "a", "b", "c".</span></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">Example 2</span>
        <div class="stmt-kv"><span>Input</span><code>s = "aaa"</code></div>
        <div class="stmt-kv"><span>Output</span><code>6</code></div>
        <div class="stmt-kv"><span>Explanation</span><span>Six palindromic strings: "a", "a", "a", "aa", "aa", "aaa".</span></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>Constraints:</strong>
      <ul>
        <li><code>1 &lt;= s.length &lt;= 1000</code></li>
        <li><code>s</code> consists of lowercase English letters.</li>
      </ul>
    </div>
  `,
}

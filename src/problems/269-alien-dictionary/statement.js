/* 269. 火星词典（Alien Dictionary）官方题面（leetcode.cn / .com，文字与示例与官方一致，结构重排）。 */

export const src = {
  zh: 'https://leetcode.cn/problems/alien-dictionary/',
  en: 'https://leetcode.com/problems/alien-dictionary/',
}

export const statement = {
  zh: `
    <p>现有一种使用英语字母的外星文语言，这门语言的字母顺序与英语顺序<strong>不同</strong>。</p>

    <p>给定一个字符串列表 <code>words</code>，作为这门语言的词典，<code>words</code> 中的字符串已经
    <strong>按这门新语言的字母顺序进行了排序</strong>。</p>

    <p>请你根据该词典还原出此语言中已知的字母顺序，并按字母<strong>递增顺序</strong>排列。若不存在合法的
    字母顺序，则返回 <code>""</code>。若存在多种可能的合法字母顺序，返回其中<strong>任意一种</strong>顺序即可。</p>

    <p>字符串 <code>s</code> 字典顺序小于字符串 <code>t</code> 有两种情况：</p>
    <ul>
      <li>在第一个不同字母处，如果 <code>s</code> 中的字母在这门外星语言的字母顺序中位于
      <code>t</code> 中字母之前，那么 <code>s</code> 的字典顺序小于 <code>t</code>。</li>
      <li>如果前 <code>min(s.length, t.length)</code> 个字母都相同，那么当 <code>s.length &lt; t.length</code>
      时，<code>s</code> 的字典顺序也小于 <code>t</code>。</li>
    </ul>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">示例 1</span>
        <div class="stmt-kv"><span>输入</span><code>words = ["wrt","wrf","er","ett","rftt"]</code></div>
        <div class="stmt-kv"><span>输出</span><code>"wertf"</code></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">示例 2</span>
        <div class="stmt-kv"><span>输入</span><code>words = ["z","x"]</code></div>
        <div class="stmt-kv"><span>输出</span><code>"zx"</code></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">示例 3</span>
        <div class="stmt-kv"><span>输入</span><code>words = ["z","x","z"]</code></div>
        <div class="stmt-kv"><span>输出</span><code>""</code></div>
        <div class="stmt-kv"><span>解释</span><span>顺序是非法的，所以返回 <code>""</code>。</span></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>提示：</strong>
      <ul>
        <li><code>1 &lt;= words.length &lt;= 100</code></li>
        <li><code>1 &lt;= words[i].length &lt;= 100</code></li>
        <li><code>words[i]</code> 仅由小写英文字母组成。</li>
      </ul>
    </div>
  `,

  en: `
    <p>There is a new alien language that uses the English alphabet. However, the order among
    the letters is <strong>unknown</strong> to you.</p>

    <p>You are given a list of strings <code>words</code> from the alien language's dictionary,
    where the strings in <code>words</code> are <strong>sorted lexicographically</strong> by the
    rules of this new language.</p>

    <p>Return a string of the unique letters in the new alien language sorted in
    lexicographically increasing order by the new language's rules. If there is no solution,
    return <code>""</code>. If there are multiple solutions, return any of them.</p>

    <p>A string <code>s</code> is lexicographically smaller than a string <code>t</code> if at
    the first letter where they differ, the letter in <code>s</code> comes before the letter in
    <code>t</code> in the alien language. If the first <code>min(s.length, t.length)</code>
    letters are the same, then <code>s</code> is smaller if and only if
    <code>s.length &lt; t.length</code>.</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">Example 1</span>
        <div class="stmt-kv"><span>Input</span><code>words = ["wrt","wrf","er","ett","rftt"]</code></div>
        <div class="stmt-kv"><span>Output</span><code>"wertf"</code></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">Example 2</span>
        <div class="stmt-kv"><span>Input</span><code>words = ["z","x"]</code></div>
        <div class="stmt-kv"><span>Output</span><code>"zx"</code></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">Example 3</span>
        <div class="stmt-kv"><span>Input</span><code>words = ["z","x","z"]</code></div>
        <div class="stmt-kv"><span>Output</span><code>""</code></div>
        <div class="stmt-kv"><span>Explanation</span><span>The order is invalid, so return <code>""</code>.</span></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>Constraints:</strong>
      <ul>
        <li><code>1 &lt;= words.length &lt;= 100</code></li>
        <li><code>1 &lt;= words[i].length &lt;= 100</code></li>
        <li><code>words[i]</code> consists of only lowercase English letters.</li>
      </ul>
    </div>
  `,
}

/* 49. 字母异位词分组 官方题面（leetcode.cn / .com，文字与示例与官方一致，结构重排）。 */

export const src = {
  zh: 'https://leetcode.cn/problems/group-anagrams/',
  en: 'https://leetcode.com/problems/group-anagrams/',
}

export const statement = {
  zh: `
    <p>给你一个字符串数组，请你将 <strong>字母异位词</strong> 组合在一起。可以按任意顺序返回结果列表。</p>

    <p><strong>字母异位词</strong> 是由重新排列源单词的所有字母得到的一个新单词。</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">示例 1</span>
        <div class="stmt-kv"><span>输入</span><code>strs = ["eat","tea","tan","ate","nat","bat"]</code></div>
        <div class="stmt-kv"><span>输出</span><code>[["bat"],["nat","tan"],["ate","eat","tea"]]</code></div>
        <div class="stmt-kv"><span>解释</span><span>
          "bat" 没法通过重新排列变成别的字符串；"nat" 和 "tan" 互为字母异位词；
          "ate"、"eat"、"tea" 互为字母异位词。
        </span></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">示例 2</span>
        <div class="stmt-kv"><span>输入</span><code>strs = [""]</code></div>
        <div class="stmt-kv"><span>输出</span><code>[[""]]</code></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">示例 3</span>
        <div class="stmt-kv"><span>输入</span><code>strs = ["a"]</code></div>
        <div class="stmt-kv"><span>输出</span><code>[["a"]]</code></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>提示：</strong>
      <ul>
        <li><code>1 &lt;= strs.length &lt;= 10^4</code></li>
        <li><code>0 &lt;= strs[i].length &lt;= 100</code></li>
        <li><code>strs[i]</code> 仅包含小写字母</li>
      </ul>
    </div>
  `,

  en: `
    <p>Given an array of strings <code>strs</code>, group the <strong>anagrams</strong> together.
    You can return the answer in <strong>any order</strong>.</p>

    <p>An <strong>anagram</strong> is a word or phrase formed by rearranging the letters of a
    different word or phrase, typically using all the original letters exactly once.</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">Example 1</span>
        <div class="stmt-kv"><span>Input</span><code>strs = ["eat","tea","tan","ate","nat","bat"]</code></div>
        <div class="stmt-kv"><span>Output</span><code>[["bat"],["nat","tan"],["ate","eat","tea"]]</code></div>
        <div class="stmt-kv"><span>Explanation</span><span>
          There is no string in strs that can be rearranged to form "bat". The strings "nat" and
          "tan" are anagrams as they can be rearranged to form each other. The strings "ate", "eat",
          and "tea" are anagrams as they can be rearranged to form each other.
        </span></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">Example 2</span>
        <div class="stmt-kv"><span>Input</span><code>strs = [""]</code></div>
        <div class="stmt-kv"><span>Output</span><code>[[""]]</code></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">Example 3</span>
        <div class="stmt-kv"><span>Input</span><code>strs = ["a"]</code></div>
        <div class="stmt-kv"><span>Output</span><code>[["a"]]</code></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>Constraints:</strong>
      <ul>
        <li><code>1 &lt;= strs.length &lt;= 10^4</code></li>
        <li><code>0 &lt;= strs[i].length &lt;= 100</code></li>
        <li><code>strs[i]</code> consists of lowercase English letters.</li>
      </ul>
    </div>
  `,
}

/*
 * 1143 的官方原题题面（逐字来自 LeetCode）：
 *   - 英文：leetcode.com/problems/longest-common-subsequence
 *   - 中文：leetcode.cn/problems/longest-common-subsequence
 * 用站点自己的简洁结构重排，但文字、示例、数据范围与官方一致。
 * 切换语言时由 lcs.js 选择对应版本渲染。
 */

export const statement = {
  zh: `
    <p>给定两个字符串 <code>text1</code> 和 <code>text2</code>，返回这两个字符串的最长
    <strong>公共子序列</strong> 的长度。如果不存在 <strong>公共子序列</strong>，返回
    <code>0</code> 。</p>

    <p>一个字符串的 <strong>子序列</strong> 是指这样一个新的字符串：它是由原字符串在不改变字符的
    相对顺序的情况下删除某些字符（也可以不删除任何字符）后组成的新字符串。</p>

    <ul class="stmt-list">
      <li>例如，<code>"ace"</code> 是 <code>"abcde"</code> 的子序列，但
      <code>"aec"</code> 不是 <code>"abcde"</code> 的子序列。</li>
    </ul>

    <p>两个字符串的 <strong>公共子序列</strong> 是这两个字符串所共同拥有的子序列。</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">示例 1</span>
        <div class="stmt-kv"><span>输入</span><code>text1 = "abcde", text2 = "ace"</code></div>
        <div class="stmt-kv"><span>输出</span><code>3</code></div>
        <div class="stmt-kv"><span>解释</span><span>最长公共子序列是 "ace" ，它的长度为 3 。</span></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">示例 2</span>
        <div class="stmt-kv"><span>输入</span><code>text1 = "abc", text2 = "abc"</code></div>
        <div class="stmt-kv"><span>输出</span><code>3</code></div>
        <div class="stmt-kv"><span>解释</span><span>最长公共子序列是 "abc" ，它的长度为 3 。</span></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">示例 3</span>
        <div class="stmt-kv"><span>输入</span><code>text1 = "abc", text2 = "def"</code></div>
        <div class="stmt-kv"><span>输出</span><code>0</code></div>
        <div class="stmt-kv"><span>解释</span><span>两个字符串没有公共子序列，返回 0 。</span></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>提示：</strong>
      <ul>
        <li><code>1 &lt;= text1.length, text2.length &lt;= 1000</code></li>
        <li><code>text1</code> 和 <code>text2</code> 仅由小写英文字符组成。</li>
      </ul>
    </div>
  `,

  en: `
    <p>Given two strings <code>text1</code> and <code>text2</code>, return
    <em>the length of their longest <strong>common subsequence</strong>.</em>
    If there is no <strong>common subsequence</strong>, return <code>0</code>.</p>

    <p>A <strong>subsequence</strong> of a string is a new string generated from the
    original string with some characters (can be none) deleted without changing the
    relative order of the remaining characters.</p>

    <ul class="stmt-list">
      <li>For example, <code>"ace"</code> is a subsequence of <code>"abcde"</code>.</li>
    </ul>

    <p>A <strong>common subsequence</strong> of two strings is a subsequence that is
    common to both strings.</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">Example 1</span>
        <div class="stmt-kv"><span>Input</span><code>text1 = "abcde", text2 = "ace"</code></div>
        <div class="stmt-kv"><span>Output</span><code>3</code></div>
        <div class="stmt-kv"><span>Explanation</span><span>The longest common subsequence is "ace" and its length is 3.</span></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">Example 2</span>
        <div class="stmt-kv"><span>Input</span><code>text1 = "abc", text2 = "abc"</code></div>
        <div class="stmt-kv"><span>Output</span><code>3</code></div>
        <div class="stmt-kv"><span>Explanation</span><span>The longest common subsequence is "abc" and its length is 3.</span></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">Example 3</span>
        <div class="stmt-kv"><span>Input</span><code>text1 = "abc", text2 = "def"</code></div>
        <div class="stmt-kv"><span>Output</span><code>0</code></div>
        <div class="stmt-kv"><span>Explanation</span><span>There is no such common subsequence, so the result is 0.</span></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>Constraints:</strong>
      <ul>
        <li><code>1 &lt;= text1.length, text2.length &lt;= 1000</code></li>
        <li><code>text1</code> and <code>text2</code> consist of only lowercase English characters.</li>
      </ul>
    </div>
  `,
}

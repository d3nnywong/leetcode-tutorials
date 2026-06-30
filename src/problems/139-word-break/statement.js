/*
 * 139 的官方原题题面（逐字来自 LeetCode）：
 *   - 英文：leetcode.com/problems/word-break
 *   - 中文：leetcode.cn/problems/word-break
 * 用站点自己的简洁结构重排，但文字、示例、数据范围与官方一致。
 * 切换语言时由 wordBreak.js 选择对应版本渲染；题源链接同样按语言切换。
 */

export const src = {
  zh: 'https://leetcode.cn/problems/word-break/',
  en: 'https://leetcode.com/problems/word-break/',
}

export const statement = {
  zh: `
    <p>给你一个字符串 <code>s</code> 和一个字符串列表 <code>wordDict</code> 作为字典。
    如果可以利用字典中出现的一个或多个单词拼接出 <code>s</code> 则返回 <code>true</code>。</p>

    <p><strong>注意：</strong>不要求字典中出现的单词全部都使用，并且字典中的单词
    <strong>可以重复使用</strong>。</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">示例 1</span>
        <div class="stmt-kv"><span>输入</span><code>s = "leetcode", wordDict = ["leet","code"]</code></div>
        <div class="stmt-kv"><span>输出</span><code>true</code></div>
        <div class="stmt-kv"><span>解释</span><span>返回 true 因为 "leetcode" 可以由 "leet" 和 "code" 拼接成。</span></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">示例 2</span>
        <div class="stmt-kv"><span>输入</span><code>s = "applepenapple", wordDict = ["apple","pen"]</code></div>
        <div class="stmt-kv"><span>输出</span><code>true</code></div>
        <div class="stmt-kv"><span>解释</span><span>返回 true 因为 "applepenapple" 可以由 "apple" "pen" "apple" 拼接成。注意你可以重复使用字典中的单词。</span></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">示例 3</span>
        <div class="stmt-kv"><span>输入</span><code>s = "catsandog", wordDict = ["cats","dog","sand","and","cat"]</code></div>
        <div class="stmt-kv"><span>输出</span><code>false</code></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>提示：</strong>
      <ul>
        <li><code>1 &lt;= s.length &lt;= 300</code></li>
        <li><code>1 &lt;= wordDict.length &lt;= 1000</code></li>
        <li><code>1 &lt;= wordDict[i].length &lt;= 20</code></li>
        <li><code>s</code> 和 <code>wordDict[i]</code> 仅由小写英文字母组成。</li>
        <li><code>wordDict</code> 中的所有字符串 <strong>互不相同</strong>。</li>
      </ul>
    </div>
  `,

  en: `
    <p>Given a string <code>s</code> and a dictionary of strings <code>wordDict</code>,
    return <code>true</code> if <code>s</code> can be segmented into a space-separated
    sequence of one or more dictionary words.</p>

    <p><strong>Note</strong> that the same word in the dictionary may be reused
    multiple times in the segmentation.</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">Example 1</span>
        <div class="stmt-kv"><span>Input</span><code>s = "leetcode", wordDict = ["leet","code"]</code></div>
        <div class="stmt-kv"><span>Output</span><code>true</code></div>
        <div class="stmt-kv"><span>Explanation</span><span>Return true because "leetcode" can be segmented as "leet code".</span></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">Example 2</span>
        <div class="stmt-kv"><span>Input</span><code>s = "applepenapple", wordDict = ["apple","pen"]</code></div>
        <div class="stmt-kv"><span>Output</span><code>true</code></div>
        <div class="stmt-kv"><span>Explanation</span><span>Return true because "applepenapple" can be segmented as "apple pen apple". Note that you are allowed to reuse a dictionary word.</span></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">Example 3</span>
        <div class="stmt-kv"><span>Input</span><code>s = "catsandog", wordDict = ["cats","dog","sand","and","cat"]</code></div>
        <div class="stmt-kv"><span>Output</span><code>false</code></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>Constraints:</strong>
      <ul>
        <li><code>1 &lt;= s.length &lt;= 300</code></li>
        <li><code>1 &lt;= wordDict.length &lt;= 1000</code></li>
        <li><code>1 &lt;= wordDict[i].length &lt;= 20</code></li>
        <li><code>s</code> and <code>wordDict[i]</code> consist of only lowercase English letters.</li>
        <li>All the strings of <code>wordDict</code> are <strong>unique</strong>.</li>
      </ul>
    </div>
  `,
}

/* 208. 实现 Trie (前缀树) 官方题面（leetcode.cn / .com，文字与示例与官方一致，结构重排）。 */

export const src = {
  zh: 'https://leetcode.cn/problems/implement-trie-prefix-tree/',
  en: 'https://leetcode.com/problems/implement-trie-prefix-tree/',
}

export const statement = {
  zh: `
    <p><strong>Trie</strong>（发音类似 "try"）或者说 <strong>前缀树</strong> 是一种树形数据结构，
    用于高效地存储和检索字符串数据集中的键。这一数据结构有相当多的应用情景，例如自动补全和拼写检查。</p>

    <p>请你实现 Trie 类：</p>
    <ul>
      <li><code>Trie()</code> 初始化前缀树对象。</li>
      <li><code>void insert(String word)</code> 向前缀树中插入字符串 <code>word</code> 。</li>
      <li><code>boolean search(String word)</code> 如果字符串 <code>word</code> 在前缀树中，返回
        <code>true</code>（即，在检索之前已经插入）；否则，返回 <code>false</code> 。</li>
      <li><code>boolean startsWith(String prefix)</code> 如果之前已经插入的字符串
        <code>word</code> 的前缀之一为 <code>prefix</code> ，返回 <code>true</code> ；否则，返回
        <code>false</code> 。</li>
    </ul>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">示例</span>
        <div class="stmt-kv"><span>输入</span><code>["Trie", "insert", "search", "search", "startsWith", "insert", "search"]
[[], ["apple"], ["apple"], ["app"], ["app"], ["app"], ["app"]]</code></div>
        <div class="stmt-kv"><span>输出</span><code>[null, null, true, false, true, null, true]</code></div>
        <div class="stmt-kv"><span>解释</span><span>
          Trie trie = new Trie();<br/>
          trie.insert("apple");<br/>
          trie.search("apple");&nbsp;&nbsp;&nbsp;// 返回 True<br/>
          trie.search("app");&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// 返回 False<br/>
          trie.startsWith("app"); // 返回 True<br/>
          trie.insert("app");<br/>
          trie.search("app");&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// 返回 True
        </span></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>提示：</strong>
      <ul>
        <li><code>1 &lt;= word.length, prefix.length &lt;= 2000</code></li>
        <li><code>word</code> 和 <code>prefix</code> 仅由小写英文字母组成</li>
        <li><code>insert</code>、<code>search</code> 和 <code>startsWith</code> 调用次数 <strong>总计</strong>
          不超过 <code>3 * 10^4</code> 次</li>
      </ul>
    </div>
  `,

  en: `
    <p>A <strong>trie</strong> (pronounced as "try") or <strong>prefix tree</strong> is a tree data
    structure used to efficiently store and retrieve keys in a dataset of strings. There are various
    applications of this data structure, such as autocomplete and spellchecker.</p>

    <p>Implement the Trie class:</p>
    <ul>
      <li><code>Trie()</code> Initializes the trie object.</li>
      <li><code>void insert(String word)</code> Inserts the string <code>word</code> into the trie.</li>
      <li><code>boolean search(String word)</code> Returns <code>true</code> if the string
        <code>word</code> is in the trie (i.e., was inserted before), and <code>false</code>
        otherwise.</li>
      <li><code>boolean startsWith(String prefix)</code> Returns <code>true</code> if there is a
        previously inserted string <code>word</code> that has the prefix <code>prefix</code>, and
        <code>false</code> otherwise.</li>
    </ul>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">Example 1</span>
        <div class="stmt-kv"><span>Input</span><code>["Trie", "insert", "search", "search", "startsWith", "insert", "search"]
[[], ["apple"], ["apple"], ["app"], ["app"], ["app"], ["app"]]</code></div>
        <div class="stmt-kv"><span>Output</span><code>[null, null, true, false, true, null, true]</code></div>
        <div class="stmt-kv"><span>Explanation</span><span>
          Trie trie = new Trie();<br/>
          trie.insert("apple");<br/>
          trie.search("apple");&nbsp;&nbsp;&nbsp;// return True<br/>
          trie.search("app");&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// return False<br/>
          trie.startsWith("app"); // return True<br/>
          trie.insert("app");<br/>
          trie.search("app");&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// return True
        </span></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>Constraints:</strong>
      <ul>
        <li><code>1 &lt;= word.length, prefix.length &lt;= 2000</code></li>
        <li><code>word</code> and <code>prefix</code> consist only of lowercase English letters.</li>
        <li>At most <code>3 * 10^4</code> calls <strong>in total</strong> will be made to
          <code>insert</code>, <code>search</code>, and <code>startsWith</code>.</li>
      </ul>
    </div>
  `,
}

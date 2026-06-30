/* 211. 添加与搜索单词 - 数据结构设计 官方题面（leetcode.cn / .com，文字与示例与官方一致，结构重排）。 */

export const src = {
  zh: 'https://leetcode.cn/problems/design-add-and-search-words-data-structure/',
  en: 'https://leetcode.com/problems/design-add-and-search-words-data-structure/',
}

export const statement = {
  zh: `
    <p>请你设计一个数据结构，支持 <strong>添加新单词</strong> 和 <strong>查找字符串是否与任何先前添加的字符串匹配</strong>。</p>

    <p>实现词典类 <code>WordDictionary</code> ：</p>
    <ul>
      <li><code>WordDictionary()</code> 初始化词典对象</li>
      <li><code>void addWord(word)</code> 将 <code>word</code> 添加到数据结构中，之后可以对它进行匹配</li>
      <li><code>bool search(word)</code> 如果数据结构中存在字符串与 <code>word</code> 匹配，则返回 <code>true</code>；否则，返回 <code>false</code>。<code>word</code> 中可能包含一些 <code>'.'</code>，每个 <code>.</code> 都可以表示任何一个字母。</li>
    </ul>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">示例</span>
        <div class="stmt-kv"><span>输入</span><code>["WordDictionary","addWord","addWord","addWord","search","search","search","search"]<br/>[[],["bad"],["dad"],["mad"],["pad"],["bad"],[".ad"],["b.."]]</code></div>
        <div class="stmt-kv"><span>输出</span><code>[null,null,null,null,false,true,true,true]</code></div>
        <div class="stmt-kv"><span>解释</span><span>
          依次 <code>addWord("bad")</code>、<code>addWord("dad")</code>、<code>addWord("mad")</code> 之后：
          <code>search("pad")</code> 没有这个单词 → <code>false</code>；
          <code>search("bad")</code> 完全匹配 → <code>true</code>；
          <code>search(".ad")</code> 第一个字符是通配符，bad / dad / mad 都能匹配 → <code>true</code>；
          <code>search("b..")</code> 后两个字符是通配符，bad 能匹配 → <code>true</code>。
        </span></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>提示：</strong>
      <ul>
        <li><code>1 &lt;= word.length &lt;= 25</code></li>
        <li><code>addWord</code> 中的 <code>word</code> 由小写英文字母组成</li>
        <li><code>search</code> 中的 <code>word</code> 由 <code>'.'</code> 或小写英文字母组成</li>
        <li><code>search</code> 查询中的单词最多包含 <code>2</code> 个点</li>
        <li>最多调用 <code>10^4</code> 次 <code>addWord</code> 和 <code>search</code></li>
      </ul>
    </div>
  `,

  en: `
    <p>Design a data structure that supports adding new words and finding if a string matches any previously added string.</p>

    <p>Implement the <code>WordDictionary</code> class:</p>
    <ul>
      <li><code>WordDictionary()</code> Initializes the object.</li>
      <li><code>void addWord(word)</code> Adds <code>word</code> to the data structure, it can be matched later.</li>
      <li><code>bool search(word)</code> Returns <code>true</code> if there is any string in the data structure that matches <code>word</code> or <code>false</code> otherwise. <code>word</code> may contain dots <code>'.'</code> where dots can be matched with any letter.</li>
    </ul>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">Example</span>
        <div class="stmt-kv"><span>Input</span><code>["WordDictionary","addWord","addWord","addWord","search","search","search","search"]<br/>[[],["bad"],["dad"],["mad"],["pad"],["bad"],[".ad"],["b.."]]</code></div>
        <div class="stmt-kv"><span>Output</span><code>[null,null,null,null,false,true,true,true]</code></div>
        <div class="stmt-kv"><span>Explanation</span><span>
          After <code>addWord("bad")</code>, <code>addWord("dad")</code>, <code>addWord("mad")</code>:
          <code>search("pad")</code> returns <code>false</code> (no such word);
          <code>search("bad")</code> returns <code>true</code> (exact match);
          <code>search(".ad")</code> returns <code>true</code> (the first character is a wildcard, matches bad / dad / mad);
          <code>search("b..")</code> returns <code>true</code> (the last two characters are wildcards, matches bad).
        </span></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>Constraints:</strong>
      <ul>
        <li><code>1 &lt;= word.length &lt;= 25</code></li>
        <li><code>word</code> in <code>addWord</code> consists of lowercase English letters.</li>
        <li><code>word</code> in <code>search</code> consist of <code>'.'</code> or lowercase English letters.</li>
        <li>There will be at most <code>2</code> dots in <code>word</code> for <code>search</code> queries.</li>
        <li>At most <code>10^4</code> calls will be made to <code>addWord</code> and <code>search</code>.</li>
      </ul>
    </div>
  `,
}

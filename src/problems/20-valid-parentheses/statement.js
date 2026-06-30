/* 20. 有效的括号 官方题面（leetcode.cn / .com，文字与示例与官方一致，结构重排）。 */

export const src = {
  zh: 'https://leetcode.cn/problems/valid-parentheses/',
  en: 'https://leetcode.com/problems/valid-parentheses/',
}

export const statement = {
  zh: `
    <p>给定一个只包括 <code>'('</code>，<code>')'</code>，<code>'{'</code>，<code>'}'</code>，
    <code>'['</code>，<code>']'</code> 的字符串 <code>s</code>，判断字符串是否有效。</p>

    <p>有效字符串需满足：</p>
    <ul>
      <li>左括号必须用相同类型的右括号闭合。</li>
      <li>左括号必须以正确的顺序闭合。</li>
      <li>每个右括号都有一个对应的相同类型的左括号。</li>
    </ul>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">示例 1</span>
        <div class="stmt-kv"><span>输入</span><code>s = "()"</code></div>
        <div class="stmt-kv"><span>输出</span><code>true</code></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">示例 2</span>
        <div class="stmt-kv"><span>输入</span><code>s = "()[]{}"</code></div>
        <div class="stmt-kv"><span>输出</span><code>true</code></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">示例 3</span>
        <div class="stmt-kv"><span>输入</span><code>s = "(]"</code></div>
        <div class="stmt-kv"><span>输出</span><code>false</code></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">示例 4</span>
        <div class="stmt-kv"><span>输入</span><code>s = "([])"</code></div>
        <div class="stmt-kv"><span>输出</span><code>true</code></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">示例 5</span>
        <div class="stmt-kv"><span>输入</span><code>s = "([)]"</code></div>
        <div class="stmt-kv"><span>输出</span><code>false</code></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>提示：</strong>
      <ul>
        <li><code>1 &lt;= s.length &lt;= 10^4</code></li>
        <li><code>s</code> 仅由括号 <code>'()[]{}'</code> 组成</li>
      </ul>
    </div>
  `,

  en: `
    <p>Given a string <code>s</code> containing just the characters <code>'('</code>,
    <code>')'</code>, <code>'{'</code>, <code>'}'</code>, <code>'['</code> and <code>']'</code>,
    determine if the input string is valid.</p>

    <p>An input string is valid if:</p>
    <ul>
      <li>Open brackets must be closed by the same type of brackets.</li>
      <li>Open brackets must be closed in the correct order.</li>
      <li>Every close bracket has a corresponding open bracket of the same type.</li>
    </ul>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">Example 1</span>
        <div class="stmt-kv"><span>Input</span><code>s = "()"</code></div>
        <div class="stmt-kv"><span>Output</span><code>true</code></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">Example 2</span>
        <div class="stmt-kv"><span>Input</span><code>s = "()[]{}"</code></div>
        <div class="stmt-kv"><span>Output</span><code>true</code></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">Example 3</span>
        <div class="stmt-kv"><span>Input</span><code>s = "(]"</code></div>
        <div class="stmt-kv"><span>Output</span><code>false</code></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">Example 4</span>
        <div class="stmt-kv"><span>Input</span><code>s = "([])"</code></div>
        <div class="stmt-kv"><span>Output</span><code>true</code></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">Example 5</span>
        <div class="stmt-kv"><span>Input</span><code>s = "([)]"</code></div>
        <div class="stmt-kv"><span>Output</span><code>false</code></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>Constraints:</strong>
      <ul>
        <li><code>1 &lt;= s.length &lt;= 10^4</code></li>
        <li><code>s</code> consists of parentheses only <code>'()[]{}'</code>.</li>
      </ul>
    </div>
  `,
}

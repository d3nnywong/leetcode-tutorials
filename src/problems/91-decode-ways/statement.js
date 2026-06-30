/* 91. 解码方法 官方题面（leetcode.cn / .com，文字与示例与官方一致，结构重排）。 */

export const src = {
  zh: 'https://leetcode.cn/problems/decode-ways/',
  en: 'https://leetcode.com/problems/decode-ways/',
}

export const statement = {
  zh: `
    <p>一条包含字母 <code>A-Z</code> 的消息通过以下映射进行了 <strong>编码</strong>：</p>

    <p><code>"1" -&gt; 'A'<br />
    "2" -&gt; 'B'<br />
    ...<br />
    "25" -&gt; 'Y'<br />
    "26" -&gt; 'Z'</code></p>

    <p>然而，在 <strong>解码</strong> 已编码的消息时，你意识到有许多不同的方式来解码，因为有些编码被包含在其它编码当中
    （<code>"2"</code> 和 <code>"5"</code> 与 <code>"25"</code>）。</p>

    <p>例如，<code>"11106"</code> 可以映射为：</p>
    <ul>
      <li><code>"AAJF"</code> ，将消息分组为 <code>(1, 1, 10, 6)</code></li>
      <li><code>"KJF"</code> ，将消息分组为 <code>(11, 10, 6)</code></li>
      <li>消息不能分组为 <code>(1, 11, 06)</code> ，因为 <code>"06"</code> 不是一个合法编码（只有 <code>"6"</code> 是合法的）。</li>
    </ul>

    <p>注意，可能存在无法解码的字符串。</p>

    <p>给你一个只含数字的 <strong>非空</strong> 字符串 <code>s</code> ，请计算并返回 <strong>解码</strong> 方法的 <strong>总数</strong> 。如果没有合法的方式解码整个字符串，返回 <code>0</code>。</p>

    <p>题目数据保证答案肯定是一个 <strong>32 位</strong> 的整数。</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">示例 1</span>
        <div class="stmt-kv"><span>输入</span><code>s = "12"</code></div>
        <div class="stmt-kv"><span>输出</span><code>2</code></div>
        <div class="stmt-kv"><span>解释</span><span>它可以解码为 "AB"（1 2）或者 "L"（12）。</span></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">示例 2</span>
        <div class="stmt-kv"><span>输入</span><code>s = "226"</code></div>
        <div class="stmt-kv"><span>输出</span><code>3</code></div>
        <div class="stmt-kv"><span>解释</span><span>它可以解码为 "BZ" (2 26), "VF" (22 6), 或者 "BBF" (2 2 6) 。</span></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">示例 3</span>
        <div class="stmt-kv"><span>输入</span><code>s = "06"</code></div>
        <div class="stmt-kv"><span>输出</span><code>0</code></div>
        <div class="stmt-kv"><span>解释</span><span>"06" 无法映射到 "F" ，因为存在前导零（"6" 和 "06" 并不等价）。</span></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>提示：</strong>
      <ul>
        <li><code>1 &lt;= s.length &lt;= 100</code></li>
        <li><code>s</code> 只包含数字，并且可能包含前导零。</li>
      </ul>
    </div>
  `,

  en: `
    <p>You have intercepted a secret message encoded as a string of numbers. The message is
    <strong>decoded</strong> via the following mapping:</p>

    <p><code>"1" -&gt; 'A'<br />
    "2" -&gt; 'B'<br />
    ...<br />
    "25" -&gt; 'Y'<br />
    "26" -&gt; 'Z'</code></p>

    <p>However, while decoding the message, you realize that there are many different ways you can
    decode the message because some codes are contained in other codes (<code>"2"</code> and
    <code>"5"</code> vs <code>"25"</code>).</p>

    <p>For example, <code>"11106"</code> can be decoded into:</p>
    <ul>
      <li><code>"AAJF"</code> with the grouping <code>(1, 1, 10, 6)</code></li>
      <li><code>"KJF"</code> with the grouping <code>(11, 10, 6)</code></li>
      <li>The grouping <code>(1, 11, 06)</code> is invalid because <code>"06"</code> is not a valid
      code (only <code>"6"</code> is valid).</li>
    </ul>

    <p>Note: there may be strings that are impossible to decode.</p>

    <p>Given a string <code>s</code> containing only digits, return <em>the
    <strong>number of ways</strong> to <strong>decode</strong> it</em>. If the entire string cannot
    be decoded in any valid way, return <code>0</code>.</p>

    <p>The test cases are generated so that the answer fits in a <strong>32-bit</strong> integer.</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">Example 1</span>
        <div class="stmt-kv"><span>Input</span><code>s = "12"</code></div>
        <div class="stmt-kv"><span>Output</span><code>2</code></div>
        <div class="stmt-kv"><span>Explanation</span><span>"12" could be decoded as "AB" (1 2) or "L" (12).</span></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">Example 2</span>
        <div class="stmt-kv"><span>Input</span><code>s = "226"</code></div>
        <div class="stmt-kv"><span>Output</span><code>3</code></div>
        <div class="stmt-kv"><span>Explanation</span><span>"226" could be decoded as "BZ" (2 26), "VF" (22 6), or "BBF" (2 2 6).</span></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">Example 3</span>
        <div class="stmt-kv"><span>Input</span><code>s = "06"</code></div>
        <div class="stmt-kv"><span>Output</span><code>0</code></div>
        <div class="stmt-kv"><span>Explanation</span><span>"06" cannot be mapped to "F" because of the leading zero ("6" is different from "06").</span></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>Constraints:</strong>
      <ul>
        <li><code>1 &lt;= s.length &lt;= 100</code></li>
        <li><code>s</code> contains only digits and may contain leading zero(s).</li>
      </ul>
    </div>
  `,
}

/*
 * 271. 字符串的编码与解码 官方题面（leetcode.cn / .com，文字与示例与官方一致，结构重排）。
 * 注：这是一道会员题，站点无法拉取到官方正文，下面内容依据公开可见的经典题面忠实重建。
 */

export const src = {
  zh: 'https://leetcode.cn/problems/encode-and-decode-strings/',
  en: 'https://leetcode.com/problems/encode-and-decode-strings/',
}

export const statement = {
  zh: `
    <p>请你设计一个算法，可以将<strong>一个字符串数组</strong>编码成为<strong>一个字符串</strong>。
    这个编码后的字符串可以通过网络传输并被接收方解码回原来的字符串数组。</p>

    <p>1 号机（发送方）有如下函数：</p>
    <div class="example-box">
      <code>String encode(List&lt;String&gt; strs) { ... 返回 encoded_string; }</code>
    </div>
    <p>2 号机（接收方）有如下函数：</p>
    <div class="example-box">
      <code>List&lt;String&gt; decode(String s) { ... 返回 strs; }</code>
    </div>
    <p>也就是说，1 号机执行 <code>String msg = encode(strs)</code>，把 <code>msg</code> 发给 2 号机，
    2 号机执行 <code>List&lt;String&gt; strs2 = decode(msg)</code>，要求 <code>strs2</code> 必须和
    1 号机原始的 <code>strs</code> 完全一样。请你实现 <code>encode</code> 和 <code>decode</code> 这两个方法。</p>

    <p><strong>注意：</strong>不允许使用类似 <code>eval</code> 这样的「序列化」内置方法。</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">示例 1</span>
        <div class="stmt-kv"><span>输入</span><code>dummy_input = ["Hello","World"]</code></div>
        <div class="stmt-kv"><span>输出</span><code>["Hello","World"]</code></div>
        <div class="stmt-kv"><span>解释</span><span>
          1 号机：<code>Codec encoder = new Codec();</code> <code>String msg = encoder.encode(strs);</code>
          1 号机 ——msg——&gt; 2 号机；
          2 号机：<code>Codec decoder = new Codec();</code> <code>String[] strs = decoder.decode(msg);</code>
        </span></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">示例 2</span>
        <div class="stmt-kv"><span>输入</span><code>dummy_input = [""]</code></div>
        <div class="stmt-kv"><span>输出</span><code>[""]</code></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>提示：</strong>
      <ul>
        <li><code>1 &lt;= strs.length &lt;= 200</code></li>
        <li><code>0 &lt;= strs[i].length &lt;= 200</code></li>
        <li><code>strs[i]</code> 可以包含 256 个合法 ASCII 字符中的任意字符（包括逗号、井号、空格、空串等「捣乱」字符）。</li>
      </ul>
      <p class="dp-step__hint">进阶：你能写一个适用于任意可能字符的通用算法吗？</p>
    </div>
  `,

  en: `
    <p>Design an algorithm to encode <strong>a list of strings</strong> to <strong>a single
    string</strong>. The encoded string is then sent over the network and is decoded back to the
    original list of strings.</p>

    <p>Machine 1 (sender) has the function:</p>
    <div class="example-box">
      <code>String encode(List&lt;String&gt; strs) { ... return encoded_string; }</code>
    </div>
    <p>Machine 2 (receiver) has the function:</p>
    <div class="example-box">
      <code>List&lt;String&gt; decode(String s) { ... return strs; }</code>
    </div>
    <p>So Machine 1 does <code>String msg = encode(strs)</code>, sends <code>msg</code> to Machine 2,
    and Machine 2 does <code>List&lt;String&gt; strs2 = decode(msg)</code>. <code>strs2</code> in
    Machine 2 should be the same as <code>strs</code> in Machine 1. Implement the
    <code>encode</code> and <code>decode</code> methods.</p>

    <p><strong>Note:</strong> You are not allowed to solve the problem using any serialize methods
    (such as <code>eval</code>).</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">Example 1</span>
        <div class="stmt-kv"><span>Input</span><code>dummy_input = ["Hello","World"]</code></div>
        <div class="stmt-kv"><span>Output</span><code>["Hello","World"]</code></div>
        <div class="stmt-kv"><span>Explanation</span><span>
          Machine 1: <code>Codec encoder = new Codec();</code> <code>String msg = encoder.encode(strs);</code>
          Machine 1 ---msg---&gt; Machine 2;
          Machine 2: <code>Codec decoder = new Codec();</code> <code>String[] strs = decoder.decode(msg);</code>
        </span></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">Example 2</span>
        <div class="stmt-kv"><span>Input</span><code>dummy_input = [""]</code></div>
        <div class="stmt-kv"><span>Output</span><code>[""]</code></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>Constraints:</strong>
      <ul>
        <li><code>1 &lt;= strs.length &lt;= 200</code></li>
        <li><code>0 &lt;= strs[i].length &lt;= 200</code></li>
        <li><code>strs[i]</code> contains any possible characters out of 256 valid ASCII
        characters (including commas, hashes, spaces, and the empty string).</li>
      </ul>
      <p class="dp-step__hint">Follow-up: Could you write a generalized algorithm to work on any
      possible characters?</p>
    </div>
  `,
}

/* 338. 比特位计数 官方题面（leetcode.cn / .com，文字与示例与官方一致，结构重排）。 */

export const src = {
  zh: 'https://leetcode.cn/problems/counting-bits/',
  en: 'https://leetcode.com/problems/counting-bits/',
}

export const statement = {
  zh: `
    <p>给你一个整数 <code>n</code> ，对于 <code>0 &lt;= i &lt;= n</code> 中的每个 <code>i</code> ，
    计算其二进制表示中 <strong><code>1</code> 的个数</strong> ，返回一个长度为 <code>n + 1</code>
    的数组 <code>ans</code> 作为答案。</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">示例 1</span>
        <div class="stmt-kv"><span>输入</span><code>n = 2</code></div>
        <div class="stmt-kv"><span>输出</span><code>[0,1,1]</code></div>
        <div class="stmt-kv"><span>解释</span><span>0 --&gt; 0　　1 --&gt; 1　　2 --&gt; 10</span></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">示例 2</span>
        <div class="stmt-kv"><span>输入</span><code>n = 5</code></div>
        <div class="stmt-kv"><span>输出</span><code>[0,1,1,2,1,2]</code></div>
        <div class="stmt-kv"><span>解释</span><span>0 --&gt; 0　　1 --&gt; 1　　2 --&gt; 10　　3 --&gt; 11　　4 --&gt; 100　　5 --&gt; 101</span></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>提示：</strong>
      <ul>
        <li><code>0 &lt;= n &lt;= 10^5</code></li>
      </ul>
      <p class="dp-step__hint">
        进阶：很容易就能实现时间复杂度为 <code>O(n log n)</code> 的解决方案，你可以在线性时间复杂度
        <code>O(n)</code> 内用一趟扫描解决此问题吗？你能不使用任何内置函数解决此问题吗？
        （如，C++ 中的 <code>__builtin_popcount</code> ）
      </p>
    </div>
  `,

  en: `
    <p>Given an integer <code>n</code>, return <em>an array</em> <code>ans</code> <em>of length</em>
    <code>n + 1</code> <em>such that for each</em> <code>i</code> (<code>0 &lt;= i &lt;= n</code>),
    <code>ans[i]</code> <em>is the <strong>number of</strong></em> <code>1</code><em><strong>'s</strong>
    in the binary representation of</em> <code>i</code>.</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">Example 1</span>
        <div class="stmt-kv"><span>Input</span><code>n = 2</code></div>
        <div class="stmt-kv"><span>Output</span><code>[0,1,1]</code></div>
        <div class="stmt-kv"><span>Explanation</span><span>0 --&gt; 0　　1 --&gt; 1　　2 --&gt; 10</span></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">Example 2</span>
        <div class="stmt-kv"><span>Input</span><code>n = 5</code></div>
        <div class="stmt-kv"><span>Output</span><code>[0,1,1,2,1,2]</code></div>
        <div class="stmt-kv"><span>Explanation</span><span>0 --&gt; 0　　1 --&gt; 1　　2 --&gt; 10　　3 --&gt; 11　　4 --&gt; 100　　5 --&gt; 101</span></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>Constraints:</strong>
      <ul>
        <li><code>0 &lt;= n &lt;= 10^5</code></li>
      </ul>
      <p class="dp-step__hint">
        Follow up: It is very easy to come up with a solution with a runtime of
        <code>O(n log n)</code>. Can you do it in linear time <code>O(n)</code> and possibly in a
        single pass? Can you do it without using any built-in function (i.e., like
        <code>__builtin_popcount</code> in C++)?
      </p>
    </div>
  `,
}

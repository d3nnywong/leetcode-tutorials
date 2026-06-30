/* 100. 相同的树 官方题面（leetcode.cn / .com，文字与示例与官方一致，结构重排）。 */

export const src = {
  zh: 'https://leetcode.cn/problems/same-tree/',
  en: 'https://leetcode.com/problems/same-tree/',
}

export const statement = {
  zh: `
    <p>给你两棵二叉树的根节点 <code>p</code> 和 <code>q</code>，编写一个函数来检验这两棵树是否相同。</p>

    <p>如果两个树在结构上相同，并且节点具有相同的值，则认为它们是相同的。</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">示例 1</span>
        <div class="stmt-kv"><span>输入</span><code>p = [1,2,3], q = [1,2,3]</code></div>
        <div class="stmt-kv"><span>输出</span><code>true</code></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">示例 2</span>
        <div class="stmt-kv"><span>输入</span><code>p = [1,2], q = [1,null,2]</code></div>
        <div class="stmt-kv"><span>输出</span><code>false</code></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">示例 3</span>
        <div class="stmt-kv"><span>输入</span><code>p = [1,2,1], q = [1,1,2]</code></div>
        <div class="stmt-kv"><span>输出</span><code>false</code></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>提示：</strong>
      <ul>
        <li>两棵树上的节点数目都在范围 <code>[0, 100]</code> 内</li>
        <li><code>-10^4 &lt;= Node.val &lt;= 10^4</code></li>
      </ul>
    </div>
  `,

  en: `
    <p>Given the roots of two binary trees <code>p</code> and <code>q</code>, write a function to
    check if they are the same or not.</p>

    <p>Two binary trees are considered the same if they are structurally identical, and the nodes
    have the same value.</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">Example 1</span>
        <div class="stmt-kv"><span>Input</span><code>p = [1,2,3], q = [1,2,3]</code></div>
        <div class="stmt-kv"><span>Output</span><code>true</code></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">Example 2</span>
        <div class="stmt-kv"><span>Input</span><code>p = [1,2], q = [1,null,2]</code></div>
        <div class="stmt-kv"><span>Output</span><code>false</code></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">Example 3</span>
        <div class="stmt-kv"><span>Input</span><code>p = [1,2,1], q = [1,1,2]</code></div>
        <div class="stmt-kv"><span>Output</span><code>false</code></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>Constraints:</strong>
      <ul>
        <li>The number of nodes in both trees is in the range <code>[0, 100]</code>.</li>
        <li><code>-10^4 &lt;= Node.val &lt;= 10^4</code></li>
      </ul>
    </div>
  `,
}

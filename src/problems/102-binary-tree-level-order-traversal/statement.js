/* 102. 二叉树的层序遍历 官方题面（leetcode.cn / .com，文字与示例与官方一致，结构重排）。 */

export const src = {
  zh: 'https://leetcode.cn/problems/binary-tree-level-order-traversal/',
  en: 'https://leetcode.com/problems/binary-tree-level-order-traversal/',
}

export const statement = {
  zh: `
    <p>给你二叉树的根节点 <code>root</code>，返回其节点值的 <strong>层序遍历</strong>。
    （即逐层地，从左到右访问所有节点）。</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">示例 1</span>
        <div class="stmt-kv"><span>输入</span><code>root = [3,9,20,null,null,15,7]</code></div>
        <div class="stmt-kv"><span>输出</span><code>[[3],[9,20],[15,7]]</code></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">示例 2</span>
        <div class="stmt-kv"><span>输入</span><code>root = [1]</code></div>
        <div class="stmt-kv"><span>输出</span><code>[[1]]</code></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">示例 3</span>
        <div class="stmt-kv"><span>输入</span><code>root = []</code></div>
        <div class="stmt-kv"><span>输出</span><code>[]</code></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>提示：</strong>
      <ul>
        <li>树中节点数目在范围 <code>[0, 2000]</code> 内</li>
        <li><code>-1000 &lt;= Node.val &lt;= 1000</code></li>
      </ul>
    </div>
  `,

  en: `
    <p>Given the <code>root</code> of a binary tree, return <em>the level order traversal of its
    nodes' values</em>. (i.e., from left to right, level by level).</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">Example 1</span>
        <div class="stmt-kv"><span>Input</span><code>root = [3,9,20,null,null,15,7]</code></div>
        <div class="stmt-kv"><span>Output</span><code>[[3],[9,20],[15,7]]</code></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">Example 2</span>
        <div class="stmt-kv"><span>Input</span><code>root = [1]</code></div>
        <div class="stmt-kv"><span>Output</span><code>[[1]]</code></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">Example 3</span>
        <div class="stmt-kv"><span>Input</span><code>root = []</code></div>
        <div class="stmt-kv"><span>Output</span><code>[]</code></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>Constraints:</strong>
      <ul>
        <li>The number of nodes in the tree is in the range <code>[0, 2000]</code>.</li>
        <li><code>-1000 &lt;= Node.val &lt;= 1000</code></li>
      </ul>
    </div>
  `,
}

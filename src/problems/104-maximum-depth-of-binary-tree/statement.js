/* 104. 二叉树的最大深度 官方题面（leetcode.cn / .com，文字与示例与官方一致，结构重排）。 */

export const src = {
  zh: 'https://leetcode.cn/problems/maximum-depth-of-binary-tree/',
  en: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/',
}

export const statement = {
  zh: `
    <p>给定一个二叉树 <code>root</code> ，返回其最大深度。</p>

    <p>二叉树的 <strong>最大深度</strong> 是指从根节点到最远叶子节点的最长路径上的节点数。</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">示例 1</span>
        <div class="stmt-kv"><span>输入</span><code>root = [3,9,20,null,null,15,7]</code></div>
        <div class="stmt-kv"><span>输出</span><code>3</code></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">示例 2</span>
        <div class="stmt-kv"><span>输入</span><code>root = [1,null,2]</code></div>
        <div class="stmt-kv"><span>输出</span><code>2</code></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>提示：</strong>
      <ul>
        <li>树中节点的数量在 <code>[0, 10^4]</code> 区间内。</li>
        <li><code>-100 &lt;= Node.val &lt;= 100</code></li>
      </ul>
    </div>
  `,

  en: `
    <p>Given the <code>root</code> of a binary tree, return <em>its maximum depth</em>.</p>

    <p>A binary tree's <strong>maximum depth</strong> is the number of nodes along the longest
    path from the root node down to the farthest leaf node.</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">Example 1</span>
        <div class="stmt-kv"><span>Input</span><code>root = [3,9,20,null,null,15,7]</code></div>
        <div class="stmt-kv"><span>Output</span><code>3</code></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">Example 2</span>
        <div class="stmt-kv"><span>Input</span><code>root = [1,null,2]</code></div>
        <div class="stmt-kv"><span>Output</span><code>2</code></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>Constraints:</strong>
      <ul>
        <li>The number of nodes in the tree is in the range <code>[0, 10^4]</code>.</li>
        <li><code>-100 &lt;= Node.val &lt;= 100</code></li>
      </ul>
    </div>
  `,
}

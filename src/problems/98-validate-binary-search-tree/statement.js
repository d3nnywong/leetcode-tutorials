/* 98. 验证二叉搜索树 官方题面（leetcode.cn / .com，文字与示例与官方一致，结构重排）。 */

export const src = {
  zh: 'https://leetcode.cn/problems/validate-binary-search-tree/',
  en: 'https://leetcode.com/problems/validate-binary-search-tree/',
}

export const statement = {
  zh: `
    <p>给你一个二叉树的根节点 <code>root</code> ，判断其是否是一个有效的<strong>二叉搜索树</strong>。</p>

    <p><strong>有效</strong> 二叉搜索树定义如下：</p>
    <ul>
      <li>节点的左子树只包含 <strong>严格小于</strong> 当前节点的数。</li>
      <li>节点的右子树只包含 <strong>严格大于</strong> 当前节点的数。</li>
      <li>所有左子树和右子树自身必须也是二叉搜索树。</li>
    </ul>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">示例 1</span>
        <div class="stmt-kv"><span>输入</span><code>root = [2,1,3]</code></div>
        <div class="stmt-kv"><span>输出</span><code>true</code></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">示例 2</span>
        <div class="stmt-kv"><span>输入</span><code>root = [5,1,4,null,null,3,6]</code></div>
        <div class="stmt-kv"><span>输出</span><code>false</code></div>
        <div class="stmt-kv"><span>解释</span><span>根节点的值是 5 ，但是右子节点的值是 4 。</span></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>提示：</strong>
      <ul>
        <li>树中节点数目范围在 <code>[1, 10^4]</code> 内</li>
        <li><code>-2^31 &lt;= Node.val &lt;= 2^31 - 1</code></li>
      </ul>
    </div>
  `,

  en: `
    <p>Given the <code>root</code> of a binary tree, <em>determine if it is a valid binary search tree (BST)</em>.</p>

    <p>A <strong>valid BST</strong> is defined as follows:</p>
    <ul>
      <li>The left subtree of a node contains only nodes with keys <strong>strictly less than</strong> the node's key.</li>
      <li>The right subtree of a node contains only nodes with keys <strong>strictly greater than</strong> the node's key.</li>
      <li>Both the left and right subtrees must also be binary search trees.</li>
    </ul>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">Example 1</span>
        <div class="stmt-kv"><span>Input</span><code>root = [2,1,3]</code></div>
        <div class="stmt-kv"><span>Output</span><code>true</code></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">Example 2</span>
        <div class="stmt-kv"><span>Input</span><code>root = [5,1,4,null,null,3,6]</code></div>
        <div class="stmt-kv"><span>Output</span><code>false</code></div>
        <div class="stmt-kv"><span>Explanation</span><span>The root node's value is 5 but its right child's value is 4.</span></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>Constraints:</strong>
      <ul>
        <li>The number of nodes in the tree is in the range <code>[1, 10^4]</code>.</li>
        <li><code>-2^31 &lt;= Node.val &lt;= 2^31 - 1</code></li>
      </ul>
    </div>
  `,
}

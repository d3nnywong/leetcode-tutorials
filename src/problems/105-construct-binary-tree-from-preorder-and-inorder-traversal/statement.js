/* 105. 从前序与中序遍历序列构造二叉树 官方题面（leetcode.cn / .com，文字与示例与官方一致，结构重排）。 */

export const src = {
  zh: 'https://leetcode.cn/problems/construct-binary-tree-from-preorder-and-inorder-traversal/',
  en: 'https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/',
}

export const statement = {
  zh: `
    <p>给定两个整数数组 <code>preorder</code> 和 <code>inorder</code> ，其中 <code>preorder</code>
    是二叉树的<strong>先序遍历</strong>， <code>inorder</code> 是同一棵树的<strong>中序遍历</strong>，
    请构造二叉树并返回其根节点。</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">示例 1</span>
        <div class="stmt-kv"><span>输入</span><code>preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]</code></div>
        <div class="stmt-kv"><span>输出</span><code>[3,9,20,null,null,15,7]</code></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">示例 2</span>
        <div class="stmt-kv"><span>输入</span><code>preorder = [-1], inorder = [-1]</code></div>
        <div class="stmt-kv"><span>输出</span><code>[-1]</code></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>提示：</strong>
      <ul>
        <li><code>1 &lt;= preorder.length &lt;= 3000</code></li>
        <li><code>inorder.length == preorder.length</code></li>
        <li><code>-3000 &lt;= preorder[i], inorder[i] &lt;= 3000</code></li>
        <li><code>preorder</code> 和 <code>inorder</code> 均 <strong>无重复</strong> 元素</li>
        <li><code>inorder</code> 均出现在 <code>preorder</code></li>
        <li><code>preorder</code> <strong>保证</strong> 为二叉树的先序遍历序列</li>
        <li><code>inorder</code> <strong>保证</strong> 为二叉树的中序遍历序列</li>
      </ul>
    </div>
  `,

  en: `
    <p>Given two integer arrays <code>preorder</code> and <code>inorder</code> where
    <code>preorder</code> is the preorder traversal of a binary tree and <code>inorder</code> is
    the inorder traversal of the same tree, construct and return <em>the binary tree</em>.</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">Example 1</span>
        <div class="stmt-kv"><span>Input</span><code>preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]</code></div>
        <div class="stmt-kv"><span>Output</span><code>[3,9,20,null,null,15,7]</code></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">Example 2</span>
        <div class="stmt-kv"><span>Input</span><code>preorder = [-1], inorder = [-1]</code></div>
        <div class="stmt-kv"><span>Output</span><code>[-1]</code></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>Constraints:</strong>
      <ul>
        <li><code>1 &lt;= preorder.length &lt;= 3000</code></li>
        <li><code>inorder.length == preorder.length</code></li>
        <li><code>-3000 &lt;= preorder[i], inorder[i] &lt;= 3000</code></li>
        <li><code>preorder</code> and <code>inorder</code> consist of <strong>unique</strong> values.</li>
        <li>Each value of <code>inorder</code> also appears in <code>preorder</code>.</li>
        <li><code>preorder</code> is <strong>guaranteed</strong> to be the preorder traversal of the tree.</li>
        <li><code>inorder</code> is <strong>guaranteed</strong> to be the inorder traversal of the tree.</li>
      </ul>
    </div>
  `,
}

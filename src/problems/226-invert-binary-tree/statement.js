/* 226. 翻转二叉树 官方题面（leetcode.cn / .com，文字与示例与官方一致，结构重排）。 */

export const src = {
  zh: 'https://leetcode.cn/problems/invert-binary-tree/',
  en: 'https://leetcode.com/problems/invert-binary-tree/',
}

export const statement = {
  zh: `
    <p>给你一棵二叉树的根节点 <code>root</code> ，翻转这棵二叉树，并返回其根节点。</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">示例 1</span>
        <div class="stmt-kv"><span>输入</span><code>root = [4,2,7,1,3,6,9]</code></div>
        <div class="stmt-kv"><span>输出</span><code>[4,7,2,9,6,3,1]</code></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">示例 2</span>
        <div class="stmt-kv"><span>输入</span><code>root = [2,1,3]</code></div>
        <div class="stmt-kv"><span>输出</span><code>[2,3,1]</code></div>
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
        <li>树中节点数目范围在 <code>[0, 100]</code> 内</li>
        <li><code>-100 &lt;= Node.val &lt;= 100</code></li>
      </ul>
    </div>
  `,

  en: `
    <p>Given the <code>root</code> of a binary tree, invert the tree, and return <em>its root</em>.</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">Example 1</span>
        <div class="stmt-kv"><span>Input</span><code>root = [4,2,7,1,3,6,9]</code></div>
        <div class="stmt-kv"><span>Output</span><code>[4,7,2,9,6,3,1]</code></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">Example 2</span>
        <div class="stmt-kv"><span>Input</span><code>root = [2,1,3]</code></div>
        <div class="stmt-kv"><span>Output</span><code>[2,3,1]</code></div>
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
        <li>The number of nodes in the tree is in the range <code>[0, 100]</code>.</li>
        <li><code>-100 &lt;= Node.val &lt;= 100</code></li>
      </ul>
    </div>
  `,
}

/* 572. 另一棵树的子树 官方题面（leetcode.cn / .com，文字与示例与官方一致，结构重排）。 */

export const src = {
  zh: 'https://leetcode.cn/problems/subtree-of-another-tree/',
  en: 'https://leetcode.com/problems/subtree-of-another-tree/',
}

export const statement = {
  zh: `
    <p>给你两棵二叉树 <code>root</code> 和 <code>subRoot</code>。检验 <code>root</code> 中是否包含和
    <code>subRoot</code> 具有相同结构和节点值的子树。如果存在，返回 <code>true</code>；否则，返回
    <code>false</code>。</p>

    <p>二叉树 <code>tree</code> 的一棵子树包括 <code>tree</code> 的某个节点和这个节点的所有后代节点。
    <code>tree</code> 也可以看做它自身的一棵子树。</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">示例 1</span>
        <div class="stmt-kv"><span>输入</span><code>root = [3,4,5,1,2], subRoot = [4,1,2]</code></div>
        <div class="stmt-kv"><span>输出</span><code>true</code></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">示例 2</span>
        <div class="stmt-kv"><span>输入</span><code>root = [3,4,5,1,2,null,null,null,null,0], subRoot = [4,1,2]</code></div>
        <div class="stmt-kv"><span>输出</span><code>false</code></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>提示：</strong>
      <ul>
        <li><code>root</code> 树上的节点数量范围是 <code>[1, 2000]</code></li>
        <li><code>subRoot</code> 树上的节点数量范围是 <code>[1, 1000]</code></li>
        <li><code>-10^4 &lt;= root.val &lt;= 10^4</code></li>
        <li><code>-10^4 &lt;= subRoot.val &lt;= 10^4</code></li>
      </ul>
    </div>
  `,

  en: `
    <p>Given the roots of two binary trees <code>root</code> and <code>subRoot</code>, return
    <code>true</code> if there is a subtree of <code>root</code> with the same structure and node
    values of <code>subRoot</code> and <code>false</code> otherwise.</p>

    <p>A subtree of a binary tree <code>tree</code> is a tree that consists of a node in
    <code>tree</code> and all of this node's descendants. The tree <code>tree</code> could also be
    considered as a subtree of itself.</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">Example 1</span>
        <div class="stmt-kv"><span>Input</span><code>root = [3,4,5,1,2], subRoot = [4,1,2]</code></div>
        <div class="stmt-kv"><span>Output</span><code>true</code></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">Example 2</span>
        <div class="stmt-kv"><span>Input</span><code>root = [3,4,5,1,2,null,null,null,null,0], subRoot = [4,1,2]</code></div>
        <div class="stmt-kv"><span>Output</span><code>false</code></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>Constraints:</strong>
      <ul>
        <li>The number of nodes in the <code>root</code> tree is in the range <code>[1, 2000]</code>.</li>
        <li>The number of nodes in the <code>subRoot</code> tree is in the range <code>[1, 1000]</code>.</li>
        <li><code>-10^4 &lt;= root.val &lt;= 10^4</code></li>
        <li><code>-10^4 &lt;= subRoot.val &lt;= 10^4</code></li>
      </ul>
    </div>
  `,
}

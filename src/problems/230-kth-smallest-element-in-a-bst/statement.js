/* 230. 二叉搜索树中第 K 小的元素 官方题面（leetcode.cn / .com，文字与示例与官方一致，结构重排）。 */

export const src = {
  zh: 'https://leetcode.cn/problems/kth-smallest-element-in-a-bst/',
  en: 'https://leetcode.com/problems/kth-smallest-element-in-a-bst/',
}

export const statement = {
  zh: `
    <p>给定一个二叉搜索树的根节点 <code>root</code>，和一个整数 <code>k</code>，请你设计一个算法
    查找其中第 <code>k</code> <strong>小</strong>的元素（<code>k</code> 从 1 开始计数）。</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">示例 1</span>
        <div class="stmt-kv"><span>输入</span><code>root = [3,1,4,null,2], k = 1</code></div>
        <div class="stmt-kv"><span>输出</span><code>1</code></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">示例 2</span>
        <div class="stmt-kv"><span>输入</span><code>root = [5,3,6,2,4,null,null,1], k = 3</code></div>
        <div class="stmt-kv"><span>输出</span><code>3</code></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>提示：</strong>
      <ul>
        <li>树中的节点数为 <code>n</code> 。</li>
        <li><code>1 &lt;= k &lt;= n &lt;= 10^4</code></li>
        <li><code>0 &lt;= Node.val &lt;= 10^4</code></li>
      </ul>
      <p class="dp-step__hint">
        进阶：如果二叉搜索树经常被修改（插入/删除操作）并且你需要频繁地查找第 <code>k</code> 小的值，
        你将如何优化算法？
      </p>
    </div>
  `,

  en: `
    <p>Given the <code>root</code> of a binary search tree, and an integer <code>k</code>, return
    <em>the</em> <code>k<sup>th</sup></code> <em>smallest value (<strong>1-indexed</strong>) of all
    the values of the nodes in the tree</em>.</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">Example 1</span>
        <div class="stmt-kv"><span>Input</span><code>root = [3,1,4,null,2], k = 1</code></div>
        <div class="stmt-kv"><span>Output</span><code>1</code></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">Example 2</span>
        <div class="stmt-kv"><span>Input</span><code>root = [5,3,6,2,4,null,null,1], k = 3</code></div>
        <div class="stmt-kv"><span>Output</span><code>3</code></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>Constraints:</strong>
      <ul>
        <li>The number of nodes in the tree is <code>n</code>.</li>
        <li><code>1 &lt;= k &lt;= n &lt;= 10^4</code></li>
        <li><code>0 &lt;= Node.val &lt;= 10^4</code></li>
      </ul>
      <p class="dp-step__hint">
        Follow up: If the BST is modified often (i.e., we can do insert and delete operations) and
        you need to find the kth smallest frequently, how would you optimize?
      </p>
    </div>
  `,
}

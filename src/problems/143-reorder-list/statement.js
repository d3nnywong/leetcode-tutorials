/* 143. 重排链表 官方题面（leetcode.cn / .com，文字与示例与官方一致，结构重排）。 */

export const src = {
  zh: 'https://leetcode.cn/problems/reorder-list/',
  en: 'https://leetcode.com/problems/reorder-list/',
}

export const statement = {
  zh: `
    <p>给定一个单链表 <code>L</code> 的头节点 <code>head</code>，单链表 <code>L</code> 表示为：</p>
    <p><code>L0 → L1 → … → L(n - 1) → Ln</code></p>

    <p>请将其重新排列后变为：</p>
    <p><code>L0 → Ln → L1 → L(n - 1) → L2 → L(n - 2) → …</code></p>

    <p>不能只是单纯地改变节点内部的值，而是需要实际的进行节点交换。</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">示例 1</span>
        <div class="stmt-kv"><span>输入</span><code>head = [1,2,3,4]</code></div>
        <div class="stmt-kv"><span>输出</span><code>[1,4,2,3]</code></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">示例 2</span>
        <div class="stmt-kv"><span>输入</span><code>head = [1,2,3,4,5]</code></div>
        <div class="stmt-kv"><span>输出</span><code>[1,5,2,4,3]</code></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>提示：</strong>
      <ul>
        <li>链表的长度范围为 <code>[1, 5 * 10^4]</code></li>
        <li><code>1 &lt;= Node.val &lt;= 1000</code></li>
      </ul>
    </div>
  `,

  en: `
    <p>You are given the head of a singly linked-list. The list can be represented as:</p>
    <p><code>L0 → L1 → … → L(n - 1) → Ln</code></p>

    <p><em>Reorder the list to be on the following form:</em></p>
    <p><code>L0 → Ln → L1 → L(n - 1) → L2 → L(n - 2) → …</code></p>

    <p>You may not modify the values in the list's nodes. Only nodes themselves may be changed.</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">Example 1</span>
        <div class="stmt-kv"><span>Input</span><code>head = [1,2,3,4]</code></div>
        <div class="stmt-kv"><span>Output</span><code>[1,4,2,3]</code></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">Example 2</span>
        <div class="stmt-kv"><span>Input</span><code>head = [1,2,3,4,5]</code></div>
        <div class="stmt-kv"><span>Output</span><code>[1,5,2,4,3]</code></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>Constraints:</strong>
      <ul>
        <li>The number of nodes in the list is in the range <code>[1, 5 * 10^4]</code>.</li>
        <li><code>1 &lt;= Node.val &lt;= 1000</code></li>
      </ul>
    </div>
  `,
}

/* 206. 反转链表 官方题面（leetcode.cn / .com，文字与示例与官方一致，结构重排）。 */

export const src = {
  zh: 'https://leetcode.cn/problems/reverse-linked-list/',
  en: 'https://leetcode.com/problems/reverse-linked-list/',
}

export const statement = {
  zh: `
    <p>给你单链表的头节点 <code>head</code> ，请你反转链表，并返回反转后的链表。</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">示例 1</span>
        <div class="stmt-kv"><span>输入</span><code>head = [1,2,3,4,5]</code></div>
        <div class="stmt-kv"><span>输出</span><code>[5,4,3,2,1]</code></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">示例 2</span>
        <div class="stmt-kv"><span>输入</span><code>head = [1,2]</code></div>
        <div class="stmt-kv"><span>输出</span><code>[2,1]</code></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">示例 3</span>
        <div class="stmt-kv"><span>输入</span><code>head = []</code></div>
        <div class="stmt-kv"><span>输出</span><code>[]</code></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>提示：</strong>
      <ul>
        <li>链表中节点的数目范围是 <code>[0, 5000]</code></li>
        <li><code>-5000 &lt;= Node.val &lt;= 5000</code></li>
      </ul>
      <p class="dp-step__hint">进阶：链表可以选用迭代或递归方式完成反转。你能否用两种方法解决这道题？</p>
    </div>
  `,

  en: `
    <p>Given the <code>head</code> of a singly linked list, reverse the list, and return
    <em>the reversed list</em>.</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">Example 1</span>
        <div class="stmt-kv"><span>Input</span><code>head = [1,2,3,4,5]</code></div>
        <div class="stmt-kv"><span>Output</span><code>[5,4,3,2,1]</code></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">Example 2</span>
        <div class="stmt-kv"><span>Input</span><code>head = [1,2]</code></div>
        <div class="stmt-kv"><span>Output</span><code>[2,1]</code></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">Example 3</span>
        <div class="stmt-kv"><span>Input</span><code>head = []</code></div>
        <div class="stmt-kv"><span>Output</span><code>[]</code></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>Constraints:</strong>
      <ul>
        <li>The number of nodes in the list is the range <code>[0, 5000]</code>.</li>
        <li><code>-5000 &lt;= Node.val &lt;= 5000</code></li>
      </ul>
      <p class="dp-step__hint">Follow up: A linked list can be reversed either iteratively or recursively. Could you implement both?</p>
    </div>
  `,
}

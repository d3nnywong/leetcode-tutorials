/* 141. 环形链表 官方题面（leetcode.cn / .com，文字与示例与官方一致，结构重排）。 */

export const src = {
  zh: 'https://leetcode.cn/problems/linked-list-cycle/',
  en: 'https://leetcode.com/problems/linked-list-cycle/',
}

export const statement = {
  zh: `
    <p>给你一个链表的头节点 <code>head</code> ，判断链表中是否有环。</p>

    <p>如果链表中有某个节点，可以通过连续跟踪 <code>next</code> 指针再次到达，则链表中存在环。
    为了表示给定链表中的环，评测系统内部使用整数 <code>pos</code> 来表示链表尾连接到链表中的位置
    （索引从 0 开始）。<strong>注意：<code>pos</code> 不作为参数进行传递</strong>，仅仅是为了标识链表的实际情况。</p>

    <p>如果链表中存在环，则返回 <code>true</code>。否则，返回 <code>false</code>。</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">示例 1</span>
        <div class="stmt-kv"><span>输入</span><code>head = [3,2,0,-4], pos = 1</code></div>
        <div class="stmt-kv"><span>输出</span><code>true</code></div>
        <div class="stmt-kv"><span>解释</span><span>链表中有一个环，其尾部连接到第二个节点（下标 1）。</span></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">示例 2</span>
        <div class="stmt-kv"><span>输入</span><code>head = [1,2], pos = 0</code></div>
        <div class="stmt-kv"><span>输出</span><code>true</code></div>
        <div class="stmt-kv"><span>解释</span><span>链表中有一个环，其尾部连接到第一个节点（下标 0）。</span></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">示例 3</span>
        <div class="stmt-kv"><span>输入</span><code>head = [1], pos = -1</code></div>
        <div class="stmt-kv"><span>输出</span><code>false</code></div>
        <div class="stmt-kv"><span>解释</span><span>链表中没有环。</span></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>提示：</strong>
      <ul>
        <li>链表中节点的数目范围是 <code>[0, 10^4]</code></li>
        <li><code>-10^5 &lt;= Node.val &lt;= 10^5</code></li>
        <li><code>pos</code> 为 <code>-1</code> 或者链表中的一个 <strong>有效索引</strong>。</li>
      </ul>
      <p class="dp-step__hint">进阶：你能用 <code>O(1)</code>（即，常量）内存解决此问题吗？</p>
    </div>
  `,

  en: `
    <p>Given <code>head</code>, the head of a linked list, determine if the linked list has a cycle in it.</p>

    <p>There is a cycle in a linked list if there is some node in the list that can be reached again
    by continuously following the <code>next</code> pointer. Internally, <code>pos</code> is used to
    denote the index of the node that tail's <code>next</code> pointer is connected to.
    <strong>Note that <code>pos</code> is not passed as a parameter</strong>.</p>

    <p>Return <code>true</code> <em>if there is a cycle in the linked list</em>. Otherwise, return <code>false</code>.</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">Example 1</span>
        <div class="stmt-kv"><span>Input</span><code>head = [3,2,0,-4], pos = 1</code></div>
        <div class="stmt-kv"><span>Output</span><code>true</code></div>
        <div class="stmt-kv"><span>Explanation</span><span>There is a cycle in the linked list, where the tail connects to the 1st node (0-indexed).</span></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">Example 2</span>
        <div class="stmt-kv"><span>Input</span><code>head = [1,2], pos = 0</code></div>
        <div class="stmt-kv"><span>Output</span><code>true</code></div>
        <div class="stmt-kv"><span>Explanation</span><span>There is a cycle in the linked list, where the tail connects to the 0th node.</span></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">Example 3</span>
        <div class="stmt-kv"><span>Input</span><code>head = [1], pos = -1</code></div>
        <div class="stmt-kv"><span>Output</span><code>false</code></div>
        <div class="stmt-kv"><span>Explanation</span><span>There is no cycle in the linked list.</span></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>Constraints:</strong>
      <ul>
        <li>The number of the nodes in the list is in the range <code>[0, 10^4]</code></li>
        <li><code>-10^5 &lt;= Node.val &lt;= 10^5</code></li>
        <li><code>pos</code> is <code>-1</code> or a <strong>valid index</strong> in the linked-list.</li>
      </ul>
      <p class="dp-step__hint">Follow up: Can you solve it using <code>O(1)</code> (i.e. constant) memory?</p>
    </div>
  `,
}

/* 21. 合并两个有序链表 官方题面（leetcode.cn / .com，文字与示例与官方一致，结构重排）。 */

export const src = {
  zh: 'https://leetcode.cn/problems/merge-two-sorted-lists/',
  en: 'https://leetcode.com/problems/merge-two-sorted-lists/',
}

export const statement = {
  zh: `
    <p>将两个 <strong>升序</strong> 链表合并为一个新的 <strong>升序</strong> 链表并返回。新链表是通过
    拼接给定的两个链表的所有节点组成的。</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">示例 1</span>
        <div class="stmt-kv"><span>输入</span><code>list1 = [1,2,4], list2 = [1,3,4]</code></div>
        <div class="stmt-kv"><span>输出</span><code>[1,1,2,3,4,4]</code></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">示例 2</span>
        <div class="stmt-kv"><span>输入</span><code>list1 = [], list2 = []</code></div>
        <div class="stmt-kv"><span>输出</span><code>[]</code></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">示例 3</span>
        <div class="stmt-kv"><span>输入</span><code>list1 = [], list2 = [0]</code></div>
        <div class="stmt-kv"><span>输出</span><code>[0]</code></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>提示：</strong>
      <ul>
        <li>两个链表的节点数目范围是 <code>[0, 50]</code></li>
        <li><code>-100 &lt;= Node.val &lt;= 100</code></li>
        <li><code>list1</code> 和 <code>list2</code> 均按 <strong>非递减顺序</strong> 排列</li>
      </ul>
    </div>
  `,

  en: `
    <p>You are given the heads of two sorted linked lists <code>list1</code> and
    <code>list2</code>.</p>

    <p>Merge the two lists into one <strong>sorted</strong> list. The list should be made by
    splicing together the nodes of the first two lists.</p>

    <p>Return <em>the head of the merged linked list</em>.</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">Example 1</span>
        <div class="stmt-kv"><span>Input</span><code>list1 = [1,2,4], list2 = [1,3,4]</code></div>
        <div class="stmt-kv"><span>Output</span><code>[1,1,2,3,4,4]</code></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">Example 2</span>
        <div class="stmt-kv"><span>Input</span><code>list1 = [], list2 = []</code></div>
        <div class="stmt-kv"><span>Output</span><code>[]</code></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">Example 3</span>
        <div class="stmt-kv"><span>Input</span><code>list1 = [], list2 = [0]</code></div>
        <div class="stmt-kv"><span>Output</span><code>[0]</code></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>Constraints:</strong>
      <ul>
        <li>The number of nodes in both lists is in the range <code>[0, 50]</code></li>
        <li><code>-100 &lt;= Node.val &lt;= 100</code></li>
        <li>Both <code>list1</code> and <code>list2</code> are sorted in <strong>non-decreasing</strong> order</li>
      </ul>
    </div>
  `,
}

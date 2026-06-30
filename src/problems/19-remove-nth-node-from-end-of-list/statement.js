/* 19. 删除链表的倒数第 N 个结点 官方题面（leetcode.cn / .com，文字与示例与官方一致，结构重排）。 */

export const src = {
  zh: 'https://leetcode.cn/problems/remove-nth-node-from-end-of-list/',
  en: 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/',
}

export const statement = {
  zh: `
    <p>给你一个链表，删除链表的倒数第 <code>n</code> 个结点，并且返回链表的头结点。</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">示例 1</span>
        <div class="stmt-kv"><span>输入</span><code>head = [1,2,3,4,5], n = 2</code></div>
        <div class="stmt-kv"><span>输出</span><code>[1,2,3,5]</code></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">示例 2</span>
        <div class="stmt-kv"><span>输入</span><code>head = [1], n = 1</code></div>
        <div class="stmt-kv"><span>输出</span><code>[]</code></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">示例 3</span>
        <div class="stmt-kv"><span>输入</span><code>head = [1,2], n = 1</code></div>
        <div class="stmt-kv"><span>输出</span><code>[1]</code></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>提示：</strong>
      <ul>
        <li>链表中结点的数目为 <code>sz</code></li>
        <li><code>1 &lt;= sz &lt;= 30</code></li>
        <li><code>0 &lt;= Node.val &lt;= 100</code></li>
        <li><code>1 &lt;= n &lt;= sz</code></li>
      </ul>
      <p class="dp-step__hint">进阶：你能尝试使用一趟扫描实现吗？</p>
    </div>
  `,

  en: `
    <p>Given the <code>head</code> of a linked list, remove the <code>n<sup>th</sup></code> node
    from the end of the list and return its head.</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">Example 1</span>
        <div class="stmt-kv"><span>Input</span><code>head = [1,2,3,4,5], n = 2</code></div>
        <div class="stmt-kv"><span>Output</span><code>[1,2,3,5]</code></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">Example 2</span>
        <div class="stmt-kv"><span>Input</span><code>head = [1], n = 1</code></div>
        <div class="stmt-kv"><span>Output</span><code>[]</code></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">Example 3</span>
        <div class="stmt-kv"><span>Input</span><code>head = [1,2], n = 1</code></div>
        <div class="stmt-kv"><span>Output</span><code>[1]</code></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>Constraints:</strong>
      <ul>
        <li>The number of nodes in the list is <code>sz</code>.</li>
        <li><code>1 &lt;= sz &lt;= 30</code></li>
        <li><code>0 &lt;= Node.val &lt;= 100</code></li>
        <li><code>1 &lt;= n &lt;= sz</code></li>
      </ul>
      <p class="dp-step__hint">Follow up: Could you do this in one pass?</p>
    </div>
  `,
}

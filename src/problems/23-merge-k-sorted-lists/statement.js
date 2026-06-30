/* 23. 合并 K 个升序链表 官方题面（leetcode.cn / .com，文字与示例与官方一致，结构重排）。 */

export const src = {
  zh: 'https://leetcode.cn/problems/merge-k-sorted-lists/',
  en: 'https://leetcode.com/problems/merge-k-sorted-lists/',
}

export const statement = {
  zh: `
    <p>给你一个链表数组，每个链表都已经按升序排列。</p>

    <p>请你将所有链表合并到一个升序链表中，返回合并后的链表。</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">示例 1</span>
        <div class="stmt-kv"><span>输入</span><code>lists = [[1,4,5],[1,3,4],[2,6]]</code></div>
        <div class="stmt-kv"><span>输出</span><code>[1,1,2,3,4,4,5,6]</code></div>
        <div class="stmt-kv"><span>解释</span><span>链表数组如下：
[
&nbsp;&nbsp;1-&gt;4-&gt;5,
&nbsp;&nbsp;1-&gt;3-&gt;4,
&nbsp;&nbsp;2-&gt;6
]
将它们合并到一个有序链表中得到。
1-&gt;1-&gt;2-&gt;3-&gt;4-&gt;4-&gt;5-&gt;6</span></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">示例 2</span>
        <div class="stmt-kv"><span>输入</span><code>lists = []</code></div>
        <div class="stmt-kv"><span>输出</span><code>[]</code></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">示例 3</span>
        <div class="stmt-kv"><span>输入</span><code>lists = [[]]</code></div>
        <div class="stmt-kv"><span>输出</span><code>[]</code></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>提示：</strong>
      <ul>
        <li><code>k == lists.length</code></li>
        <li><code>0 &lt;= k &lt;= 10^4</code></li>
        <li><code>0 &lt;= lists[i].length &lt;= 500</code></li>
        <li><code>-10^4 &lt;= lists[i][j] &lt;= 10^4</code></li>
        <li><code>lists[i]</code> 按 <strong>升序</strong> 排列</li>
        <li><code>lists[i].length</code> 的总和不超过 <code>10^4</code></li>
      </ul>
    </div>
  `,

  en: `
    <p>You are given an array of <code>k</code> linked-lists <code>lists</code>, each linked-list
    is sorted in ascending order.</p>

    <p><em>Merge all the linked-lists into one sorted linked-list and return it.</em></p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">Example 1</span>
        <div class="stmt-kv"><span>Input</span><code>lists = [[1,4,5],[1,3,4],[2,6]]</code></div>
        <div class="stmt-kv"><span>Output</span><code>[1,1,2,3,4,4,5,6]</code></div>
        <div class="stmt-kv"><span>Explanation</span><span>The linked-lists are:
[
&nbsp;&nbsp;1-&gt;4-&gt;5,
&nbsp;&nbsp;1-&gt;3-&gt;4,
&nbsp;&nbsp;2-&gt;6
]
merging them into one sorted list:
1-&gt;1-&gt;2-&gt;3-&gt;4-&gt;4-&gt;5-&gt;6</span></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">Example 2</span>
        <div class="stmt-kv"><span>Input</span><code>lists = []</code></div>
        <div class="stmt-kv"><span>Output</span><code>[]</code></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">Example 3</span>
        <div class="stmt-kv"><span>Input</span><code>lists = [[]]</code></div>
        <div class="stmt-kv"><span>Output</span><code>[]</code></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>Constraints:</strong>
      <ul>
        <li><code>k == lists.length</code></li>
        <li><code>0 &lt;= k &lt;= 10^4</code></li>
        <li><code>0 &lt;= lists[i].length &lt;= 500</code></li>
        <li><code>-10^4 &lt;= lists[i][j] &lt;= 10^4</code></li>
        <li><code>lists[i]</code> is sorted in <strong>ascending order</strong>.</li>
        <li>The sum of <code>lists[i].length</code> will not exceed <code>10^4</code>.</li>
      </ul>
    </div>
  `,
}

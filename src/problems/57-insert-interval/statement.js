/* 57. 插入区间 官方题面（leetcode.cn / .com，文字与示例与官方一致，结构重排）。 */

export const src = {
  zh: 'https://leetcode.cn/problems/insert-interval/',
  en: 'https://leetcode.com/problems/insert-interval/',
}

export const statement = {
  zh: `
    <p>给你一个 <strong>无重叠的</strong> ，按照区间起始端点排序的区间列表 <code>intervals</code>，
    其中 <code>intervals[i] = [start_i, end_i]</code> 表示第 <code>i</code> 个区间的开始和结束，
    并且 <code>intervals</code> 按照 <code>start_i</code> 升序排列。同样给定一个区间
    <code>newInterval = [start, end]</code> 表示另一个区间的开始和结束。</p>

    <p>在 <code>intervals</code> 中插入区间 <code>newInterval</code>，使得 <code>intervals</code>
    依然按照 <code>start_i</code> 升序排列，且区间之间不重叠（如果有必要的话，可以合并区间）。</p>

    <p>返回插入之后的 <code>intervals</code>。</p>

    <p><strong>注意</strong> 你不需要原地修改 <code>intervals</code>。你可以创建一个新数组然后返回它。</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">示例 1</span>
        <div class="stmt-kv"><span>输入</span><code>intervals = [[1,3],[6,9]], newInterval = [2,5]</code></div>
        <div class="stmt-kv"><span>输出</span><code>[[1,5],[6,9]]</code></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">示例 2</span>
        <div class="stmt-kv"><span>输入</span><code>intervals = [[1,2],[3,5],[6,7],[8,10],[12,16]], newInterval = [4,8]</code></div>
        <div class="stmt-kv"><span>输出</span><code>[[1,2],[3,10],[12,16]]</code></div>
        <div class="stmt-kv"><span>解释</span><span>这是因为新的区间 [4,8] 与 [3,5],[6,7],[8,10] 重叠。</span></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>提示：</strong>
      <ul>
        <li><code>0 &lt;= intervals.length &lt;= 10^4</code></li>
        <li><code>intervals[i].length == 2</code></li>
        <li><code>0 &lt;= start_i &lt;= end_i &lt;= 10^5</code></li>
        <li><code>intervals</code> 根据 <code>start_i</code> 按 <strong>升序</strong> 排列</li>
        <li><code>newInterval.length == 2</code></li>
        <li><code>0 &lt;= start &lt;= end &lt;= 10^5</code></li>
      </ul>
    </div>
  `,

  en: `
    <p>You are given an array of non-overlapping intervals <code>intervals</code> where
    <code>intervals[i] = [start_i, end_i]</code> represent the start and the end of the
    <code>i</code>th interval and <code>intervals</code> is sorted in ascending order by
    <code>start_i</code>. You are also given an interval <code>newInterval = [start, end]</code>
    that represents the start and end of another interval.</p>

    <p>Insert <code>newInterval</code> into <code>intervals</code> such that <code>intervals</code>
    is still sorted in ascending order by <code>start_i</code> and <code>intervals</code> still
    does not have any overlapping intervals (merge overlapping intervals if necessary).</p>

    <p>Return <code>intervals</code> after the insertion.</p>

    <p><strong>Note</strong> that you don't need to modify <code>intervals</code> in-place. You
    can make a new array and return it.</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">Example 1</span>
        <div class="stmt-kv"><span>Input</span><code>intervals = [[1,3],[6,9]], newInterval = [2,5]</code></div>
        <div class="stmt-kv"><span>Output</span><code>[[1,5],[6,9]]</code></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">Example 2</span>
        <div class="stmt-kv"><span>Input</span><code>intervals = [[1,2],[3,5],[6,7],[8,10],[12,16]], newInterval = [4,8]</code></div>
        <div class="stmt-kv"><span>Output</span><code>[[1,2],[3,10],[12,16]]</code></div>
        <div class="stmt-kv"><span>Explanation</span><span>Because the new interval [4,8] overlaps with [3,5],[6,7],[8,10].</span></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>Constraints:</strong>
      <ul>
        <li><code>0 &lt;= intervals.length &lt;= 10^4</code></li>
        <li><code>intervals[i].length == 2</code></li>
        <li><code>0 &lt;= start_i &lt;= end_i &lt;= 10^5</code></li>
        <li><code>intervals</code> is sorted by <code>start_i</code> in <strong>ascending</strong> order.</li>
        <li><code>newInterval.length == 2</code></li>
        <li><code>0 &lt;= start &lt;= end &lt;= 10^5</code></li>
      </ul>
    </div>
  `,
}

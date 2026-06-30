/* 56. 合并区间 官方题面（leetcode.cn / .com，文字与示例与官方一致，结构重排）。 */

export const src = {
  zh: 'https://leetcode.cn/problems/merge-intervals/',
  en: 'https://leetcode.com/problems/merge-intervals/',
}

export const statement = {
  zh: `
    <p>以数组 <code>intervals</code> 表示若干个区间的集合，其中单个区间为
    <code>intervals[i] = [start<sub>i</sub>, end<sub>i</sub>]</code>。请你合并所有重叠的区间，
    并返回 <em>一个不重叠的区间数组，该数组需恰好覆盖输入中的所有区间</em>。</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">示例 1</span>
        <div class="stmt-kv"><span>输入</span><code>intervals = [[1,3],[2,6],[8,10],[15,18]]</code></div>
        <div class="stmt-kv"><span>输出</span><code>[[1,6],[8,10],[15,18]]</code></div>
        <div class="stmt-kv"><span>解释</span><span>区间 [1,3] 和 [2,6] 重叠，将它们合并为 [1,6]。</span></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">示例 2</span>
        <div class="stmt-kv"><span>输入</span><code>intervals = [[1,4],[4,5]]</code></div>
        <div class="stmt-kv"><span>输出</span><code>[[1,5]]</code></div>
        <div class="stmt-kv"><span>解释</span><span>区间 [1,4] 和 [4,5] 可被视为重叠区间。</span></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">示例 3</span>
        <div class="stmt-kv"><span>输入</span><code>intervals = [[4,7],[1,4]]</code></div>
        <div class="stmt-kv"><span>输出</span><code>[[1,7]]</code></div>
        <div class="stmt-kv"><span>解释</span><span>区间 [1,4] 和 [4,7] 可被视为重叠区间。</span></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>提示：</strong>
      <ul>
        <li><code>1 &lt;= intervals.length &lt;= 10^4</code></li>
        <li><code>intervals[i].length == 2</code></li>
        <li><code>0 &lt;= start<sub>i</sub> &lt;= end<sub>i</sub> &lt;= 10^4</code></li>
      </ul>
    </div>
  `,

  en: `
    <p>Given an array of <code>intervals</code> where
    <code>intervals[i] = [start<sub>i</sub>, end<sub>i</sub>]</code>, merge all overlapping
    intervals, and return <em>an array of the non-overlapping intervals that cover all the
    intervals in the input</em>.</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">Example 1</span>
        <div class="stmt-kv"><span>Input</span><code>intervals = [[1,3],[2,6],[8,10],[15,18]]</code></div>
        <div class="stmt-kv"><span>Output</span><code>[[1,6],[8,10],[15,18]]</code></div>
        <div class="stmt-kv"><span>Explanation</span><span>Since intervals [1,3] and [2,6] overlap, merge them into [1,6].</span></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">Example 2</span>
        <div class="stmt-kv"><span>Input</span><code>intervals = [[1,4],[4,5]]</code></div>
        <div class="stmt-kv"><span>Output</span><code>[[1,5]]</code></div>
        <div class="stmt-kv"><span>Explanation</span><span>Intervals [1,4] and [4,5] are considered overlapping.</span></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">Example 3</span>
        <div class="stmt-kv"><span>Input</span><code>intervals = [[4,7],[1,4]]</code></div>
        <div class="stmt-kv"><span>Output</span><code>[[1,7]]</code></div>
        <div class="stmt-kv"><span>Explanation</span><span>Intervals [1,4] and [4,7] are considered overlapping.</span></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>Constraints:</strong>
      <ul>
        <li><code>1 &lt;= intervals.length &lt;= 10^4</code></li>
        <li><code>intervals[i].length == 2</code></li>
        <li><code>0 &lt;= start<sub>i</sub> &lt;= end<sub>i</sub> &lt;= 10^4</code></li>
      </ul>
    </div>
  `,
}

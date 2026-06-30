/* 435. 无重叠区间 官方题面（leetcode.cn / .com，文字与示例与官方一致，结构重排）。 */

export const src = {
  zh: 'https://leetcode.cn/problems/non-overlapping-intervals/',
  en: 'https://leetcode.com/problems/non-overlapping-intervals/',
}

export const statement = {
  zh: `
    <p>给定一个区间的集合 <code>intervals</code>，其中 <code>intervals[i] = [start<sub>i</sub>, end<sub>i</sub>]</code>。
    返回 <em>需要移除区间的最小数量，使剩余区间互不重叠</em>。</p>

    <p><strong>注意</strong> 只在一点上接触的区间是<strong>不重叠的</strong>。例如 <code>[1, 2]</code> 和
    <code>[2, 3]</code> 是不重叠的。</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">示例 1</span>
        <div class="stmt-kv"><span>输入</span><code>intervals = [[1,2],[2,3],[3,4],[1,3]]</code></div>
        <div class="stmt-kv"><span>输出</span><code>1</code></div>
        <div class="stmt-kv"><span>解释</span><span>移除 [1,3] 后，剩下的区间没有重叠。</span></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">示例 2</span>
        <div class="stmt-kv"><span>输入</span><code>intervals = [[1,2],[1,2],[1,2]]</code></div>
        <div class="stmt-kv"><span>输出</span><code>2</code></div>
        <div class="stmt-kv"><span>解释</span><span>你需要移除两个 [1,2] 来使剩下的区间没有重叠。</span></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">示例 3</span>
        <div class="stmt-kv"><span>输入</span><code>intervals = [[1,2],[2,3]]</code></div>
        <div class="stmt-kv"><span>输出</span><code>0</code></div>
        <div class="stmt-kv"><span>解释</span><span>你不需要移除任何区间，因为它们已经是无重叠的了。</span></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>提示：</strong>
      <ul>
        <li><code>1 &lt;= intervals.length &lt;= 10^5</code></li>
        <li><code>intervals[i].length == 2</code></li>
        <li><code>-5 * 10^4 &lt;= start<sub>i</sub> &lt; end<sub>i</sub> &lt;= 5 * 10^4</code></li>
      </ul>
    </div>
  `,

  en: `
    <p>Given an array of intervals <code>intervals</code> where
    <code>intervals[i] = [start<sub>i</sub>, end<sub>i</sub>]</code>, return <em>the minimum number
    of intervals you need to remove to make the rest of the intervals non-overlapping</em>.</p>

    <p><strong>Note</strong> that intervals which only touch at a point are
    <strong>non-overlapping</strong>. For example, <code>[1, 2]</code> and <code>[2, 3]</code> are
    non-overlapping.</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">Example 1</span>
        <div class="stmt-kv"><span>Input</span><code>intervals = [[1,2],[2,3],[3,4],[1,3]]</code></div>
        <div class="stmt-kv"><span>Output</span><code>1</code></div>
        <div class="stmt-kv"><span>Explanation</span><span>[1,3] can be removed and the rest of the intervals are non-overlapping.</span></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">Example 2</span>
        <div class="stmt-kv"><span>Input</span><code>intervals = [[1,2],[1,2],[1,2]]</code></div>
        <div class="stmt-kv"><span>Output</span><code>2</code></div>
        <div class="stmt-kv"><span>Explanation</span><span>You need to remove two [1,2] to make the rest of the intervals non-overlapping.</span></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">Example 3</span>
        <div class="stmt-kv"><span>Input</span><code>intervals = [[1,2],[2,3]]</code></div>
        <div class="stmt-kv"><span>Output</span><code>0</code></div>
        <div class="stmt-kv"><span>Explanation</span><span>You don't need to remove any of the intervals since they're already non-overlapping.</span></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>Constraints:</strong>
      <ul>
        <li><code>1 &lt;= intervals.length &lt;= 10^5</code></li>
        <li><code>intervals[i].length == 2</code></li>
        <li><code>-5 * 10^4 &lt;= start<sub>i</sub> &lt; end<sub>i</sub> &lt;= 5 * 10^4</code></li>
      </ul>
    </div>
  `,
}

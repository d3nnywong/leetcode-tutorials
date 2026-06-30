/* 252. 会议室 官方题面（leetcode.cn / .com，文字与示例与官方一致，结构重排）。 */

export const src = {
  zh: 'https://leetcode.cn/problems/meeting-rooms/',
  en: 'https://leetcode.com/problems/meeting-rooms/',
}

export const statement = {
  zh: `
    <p>给定一个会议时间安排的数组 <code>intervals</code>，每个会议时间都会包括开始和结束的时间
    <code>intervals[i] = [start<sub>i</sub>, end<sub>i</sub>]</code>，请你判断一个人是否能够参加这里面的全部会议。</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">示例 1</span>
        <div class="stmt-kv"><span>输入</span><code>intervals = [[0,30],[5,10],[15,20]]</code></div>
        <div class="stmt-kv"><span>输出</span><code>false</code></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">示例 2</span>
        <div class="stmt-kv"><span>输入</span><code>intervals = [[7,10],[2,4]]</code></div>
        <div class="stmt-kv"><span>输出</span><code>true</code></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>提示：</strong>
      <ul>
        <li><code>0 &lt;= intervals.length &lt;= 10^4</code></li>
        <li><code>intervals[i].length == 2</code></li>
        <li><code>0 &lt;= start<sub>i</sub> &lt; end<sub>i</sub> &lt;= 10^6</code></li>
      </ul>
    </div>
  `,

  en: `
    <p>Given an array of meeting time intervals where
    <code>intervals[i] = [start<sub>i</sub>, end<sub>i</sub>]</code>, determine if a person
    could attend all meetings.</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">Example 1</span>
        <div class="stmt-kv"><span>Input</span><code>intervals = [[0,30],[5,10],[15,20]]</code></div>
        <div class="stmt-kv"><span>Output</span><code>false</code></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">Example 2</span>
        <div class="stmt-kv"><span>Input</span><code>intervals = [[7,10],[2,4]]</code></div>
        <div class="stmt-kv"><span>Output</span><code>true</code></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>Constraints:</strong>
      <ul>
        <li><code>0 &lt;= intervals.length &lt;= 10^4</code></li>
        <li><code>intervals[i].length == 2</code></li>
        <li><code>0 &lt;= start<sub>i</sub> &lt; end<sub>i</sub> &lt;= 10^6</code></li>
      </ul>
    </div>
  `,
}

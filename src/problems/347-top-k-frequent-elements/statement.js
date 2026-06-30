/* 347. 前 K 个高频元素 官方题面（leetcode.cn / .com，文字与示例与官方一致，结构重排）。 */

export const src = {
  zh: 'https://leetcode.cn/problems/top-k-frequent-elements/',
  en: 'https://leetcode.com/problems/top-k-frequent-elements/',
}

export const statement = {
  zh: `
    <p>给你一个整数数组 <code>nums</code> 和一个整数 <code>k</code> ，请你返回其中出现频率前
    <code>k</code> 高的元素。你可以按 <strong>任意顺序</strong> 返回答案。</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">示例 1</span>
        <div class="stmt-kv"><span>输入</span><code>nums = [1,1,1,2,2,3], k = 2</code></div>
        <div class="stmt-kv"><span>输出</span><code>[1,2]</code></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">示例 2</span>
        <div class="stmt-kv"><span>输入</span><code>nums = [1], k = 1</code></div>
        <div class="stmt-kv"><span>输出</span><code>[1]</code></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">示例 3</span>
        <div class="stmt-kv"><span>输入</span><code>nums = [1,2,1,2,1,2,3,1,3,2], k = 2</code></div>
        <div class="stmt-kv"><span>输出</span><code>[1,2]</code></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>提示：</strong>
      <ul>
        <li><code>1 &lt;= nums.length &lt;= 10^5</code></li>
        <li><code>-10^4 &lt;= nums[i] &lt;= 10^4</code></li>
        <li><code>k</code> 的取值范围是 <code>[1, 数组中不相同的元素的个数]</code></li>
        <li><strong>题目数据保证答案唯一</strong>，换句话说，数组中前 <code>k</code> 个高频元素的集合是唯一的</li>
      </ul>
      <p class="dp-step__hint">进阶：你设计算法的时间复杂度必须优于 <code>O(n log n)</code>，其中 <code>n</code> 是数组大小。</p>
    </div>
  `,

  en: `
    <p>Given an integer array <code>nums</code> and an integer <code>k</code>, return
    <em>the</em> <code>k</code> <em>most frequent elements</em>. You may return the answer in
    <strong>any order</strong>.</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">Example 1</span>
        <div class="stmt-kv"><span>Input</span><code>nums = [1,1,1,2,2,3], k = 2</code></div>
        <div class="stmt-kv"><span>Output</span><code>[1,2]</code></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">Example 2</span>
        <div class="stmt-kv"><span>Input</span><code>nums = [1], k = 1</code></div>
        <div class="stmt-kv"><span>Output</span><code>[1]</code></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">Example 3</span>
        <div class="stmt-kv"><span>Input</span><code>nums = [1,2,1,2,1,2,3,1,3,2], k = 2</code></div>
        <div class="stmt-kv"><span>Output</span><code>[1,2]</code></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>Constraints:</strong>
      <ul>
        <li><code>1 &lt;= nums.length &lt;= 10^5</code></li>
        <li><code>-10^4 &lt;= nums[i] &lt;= 10^4</code></li>
        <li><code>k</code> is in the range <code>[1, the number of unique elements in the array]</code></li>
        <li>It is <strong>guaranteed</strong> that the answer is <strong>unique</strong></li>
      </ul>
      <p class="dp-step__hint">Follow up: Your algorithm's time complexity must be better than
      <code>O(n log n)</code>, where <code>n</code> is the array's size.</p>
    </div>
  `,
}

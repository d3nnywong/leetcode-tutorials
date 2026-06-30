/* 300. 最长递增子序列 官方题面（leetcode.cn / .com，文字与示例与官方一致，结构重排）。 */

export const src = {
  zh: 'https://leetcode.cn/problems/longest-increasing-subsequence/',
  en: 'https://leetcode.com/problems/longest-increasing-subsequence/',
}

export const statement = {
  zh: `
    <p>给你一个整数数组 <code>nums</code>，找到其中最长<strong>严格递增</strong>子序列的长度。</p>

    <p><strong>子序列</strong> 是由数组派生而来的序列，删除（或不删除）数组中的元素而不改变其
    余元素的顺序。例如，<code>[3,6,2,7]</code> 是数组 <code>[0,3,1,6,2,2,7]</code> 的子序列。</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">示例 1</span>
        <div class="stmt-kv"><span>输入</span><code>nums = [10,9,2,5,3,7,101,18]</code></div>
        <div class="stmt-kv"><span>输出</span><code>4</code></div>
        <div class="stmt-kv"><span>解释</span><span>最长递增子序列是 [2,3,7,101]，因此长度为 4 。</span></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">示例 2</span>
        <div class="stmt-kv"><span>输入</span><code>nums = [0,1,0,3,2,3]</code></div>
        <div class="stmt-kv"><span>输出</span><code>4</code></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">示例 3</span>
        <div class="stmt-kv"><span>输入</span><code>nums = [7,7,7,7,7,7,7]</code></div>
        <div class="stmt-kv"><span>输出</span><code>1</code></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>提示：</strong>
      <ul>
        <li><code>1 &lt;= nums.length &lt;= 2500</code></li>
        <li><code>-10^4 &lt;= nums[i] &lt;= 10^4</code></li>
      </ul>
      <p class="dp-step__hint">进阶：你能将算法的时间复杂度降低到 <code>O(n log(n))</code> 吗？</p>
    </div>
  `,

  en: `
    <p>Given an integer array <code>nums</code>, return <em>the length of the longest
    <strong>strictly increasing</strong> subsequence</em>.</p>

    <p>A <strong>subsequence</strong> is a sequence that can be derived from an array by deleting
    some or no elements without changing the order of the remaining elements. For example,
    <code>[3,6,2,7]</code> is a subsequence of the array <code>[0,3,1,6,2,2,7]</code>.</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">Example 1</span>
        <div class="stmt-kv"><span>Input</span><code>nums = [10,9,2,5,3,7,101,18]</code></div>
        <div class="stmt-kv"><span>Output</span><code>4</code></div>
        <div class="stmt-kv"><span>Explanation</span><span>The longest increasing subsequence is [2,3,7,101], therefore the length is 4.</span></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">Example 2</span>
        <div class="stmt-kv"><span>Input</span><code>nums = [0,1,0,3,2,3]</code></div>
        <div class="stmt-kv"><span>Output</span><code>4</code></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">Example 3</span>
        <div class="stmt-kv"><span>Input</span><code>nums = [7,7,7,7,7,7,7]</code></div>
        <div class="stmt-kv"><span>Output</span><code>1</code></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>Constraints:</strong>
      <ul>
        <li><code>1 &lt;= nums.length &lt;= 2500</code></li>
        <li><code>-10^4 &lt;= nums[i] &lt;= 10^4</code></li>
      </ul>
      <p class="dp-step__hint">Follow up: Can you come up with an algorithm that runs in <code>O(n log(n))</code> time complexity?</p>
    </div>
  `,
}

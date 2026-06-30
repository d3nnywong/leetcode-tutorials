/* 53. 最大子数组和 官方题面（leetcode.cn / .com，文字与示例与官方一致，结构重排）。 */

export const src = {
  zh: 'https://leetcode.cn/problems/maximum-subarray/',
  en: 'https://leetcode.com/problems/maximum-subarray/',
}

export const statement = {
  zh: `
    <p>给你一个整数数组 <code>nums</code> ，请你找出一个具有<strong>最大和</strong>的<strong>连续子数组</strong>
    （子数组最少包含一个元素），返回其最大和。</p>

    <p><strong>子数组</strong>是数组中的一个连续部分。</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">示例 1</span>
        <div class="stmt-kv"><span>输入</span><code>nums = [-2,1,-3,4,-1,2,1,-5,4]</code></div>
        <div class="stmt-kv"><span>输出</span><code>6</code></div>
        <div class="stmt-kv"><span>解释</span><span>连续子数组 [4,-1,2,1] 的和最大，为 6 。</span></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">示例 2</span>
        <div class="stmt-kv"><span>输入</span><code>nums = [1]</code></div>
        <div class="stmt-kv"><span>输出</span><code>1</code></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">示例 3</span>
        <div class="stmt-kv"><span>输入</span><code>nums = [5,4,-1,7,8]</code></div>
        <div class="stmt-kv"><span>输出</span><code>23</code></div>
        <div class="stmt-kv"><span>解释</span><span>连续子数组 [5,4,-1,7,8] 的和最大，为 23 。</span></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>提示：</strong>
      <ul>
        <li><code>1 &lt;= nums.length &lt;= 10^5</code></li>
        <li><code>-10^4 &lt;= nums[i] &lt;= 10^4</code></li>
      </ul>
      <p class="dp-step__hint">进阶：如果你已经实现复杂度为 <code>O(n)</code> 的解法，尝试使用更为精妙的<strong>分治法</strong>求解。</p>
    </div>
  `,

  en: `
    <p>Given an integer array <code>nums</code>, find the <strong>subarray</strong> with the largest
    sum, and return <em>its sum</em>.</p>

    <p>A <strong>subarray</strong> is a contiguous part of an array.</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">Example 1</span>
        <div class="stmt-kv"><span>Input</span><code>nums = [-2,1,-3,4,-1,2,1,-5,4]</code></div>
        <div class="stmt-kv"><span>Output</span><code>6</code></div>
        <div class="stmt-kv"><span>Explanation</span><span>The subarray [4,-1,2,1] has the largest sum 6.</span></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">Example 2</span>
        <div class="stmt-kv"><span>Input</span><code>nums = [1]</code></div>
        <div class="stmt-kv"><span>Output</span><code>1</code></div>
        <div class="stmt-kv"><span>Explanation</span><span>The subarray [1] has the largest sum 1.</span></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">Example 3</span>
        <div class="stmt-kv"><span>Input</span><code>nums = [5,4,-1,7,8]</code></div>
        <div class="stmt-kv"><span>Output</span><code>23</code></div>
        <div class="stmt-kv"><span>Explanation</span><span>The subarray [5,4,-1,7,8] has the largest sum 23.</span></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>Constraints:</strong>
      <ul>
        <li><code>1 &lt;= nums.length &lt;= 10^5</code></li>
        <li><code>-10^4 &lt;= nums[i] &lt;= 10^4</code></li>
      </ul>
      <p class="dp-step__hint">Follow up: If you have figured out the <code>O(n)</code> solution, try coding another
      solution using the <strong>divide and conquer</strong> approach, which is more subtle.</p>
    </div>
  `,
}

/* 268. 丢失的数字 官方题面（leetcode.cn / .com，文字与示例与官方一致，结构重排）。 */

export const src = {
  zh: 'https://leetcode.cn/problems/missing-number/',
  en: 'https://leetcode.com/problems/missing-number/',
}

export const statement = {
  zh: `
    <p>给定一个包含 <code>[0, n]</code> 中 <code>n</code> 个数的数组 <code>nums</code>，
    找出 <code>[0, n]</code> 这个范围内没有出现在数组中的那个数。</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">示例 1</span>
        <div class="stmt-kv"><span>输入</span><code>nums = [3,0,1]</code></div>
        <div class="stmt-kv"><span>输出</span><code>2</code></div>
        <div class="stmt-kv"><span>解释</span><span><code>n = 3</code>，因为有 3 个数字，所以所有的数字都在范围 <code>[0,3]</code> 内。2 是丢失的数字，因为它没有出现在 nums 中。</span></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">示例 2</span>
        <div class="stmt-kv"><span>输入</span><code>nums = [0,1]</code></div>
        <div class="stmt-kv"><span>输出</span><code>2</code></div>
        <div class="stmt-kv"><span>解释</span><span><code>n = 2</code>，因为有 2 个数字，所以所有的数字都在范围 <code>[0,2]</code> 内。2 是丢失的数字，因为它没有出现在 nums 中。</span></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">示例 3</span>
        <div class="stmt-kv"><span>输入</span><code>nums = [9,6,4,2,3,5,7,0,1]</code></div>
        <div class="stmt-kv"><span>输出</span><code>8</code></div>
        <div class="stmt-kv"><span>解释</span><span><code>n = 9</code>，因为有 9 个数字，所以所有的数字都在范围 <code>[0,9]</code> 内。8 是丢失的数字，因为它没有出现在 nums 中。</span></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>提示：</strong>
      <ul>
        <li><code>n == nums.length</code></li>
        <li><code>1 &lt;= n &lt;= 10^4</code></li>
        <li><code>0 &lt;= nums[i] &lt;= n</code></li>
        <li><code>nums</code> 中的所有数字都 <strong>独一无二</strong></li>
      </ul>
      <p class="dp-step__hint">进阶：你能否实现线性时间复杂度、仅使用额外常数空间的算法解决此问题？</p>
    </div>
  `,

  en: `
    <p>Given an array <code>nums</code> containing <code>n</code> distinct numbers in the range
    <code>[0, n]</code>, return <em>the only number in the range that is missing from the array</em>.</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">Example 1</span>
        <div class="stmt-kv"><span>Input</span><code>nums = [3,0,1]</code></div>
        <div class="stmt-kv"><span>Output</span><code>2</code></div>
        <div class="stmt-kv"><span>Explanation</span><span><code>n = 3</code> since there are 3 numbers, so all numbers are in the range <code>[0,3]</code>. 2 is the missing number in the range since it does not appear in nums.</span></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">Example 2</span>
        <div class="stmt-kv"><span>Input</span><code>nums = [0,1]</code></div>
        <div class="stmt-kv"><span>Output</span><code>2</code></div>
        <div class="stmt-kv"><span>Explanation</span><span><code>n = 2</code> since there are 2 numbers, so all numbers are in the range <code>[0,2]</code>. 2 is the missing number in the range since it does not appear in nums.</span></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">Example 3</span>
        <div class="stmt-kv"><span>Input</span><code>nums = [9,6,4,2,3,5,7,0,1]</code></div>
        <div class="stmt-kv"><span>Output</span><code>8</code></div>
        <div class="stmt-kv"><span>Explanation</span><span><code>n = 9</code> since there are 9 numbers, so all numbers are in the range <code>[0,9]</code>. 8 is the missing number in the range since it does not appear in nums.</span></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>Constraints:</strong>
      <ul>
        <li><code>n == nums.length</code></li>
        <li><code>1 &lt;= n &lt;= 10^4</code></li>
        <li><code>0 &lt;= nums[i] &lt;= n</code></li>
        <li>All the numbers of <code>nums</code> are <strong>unique</strong>.</li>
      </ul>
      <p class="dp-step__hint">Follow up: Could you implement a solution using only <code>O(1)</code> extra space complexity and <code>O(n)</code> runtime complexity?</p>
    </div>
  `,
}

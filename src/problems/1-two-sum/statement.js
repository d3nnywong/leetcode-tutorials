/* 1. 两数之和 官方题面（leetcode.cn / .com，文字与示例与官方一致，结构重排）。 */

export const src = {
  zh: 'https://leetcode.cn/problems/two-sum/',
  en: 'https://leetcode.com/problems/two-sum/',
}

export const statement = {
  zh: `
    <p>给定一个整数数组 <code>nums</code> 和一个整数目标值 <code>target</code>，请你在该数组中
    找出 <strong>和为目标值</strong> <code>target</code> 的那 <strong>两个</strong> 整数，
    并返回它们的数组下标。</p>

    <p>你可以假设每种输入只会对应一个答案，并且你不能使用两次相同的元素。你可以按任意顺序返回答案。</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">示例 1</span>
        <div class="stmt-kv"><span>输入</span><code>nums = [2,7,11,15], target = 9</code></div>
        <div class="stmt-kv"><span>输出</span><code>[0,1]</code></div>
        <div class="stmt-kv"><span>解释</span><span>因为 nums[0] + nums[1] == 9 ，返回 [0, 1] 。</span></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">示例 2</span>
        <div class="stmt-kv"><span>输入</span><code>nums = [3,2,4], target = 6</code></div>
        <div class="stmt-kv"><span>输出</span><code>[1,2]</code></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">示例 3</span>
        <div class="stmt-kv"><span>输入</span><code>nums = [3,3], target = 6</code></div>
        <div class="stmt-kv"><span>输出</span><code>[0,1]</code></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>提示：</strong>
      <ul>
        <li><code>2 &lt;= nums.length &lt;= 10^4</code></li>
        <li><code>-10^9 &lt;= nums[i] &lt;= 10^9</code></li>
        <li><code>-10^9 &lt;= target &lt;= 10^9</code></li>
        <li><strong>只会存在一个有效答案。</strong></li>
      </ul>
      <p class="dp-step__hint">进阶：你能想出一个时间复杂度小于 <code>O(n²)</code> 的算法吗？</p>
    </div>
  `,

  en: `
    <p>Given an array of integers <code>nums</code> and an integer <code>target</code>,
    return <em>indices of the two numbers such that they add up to</em> <code>target</code>.</p>

    <p>You may assume that each input would have <strong>exactly one solution</strong>, and you
    may not use the same element twice. You can return the answer in any order.</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">Example 1</span>
        <div class="stmt-kv"><span>Input</span><code>nums = [2,7,11,15], target = 9</code></div>
        <div class="stmt-kv"><span>Output</span><code>[0,1]</code></div>
        <div class="stmt-kv"><span>Explanation</span><span>Because nums[0] + nums[1] == 9, we return [0, 1].</span></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">Example 2</span>
        <div class="stmt-kv"><span>Input</span><code>nums = [3,2,4], target = 6</code></div>
        <div class="stmt-kv"><span>Output</span><code>[1,2]</code></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">Example 3</span>
        <div class="stmt-kv"><span>Input</span><code>nums = [3,3], target = 6</code></div>
        <div class="stmt-kv"><span>Output</span><code>[0,1]</code></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>Constraints:</strong>
      <ul>
        <li><code>2 &lt;= nums.length &lt;= 10^4</code></li>
        <li><code>-10^9 &lt;= nums[i] &lt;= 10^9</code></li>
        <li><code>-10^9 &lt;= target &lt;= 10^9</code></li>
        <li><strong>Only one valid answer exists.</strong></li>
      </ul>
      <p class="dp-step__hint">Follow-up: Can you come up with an algorithm that is less than <code>O(n²)</code> time complexity?</p>
    </div>
  `,
}

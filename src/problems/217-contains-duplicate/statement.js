/* 217. 存在重复元素 官方题面（leetcode.cn / .com，文字与示例与官方一致，结构重排）。 */

export const src = {
  zh: 'https://leetcode.cn/problems/contains-duplicate/',
  en: 'https://leetcode.com/problems/contains-duplicate/',
}

export const statement = {
  zh: `
    <p>给你一个整数数组 <code>nums</code> 。如果任一值在数组中出现 <strong>至少两次</strong>，
    返回 <code>true</code> ；如果数组中每个元素互不相同，返回 <code>false</code> 。</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">示例 1</span>
        <div class="stmt-kv"><span>输入</span><code>nums = [1,2,3,1]</code></div>
        <div class="stmt-kv"><span>输出</span><code>true</code></div>
        <div class="stmt-kv"><span>解释</span><span>元素 1 在下标 0 和 3 出现。</span></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">示例 2</span>
        <div class="stmt-kv"><span>输入</span><code>nums = [1,2,3,4]</code></div>
        <div class="stmt-kv"><span>输出</span><code>false</code></div>
        <div class="stmt-kv"><span>解释</span><span>所有元素都不同。</span></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">示例 3</span>
        <div class="stmt-kv"><span>输入</span><code>nums = [1,1,1,3,3,4,3,2,4,2]</code></div>
        <div class="stmt-kv"><span>输出</span><code>true</code></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>提示：</strong>
      <ul>
        <li><code>1 &lt;= nums.length &lt;= 10^5</code></li>
        <li><code>-10^9 &lt;= nums[i] &lt;= 10^9</code></li>
      </ul>
    </div>
  `,

  en: `
    <p>Given an integer array <code>nums</code>, return <code>true</code> if any value appears
    <strong>at least twice</strong> in the array, and return <code>false</code> if every element
    is distinct.</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">Example 1</span>
        <div class="stmt-kv"><span>Input</span><code>nums = [1,2,3,1]</code></div>
        <div class="stmt-kv"><span>Output</span><code>true</code></div>
        <div class="stmt-kv"><span>Explanation</span><span>The element 1 occurs at the indices 0 and 3.</span></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">Example 2</span>
        <div class="stmt-kv"><span>Input</span><code>nums = [1,2,3,4]</code></div>
        <div class="stmt-kv"><span>Output</span><code>false</code></div>
        <div class="stmt-kv"><span>Explanation</span><span>All elements are distinct.</span></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">Example 3</span>
        <div class="stmt-kv"><span>Input</span><code>nums = [1,1,1,3,3,4,3,2,4,2]</code></div>
        <div class="stmt-kv"><span>Output</span><code>true</code></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>Constraints:</strong>
      <ul>
        <li><code>1 &lt;= nums.length &lt;= 10^5</code></li>
        <li><code>-10^9 &lt;= nums[i] &lt;= 10^9</code></li>
      </ul>
    </div>
  `,
}

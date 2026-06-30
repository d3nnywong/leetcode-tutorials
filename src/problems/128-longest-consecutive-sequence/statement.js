/* 128. 最长连续序列 官方题面（leetcode.cn / .com，文字与示例与官方一致，结构重排）。 */

export const src = {
  zh: 'https://leetcode.cn/problems/longest-consecutive-sequence/',
  en: 'https://leetcode.com/problems/longest-consecutive-sequence/',
}

export const statement = {
  zh: `
    <p>给定一个未排序的整数数组 <code>nums</code>，找出数字连续的最长序列（不要求序列元素在原数组中
    连续）的长度。</p>

    <p>请你设计并实现时间复杂度为 <code>O(n)</code> 的算法解决此问题。</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">示例 1</span>
        <div class="stmt-kv"><span>输入</span><code>nums = [100,4,200,1,3,2]</code></div>
        <div class="stmt-kv"><span>输出</span><code>4</code></div>
        <div class="stmt-kv"><span>解释</span><span>最长数字连续序列是 [1, 2, 3, 4]。它的长度为 4。</span></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">示例 2</span>
        <div class="stmt-kv"><span>输入</span><code>nums = [0,3,7,2,5,8,4,6,0,1]</code></div>
        <div class="stmt-kv"><span>输出</span><code>9</code></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">示例 3</span>
        <div class="stmt-kv"><span>输入</span><code>nums = [1,0,1,2]</code></div>
        <div class="stmt-kv"><span>输出</span><code>3</code></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>提示：</strong>
      <ul>
        <li><code>0 &lt;= nums.length &lt;= 10^5</code></li>
        <li><code>-10^9 &lt;= nums[i] &lt;= 10^9</code></li>
      </ul>
    </div>
  `,

  en: `
    <p>Given an unsorted array of integers <code>nums</code>, return <em>the length of the longest
    consecutive elements sequence</em>.</p>

    <p>You must write an algorithm that runs in <code>O(n)</code> time.</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">Example 1</span>
        <div class="stmt-kv"><span>Input</span><code>nums = [100,4,200,1,3,2]</code></div>
        <div class="stmt-kv"><span>Output</span><code>4</code></div>
        <div class="stmt-kv"><span>Explanation</span><span>The longest consecutive elements sequence is [1, 2, 3, 4]. Therefore its length is 4.</span></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">Example 2</span>
        <div class="stmt-kv"><span>Input</span><code>nums = [0,3,7,2,5,8,4,6,0,1]</code></div>
        <div class="stmt-kv"><span>Output</span><code>9</code></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">Example 3</span>
        <div class="stmt-kv"><span>Input</span><code>nums = [1,0,1,2]</code></div>
        <div class="stmt-kv"><span>Output</span><code>3</code></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>Constraints:</strong>
      <ul>
        <li><code>0 &lt;= nums.length &lt;= 10^5</code></li>
        <li><code>-10^9 &lt;= nums[i] &lt;= 10^9</code></li>
      </ul>
    </div>
  `,
}

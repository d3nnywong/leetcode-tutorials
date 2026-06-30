/* 238. 除自身以外数组的乘积 官方题面（leetcode.cn / .com，文字与示例与官方一致，结构重排）。 */

export const src = {
  zh: 'https://leetcode.cn/problems/product-of-array-except-self/',
  en: 'https://leetcode.com/problems/product-of-array-except-self/',
}

export const statement = {
  zh: `
    <p>给你一个整数数组 <code>nums</code>，返回 数组 <code>answer</code> ，其中
    <code>answer[i]</code> 等于 <code>nums</code> 中除 <code>nums[i]</code> 之外其余各元素的乘积。</p>

    <p>题目数据 <strong>保证</strong> 数组 <code>nums</code> 之中任意元素的全部前缀元素和后缀的乘积都在
    <strong>32 位</strong> 整数范围内。</p>

    <p>请 <strong>不要使用除法，</strong>且在 <code>O(n)</code> 时间复杂度内完成此题。</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">示例 1</span>
        <div class="stmt-kv"><span>输入</span><code>nums = [1,2,3,4]</code></div>
        <div class="stmt-kv"><span>输出</span><code>[24,12,8,6]</code></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">示例 2</span>
        <div class="stmt-kv"><span>输入</span><code>nums = [-1,1,0,-3,3]</code></div>
        <div class="stmt-kv"><span>输出</span><code>[0,0,9,0,0]</code></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>提示：</strong>
      <ul>
        <li><code>2 &lt;= nums.length &lt;= 10^5</code></li>
        <li><code>-30 &lt;= nums[i] &lt;= 30</code></li>
        <li>输入 <strong>保证</strong> 数组 <code>answer[i]</code> 在 <strong>32 位</strong> 整数范围内</li>
      </ul>
      <p class="dp-step__hint">进阶：你可以在 <code>O(1)</code> 的额外空间复杂度内完成这个题目吗？（出于对空间复杂度分析的目的，输出数组
      <strong>不被视为</strong> 额外空间。）</p>
    </div>
  `,

  en: `
    <p>Given an integer array <code>nums</code>, return <em>an array</em> <code>answer</code>
    <em>such that</em> <code>answer[i]</code> <em>is equal to the product of all the elements of</em>
    <code>nums</code> <em>except</em> <code>nums[i]</code>.</p>

    <p>The product of any prefix or suffix of <code>nums</code> is <strong>guaranteed</strong> to fit
    in a <strong>32-bit</strong> integer.</p>

    <p>You must write an algorithm that runs in <code>O(n)</code> time and without using the
    division operation.</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">Example 1</span>
        <div class="stmt-kv"><span>Input</span><code>nums = [1,2,3,4]</code></div>
        <div class="stmt-kv"><span>Output</span><code>[24,12,8,6]</code></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">Example 2</span>
        <div class="stmt-kv"><span>Input</span><code>nums = [-1,1,0,-3,3]</code></div>
        <div class="stmt-kv"><span>Output</span><code>[0,0,9,0,0]</code></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>Constraints:</strong>
      <ul>
        <li><code>2 &lt;= nums.length &lt;= 10^5</code></li>
        <li><code>-30 &lt;= nums[i] &lt;= 30</code></li>
        <li>The input is generated such that <code>answer[i]</code> is <strong>guaranteed</strong> to
        fit in a <strong>32-bit</strong> integer</li>
      </ul>
      <p class="dp-step__hint">Follow up: Can you solve the problem in <code>O(1)</code> extra space
      complexity? (The output array <strong>does not</strong> count as extra space for space
      complexity analysis.)</p>
    </div>
  `,
}

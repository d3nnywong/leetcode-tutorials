/* 152. 乘积最大子数组 官方题面（leetcode.cn / .com，文字与示例与官方一致，结构重排）。 */

export const src = {
  zh: 'https://leetcode.cn/problems/maximum-product-subarray/',
  en: 'https://leetcode.com/problems/maximum-product-subarray/',
}

export const statement = {
  zh: `
    <p>给你一个整数数组 <code>nums</code> ，请你找出数组中乘积最大的非空连续
    <strong>子数组</strong>（该子数组中至少包含一个数字），并返回该子数组所对应的乘积。</p>

    <p>测试用例的答案是一个 <strong>32-位</strong> 整数。</p>

    <p><strong>请注意</strong>，一个只包含一个元素的数组的乘积就是这个元素的值。</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">示例 1</span>
        <div class="stmt-kv"><span>输入</span><code>nums = [2,3,-2,4]</code></div>
        <div class="stmt-kv"><span>输出</span><code>6</code></div>
        <div class="stmt-kv"><span>解释</span><span>子数组 [2,3] 有最大乘积 6 。</span></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">示例 2</span>
        <div class="stmt-kv"><span>输入</span><code>nums = [-2,0,-1]</code></div>
        <div class="stmt-kv"><span>输出</span><code>0</code></div>
        <div class="stmt-kv"><span>解释</span><span>结果不能为 2, 因为 [-2,-1] 不是子数组。</span></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>提示：</strong>
      <ul>
        <li><code>1 &lt;= nums.length &lt;= 2 * 10^4</code></li>
        <li><code>-10 &lt;= nums[i] &lt;= 10</code></li>
        <li><code>nums</code> 的任何子数组的乘积都<strong>保证</strong>是一个 <strong>32-位</strong> 整数</li>
      </ul>
    </div>
  `,

  en: `
    <p>Given an integer array <code>nums</code>, find a <strong>subarray</strong> that has the
    largest product, and return <em>the product</em>.</p>

    <p>The test cases are generated so that the answer will fit in a <strong>32-bit</strong> integer.</p>

    <p><strong>Note</strong> that the product of an array with a single element is the value of
    that element.</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">Example 1</span>
        <div class="stmt-kv"><span>Input</span><code>nums = [2,3,-2,4]</code></div>
        <div class="stmt-kv"><span>Output</span><code>6</code></div>
        <div class="stmt-kv"><span>Explanation</span><span>[2,3] has the largest product 6.</span></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">Example 2</span>
        <div class="stmt-kv"><span>Input</span><code>nums = [-2,0,-1]</code></div>
        <div class="stmt-kv"><span>Output</span><code>0</code></div>
        <div class="stmt-kv"><span>Explanation</span><span>The result cannot be 2, because [-2,-1] is not a subarray.</span></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>Constraints:</strong>
      <ul>
        <li><code>1 &lt;= nums.length &lt;= 2 * 10^4</code></li>
        <li><code>-10 &lt;= nums[i] &lt;= 10</code></li>
        <li>The product of any subarray of <code>nums</code> is <strong>guaranteed</strong> to fit
        in a <strong>32-bit</strong> integer</li>
      </ul>
    </div>
  `,
}

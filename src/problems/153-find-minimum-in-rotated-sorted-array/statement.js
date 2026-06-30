/* 153. 寻找旋转排序数组中的最小值 官方题面（leetcode.cn / .com，文字与示例与官方一致，结构重排）。 */

export const src = {
  zh: 'https://leetcode.cn/problems/find-minimum-in-rotated-sorted-array/',
  en: 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/',
}

export const statement = {
  zh: `
    <p>已知一个长度为 <code>n</code> 的数组，预先按照升序排列，经由 <code>1</code> 到 <code>n</code>
    次 <strong>旋转</strong> 后，得到输入数组。例如，原数组 <code>nums = [0,1,2,4,5,6,7]</code>
    在变化后可能得到：</p>

    <ul>
      <li>若旋转 <code>4</code> 次，则可以得到 <code>[4,5,6,7,0,1,2]</code></li>
      <li>若旋转 <code>7</code> 次，则可以得到 <code>[0,1,2,4,5,6,7]</code></li>
    </ul>

    <p>注意，数组 <code>[a[0], a[1], a[2], ..., a[n-1]]</code> <strong>旋转一次</strong> 的结果为
    数组 <code>[a[n-1], a[0], a[1], a[2], ..., a[n-2]]</code> 。</p>

    <p>给你一个元素值 <strong>互不相同</strong> 的数组 <code>nums</code> ，它原来是一个升序排列的数组，
    并按上述情形进行了多次旋转。请你找出并返回数组中的 <strong>最小元素</strong> 。</p>

    <p>你必须设计一个时间复杂度为 <code>O(log n)</code> 的算法解决此问题。</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">示例 1</span>
        <div class="stmt-kv"><span>输入</span><code>nums = [3,4,5,1,2]</code></div>
        <div class="stmt-kv"><span>输出</span><code>1</code></div>
        <div class="stmt-kv"><span>解释</span><span>原数组为 [1,2,3,4,5] ，旋转 3 次得到输入数组。</span></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">示例 2</span>
        <div class="stmt-kv"><span>输入</span><code>nums = [4,5,6,7,0,1,2]</code></div>
        <div class="stmt-kv"><span>输出</span><code>0</code></div>
        <div class="stmt-kv"><span>解释</span><span>原数组为 [0,1,2,4,5,6,7] ，旋转 4 次得到输入数组。</span></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">示例 3</span>
        <div class="stmt-kv"><span>输入</span><code>nums = [11,13,15,17]</code></div>
        <div class="stmt-kv"><span>输出</span><code>11</code></div>
        <div class="stmt-kv"><span>解释</span><span>原数组为 [11,13,15,17] ，旋转 4 次得到输入数组。</span></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>提示：</strong>
      <ul>
        <li><code>n == nums.length</code></li>
        <li><code>1 &lt;= n &lt;= 5000</code></li>
        <li><code>-5000 &lt;= nums[i] &lt;= 5000</code></li>
        <li><code>nums</code> 中的所有整数 <strong>互不相同</strong></li>
        <li><code>nums</code> 原来是一个升序排序的数组，并进行了 <code>1</code> 至 <code>n</code> 次旋转</li>
      </ul>
    </div>
  `,

  en: `
    <p>Suppose an array of length <code>n</code> sorted in ascending order is
    <strong>rotated</strong> between <code>1</code> and <code>n</code> times. For example, the
    array <code>nums = [0,1,2,4,5,6,7]</code> might become:</p>

    <ul>
      <li><code>[4,5,6,7,0,1,2]</code> if it was rotated <code>4</code> times.</li>
      <li><code>[0,1,2,4,5,6,7]</code> if it was rotated <code>7</code> times.</li>
    </ul>

    <p>Notice that <strong>rotating</strong> an array <code>[a[0], a[1], a[2], ..., a[n-1]]</code>
    1 time results in the array <code>[a[n-1], a[0], a[1], a[2], ..., a[n-2]]</code>.</p>

    <p>Given the sorted rotated array <code>nums</code> of <strong>unique</strong> elements,
    return <em>the minimum element of this array</em>.</p>

    <p>You must write an algorithm that runs in <code>O(log n) time</code>.</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">Example 1</span>
        <div class="stmt-kv"><span>Input</span><code>nums = [3,4,5,1,2]</code></div>
        <div class="stmt-kv"><span>Output</span><code>1</code></div>
        <div class="stmt-kv"><span>Explanation</span><span>The original array was [1,2,3,4,5] rotated 3 times.</span></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">Example 2</span>
        <div class="stmt-kv"><span>Input</span><code>nums = [4,5,6,7,0,1,2]</code></div>
        <div class="stmt-kv"><span>Output</span><code>0</code></div>
        <div class="stmt-kv"><span>Explanation</span><span>The original array was [0,1,2,4,5,6,7] and it was rotated 4 times.</span></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">Example 3</span>
        <div class="stmt-kv"><span>Input</span><code>nums = [11,13,15,17]</code></div>
        <div class="stmt-kv"><span>Output</span><code>11</code></div>
        <div class="stmt-kv"><span>Explanation</span><span>The original array was [11,13,15,17] and it was rotated 4 times.</span></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>Constraints:</strong>
      <ul>
        <li><code>n == nums.length</code></li>
        <li><code>1 &lt;= n &lt;= 5000</code></li>
        <li><code>-5000 &lt;= nums[i] &lt;= 5000</code></li>
        <li>All the integers of <code>nums</code> are <strong>unique</strong>.</li>
        <li><code>nums</code> is sorted and rotated between <code>1</code> and <code>n</code> times.</li>
      </ul>
    </div>
  `,
}

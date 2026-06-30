/* 33. 搜索旋转排序数组 官方题面（leetcode.cn / .com，文字与示例与官方一致，结构重排）。 */

export const src = {
  zh: 'https://leetcode.cn/problems/search-in-rotated-sorted-array/',
  en: 'https://leetcode.com/problems/search-in-rotated-sorted-array/',
}

export const statement = {
  zh: `
    <p>整数数组 <code>nums</code> 按升序排列，数组中的值 <strong>互不相同</strong> 。</p>

    <p>在传递给函数之前，<code>nums</code> 在预先未知的某个下标 <code>k</code>
    （<code>0 &lt;= k &lt; nums.length</code>）上进行了 <strong>向左旋转</strong>，使数组变为
    <code>[nums[k], nums[k+1], ..., nums[n-1], nums[0], nums[1], ..., nums[k-1]]</code>
    （下标 <strong>从 0 开始</strong> 计数）。例如， <code>[0,1,2,4,5,6,7]</code> 在下标 3 上向左旋转后
    可能变为 <code>[4,5,6,7,0,1,2]</code> 。</p>

    <p>给你 <strong>旋转后</strong> 的数组 <code>nums</code> 和一个整数 <code>target</code> ，如果
    <code>nums</code> 中存在这个目标值 <code>target</code> ，则返回它的下标，否则返回 <code>-1</code> 。</p>

    <p>你必须设计一个时间复杂度为 <code>O(log n)</code> 的算法解决此问题。</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">示例 1</span>
        <div class="stmt-kv"><span>输入</span><code>nums = [4,5,6,7,0,1,2], target = 0</code></div>
        <div class="stmt-kv"><span>输出</span><code>4</code></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">示例 2</span>
        <div class="stmt-kv"><span>输入</span><code>nums = [4,5,6,7,0,1,2], target = 3</code></div>
        <div class="stmt-kv"><span>输出</span><code>-1</code></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">示例 3</span>
        <div class="stmt-kv"><span>输入</span><code>nums = [1], target = 0</code></div>
        <div class="stmt-kv"><span>输出</span><code>-1</code></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>提示：</strong>
      <ul>
        <li><code>1 &lt;= nums.length &lt;= 5000</code></li>
        <li><code>-10^4 &lt;= nums[i] &lt;= 10^4</code></li>
        <li><code>nums</code> 中的每个值都 <strong>独一无二</strong></li>
        <li>题目数据保证 <code>nums</code> 在预先未知的某个下标上进行了旋转</li>
        <li><code>-10^4 &lt;= target &lt;= 10^4</code></li>
      </ul>
    </div>
  `,

  en: `
    <p>There is an integer array <code>nums</code> sorted in ascending order (with
    <strong>distinct</strong> values).</p>

    <p>Prior to being passed to your function, <code>nums</code> is <strong>possibly left
    rotated</strong> at an unknown index <code>k</code> (<code>1 &lt;= k &lt; nums.length</code>)
    such that the resulting array is
    <code>[nums[k], nums[k+1], ..., nums[n-1], nums[0], nums[1], ..., nums[k-1]]</code>
    (<strong>0-indexed</strong>). For example, <code>[0,1,2,4,5,6,7]</code> might be left
    rotated by 3 indices and become <code>[4,5,6,7,0,1,2]</code>.</p>

    <p>Given the array <code>nums</code> <strong>after</strong> the possible rotation and an
    integer <code>target</code>, return <em>the index of</em> <code>target</code>
    <em>if it is in</em> <code>nums</code>, <em>or</em> <code>-1</code>
    <em>if it is not in</em> <code>nums</code>.</p>

    <p>You must write an algorithm with <code>O(log n)</code> runtime complexity.</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">Example 1</span>
        <div class="stmt-kv"><span>Input</span><code>nums = [4,5,6,7,0,1,2], target = 0</code></div>
        <div class="stmt-kv"><span>Output</span><code>4</code></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">Example 2</span>
        <div class="stmt-kv"><span>Input</span><code>nums = [4,5,6,7,0,1,2], target = 3</code></div>
        <div class="stmt-kv"><span>Output</span><code>-1</code></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">Example 3</span>
        <div class="stmt-kv"><span>Input</span><code>nums = [1], target = 0</code></div>
        <div class="stmt-kv"><span>Output</span><code>-1</code></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>Constraints:</strong>
      <ul>
        <li><code>1 &lt;= nums.length &lt;= 5000</code></li>
        <li><code>-10^4 &lt;= nums[i] &lt;= 10^4</code></li>
        <li>All values of <code>nums</code> are <strong>unique</strong>.</li>
        <li><code>nums</code> is an ascending array that is possibly rotated.</li>
        <li><code>-10^4 &lt;= target &lt;= 10^4</code></li>
      </ul>
    </div>
  `,
}

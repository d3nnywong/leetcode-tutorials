/* 15. 三数之和 官方题面（leetcode.cn / .com，文字与示例与官方一致，结构重排）。 */

export const src = {
  zh: 'https://leetcode.cn/problems/3sum/',
  en: 'https://leetcode.com/problems/3sum/',
}

export const statement = {
  zh: `
    <p>给你一个整数数组 <code>nums</code>，判断是否存在三元组
    <code>[nums[i], nums[j], nums[k]]</code> 满足 <code>i != j</code>、<code>i != k</code>
    且 <code>j != k</code>，同时还满足 <code>nums[i] + nums[j] + nums[k] == 0</code>。
    请你返回所有和为 <code>0</code> 且不重复的三元组。</p>

    <p><strong>注意：</strong>答案中不可以包含重复的三元组。</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">示例 1</span>
        <div class="stmt-kv"><span>输入</span><code>nums = [-1,0,1,2,-1,-4]</code></div>
        <div class="stmt-kv"><span>输出</span><code>[[-1,-1,2],[-1,0,1]]</code></div>
        <div class="stmt-kv"><span>解释</span><span>
          nums[0] + nums[1] + nums[2] = (-1) + 0 + 1 = 0；
          nums[1] + nums[2] + nums[4] = 0 + 1 + (-1) = 0；
          nums[0] + nums[3] + nums[4] = (-1) + 2 + (-1) = 0。
          不同的三元组是 [-1,0,1] 和 [-1,-1,2]。注意，输出的顺序和三元组的顺序并不重要。
        </span></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">示例 2</span>
        <div class="stmt-kv"><span>输入</span><code>nums = [0,1,1]</code></div>
        <div class="stmt-kv"><span>输出</span><code>[]</code></div>
        <div class="stmt-kv"><span>解释</span><span>唯一可能的三元组和不为 0。</span></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">示例 3</span>
        <div class="stmt-kv"><span>输入</span><code>nums = [0,0,0]</code></div>
        <div class="stmt-kv"><span>输出</span><code>[[0,0,0]]</code></div>
        <div class="stmt-kv"><span>解释</span><span>唯一可能的三元组和为 0。</span></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>提示：</strong>
      <ul>
        <li><code>3 &lt;= nums.length &lt;= 3000</code></li>
        <li><code>-10^5 &lt;= nums[i] &lt;= 10^5</code></li>
      </ul>
    </div>
  `,

  en: `
    <p>Given an integer array <code>nums</code>, return all the triplets
    <code>[nums[i], nums[j], nums[k]]</code> such that <code>i != j</code>,
    <code>i != k</code>, and <code>j != k</code>, and
    <code>nums[i] + nums[j] + nums[k] == 0</code>.</p>

    <p>Notice that the solution set must not contain duplicate triplets.</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">Example 1</span>
        <div class="stmt-kv"><span>Input</span><code>nums = [-1,0,1,2,-1,-4]</code></div>
        <div class="stmt-kv"><span>Output</span><code>[[-1,-1,2],[-1,0,1]]</code></div>
        <div class="stmt-kv"><span>Explanation</span><span>
          nums[0] + nums[1] + nums[2] = (-1) + 0 + 1 = 0.
          nums[1] + nums[2] + nums[4] = 0 + 1 + (-1) = 0.
          nums[0] + nums[3] + nums[4] = (-1) + 2 + (-1) = 0.
          The distinct triplets are [-1,0,1] and [-1,-1,2].
          Notice that the order of the output and the order of the triplets does not matter.
        </span></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">Example 2</span>
        <div class="stmt-kv"><span>Input</span><code>nums = [0,1,1]</code></div>
        <div class="stmt-kv"><span>Output</span><code>[]</code></div>
        <div class="stmt-kv"><span>Explanation</span><span>The only possible triplet does not sum up to 0.</span></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">Example 3</span>
        <div class="stmt-kv"><span>Input</span><code>nums = [0,0,0]</code></div>
        <div class="stmt-kv"><span>Output</span><code>[[0,0,0]]</code></div>
        <div class="stmt-kv"><span>Explanation</span><span>The only possible triplet sums up to 0.</span></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>Constraints:</strong>
      <ul>
        <li><code>3 &lt;= nums.length &lt;= 3000</code></li>
        <li><code>-10^5 &lt;= nums[i] &lt;= 10^5</code></li>
      </ul>
    </div>
  `,
}

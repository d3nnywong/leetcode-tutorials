/* 55. 跳跃游戏 官方题面（leetcode.cn / .com，文字与示例与官方一致，结构重排）。 */

export const src = {
  zh: 'https://leetcode.cn/problems/jump-game/',
  en: 'https://leetcode.com/problems/jump-game/',
}

export const statement = {
  zh: `
    <p>给你一个非负整数数组 <code>nums</code>，你最初位于数组的 <strong>第一个下标</strong>。
    数组中的每个元素代表你在该位置可以跳跃的最大长度。</p>

    <p>判断你是否能够到达最后一个下标，如果可以，返回 <code>true</code>；否则，返回 <code>false</code>。</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">示例 1</span>
        <div class="stmt-kv"><span>输入</span><code>nums = [2,3,1,1,4]</code></div>
        <div class="stmt-kv"><span>输出</span><code>true</code></div>
        <div class="stmt-kv"><span>解释</span><span>可以先跳 1 步，从下标 0 到达下标 1，然后再从下标 1 跳 3 步到达最后一个下标。</span></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">示例 2</span>
        <div class="stmt-kv"><span>输入</span><code>nums = [3,2,1,0,4]</code></div>
        <div class="stmt-kv"><span>输出</span><code>false</code></div>
        <div class="stmt-kv"><span>解释</span><span>无论怎样，总会到达下标为 3 的位置。但该下标的最大跳跃长度是 0，所以永远不可能到达最后一个下标。</span></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>提示：</strong>
      <ul>
        <li><code>1 &lt;= nums.length &lt;= 10^4</code></li>
        <li><code>0 &lt;= nums[i] &lt;= 10^5</code></li>
      </ul>
    </div>
  `,

  en: `
    <p>You are given an integer array <code>nums</code>. You are initially positioned at the
    array's <strong>first index</strong>, and each element in the array represents your maximum
    jump length at that position.</p>

    <p>Return <code>true</code> if you can reach the last index, or <code>false</code> otherwise.</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">Example 1</span>
        <div class="stmt-kv"><span>Input</span><code>nums = [2,3,1,1,4]</code></div>
        <div class="stmt-kv"><span>Output</span><code>true</code></div>
        <div class="stmt-kv"><span>Explanation</span><span>Jump 1 step from index 0 to 1, then 3 steps to the last index.</span></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">Example 2</span>
        <div class="stmt-kv"><span>Input</span><code>nums = [3,2,1,0,4]</code></div>
        <div class="stmt-kv"><span>Output</span><code>false</code></div>
        <div class="stmt-kv"><span>Explanation</span><span>You will always arrive at index 3 no matter what. Its maximum jump length is 0, which makes it impossible to reach the last index.</span></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>Constraints:</strong>
      <ul>
        <li><code>1 &lt;= nums.length &lt;= 10^4</code></li>
        <li><code>0 &lt;= nums[i] &lt;= 10^5</code></li>
      </ul>
    </div>
  `,
}

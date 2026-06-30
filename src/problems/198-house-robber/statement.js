/* 198. 打家劫舍 官方题面（leetcode.cn / .com，文字与示例与官方一致，结构重排）。 */

export const src = {
  zh: 'https://leetcode.cn/problems/house-robber/',
  en: 'https://leetcode.com/problems/house-robber/',
}

export const statement = {
  zh: `
    <p>你是一个专业的小偷，计划偷窃沿街的房屋。每间房内都藏有一定的现金，影响你偷窃的唯一制约因素就是
    相邻的房屋装有相互连通的防盗系统，<strong>如果两间相邻的房屋在同一晚上被小偷闯入，系统会自动报警</strong>。</p>

    <p>给定一个代表每个房屋存放金额的非负整数数组，计算你<strong>不触动警报装置的情况下</strong>，
    一夜之内能够偷窃到的最高金额。</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">示例 1</span>
        <div class="stmt-kv"><span>输入</span><code>nums = [1,2,3,1]</code></div>
        <div class="stmt-kv"><span>输出</span><code>4</code></div>
        <div class="stmt-kv"><span>解释</span><span>偷窃 1 号房屋（金额 = 1），然后偷窃 3 号房屋（金额 = 3）。<br/>偷窃到的最高金额 = 1 + 3 = 4。</span></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">示例 2</span>
        <div class="stmt-kv"><span>输入</span><code>nums = [2,7,9,3,1]</code></div>
        <div class="stmt-kv"><span>输出</span><code>12</code></div>
        <div class="stmt-kv"><span>解释</span><span>偷窃 1 号房屋（金额 = 2），偷窃 3 号房屋（金额 = 9），接着偷窃 5 号房屋（金额 = 1）。<br/>偷窃到的最高金额 = 2 + 9 + 1 = 12。</span></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>提示：</strong>
      <ul>
        <li><code>1 &lt;= nums.length &lt;= 100</code></li>
        <li><code>0 &lt;= nums[i] &lt;= 400</code></li>
      </ul>
    </div>
  `,

  en: `
    <p>You are a professional robber planning to rob houses along a street. Each house has a
    certain amount of money stashed, the only constraint stopping you from robbing each of them
    is that adjacent houses have security systems connected and <strong>it will automatically
    contact the police if two adjacent houses were broken into on the same night</strong>.</p>

    <p>Given an integer array <code>nums</code> representing the amount of money of each house,
    return <em>the maximum amount of money you can rob tonight</em> <strong>without alerting the
    police</strong>.</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">Example 1</span>
        <div class="stmt-kv"><span>Input</span><code>nums = [1,2,3,1]</code></div>
        <div class="stmt-kv"><span>Output</span><code>4</code></div>
        <div class="stmt-kv"><span>Explanation</span><span>Rob house 1 (money = 1) and then rob house 3 (money = 3).<br/>Total amount you can rob = 1 + 3 = 4.</span></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">Example 2</span>
        <div class="stmt-kv"><span>Input</span><code>nums = [2,7,9,3,1]</code></div>
        <div class="stmt-kv"><span>Output</span><code>12</code></div>
        <div class="stmt-kv"><span>Explanation</span><span>Rob house 1 (money = 2), rob house 3 (money = 9) and rob house 5 (money = 1).<br/>Total amount you can rob = 2 + 9 + 1 = 12.</span></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>Constraints:</strong>
      <ul>
        <li><code>1 &lt;= nums.length &lt;= 100</code></li>
        <li><code>0 &lt;= nums[i] &lt;= 400</code></li>
      </ul>
    </div>
  `,
}

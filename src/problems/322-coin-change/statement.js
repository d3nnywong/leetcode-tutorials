/* 322. 零钱兑换 官方题面（leetcode.cn / .com，文字与示例与官方一致，结构重排）。 */

export const src = {
  zh: 'https://leetcode.cn/problems/coin-change/',
  en: 'https://leetcode.com/problems/coin-change/',
}

export const statement = {
  zh: `
    <p>给你一个整数数组 <code>coins</code>，表示不同面额的硬币；以及一个整数 <code>amount</code>，
    表示总金额。</p>

    <p>计算并返回可以凑成总金额所需的 <strong>最少的硬币个数</strong>。如果没有任何一种硬币组合能组成
    总金额，返回 <code>-1</code>。</p>

    <p>你可以认为每种硬币的数量是无限的。</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">示例 1</span>
        <div class="stmt-kv"><span>输入</span><code>coins = [1, 2, 5], amount = 11</code></div>
        <div class="stmt-kv"><span>输出</span><code>3</code></div>
        <div class="stmt-kv"><span>解释</span><span>11 = 5 + 5 + 1</span></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">示例 2</span>
        <div class="stmt-kv"><span>输入</span><code>coins = [2], amount = 3</code></div>
        <div class="stmt-kv"><span>输出</span><code>-1</code></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">示例 3</span>
        <div class="stmt-kv"><span>输入</span><code>coins = [1], amount = 0</code></div>
        <div class="stmt-kv"><span>输出</span><code>0</code></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>提示：</strong>
      <ul>
        <li><code>1 &lt;= coins.length &lt;= 12</code></li>
        <li><code>1 &lt;= coins[i] &lt;= 2^31 - 1</code></li>
        <li><code>0 &lt;= amount &lt;= 10^4</code></li>
      </ul>
    </div>
  `,

  en: `
    <p>You are given an integer array <code>coins</code> representing coins of different
    denominations and an integer <code>amount</code> representing a total amount of money.</p>

    <p>Return <em>the fewest number of coins that you need to make up that amount</em>. If that
    amount of money cannot be made up by any combination of the coins, return <code>-1</code>.</p>

    <p>You may assume that you have an infinite number of each kind of coin.</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">Example 1</span>
        <div class="stmt-kv"><span>Input</span><code>coins = [1, 2, 5], amount = 11</code></div>
        <div class="stmt-kv"><span>Output</span><code>3</code></div>
        <div class="stmt-kv"><span>Explanation</span><span>11 = 5 + 5 + 1</span></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">Example 2</span>
        <div class="stmt-kv"><span>Input</span><code>coins = [2], amount = 3</code></div>
        <div class="stmt-kv"><span>Output</span><code>-1</code></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">Example 3</span>
        <div class="stmt-kv"><span>Input</span><code>coins = [1], amount = 0</code></div>
        <div class="stmt-kv"><span>Output</span><code>0</code></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>Constraints:</strong>
      <ul>
        <li><code>1 &lt;= coins.length &lt;= 12</code></li>
        <li><code>1 &lt;= coins[i] &lt;= 2^31 - 1</code></li>
        <li><code>0 &lt;= amount &lt;= 10^4</code></li>
      </ul>
    </div>
  `,
}

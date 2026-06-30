/* 121. 买卖股票的最佳时机 官方题面（leetcode.cn / .com，文字与示例与官方一致，结构重排）。 */

export const src = {
  zh: 'https://leetcode.cn/problems/best-time-to-buy-and-sell-stock/',
  en: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/',
}

export const statement = {
  zh: `
    <p>给定一个数组 <code>prices</code> ，它的第 <code>i</code> 个元素 <code>prices[i]</code>
    表示一支给定股票第 <code>i</code> 天的价格。</p>

    <p>你只能选择 <strong>某一天</strong> 买入这只股票，并选择在 <strong>未来的某一个不同的日子</strong>
    卖出该股票。设计一个算法来计算你所能获取的最大利润。</p>

    <p>返回你可以从这笔交易中获取的最大利润。如果你不能获取任何利润，返回 <code>0</code> 。</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">示例 1</span>
        <div class="stmt-kv"><span>输入</span><code>[7,1,5,3,6,4]</code></div>
        <div class="stmt-kv"><span>输出</span><code>5</code></div>
        <div class="stmt-kv"><span>解释</span><span>在第 2 天（股票价格 = 1）的时候买入，在第 5 天（股票价格 = 6）的时候卖出，最大利润 = 6 − 1 = 5 。
          注意利润不能是 7 − 1 = 6, 因为卖出价格需要大于买入价格；同时，你不能在买入前卖出股票。</span></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">示例 2</span>
        <div class="stmt-kv"><span>输入</span><code>prices = [7,6,4,3,1]</code></div>
        <div class="stmt-kv"><span>输出</span><code>0</code></div>
        <div class="stmt-kv"><span>解释</span><span>在这种情况下, 没有交易完成, 所以最大利润为 0。</span></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>提示：</strong>
      <ul>
        <li><code>1 &lt;= prices.length &lt;= 10^5</code></li>
        <li><code>0 &lt;= prices[i] &lt;= 10^4</code></li>
      </ul>
    </div>
  `,

  en: `
    <p>You are given an array <code>prices</code> where <code>prices[i]</code> is the price of a
    given stock on the <code>i</code>th day.</p>

    <p>You want to maximize your profit by choosing a <strong>single day</strong> to buy one stock
    and choosing a <strong>different day in the future</strong> to sell that stock.</p>

    <p>Return <em>the maximum profit you can achieve from this transaction</em>. If you cannot
    achieve any profit, return <code>0</code>.</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">Example 1</span>
        <div class="stmt-kv"><span>Input</span><code>prices = [7,1,5,3,6,4]</code></div>
        <div class="stmt-kv"><span>Output</span><code>5</code></div>
        <div class="stmt-kv"><span>Explanation</span><span>Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.
          Note that buying on day 2 and selling on day 1 is not allowed because you must buy before you sell.</span></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">Example 2</span>
        <div class="stmt-kv"><span>Input</span><code>prices = [7,6,4,3,1]</code></div>
        <div class="stmt-kv"><span>Output</span><code>0</code></div>
        <div class="stmt-kv"><span>Explanation</span><span>In this case, no transactions are done and the max profit = 0.</span></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>Constraints:</strong>
      <ul>
        <li><code>1 &lt;= prices.length &lt;= 10^5</code></li>
        <li><code>0 &lt;= prices[i] &lt;= 10^4</code></li>
      </ul>
    </div>
  `,
}

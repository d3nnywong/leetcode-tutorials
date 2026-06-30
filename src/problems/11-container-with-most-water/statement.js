/* 11. 盛最多水的容器 官方题面（结构重排，文字/示例/数据范围与官方一致）。 */

export const src = {
  zh: 'https://leetcode.cn/problems/container-with-most-water/',
  en: 'https://leetcode.com/problems/container-with-most-water/',
}

export const statement = {
  zh: `
    <p>给定一个长度为 <code>n</code> 的整数数组 <code>height</code>。有 <code>n</code> 条垂线，
    第 <code>i</code> 条线的两个端点是 <code>(i, 0)</code> 和 <code>(i, height[i])</code>。</p>

    <p>找出其中的两条线，使得它们与 <code>x</code> 轴共同构成的容器可以容纳最多的水。
    返回容器可以储存的最大水量。</p>

    <p><strong>说明：</strong>你不能倾斜容器。</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">示例 1</span>
        <div class="stmt-kv"><span>输入</span><code>height = [1,8,6,2,5,4,8,3,7]</code></div>
        <div class="stmt-kv"><span>输出</span><code>49</code></div>
        <div class="stmt-kv"><span>解释</span><span>下标 1 和 8 这两条线（高 8 和 7），宽 7、矮边 7，面积 49，是最大值。</span></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">示例 2</span>
        <div class="stmt-kv"><span>输入</span><code>height = [1,1]</code></div>
        <div class="stmt-kv"><span>输出</span><code>1</code></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>提示：</strong>
      <ul>
        <li><code>n == height.length</code></li>
        <li><code>2 &lt;= n &lt;= 10^5</code></li>
        <li><code>0 &lt;= height[i] &lt;= 10^4</code></li>
      </ul>
    </div>
  `,

  en: `
    <p>You are given an integer array <code>height</code> of length <code>n</code>. There are
    <code>n</code> vertical lines drawn such that the two endpoints of the <code>i</code>-th line
    are <code>(i, 0)</code> and <code>(i, height[i])</code>.</p>

    <p>Find two lines that together with the x-axis form a container, such that the container
    contains the most water. Return <em>the maximum amount of water a container can store</em>.</p>

    <p><strong>Notice</strong> that you may not slant the container.</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">Example 1</span>
        <div class="stmt-kv"><span>Input</span><code>height = [1,8,6,2,5,4,8,3,7]</code></div>
        <div class="stmt-kv"><span>Output</span><code>49</code></div>
        <div class="stmt-kv"><span>Explanation</span><span>Lines at index 1 and 8 (heights 8 and 7): width 7 × shorter 7 = 49, the maximum.</span></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">Example 2</span>
        <div class="stmt-kv"><span>Input</span><code>height = [1,1]</code></div>
        <div class="stmt-kv"><span>Output</span><code>1</code></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>Constraints:</strong>
      <ul>
        <li><code>n == height.length</code></li>
        <li><code>2 &lt;= n &lt;= 10^5</code></li>
        <li><code>0 &lt;= height[i] &lt;= 10^4</code></li>
      </ul>
    </div>
  `,
}

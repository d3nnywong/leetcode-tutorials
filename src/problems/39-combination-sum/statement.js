/* 39. 组合总和 官方题面（leetcode.cn / .com，文字与示例与官方一致，结构重排）。 */

export const src = {
  zh: 'https://leetcode.cn/problems/combination-sum/',
  en: 'https://leetcode.com/problems/combination-sum/',
}

export const statement = {
  zh: `
    <p>给你一个 <strong>无重复元素</strong> 的整数数组 <code>candidates</code> 和一个目标整数
    <code>target</code> ，找出 <code>candidates</code> 中可以使数字和为目标数 <code>target</code> 的
    <strong>所有不同组合</strong> ，并以列表形式返回。你可以按 <strong>任意顺序</strong> 返回这些组合。</p>

    <p><code>candidates</code> 中的 <strong>同一个</strong> 数字可以 <strong>无限制重复被选取</strong> 。
    如果至少一个数字的被选数量不同，则两种组合是不同的。</p>

    <p>对于给定的输入，保证和为 <code>target</code> 的不同组合数少于 <code>150</code> 个。</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">示例 1</span>
        <div class="stmt-kv"><span>输入</span><code>candidates = [2,3,6,7], target = 7</code></div>
        <div class="stmt-kv"><span>输出</span><code>[[2,2,3],[7]]</code></div>
        <div class="stmt-kv"><span>解释</span><span>2 和 3 可以形成一组候选，2 + 2 + 3 = 7 。注意 2 可以使用多次。7 也是一个候选，7 = 7 。仅有这两种组合。</span></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">示例 2</span>
        <div class="stmt-kv"><span>输入</span><code>candidates = [2,3,5], target = 8</code></div>
        <div class="stmt-kv"><span>输出</span><code>[[2,2,2,2],[2,3,3],[3,5]]</code></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">示例 3</span>
        <div class="stmt-kv"><span>输入</span><code>candidates = [2], target = 1</code></div>
        <div class="stmt-kv"><span>输出</span><code>[]</code></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>提示：</strong>
      <ul>
        <li><code>1 &lt;= candidates.length &lt;= 30</code></li>
        <li><code>2 &lt;= candidates[i] &lt;= 40</code></li>
        <li><code>candidates</code> 的所有元素 <strong>互不相同</strong></li>
        <li><code>1 &lt;= target &lt;= 40</code></li>
      </ul>
    </div>
  `,

  en: `
    <p>Given an array of <strong>distinct</strong> integers <code>candidates</code> and a target
    integer <code>target</code>, return <em>a list of all <strong>unique combinations</strong> of</em>
    <code>candidates</code><em> where the chosen numbers sum to</em> <code>target</code>. You may
    return the combinations in <strong>any order</strong>.</p>

    <p>The <strong>same</strong> number may be chosen from <code>candidates</code> an
    <strong>unlimited number of times</strong>. Two combinations are unique if the frequency of at
    least one of the chosen numbers is different.</p>

    <p>The test cases are generated such that the number of unique combinations that sum up to
    <code>target</code> is less than <code>150</code> combinations for the given input.</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">Example 1</span>
        <div class="stmt-kv"><span>Input</span><code>candidates = [2,3,6,7], target = 7</code></div>
        <div class="stmt-kv"><span>Output</span><code>[[2,2,3],[7]]</code></div>
        <div class="stmt-kv"><span>Explanation</span><span>2 and 3 are candidates, and 2 + 2 + 3 = 7. Note that 2 can be used multiple times. 7 is a candidate, and 7 = 7. These are the only two combinations.</span></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">Example 2</span>
        <div class="stmt-kv"><span>Input</span><code>candidates = [2,3,5], target = 8</code></div>
        <div class="stmt-kv"><span>Output</span><code>[[2,2,2,2],[2,3,3],[3,5]]</code></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">Example 3</span>
        <div class="stmt-kv"><span>Input</span><code>candidates = [2], target = 1</code></div>
        <div class="stmt-kv"><span>Output</span><code>[]</code></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>Constraints:</strong>
      <ul>
        <li><code>1 &lt;= candidates.length &lt;= 30</code></li>
        <li><code>2 &lt;= candidates[i] &lt;= 40</code></li>
        <li>All elements of <code>candidates</code> are <strong>distinct</strong>.</li>
        <li><code>1 &lt;= target &lt;= 40</code></li>
      </ul>
    </div>
  `,
}

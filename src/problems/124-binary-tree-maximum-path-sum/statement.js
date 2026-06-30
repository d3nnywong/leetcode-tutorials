/* 124. 二叉树中的最大路径和 官方题面（leetcode.cn / .com，文字与示例与官方一致，结构重排）。 */

export const src = {
  zh: 'https://leetcode.cn/problems/binary-tree-maximum-path-sum/',
  en: 'https://leetcode.com/problems/binary-tree-maximum-path-sum/',
}

export const statement = {
  zh: `
    <p>二叉树中的 <strong>路径</strong> 被定义为一条节点序列，序列中每对相邻节点之间都存在一条边。
    同一个节点在一条路径序列中 <strong>至多出现一次</strong>。该路径 <strong>至少包含一个</strong>
    节点，且不一定经过根节点。</p>

    <p><strong>路径和</strong> 是路径中各节点值的总和。</p>

    <p>给你一个二叉树的根节点 <code>root</code>，返回其 <strong>最大路径和</strong>。</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">示例 1</span>
        <div class="stmt-kv"><span>输入</span><code>root = [1,2,3]</code></div>
        <div class="stmt-kv"><span>输出</span><code>6</code></div>
        <div class="stmt-kv"><span>解释</span><span>最优路径是 2 -&gt; 1 -&gt; 3，路径和为 2 + 1 + 3 = 6。</span></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">示例 2</span>
        <div class="stmt-kv"><span>输入</span><code>root = [-10,9,20,null,null,15,7]</code></div>
        <div class="stmt-kv"><span>输出</span><code>42</code></div>
        <div class="stmt-kv"><span>解释</span><span>最优路径是 15 -&gt; 20 -&gt; 7，路径和为 15 + 20 + 7 = 42。</span></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>提示：</strong>
      <ul>
        <li>树中节点数目范围是 <code>[1, 3 * 10^4]</code></li>
        <li><code>-1000 &lt;= Node.val &lt;= 1000</code></li>
      </ul>
    </div>
  `,

  en: `
    <p>A <strong>path</strong> in a binary tree is a sequence of nodes where each pair of adjacent
    nodes in the sequence has an edge connecting them. A node can only appear in the sequence
    <strong>at most once</strong>. Note that the path does not need to pass through the root.</p>

    <p>The <strong>path sum</strong> of a path is the sum of the node's values in the path.</p>

    <p>Given the <code>root</code> of a binary tree, return <em>the maximum</em>
    <strong>path sum</strong> <em>of any non-empty path</em>.</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">Example 1</span>
        <div class="stmt-kv"><span>Input</span><code>root = [1,2,3]</code></div>
        <div class="stmt-kv"><span>Output</span><code>6</code></div>
        <div class="stmt-kv"><span>Explanation</span><span>The optimal path is 2 -&gt; 1 -&gt; 3 with a path sum of 2 + 1 + 3 = 6.</span></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">Example 2</span>
        <div class="stmt-kv"><span>Input</span><code>root = [-10,9,20,null,null,15,7]</code></div>
        <div class="stmt-kv"><span>Output</span><code>42</code></div>
        <div class="stmt-kv"><span>Explanation</span><span>The optimal path is 15 -&gt; 20 -&gt; 7 with a path sum of 15 + 20 + 7 = 42.</span></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>Constraints:</strong>
      <ul>
        <li>The number of nodes in the tree is in the range <code>[1, 3 * 10^4]</code>.</li>
        <li><code>-1000 &lt;= Node.val &lt;= 1000</code></li>
      </ul>
    </div>
  `,
}

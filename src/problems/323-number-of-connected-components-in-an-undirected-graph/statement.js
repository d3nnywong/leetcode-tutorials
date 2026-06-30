/* 323. 无向图中连通分量的数目 官方题面（leetcode.cn / .com，文字与示例与官方一致，结构重排）。
 * 注：该题在两站均为会员 / 锁定题，接口不返回题面正文，这里依据官方公开的描述与示例忠实重建。 */

export const src = {
  zh: 'https://leetcode.cn/problems/number-of-connected-components-in-an-undirected-graph/',
  en: 'https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/',
}

export const statement = {
  zh: `
    <p>你有一个包含 <code>n</code> 个节点的图，给定一个整数 <code>n</code> 和一个数组 <code>edges</code>，
    其中 <code>edges[i] = [ai, bi]</code> 表示图中节点 <code>ai</code> 和 <code>bi</code> 之间存在一条边。</p>

    <p>返回图中<strong>已连通分量的数目</strong>。</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">示例 1</span>
        <div class="stmt-kv"><span>输入</span><code>n = 5, edges = [[0,1],[1,2],[3,4]]</code></div>
        <div class="stmt-kv"><span>输出</span><code>2</code></div>
        <div class="stmt-kv"><span>解释</span><span>节点 0、1、2 通过边连成一块，节点 3、4 连成另一块，共 2 个连通分量。</span></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">示例 2</span>
        <div class="stmt-kv"><span>输入</span><code>n = 5, edges = [[0,1],[1,2],[2,3],[3,4]]</code></div>
        <div class="stmt-kv"><span>输出</span><code>1</code></div>
        <div class="stmt-kv"><span>解释</span><span>5 个节点首尾相连成一条链，全部属于同一个连通分量。</span></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>提示：</strong>
      <ul>
        <li><code>1 &lt;= n &lt;= 2000</code></li>
        <li><code>1 &lt;= edges.length &lt;= 5000</code></li>
        <li><code>edges[i].length == 2</code></li>
        <li><code>0 &lt;= ai &lt;= bi &lt; n</code></li>
        <li><code>ai != bi</code></li>
        <li>不会出现重复的边。</li>
      </ul>
    </div>
  `,

  en: `
    <p>You have a graph of <code>n</code> nodes. You are given an integer <code>n</code> and an array
    <code>edges</code> where <code>edges[i] = [ai, bi]</code> indicates that there is an edge between
    <code>ai</code> and <code>bi</code> in the graph.</p>

    <p>Return <em>the number of connected components in the graph</em>.</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">Example 1</span>
        <div class="stmt-kv"><span>Input</span><code>n = 5, edges = [[0,1],[1,2],[3,4]]</code></div>
        <div class="stmt-kv"><span>Output</span><code>2</code></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">Example 2</span>
        <div class="stmt-kv"><span>Input</span><code>n = 5, edges = [[0,1],[1,2],[2,3],[3,4]]</code></div>
        <div class="stmt-kv"><span>Output</span><code>1</code></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>Constraints:</strong>
      <ul>
        <li><code>1 &lt;= n &lt;= 2000</code></li>
        <li><code>1 &lt;= edges.length &lt;= 5000</code></li>
        <li><code>edges[i].length == 2</code></li>
        <li><code>0 &lt;= ai &lt;= bi &lt; n</code></li>
        <li><code>ai != bi</code></li>
        <li>There are no repeated edges.</li>
      </ul>
    </div>
  `,
}

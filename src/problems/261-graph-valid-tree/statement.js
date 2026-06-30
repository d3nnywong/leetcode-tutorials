/* 261. 以图判树 官方题面（leetcode.cn / .com，文字与示例与官方一致，结构重排）。 */

export const src = {
  zh: 'https://leetcode.cn/problems/graph-valid-tree/',
  en: 'https://leetcode.com/problems/graph-valid-tree/',
}

export const statement = {
  zh: `
    <p>你有一个包含 <code>n</code> 个节点的图，节点编号为 <code>0</code> 到 <code>n - 1</code>。
    给定一个整数 <code>n</code> 和一个数组 <code>edges</code>，其中
    <code>edges[i] = [a<sub>i</sub>, b<sub>i</sub>]</code> 表示图中节点 <code>a<sub>i</sub></code>
    和 <code>b<sub>i</sub></code> 之间存在一条无向边。</p>

    <p>如果这些边能够形成一棵合法的树，返回 <code>true</code>，否则返回 <code>false</code>。</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">示例 1</span>
        <div class="stmt-kv"><span>输入</span><code>n = 5, edges = [[0,1],[0,2],[0,3],[1,4]]</code></div>
        <div class="stmt-kv"><span>输出</span><code>true</code></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">示例 2</span>
        <div class="stmt-kv"><span>输入</span><code>n = 5, edges = [[0,1],[1,2],[2,3],[1,3],[1,4]]</code></div>
        <div class="stmt-kv"><span>输出</span><code>false</code></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>提示：</strong>
      <ul>
        <li><code>1 &lt;= n &lt;= 2000</code></li>
        <li><code>0 &lt;= edges.length &lt;= 5000</code></li>
        <li><code>edges[i].length == 2</code></li>
        <li><code>0 &lt;= a<sub>i</sub>, b<sub>i</sub> &lt; n</code></li>
        <li><code>a<sub>i</sub> != b<sub>i</sub></code>，不存在自环</li>
        <li>不存在重复的边</li>
      </ul>
    </div>
  `,

  en: `
    <p>You have a graph of <code>n</code> nodes labeled from <code>0</code> to
    <code>n - 1</code>. You are given an integer <code>n</code> and a list of
    <code>edges</code> where <code>edges[i] = [a<sub>i</sub>, b<sub>i</sub>]</code>
    indicates that there is an undirected edge between nodes <code>a<sub>i</sub></code>
    and <code>b<sub>i</sub></code> in the graph.</p>

    <p>Return <code>true</code> if the edges of the given graph make up a valid tree,
    otherwise return <code>false</code>.</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">Example 1</span>
        <div class="stmt-kv"><span>Input</span><code>n = 5, edges = [[0,1],[0,2],[0,3],[1,4]]</code></div>
        <div class="stmt-kv"><span>Output</span><code>true</code></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">Example 2</span>
        <div class="stmt-kv"><span>Input</span><code>n = 5, edges = [[0,1],[1,2],[2,3],[1,3],[1,4]]</code></div>
        <div class="stmt-kv"><span>Output</span><code>false</code></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>Constraints:</strong>
      <ul>
        <li><code>1 &lt;= n &lt;= 2000</code></li>
        <li><code>0 &lt;= edges.length &lt;= 5000</code></li>
        <li><code>edges[i].length == 2</code></li>
        <li><code>0 &lt;= a<sub>i</sub>, b<sub>i</sub> &lt; n</code></li>
        <li><code>a<sub>i</sub> != b<sub>i</sub></code>, there are no self-loops</li>
        <li>There are no repeated edges</li>
      </ul>
    </div>
  `,
}

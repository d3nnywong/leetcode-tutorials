/*
 * 133. 克隆图 官方题面（leetcode.cn / .com，文字与示例与官方一致，结构重排）。
 */

export const src = {
  zh: 'https://leetcode.cn/problems/clone-graph/',
  en: 'https://leetcode.com/problems/clone-graph/',
}

export const statement = {
  zh: `
    <p>给你无向<strong>连通</strong>图中一个节点的引用，请你返回该图的<strong>深拷贝</strong>（克隆）。</p>

    <p>图中的每个节点都包含它的值 <code>val</code>（<code>int</code>）和其邻居的列表（<code>list[Node]</code>）。</p>

    <pre class="code-block"><code><span class="kw">class</span> <span class="ty">Node</span> {
    <span class="kw">public</span> <span class="ty">int</span> val;
    <span class="kw">public</span> <span class="ty">List</span>&lt;<span class="ty">Node</span>&gt; neighbors;
}</code></pre>

    <p><strong>测试用例格式：</strong></p>
    <p>简单起见，每个节点的值都和它的索引相同。例如，第一个节点值为 1（<code>val = 1</code>），
    第二个节点值为 2（<code>val = 2</code>），以此类推。该图在测试用例中使用<strong>邻接列表</strong>表示。</p>
    <p><strong>邻接列表</strong>是用于表示有限图的无序列表的集合。每个列表都描述了图中节点的邻居集。</p>
    <p>给定节点将始终是图中的第一个节点（值为 1）。你必须将<strong>给定节点的拷贝</strong>作为对克隆图的引用返回。</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">示例 1</span>
        <div class="stmt-kv"><span>输入</span><code>adjList = [[2,4],[1,3],[2,4],[1,3]]</code></div>
        <div class="stmt-kv"><span>输出</span><code>[[2,4],[1,3],[2,4],[1,3]]</code></div>
        <div class="stmt-kv"><span>解释</span><span>
          图中有 4 个节点。节点 1 的值是 1，它有两个邻居：节点 2 和 4。
          节点 2 的值是 2，它有两个邻居：节点 1 和 3。
          节点 3 的值是 3，它有两个邻居：节点 2 和 4。
          节点 4 的值是 4，它有两个邻居：节点 1 和 3。
        </span></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">示例 2</span>
        <div class="stmt-kv"><span>输入</span><code>adjList = [[]]</code></div>
        <div class="stmt-kv"><span>输出</span><code>[[]]</code></div>
        <div class="stmt-kv"><span>解释</span><span>输入包含一个空列表。该图仅仅只有一个值为 1 的节点，它没有任何邻居。</span></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">示例 3</span>
        <div class="stmt-kv"><span>输入</span><code>adjList = []</code></div>
        <div class="stmt-kv"><span>输出</span><code>[]</code></div>
        <div class="stmt-kv"><span>解释</span><span>这个图是空的，它不含任何节点。</span></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>提示：</strong>
      <ul>
        <li>这张图中的节点数在 <code>[0, 100]</code> 之间。</li>
        <li><code>1 &lt;= Node.val &lt;= 100</code></li>
        <li>每个节点值 <code>Node.val</code> 都是唯一的。</li>
        <li>图中没有重复的边，也没有自环。</li>
        <li>图是连通图，你可以从给定节点访问到所有节点。</li>
      </ul>
    </div>
  `,

  en: `
    <p>Given a reference of a node in a <strong>connected</strong> undirected graph.</p>

    <p>Return a <strong>deep copy</strong> (clone) of the graph.</p>

    <p>Each node in the graph contains a value (<code>int</code>) and a list (<code>List[Node]</code>) of its neighbors.</p>

    <pre class="code-block"><code><span class="kw">class</span> <span class="ty">Node</span> {
    <span class="kw">public</span> <span class="ty">int</span> val;
    <span class="kw">public</span> <span class="ty">List</span>&lt;<span class="ty">Node</span>&gt; neighbors;
}</code></pre>

    <p><strong>Test case format:</strong></p>
    <p>For simplicity, each node's value is the same as the node's index (1-indexed). For example,
    the first node with <code>val == 1</code>, the second node with <code>val == 2</code>, and so on.
    The graph is represented in the test case using an adjacency list.</p>
    <p>An <strong>adjacency list</strong> is a collection of unordered <strong>lists</strong> used to represent
    a finite graph. Each list describes the set of neighbors of a node in the graph.</p>
    <p>The given node will always be the first node with <code>val = 1</code>. You must return the
    <strong>copy of the given node</strong> as a reference to the cloned graph.</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">Example 1</span>
        <div class="stmt-kv"><span>Input</span><code>adjList = [[2,4],[1,3],[2,4],[1,3]]</code></div>
        <div class="stmt-kv"><span>Output</span><code>[[2,4],[1,3],[2,4],[1,3]]</code></div>
        <div class="stmt-kv"><span>Explanation</span><span>
          There are 4 nodes in the graph. 1st node (val = 1)'s neighbors are 2nd node (val = 2) and 4th node (val = 4).
          2nd node (val = 2)'s neighbors are 1st node (val = 1) and 3rd node (val = 3).
          3rd node (val = 3)'s neighbors are 2nd node (val = 2) and 4th node (val = 4).
          4th node (val = 4)'s neighbors are 1st node (val = 1) and 3rd node (val = 3).
        </span></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">Example 2</span>
        <div class="stmt-kv"><span>Input</span><code>adjList = [[]]</code></div>
        <div class="stmt-kv"><span>Output</span><code>[[]]</code></div>
        <div class="stmt-kv"><span>Explanation</span><span>Note that the input contains one empty list. The graph consists of only one node with val = 1 and it does not have any neighbors.</span></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">Example 3</span>
        <div class="stmt-kv"><span>Input</span><code>adjList = []</code></div>
        <div class="stmt-kv"><span>Output</span><code>[]</code></div>
        <div class="stmt-kv"><span>Explanation</span><span>This an empty graph, it does not have any nodes.</span></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>Constraints:</strong>
      <ul>
        <li>The number of nodes in the graph is in the range <code>[0, 100]</code>.</li>
        <li><code>1 &lt;= Node.val &lt;= 100</code></li>
        <li><code>Node.val</code> is unique for each node.</li>
        <li>There are no repeated edges and no self-loops in the graph.</li>
        <li>The Graph is connected and all nodes can be visited starting from the given node.</li>
      </ul>
    </div>
  `,
}

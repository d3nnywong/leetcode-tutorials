/* 235. 二叉搜索树的最近公共祖先 官方题面（leetcode.cn / .com，文字与示例与官方一致，结构重排）。 */

export const src = {
  zh: 'https://leetcode.cn/problems/lowest-common-ancestor-of-a-binary-search-tree/',
  en: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/',
}

export const statement = {
  zh: `
    <p>给定一个二叉搜索树，找到该树中两个指定节点的<strong>最近公共祖先</strong>。</p>

    <p>最近公共祖先的定义为：“对于有根树 <code>T</code> 的两个节点 <code>p</code>、<code>q</code>，
    最近公共祖先表示为一个节点 <code>x</code>，满足 <code>x</code> 是 <code>p</code>、<code>q</code>
    的祖先且 <code>x</code> 的深度尽可能大（<strong>一个节点也可以是它自己的祖先</strong>）。”</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">示例 1</span>
        <div class="stmt-kv"><span>输入</span><code>root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 8</code></div>
        <div class="stmt-kv"><span>输出</span><code>6</code></div>
        <div class="stmt-kv"><span>解释</span><span>节点 2 和节点 8 的最近公共祖先是 6。</span></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">示例 2</span>
        <div class="stmt-kv"><span>输入</span><code>root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 4</code></div>
        <div class="stmt-kv"><span>输出</span><code>2</code></div>
        <div class="stmt-kv"><span>解释</span><span>节点 2 和节点 4 的最近公共祖先是 2，因为根据定义最近公共祖先节点可以为节点本身。</span></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">示例 3</span>
        <div class="stmt-kv"><span>输入</span><code>root = [2,1], p = 2, q = 1</code></div>
        <div class="stmt-kv"><span>输出</span><code>2</code></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>提示：</strong>
      <ul>
        <li>树中节点数目在范围 <code>[2, 10^5]</code> 内</li>
        <li><code>-10^9 &lt;= Node.val &lt;= 10^9</code></li>
        <li>所有 <code>Node.val</code> <strong>互不相同</strong></li>
        <li><code>p != q</code></li>
        <li><code>p</code> 和 <code>q</code> 均存在于给定的二叉搜索树中</li>
      </ul>
    </div>
  `,

  en: `
    <p>Given a binary search tree (BST), find the lowest common ancestor (LCA) node of two given
    nodes in the BST.</p>

    <p>According to the
    <a href="https://en.wikipedia.org/wiki/Lowest_common_ancestor" target="_blank" rel="noopener">definition of LCA on Wikipedia</a>:
    “The lowest common ancestor is defined between two nodes <code>p</code> and <code>q</code> as
    the lowest node in <code>T</code> that has both <code>p</code> and <code>q</code> as
    descendants (where we allow <strong>a node to be a descendant of itself</strong>).”</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">Example 1</span>
        <div class="stmt-kv"><span>Input</span><code>root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 8</code></div>
        <div class="stmt-kv"><span>Output</span><code>6</code></div>
        <div class="stmt-kv"><span>Explanation</span><span>The LCA of nodes 2 and 8 is 6.</span></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">Example 2</span>
        <div class="stmt-kv"><span>Input</span><code>root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 4</code></div>
        <div class="stmt-kv"><span>Output</span><code>2</code></div>
        <div class="stmt-kv"><span>Explanation</span><span>The LCA of nodes 2 and 4 is 2, since a node can be a descendant of itself according to the LCA definition.</span></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">Example 3</span>
        <div class="stmt-kv"><span>Input</span><code>root = [2,1], p = 2, q = 1</code></div>
        <div class="stmt-kv"><span>Output</span><code>2</code></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>Constraints:</strong>
      <ul>
        <li>The number of nodes in the tree is in the range <code>[2, 10^5]</code>.</li>
        <li><code>-10^9 &lt;= Node.val &lt;= 10^9</code></li>
        <li>All <code>Node.val</code> are <strong>unique</strong>.</li>
        <li><code>p != q</code></li>
        <li><code>p</code> and <code>q</code> will exist in the BST.</li>
      </ul>
    </div>
  `,
}

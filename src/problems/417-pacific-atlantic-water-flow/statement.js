/* 417. 太平洋大西洋水流问题 官方题面（leetcode.cn / .com，文字与示例与官方一致，结构重排）。 */

export const src = {
  zh: 'https://leetcode.cn/problems/pacific-atlantic-water-flow/',
  en: 'https://leetcode.com/problems/pacific-atlantic-water-flow/',
}

export const statement = {
  zh: `
    <p>有一个 <code>m × n</code> 的矩形岛屿，与<strong>太平洋</strong>和<strong>大西洋</strong>相邻。
    <strong>“太平洋”</strong>处于大陆的左边界和上边界，而 <strong>“大西洋”</strong>处于大陆的右边界和下边界。</p>

    <p>这个岛被分割成一个由若干方形单元格组成的网格。给定一个 <code>m x n</code> 的整数矩阵
    <code>heights</code>，<code>heights[r][c]</code> 表示坐标 <code>(r, c)</code> 上单元格
    <strong>高于海平面的高度</strong>。</p>

    <p>岛上雨水较多，如果相邻单元格的高度 <strong>小于或等于</strong> 当前单元格的高度，雨水可以
    直接向北、南、东、西流向相邻单元格。水可以从海洋附近的任何单元格流入海洋。</p>

    <p>返回网格坐标 <code>result</code> 的 <strong>2D 列表</strong>，其中
    <code>result[i] = [r<sub>i</sub>, c<sub>i</sub>]</code> 表示雨水从单元格
    <code>(r<sub>i</sub>, c<sub>i</sub>)</code> 流动 <strong>既可流向太平洋也可流向大西洋</strong>。</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">示例 1</span>
        <div class="stmt-kv"><span>输入</span><code>heights = [[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]</code></div>
        <div class="stmt-kv"><span>输出</span><code>[[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]</code></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">示例 2</span>
        <div class="stmt-kv"><span>输入</span><code>heights = [[1]]</code></div>
        <div class="stmt-kv"><span>输出</span><code>[[0,0]]</code></div>
        <div class="stmt-kv"><span>解释</span><span>水可以从唯一的单元格流动到太平洋和大西洋。</span></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>提示：</strong>
      <ul>
        <li><code>m == heights.length</code></li>
        <li><code>n == heights[r].length</code></li>
        <li><code>1 &lt;= m, n &lt;= 200</code></li>
        <li><code>0 &lt;= heights[r][c] &lt;= 10^5</code></li>
      </ul>
    </div>
  `,

  en: `
    <p>There is an <code>m x n</code> rectangular island that borders both the
    <strong>Pacific Ocean</strong> and <strong>Atlantic Ocean</strong>. The
    <strong>Pacific Ocean</strong> touches the island's left and top edges, and the
    <strong>Atlantic Ocean</strong> touches the island's right and bottom edges.</p>

    <p>The island is partitioned into a grid of square cells. You are given an
    <code>m x n</code> integer matrix <code>heights</code> where <code>heights[r][c]</code>
    represents the <strong>height above sea level</strong> of the cell at coordinate
    <code>(r, c)</code>.</p>

    <p>The island receives a lot of rain, and the rain water can flow to neighboring cells
    directly north, south, east, and west if the neighboring cell's height is
    <strong>less than or equal to</strong> the current cell's height. Water can flow from any
    cell adjacent to an ocean into the ocean.</p>

    <p>Return <em>a <strong>2D list</strong> of grid coordinates</em> <code>result</code>
    <em>where</em> <code>result[i] = [r<sub>i</sub>, c<sub>i</sub>]</code> <em>denotes that rain
    water can flow from cell</em> <code>(r<sub>i</sub>, c<sub>i</sub>)</code> <em>to
    <strong>both</strong> the Pacific and Atlantic oceans</em>.</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">Example 1</span>
        <div class="stmt-kv"><span>Input</span><code>heights = [[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]</code></div>
        <div class="stmt-kv"><span>Output</span><code>[[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]</code></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">Example 2</span>
        <div class="stmt-kv"><span>Input</span><code>heights = [[1]]</code></div>
        <div class="stmt-kv"><span>Output</span><code>[[0,0]]</code></div>
        <div class="stmt-kv"><span>Explanation</span><span>The water can flow from the only cell to the Pacific and Atlantic oceans.</span></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>Constraints:</strong>
      <ul>
        <li><code>m == heights.length</code></li>
        <li><code>n == heights[r].length</code></li>
        <li><code>1 &lt;= m, n &lt;= 200</code></li>
        <li><code>0 &lt;= heights[r][c] &lt;= 10^5</code></li>
      </ul>
    </div>
  `,
}

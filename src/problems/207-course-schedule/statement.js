/* 207. 课程表 官方题面（leetcode.cn / .com，文字与示例与官方一致，结构重排）。 */

export const src = {
  zh: 'https://leetcode.cn/problems/course-schedule/',
  en: 'https://leetcode.com/problems/course-schedule/',
}

export const statement = {
  zh: `
    <p>你这个学期必须选修 <code>numCourses</code> 门课程，记为 <code>0</code> 到
    <code>numCourses - 1</code> 。</p>

    <p>在选修某些课程之前需要一些先修课程。 先修课程按数组 <code>prerequisites</code> 给出，
    其中 <code>prerequisites[i] = [a<sub>i</sub>, b<sub>i</sub>]</code> ，表示如果要学习课程
    <code>a<sub>i</sub></code> 则 <strong>必须</strong> 先学习课程 <code>b<sub>i</sub></code> 。</p>

    <ul>
      <li>例如，先修课程对 <code>[0, 1]</code> 表示：想要学习课程 <code>0</code> ，你需要先完成课程
      <code>1</code> 。</li>
    </ul>

    <p>请你判断是否可能完成所有课程的学习？如果可以，返回 <code>true</code> ；否则，返回
    <code>false</code> 。</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">示例 1</span>
        <div class="stmt-kv"><span>输入</span><code>numCourses = 2, prerequisites = [[1,0]]</code></div>
        <div class="stmt-kv"><span>输出</span><code>true</code></div>
        <div class="stmt-kv"><span>解释</span><span>总共有 2 门课程。学习课程 1 之前，你需要先完成课程 0 。这是可能的。</span></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">示例 2</span>
        <div class="stmt-kv"><span>输入</span><code>numCourses = 2, prerequisites = [[1,0],[0,1]]</code></div>
        <div class="stmt-kv"><span>输出</span><code>false</code></div>
        <div class="stmt-kv"><span>解释</span><span>总共有 2 门课程。学习课程 1 之前，你需要先完成课程 0 ；并且学习课程 0 之前，你还应先完成课程 1 。这是不可能的。</span></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>提示：</strong>
      <ul>
        <li><code>1 &lt;= numCourses &lt;= 2000</code></li>
        <li><code>0 &lt;= prerequisites.length &lt;= 5000</code></li>
        <li><code>prerequisites[i].length == 2</code></li>
        <li><code>0 &lt;= a<sub>i</sub>, b<sub>i</sub> &lt; numCourses</code></li>
        <li><code>prerequisites[i]</code> 中的所有课程对 <strong>互不相同</strong></li>
      </ul>
    </div>
  `,

  en: `
    <p>There are a total of <code>numCourses</code> courses you have to take, labeled from
    <code>0</code> to <code>numCourses - 1</code>. You are given an array
    <code>prerequisites</code> where <code>prerequisites[i] = [a<sub>i</sub>, b<sub>i</sub>]</code>
    indicates that you <strong>must</strong> take course <code>b<sub>i</sub></code> first if you
    want to take course <code>a<sub>i</sub></code>.</p>

    <ul>
      <li>For example, the pair <code>[0, 1]</code>, indicates that to take course
      <code>0</code> you have to first take course <code>1</code>.</li>
    </ul>

    <p>Return <code>true</code> if you can finish all courses. Otherwise, return
    <code>false</code>.</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">Example 1</span>
        <div class="stmt-kv"><span>Input</span><code>numCourses = 2, prerequisites = [[1,0]]</code></div>
        <div class="stmt-kv"><span>Output</span><code>true</code></div>
        <div class="stmt-kv"><span>Explanation</span><span>There are a total of 2 courses to take. To take course 1 you should have finished course 0. So it is possible.</span></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">Example 2</span>
        <div class="stmt-kv"><span>Input</span><code>numCourses = 2, prerequisites = [[1,0],[0,1]]</code></div>
        <div class="stmt-kv"><span>Output</span><code>false</code></div>
        <div class="stmt-kv"><span>Explanation</span><span>There are a total of 2 courses to take. To take course 1 you should have finished course 0, and to take course 0 you should also have finished course 1. So it is impossible.</span></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>Constraints:</strong>
      <ul>
        <li><code>1 &lt;= numCourses &lt;= 2000</code></li>
        <li><code>0 &lt;= prerequisites.length &lt;= 5000</code></li>
        <li><code>prerequisites[i].length == 2</code></li>
        <li><code>0 &lt;= a<sub>i</sub>, b<sub>i</sub> &lt; numCourses</code></li>
        <li>All the pairs <code>prerequisites[i]</code> are <strong>unique</strong>.</li>
      </ul>
    </div>
  `,
}

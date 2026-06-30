/* 295. 数据流的中位数 官方题面（leetcode.cn / .com，文字与示例与官方一致，结构重排）。 */

export const src = {
  zh: 'https://leetcode.cn/problems/find-median-from-data-stream/',
  en: 'https://leetcode.com/problems/find-median-from-data-stream/',
}

export const statement = {
  zh: `
    <p><strong>中位数</strong>是有序整数列表中的中间值。如果列表的大小是偶数，则没有中间值，
    中位数是两个中间值的平均值。</p>

    <ul>
      <li>例如 <code>arr = [2,3,4]</code> 的中位数是 <code>3</code> 。</li>
      <li>例如 <code>arr = [2,3]</code> 的中位数是 <code>(2 + 3) / 2 = 2.5</code> 。</li>
    </ul>

    <p>实现 MedianFinder 类:</p>

    <ul>
      <li><code>MedianFinder()</code> 初始化 <code>MedianFinder</code> 对象。</li>
      <li><code>void addNum(int num)</code> 将数据流中的整数 <code>num</code> 添加到数据结构中。</li>
      <li><code>double findMedian()</code> 返回到目前为止所有元素的中位数。与实际答案相差
      <code>10<sup>-5</sup></code> 以内的答案将被接受。</li>
    </ul>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">示例 1</span>
        <div class="stmt-kv"><span>输入</span><code>["MedianFinder", "addNum", "addNum", "findMedian", "addNum", "findMedian"]<br/>[[], [1], [2], [], [3], []]</code></div>
        <div class="stmt-kv"><span>输出</span><code>[null, null, null, 1.5, null, 2.0]</code></div>
        <div class="stmt-kv"><span>解释</span><span>
          MedianFinder medianFinder = new MedianFinder();<br/>
          medianFinder.addNum(1);&nbsp;&nbsp;&nbsp;&nbsp;// arr = [1]<br/>
          medianFinder.addNum(2);&nbsp;&nbsp;&nbsp;&nbsp;// arr = [1, 2]<br/>
          medianFinder.findMedian(); // 返回 1.5 ((1 + 2) / 2)<br/>
          medianFinder.addNum(3);&nbsp;&nbsp;&nbsp;&nbsp;// arr = [1, 2, 3]<br/>
          medianFinder.findMedian(); // 返回 2.0
        </span></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>提示：</strong>
      <ul>
        <li><code>-10^5 &lt;= num &lt;= 10^5</code></li>
        <li>在调用 <code>findMedian</code> 之前，数据结构中至少有一个元素</li>
        <li>最多 <code>5 * 10^4</code> 次调用 <code>addNum</code> 和 <code>findMedian</code></li>
      </ul>
      <p class="dp-step__hint">
        进阶：如果数据流中的所有整数都在 <code>[0, 100]</code> 范围内，你将如何优化你的算法？<br/>
        进阶：如果数据流中 <code>99%</code> 的整数都在 <code>[0, 100]</code> 范围内，你将如何优化你的算法？
      </p>
    </div>
  `,

  en: `
    <p>The <strong>median</strong> is the middle value in an ordered integer list. If the size of
    the list is even, there is no middle value, and the median is the mean of the two middle
    values.</p>

    <ul>
      <li>For example, for <code>arr = [2,3,4]</code>, the median is <code>3</code>.</li>
      <li>For example, for <code>arr = [2,3]</code>, the median is <code>(2 + 3) / 2 = 2.5</code>.</li>
    </ul>

    <p>Implement the MedianFinder class:</p>

    <ul>
      <li><code>MedianFinder()</code> initializes the <code>MedianFinder</code> object.</li>
      <li><code>void addNum(int num)</code> adds the integer <code>num</code> from the data stream
      to the data structure.</li>
      <li><code>double findMedian()</code> returns the median of all elements so far. Answers
      within <code>10<sup>-5</sup></code> of the actual answer will be accepted.</li>
    </ul>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">Example 1</span>
        <div class="stmt-kv"><span>Input</span><code>["MedianFinder", "addNum", "addNum", "findMedian", "addNum", "findMedian"]<br/>[[], [1], [2], [], [3], []]</code></div>
        <div class="stmt-kv"><span>Output</span><code>[null, null, null, 1.5, null, 2.0]</code></div>
        <div class="stmt-kv"><span>Explanation</span><span>
          MedianFinder medianFinder = new MedianFinder();<br/>
          medianFinder.addNum(1);&nbsp;&nbsp;&nbsp;&nbsp;// arr = [1]<br/>
          medianFinder.addNum(2);&nbsp;&nbsp;&nbsp;&nbsp;// arr = [1, 2]<br/>
          medianFinder.findMedian(); // return 1.5 (i.e., (1 + 2) / 2)<br/>
          medianFinder.addNum(3);&nbsp;&nbsp;&nbsp;&nbsp;// arr[1, 2, 3]<br/>
          medianFinder.findMedian(); // return 2.0
        </span></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>Constraints:</strong>
      <ul>
        <li><code>-10^5 &lt;= num &lt;= 10^5</code></li>
        <li>There will be at least one element in the data structure before calling
        <code>findMedian</code></li>
        <li>At most <code>5 * 10^4</code> calls will be made to <code>addNum</code> and
        <code>findMedian</code></li>
      </ul>
      <p class="dp-step__hint">
        Follow up: If all integer numbers from the stream are in the range <code>[0, 100]</code>,
        how would you optimize your solution?<br/>
        Follow up: If <code>99%</code> of all integer numbers from the stream are in the range
        <code>[0, 100]</code>, how would you optimize your solution?
      </p>
    </div>
  `,
}

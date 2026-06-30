/* 297. 二叉树的序列化与反序列化 官方题面（leetcode.cn / .com，文字与示例与官方一致，结构重排）。 */

export const src = {
  zh: 'https://leetcode.cn/problems/serialize-and-deserialize-binary-tree/',
  en: 'https://leetcode.com/problems/serialize-and-deserialize-binary-tree/',
}

export const statement = {
  zh: `
    <p>序列化是将一个数据结构或者对象转换为连续的比特位的操作，进而可以将转换后的数据存储在一个文件或者
    内存中，同时也可以通过网络传输到另一个计算机环境，采取相反方式重构得到原数据。</p>

    <p>请设计一个算法来实现二叉树的序列化与反序列化。这里不限定你的序列化 / 反序列化算法执行逻辑，你只需要
    保证一个二叉树可以被序列化为一个字符串，并且将这个字符串反序列化为原始的树结构。</p>

    <p><strong>提示：</strong>输入输出格式与 LeetCode 目前使用的方式一致。你并非必须采取这种方式，
    也可以采用其他的方法解决这个问题。</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">示例 1</span>
        <div class="stmt-kv"><span>输入</span><code>root = [1,2,3,null,null,4,5]</code></div>
        <div class="stmt-kv"><span>输出</span><code>[1,2,3,null,null,4,5]</code></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">示例 2</span>
        <div class="stmt-kv"><span>输入</span><code>root = []</code></div>
        <div class="stmt-kv"><span>输出</span><code>[]</code></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">示例 3</span>
        <div class="stmt-kv"><span>输入</span><code>root = [1]</code></div>
        <div class="stmt-kv"><span>输出</span><code>[1]</code></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">示例 4</span>
        <div class="stmt-kv"><span>输入</span><code>root = [1,2]</code></div>
        <div class="stmt-kv"><span>输出</span><code>[1,2]</code></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>提示：</strong>
      <ul>
        <li>树中结点数在范围 <code>[0, 10^4]</code> 内</li>
        <li><code>-1000 &lt;= Node.val &lt;= 1000</code></li>
      </ul>
    </div>
  `,

  en: `
    <p>Serialization is the process of converting a data structure or object into a sequence of bits
    so that it can be stored in a file or memory buffer, or transmitted across a network connection
    link to be reconstructed later in the same or another computer environment.</p>

    <p>Design an algorithm to serialize and deserialize a binary tree. There is no restriction on how
    your serialization/deserialization algorithm should work. You just need to ensure that a binary
    tree can be serialized to a string and this string can be deserialized to the original tree
    structure.</p>

    <p><strong>Clarification:</strong> The input/output format is the same as how LeetCode serializes
    a binary tree. You do not necessarily need to follow this format, so please be creative and come
    up with different approaches yourself.</p>

    <div class="stmt-examples">
      <div class="stmt-example">
        <span class="stmt-example__title">Example 1</span>
        <div class="stmt-kv"><span>Input</span><code>root = [1,2,3,null,null,4,5]</code></div>
        <div class="stmt-kv"><span>Output</span><code>[1,2,3,null,null,4,5]</code></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">Example 2</span>
        <div class="stmt-kv"><span>Input</span><code>root = []</code></div>
        <div class="stmt-kv"><span>Output</span><code>[]</code></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">Example 3</span>
        <div class="stmt-kv"><span>Input</span><code>root = [1]</code></div>
        <div class="stmt-kv"><span>Output</span><code>[1]</code></div>
      </div>
      <div class="stmt-example">
        <span class="stmt-example__title">Example 4</span>
        <div class="stmt-kv"><span>Input</span><code>root = [1,2]</code></div>
        <div class="stmt-kv"><span>Output</span><code>[1,2]</code></div>
      </div>
    </div>

    <div class="stmt-constraints">
      <strong>Constraints:</strong>
      <ul>
        <li>The number of nodes in the tree is in the range <code>[0, 10^4]</code>.</li>
        <li><code>-1000 &lt;= Node.val &lt;= 1000</code></li>
      </ul>
    </div>
  `,
}

// 105. 从前序与中序遍历序列构造二叉树 —— 页面入口
import { mountProblemShell } from '../../lib/problemPage.js'
import { statement, src } from './statement.js'
import { mountViz } from './viz.js'

mountProblemShell({
  slug: '105-construct-binary-tree-from-preorder-and-inorder-traversal',
  statement,
  src,
})

mountViz(document.querySelector('#viz-mount'))

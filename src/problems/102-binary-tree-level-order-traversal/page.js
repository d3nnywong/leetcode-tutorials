// 102. 二叉树的层序遍历 —— 页面入口
import { mountProblemShell } from '../../lib/problemPage.js'
import { statement, src } from './statement.js'
import { mountViz } from './viz.js'

mountProblemShell({ slug: '102-binary-tree-level-order-traversal', statement, src })

mountViz(document.querySelector('#viz-mount'))

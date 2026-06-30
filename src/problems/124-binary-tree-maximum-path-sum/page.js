// 124. 二叉树中的最大路径和 —— 页面入口
import { mountProblemShell } from '../../lib/problemPage.js'
import { statement, src } from './statement.js'
import { mountViz } from './viz.js'

mountProblemShell({ slug: '124-binary-tree-maximum-path-sum', statement, src })

mountViz(document.querySelector('#viz-mount'))

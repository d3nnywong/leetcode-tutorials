// 104. 二叉树的最大深度 —— 页面入口
import { mountProblemShell } from '../../lib/problemPage.js'
import { statement, src } from './statement.js'
import { mountViz } from './viz.js'

mountProblemShell({ slug: '104-maximum-depth-of-binary-tree', statement, src })

mountViz(document.querySelector('#viz-mount'))

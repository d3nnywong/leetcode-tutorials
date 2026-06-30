// 226. 翻转二叉树 —— 页面入口
import { mountProblemShell } from '../../lib/problemPage.js'
import { statement, src } from './statement.js'
import { mountViz } from './viz.js'

mountProblemShell({ slug: '226-invert-binary-tree', statement, src })

mountViz(document.querySelector('#viz-mount'))

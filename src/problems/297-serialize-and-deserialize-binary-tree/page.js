// 297. 二叉树的序列化与反序列化 —— 页面入口
import { mountProblemShell } from '../../lib/problemPage.js'
import { statement, src } from './statement.js'
import { mountViz } from './viz.js'

mountProblemShell({ slug: '297-serialize-and-deserialize-binary-tree', statement, src })

mountViz(document.querySelector('#viz-mount'))

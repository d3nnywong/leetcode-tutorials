// 572. 另一棵树的子树 —— 页面入口
import { mountProblemShell } from '../../lib/problemPage.js'
import { statement, src } from './statement.js'
import { mountViz } from './viz.js'

mountProblemShell({ slug: '572-subtree-of-another-tree', statement, src })

mountViz(document.querySelector('#viz-mount'))

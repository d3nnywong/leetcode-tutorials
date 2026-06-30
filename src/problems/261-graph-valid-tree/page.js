// 261. 以图判树 —— 页面入口
import { mountProblemShell } from '../../lib/problemPage.js'
import { statement, src } from './statement.js'
import { mountViz } from './viz.js'

mountProblemShell({ slug: '261-graph-valid-tree', statement, src })

mountViz(document.querySelector('#viz-mount'))

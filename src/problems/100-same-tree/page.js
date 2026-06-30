// 100. 相同的树 —— 页面入口
import { mountProblemShell } from '../../lib/problemPage.js'
import { statement, src } from './statement.js'
import { mountViz } from './viz.js'

mountProblemShell({ slug: '100-same-tree', statement, src })

mountViz(document.querySelector('#viz-mount'))

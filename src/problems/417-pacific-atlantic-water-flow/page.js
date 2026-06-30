// 417. 太平洋大西洋水流问题 —— 页面入口
import { mountProblemShell } from '../../lib/problemPage.js'
import { statement, src } from './statement.js'
import { mountViz } from './viz.js'

mountProblemShell({ slug: '417-pacific-atlantic-water-flow', statement, src })

mountViz(document.querySelector('#viz-mount'))

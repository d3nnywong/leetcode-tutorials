// 62. 不同路径 —— 页面入口
import { mountProblemShell } from '../../lib/problemPage.js'
import { statement, src } from './statement.js'
import { mountViz } from './viz.js'

mountProblemShell({ slug: '62-unique-paths', statement, src })

mountViz(document.querySelector('#viz-mount'))

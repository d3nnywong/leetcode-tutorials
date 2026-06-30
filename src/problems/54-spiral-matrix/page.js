// 54. 螺旋矩阵 —— 页面入口
import { mountProblemShell } from '../../lib/problemPage.js'
import { statement, src } from './statement.js'
import { mountViz } from './viz.js'

mountProblemShell({ slug: '54-spiral-matrix', statement, src })

mountViz(document.querySelector('#viz-mount'))

// 73. 矩阵置零 —— 页面入口
import { mountProblemShell } from '../../lib/problemPage.js'
import { statement, src } from './statement.js'
import { mountViz } from './viz.js'

mountProblemShell({ slug: '73-set-matrix-zeroes', statement, src })

mountViz(document.querySelector('#viz-mount'))

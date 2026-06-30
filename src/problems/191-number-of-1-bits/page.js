// 191. 位1的个数 —— 页面入口
import { mountProblemShell } from '../../lib/problemPage.js'
import { statement, src } from './statement.js'
import { mountViz } from './viz.js'

mountProblemShell({ slug: '191-number-of-1-bits', statement, src })

mountViz(document.querySelector('#viz-mount'))

// 371. 两整数之和 —— 页面入口
import { mountProblemShell } from '../../lib/problemPage.js'
import { statement, src } from './statement.js'
import { mountViz } from './viz.js'

mountProblemShell({ slug: '371-sum-of-two-integers', statement, src })

mountViz(document.querySelector('#viz-mount'))

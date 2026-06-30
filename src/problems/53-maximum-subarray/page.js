// 53. 最大子数组和 —— 页面入口
import { mountProblemShell } from '../../lib/problemPage.js'
import { statement, src } from './statement.js'
import { mountViz } from './viz.js'

mountProblemShell({ slug: '53-maximum-subarray', statement, src })

mountViz(document.querySelector('#viz-mount'))

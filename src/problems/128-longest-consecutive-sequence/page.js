// 128. 最长连续序列 —— 页面入口
import { mountProblemShell } from '../../lib/problemPage.js'
import { statement, src } from './statement.js'
import { mountViz } from './viz.js'

mountProblemShell({ slug: '128-longest-consecutive-sequence', statement, src })

mountViz(document.querySelector('#viz-mount'))

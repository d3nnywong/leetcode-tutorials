// 295. 数据流的中位数 —— 页面入口
import { mountProblemShell } from '../../lib/problemPage.js'
import { statement, src } from './statement.js'
import { mountViz } from './viz.js'

mountProblemShell({ slug: '295-find-median-from-data-stream', statement, src })

mountViz(document.querySelector('#viz-mount'))

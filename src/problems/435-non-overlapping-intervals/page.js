// 435. 无重叠区间 —— 页面入口
import { mountProblemShell } from '../../lib/problemPage.js'
import { statement, src } from './statement.js'
import { mountViz } from './viz.js'

mountProblemShell({ slug: '435-non-overlapping-intervals', statement, src })

mountViz(document.querySelector('#viz-mount'))

// 57. 插入区间 —— 页面入口
import { mountProblemShell } from '../../lib/problemPage.js'
import { statement, src } from './statement.js'
import { mountViz } from './viz.js'

mountProblemShell({ slug: '57-insert-interval', statement, src })

mountViz(document.querySelector('#viz-mount'))

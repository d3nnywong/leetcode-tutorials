// 198. 打家劫舍 —— 页面入口
import { mountProblemShell } from '../../lib/problemPage.js'
import { statement, src } from './statement.js'
import { mountViz } from './viz.js'

mountProblemShell({ slug: '198-house-robber', statement, src })

mountViz(document.querySelector('#viz-mount'))

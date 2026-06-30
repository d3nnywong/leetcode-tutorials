// 322. 零钱兑换 —— 页面入口
import { mountProblemShell } from '../../lib/problemPage.js'
import { statement, src } from './statement.js'
import { mountViz } from './viz.js'

mountProblemShell({ slug: '322-coin-change', statement, src })

mountViz(document.querySelector('#viz-mount'))

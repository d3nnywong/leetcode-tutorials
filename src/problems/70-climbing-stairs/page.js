// 70. 爬楼梯 —— 页面入口
import { mountProblemShell } from '../../lib/problemPage.js'
import { statement, src } from './statement.js'
import { mountViz } from './viz.js'

mountProblemShell({ slug: '70-climbing-stairs', statement, src })

mountViz(document.querySelector('#viz-mount'))

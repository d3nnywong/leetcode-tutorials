// 143. 重排链表 —— 页面入口
import { mountProblemShell } from '../../lib/problemPage.js'
import { statement, src } from './statement.js'
import { mountViz } from './viz.js'

mountProblemShell({ slug: '143-reorder-list', statement, src })

mountViz(document.querySelector('#viz-mount'))

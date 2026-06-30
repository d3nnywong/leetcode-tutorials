// 206. 反转链表 —— 页面入口
import { mountProblemShell } from '../../lib/problemPage.js'
import { statement, src } from './statement.js'
import { mountViz } from './viz.js'

mountProblemShell({ slug: '206-reverse-linked-list', statement, src })

mountViz(document.querySelector('#viz-mount'))

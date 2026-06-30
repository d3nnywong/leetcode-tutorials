// 21. 合并两个有序链表 —— 页面入口
import { mountProblemShell } from '../../lib/problemPage.js'
import { statement, src } from './statement.js'
import { mountViz } from './viz.js'

mountProblemShell({ slug: '21-merge-two-sorted-lists', statement, src })

mountViz(document.querySelector('#viz-mount'))

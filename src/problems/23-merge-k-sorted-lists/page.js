// 23. 合并 K 个升序链表 —— 页面入口
import { mountProblemShell } from '../../lib/problemPage.js'
import { statement, src } from './statement.js'
import { mountViz } from './viz.js'

mountProblemShell({ slug: '23-merge-k-sorted-lists', statement, src })

mountViz(document.querySelector('#viz-mount'))

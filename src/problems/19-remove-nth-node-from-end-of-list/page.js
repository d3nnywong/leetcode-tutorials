// 19. 删除链表的倒数第 N 个结点 —— 页面入口
import { mountProblemShell } from '../../lib/problemPage.js'
import { statement, src } from './statement.js'
import { mountViz } from './viz.js'

mountProblemShell({ slug: '19-remove-nth-node-from-end-of-list', statement, src })

mountViz(document.querySelector('#viz-mount'))

// 190. 颠倒二进制位 —— 页面入口
import { mountProblemShell } from '../../lib/problemPage.js'
import { statement, src } from './statement.js'
import { mountViz } from './viz.js'

mountProblemShell({ slug: '190-reverse-bits', statement, src })

mountViz(document.querySelector('#viz-mount'))

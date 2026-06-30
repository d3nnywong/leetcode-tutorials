// 20. 有效的括号 —— 页面入口
import { mountProblemShell } from '../../lib/problemPage.js'
import { statement, src } from './statement.js'
import { mountViz } from './viz.js'

mountProblemShell({ slug: '20-valid-parentheses', statement, src })

mountViz(document.querySelector('#viz-mount'))

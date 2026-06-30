// 76. 最小覆盖子串 —— 页面入口
import { mountProblemShell } from '../../lib/problemPage.js'
import { statement, src } from './statement.js'
import { mountViz } from './viz.js'

mountProblemShell({ slug: '76-minimum-window-substring', statement, src })

mountViz(document.querySelector('#viz-mount'))

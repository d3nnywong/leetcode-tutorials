// 338. 比特位计数 —— 页面入口
import { mountProblemShell } from '../../lib/problemPage.js'
import { statement, src } from './statement.js'
import { mountViz } from './viz.js'

mountProblemShell({ slug: '338-counting-bits', statement, src })

mountViz(document.querySelector('#viz-mount'))

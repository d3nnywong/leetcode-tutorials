// 91. 解码方法 —— 页面入口
import { mountProblemShell } from '../../lib/problemPage.js'
import { statement, src } from './statement.js'
import { mountViz } from './viz.js'

mountProblemShell({ slug: '91-decode-ways', statement, src })

mountViz(document.querySelector('#viz-mount'))

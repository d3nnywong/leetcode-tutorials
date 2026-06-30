// 79. 单词搜索 —— 页面入口
import { mountProblemShell } from '../../lib/problemPage.js'
import { statement, src } from './statement.js'
import { mountViz } from './viz.js'

mountProblemShell({ slug: '79-word-search', statement, src })

mountViz(document.querySelector('#viz-mount'))

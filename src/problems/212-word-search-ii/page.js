// 212. 单词搜索 II —— 页面入口
import { mountProblemShell } from '../../lib/problemPage.js'
import { statement, src } from './statement.js'
import { mountViz } from './viz.js'

mountProblemShell({ slug: '212-word-search-ii', statement, src })

mountViz(document.querySelector('#viz-mount'))

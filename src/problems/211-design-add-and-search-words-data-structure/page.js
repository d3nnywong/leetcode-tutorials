// 211. 添加与搜索单词 - 数据结构设计 —— 页面入口
import { mountProblemShell } from '../../lib/problemPage.js'
import { statement, src } from './statement.js'
import { mountViz } from './viz.js'

mountProblemShell({ slug: '211-design-add-and-search-words-data-structure', statement, src })

mountViz(document.querySelector('#viz-mount'))

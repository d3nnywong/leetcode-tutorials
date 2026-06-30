// 300. 最长递增子序列 —— 页面入口
import { mountProblemShell } from '../../lib/problemPage.js'
import { statement, src } from './statement.js'
import { mountViz } from './viz.js'

mountProblemShell({ slug: '300-longest-increasing-subsequence', statement, src })

mountViz(document.querySelector('#viz-mount'))

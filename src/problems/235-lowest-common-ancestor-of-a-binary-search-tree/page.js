// 235. 二叉搜索树的最近公共祖先 —— 页面入口
import { mountProblemShell } from '../../lib/problemPage.js'
import { statement, src } from './statement.js'
import { mountViz } from './viz.js'

mountProblemShell({ slug: '235-lowest-common-ancestor-of-a-binary-search-tree', statement, src })

mountViz(document.querySelector('#viz-mount'))

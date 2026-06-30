// 230. 二叉搜索树中第 K 小的元素 —— 页面入口
import { mountProblemShell } from '../../lib/problemPage.js'
import { statement, src } from './statement.js'
import { mountViz } from './viz.js'

mountProblemShell({ slug: '230-kth-smallest-element-in-a-bst', statement, src })

mountViz(document.querySelector('#viz-mount'))

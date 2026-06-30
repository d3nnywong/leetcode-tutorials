// 33. 搜索旋转排序数组 —— 页面入口
import { mountProblemShell } from '../../lib/problemPage.js'
import { statement, src } from './statement.js'
import { mountViz } from './viz.js'

mountProblemShell({ slug: '33-search-in-rotated-sorted-array', statement, src })

mountViz(document.querySelector('#viz-mount'))

// 153. 寻找旋转排序数组中的最小值 —— 页面入口
import { mountProblemShell } from '../../lib/problemPage.js'
import { statement, src } from './statement.js'
import { mountViz } from './viz.js'

mountProblemShell({ slug: '153-find-minimum-in-rotated-sorted-array', statement, src })

mountViz(document.querySelector('#viz-mount'))

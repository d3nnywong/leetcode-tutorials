// 152. 乘积最大子数组 —— 页面入口
import { mountProblemShell } from '../../lib/problemPage.js'
import { statement, src } from './statement.js'
import { mountViz } from './viz.js'

mountProblemShell({ slug: '152-maximum-product-subarray', statement, src })

mountViz(document.querySelector('#viz-mount'))

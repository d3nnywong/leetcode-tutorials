// 238. 除自身以外数组的乘积 —— 页面入口
import { mountProblemShell } from '../../lib/problemPage.js'
import { statement, src } from './statement.js'
import { mountViz } from './viz.js'

mountProblemShell({ slug: '238-product-of-array-except-self', statement, src })

mountViz(document.querySelector('#viz-mount'))

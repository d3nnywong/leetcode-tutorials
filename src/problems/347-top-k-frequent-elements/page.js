// 347. 前 K 个高频元素 —— 页面入口
import { mountProblemShell } from '../../lib/problemPage.js'
import { statement, src } from './statement.js'
import { mountViz } from './viz.js'

mountProblemShell({ slug: '347-top-k-frequent-elements', statement, src })

mountViz(document.querySelector('#viz-mount'))

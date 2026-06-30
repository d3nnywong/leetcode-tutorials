// 48. 旋转图像 —— 页面入口
import { mountProblemShell } from '../../lib/problemPage.js'
import { statement, src } from './statement.js'
import { mountViz } from './viz.js'

mountProblemShell({ slug: '48-rotate-image', statement, src })

mountViz(document.querySelector('#viz-mount'))

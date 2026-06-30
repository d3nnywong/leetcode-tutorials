// 217. 存在重复元素 —— 页面入口
import { mountProblemShell } from '../../lib/problemPage.js'
import { statement, src } from './statement.js'
import { mountViz } from './viz.js'

mountProblemShell({ slug: '217-contains-duplicate', statement, src })

mountViz(document.querySelector('#viz-mount'))

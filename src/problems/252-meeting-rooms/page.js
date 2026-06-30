// 252. 会议室 —— 页面入口
import { mountProblemShell } from '../../lib/problemPage.js'
import { statement, src } from './statement.js'
import { mountViz } from './viz.js'

mountProblemShell({ slug: '252-meeting-rooms', statement, src })

mountViz(document.querySelector('#viz-mount'))

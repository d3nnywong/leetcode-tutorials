// 55. 跳跃游戏 —— 页面入口
import { mountProblemShell } from '../../lib/problemPage.js'
import { statement, src } from './statement.js'
import { mountViz } from './viz.js'

mountProblemShell({ slug: '55-jump-game', statement, src })

mountViz(document.querySelector('#viz-mount'))

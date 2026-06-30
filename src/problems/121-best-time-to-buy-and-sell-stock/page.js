// 121. 买卖股票的最佳时机 —— 页面入口
import { mountProblemShell } from '../../lib/problemPage.js'
import { statement, src } from './statement.js'
import { mountViz } from './viz.js'

mountProblemShell({ slug: '121-best-time-to-buy-and-sell-stock', statement, src })

mountViz(document.querySelector('#viz-mount'))

// 323. 无向图中连通分量的数目 —— 页面入口
import { mountProblemShell } from '../../lib/problemPage.js'
import { statement, src } from './statement.js'
import { mountViz } from './viz.js'

mountProblemShell({
  slug: '323-number-of-connected-components-in-an-undirected-graph',
  statement,
  src,
})

mountViz(document.querySelector('#viz-mount'))

// 208. 实现 Trie (前缀树) —— 页面入口
import { mountProblemShell } from '../../lib/problemPage.js'
import { statement, src } from './statement.js'
import { mountViz } from './viz.js'

mountProblemShell({ slug: '208-implement-trie-prefix-tree', statement, src })

mountViz(document.querySelector('#viz-mount'))

// 647. 回文子串 —— 页面入口
import { mountProblemShell } from '../../lib/problemPage.js'
import { statement, src } from './statement.js'
import { mountViz } from './viz.js'

mountProblemShell({ slug: '647-palindromic-substrings', statement, src })

mountViz(document.querySelector('#viz-mount'))

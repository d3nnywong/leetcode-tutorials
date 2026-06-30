// 271. 字符串的编码与解码 —— 页面入口
import { mountProblemShell } from '../../lib/problemPage.js'
import { statement, src } from './statement.js'
import { mountViz } from './viz.js'

mountProblemShell({ slug: '271-encode-and-decode-strings', statement, src })

mountViz(document.querySelector('#viz-mount'))

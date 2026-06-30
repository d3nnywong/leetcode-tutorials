// 242. 有效的字母异位词 —— 页面入口
import { mountProblemShell } from '../../lib/problemPage.js'
import { statement, src } from './statement.js'
import { mountViz } from './viz.js'

mountProblemShell({ slug: '242-valid-anagram', statement, src })

mountViz(document.querySelector('#viz-mount'))

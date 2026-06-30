// 3. 无重复字符的最长子串 —— 页面入口
import { mountProblemShell } from '../../lib/problemPage.js'
import { statement, src } from './statement.js'
import { mountViz } from './viz.js'

mountProblemShell({ slug: '3-longest-substring-without-repeating-characters', statement, src })

mountViz(document.querySelector('#viz-mount'))

// 424. 替换后的最长重复字符 —— 页面入口
import { mountProblemShell } from '../../lib/problemPage.js'
import { statement, src } from './statement.js'
import { mountViz } from './viz.js'

mountProblemShell({ slug: '424-longest-repeating-character-replacement', statement, src })

mountViz(document.querySelector('#viz-mount'))

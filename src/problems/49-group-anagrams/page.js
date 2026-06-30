// 49. 字母异位词分组 —— 页面入口
import { mountProblemShell } from '../../lib/problemPage.js'
import { statement, src } from './statement.js'
import { mountViz } from './viz.js'

mountProblemShell({ slug: '49-group-anagrams', statement, src })

mountViz(document.querySelector('#viz-mount'))

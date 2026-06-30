// 11. 盛最多水的容器 —— 页面入口
import { mountProblemShell } from '../../lib/problemPage.js'
import { statement, src } from './statement.js'
import { mountContainer } from './container.js'

mountProblemShell({ slug: '11-container-with-most-water', statement, src })

mountContainer(document.querySelector('#cw-mount'))

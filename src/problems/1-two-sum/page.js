// 1. 两数之和 —— 页面入口
import { mountProblemShell } from '../../lib/problemPage.js'
import { statement, src } from './statement.js'
import { mountTwoSum } from './twoSum.js'

mountProblemShell({ slug: '1-two-sum', statement, src })

mountTwoSum(document.querySelector('#ts-mount'))

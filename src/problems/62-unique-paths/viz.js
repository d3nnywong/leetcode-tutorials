/*
 * 62. 不同路径 —— 二维网格 DP 动画。
 *
 * dp[i][j] = 从左上角走到格子 (i,j) 的不同路径数。
 *   - 第一行 / 第一列（边界）：只能一直沿同一方向走，所以恒为 1；
 *   - 内部格子：机器人到 (i,j) 的「最后一步」要么是从上面 (i-1,j) 往下走一步，
 *     要么是从左边 (i,j-1) 往右走一步，两种来源互不重叠，所以
 *     dp[i][j] = dp[i-1][j] + dp[i][j-1]。
 * 按行优先顺序把网格逐格填满，最终右下角 dp[m-1][n-1] 就是答案。
 */
import { VizPlayer } from '../../components/viz-player/vizPlayer.js'

const MAX_ROWS = 8
const MAX_COLS = 8

export class UniquePathsViz extends VizPlayer {
  constructor(mountEl) {
    super(mountEl, {
      inputs: [
        { key: 'm', label: '行数 m（上下方向）', default: '3', width: '5rem' },
        { key: 'n', label: '列数 n（左右方向）', default: '7', width: '5rem' },
      ],
      speed: 550,
      hint: `提示：m 是行数、n 是列数，机器人从左上角走到右下角。为了表格清晰，最多 ${MAX_ROWS} 行 × ${MAX_COLS} 列。`,
    })
  }

  parseInputs({ m, n }) {
    const parseDim = (raw, label, max) => {
      const v = Math.trunc(Number(raw))
      if (!Number.isFinite(v)) throw new Error(`${label} 不是合法数字`)
      if (v < 1) throw new Error(`${label} 至少为 1`)
      if (v > max) throw new Error(`为了表格清晰，${label} 最多 ${max}`)
      return v
    }
    const mm = parseDim(m, 'm（行数）', MAX_ROWS)
    const nn = parseDim(n, 'n（列数）', MAX_COLS)
    return { m: mm, n: nn, display: { m: String(mm), n: String(nn) } }
  }

  computeSteps({ m, n }) {
    const dp = Array.from({ length: m }, () => new Array(n).fill(0))
    const steps = []

    for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++) {
        const sources = []
        let value
        let msg
        if (i === 0 && j === 0) {
          value = 1
          msg = `起点 (0,0)：机器人就站在这里，只有 <strong>1</strong> 种「待在起点」的状态 → dp[0][0] = 1。`
        } else if (i === 0) {
          sources.push({ i, j: j - 1 })
          value = dp[i][j - 1]
          msg = `格子 (0,${j}) 在第一行：只能一路从左边 (0,${j - 1}) 往右走过来 → dp[0][${j}] = dp[0][${j - 1}] = ${value}。`
        } else if (j === 0) {
          sources.push({ i: i - 1, j })
          value = dp[i - 1][j]
          msg = `格子 (${i},0) 在第一列：只能一路从上边 (${i - 1},0) 往下走过来 → dp[${i}][0] = dp[${i - 1}][0] = ${value}。`
        } else {
          sources.push({ i: i - 1, j })
          sources.push({ i, j: j - 1 })
          const up = dp[i - 1][j]
          const left = dp[i][j - 1]
          value = up + left
          msg = `格子 (${i},${j})：最后一步要么从上边 (${i - 1},${j}) 走下来，要么从左边 (${i},${j - 1}) 走过来 → dp[${i}][${j}] = ${up} + ${left} = <strong>${value}</strong>。`
        }
        dp[i][j] = value
        steps.push({ i, j, value, sources, msg })
      }
    }

    const result = dp[m - 1][n - 1]
    if (steps.length) {
      steps[steps.length - 1].msg += ` 整张表填完，右下角 dp[${m - 1}][${n - 1}] 就是答案：<strong>${result}</strong> 条不同路径！`
    }
    return { steps, result }
  }

  buildStage({ m, n }, el) {
    el.innerHTML = `<div class="up__board" style="--up-cols:${n}"></div>`
    this.boardEl = el.querySelector('.up__board')

    let html = ''
    for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++) {
        const isStart = i === 0 && j === 0
        const isFinish = i === m - 1 && j === n - 1
        html += `<span class="up__cell" data-i="${i}" data-j="${j}">
          <span class="up__tag">${isStart ? 'Start' : isFinish ? 'Finish' : ''}</span>
          <b class="up__val"></b>
        </span>`
      }
    }
    this.boardEl.innerHTML = html

    this.cellEls = []
    for (let i = 0; i < m; i++) {
      this.cellEls.push([])
      for (let j = 0; j < n; j++) {
        this.cellEls[i].push(this.boardEl.querySelector(`.up__cell[data-i="${i}"][data-j="${j}"]`))
      }
    }
  }

  renderStep(st, { state, idx }) {
    const { m, n } = state
    for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++) {
        const cell = this.cellEls[i][j]
        cell.className = 'up__cell'
        cell.querySelector('.up__val').textContent = ''
      }
    }

    for (let order = 0; order <= idx; order++) {
      const s = this.steps[order]
      const cell = this.cellEls[s.i][s.j]
      cell.querySelector('.up__val').textContent = s.value
      cell.classList.add(order === idx ? 'is-current' : 'is-filled')
    }

    st.sources.forEach(({ i, j }) => this.cellEls[i]?.[j]?.classList.add('is-source'))

    if (idx === this.steps.length - 1) {
      this.cellEls[m - 1][n - 1].classList.add('is-goal')
    }
  }

  resultBanner(result, state) {
    return {
      kind: 'success',
      html: `🎉 填完整张 dp 表！机器人从左上角到右下角一共有 <strong>${result}</strong> 条不同路径
        （即 dp[${state.m - 1}][${state.n - 1}] = ${result}）。`,
    }
  }
}

export function mountViz(el, opts) {
  return new UniquePathsViz(el, opts)
}

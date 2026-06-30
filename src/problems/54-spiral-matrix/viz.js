/*
 * 螺旋矩阵「四边界收缩」动画。
 *
 * 用 top / bottom / left / right 四个边界框住「还没访问的区域」：
 *   1) 沿 top 行从 left 走到 right → top 行用完，top++
 *   2) 沿 right 列从 top 走到 bottom → right 列用完，right--
 *   3) 如果 top<=bottom，沿 bottom 行从 right 走到 left → bottom--
 *   4) 如果 left<=right，沿 left 列从 bottom 走到 top → left++
 * 四个边界收缩到「框」消失（top>bottom 或 left>right）就遍历完了。
 * 每一步只是「往一个方向挪一格」，整体只走 m*n 步，O(m·n)。
 */
import { VizPlayer } from '../../components/viz-player/vizPlayer.js'

const MAX_ROWS = 6
const MAX_COLS = 6

const DIR_LABEL = { right: '→ 向右', down: '↓ 向下', left: '← 向左', up: '↑ 向上' }
const DIR_ARROW = { right: '→', down: '↓', left: '←', up: '↑' }

export class SpiralMatrixViz extends VizPlayer {
  constructor(mountEl) {
    super(mountEl, {
      inputs: [
        {
          key: 'matrix',
          label: '矩阵（分号分隔行，逗号分隔列）',
          default: '1,2,3;4,5,6;7,8,9',
          width: '17rem',
        },
      ],
      speed: 650,
      hint: `提示：例如 1,2,3,4;5,6,7,8;9,10,11,12 表示 3 行 4 列。最多 ${MAX_ROWS} 行 × ${MAX_COLS} 列。`,
    })
  }

  parseInputs({ matrix }) {
    const rows = (matrix ?? '')
      .split(';')
      .map((r) => r.trim())
      .filter((r) => r !== '')
    if (rows.length === 0) throw new Error('矩阵不能为空')
    if (rows.length > MAX_ROWS) throw new Error(`行数最多 ${MAX_ROWS} 行`)

    const parsed = rows.map((r) =>
      r
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s !== '')
        .map((s) => {
          const v = Number(s)
          if (!Number.isFinite(v)) throw new Error(`「${s}」不是合法数字`)
          return Math.trunc(v)
        }),
    )

    const n = parsed[0].length
    if (n === 0) throw new Error('每行至少要有 1 个数')
    if (n > MAX_COLS) throw new Error(`列数最多 ${MAX_COLS} 列`)
    if (parsed.some((r) => r.length !== n)) throw new Error('每行的列数必须相同')

    return {
      matrix: parsed,
      m: parsed.length,
      n,
      display: { matrix: parsed.map((r) => r.join(',')).join(';') },
    }
  }

  computeSteps({ matrix, m, n }) {
    const steps = []
    const result = []
    const visited = []
    let top = 0,
      bottom = m - 1,
      left = 0,
      right = n - 1
    const total = m * n

    const push = (i, j, dir) => {
      const v = matrix[i][j]
      result.push(v)
      visited.push({ i, j })
      steps.push({
        i,
        j,
        dir,
        v,
        path: visited.slice(),
        result: result.slice(),
        msg: `${DIR_LABEL[dir]}：访问 <code>matrix[${i}][${j}]</code> = <strong>${v}</strong>，已收集 ${result.length} / ${total} 个元素。`,
      })
    }

    while (top <= bottom && left <= right) {
      for (let j = left; j <= right; j++) push(top, j, 'right')
      top++
      for (let i = top; i <= bottom; i++) push(i, right, 'down')
      right--
      if (top <= bottom) {
        for (let j = right; j >= left; j--) push(bottom, j, 'left')
        bottom--
      }
      if (left <= right) {
        for (let i = bottom; i >= top; i--) push(i, left, 'up')
        left++
      }
    }

    if (steps.length) {
      steps[steps.length - 1].msg += ' 四个边界都收缩完了，螺旋遍历结束！'
    }

    return { steps, result }
  }

  buildStage({ m, n, matrix }, el) {
    el.innerHTML = `
      <div class="sm__board" style="--sm-cols:${n}"></div>
      <div class="sm__outlabel">螺旋输出顺序</div>
      <div class="sm__output"></div>
    `
    this.boardEl = el.querySelector('.sm__board')
    this.outputEl = el.querySelector('.sm__output')

    this.boardEl.innerHTML = matrix
      .map((row, i) =>
        row
          .map(
            (v, j) =>
              `<span class="sm__cell" data-i="${i}" data-j="${j}">
                <b class="sm__val">${v}</b>
                <span class="sm__arrow"></span>
              </span>`,
          )
          .join(''),
      )
      .join('')

    this.cellEls = []
    for (let i = 0; i < m; i++) {
      this.cellEls.push([])
      for (let j = 0; j < n; j++) {
        this.cellEls[i].push(this.boardEl.querySelector(`.sm__cell[data-i="${i}"][data-j="${j}"]`))
      }
    }
  }

  renderStep(st) {
    for (const row of this.cellEls) {
      for (const cell of row) {
        cell.className = 'sm__cell'
        cell.querySelector('.sm__arrow').textContent = ''
      }
    }

    const path = st.path ?? []
    path.forEach(({ i, j }, idx) => {
      const cell = this.cellEls[i]?.[j]
      if (!cell) return
      if (idx === path.length - 1) {
        cell.classList.add('is-current')
        cell.querySelector('.sm__arrow').textContent = DIR_ARROW[st.dir] ?? ''
      } else {
        cell.classList.add('is-visited')
      }
    })

    const result = st.result ?? []
    this.outputEl.innerHTML =
      result.length === 0
        ? `<span class="sm__empty">（还没收集到元素）</span>`
        : result
            .map(
              (v, idx) =>
                `<span class="sm__out-chip${idx === result.length - 1 ? ' is-last' : ''}">${v}</span>`,
            )
            .join('')
  }

  resultBanner(result) {
    return {
      kind: 'success',
      html: `🎉 螺旋遍历完成！结果为 <code>[${result.join(', ')}]</code>。`,
    }
  }
}

export function mountViz(el, opts) {
  return new SpiralMatrixViz(el, opts)
}

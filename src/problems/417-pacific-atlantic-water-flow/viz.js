/*
 * 太平洋大西洋水流问题「反向多源 BFS」动画。
 *
 * 正着想「这滴水能不能流到海洋」很难（要枚举每个格子往外找路径）。
 * 反过来想：从两个海洋的海岸线分别出发，往「地势更高或相等」的方向倒着「逆流」，
 * 能摸到的格子就是「正着能流到这片海洋」的格子——因为水从高处流到低（或相等）处，
 * 逆流正好就是从低处爬到高（或相等）处。
 * 对太平洋（上边界 + 左边界）做一次多源 BFS，对大西洋（下边界 + 右边界）再做一次，
 * 两次都能摸到的格子，就是「既能流向太平洋、也能流向大西洋」的答案。
 */
import { VizPlayer } from '../../components/viz-player/vizPlayer.js'

const MAX_ROWS = 8
const MAX_COLS = 8

export class PacificAtlanticViz extends VizPlayer {
  constructor(mountEl) {
    super(mountEl, {
      inputs: [
        {
          key: 'heights',
          label: `高度矩阵 heights（行用「;」分隔，同行格子用「,」分隔，最多 ${MAX_ROWS} 行 × ${MAX_COLS} 列）`,
          default: '1,2,2,3,5;3,2,3,4,4;2,4,5,3,1;6,7,1,4,5;5,1,1,2,4',
          width: '26rem',
        },
      ],
      speed: 550,
      hint: `提示：可改成你自己的矩阵（如 1,2;1,2 这种小矩阵更容易跟着走），点「应用」重新演示。`,
    })
  }

  parseInputs({ heights }) {
    const rowsRaw = (heights ?? '')
      .split(';')
      .map((s) => s.trim())
      .filter((s) => s !== '')
      .slice(0, MAX_ROWS)
    if (rowsRaw.length === 0) throw new Error('至少要有 1 行')

    const grid = rowsRaw.map((row, i) => {
      const cells = row
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s !== '')
      if (cells.length === 0 || cells.length > MAX_COLS) {
        throw new Error(`第 ${i + 1} 行的列数需在 1~${MAX_COLS} 之间`)
      }
      return cells.map((s) => {
        const v = Number(s)
        if (!Number.isFinite(v) || v < 0 || !Number.isInteger(v)) {
          throw new Error(`「${s}」不是合法的非负整数高度`)
        }
        return v
      })
    })

    const cols = grid[0].length
    grid.forEach((row, i) => {
      if (row.length !== cols) {
        throw new Error(`第 ${i + 1} 行有 ${row.length} 列，和第 1 行的 ${cols} 列不一致`)
      }
    })

    return {
      heights: grid,
      rows: grid.length,
      cols,
      display: { heights: grid.map((r) => r.join(',')).join(';') },
    }
  }

  computeSteps({ heights, rows, cols }) {
    const steps = []
    const clone = (m) => m.map((row) => [...row])
    const pacific = Array.from({ length: rows }, () => Array(cols).fill(false))
    const atlantic = Array.from({ length: rows }, () => Array(cols).fill(false))

    const runBfs = (visited, starts, phase, oceanName) => {
      const queue = [...starts]
      starts.forEach(([r, c]) => {
        visited[r][c] = true
      })
      steps.push({
        kind: 'init',
        phase,
        frontier: starts,
        pacific: clone(pacific),
        atlantic: clone(atlantic),
        msg: `从${oceanName}沿岸出发：把 ${starts.length} 个边界格子标记为「能流到${oceanName}」并加入队列，
              开始多源 BFS —— 反向逆流：只要邻居的高度 <strong>≥</strong> 当前格子，水就能从那里「倒流」过来。`,
      })

      while (queue.length) {
        const [r, c] = queue.shift()
        const neighbors = [
          [r - 1, c],
          [r + 1, c],
          [r, c - 1],
          [r, c + 1],
        ]
        const pushed = []
        for (const [nr, nc] of neighbors) {
          if (
            nr >= 0 &&
            nr < rows &&
            nc >= 0 &&
            nc < cols &&
            !visited[nr][nc] &&
            heights[nr][nc] >= heights[r][c]
          ) {
            visited[nr][nc] = true
            queue.push([nr, nc])
            pushed.push([nr, nc])
          }
        }
        steps.push({
          kind: 'visit',
          phase,
          r,
          c,
          pushed,
          pacific: clone(pacific),
          atlantic: clone(atlantic),
          msg:
            `处理 (${r}, ${c})（高度 ${heights[r][c]}）：看它的四个邻居，谁的高度 ≥ ${heights[r][c]}
             且还没标记过，水就能从那个邻居「倒流」到这里 → 也标记为能流到${oceanName}。` +
            (pushed.length
              ? ` 新标记 ${pushed.map(([a, b]) => `(${a}, ${b})`).join('、')}。`
              : ' 四周没有满足条件的新格子。'),
        })
      }
    }

    const pacificStarts = []
    const atlanticStarts = []
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (r === 0 || c === 0) pacificStarts.push([r, c])
        if (r === rows - 1 || c === cols - 1) atlanticStarts.push([r, c])
      }
    }

    runBfs(pacific, pacificStarts, 'pacific', '太平洋')
    runBfs(atlantic, atlanticStarts, 'atlantic', '大西洋')

    const result = []
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (pacific[r][c] && atlantic[r][c]) result.push([r, c])
      }
    }
    steps.push({
      kind: 'done',
      phase: 'done',
      pacific: clone(pacific),
      atlantic: clone(atlantic),
      result,
      msg: `两次 BFS 都结束后，取交集 —— 同时被太平洋和大西洋摸到的格子，
            就是雨水「既能流向太平洋、也能流向大西洋」的答案，一共
            <strong>${result.length}</strong> 个，用金色高亮。`,
    })

    return { steps, result }
  }

  buildStage({ heights, rows, cols }, el) {
    el.innerHTML = `
      <div class="paw__stats"></div>
      <div class="paw__grid"></div>
    `
    this.statsEl = el.querySelector('.paw__stats')
    this.gridEl = el.querySelector('.paw__grid')

    this.gridEl.style.gridTemplateColumns = `repeat(${cols}, minmax(2.6rem, 1fr))`
    this.gridEl.innerHTML = heights
      .map((row, r) =>
        row
          .map((v, c) => {
            const edges = []
            if (r === 0) edges.push('edge-top')
            if (c === 0) edges.push('edge-left')
            if (r === rows - 1) edges.push('edge-bottom')
            if (c === cols - 1) edges.push('edge-right')
            return `<div class="paw__cell ${edges.join(' ')}" data-r="${r}" data-c="${c}">
              <span class="paw__p">P</span>
              <span class="paw__val">${v}</span>
              <span class="paw__a">A</span>
            </div>`
          })
          .join(''),
      )
      .join('')

    this.cellEls = {}
    this.gridEl.querySelectorAll('.paw__cell').forEach((cell) => {
      this.cellEls[`${cell.dataset.r},${cell.dataset.c}`] = cell
    })
  }

  renderStep(st, { state }) {
    const { rows, cols } = state
    Object.values(this.cellEls).forEach((cell) => {
      cell.classList.remove('is-pacific', 'is-atlantic', 'is-both', 'is-current', 'is-frontier')
    })

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cell = this.cellEls[`${r},${c}`]
        if (!cell) continue
        const p = st.pacific[r][c]
        const a = st.atlantic[r][c]
        if (p && a) cell.classList.add('is-both')
        else if (p) cell.classList.add('is-pacific')
        else if (a) cell.classList.add('is-atlantic')
      }
    }

    if (st.kind === 'visit') {
      this.cellEls[`${st.r},${st.c}`]?.classList.add('is-current')
      st.pushed.forEach(([r, c]) => this.cellEls[`${r},${c}`]?.classList.add('is-frontier'))
    }
    if (st.kind === 'init') {
      st.frontier.forEach(([r, c]) => this.cellEls[`${r},${c}`]?.classList.add('is-frontier'))
    }

    const phaseLabel =
      st.phase === 'pacific' ? '① 太平洋 BFS' : st.phase === 'atlantic' ? '② 大西洋 BFS' : '③ 取交集'
    this.statsEl.innerHTML =
      `<span>阶段 <strong>${phaseLabel}</strong></span>` +
      (st.kind === 'visit' ? `<span class="paw__pos">当前格子 (${st.r}, ${st.c})</span>` : '') +
      (st.kind === 'done' ? `<span>答案格子数 <strong>${st.result.length}</strong></span>` : '')
  }

  resultBanner(result) {
    const list = result.map(([r, c]) => `(${r}, ${c})`).join('、')
    return {
      kind: 'success',
      html: `🎉 一共 <strong>${result.length}</strong> 个格子的水既能流到太平洋、也能流到大西洋：${
        list || '（没有）'
      }`,
    }
  }
}

export function mountViz(el, opts) {
  return new PacificAtlanticViz(el, opts)
}

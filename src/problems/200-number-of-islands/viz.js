/*
 * 岛屿数量「网格 DFS 灌水法」动画。
 *
 * 按行扫描网格：扫到一个「未访问的陆地」，说明发现了一座新岛屿（岛屿数 +1），
 * 然后用一个显式的栈做 DFS——不断弹出栈顶格子、标记为已访问、
 * 把它上下左右还没访问过的陆地压进栈，直到栈空，这座岛屿就被「淹没」完了。
 * 继续扫描下一个格子，重复整个过程，扫完整个网格答案就是岛屿总数。
 */
import { VizPlayer } from '../../components/viz-player/vizPlayer.js'

const MAX_ROWS = 8
const MAX_COLS = 10

export class NumIslandsViz extends VizPlayer {
  constructor(mountEl) {
    super(mountEl, {
      inputs: [
        {
          key: 'grid',
          label: `网格 grid（每行一串 0/1，逗号分隔行，最多 ${MAX_ROWS} 行 × ${MAX_COLS} 列）`,
          default: '11000,11000,00100,00011',
          width: '20rem',
        },
      ],
      speed: 650,
      hint: `提示：可改成你自己的网格（如 11110,11010,11000,00000），点「应用」重新演示。`,
    })
  }

  parseInputs({ grid }) {
    const rows = (grid ?? '')
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s !== '')
      .slice(0, MAX_ROWS)
    if (rows.length === 0) throw new Error('至少要有 1 行')
    const cols = rows[0].length
    if (cols === 0 || cols > MAX_COLS) throw new Error(`每行长度需在 1~${MAX_COLS} 之间`)
    rows.forEach((row, i) => {
      if (row.length !== cols) {
        throw new Error(`第 ${i + 1} 行长度 ${row.length} 与第 1 行的 ${cols} 不一致`)
      }
      if (!/^[01]+$/.test(row)) throw new Error(`第 ${i + 1} 行「${row}」只能包含 0 和 1`)
    })
    return {
      grid: rows,
      rows: rows.length,
      cols,
      display: { grid: rows.join(',') },
    }
  }

  computeSteps({ grid, rows, cols }) {
    const steps = []
    const visited = Array.from({ length: rows }, () => Array(cols).fill(false))
    const islandOf = Array.from({ length: rows }, () => Array(cols).fill(0))
    const clone = (m) => m.map((row) => [...row])
    let count = 0

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const isLand = grid[r][c] === '1'
        if (!isLand || visited[r][c]) {
          steps.push({
            kind: 'scan',
            r,
            c,
            count,
            visited: clone(visited),
            islandOf: clone(islandOf),
            stack: [],
            msg: !isLand
              ? `扫描到 (${r}, ${c})：是水「0」，跳过。`
              : `扫描到 (${r}, ${c})：陆地但已经访问过（属于之前的岛屿），跳过。`,
          })
          continue
        }
        // 发现一块未访问的陆地 → 新岛屿
        count++
        const myId = count
        steps.push({
          kind: 'found',
          r,
          c,
          count,
          visited: clone(visited),
          islandOf: clone(islandOf),
          stack: [],
          msg: `扫描到 (${r}, ${c})：是陆地「1」且未访问 → 发现第 <strong>${count}</strong> 座新岛屿，开始用 DFS 向四周灌水。`,
        })

        const stack = [[r, c]]
        visited[r][c] = true
        islandOf[r][c] = myId
        while (stack.length) {
          const [cr, cc] = stack.pop()
          const neighbors = [
            [cr - 1, cc],
            [cr + 1, cc],
            [cr, cc - 1],
            [cr, cc + 1],
          ]
          const pushed = []
          for (const [nr, nc] of neighbors) {
            if (
              nr >= 0 &&
              nr < rows &&
              nc >= 0 &&
              nc < cols &&
              grid[nr][nc] === '1' &&
              !visited[nr][nc]
            ) {
              visited[nr][nc] = true
              islandOf[nr][nc] = myId
              stack.push([nr, nc])
              pushed.push([nr, nc])
            }
          }
          steps.push({
            kind: 'visit',
            r: cr,
            c: cc,
            count,
            pushed,
            stack: [...stack],
            visited: clone(visited),
            islandOf: clone(islandOf),
            msg:
              `访问陆地 (${cr}, ${cc})，标记为已访问，归入第 ${myId} 座岛。` +
              (pushed.length
                ? ` 把相邻陆地 ${pushed.map(([a, b]) => `(${a}, ${b})`).join('、')} 压入栈。`
                : ' 四周没有新的陆地可以扩散了。'),
          })
        }
      }
    }

    steps.push({
      kind: 'done',
      count,
      visited: clone(visited),
      islandOf: clone(islandOf),
      stack: [],
      final: true,
      msg: `扫描结束，整个网格一共发现 <strong>${count}</strong> 座岛屿。`,
    })

    return { steps, result: count }
  }

  buildStage({ grid, cols }, el) {
    el.innerHTML = `
      <div class="noi__stats"></div>
      <div class="noi__layout">
        <div class="noi__grid"></div>
        <div class="noi__side">
          <div class="noi__stacklabel">DFS 栈（待访问的陆地）</div>
          <div class="noi__stack"></div>
        </div>
      </div>
    `
    this.statsEl = el.querySelector('.noi__stats')
    this.gridEl = el.querySelector('.noi__grid')
    this.stackEl = el.querySelector('.noi__stack')

    this.gridEl.style.gridTemplateColumns = `repeat(${cols}, 1fr)`
    this.gridEl.innerHTML = grid
      .map((row, r) =>
        [...row]
          .map(
            (v, c) =>
              `<div class="noi__cell${v === '0' ? ' is-water' : ' is-land'}" data-r="${r}" data-c="${c}"><span class="noi__val">${v}</span></div>`,
          )
          .join(''),
      )
      .join('')
    this.cellEls = {}
    this.gridEl.querySelectorAll('.noi__cell').forEach((cell) => {
      this.cellEls[`${cell.dataset.r},${cell.dataset.c}`] = cell
    })
  }

  renderStep(st, { state }) {
    const { rows, cols } = state
    // 重置每步会变化的状态类
    Object.values(this.cellEls).forEach((cell) => {
      cell.classList.remove(
        'is-current',
        'is-scanning',
        'is-pushed',
        'island-1',
        'island-2',
        'island-3',
        'island-4',
        'island-5',
      )
    })
    // 按当前快照重新染色已访问的格子（不同岛屿不同颜色，循环 5 种色）
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const id = st.islandOf[r][c]
        if (id) this.cellEls[`${r},${c}`]?.classList.add(`island-${((id - 1) % 5) + 1}`)
      }
    }
    if (st.kind === 'scan' || st.kind === 'found') {
      this.cellEls[`${st.r},${st.c}`]?.classList.add('is-scanning')
    }
    if (st.kind === 'visit') {
      this.cellEls[`${st.r},${st.c}`]?.classList.add('is-current')
      st.pushed.forEach(([r, c]) => this.cellEls[`${r},${c}`]?.classList.add('is-pushed'))
    }

    this.statsEl.innerHTML =
      `<span>已发现岛屿数 <strong>${st.count}</strong></span>` +
      (st.kind !== 'done' ? `<span class="noi__pos">当前格子 (${st.r}, ${st.c})</span>` : '')

    const stack = st.stack ?? []
    this.stackEl.innerHTML =
      stack.length === 0
        ? `<span class="noi__empty">（空）</span>`
        : [...stack]
            .reverse()
            .map(
              ([r, c], i) =>
                `<code class="noi__chip${i === 0 ? ' is-top' : ''}">(${r}, ${c})</code>`,
            )
            .join('')
  }

  resultBanner(result) {
    return {
      kind: 'success',
      html: `🎉 扫描结束，这个网格里一共有 <strong>${result}</strong> 座岛屿。`,
    }
  }
}

export function mountViz(el, opts) {
  return new NumIslandsViz(el, opts)
}

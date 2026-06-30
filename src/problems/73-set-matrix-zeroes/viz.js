/*
 * 矩阵置零「用第一行/第一列当标记位」动画（O(1) 额外空间）。
 *
 * 朴素做法是另开一个 m×n 的布尔数组记「哪些行/列要清零」，要 O(mn) 空间。
 * 关键洞察：矩阵自己的第 0 行和第 0 列，正好就是 n 个格子 + m 个格子 ——
 * 拿它们当「标记位」存「第 i 行该不该清零 / 第 j 列该不该清零」就够了，不用额外数组。
 *
 * 但第 0 行/第 0 列自己原本是否有 0，会在标记阶段被覆盖掉，所以要先用两个布尔变量
 * row0Zero / col0Zero 单独记下来，最后再统一处理：
 *   1) 先扫第 0 行、第 0 列，记录 row0Zero / col0Zero；
 *   2) 扫内部格子 (i>=1, j>=1)，遇到 0 就把 matrix[i][0] 和 matrix[0][j] 设为 0（打标记）；
 *   3) 再扫一遍内部格子，标记位 matrix[i][0] 或 matrix[0][j] 是 0 就把 matrix[i][j] 清零；
 *   4) 最后根据 row0Zero / col0Zero，决定要不要把第 0 行 / 第 0 列整个清零。
 */
import { VizPlayer } from '../../components/viz-player/vizPlayer.js'

const MAX_ROWS = 5
const MAX_COLS = 5

export class SetMatrixZeroesViz extends VizPlayer {
  constructor(mountEl) {
    super(mountEl, {
      inputs: [
        {
          key: 'matrix',
          label: '矩阵（分号分隔行，逗号分隔列）',
          default: '0,1,2,0;3,4,5,2;1,3,1,5',
          width: '19rem',
        },
      ],
      speed: 750,
      hint: `提示：0 表示要触发整行整列清零的格子。最多 ${MAX_ROWS} 行 × ${MAX_COLS} 列。`,
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
    const grid = matrix.map((row) => row.slice())
    const steps = []
    const snap = () => grid.map((row) => row.slice())
    const push = (opts) => steps.push({ grid: snap(), ...opts })

    push({
      phase: 'start',
      msg: `这是原始矩阵：${m} 行 ${n} 列。目标是把每个值为 0 的格子所在的整行整列都变成 0，
        但不能新开一个 O(mn) 的数组记「哪些行/列要清零」——我们要把这份记录，
        直接<strong>借用矩阵自己的第 0 行和第 0 列</strong>来存。`,
    })

    // 1) 单独记录第 0 行 / 第 0 列原本是否含 0（标记阶段会覆盖它们，必须先存下来）
    let row0Zero = false
    for (let j = 0; j < n; j++) {
      const isZero = grid[0][j] === 0
      if (isZero) row0Zero = true
      push({
        phase: 'check-row0',
        current: { i: 0, j },
        row0Zero,
        msg: isZero
          ? `检查第 0 行：matrix[0][${j}] = 0 → 第 0 行本身就要整行清零，先记下 <code>row0Zero = true</code>（不能立刻清，留着当标记位用）。`
          : `检查第 0 行：matrix[0][${j}] = ${grid[0][j]}，不是 0。`,
      })
    }

    let col0Zero = false
    for (let i = 0; i < m; i++) {
      const isZero = grid[i][0] === 0
      if (isZero) col0Zero = true
      push({
        phase: 'check-col0',
        current: { i, j: 0 },
        row0Zero,
        col0Zero,
        msg: isZero
          ? `检查第 0 列：matrix[${i}][0] = 0 → 第 0 列本身就要整列清零，先记下 <code>col0Zero = true</code>。`
          : `检查第 0 列：matrix[${i}][0] = ${grid[i][0]}，不是 0。`,
      })
    }

    // 2) 扫内部格子，把第 0 行 / 第 0 列当「标记位」打上记号
    for (let i = 1; i < m; i++) {
      for (let j = 1; j < n; j++) {
        if (grid[i][j] === 0) {
          grid[i][0] = 0
          grid[0][j] = 0
          push({
            phase: 'mark',
            current: { i, j },
            marked: [
              { i, j: 0 },
              { i: 0, j },
            ],
            row0Zero,
            col0Zero,
            msg: `matrix[${i}][${j}] = 0 → 把第 ${i} 行的标记位 <code>matrix[${i}][0]</code> 和
              第 ${j} 列的标记位 <code>matrix[0][${j}]</code> 都设为 0，记下「这一行、这一列以后要清零」。`,
          })
        } else {
          push({
            phase: 'mark',
            current: { i, j },
            row0Zero,
            col0Zero,
            msg: `matrix[${i}][${j}] = ${grid[i][j]}，不是 0，跳过。`,
          })
        }
      }
    }

    // 3) 根据标记位，把内部格子该清零的清零
    for (let i = 1; i < m; i++) {
      for (let j = 1; j < n; j++) {
        const shouldZero = grid[i][0] === 0 || grid[0][j] === 0
        const before = grid[i][j]
        if (shouldZero) grid[i][j] = 0
        push({
          phase: 'apply',
          current: { i, j },
          sources: [
            { i, j: 0 },
            { i: 0, j },
          ],
          row0Zero,
          col0Zero,
          msg: shouldZero
            ? `看标记位：<code>matrix[${i}][0] = ${grid[i][0]}</code> 或
               <code>matrix[0][${j}] = ${grid[0][j]}</code>，其中有一个是 0
               → matrix[${i}][${j}]（原值 ${before}）归零。`
            : `标记位 <code>matrix[${i}][0]</code> 和 <code>matrix[0][${j}]</code> 都不是 0
               → matrix[${i}][${j}] 保持 ${before} 不变。`,
        })
      }
    }

    // 4) 最后统一处理第 0 行 / 第 0 列本身
    if (row0Zero) {
      for (let j = 0; j < n; j++) grid[0][j] = 0
      push({
        phase: 'apply-row0',
        row0Zero,
        col0Zero,
        msg: `回头看最开始记下的 <code>row0Zero = true</code>：第 0 行本身就该整行清零，
          现在统一处理：把第 0 行全部设为 0。`,
      })
    } else {
      push({
        phase: 'apply-row0',
        row0Zero,
        col0Zero,
        msg: `<code>row0Zero = false</code>：第 0 行不需要额外处理。`,
      })
    }

    if (col0Zero) {
      for (let i = 0; i < m; i++) grid[i][0] = 0
      push({
        phase: 'apply-col0',
        row0Zero,
        col0Zero,
        msg: `回头看最开始记下的 <code>col0Zero = true</code>：第 0 列本身就该整列清零，
          现在统一处理：把第 0 列全部设为 0。`,
      })
    } else {
      push({
        phase: 'apply-col0',
        row0Zero,
        col0Zero,
        msg: `<code>col0Zero = false</code>：第 0 列不需要额外处理。`,
      })
    }

    push({
      phase: 'done',
      row0Zero,
      col0Zero,
      msg: `完成！全程只用了 <code>row0Zero</code>、<code>col0Zero</code> 两个布尔变量当额外空间，
        矩阵自己的第 0 行 / 第 0 列就是「标记表」——这就是 O(1) 空间的原地置零。`,
    })

    return { steps, result: grid }
  }

  buildStage({ m, n, matrix }, el) {
    el.innerHTML = `
      <div class="mz__flags">
        <span class="mz__flag" data-flag="row0">row0Zero</span>
        <span class="mz__flag" data-flag="col0">col0Zero</span>
      </div>
      <div class="mz__board" style="--mz-cols:${n}"></div>
    `
    this.flagRowEl = el.querySelector('[data-flag="row0"]')
    this.flagColEl = el.querySelector('[data-flag="col0"]')
    this.boardEl = el.querySelector('.mz__board')
    this.boardEl.innerHTML = matrix
      .map((row, i) =>
        row
          .map((v, j) => {
            const cls = ['mz__cell']
            if (i === 0) cls.push('is-header-row')
            if (j === 0) cls.push('is-header-col')
            return `<span class="${cls.join(' ')}" data-i="${i}" data-j="${j}"><b class="mz__val">${v}</b></span>`
          })
          .join(''),
      )
      .join('')

    this.cellEls = []
    for (let i = 0; i < m; i++) {
      this.cellEls.push([])
      for (let j = 0; j < n; j++) {
        this.cellEls[i].push(this.boardEl.querySelector(`.mz__cell[data-i="${i}"][data-j="${j}"]`))
      }
    }
  }

  renderStep(st, { state }) {
    const grid = st.grid
    for (let i = 0; i < state.m; i++) {
      for (let j = 0; j < state.n; j++) {
        const cell = this.cellEls[i][j]
        const v = grid[i][j]
        cell.querySelector('.mz__val').textContent = v
        const cls = ['mz__cell']
        if (i === 0) cls.push('is-header-row')
        if (j === 0) cls.push('is-header-col')
        if (v === 0) cls.push('is-zero')
        cell.className = cls.join(' ')
      }
    }

    if (st.current) this.cellEls[st.current.i]?.[st.current.j]?.classList.add('is-current')
    ;(st.marked ?? []).forEach(({ i, j }) => this.cellEls[i]?.[j]?.classList.add('is-marked'))
    ;(st.sources ?? []).forEach(({ i, j }) => this.cellEls[i]?.[j]?.classList.add('is-source'))

    if (st.phase === 'apply-row0' && st.row0Zero) {
      for (let j = 0; j < state.n; j++) this.cellEls[0][j]?.classList.add('is-final-clear')
    }
    if (st.phase === 'apply-col0' && st.col0Zero) {
      for (let i = 0; i < state.m; i++) this.cellEls[i][0]?.classList.add('is-final-clear')
    }

    if (this.flagRowEl) this.flagRowEl.classList.toggle('is-on', !!st.row0Zero)
    if (this.flagColEl) this.flagColEl.classList.toggle('is-on', !!st.col0Zero)
  }

  resultBanner(result) {
    const rows = result.map((r) => `[${r.join(', ')}]`).join('<br/>')
    return {
      kind: 'success',
      html: `🎉 原地置零完成！最终矩阵是：<br/><code>${rows}</code>`,
    }
  }
}

export function mountViz(el, opts) {
  return new SetMatrixZeroesViz(el, opts)
}

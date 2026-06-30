/*
 * 旋转图像「转置 + 逐行翻转」动画。
 *
 * 顺时针旋转 90° 等价于两步原地操作：
 *   1) 转置：沿主对角线对称交换 matrix[i][j] 与 matrix[j][i]（i<j）。
 *      转置之后，第 i 行的内容就是旋转前第 i 列从上到下的内容。
 *   2) 把每一行左右翻转，行内元素左右对调，就得到顺时针旋转 90° 的结果。
 * 全程只在原矩阵里换位置，不另开一个矩阵，空间 O(1)。
 */
import { VizPlayer } from '../../components/viz-player/vizPlayer.js'

const MAX_N = 6

export class RotateImageViz extends VizPlayer {
  constructor(mountEl) {
    super(mountEl, {
      inputs: [
        {
          key: 'matrix',
          label: '矩阵 matrix（行用 ; 分隔，列用 , 分隔）',
          default: '1,2,3;4,5,6;7,8,9',
          width: '16rem',
        },
      ],
      speed: 950,
      hint: `提示：矩阵必须是方阵（n×n），最多 ${MAX_N}×${MAX_N}，点「应用」重新演示。`,
    })
  }

  parseInputs({ matrix }) {
    const rows = (matrix ?? '')
      .split(';')
      .map((s) => s.trim())
      .filter((s) => s !== '')
    if (rows.length === 0) throw new Error('矩阵不能为空')
    if (rows.length > MAX_N) throw new Error(`为了清晰展示，最多支持 ${MAX_N}×${MAX_N}`)

    const arr = rows.map((row) =>
      row
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s !== '')
        .map((s) => {
          const v = Number(s)
          if (!Number.isFinite(v)) throw new Error(`「${s}」不是合法数字`)
          return Math.trunc(v)
        }),
    )
    const n = arr.length
    if (arr.some((row) => row.length !== n)) {
      throw new Error(`矩阵必须是方阵：每行都要有 ${n} 个数（n == 行数）`)
    }

    const display = { matrix: arr.map((row) => row.join(',')).join(';') }
    return { matrix: arr, n, display }
  }

  computeSteps({ matrix, n }) {
    const steps = []
    const cur = matrix.map((row) => row.slice())
    const snap = () => cur.map((row) => row.slice())

    steps.push({
      matrix: snap(),
      cells: [],
      phase: 'start',
      phaseLabel: '准备',
      msg: `初始矩阵是 ${n}×${n}。目标：把它<strong>原地</strong>顺时针旋转 90°，不能新开一个矩阵。
        分两步走——先「转置」，再「逐行翻转」。`,
    })

    // 第一步：转置（沿主对角线对称交换）
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        ;[cur[i][j], cur[j][i]] = [cur[j][i], cur[i][j]]
        steps.push({
          matrix: snap(),
          cells: [
            [i, j],
            [j, i],
          ],
          phase: 'transpose',
          phaseLabel: '阶段一 · 转置',
          msg: `转置：交换 <code>matrix[${i}][${j}]</code> 与 <code>matrix[${j}][${i}]</code>
            （沿主对角线对称的两个格子互换位置）。`,
        })
      }
    }

    if (n > 1) {
      steps.push({
        matrix: snap(),
        cells: [],
        phase: 'mid',
        phaseLabel: '阶段一完成',
        msg: `转置完成！现在第 <em>i</em> 行的内容，正好是旋转前第 <em>i</em> 列从上到下的内容。
          接下来只要把<strong>每一行左右翻转</strong>，就是顺时针旋转 90° 的结果。`,
      })
    }

    // 第二步：逐行左右翻转
    for (let i = 0; i < n; i++) {
      let l = 0
      let r = n - 1
      while (l < r) {
        ;[cur[i][l], cur[i][r]] = [cur[i][r], cur[i][l]]
        steps.push({
          matrix: snap(),
          cells: [
            [i, l],
            [i, r],
          ],
          phase: 'reverse',
          phaseLabel: '阶段二 · 逐行翻转',
          msg: `第 ${i} 行翻转：交换 <code>matrix[${i}][${l}]</code> 与 <code>matrix[${i}][${r}]</code>。`,
        })
        l++
        r--
      }
    }

    steps.push({
      matrix: snap(),
      cells: [],
      phase: 'done',
      phaseLabel: '完成',
      msg: `✅ 完成！矩阵已经<strong>原地</strong>顺时针旋转 90°，全程没有额外开辟新矩阵。`,
    })

    return { steps, result: cur }
  }

  buildStage({ n }, el) {
    el.innerHTML = `
      <div class="rt__phase"></div>
      <div class="rt__grid" style="--n:${n}"></div>
    `
    this.phaseEl = el.querySelector('.rt__phase')
    this.gridEl = el.querySelector('.rt__grid')
    this.gridEl.innerHTML = Array.from({ length: n * n })
      .map((_, k) => {
        const r = Math.floor(k / n)
        const c = k % n
        return `<span class="rt__cell" data-r="${r}" data-c="${c}"></span>`
      })
      .join('')
    this.cellEls = []
    for (let r = 0; r < n; r++) {
      this.cellEls.push(
        [...this.gridEl.querySelectorAll(`.rt__cell[data-r="${r}"]`)].sort(
          (a, b) => Number(a.dataset.c) - Number(b.dataset.c),
        ),
      )
    }
  }

  renderStep(step) {
    // 更新数值 + 清空高亮
    for (let r = 0; r < step.matrix.length; r++) {
      for (let c = 0; c < step.matrix[r].length; c++) {
        const cell = this.cellEls[r][c]
        cell.textContent = step.matrix[r][c]
        cell.className = 'rt__cell'
      }
    }
    // 高亮本步交换的两个格子
    if (step.cells && step.cells.length === 2) {
      const [[r1, c1], [r2, c2]] = step.cells
      this.cellEls[r1][c1].classList.add('is-a')
      this.cellEls[r2][c2].classList.add('is-b')
    }
    if (step.phase === 'done') {
      this.cellEls.forEach((row) => row.forEach((cell) => cell.classList.add('is-done')))
    }

    this.phaseEl.textContent = step.phaseLabel ?? ''
    this.phaseEl.className = `rt__phase rt__phase--${step.phase ?? 'start'}`
  }

  resultBanner(result) {
    const text = `[${result.map((row) => `[${row.join(',')}]`).join(',')}]`
    return {
      kind: 'success',
      html: `🎉 旋转后的矩阵：<code>${text}</code>`,
    }
  }
}

export function mountViz(el, opts) {
  return new RotateImageViz(el, opts)
}

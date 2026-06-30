/*
 * 除自身以外数组的乘积「前缀积 × 后缀积」动画。
 *
 * answer[i] = (i 左边所有数的乘积) × (i 右边所有数的乘积)。
 * 不让用除法，那就分两遍预处理：
 *   left[i]  = nums[0..i-1] 的乘积（从左往右边走边乘，left[0] = 1）
 *   right[i] = nums[i+1..n-1] 的乘积（从右往左边走边乘，right[n-1] = 1）
 * 最后逐位相乘 answer[i] = left[i] * right[i]，全程只扫了三遍，O(n)。
 */
import { VizPlayer } from '../../components/viz-player/vizPlayer.js'

const MAX_N = 8
const MIN_V = -12
const MAX_V = 12

export class ProductExceptSelfViz extends VizPlayer {
  constructor(mountEl) {
    super(mountEl, {
      inputs: [
        { key: 'nums', label: '数组 nums（逗号分隔）', default: '1,2,3,4', width: '14rem' },
      ],
      speed: 1000,
      hint: `提示：可改成你自己的数组，点「应用」重新演示（最多 ${MAX_N} 个数，每个数在 ${MIN_V}~${MAX_V} 之间）。`,
    })
  }

  parseInputs({ nums }) {
    const arr = (nums ?? '')
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s !== '')
      .slice(0, MAX_N)
      .map((s) => {
        const v = Number(s)
        if (!Number.isFinite(v)) throw new Error(`「${s}」不是合法数字`)
        const t = Math.trunc(v)
        if (t < MIN_V || t > MAX_V) throw new Error(`「${s}」超出范围（${MIN_V}~${MAX_V}）`)
        return t
      })
    if (arr.length < 2) throw new Error('至少要有 2 个数')
    return { nums: arr, display: { nums: arr.join(',') } }
  }

  computeSteps({ nums }) {
    const n = nums.length
    const left = new Array(n).fill(null)
    const right = new Array(n).fill(null)
    const answer = new Array(n).fill(null)
    const steps = []
    const snap = (phase, i, msg) =>
      steps.push({ phase, i, left: [...left], right: [...right], answer: [...answer], msg })

    left[0] = 1
    snap('left', 0, `初始化 <code>left[0] = 1</code>：下标 0 左边没有元素，乘积约定为 1。`)
    for (let i = 1; i < n; i++) {
      left[i] = left[i - 1] * nums[i - 1]
      snap(
        'left',
        i,
        `<code>left[${i}] = left[${i - 1}] × nums[${i - 1}] = ${left[i - 1]} × ${
          nums[i - 1]
        } = ${left[i]}</code>（下标 ${i} 左边所有数的乘积）。`,
      )
    }

    right[n - 1] = 1
    snap(
      'right',
      n - 1,
      `初始化 <code>right[${n - 1}] = 1</code>：下标 ${n - 1} 右边没有元素，乘积约定为 1。`,
    )
    for (let i = n - 2; i >= 0; i--) {
      right[i] = right[i + 1] * nums[i + 1]
      snap(
        'right',
        i,
        `<code>right[${i}] = right[${i + 1}] × nums[${i + 1}] = ${right[i + 1]} × ${
          nums[i + 1]
        } = ${right[i]}</code>（下标 ${i} 右边所有数的乘积）。`,
      )
    }

    for (let i = 0; i < n; i++) {
      answer[i] = left[i] * right[i]
      snap(
        'answer',
        i,
        `<code>answer[${i}] = left[${i}] × right[${i}] = ${left[i]} × ${right[i]} = ${answer[i]}</code>。`,
      )
    }

    return { steps, result: answer }
  }

  buildStage({ nums }, el) {
    const cell = (i, v) =>
      `<span class="poas__cell" data-i="${i}"><b class="poas__val">${
        v == null ? '' : v
      }</b><span class="poas__idx">${i}</span></span>`
    el.innerHTML = `
      <div class="poas__phase"></div>
      <div class="poas__row">
        <span class="poas__label">nums</span>
        <div class="poas__cells poas__cells--nums">${nums.map((v, i) => cell(i, v)).join('')}</div>
      </div>
      <div class="poas__row">
        <span class="poas__label">left（前缀积）</span>
        <div class="poas__cells poas__cells--left">${nums.map((_, i) => cell(i, null)).join('')}</div>
      </div>
      <div class="poas__row">
        <span class="poas__label">right（后缀积）</span>
        <div class="poas__cells poas__cells--right">${nums.map((_, i) => cell(i, null)).join('')}</div>
      </div>
      <div class="poas__row">
        <span class="poas__label">answer</span>
        <div class="poas__cells poas__cells--answer">${nums.map((_, i) => cell(i, null)).join('')}</div>
      </div>
    `
    this.phaseEl = el.querySelector('.poas__phase')
    this.numsCells = [...el.querySelectorAll('.poas__cells--nums .poas__cell')]
    this.leftCells = [...el.querySelectorAll('.poas__cells--left .poas__cell')]
    this.rightCells = [...el.querySelectorAll('.poas__cells--right .poas__cell')]
    this.answerCells = [...el.querySelectorAll('.poas__cells--answer .poas__cell')]
  }

  #fill(cells, arr) {
    arr.forEach((v, i) => {
      const c = cells[i]
      c.className = 'poas__cell'
      c.querySelector('.poas__val').textContent = v == null ? '' : v
      if (v != null) c.classList.add('is-filled')
    })
  }

  renderStep(st, { state }) {
    const n = state.nums.length
    this.numsCells.forEach((c) => (c.className = 'poas__cell'))
    this.#fill(this.leftCells, st.left)
    this.#fill(this.rightCells, st.right)
    this.#fill(this.answerCells, st.answer)

    const phaseName = { left: '第一遍：从左往右算前缀积', right: '第二遍：从右往左算后缀积', answer: '第三遍：逐位相乘得到结果' }
    this.phaseEl.textContent = phaseName[st.phase]

    if (st.phase === 'left') {
      this.leftCells[st.i].classList.add('is-current')
      this.numsCells[st.i].classList.add('is-idx')
      if (st.i > 0) this.numsCells[st.i - 1].classList.add('is-src')
    } else if (st.phase === 'right') {
      this.rightCells[st.i].classList.add('is-current')
      this.numsCells[st.i].classList.add('is-idx')
      if (st.i < n - 1) this.numsCells[st.i + 1].classList.add('is-src')
    } else if (st.phase === 'answer') {
      this.answerCells[st.i].classList.add('is-current')
      this.leftCells[st.i].classList.add('is-src')
      this.rightCells[st.i].classList.add('is-src')
      this.numsCells[st.i].classList.add('is-idx')
    }
  }

  resultBanner(result) {
    return {
      kind: 'success',
      html: `🎉 全部算完！<code>answer = [${result.join(', ')}]</code>。`,
    }
  }
}

export function mountViz(el, opts) {
  return new ProductExceptSelfViz(el, opts)
}

/*
 * 乘积最大子数组「一维 DP（同时维护最大/最小乘积）」动画。
 *
 * 和「最大子数组和」不一样的地方在于：乘法里有负数会「翻脸」——
 * 一个很小（很负）的乘积，只要再乘一个负数，瞬间可能变成最大值。
 * 所以光维护「以当前元素结尾的最大乘积」不够，必须同时维护
 * 「以当前元素结尾的最小乘积」curMin，因为它才是下一步「翻身」的种子。
 *
 * 走到 nums[i] 时，有三个候选都可能成为新的 curMax / curMin：
 *   ① 自己重新开始：x
 *   ② 接上前一步的最大乘积：curMax(i-1) × x
 *   ③ 接上前一步的最小乘积：curMin(i-1) × x
 * newCurMax = max(①②③)，newCurMin = min(①②③)。
 * 每一步都用 newCurMax 去刷新全局答案 best。整个过程只扫一遍，O(n) 时间、O(1) 额外空间。
 */
import { VizPlayer } from '../../components/viz-player/vizPlayer.js'

const MAX_N = 12

export class MaxProductViz extends VizPlayer {
  constructor(mountEl) {
    super(mountEl, {
      inputs: [
        { key: 'nums', label: '数组 nums（逗号分隔，可负数/0）', default: '2,3,-2,4', width: '14rem' },
      ],
      speed: 1300,
      hint: `提示：可改成你自己的数组，点「应用」重新演示（最多 ${MAX_N} 个数，元素可为负数或 0）。`,
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
        return Math.trunc(v)
      })
    if (arr.length < 1) throw new Error('数组至少要有 1 个数')
    return { nums: arr, display: { nums: arr.join(',') } }
  }

  computeSteps({ nums }) {
    const n = nums.length
    const steps = []

    let curMax = nums[0]
    let curMin = nums[0]
    let best = nums[0]
    let bestIdx = 0

    steps.push({
      i: 0,
      x: nums[0],
      curMax,
      curMin,
      best,
      bestIdx,
      maxSrc: 'self',
      minSrc: 'self',
      improved: true,
      msg: `起点 i = 0：只有 nums[0] 这一个数，maxEnd[0] = minEnd[0] = best = nums[0] = <strong>${nums[0]}</strong>。`,
    })

    for (let i = 1; i < n; i++) {
      const x = nums[i]
      const fromMax = curMax * x
      const fromMin = curMin * x

      const newMax = Math.max(x, fromMax, fromMin)
      const maxSrc = newMax === x ? 'self' : newMax === fromMax ? 'max' : 'min'
      const newMin = Math.min(x, fromMax, fromMin)
      const minSrc = newMin === x ? 'self' : newMin === fromMax ? 'max' : 'min'

      const improved = newMax > best
      const newBest = improved ? newMax : best
      const newBestIdx = improved ? i : bestIdx

      const srcDesc = (src) =>
        src === 'self' ? `自己重新开始` : src === 'max' ? `接上 maxEnd[${i - 1}]` : `接上 minEnd[${i - 1}]`

      const msg =
        `i = ${i}：nums[${i}] = ${x}。三个候选 — 自己 <code>${x}</code>、` +
        `maxEnd[${i - 1}]×x = ${curMax}×${x} = <code>${fromMax}</code>、` +
        `minEnd[${i - 1}]×x = ${curMin}×${x} = <code>${fromMin}</code>。` +
        ` maxEnd[${i}] = max(...) = <strong>${newMax}</strong>（${srcDesc(maxSrc)}），` +
        `minEnd[${i}] = min(...) = <strong>${newMin}</strong>（${srcDesc(minSrc)}）。` +
        (improved
          ? ` maxEnd[${i}](${newMax}) &gt; best(${best}) → best 更新为 <strong>${newBest}</strong>。`
          : ` maxEnd[${i}](${newMax}) ≤ best(${best})，best 不变，仍是 ${best}。`)

      steps.push({
        i,
        x,
        curMax: newMax,
        curMin: newMin,
        best: newBest,
        bestIdx: newBestIdx,
        maxSrc,
        minSrc,
        improved,
        msg,
      })

      curMax = newMax
      curMin = newMin
      best = newBest
      bestIdx = newBestIdx
    }

    return { steps, result: { best, bestIdx } }
  }

  buildStage({ nums }, el) {
    el.innerHTML = `
      <div class="mp__nums"></div>
      <div class="mp__dp">
        <div class="mp__dprow">
          <span class="mp__rowlabel">maxEnd[i]</span>
          <div class="mp__cells mp__cells--max"></div>
        </div>
        <div class="mp__dprow">
          <span class="mp__rowlabel">minEnd[i]</span>
          <div class="mp__cells mp__cells--min"></div>
        </div>
      </div>
      <div class="mp__best">历史最大 best = <strong class="mp__bestval">${nums[0]}</strong></div>
    `
    this.numsEl = el.querySelector('.mp__nums')
    this.maxCellsEl = el.querySelector('.mp__cells--max')
    this.minCellsEl = el.querySelector('.mp__cells--min')
    this.bestValEl = el.querySelector('.mp__bestval')

    this.numsEl.innerHTML = nums
      .map(
        (v, i) =>
          `<span class="mp__cell" data-i="${i}"><b class="mp__val">${v}</b><span class="mp__idx">${i}</span></span>`,
      )
      .join('')
    this.numCellEls = [...this.numsEl.querySelectorAll('.mp__cell')]

    const dpCell = () => `<span class="mp__dpcell">—</span>`
    this.maxCellsEl.innerHTML = nums.map(dpCell).join('')
    this.minCellsEl.innerHTML = nums.map(dpCell).join('')
    this.maxDpEls = [...this.maxCellsEl.querySelectorAll('.mp__dpcell')]
    this.minDpEls = [...this.minCellsEl.querySelectorAll('.mp__dpcell')]
  }

  renderStep(st) {
    const i = st.i

    // 数组行：已处理过的弱化显示，当前下标高亮
    this.numCellEls.forEach((c, k) => {
      c.className = 'mp__cell'
      if (k < i) c.classList.add('is-done')
      if (k === i) c.classList.add('is-current')
      if (k === st.bestIdx) c.classList.add('is-best')
    })

    // dp 两行：把数值重放填到当前步为止（保证前进/后退切换时数值始终正确），未到的还是占位符
    this.maxDpEls.forEach((c) => (c.className = 'mp__dpcell'))
    this.minDpEls.forEach((c) => (c.className = 'mp__dpcell'))
    this._fillUpTo(i)

    this.maxDpEls.forEach((c, k) => c.classList.toggle('is-filled', k <= i))
    this.minDpEls.forEach((c, k) => c.classList.toggle('is-filled', k <= i))
    this.maxDpEls[i]?.classList.add('is-current')
    this.minDpEls[i]?.classList.add('is-current')
    if (i === st.bestIdx) this.maxDpEls[i]?.classList.add('is-best')

    // 来源高亮：上一格被「接上」的那一行
    if (i > 0) {
      if (st.maxSrc === 'max') this.maxDpEls[i - 1]?.classList.add('is-src')
      else if (st.maxSrc === 'min') this.minDpEls[i - 1]?.classList.add('is-src')
      if (st.minSrc === 'max') this.maxDpEls[i - 1]?.classList.add('is-src')
      else if (st.minSrc === 'min') this.minDpEls[i - 1]?.classList.add('is-src')
      if (st.maxSrc === 'self' && st.minSrc === 'self') {
        this.numCellEls[i]?.classList.add('is-restart')
      }
    }

    this.bestValEl.textContent = st.best
  }

  // 用 this.steps（VizPlayer 已算好）把 dp 两行重放填到第 idx 步，保证前进/后退都正确
  _fillUpTo(idx) {
    for (let k = 0; k <= idx; k++) {
      const s = this.steps[k]
      if (!s) continue
      this.maxDpEls[k].textContent = s.curMax
      this.minDpEls[k].textContent = s.curMin
    }
    for (let k = idx + 1; k < this.maxDpEls.length; k++) {
      this.maxDpEls[k].textContent = '—'
      this.minDpEls[k].textContent = '—'
    }
  }

  resultBanner(result) {
    const { best, bestIdx } = result
    return {
      kind: 'success',
      html: `🎉 扫描完成！乘积最大子数组的乘积为 <strong>${best}</strong>（在 i = ${bestIdx} 处由 maxEnd[${bestIdx}] = ${best} 取得）。`,
    }
  }
}

export function mountViz(el, opts) {
  return new MaxProductViz(el, opts)
}

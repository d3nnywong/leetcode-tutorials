/*
 * 最大子数组和「Kadane 算法（一维 DP / 贪心）」动画。
 *
 * 维护两个量边走边更新：
 *   cur  —— 「以当前元素结尾」的最大子数组和（dp[i] = max(nums[i], dp[i-1] + nums[i])）
 *   best —— 扫描到目前为止见过的全局最大值
 * 每到一个新元素 nums[i]：
 *   若 cur < 0，说明前面那段是「负资产」，拖累后面，不如丢掉它、从 nums[i] 重新开始；
 *   否则就把 nums[i] 接到 cur 后面继续累加。
 *   每步都用新的 cur 去更新 best。
 * 整个过程只扫一遍数组，O(n) 时间、O(1) 额外空间。
 */
import { VizPlayer } from '../../components/viz-player/vizPlayer.js'

const MAX_N = 12

export class MaxSubarrayViz extends VizPlayer {
  constructor(mountEl) {
    super(mountEl, {
      inputs: [{ key: 'nums', label: '数组 nums（逗号分隔，可负数）', default: '-2,1,-3,4,-1,2,1,-5,4', width: '18rem' }],
      speed: 1100,
      hint: `提示：可改成你自己的数组，点「应用」重新演示（最多 ${MAX_N} 个数，元素可为负数）。`,
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

    let cur = nums[0]
    let curL = 0
    let best = nums[0]
    let bestL = 0
    let bestR = 0

    steps.push({
      i: 0,
      cur,
      curL,
      curR: 0,
      best,
      bestL,
      bestR,
      restart: false,
      msg: `起点 i = 0：只有 nums[0] 这一个元素可选，把 cur 和 best 都初始化为 nums[0] = <strong>${nums[0]}</strong>。`,
    })

    for (let i = 1; i < n; i++) {
      const restart = cur < 0
      const newCur = restart ? nums[i] : cur + nums[i]
      const newCurL = restart ? i : curL
      const improved = newCur > best
      const newBest = improved ? newCur : best
      const newBestL = improved ? newCurL : bestL
      const newBestR = improved ? i : bestR

      const moveMsg = restart
        ? `i = ${i}：cur = ${cur} &lt; 0，前面那段是「负资产」，<strong>丢掉它、从 nums[${i}] = ${nums[i]} 重新开始</strong> → cur = ${newCur}。`
        : `i = ${i}：cur = ${cur} ≥ 0，<strong>把 nums[${i}] = ${nums[i]} 接到后面</strong> → cur = ${cur} + ${nums[i]} = ${newCur}。`
      const cmpMsg = improved
        ? ` cur(${newCur}) &gt; best(${best}) → best 更新为 <strong>${newBest}</strong>（区间 [${newBestL}, ${newBestR}]）。`
        : ` cur(${newCur}) ≤ best(${best})，best 不变，仍是 ${best}。`

      steps.push({
        i,
        cur: newCur,
        curL: newCurL,
        curR: i,
        best: newBest,
        bestL: newBestL,
        bestR: newBestR,
        restart,
        msg: moveMsg + cmpMsg,
      })

      cur = newCur
      curL = newCurL
      best = newBest
      bestL = newBestL
      bestR = newBestR
    }

    return { steps, result: { best, bestL, bestR } }
  }

  buildStage({ nums }, el) {
    el.innerHTML = `
      <div class="msa__info">
        <span class="msa__stat">当前段和 cur = <strong class="msa__cur">${nums[0]}</strong></span>
        <span class="msa__stat">历史最大 best = <strong class="msa__best">${nums[0]}</strong></span>
      </div>
      <div class="msa__nums"></div>
    `
    this.numsEl = el.querySelector('.msa__nums')
    this.curStatEl = el.querySelector('.msa__cur')
    this.bestStatEl = el.querySelector('.msa__best')
    this.numsEl.innerHTML = nums
      .map(
        (v, i) =>
          `<span class="msa__cell" data-i="${i}"><b class="msa__val">${v}</b><span class="msa__idx">${i}</span></span>`,
      )
      .join('')
    this.cellEls = [...this.numsEl.querySelectorAll('.msa__cell')]
  }

  renderStep(st) {
    this.curStatEl.textContent = st.cur
    this.bestStatEl.textContent = st.best

    this.cellEls.forEach((c) => (c.className = 'msa__cell'))
    for (let k = st.curL; k <= st.curR; k++) this.cellEls[k]?.classList.add('is-cur')
    for (let k = st.bestL; k <= st.bestR; k++) this.cellEls[k]?.classList.add('is-best')
    this.cellEls[st.i]?.classList.add('is-now')
    if (st.restart) this.cellEls[st.i]?.classList.add('is-restart')
  }

  resultBanner(result, state) {
    const { best, bestL, bestR } = result
    const sub = state.nums.slice(bestL, bestR + 1).join(', ')
    return {
      kind: 'success',
      html: `🎉 扫描完成！最大子数组和为 <strong>${best}</strong>，对应子数组 nums[${bestL}..${bestR}] = <code>[${sub}]</code>。`,
    }
  }
}

export function mountViz(el, opts) {
  return new MaxSubarrayViz(el, opts)
}

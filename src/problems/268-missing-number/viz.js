/*
 * 丢失的数字「高斯求和」动画。
 *
 * 如果数组里没有丢失任何数，nums 就应该正好是 0..n 这 n+1 个数（去掉某一个就剩 n 个）。
 * 0..n 的总和可以用高斯公式直接算出来：expectedSum = n×(n+1)/2。
 * 再把数组里实际出现的数加起来，得到 actualSum。
 * 因为只丢了一个数，两者之差就正好是那个丢失的数：missing = expectedSum − actualSum。
 * 整个过程只扫一遍数组、只用几个变量，时间 O(n)，空间 O(1)。
 */
import { VizPlayer } from '../../components/viz-player/vizPlayer.js'

const MAX_N = 12

export class MissingNumberViz extends VizPlayer {
  constructor(mountEl) {
    super(mountEl, {
      inputs: [
        {
          key: 'nums',
          label: '数组 nums（逗号分隔，0~n 中独一无二的 n 个数）',
          default: '9,6,4,2,3,5,7,0,1',
          width: '18rem',
        },
      ],
      speed: 900,
      hint: `提示：可改成你自己的数组（长度即 n，数字需在 0~n 内各不相同），点「应用」重新演示（最多 ${MAX_N} 个数）。`,
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
    if (arr.length < 1) throw new Error('至少要有 1 个数')
    const n = arr.length
    const seen = new Set()
    for (const v of arr) {
      if (v < 0 || v > n) throw new Error(`数字 ${v} 超出范围 [0, ${n}]（n = 数组长度）`)
      if (seen.has(v)) throw new Error(`数字 ${v} 重复了，题目保证所有数字各不相同`)
      seen.add(v)
    }
    return { nums: arr, display: { nums: arr.join(',') } }
  }

  computeSteps({ nums }) {
    const n = nums.length
    const expectedSum = (n * (n + 1)) / 2
    const steps = []
    let actualSum = 0
    for (let i = 0; i < n; i++) {
      const prev = actualSum
      actualSum += nums[i]
      steps.push({
        i,
        actualSum,
        expectedSum,
        final: false,
        msg: `把 nums[${i}] = ${nums[i]} 加进实际之和：actualSum = ${prev} + ${nums[i]} = <strong>${actualSum}</strong>。`,
      })
    }
    const missing = expectedSum - actualSum
    steps.push({
      i: null,
      actualSum,
      expectedSum,
      missing,
      final: true,
      msg: `扫描结束。应有之和 expectedSum = ${n}×(${n}+1)/2 = <strong>${expectedSum}</strong>，
        实际之和 actualSum = <strong>${actualSum}</strong>。
        missing = expectedSum − actualSum = ${expectedSum} − ${actualSum} = <strong>${missing}</strong>。`,
    })
    return { steps, result: missing }
  }

  buildStage({ nums }, el) {
    const n = nums.length
    const expectedSum = (n * (n + 1)) / 2
    el.innerHTML = `
      <div class="mn__expected">范围 <code>[0, ${n}]</code> 一共 ${n + 1} 个数，应有之和
        expectedSum = ${n}×(${n}+1)/2 = <strong>${expectedSum}</strong></div>
      <div class="mn__nums"></div>
      <div class="mn__sumrow">
        <div class="mn__sumbox mn__sumbox--actual">
          <span class="mn__sumbox-label">实际之和 actualSum</span>
          <strong class="mn__sumbox-val">0</strong>
        </div>
        <div class="mn__sumop">−</div>
        <div class="mn__sumbox mn__sumbox--expected">
          <span class="mn__sumbox-label">应有之和 expectedSum</span>
          <strong class="mn__sumbox-val">${expectedSum}</strong>
        </div>
        <div class="mn__sumop">=</div>
        <div class="mn__sumbox mn__sumbox--missing">
          <span class="mn__sumbox-label">丢失的数字</span>
          <strong class="mn__sumbox-val">?</strong>
        </div>
      </div>
    `
    this.numsEl = el.querySelector('.mn__nums')
    this.numsEl.innerHTML = nums
      .map(
        (v, i) =>
          `<span class="mn__cell" data-i="${i}"><b class="mn__val">${v}</b><span class="mn__idx">${i}</span></span>`,
      )
      .join('')
    this.cellEls = [...this.numsEl.querySelectorAll('.mn__cell')]
    this.actualEl = el.querySelector('.mn__sumbox--actual .mn__sumbox-val')
    this.missingBox = el.querySelector('.mn__sumbox--missing')
    this.missingEl = el.querySelector('.mn__sumbox--missing .mn__sumbox-val')
  }

  renderStep(st) {
    this.cellEls.forEach((c, idx) => {
      c.className = 'mn__cell'
      if (st.final || (typeof st.i === 'number' && idx <= st.i)) c.classList.add('is-stored')
      if (!st.final && idx === st.i) c.classList.add('is-current')
    })
    this.actualEl.textContent = String(st.actualSum)
    this.missingBox.classList.toggle('is-final', !!st.final)
    this.missingEl.textContent = st.final ? String(st.missing) : '?'
  }

  resultBanner(missing, state) {
    return {
      kind: 'success',
      html: `🎉 范围 <code>[0, ${state.nums.length}]</code> 里没出现在数组中的数字是 <strong>${missing}</strong>。`,
    }
  }
}

export function mountViz(el, opts) {
  return new MissingNumberViz(el, opts)
}

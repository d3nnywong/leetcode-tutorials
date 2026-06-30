/*
 * 寻找旋转排序数组中的最小值「二分查找」动画。
 *
 * 数组是「先升序、再整体旋转一刀」的结果。整个数组看起来不是完全有序的，
 * 但旋转点（也就是最小值所在的位置）把它分成了两段：左边一段、右边一段，
 * 每段内部仍然严格升序，并且左边那段的所有值都 >= 右边那段的所有值。
 *
 * 每一步只需要拿 nums[mid] 和 nums[hi] 比一比：
 *   1. nums[mid] > nums[hi]  → mid 还在「左边那段」里，最小值一定在 mid 右边（不含 mid）→ lo = mid + 1
 *   2. nums[mid] <= nums[hi] → mid 已经进入「右边那段」（或就是没旋转的整段升序），
 *      最小值在 mid 或 mid 左边 → hi = mid（保留 mid，因为它有可能就是答案）
 * 区间每次至少减半，最后 lo 与 hi 重合的位置就是最小值，整体 O(log n)。
 */
import { VizPlayer } from '../../components/viz-player/vizPlayer.js'

const MAX_N = 12

export class MinRotatedViz extends VizPlayer {
  constructor(mountEl) {
    super(mountEl, {
      inputs: [
        {
          key: 'nums',
          label: '旋转有序数组 nums（逗号分隔）',
          default: '4,5,6,7,0,1,2',
          width: '17rem',
        },
      ],
      speed: 1300,
      hint: `提示：数组必须是「先升序、再整体旋转」的结果（最多一个下降点），最多 ${MAX_N} 个数。`,
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
    if (new Set(arr).size !== arr.length) {
      throw new Error('数组中的数必须互不相同（旋转有序数组的前提）')
    }
    let drops = 0
    for (let i = 0; i < arr.length; i++) {
      const j = (i + 1) % arr.length
      if (arr[i] > arr[j]) drops++
    }
    if (drops > 1) {
      throw new Error('数组必须是「先升序排列、再整体旋转」的结果（最多一个下降点）')
    }
    return { nums: arr, display: { nums: arr.join(',') } }
  }

  computeSteps({ nums }) {
    const steps = []
    let lo = 0
    let hi = nums.length - 1
    if (lo === hi) {
      steps.push({
        lo,
        hi,
        mid: null,
        finalIdx: lo,
        msg: `数组只有 1 个元素，lo = hi = 0，最小值就是 <code>nums[0] = ${nums[0]}</code>，
          无需比较。`,
      })
    } else {
      while (lo < hi) {
        const mid = lo + Math.floor((hi - lo) / 2)
        const goRight = nums[mid] > nums[hi]
        steps.push({
          lo,
          hi,
          mid,
          goRight,
          finalIdx: null,
          msg:
            `lo=${lo}、hi=${hi} → mid=${mid}。比较 <code>nums[mid] = ${nums[mid]}</code> 与
            <code>nums[hi] = ${nums[hi]}</code>：` +
            (goRight
              ? `nums[mid] &gt; nums[hi]，说明 mid 还在「靠前、较大」的那一段里，最小值一定在
                 mid <strong>右边</strong>（不含 mid）→ lo = mid + 1 = ${mid + 1}。`
              : `nums[mid] &lt;= nums[hi]，说明 mid 已经进入「靠后、较小」的那一段，最小值在
                 mid 或 mid <strong>左边</strong>（mid 自己仍是候选）→ hi = mid = ${mid}。`),
        })
        if (goRight) lo = mid + 1
        else hi = mid
      }
      steps.push({
        lo,
        hi,
        mid: null,
        finalIdx: lo,
        msg: `lo 和 hi 重合在下标 ${lo}，区间收缩成一个点 → 最小值就是
          <code>nums[${lo}] = ${nums[lo]}</code>。`,
      })
    }
    return { steps, result: { idx: lo, value: nums[lo] } }
  }

  buildStage({ nums }, el) {
    const n = nums.length
    el.innerHTML = `
      <div class="frm__row" style="grid-template-columns:repeat(${n},minmax(2.4rem,1fr))"></div>
      <div class="frm__ptrrow" style="grid-template-columns:repeat(${n},minmax(2.4rem,1fr))"></div>
    `
    this.rowEl = el.querySelector('.frm__row')
    this.ptrRowEl = el.querySelector('.frm__ptrrow')
    this.rowEl.innerHTML = nums
      .map(
        (v, i) =>
          `<span class="frm__cell" data-i="${i}"><b class="frm__val">${v}</b><span class="frm__idx">${i}</span></span>`,
      )
      .join('')
    this.cellEls = [...this.rowEl.querySelectorAll('.frm__cell')]
  }

  renderStep(st, { state }) {
    this.cellEls.forEach((c, i) => {
      c.className = 'frm__cell'
      if (st.lo != null && st.hi != null && (i < st.lo || i > st.hi)) c.classList.add('is-out')
    })
    if (st.lo != null) this.cellEls[st.lo]?.classList.add('is-bound')
    if (st.hi != null) this.cellEls[st.hi]?.classList.add('is-bound')
    if (st.mid != null) {
      this.cellEls[st.mid]?.classList.add('is-mid')
      this.cellEls[st.mid]?.classList.add(st.goRight ? 'is-discard' : 'is-keep')
    }
    if (st.finalIdx != null) this.cellEls[st.finalIdx]?.classList.add('is-final')

    const labels = {}
    if (st.lo != null) (labels[st.lo] ??= []).push('lo')
    if (st.mid != null) (labels[st.mid] ??= []).push('mid')
    if (st.hi != null) (labels[st.hi] ??= []).push('hi')
    this.ptrRowEl.innerHTML = state.nums
      .map(
        (_, i) =>
          `<span class="frm__ptrtag${labels[i] ? ' is-active' : ''}">${
            labels[i] ? labels[i].join('·') : ''
          }</span>`,
      )
      .join('')
  }

  resultBanner(result) {
    return {
      kind: 'success',
      html: `🎉 旋转排序数组中的最小值是 <code>nums[${result.idx}] = ${result.value}</code>。`,
    }
  }
}

export function mountViz(el, opts) {
  return new MinRotatedViz(el, opts)
}

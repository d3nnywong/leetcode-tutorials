/*
 * 最长递增子序列「贪心 + 二分查找（patience sorting）」动画。
 *
 * 核心想法：维护一个数组 tails，tails[k] 表示「长度为 k+1 的递增子序列」里，
 * 能取到的最小结尾数字。tails 本身始终是严格递增的（这是它能用二分查找的前提）。
 *
 * 从左到右扫一遍 nums，对每个数 x：
 *   - 在 tails 里二分查找第一个 ≥ x 的位置 pos（lower_bound）；
 *   - 如果 pos == tails.length（x 比所有结尾都大）：把 x 接在末尾，tails 变长 → 答案 +1；
 *   - 否则：用更小的 x 去替换 tails[pos]，保留更多「以后能接上更多数」的可能性，长度不变。
 *
 * 全程 tails.length 就是当前看到的最长递增子序列长度；扫完整个数组即为答案。
 * 这正是「O(n log n)」的关键：把「找位置」从 O(n) 的线性扫描换成了 O(log n) 的二分查找。
 */
import { VizPlayer } from '../../components/viz-player/vizPlayer.js'

const MAX_N = 12

export class LisViz extends VizPlayer {
  constructor(mountEl) {
    super(mountEl, {
      inputs: [{ key: 'nums', label: '数组 nums（逗号分隔）', default: '10,9,2,5,3,7,101,18', width: '16rem' }],
      speed: 1100,
      hint: `提示：可改成你自己的数组，点「应用」重新演示（最多 ${MAX_N} 个数）。`,
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
    return { nums: arr, display: { nums: arr.join(',') } }
  }

  computeSteps({ nums }) {
    const steps = []
    const tails = [] // tails[k] = 长度 k+1 的递增子序列的最小结尾
    const tailsIdx = [] // tailsIdx[k] = 上面那个结尾数字在 nums 里的下标
    const prev = new Array(nums.length).fill(-1) // prev[i] = 接在 nums[i] 前面的那个下标

    for (let i = 0; i < nums.length; i++) {
      const x = nums[i]
      const before = [...tails]

      // —— 二分查找第一个 >= x 的位置（lower_bound）——
      let lo = 0
      let hi = tails.length
      while (lo < hi) {
        const mid = (lo + hi) >> 1
        const cmpLt = tails[mid] < x
        steps.push({
          kind: 'bsearch',
          i,
          x,
          lo,
          hi,
          mid,
          cmpLt,
          tails: before,
          msg: cmpLt
            ? `二分查找放置位置：区间 [${lo}, ${hi})，看中间 tails[${mid}] = ${tails[mid]} &lt; ${x} → 说明 ${x} 能接得比它更靠后，把左边界收紧到 lo = ${mid + 1}。`
            : `二分查找放置位置：区间 [${lo}, ${hi})，看中间 tails[${mid}] = ${tails[mid]} ≥ ${x} → ${x} 放不到它右边，把右边界收紧到 hi = ${mid}。`,
        })
        if (cmpLt) lo = mid + 1
        else hi = mid
      }
      const pos = lo
      const isAppend = pos === tails.length

      prev[i] = pos > 0 ? tailsIdx[pos - 1] : -1
      tails[pos] = x
      tailsIdx[pos] = i

      steps.push({
        kind: 'apply',
        i,
        x,
        pos,
        isAppend,
        tailsBefore: before,
        tails: [...tails],
        msg:
          before.length === 0
            ? `tails 还是空的，把 ${x} 直接放进去当第一个结尾：tails = [${x}]，当前最长长度变成 <strong>1</strong>。`
            : isAppend
              ? `没有找到 ≥ ${x} 的位置（${x} 比 tails 里所有数都大）→ 直接接在末尾，tails 变长到 ${tails.length} → 当前最长长度变成 <strong>${tails.length}</strong>！`
              : `位置 ${pos} 处原本是 tails[${pos}] = ${before[pos]}，用更小的 ${x} 把它替换掉（长度不变，仍是 <strong>${tails.length}</strong>），这样以后更容易接上新的数。`,
      })
    }

    // 回溯还原出一条具体的最长递增子序列（按 prev 链从最后一个结尾往前走）
    let pathIdx = []
    if (tailsIdx.length > 0) {
      let k = tailsIdx[tailsIdx.length - 1]
      while (k !== -1) {
        pathIdx.push(k)
        k = prev[k]
      }
      pathIdx.reverse()
    }
    if (steps.length) steps[steps.length - 1].pathIdx = pathIdx

    const result = { length: tails.length, pathIdx, pathVals: pathIdx.map((idx) => nums[idx]) }
    return { steps, result }
  }

  buildStage({ nums }, el) {
    el.innerHTML = `
      <div class="lis__numslabel">原数组 nums</div>
      <div class="lis__nums"></div>
      <div class="lis__tailslabel">tails（下标 0 → 长度 1 的最小结尾，依次类推）</div>
      <div class="lis__tails"></div>
      <div class="lis__best"></div>
    `
    this.numsEl = el.querySelector('.lis__nums')
    this.tailsEl = el.querySelector('.lis__tails')
    this.bestEl = el.querySelector('.lis__best')
    this.numsEl.innerHTML = nums
      .map(
        (v, i) =>
          `<span class="lis__cell" data-i="${i}"><b class="lis__val">${v}</b><span class="lis__idx">${i}</span></span>`,
      )
      .join('')
    this.numCellEls = [...this.numsEl.querySelectorAll('.lis__cell')]
  }

  renderStep(st, { state }) {
    // —— 原数组：标出已处理过的、当前正在看的、（结束时）最终路径上的 ——
    const pathSet = new Set(st.pathIdx ?? [])
    this.numCellEls.forEach((c, i) => {
      c.className = 'lis__cell'
      if (i < st.i) c.classList.add('is-done')
      if (i === st.i) c.classList.add('is-current')
      if (pathSet.has(i)) c.classList.add('is-path')
    })

    // —— tails 区：bsearch 步显示更新前快照 + 区间收缩；apply 步显示更新后的结果 ——
    const tailsArr = st.tails
    this.tailsEl.innerHTML = tailsArr.length
      ? tailsArr
          .map((v, k) => {
            const cls = ['lis__cell', 'lis__cell--tail']
            if (st.kind === 'bsearch') {
              if (k >= st.lo && k < st.hi) cls.push('in-range')
              if (k === st.mid) cls.push('is-mid', st.cmpLt ? 'is-lt' : 'is-ge')
            } else if (st.kind === 'apply' && k === st.pos) {
              cls.push(st.isAppend ? 'is-new' : 'is-replace')
            }
            return `<span class="${cls.join(' ')}" data-k="${k}"><b class="lis__val">${v}</b><span class="lis__idx">${k}</span></span>`
          })
          .join('')
      : `<span class="lis__empty">（空）</span>`

    const len = st.kind === 'apply' ? st.tails.length : st.tails.length
    this.bestEl.innerHTML = `当前已知最长递增子序列长度 = <strong>${len}</strong>`
  }

  resultBanner(result) {
    const { length, pathVals, pathIdx } = result
    return {
      kind: 'success',
      html: `🎉 扫描完成！最长递增子序列的长度是 <strong>${length}</strong>。其中一个具体的例子是
        <code>[${pathVals.join(', ')}]</code>（对应下标 <code>[${pathIdx.join(', ')}]</code>，原数组里的金色格子）。
        注意满足条件的子序列可能不止一种，能找到任意一种长度等于 ${length} 的即可。`,
    }
  }
}

export function mountViz(el, opts) {
  return new LisViz(el, opts)
}

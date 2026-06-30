/*
 * 搜索旋转排序数组「二分查找」动画。
 *
 * 数组是「先升序、再整体旋转一刀」的结果，所以它不是完全有序的，
 * 但有个关键性质：以 mid 切开后，<strong>左右两半里至少有一半还是严格升序的</strong>。
 * 每一步先看 nums[mid]：
 *   1. 等于 target → 直接命中。
 *   2. 否则先判断哪一半是有序的（比较 nums[lo] 和 nums[mid]）；
 *   3. 再看 target 是否落在那段有序区间里——落在里面就去那一半找，
 *      不在里面就说明 target 一定在另一半，去另一半找。
 * 每一步都能排除一半，O(log n)。
 */
import { VizPlayer } from '../../components/viz-player/vizPlayer.js'

const MAX_N = 12

export class RotatedSearchViz extends VizPlayer {
  constructor(mountEl) {
    super(mountEl, {
      inputs: [
        {
          key: 'nums',
          label: '旋转有序数组 nums（逗号分隔）',
          default: '4,5,6,7,0,1,2',
          width: '15rem',
        },
        { key: 'target', label: 'target', default: '0', width: '5rem' },
      ],
      speed: 1300,
      hint: `提示：数组必须是「先升序、再整体旋转」的结果（最多一个下降点），最多 ${MAX_N} 个数。`,
    })
  }

  parseInputs({ nums, target }) {
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
    const t = Math.trunc(Number(target))
    if (!Number.isFinite(t)) throw new Error('target 不是合法数字')
    return { nums: arr, target: t, display: { nums: arr.join(','), target: String(t) } }
  }

  computeSteps({ nums, target }) {
    const steps = []
    let lo = 0
    let hi = nums.length - 1
    let result = -1
    while (lo <= hi) {
      const mid = lo + Math.floor((hi - lo) / 2)
      if (nums[mid] === target) {
        steps.push({
          lo,
          hi,
          mid,
          foundIdx: mid,
          msg: `lo=${lo}、hi=${hi} → mid=${mid}。<code>nums[mid] = ${nums[mid]}</code> 正好等于
            target，直接返回下标 <strong>${mid}</strong>！`,
        })
        result = mid
        break
      }
      const leftSorted = nums[lo] <= nums[mid]
      let sortedSide, sortedFrom, sortedTo, inRange, nextLo, nextHi
      if (leftSorted) {
        sortedSide = 'left'
        sortedFrom = lo
        sortedTo = mid
        inRange = nums[lo] <= target && target < nums[mid]
        if (inRange) {
          nextLo = lo
          nextHi = mid - 1
        } else {
          nextLo = mid + 1
          nextHi = hi
        }
      } else {
        sortedSide = 'right'
        sortedFrom = mid
        sortedTo = hi
        inRange = nums[mid] < target && target <= nums[hi]
        if (inRange) {
          nextLo = mid + 1
          nextHi = hi
        } else {
          nextLo = lo
          nextHi = mid - 1
        }
      }
      steps.push({
        lo,
        hi,
        mid,
        sortedSide,
        sortedFrom,
        sortedTo,
        inRange,
        nextLo,
        nextHi,
        msg:
          `lo=${lo}、hi=${hi} → mid=${mid}，<code>nums[mid] = ${nums[mid]}</code>。` +
          `${
            sortedSide === 'left'
              ? `左半 [${lo}, ${mid}] 是有序的`
              : `右半 [${mid}, ${hi}] 是有序的`
          }，` +
          (inRange
            ? `且 target=${target} 落在这段有序区间里 → 去这一半继续找，新区间收窄为 [${nextLo}, ${nextHi}]。`
            : `但 target=${target} 不在这段有序区间里 → target 一定在另一半 → 新区间收窄为 [${nextLo}, ${nextHi}]。`),
      })
      lo = nextLo
      hi = nextHi
    }
    if (result === -1) {
      steps.push({
        lo,
        hi,
        mid: null,
        exhausted: true,
        msg: `lo=${lo} &gt; hi=${hi}，区间已经收窄成空的了，说明数组里不存在 target=${target}，返回 <strong>-1</strong>。`,
      })
    }
    return { steps, result }
  }

  buildStage({ nums }, el) {
    const n = nums.length
    el.innerHTML = `
      <div class="rsa__target"></div>
      <div class="rsa__row" style="grid-template-columns:repeat(${n},minmax(2.4rem,1fr))"></div>
      <div class="rsa__ptrrow" style="grid-template-columns:repeat(${n},minmax(2.4rem,1fr))"></div>
    `
    this.targetEl = el.querySelector('.rsa__target')
    this.rowEl = el.querySelector('.rsa__row')
    this.ptrRowEl = el.querySelector('.rsa__ptrrow')
    this.rowEl.innerHTML = nums
      .map(
        (v, i) =>
          `<span class="rsa__cell" data-i="${i}"><b class="rsa__val">${v}</b><span class="rsa__idx">${i}</span></span>`,
      )
      .join('')
    this.cellEls = [...this.rowEl.querySelectorAll('.rsa__cell')]
  }

  renderStep(st, { state }) {
    this.targetEl.innerHTML = `查找 target = <strong>${state.target}</strong>`

    this.cellEls.forEach((c, i) => {
      c.className = 'rsa__cell'
      if (st.lo != null && st.hi != null && (i < st.lo || i > st.hi)) c.classList.add('is-out')
    })
    if (st.sortedFrom != null) {
      for (let i = st.sortedFrom; i <= st.sortedTo; i++) {
        this.cellEls[i]?.classList.add('is-sorted-half')
      }
    }
    if (st.lo != null) this.cellEls[st.lo]?.classList.add('is-bound')
    if (st.hi != null) this.cellEls[st.hi]?.classList.add('is-bound')
    if (st.mid != null) this.cellEls[st.mid]?.classList.add('is-mid')
    if (st.foundIdx != null) this.cellEls[st.foundIdx]?.classList.add('is-found')

    const labels = {}
    if (st.lo != null) (labels[st.lo] ??= []).push('lo')
    if (st.mid != null) (labels[st.mid] ??= []).push('mid')
    if (st.hi != null) (labels[st.hi] ??= []).push('hi')
    this.ptrRowEl.innerHTML = state.nums
      .map(
        (_, i) =>
          `<span class="rsa__ptrtag${labels[i] ? ' is-active' : ''}">${
            labels[i] ? labels[i].join('·') : ''
          }</span>`,
      )
      .join('')
  }

  resultBanner(result, state) {
    if (result !== -1 && result != null) {
      return {
        kind: 'success',
        html: `🎉 找到啦！<code>nums[${result}] = ${state.nums[result]}</code> 等于 target → 返回下标 <strong>${result}</strong>。`,
      }
    }
    return {
      kind: 'fail',
      html: `🚫 区间收缩到空，数组里不存在 target = <strong>${state.target}</strong> → 返回 <strong>-1</strong>。`,
    }
  }
}

export function mountViz(el, opts) {
  return new RotatedSearchViz(el, opts)
}

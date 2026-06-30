/*
 * 数据流中位数「对顶双堆」动画。
 *
 * 维护两个堆：大顶堆（存「较小的一半」，堆顶是这一半里最大的数）和
 * 小顶堆（存「较大的一半」，堆顶是这一半里最小的数）。
 * 新数来了，先和大顶堆堆顶比较：更小（或大顶堆还空）就放进大顶堆，否则放进小顶堆。
 * 放完之后如果两堆数量差超过 1，就把较多的那堆的堆顶挪给较少的那堆，重新拉平。
 * 这样大顶堆堆顶永远是「下半区」最大值、小顶堆堆顶永远是「上半区」最小值——
 * 两堆数量相等时中位数是两个堆顶的平均值，差 1 时中位数就是数量较多那堆的堆顶。
 * 插入是 O(log n)，取中位数是 O(1)。
 */
import { VizPlayer } from '../../components/viz-player/vizPlayer.js'

const MAX_N = 10

function fmtMedian(v) {
  return v.toFixed(1)
}

export class MedianFinderViz extends VizPlayer {
  constructor(mountEl) {
    super(mountEl, {
      inputs: [
        { key: 'nums', label: '数据流 addNum 序列（逗号分隔）', default: '5,2,8,1,9,3', width: '14rem' },
      ],
      speed: 1100,
      hint: `提示：依次模拟对每个数调用 addNum 再 findMedian，最多 ${MAX_N} 个数。`,
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
    const maxArr = [] // 大顶堆：较小的一半，items { id, v }
    const minArr = [] // 小顶堆：较大的一半
    const medians = []

    const maxTopObj = () => (maxArr.length ? maxArr.reduce((a, b) => (a.v >= b.v ? a : b)) : null)
    const minTopObj = () => (minArr.length ? minArr.reduce((a, b) => (a.v <= b.v ? a : b)) : null)

    nums.forEach((x, ni) => {
      const mTopObj = maxTopObj()
      const target = !mTopObj || x <= mTopObj.v ? 'max' : 'min'

      steps.push({
        kind: 'decide',
        ni,
        num: x,
        target,
        maxHeap: [...maxArr],
        minHeap: [...minArr],
        msg: !mTopObj
          ? `大顶堆是空的，第一个数 <strong>${x}</strong> 先放进大顶堆（较小的一半）。`
          : target === 'max'
            ? `新数 <strong>${x}</strong> ≤ 大顶堆堆顶 ${mTopObj.v}，属于「较小的一半」→ 放进大顶堆。`
            : `新数 <strong>${x}</strong> &gt; 大顶堆堆顶 ${mTopObj.v}，属于「较大的一半」→ 放进小顶堆。`,
      })

      const item = { id: ni, v: x }
      if (target === 'max') maxArr.push(item)
      else minArr.push(item)

      steps.push({
        kind: 'insert',
        ni,
        num: x,
        target,
        newId: ni,
        maxHeap: [...maxArr],
        minHeap: [...minArr],
        msg: `把 ${x} 放进${
          target === 'max' ? '大顶堆' : '小顶堆'
        }。现在大顶堆 ${maxArr.length} 个数，小顶堆 ${minArr.length} 个数。`,
      })

      let rebalance = null
      if (maxArr.length - minArr.length > 1) {
        const mv = maxTopObj()
        maxArr.splice(maxArr.indexOf(mv), 1)
        minArr.push(mv)
        rebalance = { from: 'max', to: 'min', moved: mv }
      } else if (minArr.length - maxArr.length > 1) {
        const mv = minTopObj()
        minArr.splice(minArr.indexOf(mv), 1)
        maxArr.push(mv)
        rebalance = { from: 'min', to: 'max', moved: mv }
      }

      if (rebalance) {
        steps.push({
          kind: 'rebalance',
          ni,
          num: x,
          from: rebalance.from,
          to: rebalance.to,
          movedId: rebalance.moved.id,
          movedVal: rebalance.moved.v,
          maxHeap: [...maxArr],
          minHeap: [...minArr],
          msg:
            rebalance.from === 'max'
              ? `大顶堆比小顶堆多了 2 个，不平衡了：把大顶堆堆顶 <strong>${rebalance.moved.v}</strong> 挪到小顶堆，让两边数量差不超过 1。`
              : `小顶堆比大顶堆多了 2 个，不平衡了：把小顶堆堆顶 <strong>${rebalance.moved.v}</strong> 挪到大顶堆，让两边数量差不超过 1。`,
        })
      }

      const mTop2 = maxTopObj()
      const mnTop2 = minTopObj()
      let median
      let medianMsg
      if (maxArr.length === minArr.length) {
        median = (mTop2.v + mnTop2.v) / 2
        medianMsg = `两堆数量相等（${maxArr.length} = ${minArr.length}），中位数 = 两堆堆顶的平均值 = (${mTop2.v} + ${mnTop2.v}) / 2 = <strong>${fmtMedian(median)}</strong>。`
      } else if (maxArr.length > minArr.length) {
        median = mTop2.v
        medianMsg = `大顶堆比小顶堆多 1 个（共 ${maxArr.length + minArr.length} 个数，奇数个），中位数就是大顶堆堆顶 = <strong>${fmtMedian(median)}</strong>。`
      } else {
        median = mnTop2.v
        medianMsg = `小顶堆比大顶堆多 1 个（共 ${maxArr.length + minArr.length} 个数，奇数个），中位数就是小顶堆堆顶 = <strong>${fmtMedian(median)}</strong>。`
      }
      medians.push(median)

      steps.push({
        kind: 'median',
        ni,
        num: x,
        median,
        medians: [...medians],
        maxHeap: [...maxArr],
        minHeap: [...minArr],
        msg: medianMsg,
      })
    })

    return { steps, result: medians }
  }

  buildStage({ nums }, el) {
    el.innerHTML = `
      <div class="mf__stream-label">数据流（依次 addNum）</div>
      <div class="mf__stream"></div>
      <div class="mf__heaps">
        <div class="mf__heap mf__heap--max">
          <div class="mf__panel-title">大顶堆 max-heap（较小的一半）</div>
          <div class="mf__chips"></div>
        </div>
        <div class="mf__heap mf__heap--min">
          <div class="mf__panel-title">小顶堆 min-heap（较大的一半）</div>
          <div class="mf__chips"></div>
        </div>
      </div>
      <div class="mf__median">
        <div class="mf__panel-title">findMedian()</div>
        <div class="mf__median-value">—</div>
      </div>
    `
    this.streamEl = el.querySelector('.mf__stream')
    this.maxChipsEl = el.querySelector('.mf__heap--max .mf__chips')
    this.minChipsEl = el.querySelector('.mf__heap--min .mf__chips')
    this.medianEl = el.querySelector('.mf__median-value')

    this.streamEl.innerHTML = nums
      .map(
        (v, i) =>
          `<span class="mf__cell" data-i="${i}"><b class="mf__cell-val">${v}</b><span class="mf__cell-idx">${i}</span></span>`,
      )
      .join('')
    this.streamCellEls = [...this.streamEl.querySelectorAll('.mf__cell')]
  }

  _renderHeap(targetEl, heap, opts) {
    const { sortDesc, newId, movedId, topIsHi } = opts
    const sorted = [...heap].sort((a, b) => (sortDesc ? b.v - a.v : a.v - b.v))
    targetEl.innerHTML = sorted.length
      ? sorted
          .map((o, pos) => {
            const isTop = pos === 0
            const cls = [
              'mf__chip',
              isTop ? (topIsHi ? 'is-top-hi' : 'is-top') : '',
              o.id === newId ? 'is-new' : '',
              o.id === movedId ? 'is-moving' : '',
            ]
              .filter(Boolean)
              .join(' ')
            return `<span class="${cls}">${o.v}${isTop ? '<small>堆顶</small>' : ''}</span>`
          })
          .join('')
      : `<span class="mf__empty">（空）</span>`
  }

  renderStep(st) {
    // 数据流：标记已处理 / 当前 / 未处理
    this.streamCellEls.forEach((c, i) => {
      c.classList.remove('is-current', 'is-done')
      if (i < st.ni) c.classList.add('is-done')
      if (i === st.ni) c.classList.add('is-current')
    })

    const isMedianStep = st.kind === 'median'
    const maxBigger = st.maxHeap.length > st.minHeap.length
    const minBigger = st.minHeap.length > st.maxHeap.length

    this._renderHeap(this.maxChipsEl, st.maxHeap, {
      sortDesc: true,
      newId: st.kind === 'insert' && st.target === 'max' ? st.newId : null,
      movedId: st.kind === 'rebalance' ? st.movedId : null,
      topIsHi: isMedianStep && (maxBigger || st.maxHeap.length === st.minHeap.length),
    })
    this._renderHeap(this.minChipsEl, st.minHeap, {
      sortDesc: false,
      newId: st.kind === 'insert' && st.target === 'min' ? st.newId : null,
      movedId: st.kind === 'rebalance' ? st.movedId : null,
      topIsHi: isMedianStep && (minBigger || st.maxHeap.length === st.minHeap.length),
    })

    if (isMedianStep) {
      this.medianEl.innerHTML = `<strong>${fmtMedian(st.median)}</strong>`
      this.medianEl.classList.add('is-ready')
    } else {
      this.medianEl.innerHTML = `<span class="mf__pending">计算中…</span>`
      this.medianEl.classList.remove('is-ready')
    }
  }

  resultBanner(result) {
    const list = result.map((m) => fmtMedian(m)).join(', ')
    return {
      kind: 'success',
      html: `🎉 全部 ${result.length} 次 addNum 处理完毕！每次调用后的中位数依次是：<code>${list}</code>，最终中位数 = <strong>${fmtMedian(result[result.length - 1])}</strong>。`,
    }
  }
}

export function mountViz(el, opts) {
  return new MedianFinderViz(el, opts)
}

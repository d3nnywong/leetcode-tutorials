/*
 * 347. 前 K 个高频元素 —— 「桶排序」分步动画。
 *
 * 三步走：
 *   ① 扫一遍 nums，用哈希表统计每个数字出现的次数（值 → 次数）。
 *   ② 按「出现次数」把数字装进对应的桶：下标 = 出现次数，桶里放达到这个频率的数字
 *      （一个数最多出现 n 次，所以桶的下标范围是 0..n）。
 *   ③ 从下标最大（出现次数最多）的桶往下标小的桶扫，边扫边收集，凑够 k 个数字就停。
 *
 * 全程没有任何排序，时间复杂度 O(n)，比直接按频率排序的 O(n log n) 更优——
 * 正好回应题目「进阶」里的要求。
 */
import { VizPlayer } from '../../components/viz-player/vizPlayer.js'

const MAX_N = 14

export class TopKFrequentViz extends VizPlayer {
  constructor(mountEl) {
    super(mountEl, {
      inputs: [
        { key: 'nums', label: '数组 nums（逗号分隔）', default: '1,1,1,2,2,3', width: '14rem' },
        { key: 'k', label: 'k', default: '2', width: '4rem' },
      ],
      speed: 1000,
      hint: `提示：可改成你自己的数组和 k，点「应用」重新演示（最多 ${MAX_N} 个数）。`,
    })
  }

  parseInputs({ nums, k }) {
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
    const uniqueCount = new Set(arr).size
    const kv = Math.trunc(Number(k))
    if (!Number.isFinite(kv)) throw new Error('k 不是合法数字')
    if (kv < 1) throw new Error('k 至少为 1')
    if (kv > uniqueCount) throw new Error(`k 不能超过数组中不同元素的个数（${uniqueCount}）`)
    return { nums: arr, k: kv, display: { nums: arr.join(','), k: String(kv) } }
  }

  computeSteps({ nums, k }) {
    const steps = []
    const freq = new Map()

    // ① 统计频率
    for (let i = 0; i < nums.length; i++) {
      const x = nums[i]
      freq.set(x, (freq.get(x) || 0) + 1)
      steps.push({
        phase: 'count',
        i,
        x,
        freq: [...freq.entries()],
        msg: `扫到 nums[${i}] = ${x}，频率表里 ${x} 的次数 +1 → 现在是 <strong>${freq.get(
          x,
        )}</strong> 次。`,
      })
    }

    const maxFreq = Math.max(...freq.values())
    const buckets = Array.from({ length: maxFreq + 1 }, () => [])

    // ② 按频率装桶（按数字第一次出现的顺序逐个装）
    for (const val of freq.keys()) {
      const f = freq.get(val)
      buckets[f].push(val)
      steps.push({
        phase: 'bucket',
        val,
        f,
        freq: [...freq.entries()],
        buckets: buckets.map((b) => [...b]),
        msg: `数字 <strong>${val}</strong> 一共出现了 ${f} 次 → 放进「出现 ${f} 次」这个桶。`,
      })
    }

    // ③ 从高频桶往低频桶收集，凑够 k 个就停
    const finalBuckets = buckets.map((b) => [...b])
    const result = []
    collect: for (let f = maxFreq; f >= 1; f--) {
      for (const val of finalBuckets[f]) {
        if (result.length >= k) break collect
        result.push(val)
        steps.push({
          phase: 'collect',
          f,
          val,
          freq: [...freq.entries()],
          buckets: finalBuckets,
          result: [...result],
          msg: `从「出现 ${f} 次」的桶里取出 <strong>${val}</strong> → 已收集 ${result.length} / ${k} 个。`,
        })
        if (result.length === k) break collect
      }
    }

    if (steps.length) steps[steps.length - 1].done = true
    return { steps, result }
  }

  buildStage({ nums, k }, el) {
    el.innerHTML = `
      <div class="tkf__target">目标：取出现频率最高的 <b class="tkf__k">${k}</b> 个不同数字</div>
      <div class="tkf__stepline">① 统计频率（哈希表：值 → 次数）</div>
      <div class="tkf__nums"></div>
      <div class="tkf__freqlabel">频率表</div>
      <div class="tkf__freq"></div>
      <div class="tkf__stepline">② 按频率装桶（桶的下标 = 出现次数）</div>
      <div class="tkf__buckets"></div>
      <div class="tkf__stepline">③ 从高频桶往低频桶收集，凑够 k 个就停</div>
      <div class="tkf__resultlabel">已收集的结果</div>
      <div class="tkf__result"></div>
    `
    this.numsEl = el.querySelector('.tkf__nums')
    this.freqEl = el.querySelector('.tkf__freq')
    this.bucketsEl = el.querySelector('.tkf__buckets')
    this.resultEl = el.querySelector('.tkf__result')

    this.numsEl.innerHTML = nums
      .map(
        (v, i) =>
          `<span class="tkf__cell" data-i="${i}"><b class="tkf__val">${v}</b><span class="tkf__idx">${i}</span></span>`,
      )
      .join('')
    this.cellEls = [...this.numsEl.querySelectorAll('.tkf__cell')]

    // 桶的「骨架」列数固定（取决于最终频率分布），内容由每一步按快照填充
    const tmp = new Map()
    for (const x of nums) tmp.set(x, (tmp.get(x) || 0) + 1)
    const maxFreq = Math.max(...tmp.values())
    const cols = []
    for (let f = maxFreq; f >= 1; f--) {
      cols.push(
        `<div class="tkf__bucket" data-f="${f}"><div class="tkf__bucket-items"></div><div class="tkf__bucket-label">出现 ${f} 次</div></div>`,
      )
    }
    this.bucketsEl.innerHTML = cols.join('')
    this.bucketColEls = {}
    this.bucketsEl.querySelectorAll('.tkf__bucket').forEach((col) => {
      this.bucketColEls[col.dataset.f] = col
    })
  }

  renderStep(st) {
    // nums 格子
    this.cellEls.forEach((c) => (c.className = 'tkf__cell'))
    if (st.phase === 'count' && typeof st.i === 'number') {
      this.cellEls[st.i]?.classList.add('is-current')
    }
    if (st.phase !== 'count') {
      this.cellEls.forEach((c) => c.classList.add('is-done'))
    }

    // 频率表
    const freqEntries = st.freq ?? []
    this.freqEl.innerHTML = freqEntries.length
      ? freqEntries
          .map(
            ([val, cnt]) =>
              `<code class="tkf__chip${
                st.phase === 'bucket' && val === st.val ? ' is-current' : ''
              }">${val} → ${cnt}</code>`,
          )
          .join('')
      : `<span class="tkf__empty">（空）</span>`

    // 桶
    const bucketsSnap = st.buckets ?? []
    const resultSet = new Set(st.result ?? [])
    Object.entries(this.bucketColEls).forEach(([fStr, col]) => {
      const f = Number(fStr)
      col.classList.toggle(
        'is-current',
        f === st.f && (st.phase === 'bucket' || st.phase === 'collect'),
      )
      const itemsEl = col.querySelector('.tkf__bucket-items')
      const vals = bucketsSnap[f] ?? []
      itemsEl.innerHTML = vals
        .map((v) => {
          let cls = 'tkf__bucket-chip'
          if (st.phase === 'bucket' && f === st.f && v === st.val) cls += ' is-current'
          else if (resultSet.has(v)) {
            cls += st.phase === 'collect' && f === st.f && v === st.val ? ' is-current' : ' is-picked'
          }
          return `<span class="${cls}">${v}</span>`
        })
        .join('')
    })

    // 结果
    const resultVals = st.result ?? []
    this.resultEl.innerHTML = resultVals.length
      ? resultVals
          .map(
            (v, idx) =>
              `<span class="tkf__result-chip${
                idx === resultVals.length - 1 && st.phase === 'collect' ? ' is-new' : ''
              }">${v}</span>`,
          )
          .join('')
      : `<span class="tkf__empty">（还没开始收集）</span>`
  }

  resultBanner(result, state) {
    if (!result || !result.length) {
      return { kind: 'info', html: '没有可收集的元素。' }
    }
    return {
      kind: 'success',
      html: `🎉 出现频率前 <strong>${state.k}</strong> 高的元素是：<code>[${result.join(
        ', ',
      )}]</code>（顺序不唯一，只要这几个数字的集合一致即可）。`,
    }
  }
}

export function mountViz(el, opts) {
  return new TopKFrequentViz(el, opts)
}

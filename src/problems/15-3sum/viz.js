/*
 * 三数之和「排序 + 双指针」动画。
 *
 * 先把数组从小到大排序，然后固定一个数 nums[i] 当“锚点”，
 * 在它右边用左右指针 l、r 从两端向中间夹逼：
 *   三数之和 < 0 → 太小，左指针右移找更大的数；
 *   三数之和 > 0 → 太大，右指针左移找更小的数；
 *   三数之和 = 0 → 记录答案，左右指针各跳过相同的值后继续夹逼。
 * 排序后一旦 nums[i] > 0 就能直接收尾（后面只会更大）；
 * nums[i] 和上一个锚点相同也直接跳过（避免算出重复三元组）。整体 O(n²)。
 */
import { VizPlayer } from '../../components/viz-player/vizPlayer.js'

const MAX_N = 10

export class ThreeSumViz extends VizPlayer {
  constructor(mountEl) {
    super(mountEl, {
      inputs: [
        { key: 'nums', label: '数组 nums（逗号分隔）', default: '-1,0,1,2,-1,-4', width: '16rem' },
      ],
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
    if (arr.length < 3) throw new Error('至少要有 3 个数')
    return { nums: arr, display: { nums: arr.join(',') } }
  }

  computeSteps({ nums }) {
    const sorted = [...nums].sort((a, b) => a - b)
    const n = sorted.length
    const steps = []
    const results = []

    steps.push({
      kind: 'sorted',
      i: null,
      l: null,
      r: null,
      results: [],
      msg: `先把数组排序：<code>${nums.join(',')}</code> → <code>${sorted.join(
        ',',
      )}</code>。排序后才能用双指针从两端夹逼，也方便跳过重复值。`,
    })

    for (let i = 0; i < n - 2; i++) {
      if (sorted[i] > 0) {
        steps.push({
          kind: 'break',
          i,
          l: null,
          r: null,
          results: [...results],
          msg: `nums[${i}] = ${sorted[i]} &gt; 0。排序后它右边的数只会更大，三个数加起来不可能为 0，直接结束扫描。`,
        })
        break
      }
      if (i > 0 && sorted[i] === sorted[i - 1]) {
        steps.push({
          kind: 'skip-i',
          i,
          l: null,
          r: null,
          results: [...results],
          msg: `nums[${i}] = ${sorted[i]} 和上一个锚点 nums[${i - 1}] 相同，用它当锚点只会得到重复的三元组，跳过。`,
        })
        continue
      }
      let l = i + 1
      let r = n - 1
      steps.push({
        kind: 'fix',
        i,
        l,
        r,
        results: [...results],
        msg: `固定锚点 nums[${i}] = ${sorted[i]}，左指针 l = ${l}、右指针 r = ${r} 从两端向中间夹逼。`,
      })
      while (l < r) {
        const sum = sorted[i] + sorted[l] + sorted[r]
        if (sum === 0) {
          results.push([sorted[i], sorted[l], sorted[r]])
          steps.push({
            kind: 'found',
            i,
            l,
            r,
            results: [...results],
            msg: `nums[${i}] + nums[${l}] + nums[${r}] = ${sorted[i]} + ${sorted[l]} + ${sorted[r]} = 0 → 命中！记录三元组 <strong>[${sorted[i]}, ${sorted[l]}, ${sorted[r]}]</strong>，接着跳过左右两边的重复值，继续向中间夹逼。`,
          })
          const oldL = sorted[l]
          const oldR = sorted[r]
          l++
          r--
          while (l < r && sorted[l] === oldL) l++
          while (l < r && sorted[r] === oldR) r--
        } else if (sum < 0) {
          steps.push({
            kind: 'move-l',
            i,
            l,
            r,
            results: [...results],
            msg: `nums[${i}] + nums[${l}] + nums[${r}] = ${sum} &lt; 0，太小了，左指针右移找更大的数。`,
          })
          l++
        } else {
          steps.push({
            kind: 'move-r',
            i,
            l,
            r,
            results: [...results],
            msg: `nums[${i}] + nums[${l}] + nums[${r}] = ${sum} &gt; 0，太大了，右指针左移找更小的数。`,
          })
          r--
        }
      }
    }

    steps.push({
      kind: 'done',
      i: null,
      l: null,
      r: null,
      results: [...results],
      msg: `扫描结束，一共找到 <strong>${results.length}</strong> 组不重复的三元组。`,
    })

    return { steps, result: { sorted, triplets: results } }
  }

  buildStage(state, el) {
    const sorted = this.result.sorted
    el.innerHTML = `
      <div class="tri__nums"></div>
      <div class="tri__sumline"></div>
      <div class="tri__resultslabel">已找到的三元组</div>
      <div class="tri__results"></div>
    `
    this.numsEl = el.querySelector('.tri__nums')
    this.sumEl = el.querySelector('.tri__sumline')
    this.resultsEl = el.querySelector('.tri__results')
    this.numsEl.innerHTML = sorted
      .map(
        (v, i) =>
          `<span class="tri__cell" data-i="${i}"><b class="tri__val">${v}</b><span class="tri__idx">${i}</span></span>`,
      )
      .join('')
    this.cellEls = [...this.numsEl.querySelectorAll('.tri__cell')]
  }

  renderStep(st) {
    const sorted = this.result.sorted

    this.cellEls.forEach((c, idx) => {
      c.className = 'tri__cell'
      if (st.i != null && idx < st.i) c.classList.add('is-used')
    })
    if (st.i != null) this.cellEls[st.i]?.classList.add('is-i')
    if (st.l != null) this.cellEls[st.l]?.classList.add('is-l')
    if (st.r != null) this.cellEls[st.r]?.classList.add('is-r')
    if (st.kind === 'found') {
      this.cellEls[st.i]?.classList.add('is-match')
      this.cellEls[st.l]?.classList.add('is-match')
      this.cellEls[st.r]?.classList.add('is-match')
    }
    if (st.kind === 'break' || st.kind === 'skip-i') {
      this.cellEls[st.i]?.classList.add('is-stop')
    }

    if (st.l != null && st.r != null) {
      const sum = sorted[st.i] + sorted[st.l] + sorted[st.r]
      this.sumEl.innerHTML = `nums[${st.i}] + nums[${st.l}] + nums[${st.r}] = ${sorted[st.i]} + ${
        sorted[st.l]
      } + ${sorted[st.r]} = <strong class="${sum === 0 ? 'is-zero' : ''}">${sum}</strong>`
    } else {
      this.sumEl.innerHTML = ''
    }

    this.resultsEl.innerHTML =
      st.results.length === 0
        ? `<span class="tri__empty">（暂无）</span>`
        : st.results
            .map(
              (t, idx) =>
                `<code class="tri__chip${
                  st.kind === 'found' && idx === st.results.length - 1 ? ' is-new' : ''
                }">[${t.join(', ')}]</code>`,
            )
            .join('')
  }

  resultBanner(result) {
    const { triplets } = result
    if (triplets.length === 0) {
      return {
        kind: 'info',
        html: `这组输入没有和为 0 的三元组（自定义输入可能确实无解）。`,
      }
    }
    return {
      kind: 'success',
      html: `🎉 一共找到 <strong>${triplets.length}</strong> 组：${triplets
        .map((t) => `<code>[${t.join(', ')}]</code>`)
        .join('，')}。`,
    }
  }
}

export function mountViz(el, opts) {
  return new ThreeSumViz(el, opts)
}

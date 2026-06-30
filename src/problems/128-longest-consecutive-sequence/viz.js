/*
 * 最长连续序列「哈希集合 + 只从起点数」动画。
 *
 * 先把所有数去重丢进一个哈希集合（Set），查某个数在不在集合里是 O(1)。
 * 然后扫一遍集合里的每个数 v：如果 v-1 也在集合里，说明 v 不是一段连续序列的起点
 * （它前面还接得上），直接跳过；只有当 v-1 不在集合里时，v 才是某段序列的起点，
 * 这时才从 v 开始一直 +1 往后数，数出这一段有多长，刷新最长记录。
 * 因为只有「真正的起点」才会触发往后数的循环，每个数总共只会被数一次，
 * 所以整体仍然是 O(n)，不会退化成 O(n²)。
 */
import { VizPlayer } from '../../components/viz-player/vizPlayer.js'

const MAX_N = 12

export class LcsViz extends VizPlayer {
  constructor(mountEl) {
    super(mountEl, {
      inputs: [
        { key: 'nums', label: '数组 nums（逗号分隔）', default: '100,4,200,1,3,2', width: '15rem' },
      ],
      speed: 1100,
      hint: `提示：可改成你自己的数组，点「应用」重新演示（最多 ${MAX_N} 个数，重复的数也可以）。`,
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
    return { nums: arr, display: { nums: arr.join(',') } }
  }

  computeSteps({ nums }) {
    const steps = []
    const set = new Set(nums)
    const sorted = [...set].sort((a, b) => a - b)
    let best = 0
    let bestRun = []

    steps.push({
      kind: 'init',
      checking: null,
      run: [],
      best,
      bestRun: [],
      msg:
        nums.length === 0
          ? '数组是空的，最长连续序列长度就是 0。'
          : `先把数组里的数去重，放进一个哈希集合（Set），一共有 <strong>${sorted.length}</strong> 个不同的数。` +
            `查某个数在不在集合里是 O(1)。`,
    })

    for (const v of sorted) {
      const hasPred = set.has(v - 1)
      if (hasPred) {
        steps.push({
          kind: 'skip',
          checking: v,
          run: [],
          best,
          bestRun,
          msg: `检查 <strong>${v}</strong>：${v - 1} 在集合里 → ${v} 前面还接得上别的数，
                它不是某段序列的起点，跳过（不从它往后数，避免重复劳动）。`,
        })
        continue
      }

      let cur = v
      let run = [v]
      steps.push({
        kind: 'start',
        checking: v,
        run: [...run],
        best,
        bestRun,
        msg: `检查 <strong>${v}</strong>：${v - 1} 不在集合里 → ${v} 是一段连续序列的<strong>起点</strong>，开始往后数。`,
      })

      while (set.has(cur + 1)) {
        cur += 1
        run.push(cur)
        steps.push({
          kind: 'extend',
          checking: v,
          run: [...run],
          best,
          bestRun,
          msg: `${cur} 也在集合里 → 序列延伸到 <code>[${run.join(', ')}]</code>，当前长度 <strong>${run.length}</strong>。`,
        })
      }

      const improved = run.length > best
      if (improved) {
        best = run.length
        bestRun = [...run]
      }
      steps.push({
        kind: 'end',
        checking: v,
        run: [...run],
        best,
        bestRun,
        improved,
        msg: improved
          ? `${cur + 1} 不在集合里 → 这段序列在 ${cur} 结束，长度 <strong>${run.length}</strong>，
             超过之前的最长记录，刷新为 <strong>${best}</strong>！`
          : `${cur + 1} 不在集合里 → 这段序列在 ${cur} 结束，长度 ${run.length}，
             没有超过当前最长 <strong>${best}</strong>。`,
      })
    }

    steps.push({
      kind: 'done',
      checking: null,
      run: [],
      best,
      bestRun,
      msg:
        sorted.length === 0
          ? '没有任何数，最长连续序列长度为 0。'
          : `集合扫完了。最长连续序列是 <code>[${bestRun.join(', ')}]</code>，
             长度为 <strong>${best}</strong>。`,
    })

    return { steps, result: best }
  }

  buildStage({ nums }, el) {
    const seen = new Set()
    el.innerHTML = `
      <div class="lcs__row">
        <div class="lcs__rowlabel">原数组 nums</div>
        <div class="lcs__arr"></div>
      </div>
      <div class="lcs__arrow">↓ 去重，放进哈希集合 Set</div>
      <div class="lcs__row">
        <div class="lcs__rowlabel">集合（按大小排好方便看，实际顺序无所谓）</div>
        <div class="lcs__set"></div>
      </div>
      <div class="lcs__best"></div>
    `
    this.arrEl = el.querySelector('.lcs__arr')
    this.setEl = el.querySelector('.lcs__set')
    this.bestEl = el.querySelector('.lcs__best')

    this.arrEl.innerHTML = nums
      .map((v, i) => {
        const dup = seen.has(v)
        seen.add(v)
        return `<span class="lcs__cell${dup ? ' is-dup' : ''}" data-v="${v}">${v}</span>`
      })
      .join('')
    this.arrCellEls = [...this.arrEl.querySelectorAll('.lcs__cell')]

    const sorted = [...new Set(nums)].sort((a, b) => a - b)
    this.setEl.innerHTML = sorted
      .map((v) => `<span class="lcs__chip" data-v="${v}">${v}</span>`)
      .join('')
    this.chipEls = [...this.setEl.querySelectorAll('.lcs__chip')]
  }

  renderStep(st) {
    const runSet = new Set(st.run)
    const bestSet = new Set(st.bestRun)
    const showBest = st.kind === 'done'

    this.chipEls.forEach((c) => {
      const v = Number(c.dataset.v)
      c.className = 'lcs__chip'
      if (showBest && bestSet.has(v)) c.classList.add('is-best')
      else if (runSet.has(v)) c.classList.add('is-run')
      else if (v === st.checking && st.kind === 'skip') c.classList.add('is-skip')
      else if (v === st.checking) c.classList.add('is-current')
    })

    this.arrCellEls.forEach((c) => {
      const v = Number(c.dataset.v)
      c.classList.remove('is-run', 'is-best', 'is-current')
      if (showBest && bestSet.has(v)) c.classList.add('is-best')
      else if (runSet.has(v)) c.classList.add('is-run')
      else if (v === st.checking) c.classList.add('is-current')
    })

    this.bestEl.innerHTML = `当前最长连续序列长度：<strong>${st.best}</strong>${
      st.bestRun.length ? ` <code>[${st.bestRun.join(', ')}]</code>` : ''
    }`
  }

  resultBanner(result, state) {
    if (state.nums.length === 0) {
      return { kind: 'info', html: '数组为空，最长连续序列长度为 <strong>0</strong>。' }
    }
    return {
      kind: 'success',
      html: `🎉 最长连续序列的长度是 <strong>${result}</strong>。`,
    }
  }
}

export function mountViz(el, opts) {
  return new LcsViz(el, opts)
}

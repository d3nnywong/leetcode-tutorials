/*
 * 插入区间「数轴扫描合并」动画。
 *
 * intervals 已经按起点升序排好，所以扫描一遍就够：
 *   1. 结束点 < 新区间起点 —— 完全在新区间左边，不重叠，原样收进结果；
 *   2. 起点 <= 新区间（当前已合并出的）结束点 —— 与新区间重叠，吸收进新区间
 *      （新区间的左右边界分别取 min / max）；
 *   3. 剩下的——新区间已经合并完毕、不会再扩大，后面的区间必然不重叠，原样收进结果。
 * 把吸收完的新区间插入到第 1、3 部分之间，就是答案。整个过程只扫一遍，O(n)。
 */
import { VizPlayer } from '../../components/viz-player/vizPlayer.js'

const MAX_N = 10

export class InsertIntervalViz extends VizPlayer {
  constructor(mountEl) {
    super(mountEl, {
      inputs: [
        {
          key: 'intervals',
          label: 'intervals（逗号分隔，两两一对，按起点升序）',
          default: '1,2,3,5,6,7,8,10,12,16',
          width: '22rem',
        },
        { key: 'newInterval', label: 'newInterval（start,end）', default: '4,8', width: '7rem' },
      ],
      speed: 1200,
      hint: `提示：intervals 必须按起点升序、互不重叠（题目保证），最多 ${MAX_N} 个区间。`,
    })
  }

  parseInputs({ intervals, newInterval }) {
    const nums = (intervals ?? '')
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s !== '')
      .slice(0, MAX_N * 2)
      .map((s) => {
        const v = Number(s)
        if (!Number.isFinite(v) || v < 0) throw new Error(`「${s}」不是合法的非负整数`)
        return Math.trunc(v)
      })
    if (nums.length % 2 !== 0) {
      throw new Error('intervals 里的数字个数必须是偶数（两两一对表示一个区间）')
    }
    const ivs = []
    for (let i = 0; i < nums.length; i += 2) {
      const s = nums[i]
      const e = nums[i + 1]
      if (s > e) throw new Error(`区间 [${s}, ${e}] 不合法：起点不能大于终点`)
      ivs.push([s, e])
    }
    for (let i = 1; i < ivs.length; i++) {
      if (ivs[i][0] < ivs[i - 1][0]) throw new Error('intervals 必须按起点升序排列（题目保证）')
    }

    const niNums = (newInterval ?? '')
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s !== '')
      .map((s) => {
        const v = Number(s)
        if (!Number.isFinite(v) || v < 0) throw new Error(`「${s}」不是合法的非负整数`)
        return Math.trunc(v)
      })
    if (niNums.length !== 2) throw new Error('newInterval 需要正好两个数字：start,end')
    if (niNums[0] > niNums[1]) throw new Error('newInterval 起点不能大于终点')

    return {
      intervals: ivs,
      newInterval: niNums,
      display: {
        intervals: ivs.map(([s, e]) => `${s},${e}`).join(','),
        newInterval: niNums.join(','),
      },
    }
  }

  computeSteps({ intervals, newInterval }) {
    const n = intervals.length
    const steps = []
    const result = []
    const status = new Array(n).fill('pending')
    let [curS, curE] = newInterval
    let i = 0

    steps.push({
      kind: 'init',
      idx: -1,
      status: [...status],
      cur: [curS, curE],
      result: [],
      inserted: false,
      justAdded: false,
      msg: `要把新区间 <code>[${curS}, ${curE}]</code> 插进已排好序的 intervals，并合并掉重叠部分。从左到右扫一遍。`,
    })

    // 1. 完全在新区间左边，不重叠
    while (i < n && intervals[i][1] < curS) {
      status[i] = 'before'
      result.push(intervals[i])
      steps.push({
        kind: 'before',
        idx: i,
        status: [...status],
        cur: [curS, curE],
        result: result.map((iv) => [...iv]),
        inserted: false,
        justAdded: true,
        msg: `区间 <code>[${intervals[i][0]}, ${intervals[i][1]}]</code> 的结束点 ${intervals[i][1]} 在新区间起点 ${curS} 左边，完全不重叠 → 原样收进结果。`,
      })
      i++
    }

    // 2. 与新区间重叠，吸收合并
    while (i < n && intervals[i][0] <= curE) {
      const [s, e] = intervals[i]
      const newS = Math.min(curS, s)
      const newE = Math.max(curE, e)
      status[i] = 'merge'
      steps.push({
        kind: 'merge',
        idx: i,
        status: [...status],
        cur: [newS, newE],
        result: result.map((iv) => [...iv]),
        inserted: false,
        justAdded: false,
        msg: `区间 <code>[${s}, ${e}]</code> 的起点 ${s} ≤ 当前新区间结束点 ${curE} → 重叠，合并：<code>[min(${curS},${s}), max(${curE},${e})] = [${newS}, ${newE}]</code>。`,
      })
      curS = newS
      curE = newE
      i++
    }

    // 把合并完毕的新区间插入结果
    result.push([curS, curE])
    steps.push({
      kind: 'insert',
      idx: -1,
      status: [...status],
      cur: [curS, curE],
      result: result.map((iv) => [...iv]),
      inserted: true,
      justAdded: true,
      msg: `重叠部分合并完毕，把最终的新区间 <strong>[${curS}, ${curE}]</strong> 插入结果数组。`,
    })

    // 3. 新区间右边、不再重叠的剩余区间
    while (i < n) {
      status[i] = 'after'
      result.push(intervals[i])
      steps.push({
        kind: 'after',
        idx: i,
        status: [...status],
        cur: [curS, curE],
        result: result.map((iv) => [...iv]),
        inserted: true,
        justAdded: true,
        msg: `区间 <code>[${intervals[i][0]}, ${intervals[i][1]}]</code> 的起点 ${intervals[i][0]} 在合并后的新区间右边（> ${curE}），不会再重叠 → 原样收进结果。`,
      })
      i++
    }

    steps.push({
      kind: 'done',
      idx: -1,
      status: [...status],
      cur: [curS, curE],
      result: result.map((iv) => [...iv]),
      inserted: true,
      justAdded: false,
      msg: `扫描结束。最终结果是 <strong>[${result.map(([s, e]) => `[${s},${e}]`).join(', ')}]</strong>。`,
    })

    return { steps, result }
  }

  buildStage({ intervals, newInterval }, el) {
    this.geo = this.#geometry(intervals, newInterval)
    el.innerHTML = `
      <div class="iv__chartwrap">${this.#svg(intervals)}</div>
      <div class="iv__resultlabel">结果 result：</div>
      <div class="iv__result"></div>
    `
    this.svgEl = el.querySelector('.iv__svg')
    this.resultEl = el.querySelector('.iv__result')
    this.barEls = [...this.svgEl.querySelectorAll('.iv-bar')]
    this.newRectEl = this.svgEl.querySelector('.iv-new')
    this.newLabelEl = this.svgEl.querySelector('.iv-new-label')
  }

  #geometry(intervals, newInterval) {
    const allVals = [...intervals.flat(), ...newInterval, 0]
    const maxV = Math.max(...allVals, 1)
    const rowH = 34
    const padTop = 32
    const padX = 16
    const W = 640
    const usableW = W - padX * 2
    const scale = usableW / maxV
    const n = intervals.length
    const H = padTop + rowH * (n + 1) + 16
    return { maxV, rowH, padTop, padX, W, H, scale, n, x: (v) => padX + v * scale }
  }

  #svg(intervals) {
    const g = this.geo
    let rows = `<rect class="iv-new" x="0" y="${g.padTop}" width="0" height="18" rx="4"/>`
    rows += `<text class="iv-new-label" x="0" y="${g.padTop - 8}"></text>`
    for (let i = 0; i < g.n; i++) {
      const [s, e] = intervals[i]
      const y = g.padTop + g.rowH * (i + 1)
      const x1 = g.x(s)
      const x2 = g.x(e)
      rows += `<rect class="iv-bar" data-i="${i}" x="${x1}" y="${y}" width="${Math.max(
        2,
        x2 - x1,
      )}" height="18" rx="4"/>`
      rows += `<text class="iv-label" x="${(x1 + x2) / 2}" y="${y - 6}">[${s},${e}]</text>`
    }
    if (g.n === 0) {
      rows += `<text class="iv-empty" x="${g.padX}" y="${g.padTop + g.rowH}">intervals 为空，直接插入新区间</text>`
    }
    return `<svg class="iv__svg" viewBox="0 0 ${g.W} ${g.H}" preserveAspectRatio="xMidYMid meet" role="img">${rows}</svg>`
  }

  renderStep(st) {
    const g = this.geo
    const [cs, ce] = st.cur
    const x1 = g.x(cs)
    const x2 = g.x(ce)
    this.newRectEl.setAttribute('x', x1)
    this.newRectEl.setAttribute('width', Math.max(2, x2 - x1))
    this.newRectEl.classList.toggle('is-final', !!st.inserted)
    this.newLabelEl.setAttribute('x', (x1 + x2) / 2)
    this.newLabelEl.textContent = `新区间 [${cs},${ce}]`

    this.barEls.forEach((b) => {
      const i = Number(b.dataset.i)
      b.classList.remove('is-current', 'is-kept', 'is-merged')
      const s = st.status[i]
      if (s === 'before' || s === 'after') b.classList.add('is-kept')
      else if (s === 'merge') b.classList.add('is-merged')
      if (i === st.idx) b.classList.add('is-current')
    })

    this.resultEl.innerHTML =
      st.result.length === 0
        ? `<span class="iv__empty">（空）</span>`
        : st.result
            .map(
              ([s, e], idx) =>
                `<code class="iv__chip${
                  idx === st.result.length - 1 && st.justAdded ? ' is-new' : ''
                }">[${s},${e}]</code>`,
            )
            .join('')
  }

  resultBanner(result) {
    return {
      kind: 'success',
      html: `🎉 插入并合并完毕，最终结果是 <strong>[${result
        .map(([s, e]) => `[${s},${e}]`)
        .join(', ')}]</strong>。`,
    }
  }
}

export function mountViz(el, opts) {
  return new InsertIntervalViz(el, opts)
}

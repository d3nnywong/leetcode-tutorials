/*
 * 无重叠区间「按结束时间排序 + 贪心扫描」动画。
 *
 * 想让剩下的区间互不重叠、又要移除得最少，等价于「最多能保留多少个互不重叠的区间」，
 * 这就是经典的「活动选择」问题：把所有区间按<strong>结束时间</strong>从小到大排序——
 * 结束得越早，给后面留出的空间就越多，应该优先保留。
 *
 * 于是从左到右扫一遍，手里攥着「上一个保留区间的结束点 lastEnd」：
 *   当前区间的起点 ≥ lastEnd → 不重叠，保留它，把 lastEnd 更新成它的结束点；
 *   当前区间的起点 <  lastEnd → 重叠了，只能移除一个，移除当前这个（结束更晚，更占地方）。
 * 排序 O(n log n)，扫描 O(n)，整体 O(n log n)；答案就是被移除的次数。
 */
import { VizPlayer } from '../../components/viz-player/vizPlayer.js'

const MAX_N = 10

export class NonOverlappingViz extends VizPlayer {
  constructor(mountEl) {
    super(mountEl, {
      inputs: [
        {
          key: 'intervals',
          label: '区间数组 intervals（每个区间写 start,end，区间之间用分号分隔）',
          default: '1,2;2,3;3,4;1,3',
          width: '22rem',
        },
      ],
      speed: 1200,
      hint: `提示：可改成你自己的区间，例如 1,2;1,2;1,2，点「应用」重新演示（最多 ${MAX_N} 个区间）。`,
    })
  }

  parseInputs({ intervals }) {
    const raw = (intervals ?? '').trim()
    const parts = raw
      .split(';')
      .map((s) => s.trim())
      .filter((s) => s !== '')
    if (parts.length === 0) throw new Error('请至少输入一个区间')
    if (parts.length > MAX_N) throw new Error(`最多支持 ${MAX_N} 个区间`)
    const arr = parts.map((p) => {
      const nums = p.split(',').map((x) => x.trim())
      if (nums.length !== 2) throw new Error(`「${p}」不是合法的区间，应写成 start,end`)
      const s = Number(nums[0])
      const e = Number(nums[1])
      if (!Number.isFinite(s) || !Number.isFinite(e)) throw new Error(`「${p}」包含非法数字`)
      const si = Math.trunc(s)
      const ei = Math.trunc(e)
      if (si >= ei) throw new Error(`区间 [${si},${ei}] 的起点必须小于终点`)
      return [si, ei]
    })
    return { intervals: arr, display: { intervals: arr.map(([s, e]) => `${s},${e}`).join(';') } }
  }

  computeSteps({ intervals }) {
    // 按结束时间排序（结束时间相同再按起点排序），保留原始下标方便对照
    const sorted = intervals
      .map((iv, i) => ({ s: iv[0], e: iv[1], origIdx: i }))
      .sort((a, b) => a.e - b.e || a.s - b.s)
    this._sorted = sorted

    const steps = []
    steps.push({
      kind: 'sort',
      statuses: sorted.map(() => 'pending'),
      boundary: null,
      msg: `第一步：把 ${intervals.length} 个区间按<strong>结束时间</strong>从小到大排序，结果是 ${sorted
        .map((x) => `[${x.s}, ${x.e}]`)
        .join('、')}。结束得越早，留给后面的空间就越多，应该优先保留它。`,
    })

    let removed = 0
    let lastEnd = -Infinity
    const statuses = sorted.map(() => 'pending')
    for (let i = 0; i < sorted.length; i++) {
      const cur = sorted[i]
      const boundaryBefore = lastEnd
      const overlap = cur.s < lastEnd
      let action, msg
      if (overlap) {
        removed++
        action = 'remove'
        statuses[i] = 'removed'
        msg = `看 <code>[${cur.s}, ${cur.e}]</code>：起点 ${cur.s} &lt; 上一个保留区间的结束点 ${boundaryBefore} → 重叠了！两者只能留一个，留结束更早的那个 → <strong>移除</strong>当前这个，已移除 <strong>${removed}</strong> 个。`
      } else {
        action = 'keep'
        statuses[i] = 'keep'
        lastEnd = cur.e
        msg = `看 <code>[${cur.s}, ${cur.e}]</code>：起点 ${cur.s} ${
          boundaryBefore === -Infinity ? '是第一个区间' : `≥ 上一个保留区间的结束点 ${boundaryBefore}`
        } → 不重叠，<strong>保留</strong>它，边界更新为 lastEnd = <strong>${lastEnd}</strong>。`
      }
      steps.push({
        kind: 'process',
        i,
        cur: [cur.s, cur.e],
        action,
        removed,
        boundary: lastEnd === -Infinity ? null : lastEnd,
        statuses: [...statuses],
        msg,
      })
    }
    steps.push({
      kind: 'done',
      removed,
      boundary: lastEnd === -Infinity ? null : lastEnd,
      statuses: [...statuses],
      msg: `扫描结束！一共移除了 <strong>${removed}</strong> 个区间，使剩下的 ${
        intervals.length - removed
      } 个区间互不重叠（互相之间允许首尾相接）。`,
    })
    return { steps, result: removed }
  }

  buildStage(state, el) {
    this.geo = this.#geometry()
    el.innerHTML = `
      <div class="noi__status"></div>
      <div class="noi__chartwrap">${this.#svg()}</div>
    `
    this.statusEl = el.querySelector('.noi__status')
    this.svgEl = el.querySelector('.noi__svg')
    this.bars = [...this.svgEl.querySelectorAll('.noi-bar')]
    this.boundaryLine = this.svgEl.querySelector('.noi-boundary-line')
    this.boundaryLabel = this.svgEl.querySelector('.noi-boundary-label')
  }

  #geometry() {
    const sorted = this._sorted
    const values = sorted.flatMap((x) => [x.s, x.e])
    const lo = Math.min(0, ...values)
    const hi = Math.max(1, ...values)
    const innerW = 580
    const padL = 14
    const scale = innerW / (hi - lo || 1)
    const x = (v) => padL + (v - lo) * scale
    const rowH = 36
    const barH = 22
    const rows = sorted.length
    const titleH = 22
    const chartH = titleH + rows * rowH
    const axisH = 24
    const W = padL + innerW + 14
    const H = chartH + axisH
    return { x, rowH, barH, rows, titleH, chartH, axisH, W, H, lo, hi }
  }

  #svg() {
    const g = this.geo
    const sorted = this._sorted

    let bars = ''
    sorted.forEach((iv, i) => {
      const y = g.titleH + i * g.rowH + (g.rowH - g.barH) / 2
      const bx = g.x(iv.s)
      const bw = Math.max(2, g.x(iv.e) - g.x(iv.s))
      bars += `<rect class="noi-bar" data-i="${i}" x="${bx}" y="${y}" width="${bw}" height="${g.barH}" rx="5"/>`
      bars += `<text class="noi-label" x="${bx + bw / 2}" y="${y - 5}">[${iv.s}, ${iv.e}]</text>`
      bars += `<text class="noi-orig-label" x="${bx + 4}" y="${y + g.barH + 12}">原#${iv.origIdx}</text>`
    })

    const values = sorted.flatMap((x) => [x.s, x.e])
    const ticks = [...new Set(values)].sort((a, b) => a - b)
    const axisY = g.H - 6
    let axis = `<line class="noi-axis-line" x1="${g.x(g.lo)}" y1="${axisY}" x2="${g.x(g.hi)}" y2="${axisY}"/>`
    ticks.forEach((t) => {
      axis += `<line class="noi-tick" x1="${g.x(t)}" y1="${axisY - 4}" x2="${g.x(t)}" y2="${axisY + 4}"/>`
      axis += `<text class="noi-tick-label" x="${g.x(t)}" y="${axisY + 17}">${t}</text>`
    })

    return `<svg class="noi__svg" viewBox="0 0 ${g.W} ${g.H}" preserveAspectRatio="xMidYMid meet" role="img">
      <text class="noi-section-title" x="0" y="14">区间（按结束时间从小到大排序）</text>
      ${bars}
      <line class="noi-boundary-line" x1="0" y1="0" x2="0" y2="${g.chartH}" opacity="0"/>
      <text class="noi-boundary-label" x="0" y="10" opacity="0">边界</text>
      <g class="noi-axis">${axis}</g>
    </svg>`
  }

  renderStep(st) {
    const g = this.geo
    const total = this._sorted.length

    this.statusEl.innerHTML =
      st.kind === 'sort'
        ? `<strong>准备阶段：</strong>先按结束时间排序，再贪心扫描`
        : st.kind === 'done'
          ? `<strong>完成</strong> · 共移除 ${st.removed} 个区间`
          : `<strong>正在处理</strong>第 ${st.i + 1} / ${total} 个区间 · 已移除 ${st.removed} 个`

    const statuses = st.statuses ?? []
    this.bars.forEach((bar, i) => {
      bar.classList.remove('is-current', 'is-keep', 'is-removed', 'is-gold')
      const status = statuses[i] ?? 'pending'
      if (status === 'keep') bar.classList.add(st.kind === 'done' ? 'is-gold' : 'is-keep')
      else if (status === 'removed') bar.classList.add('is-removed')
      if (st.kind === 'process' && i === st.i) bar.classList.add('is-current')
    })

    // 边界线：上一个被保留区间的结束点
    if (st.boundary == null) {
      this.boundaryLine.setAttribute('opacity', '0')
      this.boundaryLabel.setAttribute('opacity', '0')
    } else {
      const bx = g.x(st.boundary)
      this.boundaryLine.setAttribute('x1', bx)
      this.boundaryLine.setAttribute('x2', bx)
      this.boundaryLine.setAttribute('opacity', '1')
      this.boundaryLabel.setAttribute('x', bx)
      this.boundaryLabel.setAttribute('opacity', '1')
      this.boundaryLabel.textContent = `边界 ${st.boundary}`
    }
  }

  resultBanner(result, state) {
    const kept = state.intervals.length - result
    return {
      kind: 'success',
      html: `🎉 最少需要移除 <strong>${result}</strong> 个区间，才能让剩下的 ${kept} 个区间互不重叠。`,
    }
  }
}

export function mountViz(el, opts) {
  return new NonOverlappingViz(el, opts)
}

/*
 * 合并区间「排序 + 扫描」动画。
 *
 * 先把所有区间按起点从小到大排序——排好序后，互相重叠的区间一定会挨在一起。
 * 然后从左到右扫一遍：手里始终攥着「结果列表里最后一段」。
 * 看下一个区间时，只比一件事：它的起点 ≤ 不 ≤ 上一段的终点？
 *   ≤ → 重叠（或刚好挨上），把上一段的终点延长成两者的较大值；
 *   >  → 不重叠，单独开一段新的放进结果列表。
 * 排序 O(n log n)，扫描 O(n)，整体 O(n log n)。
 */
import { VizPlayer } from '../../components/viz-player/vizPlayer.js'

const MAX_N = 10

export class MergeIntervalsViz extends VizPlayer {
  constructor(mountEl) {
    super(mountEl, {
      inputs: [
        {
          key: 'intervals',
          label: '区间数组 intervals（每个区间写 start,end，区间之间用分号分隔）',
          default: '1,3;2,6;8,10;15,18',
          width: '22rem',
        },
      ],
      speed: 1200,
      hint: `提示：可改成你自己的区间，例如 1,4;4,5;7,9，点「应用」重新演示（最多 ${MAX_N} 个区间）。`,
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
      if (si > ei) throw new Error(`区间 [${si},${ei}] 的起点不能大于终点`)
      return [si, ei]
    })
    return { intervals: arr, display: { intervals: arr.map(([s, e]) => `${s},${e}`).join(';') } }
  }

  computeSteps({ intervals }) {
    // 按起点排序（起点相同再按终点排序），保留原始下标方便对照
    const sorted = intervals
      .map((iv, i) => ({ s: iv[0], e: iv[1], origIdx: i }))
      .sort((a, b) => a.s - b.s || a.e - b.e)
    this._sorted = sorted

    const steps = []
    steps.push({
      kind: 'sort',
      msg: `第一步：把 ${intervals.length} 个区间按起点从小到大排序，结果是 ${sorted
        .map((x) => `[${x.s}, ${x.e}]`)
        .join('、')}。排好序后，互相重叠的区间一定挨在一起，只要从左到右扫一遍即可。`,
    })

    const merged = []
    for (let i = 0; i < sorted.length; i++) {
      const cur = sorted[i]
      let action
      let msg
      if (merged.length === 0) {
        merged.push([cur.s, cur.e])
        action = 'new'
        msg = `看 <code>[${cur.s}, ${cur.e}]</code>：结果列表还是空的，直接把它放进去，当作第一段。`
      } else {
        const last = merged[merged.length - 1]
        if (cur.s <= last[1]) {
          const before = last[1]
          const after = Math.max(last[1], cur.e)
          last[1] = after
          action = 'extend'
          msg =
            after > before
              ? `看 <code>[${cur.s}, ${cur.e}]</code>：起点 ${cur.s} ≤ 上一段终点 ${before}，重叠了 → 把上一段延长成 <strong>[${last[0]}, ${after}]</strong>。`
              : `看 <code>[${cur.s}, ${cur.e}]</code>：起点 ${cur.s} ≤ 上一段终点 ${before}，整段都被上一段包住了 → 上一段不变，仍是 <strong>[${last[0]}, ${before}]</strong>。`
        } else {
          merged.push([cur.s, cur.e])
          action = 'new'
          msg = `看 <code>[${cur.s}, ${cur.e}]</code>：起点 ${cur.s} &gt; 上一段终点 ${last[1]}，没有重叠 → 单独开一段新的放进结果列表。`
        }
      }
      steps.push({
        kind: 'process',
        i,
        cur: [cur.s, cur.e],
        merged: merged.map((m) => [...m]),
        action,
        msg,
      })
    }
    this._finalMerged = merged.map((m) => [...m])
    steps.push({
      kind: 'done',
      merged: this._finalMerged,
      msg: `扫描结束！${intervals.length} 个区间合并成了 <strong>${this._finalMerged.length}</strong> 个互不重叠的区间。`,
    })
    return { steps, result: this._finalMerged }
  }

  buildStage(state, el) {
    this.geo = this.#geometry()
    el.innerHTML = `
      <div class="mi__status"></div>
      <div class="mi__chartwrap">${this.#svg()}</div>
    `
    this.statusEl = el.querySelector('.mi__status')
    this.svgEl = el.querySelector('.mi__svg')
    this.topBars = [...this.svgEl.querySelectorAll('.mi-top-bar')]
    this.botBars = [...this.svgEl.querySelectorAll('.mi-bot-bar')]
    this.botLabels = [...this.svgEl.querySelectorAll('.mi-bot-label')]
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
    const rowH = 34
    const barH = 22
    const topRows = sorted.length
    const botRows = Math.max(1, this._finalMerged.length)
    const topTitleH = 22
    const topH = topTitleH + topRows * rowH
    const gap = 26
    const botTitleH = 22
    const botH = botTitleH + botRows * rowH
    const axisH = 24
    const W = padL + innerW + 14
    const H = topH + gap + botH + axisH
    return { x, rowH, barH, topRows, botRows, topTitleH, topH, gap, botTitleH, botH, axisH, W, H, lo, hi }
  }

  #svg() {
    const g = this.geo
    const sorted = this._sorted

    let topBars = ''
    sorted.forEach((iv, i) => {
      const y = g.topTitleH + i * g.rowH + (g.rowH - g.barH) / 2
      const bx = g.x(iv.s)
      const bw = Math.max(2, g.x(iv.e) - g.x(iv.s))
      topBars += `<rect class="mi-top-bar" data-i="${i}" x="${bx}" y="${y}" width="${bw}" height="${g.barH}" rx="5"/>`
      topBars += `<text class="mi-top-label" x="${bx + bw / 2}" y="${y - 5}">[${iv.s}, ${iv.e}]</text>`
      topBars += `<text class="mi-orig-label" x="${bx + 4}" y="${y + g.barH + 12}">原#${iv.origIdx}</text>`
    })

    const botTop = g.topH + g.gap
    let botBars = ''
    for (let i = 0; i < g.botRows; i++) {
      const y = botTop + g.botTitleH + i * g.rowH + (g.rowH - g.barH) / 2
      botBars += `<rect class="mi-bot-bar" data-i="${i}" x="0" y="${y}" width="0" height="${g.barH}" rx="5" opacity="0"/>`
      botBars += `<text class="mi-bot-label" data-i="${i}" x="0" y="${y - 5}"></text>`
    }

    const values = sorted.flatMap((x) => [x.s, x.e])
    const ticks = [...new Set(values)].sort((a, b) => a - b)
    const axisY = g.H - 6
    let axis = `<line class="mi-axis-line" x1="${g.x(g.lo)}" y1="${axisY}" x2="${g.x(g.hi)}" y2="${axisY}"/>`
    ticks.forEach((t) => {
      axis += `<line class="mi-tick" x1="${g.x(t)}" y1="${axisY - 4}" x2="${g.x(t)}" y2="${axisY + 4}"/>`
      axis += `<text class="mi-tick-label" x="${g.x(t)}" y="${axisY + 17}">${t}</text>`
    })

    return `<svg class="mi__svg" viewBox="0 0 ${g.W} ${g.H}" preserveAspectRatio="xMidYMid meet" role="img">
      <text class="mi-section-title" x="0" y="14">排序后区间（按起点从小到大）</text>
      ${topBars}
      <text class="mi-section-title" x="0" y="${botTop + 14}">合并结果（依次生成）</text>
      ${botBars}
      <g class="mi-axis">${axis}</g>
    </svg>`
  }

  renderStep(st) {
    const g = this.geo
    const total = this._sorted.length

    this.statusEl.innerHTML =
      st.kind === 'sort'
        ? `<strong>准备阶段：</strong>先排序，再扫描`
        : st.kind === 'done'
          ? `<strong>完成</strong> · 共合并出 ${st.merged.length} 个区间`
          : `<strong>正在处理</strong>第 ${st.i + 1} / ${total} 个区间`

    // 上半区：排序后的原始区间
    this.topBars.forEach((bar) => {
      const i = Number(bar.dataset.i)
      bar.classList.remove('is-current', 'is-done')
      if (st.kind === 'done' || (st.kind === 'process' && i < st.i)) {
        bar.classList.add('is-done')
      } else if (st.kind === 'process' && i === st.i) {
        bar.classList.add('is-current')
      }
    })

    // 下半区：逐步生成的合并结果
    const mergedNow = st.merged ?? []
    this.botBars.forEach((bar, i) => {
      const label = this.botLabels[i]
      bar.classList.remove('is-grow', 'is-new', 'is-done', 'is-gold')
      if (i >= mergedNow.length) {
        bar.setAttribute('opacity', '0')
        bar.setAttribute('width', '0')
        label.textContent = ''
        return
      }
      const [s, e] = mergedNow[i]
      const bx = g.x(s)
      const bw = Math.max(2, g.x(e) - g.x(s))
      bar.setAttribute('opacity', '1')
      bar.setAttribute('x', bx)
      bar.setAttribute('width', bw)
      label.setAttribute('x', bx + bw / 2)
      label.textContent = `[${s}, ${e}]`
      if (st.kind === 'done') {
        bar.classList.add('is-gold')
      } else if (i === mergedNow.length - 1) {
        bar.classList.add(st.action === 'extend' ? 'is-grow' : 'is-new')
      } else {
        bar.classList.add('is-done')
      }
    })
  }

  resultBanner(result) {
    return {
      kind: 'success',
      html: `🎉 合并结果：<strong>${result
        .map(([s, e]) => `[${s}, ${e}]`)
        .join(', ')}</strong>（共 ${result.length} 个区间）。`,
    }
  }
}

export function mountViz(el, opts) {
  return new MergeIntervalsViz(el, opts)
}

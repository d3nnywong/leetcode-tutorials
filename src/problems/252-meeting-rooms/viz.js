/*
 * 会议室「排序 + 相邻比较」动画。
 *
 * 一个人没法同时出现在两个地方，所以「能不能参加所有会议」等价于
 * 「这些会议时间段里，有没有任意两个互相重叠」。
 * 先把所有会议按开始时间从小到大排序——排好序后，如果存在重叠，
 * 一定会出现在某一对「相邻」的会议之间（不可能隔着别的会议才重叠）。
 * 于是只要从左到右扫一遍，依次比较相邻两个会议：
 * 后一个的开始时间 < 前一个的结束时间 → 冲突，直接判 false；
 * 扫完都没冲突 → true。排序 O(n log n)，扫描 O(n)，整体 O(n log n)。
 */
import { VizPlayer } from '../../components/viz-player/vizPlayer.js'

const MAX_N = 10

export class MeetingRoomsViz extends VizPlayer {
  constructor(mountEl) {
    super(mountEl, {
      inputs: [
        {
          key: 'intervals',
          label: '会议时间数组 intervals（每场会议写 start,end，会议之间用分号分隔）',
          default: '0,30;5,10;15,20',
          width: '22rem',
        },
      ],
      speed: 1200,
      hint: `提示：可改成你自己的会议安排，例如 7,10;2,4，点「应用」重新演示（最多 ${MAX_N} 场会议）。`,
    })
  }

  parseInputs({ intervals }) {
    const raw = (intervals ?? '').trim()
    const parts = raw
      .split(';')
      .map((s) => s.trim())
      .filter((s) => s !== '')
    if (parts.length === 0) throw new Error('请至少输入一场会议')
    if (parts.length > MAX_N) throw new Error(`最多支持 ${MAX_N} 场会议`)
    const arr = parts.map((p) => {
      const nums = p.split(',').map((x) => x.trim())
      if (nums.length !== 2) throw new Error(`「${p}」不是合法的会议时间，应写成 start,end`)
      const s = Number(nums[0])
      const e = Number(nums[1])
      if (!Number.isFinite(s) || !Number.isFinite(e)) throw new Error(`「${p}」包含非法数字`)
      const si = Math.trunc(s)
      const ei = Math.trunc(e)
      if (si >= ei) throw new Error(`会议 [${si},${ei}] 的开始时间必须早于结束时间`)
      return [si, ei]
    })
    return { intervals: arr, display: { intervals: arr.map(([s, e]) => `${s},${e}`).join(';') } }
  }

  computeSteps({ intervals }) {
    // 按开始时间排序，重叠的会议排序后一定挨在一起，保留原始下标方便对照
    const sorted = intervals
      .map((iv, i) => ({ s: iv[0], e: iv[1], origIdx: i }))
      .sort((a, b) => a.s - b.s)
    this._sorted = sorted

    const steps = []
    steps.push({
      kind: 'sort',
      msg: `第一步：把 ${intervals.length} 场会议按开始时间从小到大排序，结果是 ${sorted
        .map((x) => `[${x.s}, ${x.e}]`)
        .join('、')}。排好序后，只要有重叠，一定出现在相邻的两场会议之间。`,
    })

    let conflict = null
    for (let i = 1; i < sorted.length; i++) {
      const prev = sorted[i - 1]
      const cur = sorted[i]
      const overlap = cur.s < prev.e
      steps.push({
        kind: 'compare',
        i,
        prevIdx: i - 1,
        curIdx: i,
        overlap,
        msg: overlap
          ? `比较 <code>[${prev.s}, ${prev.e}]</code> 和 <code>[${cur.s}, ${cur.e}]</code>：后一场的开始时间 ${cur.s} &lt; 前一场的结束时间 ${prev.e} → <strong>冲突了！</strong>同一个人没法同时参加这两场会议。`
          : `比较 <code>[${prev.s}, ${prev.e}]</code> 和 <code>[${cur.s}, ${cur.e}]</code>：后一场的开始时间 ${cur.s} ≥ 前一场的结束时间 ${prev.e} → 不冲突，可以挨着开。`,
      })
      if (overlap) {
        conflict = [i - 1, i]
        break
      }
    }
    this._conflict = conflict

    if (sorted.length <= 1) {
      steps.push({
        kind: 'done',
        conflict: null,
        msg: `只有 ${sorted.length} 场会议，不可能冲突 → <strong>可以</strong>参加所有会议。`,
      })
    } else if (conflict) {
      steps.push({
        kind: 'done',
        conflict,
        msg: `扫描提前结束：发现冲突，<strong>无法</strong>参加所有会议。`,
      })
    } else {
      steps.push({
        kind: 'done',
        conflict: null,
        msg: `相邻会议逐一比较完毕，全程没有冲突 → <strong>可以</strong>参加所有会议。`,
      })
    }

    const result = conflict === null
    return { steps, result }
  }

  buildStage(state, el) {
    this.geo = this.#geometry()
    el.innerHTML = `
      <div class="mr__status"></div>
      <div class="mr__chartwrap">${this.#svg()}</div>
    `
    this.statusEl = el.querySelector('.mr__status')
    this.svgEl = el.querySelector('.mr__svg')
    this.bars = [...this.svgEl.querySelectorAll('.mr-bar')]
    this.zoneEl = this.svgEl.querySelector('.mr-zone')
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

    let zone = `<rect class="mr-zone" x="0" y="0" width="0" height="${g.chartH}" opacity="0"/>`

    let bars = ''
    sorted.forEach((iv, i) => {
      const y = g.titleH + i * g.rowH + (g.rowH - g.barH) / 2
      const bx = g.x(iv.s)
      const bw = Math.max(2, g.x(iv.e) - g.x(iv.s))
      bars += `<rect class="mr-bar" data-i="${i}" x="${bx}" y="${y}" width="${bw}" height="${g.barH}" rx="5"/>`
      bars += `<text class="mr-label" x="${bx + bw / 2}" y="${y - 5}">[${iv.s}, ${iv.e}]</text>`
      bars += `<text class="mr-orig-label" x="${bx + 4}" y="${y + g.barH + 12}">原#${iv.origIdx}</text>`
    })

    const values = sorted.flatMap((x) => [x.s, x.e])
    const ticks = [...new Set(values)].sort((a, b) => a - b)
    const axisY = g.H - 6
    let axis = `<line class="mr-axis-line" x1="${g.x(g.lo)}" y1="${axisY}" x2="${g.x(g.hi)}" y2="${axisY}"/>`
    ticks.forEach((t) => {
      axis += `<line class="mr-tick" x1="${g.x(t)}" y1="${axisY - 4}" x2="${g.x(t)}" y2="${axisY + 4}"/>`
      axis += `<text class="mr-tick-label" x="${g.x(t)}" y="${axisY + 17}">${t}</text>`
    })

    return `<svg class="mr__svg" viewBox="0 0 ${g.W} ${g.H}" preserveAspectRatio="xMidYMid meet" role="img">
      <text class="mr-section-title" x="0" y="14">排序后的会议（按开始时间从小到大）</text>
      ${zone}
      ${bars}
      <g class="mr-axis">${axis}</g>
    </svg>`
  }

  renderStep(st) {
    const g = this.geo
    const sorted = this._sorted
    const total = sorted.length

    this.statusEl.innerHTML =
      st.kind === 'sort'
        ? `<strong>准备阶段：</strong>先排序，再比较相邻会议`
        : st.kind === 'done'
          ? st.conflict
            ? `<strong>完成</strong> · 发现冲突，无法参加所有会议`
            : `<strong>完成</strong> · 没有冲突，可以参加所有会议`
          : `<strong>正在比较</strong>第 ${st.i} / ${total - 1} 对相邻会议`

    // 默认：复位所有条
    this.bars.forEach((bar) => bar.classList.remove('is-checked', 'is-prev', 'is-current', 'is-conflict', 'is-gold'))
    this.zoneEl.setAttribute('opacity', '0')

    if (st.kind === 'compare') {
      // 之前比较过、确认没冲突的会议
      for (let k = 0; k < st.prevIdx; k++) this.bars[k]?.classList.add('is-checked')
      this.bars[st.prevIdx]?.classList.add(st.overlap ? 'is-conflict' : 'is-prev')
      this.bars[st.curIdx]?.classList.add(st.overlap ? 'is-conflict' : 'is-current')
      if (st.overlap) {
        const prev = sorted[st.prevIdx]
        const cur = sorted[st.curIdx]
        const x1 = g.x(cur.s)
        const x2 = g.x(prev.e)
        this.zoneEl.setAttribute('x', Math.min(x1, x2))
        this.zoneEl.setAttribute('width', Math.max(2, Math.abs(x2 - x1)))
        this.zoneEl.setAttribute('opacity', '1')
      }
    } else if (st.kind === 'done') {
      if (st.conflict) {
        const [a, b] = st.conflict
        this.bars.forEach((bar, i) => {
          if (i === a || i === b) bar.classList.add('is-conflict')
          else if (i < a) bar.classList.add('is-checked')
          // i > b：扫描提前结束，这些会议还没轮到，保持默认状态
        })
        const prev = sorted[a]
        const cur = sorted[b]
        const x1 = g.x(cur.s)
        const x2 = g.x(prev.e)
        this.zoneEl.setAttribute('x', Math.min(x1, x2))
        this.zoneEl.setAttribute('width', Math.max(2, Math.abs(x2 - x1)))
        this.zoneEl.setAttribute('opacity', '1')
      } else {
        this.bars.forEach((bar) => bar.classList.add('is-gold'))
      }
    }
  }

  resultBanner(result, state) {
    if (result) {
      return {
        kind: 'success',
        html: `🎉 相邻会议两两都不冲突 → 返回 <strong>true</strong>，这个人可以参加全部 ${state.intervals.length} 场会议。`,
      }
    }
    const [a, b] = this._conflict
    const prev = this._sorted[a]
    const cur = this._sorted[b]
    return {
      kind: 'fail',
      html: `🚫 <code>[${prev.s}, ${prev.e}]</code> 和 <code>[${cur.s}, ${cur.e}]</code> 时间上重叠 → 返回 <strong>false</strong>，没法参加全部会议。`,
    }
  }
}

export function mountViz(el, opts) {
  return new MeetingRoomsViz(el, opts)
}

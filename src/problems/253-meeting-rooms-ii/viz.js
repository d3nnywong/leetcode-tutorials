/*
 * 会议室 II「最小堆（按结束时间）分房间」动画。
 *
 * 先把会议按开始时间从小到大排序，依次处理每场会议：
 * 用一个「最小堆」记录所有正在使用中的房间的「结束时间」，堆顶永远是
 * 最早会空出来的那个房间。轮到一场新会议时，只需要看一眼堆顶：
 *   - 堆顶的结束时间 ≤ 当前会议的开始时间 → 那个房间已经空出来了，直接复用，
 *     把堆顶的结束时间更新成这场会议的结束时间；
 *   - 否则 → 没有空房间，只能新开一间。
 * 房间数量只增不减（复用只是替换堆顶，不会移除房间），扫完整个数组，
 * 堆的大小就是同一时刻最多需要的房间数，也就是答案。
 * 排序 O(n log n)，每场会议堆操作 O(log n)，整体 O(n log n)。
 */
import { VizPlayer } from '../../components/viz-player/vizPlayer.js'

const MAX_N = 10

export class MeetingRoomsIIViz extends VizPlayer {
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
      speed: 1300,
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
      const start = Math.trunc(s)
      const end = Math.trunc(e)
      if (start < 0) throw new Error(`会议 [${start},${end}] 的开始时间不能为负`)
      if (start >= end) throw new Error(`会议 [${start},${end}] 的开始时间必须早于结束时间`)
      return { start, end }
    })
    return {
      intervals: arr,
      display: { intervals: arr.map((iv) => `${iv.start},${iv.end}`).join(';') },
    }
  }

  /* 按开始时间排序，并给每场会议一个字母标签，方便在动画里对照原始输入。 */
  #sortMeetings(intervals) {
    return intervals
      .map((iv, idx) => ({ start: iv.start, end: iv.end, label: String.fromCharCode(65 + idx) }))
      .sort((a, b) => a.start - b.start || a.end - b.end)
  }

  computeSteps({ intervals }) {
    const sorted = this.#sortMeetings(intervals)
    const steps = []
    const rooms = [] // 每个元素 {end, label}：模拟「最小堆」里每个房间当前的结束时间
    const gantt = [] // 已分配房间的会议，用来画甘特图

    for (let i = 0; i < sorted.length; i++) {
      const cur = sorted[i]
      // 在 rooms 里线性找最小结束时间，等价于看一眼最小堆的堆顶
      let candidateIdx = -1
      let candidateEnd = Infinity
      for (let r = 0; r < rooms.length; r++) {
        if (rooms[r].end < candidateEnd) {
          candidateEnd = rooms[r].end
          candidateIdx = r
        }
      }
      const hasRooms = rooms.length > 0
      const reuse = hasRooms && candidateEnd <= cur.start
      let assignedRoom
      let msg

      if (!hasRooms) {
        rooms.push({ end: cur.end, label: cur.label })
        assignedRoom = rooms.length
        msg = `按开始时间排序后处理会议 <strong>${cur.label}</strong> <code>[${cur.start}, ${cur.end})</code>：还没有任何房间，新开第 <strong>${assignedRoom}</strong> 间房，结束时间记为 ${cur.end}。`
      } else if (reuse) {
        rooms[candidateIdx] = { end: cur.end, label: cur.label }
        assignedRoom = candidateIdx + 1
        msg = `处理会议 <strong>${cur.label}</strong> <code>[${cur.start}, ${cur.end})</code>：堆顶（最早空出来）的是房 ${assignedRoom}，${candidateEnd} 点就结束了。<code>${candidateEnd} ≤ ${cur.start}</code> → 可以复用！房 ${assignedRoom} 的结束时间更新为 ${cur.end}。`
      } else {
        rooms.push({ end: cur.end, label: cur.label })
        assignedRoom = rooms.length
        msg = `处理会议 <strong>${cur.label}</strong> <code>[${cur.start}, ${cur.end})</code>：堆顶（最早空出来）的房间要到 ${candidateEnd} 点才空。<code>${candidateEnd} &gt; ${cur.start}</code> → 没有空房间，新开第 <strong>${assignedRoom}</strong> 间房。`
      }

      gantt.push({ label: cur.label, start: cur.start, end: cur.end, room: assignedRoom })
      steps.push({
        i,
        cur,
        hasRooms,
        candidateRoom: hasRooms ? candidateIdx + 1 : null,
        candidateEnd: hasRooms ? candidateEnd : null,
        reuse,
        assignedRoom,
        roomsSnapshot: rooms.map((r) => ({ ...r })),
        ganttSnapshot: gantt.map((g) => ({ ...g })),
        last: i === sorted.length - 1,
        msg,
      })
    }

    const result = rooms.length
    return { steps, result }
  }

  buildStage({ intervals }, el) {
    const sorted = this.#sortMeetings(intervals)
    this.sorted = sorted
    this.geo = this.#geometry(sorted)
    el.innerHTML = `
      <div class="mri__queuelabel">会议队列（按开始时间排好序，从左到右依次处理）</div>
      <div class="mri__queue"></div>
      <div class="mri__chartwrap">${this.#svg(sorted)}</div>
      <div class="mri__roomslabel">房间占用情况（结束时间最早的随时待命复用，相当于最小堆堆顶）</div>
      <div class="mri__rooms"></div>
    `
    this.queueEl = el.querySelector('.mri__queue')
    this.svgEl = el.querySelector('.mri__svg')
    this.roomsEl = el.querySelector('.mri__rooms')

    this.queueEl.innerHTML = sorted
      .map(
        (m, i) =>
          `<span class="mri__chip" data-i="${i}"><b>${m.label}</b><span class="mri__chiprange">[${m.start}, ${m.end})</span></span>`,
      )
      .join('')
    this.chipEls = [...this.queueEl.querySelectorAll('.mri__chip')]

    const g = this.geo
    const lanes = sorted
      .map(
        (_, i) =>
          `<rect class="mri-lane-bg" x="0" y="${i * g.laneH}" width="${g.W}" height="${g.laneH}"/>` +
          `<text class="mri-lane-label" x="4" y="${i * g.laneH + g.laneH / 2 + 4}">房${i + 1}</text>`,
      )
      .join('')
    this.svgEl.querySelector('.mri-lanes').innerHTML = lanes
  }

  #geometry(sorted) {
    const n = sorted.length
    const maxEnd = Math.max(...sorted.map((m) => m.end), 1)
    const laneH = 42
    const padX = 36
    const W = 560
    const H = n * laneH + 8
    const scale = (W - padX - 16) / maxEnd
    return { n, maxEnd, laneH, padX, W, H, scale, x: (t) => padX + t * scale }
  }

  #svg() {
    return `<svg class="mri__svg" viewBox="0 0 ${this.geo.W} ${this.geo.H}" preserveAspectRatio="xMidYMid meet" role="img">
      <g class="mri-lanes"></g>
      <g class="mri-bars"></g>
    </svg>`
  }

  renderStep(st) {
    // 队列：已处理 / 当前 / 待处理
    this.chipEls.forEach((c, idx) => {
      c.className = 'mri__chip'
      if (idx < st.i) c.classList.add('is-done')
      else if (idx === st.i) c.classList.add('is-current')
    })

    // 甘特图：把目前已分配房间的会议逐条画出来
    const g = this.geo
    const bars = st.ganttSnapshot
      .map((item) => {
        const x = g.x(item.start)
        const w = Math.max(3, g.scale * (item.end - item.start))
        const y = (item.room - 1) * g.laneH + 6
        const h = g.laneH - 12
        const isCur = item.label === st.cur.label
        const cls = `mri-bar${isCur ? ' is-current' : ' is-done'}${st.last ? ' is-final' : ''}`
        return `<g class="${cls}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4"></rect><text x="${
          x + w / 2
        }" y="${y + h / 2 + 4}">${item.label}</text></g>`
      })
      .join('')
    this.svgEl.querySelector('.mri-bars').innerHTML = bars

    // 房间面板：标出这一步用到的房间是「复用」还是「新开」
    this.roomsEl.innerHTML = st.roomsSnapshot.length
      ? st.roomsSnapshot
          .map((r, idx) => {
            const roomId = idx + 1
            let cls = 'mri__roomchip'
            if (roomId === st.assignedRoom) cls += st.reuse ? ' is-reuse' : ' is-new'
            return `<span class="${cls}"><b>房 ${roomId}</b><span class="mri__roomend">结束于 ${r.end}（会议 ${r.label}）</span></span>`
          })
          .join('')
      : `<span class="mri__empty">（暂无房间）</span>`
  }

  resultBanner(result) {
    return {
      kind: 'success',
      html: `🎉 同一时刻最多需要 <strong>${result}</strong> 间房间，所以最少要准备 <strong>${result}</strong> 间会议室。`,
    }
  }
}

export function mountViz(el, opts) {
  return new MeetingRoomsIIViz(el, opts)
}

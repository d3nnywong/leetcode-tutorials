/*
 * 删除链表的倒数第 N 个结点「快慢指针 + 虚拟头结点」动画。
 *
 * 链表只能往前走，不能像数组那样直接用下标定位「倒数第几个」。
 * 解法：先加一个虚拟头结点 dummy（防止删的正好是真正的 head 时无处下手），
 * 让 fast 先从 dummy 出发走 n+1 步，这样 fast 与 slow 之间就永远隔着 n+1 个结点；
 * 然后两个指针一起往前走，等 fast 走到链表末尾（null）时，slow 正好停在
 * 「待删除结点」的前一个 —— 直接 slow.next = slow.next.next 摘掉它。
 * 全程只扫一遍链表，O(n) 时间、O(1) 额外空间。
 */
import { VizPlayer } from '../../components/viz-player/vizPlayer.js'

const MAX_N = 10

function describePos(pos, list) {
  if (pos === -1) return 'dummy'
  if (pos === list.length) return 'null'
  return `值 ${list[pos]}（下标 ${pos}）`
}

export class RemoveNthViz extends VizPlayer {
  constructor(mountEl) {
    super(mountEl, {
      inputs: [
        { key: 'list', label: '链表 head（逗号分隔）', default: '1,2,3,4,5', width: '13rem' },
        { key: 'n', label: '倒数第 n 个', default: '2', width: '5rem' },
      ],
      speed: 1100,
      hint: `提示：可改成你自己的链表和 n，点「应用」重新演示（最多 ${MAX_N} 个结点，1 ≤ n ≤ 结点数）。`,
    })
  }

  parseInputs({ list, n }) {
    const arr = (list ?? '')
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s !== '')
      .slice(0, MAX_N)
      .map((s) => {
        const v = Number(s)
        if (!Number.isFinite(v)) throw new Error(`「${s}」不是合法数字`)
        return Math.trunc(v)
      })
    if (arr.length < 1) throw new Error('链表至少要有 1 个结点')
    const nv = Math.trunc(Number(n))
    if (!Number.isFinite(nv) || nv < 1) throw new Error('n 必须是 ≥ 1 的整数')
    if (nv > arr.length) throw new Error(`n 不能超过结点数（当前 ${arr.length} 个结点）`)
    return {
      list: arr,
      n: nv,
      display: { list: arr.join(','), n: String(nv) },
    }
  }

  computeSteps({ list, n }) {
    const len = list.length
    const steps = []

    steps.push({
      phase: 'init',
      fastPos: -1,
      slowPos: -1,
      msg: `创建虚拟头结点 <code>dummy</code>，让 <code>dummy.next = head</code>。fast、slow 都先从 dummy 出发。`,
    })

    const advanceTotal = n + 1
    let fastPos = -1
    const slowPos0 = -1
    for (let i = 1; i <= advanceTotal; i++) {
      fastPos++
      const reachedNull = fastPos === len
      steps.push({
        phase: 'advance',
        fastPos,
        slowPos: slowPos0,
        msg:
          `fast 先单独走第 ${i} / ${advanceTotal} 步 → 指向 ${describePos(fastPos, list)}。` +
          (i === advanceTotal
            ? ` fast 已经比 slow 领先 n + 1 = ${advanceTotal} 步了，接下来两个指针一起走。`
            : '') +
          (reachedNull ? ' （fast 提前到达 null，说明 n 等于链表长度，要删的正是 head。）' : ''),
      })
    }

    let slowPos = slowPos0
    const moveCount = len - n
    for (let i = 1; i <= moveCount; i++) {
      fastPos++
      slowPos++
      const reachedNull = fastPos === len
      steps.push({
        phase: 'move',
        fastPos,
        slowPos,
        msg:
          `fast、slow 一起向前走 1 步：fast → ${describePos(fastPos, list)}，` +
          `slow → ${describePos(slowPos, list)}（两者之间始终隔着 n + 1 个结点）。` +
          (reachedNull ? ' fast 已经走到链表末尾的 null 了！' : ''),
      })
    }

    const removedPos = len - n // slow.next 在原数组里的下标
    steps.push({
      phase: 'remove',
      fastPos,
      slowPos,
      removedPos,
      msg: `fast 已经是 null，slow 正好停在「待删除结点」的前一个。<code>slow.next</code> 就是倒数第
        ${n} 个结点（值 <strong>${list[removedPos]}</strong>）—— 它就是要删除的目标。`,
    })

    steps.push({
      phase: 'done',
      fastPos,
      slowPos,
      removedPos,
      msg: `执行 <code>slow.next = slow.next.next</code>，把值 <strong>${list[removedPos]}</strong>
        的结点从链表里摘掉，返回 <code>dummy.next</code> 作为新的头结点。`,
    })

    const finalList = list.filter((_, i) => i !== removedPos)
    return {
      steps,
      result: { finalList, removedVal: list[removedPos], removedPos, n, original: list },
    }
  }

  buildStage({ list }, el) {
    const len = list.length
    this.len = len
    const g = this.#geometry(len)
    this.geo = g
    el.innerHTML = `
      <div class="rn__stats"></div>
      <div class="rn__chartwrap">${this.#svg(list, g)}</div>
    `
    this.statsEl = el.querySelector('.rn__stats')
    this.svgEl = el.querySelector('.rn__svg')
    this.boxEls = [...this.svgEl.querySelectorAll('.rn-box')]
    this.arrowEls = [...this.svgEl.querySelectorAll('.rn-arrow')]
    this.bypassEl = this.svgEl.querySelector('.rn-bypass')
    this.fastLabelEl = this.svgEl.querySelector('.rn-ptr--fast')
    this.slowLabelEl = this.svgEl.querySelector('.rn-ptr--slow')
    this.fastTickEl = this.svgEl.querySelector('.rn-tick--fast')
    this.slowTickEl = this.svgEl.querySelector('.rn-tick--slow')
  }

  #geometry(len) {
    const slots = len + 2 // dummy(0) + 结点(1..len) + null(len+1)
    const nodeW = 58
    const nodeH = 42
    const gap = 40
    const marginX = 26
    const nodeY = 86
    const slotX = (slot) => marginX + slot * (nodeW + gap)
    const W = slotX(slots - 1) + nodeW + marginX
    const H = 190
    return { slots, nodeW, nodeH, gap, marginX, nodeY, slotX, W, H }
  }

  #svg(list, g) {
    const len = list.length
    let boxes = ''
    for (let slot = 0; slot < g.slots; slot++) {
      const x = g.slotX(slot)
      const cx = x + g.nodeW / 2
      const isDummy = slot === 0
      const isNull = slot === g.slots - 1
      const cls = isDummy ? 'is-dummy' : isNull ? 'is-null' : ''
      const valText = isDummy ? 'dummy' : isNull ? 'null' : String(list[slot - 1])
      const idxText = isDummy || isNull ? '' : String(slot - 1)
      boxes += `<g class="rn-box ${cls}" data-slot="${slot}">
        <rect class="rn-box__rect" x="${x}" y="${g.nodeY}" width="${g.nodeW}" height="${g.nodeH}" rx="8"/>
        <text class="rn-box__val" x="${cx}" y="${g.nodeY + g.nodeH / 2 + 5}">${valText}</text>
        ${idxText !== '' ? `<text class="rn-box__idx" x="${cx}" y="${g.nodeY + g.nodeH + 16}">${idxText}</text>` : ''}
      </g>`
    }
    let arrows = ''
    for (let i = 0; i < g.slots - 1; i++) {
      const x1 = g.slotX(i) + g.nodeW
      const x2 = g.slotX(i + 1)
      const y = g.nodeY + g.nodeH / 2
      arrows += `<line class="rn-arrow" data-edge="${i}" x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" marker-end="url(#rn-arrowhead)"/>`
    }
    const tickY1 = 30
    const tickY2 = g.nodeY - 2
    return `<svg class="rn__svg" viewBox="0 0 ${g.W} ${g.H}" preserveAspectRatio="xMidYMid meet" role="img">
      <defs>
        <marker id="rn-arrowhead" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path class="rn-arrowhead-path" d="M0,0 L6,3 L0,6 Z"/>
        </marker>
      </defs>
      <path class="rn-bypass" d=""/>
      ${arrows}
      ${boxes}
      <line class="rn-tick rn-tick--fast" x1="0" y1="${tickY1 + 12}" x2="0" y2="${tickY2}"/>
      <text class="rn-ptr rn-ptr--fast" x="0" y="${tickY1 + 6}">fast</text>
      <line class="rn-tick rn-tick--slow" x1="0" y1="${tickY1 + 30}" x2="0" y2="${tickY2}"/>
      <text class="rn-ptr rn-ptr--slow" x="0" y="${tickY1 + 24}">slow</text>
    </svg>`
  }

  renderStep(st, { state }) {
    const g = this.geo
    const len = state.list.length
    const removedPos = st.removedPos ?? null
    const removedSlot = removedPos == null ? -1 : removedPos + 1

    // 统计行
    this.statsEl.innerHTML =
      `<span>倒数第 <strong>${state.n}</strong> 个</span>` +
      `<span>fast → <strong>${describePos(st.fastPos, state.list)}</strong></span>` +
      `<span>slow → <strong>${describePos(st.slowPos, state.list)}</strong></span>`

    // 结点框
    this.boxEls.forEach((box) => {
      const slot = Number(box.dataset.slot)
      box.classList.remove('is-fast', 'is-slow', 'is-removed', 'is-target')
      if (st.phase === 'done' && slot === removedSlot) {
        box.classList.add('is-removed')
        return
      }
      if (st.phase === 'remove' && slot === removedSlot) box.classList.add('is-target')
      if (slot === st.fastPos + 1) box.classList.add('is-fast')
      if (slot === st.slowPos + 1) box.classList.add('is-slow')
    })

    // 箭头：删除完成后，slow→被删结点、被删结点→下一个 这两条边变虚
    const cutEdges = st.phase === 'done' ? new Set([removedPos, removedPos + 1]) : new Set()
    this.arrowEls.forEach((line) => {
      const edge = Number(line.dataset.edge)
      line.classList.toggle('is-cut', cutEdges.has(edge))
    })

    // 旁路箭头（slow 直接指向 slow.next.next）
    if (st.phase === 'done') {
      const fromSlot = st.slowPos + 1
      const toSlot = removedSlot + 1
      const x1 = g.slotX(fromSlot) + g.nodeW / 2
      const x2 = g.slotX(toSlot) + g.nodeW / 2
      const y = g.nodeY - 6
      const midX = (x1 + x2) / 2
      const arcY = g.nodeY - 34
      this.bypassEl.setAttribute('d', `M${x1},${y} Q${midX},${arcY} ${x2},${y}`)
      this.bypassEl.classList.add('is-visible')
    } else {
      this.bypassEl.classList.remove('is-visible')
      this.bypassEl.setAttribute('d', '')
    }

    // 指针标签位置
    const fastSlot = st.fastPos + 1
    const slowSlot = st.slowPos + 1
    const fastCx = g.slotX(fastSlot) + g.nodeW / 2
    const slowCx = g.slotX(slowSlot) + g.nodeW / 2
    this.fastLabelEl.setAttribute('x', fastCx)
    this.fastTickEl.setAttribute('x1', fastCx)
    this.fastTickEl.setAttribute('x2', fastCx)
    this.slowLabelEl.setAttribute('x', slowCx)
    this.slowTickEl.setAttribute('x1', slowCx)
    this.slowTickEl.setAttribute('x2', slowCx)
  }

  resultBanner(result) {
    const { finalList, removedVal, n } = result
    return {
      kind: 'success',
      html: `🎉 删除了倒数第 ${n} 个结点（值 <strong>${removedVal}</strong>），剩下的链表是
        <code>[${finalList.join(', ')}]</code>。`,
    }
  }
}

export function mountViz(el, opts) {
  return new RemoveNthViz(el, opts)
}

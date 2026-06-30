/*
 * 环形链表「快慢指针（Floyd 判圈）」动画。
 *
 * 慢指针 slow 每次走一步，快指针 fast 每次走两步，两个指针从头节点一起出发。
 * 如果链表没有环，fast 会先于 slow 顺着 next 走到 null，循环结束，返回 false。
 * 如果链表有环，fast 在环里跑得比 slow 快，迟早会从后面追上 slow——
 * 一旦 slow === fast，就说明两者在同一个节点相遇，链表有环，返回 true。
 * 全程只用了两个指针、O(1) 额外空间，扫描最多 O(n) 步。
 */
import { VizPlayer } from '../../components/viz-player/vizPlayer.js'

const MAX_N = 10

// 给定「最后一个节点指向下标 pos（或 -1 表示 null）」的规则，算出节点 i 的下一个节点下标。
function nextOf(i, n, pos) {
  if (i === -1) return -1
  if (i === n - 1) return pos
  return i + 1
}

export class LinkedListCycleViz extends VizPlayer {
  constructor(mountEl) {
    super(mountEl, {
      inputs: [
        { key: 'list', label: '节点值 head（逗号分隔）', default: '3,2,0,-4', width: '13rem' },
        { key: 'pos', label: '尾节点 next 指向的下标 pos（-1 = 无环）', default: '1', width: '8rem' },
      ],
      speed: 1100,
      hint: `提示：pos 是题目内部用来「造环」的下标（-1 表示不成环），不是传给函数的参数。最多 ${MAX_N} 个节点。`,
    })
  }

  parseInputs({ list, pos }) {
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
    const n = arr.length
    let p = pos === '' || pos == null ? -1 : Math.trunc(Number(pos))
    if (!Number.isFinite(p)) throw new Error('pos 不是合法整数')
    if (n === 0) {
      if (p !== -1) throw new Error('空链表时 pos 必须是 -1')
    } else if (p !== -1 && (p < 0 || p >= n)) {
      throw new Error(`pos 必须是 -1，或者 0 ~ ${n - 1} 之间的下标`)
    }
    return { list: arr, pos: p, display: { list: arr.join(','), pos: String(p) } }
  }

  computeSteps({ list, pos }) {
    const n = list.length
    const steps = []

    if (n === 0) {
      steps.push({
        slow: -1,
        fast: -1,
        phase: 'empty',
        msg: '链表为空（0 个节点），没有节点可以构成环，直接返回 <strong>false</strong>。',
      })
      return { steps, result: { hasCycle: false, meetAt: -1 } }
    }

    let slow = 0
    let fast = 0
    steps.push({
      slow,
      fast,
      phase: 'init',
      msg: `初始化：慢指针 <strong>slow</strong> 和快指针 <strong>fast</strong> 都指向头节点（下标 0，值 ${list[0]}）。`,
    })

    let hasCycle = false
    const guard = 2 * n + 5 // 安全上限，避免逻辑意外死循环
    for (let step = 0; step < guard; step++) {
      if (fast === -1 || nextOf(fast, n, pos) === -1) {
        steps.push({
          slow,
          fast,
          phase: 'null',
          msg: `快指针 fast ${
            fast === -1 ? '已经走到了' : '再走一步就会到'
          } <code>null</code>（链表到头了，没有更多节点）→ 循环结束，链表<strong>没有环</strong>。`,
        })
        break
      }
      slow = nextOf(slow, n, pos)
      fast = nextOf(nextOf(fast, n, pos), n, pos)
      if (slow === fast) {
        hasCycle = true
        steps.push({
          slow,
          fast,
          phase: 'meet',
          msg: `slow 走一步到下标 <strong>${slow}</strong>（值 ${list[slow]}），fast 走两步也到下标 <strong>${fast}</strong>（值 ${list[fast]}）—— <strong>slow === fast，两者相遇！</strong>链表有环。`,
        })
        break
      }
      steps.push({
        slow,
        fast,
        phase: 'move',
        msg: `slow 走一步到下标 <strong>${slow}</strong>（值 ${list[slow]}）；fast 走两步到下标 <strong>${fast}</strong>（值 ${list[fast]}）。slow ≠ fast，继续追。`,
      })
    }

    const result = { hasCycle, meetAt: hasCycle ? slow : -1 }
    return { steps, result }
  }

  buildStage({ list, pos }, el) {
    if (list.length === 0) {
      el.innerHTML = `<div class="ll__empty">链表为空，没有节点可画。</div>`
      this.svgEl = null
      return
    }
    this.geo = this.#geometry(list.length, pos)
    el.innerHTML = `<div class="ll__chartwrap">${this.#svg(list, pos)}</div>`
    this.svgEl = el.querySelector('.ll__svg')
  }

  #geometry(n, pos) {
    const nodeR = 22
    const gap = 88
    const marginX = 50
    const rowY = 150
    const nullGap = pos === -1 ? 90 : 0
    const width = marginX * 2 + (n - 1) * gap + nullGap
    const height = 230
    const center = (i) => marginX + i * gap
    const nullX = marginX + (n - 1) * gap + 78
    return { n, pos, nodeR, gap, marginX, rowY, width, height, center, nullX }
  }

  #svg(list, pos) {
    const g = this.geo
    const n = list.length
    let nodes = `<text class="ll-head" x="${g.center(0)}" y="${g.rowY - g.nodeR - 30}">head</text>`
    let edges = ''

    for (let i = 0; i < n; i++) {
      const cx = g.center(i)
      nodes += `<g class="ll-node" data-i="${i}">
        <circle cx="${cx}" cy="${g.rowY}" r="${g.nodeR}"/>
        <text class="ll-val" x="${cx}" y="${g.rowY + 5}">${list[i]}</text>
        <text class="ll-idx" x="${cx}" y="${g.rowY + g.nodeR + 18}">#${i}</text>
      </g>`
      if (i < n - 1) {
        const x1 = cx + g.nodeR
        const x2 = g.center(i + 1) - g.nodeR
        edges += `<line class="ll-edge" x1="${x1}" y1="${g.rowY}" x2="${x2}" y2="${g.rowY}" marker-end="url(#ll-arrow)"/>`
      }
    }

    if (pos === -1) {
      const x1 = g.center(n - 1) + g.nodeR
      const x2 = g.nullX - 26
      edges += `<line class="ll-edge" x1="${x1}" y1="${g.rowY}" x2="${x2}" y2="${g.rowY}" marker-end="url(#ll-arrow)"/>`
      nodes += `<g class="ll-null">
        <rect x="${g.nullX - 26}" y="${g.rowY - 16}" width="52" height="32" rx="8"/>
        <text x="${g.nullX}" y="${g.rowY + 5}">null</text>
      </g>`
    } else {
      const x1 = g.center(n - 1)
      const x2 = g.center(pos)
      const topY = g.rowY - g.nodeR
      const ctrlY = g.rowY - 110
      edges += `<path class="ll-edge ll-edge--cycle" d="M ${x1} ${topY} C ${x1} ${ctrlY}, ${x2} ${ctrlY}, ${x2} ${topY}" marker-end="url(#ll-arrow-gold)"/>`
    }

    return `<svg class="ll__svg" viewBox="0 0 ${g.width} ${g.height}" preserveAspectRatio="xMidYMid meet" role="img">
      <defs>
        <marker id="ll-arrow" markerWidth="9" markerHeight="9" refX="7" refY="3.5" orient="auto">
          <path class="ll-arrowhead" d="M0,0 L7,3.5 L0,7 Z"/>
        </marker>
        <marker id="ll-arrow-gold" markerWidth="9" markerHeight="9" refX="7" refY="3.5" orient="auto">
          <path class="ll-arrowhead ll-arrowhead--gold" d="M0,0 L7,3.5 L0,7 Z"/>
        </marker>
      </defs>
      ${edges}
      ${nodes}
      <g class="ll-ptrs"></g>
    </svg>`
  }

  renderStep(st) {
    if (!this.svgEl) return
    const g = this.geo

    this.svgEl
      .querySelectorAll('.ll-node')
      .forEach((node) => node.classList.remove('is-slow', 'is-fast', 'is-meet'))

    const isMeet = st.phase === 'meet'
    if (isMeet) {
      this.svgEl.querySelector(`.ll-node[data-i="${st.slow}"]`)?.classList.add('is-meet')
    } else {
      if (st.slow !== -1) this.svgEl.querySelector(`.ll-node[data-i="${st.slow}"]`)?.classList.add('is-slow')
      if (st.fast !== -1) this.svgEl.querySelector(`.ll-node[data-i="${st.fast}"]`)?.classList.add('is-fast')
    }

    const slowX = st.slow === -1 ? g.nullX : g.center(st.slow)
    const fastX = st.fast === -1 ? g.nullX : g.center(st.fast)
    const same = st.slow === st.fast && st.slow !== -1
    const ptrY = g.rowY - g.nodeR - 10

    let ptrsHtml = ''
    if (isMeet) {
      ptrsHtml = `<text class="ll-ptr ll-ptr--meet" x="${slowX}" y="${ptrY}">S·F 相遇</text>`
    } else {
      const sx = same ? slowX - 18 : slowX
      const fx = same ? fastX + 18 : fastX
      ptrsHtml += `<text class="ll-ptr ll-ptr--slow" x="${sx}" y="${ptrY}">S</text>`
      ptrsHtml += `<text class="ll-ptr ll-ptr--fast" x="${fx}" y="${ptrY}">F</text>`
    }
    const ptrsEl = this.svgEl.querySelector('.ll-ptrs')
    if (ptrsEl) ptrsEl.innerHTML = ptrsHtml
  }

  resultBanner(result, state) {
    if (state.list.length === 0) {
      return {
        kind: 'info',
        html: '链表为空，没有节点，自然没有环 → 返回 <strong>false</strong>。',
      }
    }
    if (result.hasCycle) {
      return {
        kind: 'success',
        html: `🎉 慢指针与快指针在下标 <strong>${result.meetAt}</strong>（值 ${state.list[result.meetAt]}）相遇 → 链表<strong>有环</strong>，返回 <strong>true</strong>。`,
      }
    }
    return {
      kind: 'fail',
      html: '🚫 快指针顺着 next 一路走到了 <code>null</code>（到达链表尾部）→ 链表<strong>没有环</strong>，返回 <strong>false</strong>。',
    }
  }
}

export function mountViz(el, opts) {
  return new LinkedListCycleViz(el, opts)
}

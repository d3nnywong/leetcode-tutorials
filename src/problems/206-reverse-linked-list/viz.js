/*
 * 反转链表「prev / cur 双指针迭代」动画。
 *
 * 链表只能往前走，没法像数组那样直接交换位置；要反转，本质是把每个结点的
 * next 指针「掉头」，让它指向自己原来的前一个结点。
 * 用两个指针 prev、cur 从头开始往后扫：每到一个结点 cur，先用 next 暂存
 * cur.next（不然指针改完就找不到下一个结点了），再把 cur.next 指向 prev，
 * 最后 prev、cur 一起前移一位，直到 cur 走到链表末尾（null）。
 * 此时 prev 正好停在原来的最后一个结点上 —— 它就是反转后的新头结点。
 * 全程只扫一遍链表，O(n) 时间、O(1) 额外空间。
 *
 * 动画里把链表画成一排格子，左边多一个虚的 null 格、右边也多一个虚的 null
 * 格；每个结点和「它的 next 指向哪个格子」之间画一条箭头。反转过程就是
 * 看着箭头一根根从「指向右边」掉头变成「指向左边」。
 */
import { VizPlayer } from '../../components/viz-player/vizPlayer.js'

const MAX_N = 9

export class ReverseListViz extends VizPlayer {
  constructor(mountEl) {
    super(mountEl, {
      inputs: [{ key: 'list', label: '链表 head（逗号分隔，留空表示空链表）', default: '1,2,3,4,5', width: '14rem' }],
      speed: 1100,
      hint: `提示：可改成你自己的链表，点「应用」重新演示（最多 ${MAX_N} 个结点，留空表示空链表）。`,
    })
  }

  parseInputs({ list }) {
    const raw = (list ?? '').trim()
    if (raw === '') return { list: [], display: { list: '' } }
    const arr = raw
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s !== '')
      .slice(0, MAX_N)
      .map((s) => {
        const v = Number(s)
        if (!Number.isFinite(v)) throw new Error(`「${s}」不是合法数字`)
        return Math.trunc(v)
      })
    return { list: arr, display: { list: arr.join(',') } }
  }

  computeSteps({ list }) {
    const len = list.length
    const steps = []
    // gaps[g] 表示「第 g 条缝」的状态：连接 slot g 与 slot g+1（slot 0 = 左边的 null，
    // slot 1..len = 结点 0..len-1，slot len+1 = 右边的 null）。
    // 'forward'：还没反转，箭头从左指向右（原始 next）；
    // 'backward'：已经反转，箭头从右指向左（新 next）；
    // 'none'：这条缝上暂时没有箭头。
    const gaps = new Array(len + 1).fill(len === 0 ? 'none' : 'forward')
    if (len > 0) gaps[0] = 'none'

    steps.push({
      phase: 'init',
      prevSlot: 0,
      curSlot: 1,
      gaps: [...gaps],
      msg:
        len === 0
          ? `链表本身就是空的（<code>head = null</code>），不需要反转，直接返回 <code>null</code>。`
          : `初始化两个指针：<code>prev = null</code>，<code>cur = head</code>（指向值为
             <strong>${list[0]}</strong> 的第一个结点）。接下来从头到尾扫一遍，把每个结点的
             <code>next</code> 指针逐个掉头。`,
    })

    for (let i = 0; i < len; i++) {
      const nextVal = i + 1 < len ? list[i + 1] : null
      gaps[i] = 'backward'
      gaps[i + 1] = 'none'
      const prevSlot = i + 1
      const curSlot = i + 2
      steps.push({
        phase: 'reverse',
        i,
        prevSlot,
        curSlot,
        gaps: [...gaps],
        msg:
          `第 ${i + 1} 步：处理值为 <strong>${list[i]}</strong> 的结点 —— 先用 <code>next</code> 暂存
           <code>cur.next</code>（${nextVal == null ? 'null' : '值 ' + nextVal}），再执行
           <code>cur.next = prev</code> 把箭头掉头指向 ${
             i === 0 ? 'null' : '值 ' + list[i - 1]
           }，最后 <code>prev = cur</code>、<code>cur = next</code> 一起前移一位。` +
          (i === len - 1 ? ` 现在 <code>cur</code> 变成了 <code>null</code>，循环结束。` : ''),
      })
    }

    const result = [...list].reverse()
    return { steps, result }
  }

  buildStage({ list }, el) {
    const len = list.length
    this.len = len
    const g = this.#geometry(len)
    this.geo = g
    el.innerHTML = `
      <div class="rlv__stats"></div>
      <div class="rlv__chartwrap">${this.#svg(list, g)}</div>
    `
    this.statsEl = el.querySelector('.rlv__stats')
    this.svgEl = el.querySelector('.rlv__svg')
    this.boxEls = [...this.svgEl.querySelectorAll('.rlv-box')]
    this.arrowEls = [...this.svgEl.querySelectorAll('.rlv-arrow')]
    this.prevLabelEl = this.svgEl.querySelector('.rlv-ptr--prev')
    this.curLabelEl = this.svgEl.querySelector('.rlv-ptr--cur')
    this.prevTickEl = this.svgEl.querySelector('.rlv-tick--prev')
    this.curTickEl = this.svgEl.querySelector('.rlv-tick--cur')
  }

  #geometry(len) {
    const slots = len + 2 // 左 null(0) + 结点(1..len) + 右 null(len+1)
    const nodeW = 58
    const nodeH = 42
    const gap = 46
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
      const isNullL = slot === 0
      const isNullR = slot === g.slots - 1
      const cls = isNullL || isNullR ? 'is-null' : ''
      const valText = isNullL || isNullR ? 'null' : String(list[slot - 1])
      const idxText = isNullL || isNullR ? '' : String(slot - 1)
      boxes += `<g class="rlv-box ${cls}" data-slot="${slot}">
        <rect class="rlv-box__rect" x="${x}" y="${g.nodeY}" width="${g.nodeW}" height="${g.nodeH}" rx="8"/>
        <text class="rlv-box__val" x="${cx}" y="${g.nodeY + g.nodeH / 2 + 5}">${valText}</text>
        ${idxText !== '' ? `<text class="rlv-box__idx" x="${cx}" y="${g.nodeY + g.nodeH + 16}">${idxText}</text>` : ''}
      </g>`
    }
    let arrows = ''
    for (let gap = 0; gap < g.slots - 1; gap++) {
      const x1 = g.slotX(gap) + g.nodeW
      const x2 = g.slotX(gap + 1)
      const y = g.nodeY + g.nodeH / 2
      arrows += `<line class="rlv-arrow" data-gap="${gap}" x1="${x1}" y1="${y}" x2="${x2}" y2="${y}"/>`
    }
    const tickY1 = 30
    const tickY2 = g.nodeY - 2
    return `<svg class="rlv__svg" viewBox="0 0 ${g.W} ${g.H}" preserveAspectRatio="xMidYMid meet" role="img">
      <defs>
        <marker id="rlv-arrow-fwd" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto-start-reverse">
          <path class="rlv-arrowhead-path rlv-arrowhead-path--fwd" d="M0,0 L6,3 L0,6 Z"/>
        </marker>
        <marker id="rlv-arrow-bwd" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto-start-reverse">
          <path class="rlv-arrowhead-path rlv-arrowhead-path--bwd" d="M0,0 L6,3 L0,6 Z"/>
        </marker>
        <marker id="rlv-arrow-gold" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto-start-reverse">
          <path class="rlv-arrowhead-path rlv-arrowhead-path--gold" d="M0,0 L6,3 L0,6 Z"/>
        </marker>
      </defs>
      ${arrows}
      ${boxes}
      <line class="rlv-tick rlv-tick--prev" x1="0" y1="${tickY1 + 12}" x2="0" y2="${tickY2}"/>
      <text class="rlv-ptr rlv-ptr--prev" x="0" y="${tickY1 + 6}">prev</text>
      <line class="rlv-tick rlv-tick--cur" x1="0" y1="${tickY1 + 30}" x2="0" y2="${tickY2}"/>
      <text class="rlv-ptr rlv-ptr--cur" x="0" y="${tickY1 + 24}">cur</text>
    </svg>`
  }

  renderStep(st, { state }) {
    const g = this.geo
    const len = state.list.length

    this.statsEl.innerHTML =
      len === 0
        ? `<span>空链表，无需反转</span>`
        : `<span>prev → <strong>${st.prevSlot === 0 ? 'null' : '值 ' + state.list[st.prevSlot - 1]}</strong></span>` +
          `<span>cur → <strong>${
            st.curSlot >= g.slots - 1 ? 'null' : '值 ' + state.list[st.curSlot - 1]
          }</strong></span>`

    // 结点框：标记 prev / cur，以及「已反转」的结点
    this.boxEls.forEach((box) => {
      const slot = Number(box.dataset.slot)
      box.classList.remove('is-prev', 'is-cur', 'is-reversed')
      const isRealNode = slot >= 1 && slot <= len
      if (isRealNode && slot <= st.prevSlot) box.classList.add('is-reversed')
      if (slot === st.prevSlot) box.classList.add('is-prev')
      if (slot === st.curSlot) box.classList.add('is-cur')
    })

    // 箭头：forward(原始指向右) / backward(已反转指向左) / none(暂无箭头)。
    // marker 是被「引用」渲染的，不是 line 的 DOM 子节点，没法靠 CSS 后代选择器
    // 给箭头三角形上色，所以这里按状态直接切换 line 引用的 marker-id。
    const gaps = st.gaps ?? []
    this.arrowEls.forEach((line) => {
      const gap = Number(line.dataset.gap)
      const dir = gaps[gap] ?? 'none'
      const justFlipped = dir === 'backward' && gap === st.i
      line.classList.toggle('is-forward', dir === 'forward')
      line.classList.toggle('is-backward', dir === 'backward')
      line.classList.toggle('is-none', dir === 'none')
      line.classList.toggle('is-justflipped', justFlipped)
      line.style.markerStart = dir === 'backward' ? `url(#${justFlipped ? 'rlv-arrow-gold' : 'rlv-arrow-bwd'})` : ''
      line.style.markerEnd = dir === 'forward' ? 'url(#rlv-arrow-fwd)' : ''
    })

    // 指针标签位置
    const prevCx = g.slotX(st.prevSlot) + g.nodeW / 2
    const curCx = g.slotX(Math.min(st.curSlot, g.slots - 1)) + g.nodeW / 2
    this.prevLabelEl.setAttribute('x', prevCx)
    this.prevTickEl.setAttribute('x1', prevCx)
    this.prevTickEl.setAttribute('x2', prevCx)
    this.curLabelEl.setAttribute('x', curCx)
    this.curTickEl.setAttribute('x1', curCx)
    this.curTickEl.setAttribute('x2', curCx)
  }

  resultBanner(result) {
    if (result.length === 0) {
      return { kind: 'info', html: `链表为空，反转后仍然是 <code>[]</code>。` }
    }
    return {
      kind: 'success',
      html: `🎉 反转完成！新的头结点是值 <strong>${result[0]}</strong>，整条链表变成
        <code>[${result.join(', ')}]</code>。`,
    }
  }
}

export function mountViz(el, opts) {
  return new ReverseListViz(el, opts)
}

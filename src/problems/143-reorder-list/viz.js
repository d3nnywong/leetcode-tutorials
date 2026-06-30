/*
 * 重排链表「快慢指针找中点 + 反转后半段 + 首尾交替合并」动画。
 *
 * 整道题拆成三步，全程只用几个指针、O(1) 额外空间：
 *   ① 用快慢指针找到链表中点，把链表从中点切成前后两段；
 *   ② 把后半段原地反转（这样后半段就变成「从尾到头」的顺序）；
 *   ③ 让两个指针 p1（前半段头）、p2（反转后的后半段头）交替往 first 链表上接，
 *      就拼出了 L0 → Ln → L1 → Ln-1 → … 的效果。
 *
 * 动画里用一个长度为 n 的 next[] 数组模拟「每个结点的 next 指针指向谁」（-1 表示 null），
 * 每一步只改 next[] 里的一两个格子，舞台上的结点框位置始终不变，
 * 箭头则根据当前 next[] 实时重画——这样能完整还原真实算法里指针的每一次改写。
 */
import { VizPlayer } from '../../components/viz-player/vizPlayer.js'

const MAX_N = 9

function desc(idx, vals) {
  return idx === -1 ? 'null' : `值 ${vals[idx]}`
}

const PHASE_LABEL = {
  intro: '准备',
  findMid: '① 找中点',
  split: '① 拆成两段',
  reverseInit: '② 反转后半段',
  reverseStep: '② 反转后半段',
  reverseDone: '② 反转完成',
  mergeInit: '③ 交替合并',
  mergeStep: '③ 交替合并',
  onlyOne: '完成（只有 1 个结点）',
  done: '✅ 完成',
}

export class ReorderListViz extends VizPlayer {
  constructor(mountEl) {
    super(mountEl, {
      inputs: [{ key: 'list', label: '链表 head（逗号分隔）', default: '1,2,3,4,5', width: '14rem' }],
      speed: 1100,
      hint: `提示：可改成你自己的链表，点「应用」重新演示（最多 ${MAX_N} 个结点，数值不要求各不相同）。`,
    })
  }

  parseInputs({ list }) {
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
    return { vals: arr, display: { list: arr.join(',') } }
  }

  computeSteps({ vals }) {
    const n = vals.length
    const next = vals.map((_, i) => (i + 1 < n ? i + 1 : -1))
    const steps = []
    const push = (st) => steps.push({ secondHead: -1, a: -1, b: -1, labelA: '', labelB: '', ...st, next: next.slice() })

    push({
      phase: 'intro',
      msg: `链表有 ${n} 个结点：${vals.join(' → ')}。目标是重排成 L0 → Ln → L1 → Ln-1 → …
        这种「头尾交替」的顺序。整体分三步：<strong>① 找中点</strong> →
        <strong>② 反转后半段</strong> → <strong>③ 头尾交替合并</strong>。`,
    })

    // ① 快慢指针找中点
    let slow = 0
    let fast = 0
    push({
      phase: 'findMid',
      a: fast,
      b: slow,
      labelA: 'fast',
      labelB: 'slow',
      msg: `① 找中点：slow、fast 都从头结点（${desc(0, vals)}）出发。`,
    })
    while (next[fast] !== -1 && next[next[fast]] !== -1) {
      slow = next[slow]
      fast = next[next[fast]]
      push({
        phase: 'findMid',
        a: fast,
        b: slow,
        labelA: 'fast',
        labelB: 'slow',
        msg: `fast 一次走 2 步，slow 一次走 1 步：fast → ${desc(fast, vals)}，slow → ${desc(slow, vals)}。`,
      })
    }

    const secondHead = next[slow]
    const firstVals = vals.slice(0, slow + 1)
    const secondVals = secondHead === -1 ? [] : vals.slice(secondHead)
    next[slow] = -1
    push({
      phase: 'split',
      a: -1,
      b: slow,
      labelB: 'slow',
      secondHead,
      msg:
        secondHead === -1
          ? `fast 一步就跨到了链表末尾，说明只有 1 个结点——不需要拆分、反转或合并，重排后还是它自己。`
          : `fast 已经到达（或越过）链表末尾，slow 正好停在前半段最后一个结点（${desc(
              slow,
              vals,
            )}）。断开 <code>slow.next</code>，链表被切成两段：
             前半段 <strong>${firstVals.join(' → ')}</strong>，
             后半段 <strong>${secondVals.join(' → ')}</strong>。`,
    })

    if (secondHead !== -1) {
      // ② 反转后半段
      let prev = -1
      let cur = secondHead
      push({
        phase: 'reverseInit',
        a: cur,
        b: prev,
        labelA: 'cur',
        labelB: 'prev',
        secondHead,
        msg: `② 反转后半段：prev 指向 null，cur 指向后半段头结点（${desc(cur, vals)}）。`,
      })
      while (cur !== -1) {
        const nxt = next[cur]
        const movedVal = vals[cur]
        next[cur] = prev
        prev = cur
        cur = nxt
        push({
          phase: 'reverseStep',
          a: cur,
          b: prev,
          labelA: 'cur',
          labelB: 'prev',
          secondHead,
          msg:
            `把值 ${movedVal} 的 <code>next</code> 改指向 ${desc(next[prev], vals)}` +
            ` —— 也就是反过来指向 prev。prev 移到 ${desc(prev, vals)}` +
            (cur === -1 ? `，cur 变成 null，反转完成！` : `，cur 移到 ${desc(cur, vals)}。`),
        })
      }
      push({
        phase: 'reverseDone',
        a: -1,
        b: prev,
        labelB: 'newHead',
        secondHead,
        msg: `后半段反转完成，新的头结点是 ${desc(prev, vals)}：${[...secondVals].reverse().join(' → ')}。`,
      })

      // ③ 头尾交替合并
      let p1 = 0
      let p2 = prev
      push({
        phase: 'mergeInit',
        a: p2,
        b: p1,
        labelA: 'p2',
        labelB: 'p1',
        secondHead,
        msg: `③ 交替合并：p1 指向前半段头（${desc(p1, vals)}），p2 指向反转后的后半段头（${desc(p2, vals)}）。`,
      })
      while (p2 !== -1) {
        const n1 = next[p1]
        const n2 = next[p2]
        next[p1] = p2
        if (n1 === -1) {
          push({
            phase: 'mergeStep',
            a: -1,
            b: p1,
            labelB: 'p1',
            secondHead,
            msg: `<code>p1.next = p2</code>，把 ${desc(p2, vals)} 接到 ${desc(p1, vals)} 后面。
              前半段已经用完，合并到此结束。`,
          })
          break
        }
        next[p2] = n1
        p1 = n1
        p2 = n2
        push({
          phase: 'mergeStep',
          a: p2,
          b: p1,
          labelA: 'p2',
          labelB: 'p1',
          secondHead,
          msg: `先接 <code>p1.next = p2</code>，再接 <code>p2.next</code> 回到原来 p1 的下一个结点，
            然后 p1、p2 各自前移一格：p1 → ${desc(p1, vals)}，p2 → ${desc(p2, vals)}。`,
        })
      }
    }

    // 最终结点顺序
    const order = []
    {
      let cur = 0
      let guard = 0
      while (cur !== -1 && guard++ <= n) {
        order.push(cur)
        cur = next[cur]
      }
    }
    const resultVals = order.map((i) => vals[i])

    push({
      phase: secondHead === -1 ? 'onlyOne' : 'done',
      a: -1,
      b: -1,
      secondHead,
      msg:
        secondHead === -1
          ? `链表只有 1 个结点，重排后还是 <strong>${resultVals.join(' → ')}</strong>。`
          : `合并完成！最终顺序是 <strong>${resultVals.join(' → ')}</strong>，
             正好就是 L0 → Ln → L1 → Ln-1 → … 的交替顺序。`,
    })

    // 标出每一步相对上一步变化了哪些 next 指针，方便高亮
    for (let i = 1; i < steps.length; i++) {
      const prevNext = steps[i - 1].next
      const curNext = steps[i].next
      steps[i].changed = curNext.reduce((acc, v, k) => {
        if (v !== prevNext[k]) acc.push(k)
        return acc
      }, [])
    }

    return { steps, result: { vals, resultVals, order } }
  }

  buildStage({ vals }, el) {
    const n = vals.length
    const g = this.#geometry(n)
    this.geo = g
    el.innerHTML = `
      <div class="rl__stats"></div>
      <div class="rl__chartwrap">${this.#svg(vals, g)}</div>
    `
    this.statsEl = el.querySelector('.rl__stats')
    this.svgEl = el.querySelector('.rl__svg')
    this.boxEls = [...this.svgEl.querySelectorAll('.rl-box')]
    this.edgeEls = [...this.svgEl.querySelectorAll('.rl-edge')]
    this.ptrAEl = this.svgEl.querySelector('.rl-ptr--a')
    this.ptrBEl = this.svgEl.querySelector('.rl-ptr--b')
    this.tickAEl = this.svgEl.querySelector('.rl-tick--a')
    this.tickBEl = this.svgEl.querySelector('.rl-tick--b')
  }

  #geometry(n) {
    const nodeW = 56
    const nodeH = 40
    const gap = 44
    const marginX = 28
    const nodeY = 170
    const slotX = (i) => marginX + i * (nodeW + gap)
    const W = slotX(n - 1) + nodeW + marginX
    const H = 350
    return { n, nodeW, nodeH, gap, marginX, nodeY, slotX, W, H }
  }

  #svg(vals, g) {
    const n = vals.length
    let boxes = ''
    for (let i = 0; i < n; i++) {
      const x = g.slotX(i)
      const cx = x + g.nodeW / 2
      boxes += `<g class="rl-box" data-idx="${i}">
        <rect class="rl-box__rect" x="${x}" y="${g.nodeY}" width="${g.nodeW}" height="${g.nodeH}" rx="8"/>
        <text class="rl-box__val" x="${cx}" y="${g.nodeY + g.nodeH / 2 + 5}">${vals[i]}</text>
        <text class="rl-box__idx" x="${cx}" y="${g.nodeY + g.nodeH + 16}">${i}</text>
      </g>`
    }
    let edges = ''
    for (let i = 0; i < n; i++) {
      edges += `<path class="rl-edge" data-src="${i}" d=""/>`
    }
    const tickTop = 34
    const tickBottom = g.nodeY - 6
    return `<svg class="rl__svg" viewBox="0 0 ${g.W} ${g.H}" preserveAspectRatio="xMidYMid meet" role="img">
      <defs>
        <marker id="rl-arrowhead" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path class="rl-arrowhead-path" d="M0,0 L6,3 L0,6 Z"/>
        </marker>
      </defs>
      ${edges}
      ${boxes}
      <line class="rl-tick rl-tick--a" x1="0" y1="${tickTop + 14}" x2="0" y2="${tickBottom}"/>
      <text class="rl-ptr rl-ptr--a" x="0" y="${tickTop + 8}"></text>
      <line class="rl-tick rl-tick--b" x1="0" y1="${tickTop + 32}" x2="0" y2="${tickBottom}"/>
      <text class="rl-ptr rl-ptr--b" x="0" y="${tickTop + 26}"></text>
    </svg>`
  }

  #edgePath(g, from, to) {
    const cx1 = g.slotX(from) + g.nodeW / 2
    const cx2 = g.slotX(to) + g.nodeW / 2
    if (to === from + 1) {
      const xa = g.slotX(from) + g.nodeW
      const xb = g.slotX(to)
      const y = g.nodeY + g.nodeH / 2
      return `M${xa},${y} L${xb},${y}`
    }
    const above = to > from
    const span = Math.abs(to - from)
    const lift = 30 + span * 13
    const y0 = above ? g.nodeY : g.nodeY + g.nodeH
    const ay = above ? y0 - lift : y0 + lift
    const midX = (cx1 + cx2) / 2
    return `M${cx1},${y0} Q${midX},${ay} ${cx2},${y0}`
  }

  renderStep(st, { state }) {
    const g = this.geo
    const vals = state.vals

    this.statsEl.innerHTML =
      `<span>阶段：<strong>${PHASE_LABEL[st.phase] ?? ''}</strong></span>` +
      (st.a !== -1 ? `<span>${st.labelA} → <strong>${desc(st.a, vals)}</strong></span>` : '') +
      (st.b !== -1 ? `<span>${st.labelB} → <strong>${desc(st.b, vals)}</strong></span>` : '')

    // 结点框
    this.boxEls.forEach((box) => {
      const idx = Number(box.dataset.idx)
      box.classList.remove('is-a', 'is-b', 'is-second-half', 'is-done')
      if (st.secondHead !== -1 && idx >= st.secondHead) box.classList.add('is-second-half')
      if (idx === st.a) box.classList.add('is-a')
      if (idx === st.b) box.classList.add('is-b')
      if (st.phase === 'done' || st.phase === 'onlyOne') box.classList.add('is-done')
    })

    // 箭头：按当前 next[] 全量重画
    const changed = new Set(st.changed ?? [])
    this.edgeEls.forEach((path) => {
      const src = Number(path.dataset.src)
      const target = st.next[src]
      if (target === -1) {
        path.setAttribute('d', '')
        path.classList.remove('is-visible')
        return
      }
      path.setAttribute('d', this.#edgePath(g, src, target))
      path.classList.add('is-visible')
      path.classList.toggle('is-changed', changed.has(src))
      path.classList.toggle('is-final', st.phase === 'done' || st.phase === 'onlyOne')
    })

    // 指针标签
    const setPtr = (tickEl, labelEl, idx, label, cls) => {
      if (idx === -1) {
        tickEl.classList.add('is-hidden')
        labelEl.classList.add('is-hidden')
        return
      }
      tickEl.classList.remove('is-hidden')
      labelEl.classList.remove('is-hidden')
      const cx = g.slotX(idx) + g.nodeW / 2
      tickEl.setAttribute('x1', cx)
      tickEl.setAttribute('x2', cx)
      labelEl.setAttribute('x', cx)
      labelEl.textContent = label
      labelEl.setAttribute('class', `rl-ptr ${cls}`)
    }
    setPtr(this.tickAEl, this.ptrAEl, st.a, st.labelA, 'rl-ptr--a')
    setPtr(this.tickBEl, this.ptrBEl, st.b, st.labelB, 'rl-ptr--b')
  }

  resultBanner(result) {
    const { resultVals } = result
    return {
      kind: 'success',
      html: `🎉 重排完成：<code>${resultVals.join(' → ')}</code>。`,
    }
  }
}

export function mountViz(el, opts) {
  return new ReorderListViz(el, opts)
}

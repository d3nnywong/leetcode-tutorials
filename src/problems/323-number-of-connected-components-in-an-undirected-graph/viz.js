/*
 * 无向图连通分量「并查集（Union-Find）」动画。
 *
 * 一开始每个节点都是自己的根（n 个分量）。依次处理每条边 (a, b)：
 * 分别找到 a、b 当前所在分量的根 find(a)、find(b)：
 *   - 根不同 → 这条边把两个分量「焊」成一个，把其中一个根接到另一个根上，分量数 −1；
 *   - 根相同 → a、b 已经在同一分量里，这条边多余，跳过。
 * 边处理完，剩下的分量数就是答案。find 用路径压缩（隔代压缩），整体接近 O(n + e)。
 */
import { VizPlayer } from '../../components/viz-player/vizPlayer.js'

const MAX_N = 12
const MAX_EDGES = 18
const COLORS = 5

export class ConnectedComponentsViz extends VizPlayer {
  constructor(mountEl) {
    super(mountEl, {
      inputs: [
        { key: 'n', label: '节点数 n', default: '5', width: '5rem' },
        { key: 'edges', label: '边 edges（a-b，逗号分隔）', default: '0-1,1-2,3-4', width: '16rem' },
      ],
      speed: 1200,
      hint: `提示：节点编号从 0 开始，边写成「a-b」用逗号分隔，例如 0-1,1-2（最多 ${MAX_N} 个节点、${MAX_EDGES} 条边）。`,
    })
  }

  parseInputs({ n, edges }) {
    const nn = Math.trunc(Number(n))
    if (!Number.isFinite(nn) || nn < 1) throw new Error('n 必须是正整数')
    if (nn > MAX_N) throw new Error(`为了看得清楚，n 最多 ${MAX_N}`)

    const edgeList = (edges ?? '')
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s !== '')
      .map((s) => {
        const m = s.match(/^(\d+)\s*-\s*(\d+)$/)
        if (!m) throw new Error(`「${s}」不是合法的边，应写成 a-b`)
        const a = Number(m[1])
        const b = Number(m[2])
        if (a < 0 || a >= nn || b < 0 || b >= nn) {
          throw new Error(`边 ${s} 的端点超出范围 [0, ${nn - 1}]`)
        }
        if (a === b) throw new Error(`边 ${s} 不能是自环（ai != bi）`)
        return [a, b]
      })
    if (edgeList.length > MAX_EDGES) throw new Error(`边数最多 ${MAX_EDGES} 条`)

    return {
      n: nn,
      edges: edgeList,
      display: { n: String(nn), edges: edgeList.map(([a, b]) => `${a}-${b}`).join(',') },
    }
  }

  computeSteps({ n, edges }) {
    const parent = Array.from({ length: n }, (_, i) => i)
    const find = (x) => {
      while (parent[x] !== x) {
        parent[x] = parent[parent[x]] // 路径压缩（隔代压缩）
        x = parent[x]
      }
      return x
    }

    const steps = []
    let count = n
    steps.push({
      kind: 'init',
      parent: [...parent],
      count,
      msg: `初始化：${n} 个节点各自成一个连通分量（parent[i] = i），连通分量数 = <strong>${count}</strong>。`,
    })

    edges.forEach(([a, b], idx) => {
      const ra = find(a)
      const rb = find(b)
      const union = ra !== rb
      if (union) {
        parent[ra] = rb
        count--
      }
      steps.push({
        kind: 'edge',
        edgeIdx: idx,
        a,
        b,
        ra,
        rb,
        union,
        parent: [...parent],
        count,
        msg: union
          ? `处理边 (${a}, ${b})：find(${a}) = ${ra}，find(${b}) = ${rb}，根不同 → 合并两个分量，parent[${ra}] = ${rb}，分量数 −1 = <strong>${count}</strong>。`
          : `处理边 (${a}, ${b})：find(${a}) = ${ra}，find(${b}) = ${rb}，根相同 → 已经在同一分量里，跳过，分量数仍是 <strong>${count}</strong>。`,
      })
    })

    steps.push({
      kind: 'done',
      parent: [...parent],
      count,
      msg: `处理完全部 ${edges.length} 条边，最终连通分量数 = <strong>${count}</strong>。`,
    })

    return { steps, result: count }
  }

  buildStage({ n, edges }, el) {
    el.innerHTML = `
      <div class="ucc__graph">
        <svg class="ucc__svg" viewBox="0 0 320 320" preserveAspectRatio="xMidYMid meet" role="img"></svg>
      </div>
      <div class="ucc__info">
        <div class="ucc__count"></div>
        <div class="ucc__parentlabel">并查集 parent 数组（下标 i → parent[i]）</div>
        <div class="ucc__parent"></div>
      </div>
    `
    const svg = el.querySelector('.ucc__svg')
    const cx = 160
    const cy = 160
    const r = n <= 1 ? 0 : 120
    const pos = Array.from({ length: n }, (_, i) => {
      const angle = (2 * Math.PI * i) / n - Math.PI / 2
      return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) }
    })
    this.pos = pos

    const edgesHtml = edges
      .map(
        ([a, b], idx) =>
          `<line class="ucc__edge" data-idx="${idx}" x1="${pos[a].x}" y1="${pos[a].y}" x2="${pos[b].x}" y2="${pos[b].y}"></line>`,
      )
      .join('')
    const nodesHtml = pos
      .map(
        (p, i) =>
          `<g class="ucc__node" data-i="${i}">
            <circle cx="${p.x}" cy="${p.y}" r="18"></circle>
            <text x="${p.x}" y="${p.y + 5}" text-anchor="middle">${i}</text>
          </g>`,
      )
      .join('')
    svg.innerHTML = `<g class="ucc__edges">${edgesHtml}</g><g class="ucc__nodes">${nodesHtml}</g>`

    this.svgEl = svg
    this.edgeEls = [...svg.querySelectorAll('.ucc__edge')]
    this.nodeEls = [...svg.querySelectorAll('.ucc__node')]
    this.countEl = el.querySelector('.ucc__count')
    this.parentEl = el.querySelector('.ucc__parent')
  }

  renderStep(st) {
    const parent = st.parent
    // 用本步的 parent 快照算出每个节点当前的根（仅用于染色，不影响算法状态）
    const rootOf = (x) => {
      while (parent[x] !== x) x = parent[x]
      return x
    }
    const roots = parent.map((_, i) => rootOf(i))
    const rootOrder = []
    roots.forEach((r) => {
      if (!rootOrder.includes(r)) rootOrder.push(r)
    })
    const colorOf = (r) => `ucc-c${rootOrder.indexOf(r) % COLORS}`

    this.nodeEls.forEach((g, i) => {
      let cls = `ucc__node ${colorOf(roots[i])}`
      if (st.kind === 'edge' && (i === st.a || i === st.b)) cls += ' is-current'
      g.setAttribute('class', cls)
    })

    this.edgeEls.forEach((line) => {
      const idx = Number(line.dataset.idx)
      let cls = 'ucc__edge'
      if (st.kind === 'edge') {
        if (idx === st.edgeIdx) cls += st.union ? ' is-current' : ' is-skip'
        else if (idx < st.edgeIdx) cls += ' is-done'
      } else if (st.kind === 'done') {
        cls += ' is-done'
      }
      line.setAttribute('class', cls)
    })

    this.countEl.innerHTML = `当前连通分量数：<strong>${st.count}</strong>`
    this.parentEl.innerHTML = parent
      .map((p, i) => {
        const hit = st.kind === 'edge' && (i === st.ra || i === st.rb)
        return `<code class="ucc__chip${hit ? ' is-hit' : ''}">${i}→${p}</code>`
      })
      .join('')
  }

  resultBanner(result) {
    return {
      kind: 'success',
      html: `🎉 全部边处理完毕，这张无向图共有 <strong>${result}</strong> 个连通分量。`,
    }
  }
}

export function mountViz(el, opts) {
  return new ConnectedComponentsViz(el, opts)
}

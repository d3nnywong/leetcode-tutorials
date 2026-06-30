/*
 * 克隆图「BFS 边扫边建」动画。
 *
 * 用一个哈希表 visited 记录「原节点 → 克隆节点」。从给定起点出发做 BFS：
 * 每次从队列取出一个原节点 cur，遍历它的每个邻居 nb——
 *   - nb 没克隆过：先新建一个克隆节点，存进哈希表，并把 nb 加入队列；
 *   - 不管 nb 是不是第一次见，都把「克隆图里 cur 对应的节点」和「克隆图里 nb 对应的节点」连起来。
 * 哈希表保证每个节点只克隆一次，队列保证每条边只会被发现一次，整体 O(V + E)。
 */
import { VizPlayer } from '../../components/viz-player/vizPlayer.js'

const MAX_N = 10

export class CloneGraphViz extends VizPlayer {
  constructor(mountEl) {
    super(mountEl, {
      inputs: [
        {
          key: 'adjList',
          label: '邻接表 adjList（如 [[2,4],[1,3],[2,4],[1,3]]）',
          default: '[[2,4],[1,3],[2,4],[1,3]]',
          width: '22rem',
        },
      ],
      speed: 1300,
      hint: `提示：格式和官方一样，从节点 1 开始 1-indexed，最多 ${MAX_N} 个节点。`,
    })
  }

  parseInputs({ adjList }) {
    let raw
    try {
      raw = JSON.parse((adjList ?? '').trim() || '[]')
    } catch {
      throw new Error('邻接表格式不对，应为形如 [[2,4],[1,3],[2,4],[1,3]] 的 JSON 数组')
    }
    if (!Array.isArray(raw)) throw new Error('邻接表必须是数组，例如 [[2,4],[1,3]]')
    if (raw.length > MAX_N) throw new Error(`节点数最多 ${MAX_N} 个`)

    const n = raw.length
    const adj = {}
    for (let i = 0; i < n; i++) {
      const v = i + 1
      const nbsRaw = raw[i]
      if (!Array.isArray(nbsRaw)) throw new Error(`第 ${v} 个节点的邻居必须是数组`)
      const seen = new Set()
      const nbs = []
      for (const x of nbsRaw) {
        const num = Math.trunc(Number(x))
        if (!Number.isFinite(num) || num < 1 || num > n) {
          throw new Error(`节点 ${v} 的邻居 ${x} 超出范围 [1, ${n}]`)
        }
        if (num === v) continue // 题目保证无自环，忽略写错的自环
        if (seen.has(num)) continue // 题目保证无重复边，去重
        seen.add(num)
        nbs.push(num)
      }
      adj[v] = nbs
    }
    return { adj, n, display: { adjList: JSON.stringify(raw) } }
  }

  computeSteps({ adj, n }) {
    const steps = []
    if (n === 0) {
      steps.push({
        kind: 'empty',
        cur: null,
        nb: null,
        visited: [],
        queue: [],
        cloneEdges: [],
        msg: '输入是空图（没有任何节点），按定义直接返回 <code>null</code>。',
      })
      return { steps, result: { n: 0, visitedCount: 0 } }
    }

    const visited = new Set()
    const cloneEdges = []
    const cloneEdgeKeys = new Set()
    const queue = [1]
    visited.add(1)
    steps.push({
      kind: 'init',
      cur: null,
      nb: null,
      visited: [...visited],
      queue: [...queue],
      cloneEdges: [],
      msg: '从给定节点 <strong>1</strong> 出发：先克隆它自己（新建一个 val = 1 的节点），存进哈希表 visited，并加入队列。',
    })

    while (queue.length) {
      const cur = queue.shift()
      steps.push({
        kind: 'pop',
        cur,
        nb: null,
        visited: [...visited],
        queue: [...queue],
        cloneEdges: [...cloneEdges],
        msg: `队列取出节点 <strong>${cur}</strong>，开始逐个检查它的邻居。`,
      })
      const neighbors = adj[cur] ?? []
      if (neighbors.length === 0) {
        steps.push({
          kind: 'no-neighbor',
          cur,
          nb: null,
          visited: [...visited],
          queue: [...queue],
          cloneEdges: [...cloneEdges],
          msg: `节点 <strong>${cur}</strong> 没有邻居，跳过。`,
        })
      }
      for (const nb of neighbors) {
        const already = visited.has(nb)
        if (!already) {
          visited.add(nb)
          queue.push(nb)
        }
        const key = cur < nb ? `${cur}-${nb}` : `${nb}-${cur}`
        if (!cloneEdgeKeys.has(key)) {
          cloneEdgeKeys.add(key)
          cloneEdges.push({ a: cur, b: nb, key })
        }
        steps.push({
          kind: already ? 'link-existing' : 'clone-new',
          cur,
          nb,
          visited: [...visited],
          queue: [...queue],
          cloneEdges: [...cloneEdges],
          msg: already
            ? `邻居 <strong>${nb}</strong> 已经在 visited 里克隆过了 → 直接把克隆图里 <strong>${cur}</strong> 与 <strong>${nb}</strong> 连起来。`
            : `邻居 <strong>${nb}</strong> 第一次见到 → 新建克隆节点 ${nb}，存进 visited，加入队列，并把克隆图里 <strong>${cur}</strong> 与 <strong>${nb}</strong> 连起来。`,
        })
      }
    }

    steps.push({
      kind: 'done',
      cur: null,
      nb: null,
      visited: [...visited],
      queue: [],
      cloneEdges: [...cloneEdges],
      msg: `队列清空，BFS 结束！一共克隆了 <strong>${visited.size}</strong> 个节点、<strong>${cloneEdges.length}</strong> 条边。`,
    })

    return { steps, result: { n, visitedCount: visited.size } }
  }

  buildStage({ adj, n }, el) {
    if (n === 0) {
      el.innerHTML = `<p class="gc__empty">空图：没有任何节点。</p>`
      return
    }
    this.pos = this.#layout(n)
    this.pairs = this.#dedupePairs(adj, n)
    el.innerHTML = `
      <div class="gc__queue"></div>
      <div class="gc__panels">
        <div class="gc__panel">
          <div class="gc__panel-title">原图（输入）</div>
          <div class="gc__svgwrap">${this.#svg(n, false)}</div>
        </div>
        <div class="gc__arrow" aria-hidden="true">⇒</div>
        <div class="gc__panel">
          <div class="gc__panel-title">克隆图（哈希表 visited 逐步建出来的）</div>
          <div class="gc__svgwrap">${this.#svg(n, true)}</div>
        </div>
      </div>
    `
    const svgs = el.querySelectorAll('.gc__svg')
    this.origSvg = svgs[0]
    this.cloneSvg = svgs[1]
    this.queueEl = el.querySelector('.gc__queue')
  }

  #layout(n) {
    const W = 220
    const H = 220
    const cx = W / 2
    const cy = H / 2
    const R = n <= 1 ? 0 : 78
    const pos = {}
    for (let i = 1; i <= n; i++) {
      if (n === 1) {
        pos[i] = { x: cx, y: cy }
        continue
      }
      const angle = ((i - 1) * (2 * Math.PI)) / n - Math.PI / 2
      pos[i] = { x: cx + R * Math.cos(angle), y: cy + R * Math.sin(angle) }
    }
    return pos
  }

  #dedupePairs(adj, n) {
    const seen = new Set()
    const pairs = []
    for (let v = 1; v <= n; v++) {
      for (const nb of adj[v] ?? []) {
        const a = Math.min(v, nb)
        const b = Math.max(v, nb)
        const key = `${a}-${b}`
        if (!seen.has(key)) {
          seen.add(key)
          pairs.push([a, b])
        }
      }
    }
    return pairs
  }

  #svg(n, isClone) {
    const pos = this.pos
    const edges = this.pairs
      .map(
        ([a, b]) =>
          `<line class="gc-edge${isClone ? ' gc-edge--ghost' : ''}" data-pair="${a}-${b}" x1="${
            pos[a].x
          }" y1="${pos[a].y}" x2="${pos[b].x}" y2="${pos[b].y}"/>`,
      )
      .join('')
    let nodes = ''
    for (let i = 1; i <= n; i++) {
      nodes += `<g class="gc-node${isClone ? ' gc-node--ghost' : ''}" data-v="${i}">
        <circle class="gc-circle" cx="${pos[i].x}" cy="${pos[i].y}" r="18"/>
        <text class="gc-label" x="${pos[i].x}" y="${pos[i].y}">${i}</text>
      </g>`
    }
    return `<svg class="gc__svg" viewBox="0 0 220 220" role="img" aria-label="${
      isClone ? '克隆图' : '原图'
    }">
      <g class="gc-edges">${edges}</g>
      <g class="gc-nodes">${nodes}</g>
    </svg>`
  }

  renderStep(st, { state }) {
    const { n } = state
    if (n === 0) return

    this.queueEl.innerHTML =
      `<span class="gc__qlabel">队列</span>` +
      (st.queue && st.queue.length
        ? st.queue.map((v) => `<code class="gc__qchip">${v}</code>`).join('')
        : `<span class="gc__qempty">（空）</span>`) +
      `<span class="gc__visited">已克隆 ${st.visited ? st.visited.length : 0} / ${n}</span>`

    // 原图：高亮当前处理节点 / 当前检查的邻居
    this.origSvg.querySelectorAll('.gc-node').forEach((g) => {
      const v = Number(g.dataset.v)
      g.classList.remove('is-current', 'is-neighbor')
      if (v === st.cur) g.classList.add('is-current')
      if (v === st.nb) g.classList.add('is-neighbor')
    })

    // 克隆图：节点是否已克隆（不再是 ghost），并高亮当前 / 新建
    const visitedSet = new Set(st.visited || [])
    this.cloneSvg.querySelectorAll('.gc-node').forEach((g) => {
      const v = Number(g.dataset.v)
      g.classList.toggle('gc-node--ghost', !visitedSet.has(v))
      g.classList.remove('is-current', 'is-new')
      if (v === st.cur) g.classList.add('is-current')
      if (st.kind === 'clone-new' && v === st.nb) g.classList.add('is-new')
    })

    // 克隆图：边是否已经连上
    const addedKeys = new Set((st.cloneEdges || []).map((e) => e.key))
    this.cloneSvg.querySelectorAll('.gc-edge').forEach((line) => {
      line.classList.toggle('gc-edge--ghost', !addedKeys.has(line.dataset.pair))
    })
  }

  resultBanner(result) {
    if (!result || result.n === 0) {
      return { kind: 'info', html: '空图：函数直接返回 <code>null</code>。' }
    }
    if (result.visitedCount < result.n) {
      return {
        kind: 'info',
        html: `从节点 1 出发只能到达 <strong>${result.visitedCount}</strong> / ${result.n} 个节点
          （自定义输入不连通；原题保证图是连通的，正式测试不会出现这种情况）。`,
      }
    }
    return {
      kind: 'success',
      html: `🎉 克隆完成！一共生成了 <strong>${result.n}</strong> 个全新的节点，边的连接关系和原图完全一致——
        但每个节点都是新对象（深拷贝），不是同一个引用。`,
    }
  }
}

export function mountViz(el, opts) {
  return new CloneGraphViz(el, opts)
}

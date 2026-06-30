/*
 * 以图判树「并查集（Union-Find）判环」动画。
 *
 * 一棵 n 个节点的树，边数必然恰好是 n - 1：边太多必然有环，边太少必然连不起来。
 * 所以先做一个必要条件检查：edges.length !== n - 1 直接判 false。
 * 通过检查后，用并查集逐条边处理：查两个端点是否已经在同一个连通分量（find 出的根相同）——
 * 如果是，说明这条边会把已经连通的两个点再连一次，围成一个「环」，不可能是树；
 * 如果不是，就把两个分量合并（union）。
 * 把 n - 1 条边都处理完还没有发现环，说明整张图既无环、边数又刚好够，
 * 那它必然把所有节点连成了一整块——这就是一棵合法的树。
 */
import { VizPlayer } from '../../components/viz-player/vizPlayer.js'

const MAX_N = 10
const MAX_EDGES = 20

function findRoot(parent, x) {
  let cur = x
  while (parent[cur] !== cur) cur = parent[cur]
  return cur
}

export class GraphValidTreeViz extends VizPlayer {
  constructor(mountEl) {
    super(mountEl, {
      inputs: [
        { key: 'n', label: '节点数 n', default: '5', width: '6rem' },
        {
          key: 'edges',
          label: '边 edges（如 [[0,1],[0,2],[0,3],[1,4]]）',
          default: '[[0,1],[0,2],[0,3],[1,4]]',
          width: '20rem',
        },
      ],
      speed: 1200,
      hint: `提示：节点数最多 ${MAX_N} 个、边最多 ${MAX_EDGES} 条；改成 [[0,1],[1,2],[2,3],[1,3],[1,4]]（边比 n−1 多）或
        [[0,1],[1,2],[2,0],[3,4]]（边数对但围了一圈）都能看到「不是树」的两种原因。`,
    })
  }

  parseInputs({ n, edges }) {
    const N = Math.trunc(Number(n))
    if (!Number.isFinite(N) || N < 1) throw new Error('n 必须是 ≥ 1 的整数')
    if (N > MAX_N) throw new Error(`节点数最多 ${MAX_N} 个（演示用）`)

    let raw
    try {
      raw = JSON.parse((edges ?? '').trim() || '[]')
    } catch {
      throw new Error('edges 格式不对，应为形如 [[0,1],[0,2]] 的 JSON 数组')
    }
    if (!Array.isArray(raw)) throw new Error('edges 必须是数组，例如 [[0,1],[0,2]]')
    if (raw.length > MAX_EDGES) throw new Error(`边数最多 ${MAX_EDGES} 条（演示用）`)

    const seen = new Set()
    const pairs = []
    for (const item of raw) {
      if (!Array.isArray(item) || item.length !== 2) {
        throw new Error('每条边必须是 [a, b] 这样的二元数组')
      }
      const a = Math.trunc(Number(item[0]))
      const b = Math.trunc(Number(item[1]))
      if (!Number.isFinite(a) || !Number.isFinite(b) || a < 0 || a >= N || b < 0 || b >= N) {
        throw new Error(`边 [${item[0]}, ${item[1]}] 超出节点编号范围 [0, ${N - 1}]`)
      }
      if (a === b) throw new Error(`边 [${a}, ${b}] 是自环，题目保证不会出现自环`)
      const key = a < b ? `${a}-${b}` : `${b}-${a}`
      if (seen.has(key)) throw new Error(`边 [${a}, ${b}] 重复了，题目保证边不会重复`)
      seen.add(key)
      pairs.push([a, b])
    }

    return { n: N, edges: pairs, display: { n: String(N), edges: JSON.stringify(pairs) } }
  }

  computeSteps({ n, edges }) {
    const steps = []
    const parent = Array.from({ length: n }, (_, i) => i)

    steps.push({
      kind: 'init',
      parent: parent.slice(),
      edgeIdx: -1,
      msg: `这张图有 <strong>${n}</strong> 个节点、<strong>${edges.length}</strong> 条边。先检查一个必要条件：
        树的边数必须恰好是 <code>n − 1 = ${n - 1}</code>。`,
    })

    if (edges.length !== n - 1) {
      const tooMany = edges.length > n - 1
      steps.push({
        kind: 'count-fail',
        parent: parent.slice(),
        edgeIdx: -1,
        final: true,
        msg: tooMany
          ? `边数 <strong>${edges.length}</strong> 比 <code>n − 1 = ${n - 1}</code> 多 → 边太多，
             一定会有两个端点被重复连接，必然出现<strong>环</strong>，<strong>不是树</strong>。`
          : `边数 <strong>${edges.length}</strong> 比 <code>n − 1 = ${n - 1}</code> 少 → 边太少，
             不可能把全部 ${n} 个节点连成一整块，必然<strong>不连通</strong>，<strong>不是树</strong>。`,
      })
      return {
        steps,
        result: { valid: false, reason: 'count', expected: n - 1, actual: edges.length, tooMany },
      }
    }

    let cycleEdge = null
    for (let i = 0; i < edges.length; i++) {
      const [a, b] = edges[i]
      const ra = findRoot(parent, a)
      const rb = findRoot(parent, b)
      if (ra === rb) {
        cycleEdge = { a, b }
        steps.push({
          kind: 'cycle',
          parent: parent.slice(),
          edgeIdx: i,
          a,
          b,
          ra,
          rb,
          final: true,
          msg: `处理边 <code>[${a}, ${b}]</code>：find(${a}) = find(${b}) = <strong>${ra}</strong>，
            两个端点早就在同一个连通分量里了 → 再连这条边就会围成<strong>环</strong>，不可能是树！`,
        })
        break
      }
      parent[ra] = rb
      steps.push({
        kind: 'union',
        parent: parent.slice(),
        edgeIdx: i,
        a,
        b,
        ra,
        rb,
        msg: `处理边 <code>[${a}, ${b}]</code>：find(${a}) = ${ra}，find(${b}) = ${rb}，不在同一组 →
          没有环，合并这两个连通分量（${ra} 所在的组并入 ${rb}）。`,
      })
    }

    if (cycleEdge) {
      return { steps, result: { valid: false, reason: 'cycle', a: cycleEdge.a, b: cycleEdge.b } }
    }

    steps.push({
      kind: 'done',
      parent: parent.slice(),
      edgeIdx: -1,
      final: true,
      msg: `${edges.length} 条边全部处理完，没有发现任何环。边数正好是 <code>n − 1</code> 又无环 →
        整张图必然<strong>连通</strong>成一整块，这是一棵合法的树！`,
    })
    return { steps, result: { valid: true } }
  }

  buildStage({ n, edges }, el) {
    this.geo = this.#layout(n)
    this.edgesList = edges
    el.innerHTML = `
      <div class="gvt__stats"></div>
      <div class="gvt__svgwrap">${this.#svg(n)}</div>
      <div class="gvt__unionlabel">并查集（节点 → 所在连通分量的根）</div>
      <div class="gvt__union"></div>
    `
    this.statsEl = el.querySelector('.gvt__stats')
    this.svgEl = el.querySelector('.gvt__svg')
    this.unionEl = el.querySelector('.gvt__union')
  }

  #layout(n) {
    const W = 280
    const H = 280
    const cx = W / 2
    const cy = H / 2
    const R = n <= 1 ? 0 : 104
    const pos = {}
    for (let i = 0; i < n; i++) {
      if (n === 1) {
        pos[i] = { x: cx, y: cy }
        continue
      }
      const angle = (i * (2 * Math.PI)) / n - Math.PI / 2
      pos[i] = { x: cx + R * Math.cos(angle), y: cy + R * Math.sin(angle) }
    }
    return { pos, W, H }
  }

  #svg(n) {
    const { pos, W, H } = this.geo
    const r = 20
    let edgesHtml = ''
    this.edgesList.forEach(([a, b], i) => {
      const p1 = pos[a]
      const p2 = pos[b]
      edgesHtml += `<line class="gvt-edge" data-idx="${i}" data-a="${a}" data-b="${b}" x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}"/>`
    })
    let nodesHtml = ''
    for (let i = 0; i < n; i++) {
      nodesHtml += `<g class="gvt-node" data-v="${i}">
        <circle class="gvt-circle" cx="${pos[i].x}" cy="${pos[i].y}" r="${r}"/>
        <text class="gvt-label" x="${pos[i].x}" y="${pos[i].y}">${i}</text>
      </g>`
    }
    return `<svg class="gvt__svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="图的节点与边">
      <g class="gvt-edges">${edgesHtml}</g>
      <g class="gvt-nodes">${nodesHtml}</g>
    </svg>`
  }

  renderStep(st, { state }) {
    const { n, edges } = state

    // 按本步的并查集快照算出每个节点当前的根，再给每个根分配一个循环色号
    const rootOf = {}
    for (let i = 0; i < n; i++) rootOf[i] = findRoot(st.parent, i)
    const roots = [...new Set(Object.values(rootOf))].sort((a, b) => a - b)
    const colorOf = {}
    roots.forEach((root, idx) => {
      colorOf[root] = (idx % 5) + 1
    })

    const isCountFail = st.kind === 'count-fail'
    const isCycle = st.kind === 'cycle'
    const isDone = st.kind === 'done'

    this.svgEl.querySelectorAll('.gvt-node').forEach((g) => {
      const v = Number(g.dataset.v)
      g.classList.remove(
        'is-current',
        'is-cycle',
        'is-final',
        'comp-1',
        'comp-2',
        'comp-3',
        'comp-4',
        'comp-5',
      )
      if (!isCountFail) g.classList.add(`comp-${colorOf[rootOf[v]]}`)
      if ((st.kind === 'union' || isCycle) && (v === st.a || v === st.b)) {
        g.classList.add('is-current')
      }
      if (isCycle && (v === st.a || v === st.b)) g.classList.add('is-cycle')
      if (isDone) g.classList.add('is-final')
    })

    this.svgEl.querySelectorAll('.gvt-edge').forEach((line) => {
      const idx = Number(line.dataset.idx)
      line.classList.remove('is-current', 'is-used', 'is-cycle', 'is-final')
      if (isCountFail) return
      if (isDone) {
        line.classList.add('is-final')
      } else if (idx === st.edgeIdx) {
        line.classList.add(isCycle ? 'is-cycle' : 'is-current')
      } else if (idx < st.edgeIdx) {
        line.classList.add('is-used')
      }
    })

    let statsHtml = `<span>节点数 n = <strong>${n}</strong></span><span>边数 <strong>${edges.length}</strong></span>`
    if (isCountFail) {
      statsHtml += `<span class="gvt__bad">期望 n − 1 = ${n - 1} 条边 ✗</span>`
    } else if (st.kind === 'init') {
      statsHtml += `<span class="gvt__ok">= n − 1 ✓，开始用并查集逐条边检查</span>`
    } else if (st.kind === 'union') {
      statsHtml += `<span>正在处理第 ${st.edgeIdx + 1} / ${edges.length} 条边，合并成功</span>`
    } else if (isCycle) {
      statsHtml += `<span class="gvt__bad">第 ${st.edgeIdx + 1} 条边发现环 ✗</span>`
    } else if (isDone) {
      statsHtml += `<span class="gvt__ok">全部处理完，无环 ✓</span>`
    }
    this.statsEl.innerHTML = statsHtml

    this.unionEl.innerHTML = Array.from({ length: n }, (_, i) => i)
      .map((i) => `<code class="gvt__chip comp-${colorOf[rootOf[i]]}">${i} → ${rootOf[i]}</code>`)
      .join('')
  }

  resultBanner(result, state) {
    if (result.valid) {
      return {
        kind: 'success',
        html: `🎉 这是一棵合法的树：<strong>${state.n}</strong> 个节点、<strong>${
          state.n - 1
        }</strong> 条边，没有环，整体连通。`,
      }
    }
    if (result.reason === 'count') {
      return {
        kind: 'fail',
        html: result.tooMany
          ? `🚫 边数 <strong>${result.actual}</strong> 比 <code>n − 1 = ${result.expected}</code> 多，边太多必然存在环，<strong>不是树</strong>。`
          : `🚫 边数 <strong>${result.actual}</strong> 比 <code>n − 1 = ${result.expected}</code> 少，不可能把所有节点连通，<strong>不是树</strong>。`,
      }
    }
    return {
      kind: 'fail',
      html: `🚫 边 <code>[${result.a}, ${result.b}]</code> 连接的两个节点早已连通，再连一次就形成了<strong>环</strong>，<strong>不是树</strong>。`,
    }
  }
}

export function mountViz(el, opts) {
  return new GraphValidTreeViz(el, opts)
}

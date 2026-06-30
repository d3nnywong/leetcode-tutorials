/*
 * 课程表「拓扑排序（Kahn 算法 / BFS 剥洋葱）」动画。
 *
 * 把课程看成有向图的节点：先修课 b → 课程 a 连一条边（学完 b 才能学 a）。
 * 给每个节点算「入度」= 还差几门没学完的先修课。
 * 入度为 0 的课程先入队（不需要等任何人）；每次从队列取出一个课程标记为学完，
 * 再把它指向的每个邻居入度减一——谁的入度减到 0 就入队。
 * 如果最后所有课程都被取出过，说明能学完（无环）；
 * 如果队列提前空了还剩课程没处理，说明剩下的课程互相卡死，构成了环 → 学不完。
 */
import { VizPlayer } from '../../components/viz-player/vizPlayer.js'

const MAX_N = 10
const MAX_EDGES = 20

export class CourseScheduleViz extends VizPlayer {
  constructor(mountEl) {
    super(mountEl, {
      inputs: [
        { key: 'numCourses', label: '课程数 numCourses', default: '4', width: '6rem' },
        {
          key: 'prerequisites',
          label: '先修关系 prerequisites（如 [[1,0],[2,0],[3,1],[3,2]]）',
          default: '[[1,0],[2,0],[3,1],[3,2]]',
          width: '20rem',
        },
      ],
      speed: 1200,
      hint: `提示：课程最多 ${MAX_N} 门、先修关系最多 ${MAX_EDGES} 条；改成 [[1,0],[0,1]] 能看到「成环 → 学不完」。`,
    })
  }

  parseInputs({ numCourses, prerequisites }) {
    const n = Math.trunc(Number(numCourses))
    if (!Number.isFinite(n) || n < 1) throw new Error('numCourses 必须是 ≥ 1 的整数')
    if (n > MAX_N) throw new Error(`课程数最多 ${MAX_N} 门（演示用）`)

    let raw
    try {
      raw = JSON.parse((prerequisites ?? '').trim() || '[]')
    } catch {
      throw new Error('prerequisites 格式不对，应为形如 [[1,0],[2,0]] 的 JSON 数组')
    }
    if (!Array.isArray(raw)) throw new Error('prerequisites 必须是数组，例如 [[1,0],[2,0]]')
    if (raw.length > MAX_EDGES) throw new Error(`先修关系最多 ${MAX_EDGES} 条（演示用）`)

    const seen = new Set()
    const pairs = []
    for (const item of raw) {
      if (!Array.isArray(item) || item.length !== 2) {
        throw new Error('每条先修关系必须是 [a, b] 这样的二元数组')
      }
      const a = Math.trunc(Number(item[0]))
      const b = Math.trunc(Number(item[1]))
      if (!Number.isFinite(a) || !Number.isFinite(b) || a < 0 || a >= n || b < 0 || b >= n) {
        throw new Error(`先修关系 [${item[0]}, ${item[1]}] 超出课程编号范围 [0, ${n - 1}]`)
      }
      if (a === b) continue // 题目保证无自环；忽略写错的自环
      const key = `${a}-${b}`
      if (seen.has(key)) continue // 题目保证课程对互不相同；去重
      seen.add(key)
      pairs.push([a, b])
    }

    const adj = Array.from({ length: n }, () => [])
    for (const [a, b] of pairs) adj[b].push(a) // b -> a：学完 b 才能学 a

    return {
      n,
      pairs,
      adj,
      display: { numCourses: String(n), prerequisites: JSON.stringify(pairs) },
    }
  }

  computeSteps({ n, adj }) {
    const indeg = new Array(n).fill(0)
    for (let v = 0; v < n; v++) for (const nb of adj[v]) indeg[nb]++

    const steps = []
    const processed = []
    steps.push({
      kind: 'init',
      indeg: indeg.slice(),
      queue: [],
      cur: null,
      nb: null,
      order: [],
      processed: [...processed],
      msg: '先给每门课算「入度」：还差几门先修课没学完。',
    })

    const queue = []
    for (let i = 0; i < n; i++) if (indeg[i] === 0) queue.push(i)
    steps.push({
      kind: 'seed',
      indeg: indeg.slice(),
      queue: [...queue],
      cur: null,
      nb: null,
      order: [],
      processed: [...processed],
      msg: queue.length
        ? `入度为 0 的课程（不需要等任何先修课）先入队：<strong>${queue.join(', ')}</strong>。`
        : '没有任何入度为 0 的课程，一开始就互相卡死，必然存在环。',
    })

    const order = []
    while (queue.length) {
      const cur = queue.shift()
      order.push(cur)
      steps.push({
        kind: 'pop',
        indeg: indeg.slice(),
        queue: [...queue],
        cur,
        nb: null,
        order: [...order],
        processed: [...processed],
        msg: `从队列取出课程 <strong>${cur}</strong>，标记为已学完（第 ${order.length} 门）。`,
      })
      const neighbors = adj[cur]
      if (neighbors.length === 0) {
        steps.push({
          kind: 'no-out',
          indeg: indeg.slice(),
          queue: [...queue],
          cur,
          nb: null,
          order: [...order],
          processed: [...processed],
          msg: `没有任何课程把 <strong>${cur}</strong> 当先修课，继续。`,
        })
      }
      for (const nb of neighbors) {
        indeg[nb]--
        processed.push(`${cur}-${nb}`)
        const becameZero = indeg[nb] === 0
        if (becameZero) queue.push(nb)
        steps.push({
          kind: becameZero ? 'enqueue' : 'decrement',
          indeg: indeg.slice(),
          queue: [...queue],
          cur,
          nb,
          order: [...order],
          processed: [...processed],
          msg: becameZero
            ? `课程 <strong>${cur}</strong> 学完了 → 课程 <strong>${nb}</strong> 的入度减到 0，入队！`
            : `课程 <strong>${cur}</strong> 学完了 → 课程 <strong>${nb}</strong> 的入度减一，还差 <strong>${indeg[nb]}</strong> 门。`,
        })
      }
    }

    const orderSet = new Set(order)
    const remaining = []
    for (let i = 0; i < n; i++) if (!orderSet.has(i)) remaining.push(i)
    const canFinish = remaining.length === 0
    steps.push({
      kind: 'done',
      indeg: indeg.slice(),
      queue: [],
      cur: null,
      nb: null,
      order: [...order],
      remaining,
      processed: [...processed],
      msg: canFinish
        ? `队列清空，<strong>${order.length} / ${n}</strong> 门课全部学完 → 可以完成所有课程！`
        : `队列清空，只学完了 <strong>${order.length} / ${n}</strong> 门课，剩下 <strong>${remaining.join(
            ', ',
          )}</strong> 的入度始终降不到 0 → 它们互相卡死，存在环，<strong>无法学完</strong>。`,
    })

    return { steps, result: { canFinish, order, remaining, n } }
  }

  buildStage({ n, pairs }, el) {
    this.geo = this.#layout(n)
    this.edgesList = pairs.map(([a, b]) => [b, a]) // 画图方向：b -> a（学完 b 才能学 a）
    el.innerHTML = `
      <div class="crs__panels">
        <div class="crs__queue"></div>
        <div class="crs__order"></div>
      </div>
      <div class="crs__svgwrap">${this.#svg(n)}</div>
    `
    this.svgEl = el.querySelector('.crs__svg')
    this.queueEl = el.querySelector('.crs__queue')
    this.orderEl = el.querySelector('.crs__order')
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
    for (const [from, to] of this.edgesList) {
      const p1 = pos[from]
      const p2 = pos[to]
      const dx = p2.x - p1.x
      const dy = p2.y - p1.y
      const dist = Math.hypot(dx, dy) || 1
      const ux = dx / dist
      const uy = dy / dist
      const x1 = p1.x + ux * r
      const y1 = p1.y + uy * r
      const x2 = p2.x - ux * (r + 9)
      const y2 = p2.y - uy * (r + 9)
      edgesHtml += `<line class="crs-edge" data-from="${from}" data-to="${to}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" marker-end="url(#crs-arrow)"/>`
    }
    let nodesHtml = ''
    for (let i = 0; i < n; i++) {
      nodesHtml += `<g class="crs-node" data-v="${i}">
        <circle class="crs-circle" cx="${pos[i].x}" cy="${pos[i].y}" r="${r}"/>
        <text class="crs-label" x="${pos[i].x}" y="${pos[i].y}">${i}</text>
        <text class="crs-indeg" x="${pos[i].x}" y="${pos[i].y + r + 14}">in:0</text>
      </g>`
    }
    return `<svg class="crs__svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="课程先修关系图">
      <defs>
        <marker id="crs-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path class="crs-arrowhead" d="M0,0 L10,5 L0,10 z" />
        </marker>
      </defs>
      <g class="crs-edges">${edgesHtml}</g>
      <g class="crs-nodes">${nodesHtml}</g>
    </svg>`
  }

  renderStep(st) {
    this.queueEl.innerHTML =
      `<span class="crs__label">队列（入度为 0）</span>` +
      (st.queue && st.queue.length
        ? st.queue.map((v) => `<code class="crs__chip">${v}</code>`).join('')
        : `<span class="crs__empty">（空）</span>`)

    this.orderEl.innerHTML =
      `<span class="crs__label">已学完顺序</span>` +
      (st.order && st.order.length
        ? st.order.map((v) => `<code class="crs__chip crs__chip--done">${v}</code>`).join('')
        : `<span class="crs__empty">（空）</span>`)

    const doneSet = new Set(st.order || [])
    const queueSet = new Set(st.queue || [])
    const cycleSet = new Set(st.remaining || [])

    this.svgEl.querySelectorAll('.crs-node').forEach((g) => {
      const v = Number(g.dataset.v)
      g.classList.remove('is-current', 'is-neighbor', 'is-done', 'is-queued', 'is-cycle')
      if (doneSet.has(v)) g.classList.add('is-done')
      else if (queueSet.has(v)) g.classList.add('is-queued')
      if (v === st.cur) g.classList.add('is-current')
      if (v === st.nb) g.classList.add('is-neighbor')
      if (cycleSet.has(v)) g.classList.add('is-cycle')
      const indegEl = g.querySelector('.crs-indeg')
      if (indegEl) indegEl.textContent = `in:${st.indeg[v]}`
    })

    const processedSet = new Set(st.processed || [])
    this.svgEl.querySelectorAll('.crs-edge').forEach((line) => {
      const key = `${line.dataset.from}-${line.dataset.to}`
      line.classList.toggle(
        'is-active',
        Number(line.dataset.from) === st.cur && Number(line.dataset.to) === st.nb,
      )
      line.classList.toggle('is-used', processedSet.has(key))
    })
  }

  resultBanner(result) {
    if (result.canFinish) {
      return {
        kind: 'success',
        html: `🎉 可以学完全部 <strong>${result.n}</strong> 门课！一种合法的学习顺序是
          <code>${result.order.join(' → ')}</code>。`,
      }
    }
    return {
      kind: 'fail',
      html: `🚫 无法学完全部课程：课程 <strong>${result.remaining.join(
        ', ',
      )}</strong> 互相构成环（先修关系首尾相接），永远满足不了入度归零的条件。`,
    }
  }
}

export function mountViz(el, opts) {
  return new CourseScheduleViz(el, opts)
}

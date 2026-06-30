/*
 * 二叉树中的最大路径和「后序遍历 + 单边贡献」动画。
 *
 * 对每个节点，递归先算出它左右子树各自「最多能往上贡献多少」（负的就当 0，
 * 相当于宁可不带这条边）。用这两个贡献加上节点自己的值，就是「以这个节点为
 * 最高点、左右拐弯」的路径和——这是一个候选答案，随时刷新全局最大值。
 * 但往上汇报给父节点时，路径只能从一个方向进来，所以只能挑左右贡献较大的
 * 那一边，连同自己的值一起返回。整棵树后序遍历一遍，就是 O(n)。
 */
import { VizPlayer } from '../../components/viz-player/vizPlayer.js'

const MAX_N = 10

/* 把层序数组（null 表示空节点）建成二叉树，节点带自增 id 方便动画引用 */
function buildTree(values) {
  let idCounter = 0
  const makeNode = (val) => ({ id: `n${idCounter++}`, val, left: null, right: null })
  const root = makeNode(values[0])
  const queue = [root]
  let i = 1
  while (queue.length && i < values.length) {
    const parent = queue.shift()
    if (i < values.length) {
      const v = values[i++]
      if (v != null) {
        const node = makeNode(v)
        parent.left = node
        queue.push(node)
      }
    }
    if (i < values.length) {
      const v = values[i++]
      if (v != null) {
        const node = makeNode(v)
        parent.right = node
        queue.push(node)
      }
    }
  }
  return root
}

export class MaxPathSumViz extends VizPlayer {
  constructor(mountEl) {
    super(mountEl, {
      inputs: [
        {
          key: 'root',
          label: '层序遍历数组 root（逗号分隔，空节点写 null）',
          default: '-10,9,20,null,null,15,7',
          width: '22rem',
        },
      ],
      speed: 1100,
      hint: `提示：可改成你自己的层序遍历数组（空节点写 null），点「应用」重新演示（最多 ${MAX_N} 个节点）。`,
    })
  }

  parseInputs({ root }) {
    const raw = (root ?? '').trim()
    if (!raw) throw new Error('请输入层序遍历数组')
    const tokens = raw
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s !== '')
    if (!tokens.length) throw new Error('请输入层序遍历数组')
    if (tokens[0].toLowerCase() === 'null') throw new Error('根节点不能是 null')
    const values = tokens.map((t) => {
      if (t.toLowerCase() === 'null') return null
      const v = Number(t)
      if (!Number.isFinite(v)) throw new Error(`「${t}」不是合法数字或 null`)
      return Math.trunc(v)
    })
    const nodeCount = values.filter((v) => v != null).length
    if (nodeCount === 0) throw new Error('至少要有 1 个节点')
    if (nodeCount > MAX_N) throw new Error(`节点数最多 ${MAX_N} 个（当前 ${nodeCount} 个）`)
    const root_ = buildTree(values)
    return {
      root: root_,
      display: { root: values.map((v) => (v == null ? 'null' : String(v))).join(',') },
    }
  }

  computeSteps({ root }) {
    const steps = []
    const gainMap = new Map() // id -> 该节点往上汇报的「原始」贡献（可能是负数）
    const sideMap = new Map() // id -> 'L' | 'R' | null：往下延伸单边路径时走哪一边（贡献更大的那边）
    const pairMap = new Map() // id -> { leftG, rightG }：该节点计算拐弯路径和时实际用到的左右贡献
    const nodesById = new Map()
    const stack = []
    let runningMax = -Infinity
    let bestNodeId = null
    const snapMax = () => (runningMax === -Infinity ? null : runningMax)

    const dfs = (node) => {
      if (!node) return 0
      nodesById.set(node.id, node)
      stack.push(node.id)
      steps.push({
        kind: 'visit',
        id: node.id,
        stack: [...stack],
        maxSoFar: snapMax(),
        gainsSoFar: [...gainMap.entries()],
        msg: `后序遍历：先把左右子树都算完，再处理自己。现在进入节点 <strong>${node.val}</strong>。`,
      })

      const leftRaw = dfs(node.left)
      const rightRaw = dfs(node.right)
      const leftG = Math.max(0, leftRaw)
      const rightG = Math.max(0, rightRaw)
      const pathSum = node.val + leftG + rightG
      const improved = pathSum > runningMax
      if (improved) {
        runningMax = pathSum
        bestNodeId = node.id
      }
      const raw = node.val + Math.max(leftG, rightG)
      gainMap.set(node.id, raw)
      sideMap.set(node.id, leftG === 0 && rightG === 0 ? null : leftG >= rightG ? 'L' : 'R')
      pairMap.set(node.id, { leftG, rightG })

      steps.push({
        kind: 'compute',
        id: node.id,
        leftChildId: node.left?.id ?? null,
        rightChildId: node.right?.id ?? null,
        leftG,
        rightG,
        pathSum,
        improved,
        raw,
        stack: [...stack],
        maxSoFar: snapMax(),
        gainsSoFar: [...gainMap.entries()],
        msg:
          `节点 <strong>${node.val}</strong> 的左右子树都算完了：左边能带来 max(0, gainLeft) = ${leftG}，` +
          `右边能带来 max(0, gainRight) = ${rightG}。以它为「最高点」拐弯的路径和 = ` +
          `${node.val} + ${leftG} + ${rightG} = <strong>${pathSum}</strong>` +
          (improved
            ? `，刷新全局最大值 → <strong>${runningMax}</strong>。`
            : `，没超过当前最大值 ${runningMax}。`) +
          ` 但往上只能带一条边，汇报给父节点的贡献 = ${node.val} + max(${leftG}, ${rightG}) = ` +
          `<strong>${raw}</strong>${raw < 0 ? '（负数，父节点会当作 0，相当于不走这条边）' : ''}`,
      })

      stack.pop()
      return raw
    }

    dfs(root)

    // 回溯出真正取得最大值的那条路径：从 bestNode 往左、往右各自沿「贡献更大的一边」往下走
    const chainDown = (node) => {
      const ids = []
      let cur = node
      while (cur) {
        ids.push(cur.id)
        const side = sideMap.get(cur.id)
        cur = side === 'L' ? cur.left : side === 'R' ? cur.right : null
      }
      return ids
    }
    const bestNode = nodesById.get(bestNodeId)
    const { leftG: bestLeftG, rightG: bestRightG } = pairMap.get(bestNodeId)
    // 只有「真正被用上」的那一边（贡献 > 0）才算进最终路径，不能只看子节点存不存在
    const leftChain = bestLeftG > 0 ? chainDown(bestNode.left) : []
    const rightChain = bestRightG > 0 ? chainDown(bestNode.right) : []
    let pathIds
    if (leftChain.length && rightChain.length) {
      // 两边都拐弯：从左边最深处一路连到 bestNode，再连到右边最深处
      pathIds = [...leftChain.slice().reverse(), bestNode.id, ...rightChain]
    } else if (leftChain.length) {
      // 只用了左边：自然顺序从 bestNode 往下延伸
      pathIds = [bestNode.id, ...leftChain]
    } else if (rightChain.length) {
      pathIds = [bestNode.id, ...rightChain]
    } else {
      pathIds = [bestNode.id]
    }
    const pathVals = pathIds.map((id) => nodesById.get(id).val)

    return {
      steps,
      result: { maxSum: runningMax, bestNodeId, pathIds, pathVals },
    }
  }

  #layout(root) {
    let counter = 0
    const nodes = []
    const walk = (node, depth) => {
      if (!node) return
      walk(node.left, depth + 1)
      node.x = counter++
      node.y = depth
      nodes.push(node)
      walk(node.right, depth + 1)
    }
    walk(root, 0)
    return nodes
  }

  #geometry(nodes) {
    const colW = 64
    const rowH = 84
    const padX = 28
    const padTop = 36
    const n = nodes.length
    const maxDepth = Math.max(...nodes.map((nd) => nd.y))
    nodes.forEach((nd) => {
      nd.cx = nd.x * colW + colW / 2 + padX
      nd.cy = nd.y * rowH + padTop
    })
    return {
      W: n * colW + padX * 2,
      H: (maxDepth + 1) * rowH + padTop + 24,
    }
  }

  #svg(nodes) {
    const g = this.geo
    let edges = ''
    let nodesHtml = ''
    for (const nd of nodes) {
      if (nd.left)
        edges += `<line class="bts-edge" data-from="${nd.id}" data-to="${nd.left.id}" x1="${nd.cx}" y1="${nd.cy}" x2="${nd.left.cx}" y2="${nd.left.cy}"/>`
      if (nd.right)
        edges += `<line class="bts-edge" data-from="${nd.id}" data-to="${nd.right.id}" x1="${nd.cx}" y1="${nd.cy}" x2="${nd.right.cx}" y2="${nd.right.cy}"/>`
    }
    for (const nd of nodes) {
      nodesHtml += `<g class="bts-node" data-id="${nd.id}" transform="translate(${nd.cx},${nd.cy})">
        <circle class="bts-circle" r="21"/>
        <text class="bts-val">${nd.val}</text>
        <text class="bts-gain" y="36"></text>
      </g>`
    }
    return `<svg class="bts__svg" viewBox="0 0 ${g.W} ${g.H}" preserveAspectRatio="xMidYMid meet" role="img">
      <g class="bts-edges">${edges}</g>
      <g class="bts-nodes">${nodesHtml}</g>
    </svg>`
  }

  buildStage({ root }, el) {
    const nodes = this.#layout(root)
    this.nodesById = new Map(nodes.map((n) => [n.id, n]))
    this.geo = this.#geometry(nodes)
    el.innerHTML = `
      <div class="bts__stats"></div>
      <div class="bts__board">
        <div class="bts__treewrap">${this.#svg(nodes)}</div>
        <div class="bts__stack">
          <div class="bts__stack-label">调用栈（根 → 当前）</div>
          <ol class="bts__stack-list"></ol>
        </div>
      </div>
    `
    this.statsEl = el.querySelector('.bts__stats')
    this.svgEl = el.querySelector('.bts__svg')
    this.stackEl = el.querySelector('.bts__stack-list')
  }

  renderStep(st, { idx, total }) {
    // 重置
    this.svgEl.querySelectorAll('.bts-node').forEach((n) => {
      n.classList.remove('is-current', 'is-stack', 'is-best', 'is-src')
      const gainEl = n.querySelector('.bts-gain')
      gainEl.textContent = ''
      gainEl.classList.remove('is-neg')
    })
    this.svgEl.querySelectorAll('.bts-edge').forEach((e) => e.classList.remove('is-stack', 'is-best', 'is-src'))

    // 调用栈高亮（祖先 + 当前）
    const stack = st.stack ?? []
    stack.forEach((id) => {
      const n = this.svgEl.querySelector(`.bts-node[data-id="${id}"]`)
      if (n) n.classList.add(id === st.id ? 'is-current' : 'is-stack')
    })
    for (let i = 0; i < stack.length - 1; i++) {
      const edge = this.svgEl.querySelector(
        `.bts-edge[data-from="${stack[i]}"][data-to="${stack[i + 1]}"]`,
      )
      if (edge) edge.classList.add('is-stack')
    }

    // 已经算出贡献的节点，标注它往上汇报的值
    ;(st.gainsSoFar ?? []).forEach(([id, val]) => {
      const gainEl = this.svgEl.querySelector(`.bts-node[data-id="${id}"] .bts-gain`)
      if (gainEl) {
        gainEl.textContent = `gain=${val}`
        gainEl.classList.toggle('is-neg', val < 0)
      }
    })

    // compute 步：高亮正在被读取的左右子节点 / 边
    if (st.kind === 'compute') {
      ;[st.leftChildId, st.rightChildId].forEach((cid) => {
        if (!cid) return
        this.svgEl.querySelector(`.bts-node[data-id="${cid}"]`)?.classList.add('is-src')
        this.svgEl
          .querySelector(`.bts-edge[data-from="${st.id}"][data-to="${cid}"]`)
          ?.classList.add('is-src')
      })
    }

    // 最后一步：把最终最优路径整条高亮成金色
    if (idx === total - 1 && this.result) {
      const { pathIds } = this.result
      pathIds.forEach((id) => {
        const n = this.svgEl.querySelector(`.bts-node[data-id="${id}"]`)
        if (n) {
          n.classList.remove('is-current', 'is-stack', 'is-src')
          n.classList.add('is-best')
        }
      })
      for (let i = 0; i < pathIds.length - 1; i++) {
        const a = pathIds[i]
        const b = pathIds[i + 1]
        const edge =
          this.svgEl.querySelector(`.bts-edge[data-from="${a}"][data-to="${b}"]`) ||
          this.svgEl.querySelector(`.bts-edge[data-from="${b}"][data-to="${a}"]`)
        if (edge) {
          edge.classList.remove('is-stack', 'is-src')
          edge.classList.add('is-best')
        }
      }
    }

    // 统计行
    this.statsEl.innerHTML = `<span>当前已知最大路径和 <strong>${
      st.maxSoFar ?? '—'
    }</strong></span>`

    // 调用栈面板
    this.stackEl.innerHTML = stack.length
      ? stack
          .map(
            (id) =>
              `<li class="${id === st.id ? 'is-current' : ''}">${this.nodesById.get(id).val}</li>`,
          )
          .join('')
      : `<li class="bts__stack-empty">（空）</li>`
  }

  resultBanner(result) {
    return {
      kind: 'success',
      html: `🎉 最大路径和是 <strong>${result.maxSum}</strong>，最优路径是 <code>${result.pathVals.join(
        ' → ',
      )}</code>（金色高亮）。`,
    }
  }
}

export function mountViz(el, opts) {
  return new MaxPathSumViz(el, opts)
}

/*
 * 翻转二叉树「先交换、再递归」动画（前序 DFS）。
 *
 * 镜像一棵树可以拆成一句话：先把当前节点的左右孩子换个位置，
 * 再分别对换完之后的左子树、右子树做同样的事——直到遇到空节点为止。
 * 这正是递归三要素：终止条件（空节点直接返回）、单层逻辑（交换左右孩子）、
 * 子问题（对新的左/右子树重复同一件事）。
 *
 * 关键洞察：父子之间「谁连着谁」从头到尾都没变，变的只是某个节点
 * 「认谁当左孩子、认谁当右孩子」。所以动画里连线的两端节点不变，
 * 只是交换发生时，两棵子树会在水平方向上互换位置——这正是「镜像」的视觉本质。
 */
import { VizPlayer } from '../../components/viz-player/vizPlayer.js'

const MAX_N = 10

// 把 LeetCode 层序数组（null 表示空节点，空节点不再展开子节点）建成 id -> 节点 的映射
function buildTree(tokens) {
  const state = {}
  if (!tokens.length || tokens[0] === null) return { state, rootId: null }
  let nextId = 0
  const rootId = nextId++
  state[rootId] = { val: tokens[0], left: null, right: null }
  const queue = [rootId]
  let i = 1
  while (queue.length && i < tokens.length) {
    const parentId = queue.shift()
    for (const side of ['left', 'right']) {
      if (i >= tokens.length) break
      const v = tokens[i++]
      if (v !== null) {
        const cid = nextId++
        state[cid] = { val: v, left: null, right: null }
        state[parentId][side] = cid
        queue.push(cid)
      }
    }
  }
  return { state, rootId }
}

// 深度（y 坐标）与「连着谁」的边集合：两者在交换左右孩子的过程中都不会变化，只算一次
function depthsAndEdges(state, rootId) {
  const depth = {}
  const edges = []
  let maxDepth = 0
  if (rootId == null) return { depth, edges, maxDepth }
  const stack = [[rootId, 0]]
  while (stack.length) {
    const [id, d] = stack.pop()
    depth[id] = d
    if (d > maxDepth) maxDepth = d
    const node = state[id]
    if (node.left != null) {
      edges.push({ a: id, b: node.left })
      stack.push([node.left, d + 1])
    }
    if (node.right != null) {
      edges.push({ a: id, b: node.right })
      stack.push([node.right, d + 1])
    }
  }
  return { depth, edges, maxDepth }
}

function cloneState(state) {
  const out = {}
  for (const id in state) out[id] = { ...state[id] }
  return out
}

// LeetCode 风格层序输出：含中间空位，去掉末尾多余的 null
function serializeLevelOrder(state, rootId) {
  if (rootId == null) return []
  const out = []
  const queue = [rootId]
  while (queue.length) {
    const id = queue.shift()
    if (id == null) {
      out.push(null)
      continue
    }
    const node = state[id]
    out.push(node.val)
    queue.push(node.left)
    queue.push(node.right)
  }
  while (out.length && out[out.length - 1] === null) out.pop()
  return out
}

function fmtArr(arr) {
  return `[${arr.map((v) => (v === null ? 'null' : v)).join(',')}]`
}

export class InvertTreeViz extends VizPlayer {
  constructor(mountEl) {
    super(mountEl, {
      inputs: [
        {
          key: 'tree',
          label: '二叉树（层序，逗号分隔，null 表示空，如 4,2,7,1,3,6,9）',
          default: '4,2,7,1,3,6,9',
          width: '22rem',
        },
      ],
      speed: 1000,
      hint: `提示：可改成你自己的树，点「应用」重新演示（最多 ${MAX_N} 个节点；空树输入 [] ）。`,
    })
  }

  parseInputs({ tree }) {
    const raw = (tree ?? '').trim()
    if (raw === '' || raw === '[]') {
      return { tokens: [], nodeCount: 0, display: { tree: '[]' } }
    }
    const cleaned = raw.replace(/^\[/, '').replace(/\]$/, '')
    const parts = cleaned.split(',').map((s) => s.trim())
    const tokens = parts.map((s) => {
      if (s === '' || s.toLowerCase() === 'null' || s === '#') return null
      const v = Number(s)
      if (!Number.isFinite(v) || !Number.isInteger(v)) throw new Error(`「${s}」不是合法整数`)
      if (v < -100 || v > 100) throw new Error(`节点值 ${v} 超出范围 [-100, 100]`)
      return v
    })
    if (tokens[0] === null) {
      return { tokens: [], nodeCount: 0, display: { tree: '[]' } }
    }
    const nodeCount = tokens.filter((t) => t !== null).length
    if (nodeCount > MAX_N) throw new Error(`节点数最多 ${MAX_N} 个，方便看清动画`)
    return { tokens, nodeCount, display: { tree: parts.join(',') } }
  }

  computeSteps({ tokens }) {
    const { state: initState, rootId } = buildTree(tokens)
    if (rootId == null) {
      return {
        steps: [
          {
            kind: 'empty',
            id: null,
            snapshot: {},
            msg: '树是空的（<code>root = null</code>），直接返回 <code>null</code>。',
          },
        ],
        result: [],
      }
    }

    const state = cloneState(initState)
    const steps = []

    const dfs = (id) => {
      if (id == null) return
      const node = state[id]
      steps.push({
        kind: 'visit',
        id,
        snapshot: cloneState(state),
        msg: `递归进入节点 <strong>${node.val}</strong>。`,
      })
      if (node.left != null || node.right != null) {
        const tmp = node.left
        node.left = node.right
        node.right = tmp
        steps.push({
          kind: 'swap',
          id,
          snapshot: cloneState(state),
          msg: `交换节点 <strong>${node.val}</strong> 的左右孩子——原来的左子树现在挂到右边，原来的右子树现在挂到左边。`,
        })
      } else {
        steps.push({
          kind: 'leaf',
          id,
          snapshot: cloneState(state),
          msg: `节点 <strong>${node.val}</strong> 是叶子节点，没有孩子可交换，直接返回。`,
        })
      }
      dfs(node.left)
      dfs(node.right)
    }

    dfs(rootId)
    steps.push({
      kind: 'done',
      id: null,
      snapshot: cloneState(state),
      msg: '递归全部返回，整棵树都翻转完成了！',
    })

    const result = serializeLevelOrder(state, rootId)
    return { steps, result }
  }

  buildStage({ tokens, nodeCount }, el) {
    const { state: initState, rootId } = buildTree(tokens)
    this.rootId = rootId

    if (rootId == null) {
      el.innerHTML = `<p class="ibt__empty">这是一棵空树，<code>root = null</code>，翻转之后还是空树。</p>`
      this.isEmpty = true
      return
    }
    this.isEmpty = false

    const { depth, edges, maxDepth } = depthsAndEdges(initState, rootId)
    this.depth = depth

    const colW = 64
    const rowH = 84
    const padX = 36
    const padY = 44
    const R = 22
    this.geo = { colW, rowH, padX, padY }
    const W = Math.max(nodeCount, 1) * colW + padX * 2
    const H = (maxDepth + 1) * rowH + padY * 2

    const nodesHtml = Object.keys(initState)
      .map(
        (id) => `
        <g class="ibt-node" data-id="${id}">
          <circle class="ibt-circle" r="${R}"/>
          <text class="ibt-val">${initState[id].val}</text>
        </g>`,
      )
      .join('')
    const edgesHtml = edges
      .map((e) => `<line class="ibt-edge" data-a="${e.a}" data-b="${e.b}"/>`)
      .join('')

    el.innerHTML = `
      <div class="ibt__chartwrap">
        <svg class="ibt__svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" role="img">
          <g class="ibt-edges">${edgesHtml}</g>
          <g class="ibt-nodes">${nodesHtml}</g>
        </svg>
      </div>
    `

    this.svgEl = el.querySelector('.ibt__svg')
    this.edgeEls = [...this.svgEl.querySelectorAll('.ibt-edge')].map((line) => ({
      a: line.dataset.a,
      b: line.dataset.b,
      el: line,
    }))
    this.nodeEls = new Map(
      [...this.svgEl.querySelectorAll('.ibt-node')].map((g) => [g.dataset.id, g]),
    )
  }

  // 中序遍历当前快照定 x（横向顺序），y 用预先算好、不会变的深度
  #layout(snapshot) {
    const xOf = {}
    let i = 0
    const inorder = (id) => {
      if (id == null) return
      inorder(snapshot[id].left)
      xOf[id] = i++
      inorder(snapshot[id].right)
    }
    inorder(this.rootId)
    const { colW, rowH, padX, padY } = this.geo
    const pos = {}
    for (const id in xOf) {
      pos[id] = {
        x: xOf[id] * colW + colW / 2 + padX,
        y: this.depth[id] * rowH + rowH / 2 + padY,
      }
    }
    return pos
  }

  renderStep(st) {
    if (this.isEmpty) return
    const pos = this.#layout(st.snapshot)
    const curId = st.id != null ? String(st.id) : null

    this.edgeEls.forEach(({ a, b, el }) => {
      const pa = pos[a]
      const pb = pos[b]
      if (!pa || !pb) return
      el.setAttribute('x1', pa.x)
      el.setAttribute('y1', pa.y)
      el.setAttribute('x2', pb.x)
      el.setAttribute('y2', pb.y)
      el.classList.toggle('is-swap', st.kind === 'swap' && curId != null && (a === curId || b === curId))
    })

    this.nodeEls.forEach((g, id) => {
      const p = pos[id]
      if (!p) return
      g.setAttribute('transform', `translate(${p.x},${p.y})`)
      const circle = g.querySelector('.ibt-circle')
      const isCurrent = id === curId
      circle.classList.toggle('is-current', isCurrent && st.kind === 'visit')
      circle.classList.toggle('is-swap', isCurrent && st.kind === 'swap')
      circle.classList.toggle('is-leaf', isCurrent && st.kind === 'leaf')
      circle.classList.toggle('is-final', st.kind === 'done')
    })
  }

  resultBanner(result, state) {
    if (state.nodeCount === 0) {
      return {
        kind: 'info',
        html: '空树翻转后还是空树，直接返回 <code>null</code>。',
      }
    }
    const { state: initState, rootId } = buildTree(state.tokens)
    const before = serializeLevelOrder(initState, rootId)
    return {
      kind: 'success',
      html: `🎉 翻转完成！输入 <code>${fmtArr(before)}</code> → 输出 <code>${fmtArr(
        result,
      )}</code>，每个节点的左右孩子都互换了位置。`,
    }
  }
}

export function mountViz(el, opts) {
  return new InvertTreeViz(el, opts)
}

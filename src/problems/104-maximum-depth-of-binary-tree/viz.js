/*
 * 二叉树的最大深度「后序递归」动画。
 *
 * 「深度」其实是个递归定义：一个空节点深度是 0；一个非空节点的深度，
 * 是「它左子树的深度」和「它右子树的深度」里更大的那个，再加上自己这一层。
 * 所以用后序遍历——先递归算出左子树深度、再算出右子树深度，最后用
 * depth = 1 + max(left, right) 把两个子答案合并成当前节点的答案，一路把结果
 * 从叶子「传」回根节点，根节点算完就是整棵树的最大深度。
 */
import { VizPlayer } from '../../components/viz-player/vizPlayer.js'

const MAX_N = 10

// 把 LeetCode 层序数组（null 表示空节点，空节点不再展开子节点）建成树
function buildTree(values) {
  if (values.length === 0 || values[0] === null) return { root: null, nodes: [] }
  let idCounter = 0
  const make = (v) => ({ id: idCounter++, val: v, left: null, right: null, x: 0, y: 0 })
  const slots = values.map((v) => (v === null ? null : make(v)))
  let ci = 1
  for (let i = 0; i < slots.length && ci < slots.length; i++) {
    if (!slots[i]) continue
    slots[i].left = slots[ci] ?? null
    ci++
    if (ci < slots.length) {
      slots[i].right = slots[ci] ?? null
      ci++
    }
  }
  const nodes = slots.filter(Boolean)
  return { root: slots[0], nodes }
}

// 中序遍历定 x（横向顺序好看），深度定 y
function layout(root) {
  let x = 0
  function inorder(node, depth) {
    if (!node) return
    inorder(node.left, depth + 1)
    node.x = x++
    node.y = depth
    inorder(node.right, depth + 1)
  }
  inorder(root, 0)
}

export class MaxDepthViz extends VizPlayer {
  constructor(mountEl) {
    super(mountEl, {
      inputs: [
        {
          key: 'tree',
          label: '层序遍历（LeetCode 格式，null 表示空，逗号分隔）',
          default: '3,9,20,null,null,15,7',
          width: '22rem',
        },
      ],
      speed: 1100,
      hint: `提示：可改成你自己的树，点「应用」重新演示（最多 ${MAX_N} 个节点；如 1,null,2）。`,
    })
  }

  parseInputs({ tree }) {
    const tokens = (tree ?? '')
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s !== '')
    if (!tokens.length) throw new Error('请输入层序遍历数组')
    const values = tokens.map((s) => {
      if (s.toLowerCase() === 'null') return null
      const v = Number(s)
      if (!Number.isFinite(v) || !Number.isInteger(v)) throw new Error(`「${s}」不是合法整数`)
      return v
    })
    const count = values.filter((v) => v !== null).length
    if (count > MAX_N) throw new Error(`节点数最多 ${MAX_N} 个`)
    return {
      tree: values,
      display: { tree: values.map((v) => (v === null ? 'null' : v)).join(',') },
    }
  }

  computeSteps({ tree }) {
    const { root, nodes } = buildTree(tree)
    this._nodes = nodes
    this._root = root
    layout(root)

    if (!root) {
      return {
        steps: [{ kind: 'empty', stack: [], done: {}, msg: '树是空的（<code>root = null</code>），最大深度直接是 <strong>0</strong>。' }],
        result: 0,
      }
    }

    const steps = []
    const done = {}
    const stack = []

    const dfs = (node) => {
      stack.push(node.id)
      steps.push({
        kind: 'enter',
        id: node.id,
        stack: [...stack],
        done: { ...done },
        msg: `递归进入节点 <strong>${node.val}</strong>：先算它左子树的深度，再算右子树的深度，自己先「挂起」等结果。`,
      })
      const leftDepth = node.left ? dfs(node.left) : 0
      const rightDepth = node.right ? dfs(node.right) : 0
      const depth = 1 + Math.max(leftDepth, rightDepth)
      done[node.id] = depth
      steps.push({
        kind: 'exit',
        id: node.id,
        stack: [...stack],
        done: { ...done },
        leftDepth,
        rightDepth,
        depth,
        msg: `节点 <strong>${node.val}</strong>：左子树深度 ${leftDepth}，右子树深度 ${rightDepth} →
          depth = 1 + max(${leftDepth}, ${rightDepth}) = <strong>${depth}</strong>，把这个结果交还给上一层。`,
      })
      stack.pop()
      return depth
    }

    const result = dfs(root)
    return { steps, result }
  }

  buildStage(state, el) {
    const nodes = this._nodes
    el.innerHTML = `
      <div class="md__info"></div>
      <div class="md__chartwrap"></div>
      <div class="md__stacklabel">递归栈（从下到上，栈顶正在处理）</div>
      <div class="md__stack"></div>
    `
    this.infoEl = el.querySelector('.md__info')
    this.chartEl = el.querySelector('.md__chartwrap')
    this.stackEl = el.querySelector('.md__stack')

    if (!nodes.length) {
      this.chartEl.innerHTML = `<p class="md__empty">（空树）</p>`
      this.nodeEls = {}
      return
    }

    const colW = 64
    const rowH = 84
    const padX = 36
    const padY = 44
    const maxX = Math.max(...nodes.map((n) => n.x))
    const maxY = Math.max(...nodes.map((n) => n.y))
    const cx = (n) => padX + n.x * colW + colW / 2
    const cy = (n) => padY + n.y * rowH + 24
    const W = (maxX + 1) * colW + padX * 2
    const H = (maxY + 1) * rowH + padY * 2

    let edges = ''
    let circles = ''
    for (const n of nodes) {
      if (n.left)
        edges += `<line class="md-edge" data-from="${n.id}" data-to="${n.left.id}" x1="${cx(n)}" y1="${cy(n)}" x2="${cx(n.left)}" y2="${cy(n.left)}"/>`
      if (n.right)
        edges += `<line class="md-edge" data-from="${n.id}" data-to="${n.right.id}" x1="${cx(n)}" y1="${cy(n)}" x2="${cx(n.right)}" y2="${cy(n.right)}"/>`
    }
    for (const n of nodes) {
      circles += `
        <g class="md-node" data-id="${n.id}">
          <circle class="md-circle" cx="${cx(n)}" cy="${cy(n)}" r="22"/>
          <text class="md-val" x="${cx(n)}" y="${cy(n)}">${n.val}</text>
          <text class="md-depth" x="${cx(n)}" y="${cy(n) - 32}">深度 0</text>
        </g>`
    }

    this.chartEl.innerHTML = `<svg class="md__svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" role="img">
      <g class="md-edges">${edges}</g>
      <g class="md-nodes">${circles}</g>
    </svg>`

    this.nodeEls = {}
    this.depthEls = {}
    this.chartEl.querySelectorAll('.md-node').forEach((g) => {
      this.nodeEls[g.dataset.id] = g.querySelector('.md-circle')
      this.depthEls[g.dataset.id] = g.querySelector('.md-depth')
    })
  }

  renderStep(st, { idx, total }) {
    if (st.kind === 'empty') {
      this.infoEl.innerHTML = '空树，最大深度规定为 0。'
      this.stackEl.innerHTML = `<span class="md__empty">（空）</span>`
      return
    }

    const isLast = idx === total - 1
    Object.values(this.nodeEls).forEach((c) => c.classList.remove('is-current', 'is-stack', 'is-best'))
    Object.values(this.depthEls).forEach((d) => d.classList.remove('is-done'))

    const stack = st.stack
    stack.slice(0, -1).forEach((id) => this.nodeEls[id]?.classList.add('is-stack'))
    const curId = stack[stack.length - 1]
    this.nodeEls[curId]?.classList.add(isLast ? 'is-best' : 'is-current')

    Object.entries(st.done).forEach(([id, depth]) => {
      const depthEl = this.depthEls[id]
      if (!depthEl) return
      depthEl.textContent = `深度 ${depth}`
      depthEl.classList.add('is-done')
    })

    this.infoEl.innerHTML =
      st.kind === 'enter'
        ? `正在递归展开节点 <strong>${this._nodes.find((n) => n.id === st.id)?.val}</strong>……`
        : `节点 <strong>${this._nodes.find((n) => n.id === st.id)?.val}</strong> 算完了，深度 = <strong>${st.depth}</strong>`

    this.stackEl.innerHTML = stack.length
      ? stack.map((id) => `<code class="md__chip">${this._nodes.find((n) => n.id === id)?.val}</code>`).join('')
      : `<span class="md__empty">（空）</span>`
  }

  resultBanner(result) {
    return {
      kind: 'success',
      html: `🎉 递归从叶子一路把深度传回根节点，整棵树的最大深度是 <strong>${result}</strong>。`,
    }
  }
}

export function mountViz(el, opts) {
  return new MaxDepthViz(el, opts)
}

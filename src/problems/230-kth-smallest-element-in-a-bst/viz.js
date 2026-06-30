/*
 * 二叉搜索树中第 K 小的元素「中序遍历 + 显式栈、提前停止」动画。
 *
 * BST 的核心性质：中序遍历（左 → 根 → 右）天然产出一个从小到大排好序的序列。
 * 所以不需要把整棵树都遍历完、排好序再取第 k 个——只要一边做中序遍历，
 * 一边数「这是第几个被访问到的节点」，数到第 k 个就立刻停下，它就是答案。
 * 用一个显式栈模拟：先一路往左压栈到底，弹出栈顶就是「当前最小的还没访问过的节点」，
 * 计数 +1；不是第 k 个就转向它的右子树，继续“往左压栈到底 → 弹出”的循环。
 */
import { VizPlayer } from '../../components/viz-player/vizPlayer.js'

const MAX_N = 10

// 把 LeetCode 层序数组（null 表示空节点，空节点不再展开子节点）建成树，顺便给每个节点分配 id
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

// 中序遍历定 x（横向顺序天然就是「从小到大」），深度定 y
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

export class KthSmallestViz extends VizPlayer {
  constructor(mountEl) {
    super(mountEl, {
      inputs: [
        {
          key: 'tree',
          label: '层序遍历（LeetCode 格式，null 表示空，逗号分隔）',
          default: '5,3,6,2,4,null,null,1',
          width: '22rem',
        },
        { key: 'k', label: 'k（从 1 开始）', default: '3', width: '5rem' },
      ],
      speed: 1200,
      hint: `提示：可改成你自己的二叉搜索树和 k，点「应用」重新演示（最多 ${MAX_N} 个节点）。`,
    })
  }

  parseInputs({ tree, k }) {
    const tokens = (tree ?? '')
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s !== '')
    if (!tokens.length) throw new Error('请输入层序遍历数组')
    const values = tokens.map((s) => {
      if (s.toLowerCase() === 'null') return null
      const v = Number(s)
      if (!Number.isFinite(v) || !Number.isInteger(v) || v < 0) throw new Error(`「${s}」不是合法的非负整数节点值`)
      return v
    })
    if (values[0] === null) throw new Error('根节点不能是 null')
    const count = values.filter((v) => v !== null).length
    if (count > MAX_N) throw new Error(`节点数最多 ${MAX_N} 个（当前 ${count} 个）`)

    const kNum = Math.trunc(Number(k))
    if (!Number.isFinite(kNum) || kNum < 1) throw new Error('k 必须是 ≥ 1 的整数')
    if (kNum > count) throw new Error(`k = ${kNum} 超过节点总数 ${count}`)

    return {
      tree: values,
      k: kNum,
      display: { tree: values.map((v) => (v === null ? 'null' : v)).join(','), k: String(kNum) },
    }
  }

  computeSteps({ tree, k }) {
    const { root, nodes } = buildTree(tree)
    this._nodes = nodes
    this._root = root
    layout(root)

    const steps = []
    const stack = []
    const visited = []
    let cur = root
    let count = 0
    let result = null

    while (cur || stack.length) {
      while (cur) {
        stack.push(cur)
        steps.push({
          kind: 'push',
          curId: cur.id,
          curVal: cur.val,
          stackIds: stack.map((n) => n.id),
          visited: [...visited],
          count,
          msg: `指针走到 <strong>${cur.val}</strong>，它可能还有更小的节点在左子树里 → 先压栈，继续往左走。`,
        })
        cur = cur.left
      }
      const node = stack.pop()
      count++
      const isAnswer = count === k
      visited.push({ id: node.id, order: count })
      steps.push({
        kind: 'pop',
        visitId: node.id,
        visitVal: node.val,
        stackIds: stack.map((n) => n.id),
        visited: [...visited],
        count,
        isAnswer,
        msg: isAnswer
          ? `栈顶 <strong>${node.val}</strong> 出栈——左子树已经访问完，它是目前最小的剩余节点，是第 <strong>${count}</strong> 个被访问到的，正好等于 k=${k}，<strong>就是答案！</strong>`
          : `栈顶 <strong>${node.val}</strong> 出栈，是第 ${count} 个被访问到的节点（还没到第 k=${k} 个）。它的左子树已访问完，转向右子树继续找比它大的下一个。`,
      })
      if (isAnswer) {
        result = { value: node.val, id: node.id }
        break
      }
      cur = node.right
    }

    return { steps, result }
  }

  buildStage(state, el) {
    const nodes = this._nodes
    el.innerHTML = `
      <div class="kth__info"></div>
      <div class="kth__layout">
        <div class="kth__chartwrap"></div>
        <div class="kth__stackpanel">
          <div class="kth__stacklabel">栈（栈顶在最上面）</div>
          <div class="kth__stack"></div>
        </div>
      </div>
    `
    this.infoEl = el.querySelector('.kth__info')
    this.chartEl = el.querySelector('.kth__chartwrap')
    this.stackEl = el.querySelector('.kth__stack')

    const colW = 60
    const rowH = 78
    const padX = 36
    const padY = 32
    const maxX = Math.max(0, ...nodes.map((n) => n.x))
    const maxY = Math.max(0, ...nodes.map((n) => n.y))
    const cx = (n) => padX + n.x * colW + colW / 2
    const cy = (n) => padY + n.y * rowH + 24
    this.geo = { cx, cy }
    const W = (maxX + 1) * colW + padX * 2
    const H = (maxY + 1) * rowH + padY * 2

    let edges = ''
    let circles = ''
    for (const n of nodes) {
      if (n.left) edges += `<line class="kth-edge" x1="${cx(n)}" y1="${cy(n)}" x2="${cx(n.left)}" y2="${cy(n.left)}"/>`
      if (n.right)
        edges += `<line class="kth-edge" x1="${cx(n)}" y1="${cy(n)}" x2="${cx(n.right)}" y2="${cy(n.right)}"/>`
    }
    for (const n of nodes) {
      circles += `
        <g class="kth-node" data-id="${n.id}">
          <circle class="kth-circle" cx="${cx(n)}" cy="${cy(n)}" r="22"/>
          <text class="kth-val" x="${cx(n)}" y="${cy(n)}">${n.val}</text>
          <text class="kth-order" x="${cx(n)}" y="${cy(n) - 30}"></text>
        </g>`
    }

    this.chartEl.innerHTML = `<svg class="kth__svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" role="img">
      <g class="kth-edges">${edges}</g>
      <g class="kth-nodes">${circles}</g>
    </svg>`

    this.nodeEls = {}
    this.orderEls = {}
    this.chartEl.querySelectorAll('.kth-node').forEach((g) => {
      this.nodeEls[g.dataset.id] = g.querySelector('.kth-circle')
      this.orderEls[g.dataset.id] = g.querySelector('.kth-order')
    })
  }

  renderStep(st, { state }) {
    Object.values(this.nodeEls).forEach((c) => c.classList.remove('is-current', 'is-stack', 'is-visited', 'is-answer'))
    Object.values(this.orderEls).forEach((t) => (t.textContent = ''))

    // 已访问过的节点，标上「第几个」
    st.visited.forEach(({ id, order }) => {
      this.nodeEls[id]?.classList.add('is-visited')
      if (this.orderEls[id]) this.orderEls[id].textContent = `#${order}`
    })
    // 栈里还在等待处理的节点
    st.stackIds.forEach((id) => this.nodeEls[id]?.classList.add('is-stack'))
    // 当前指针 / 正在出栈的节点
    const curId = st.kind === 'push' ? st.curId : st.visitId
    const curEl = this.nodeEls[curId]
    if (curEl) {
      curEl.classList.remove('is-stack')
      curEl.classList.add(st.isAnswer ? 'is-answer' : 'is-current')
    }

    this.infoEl.innerHTML = `已访问 <strong>${st.count}</strong> 个节点　/　目标第 <strong>k = ${state.k}</strong> 小`

    this.stackEl.innerHTML = st.stackIds.length
      ? [...st.stackIds]
          .reverse()
          .map((id, i) => {
            const node = this._nodes.find((n) => n.id === id)
            return `<code class="kth__chip${i === 0 ? ' is-top' : ''}">${node.val}</code>`
          })
          .join('')
      : `<span class="kth__empty">（空）</span>`
  }

  resultBanner(result, state) {
    if (!result) {
      return {
        kind: 'fail',
        html: `🚫 没有找到第 ${state.k} 小的元素（请确认 k 不超过节点总数）。`,
      }
    }
    return {
      kind: 'success',
      html: `🎉 中序遍历第 <strong>${state.k}</strong> 个被访问到的节点值是 <strong>${result.value}</strong> → 这就是第 k 小的元素。`,
    }
  }
}

export function mountViz(el, opts) {
  return new KthSmallestViz(el, opts)
}

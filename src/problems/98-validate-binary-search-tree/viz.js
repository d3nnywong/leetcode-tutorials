/*
 * 验证二叉搜索树「区间收缩」动画。
 *
 * 只看「左子节点 < 父节点 < 右子节点」是不够的——一个深层节点也必须满足
 * 「比它所有祖先划定的区间」，不只是比它的直接父节点。
 * 解法：每个节点带着一对允许区间 (low, high) 出发，根节点是 (−∞, +∞)；
 * 往左走，区间的上界收紧成父节点的值；往右走，下界收紧成父节点的值。
 * 用一个显式栈模拟先序遍历（先压右子节点、再压左子节点，保证左子树先弹出处理），
 * 任何一个节点的值跳出了自己的区间，整棵树就不是合法 BST。
 */
import { VizPlayer } from '../../components/viz-player/vizPlayer.js'

const MAX_N = 10

function fmtNum(v) {
  if (v === Infinity) return '+∞'
  if (v === -Infinity) return '−∞'
  return String(v)
}

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

// 中序遍历定 x（保证横向顺序和「左小右大」的直觉一致），深度定 y
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

export class ValidateBstViz extends VizPlayer {
  constructor(mountEl) {
    super(mountEl, {
      inputs: [
        {
          key: 'tree',
          label: '层序遍历（LeetCode 格式，null 表示空，逗号分隔）',
          default: '5,1,4,null,null,3,6',
          width: '22rem',
        },
      ],
      speed: 1300,
      hint: `提示：可改成你自己的树，点「应用」重新演示（最多 ${MAX_N} 个节点；如 2,1,3）。`,
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
    if (values[0] === null) throw new Error('根节点不能是 null')
    const count = values.filter((v) => v !== null).length
    if (count > MAX_N) throw new Error(`节点数最多 ${MAX_N} 个`)
    return { tree: values, display: { tree: values.map((v) => (v === null ? 'null' : v)).join(',') } }
  }

  computeSteps({ tree }) {
    const { root, nodes } = buildTree(tree)
    this._nodes = nodes
    this._root = root
    layout(root)

    if (!root) {
      return { steps: [{ kind: 'empty', msg: '空树，规定为合法的二叉搜索树。' }], result: { ok: true, failedId: null } }
    }

    const steps = []
    const stack = [{ node: root, low: -Infinity, high: Infinity }]
    const visited = []
    let ok = true
    let failedId = null

    while (stack.length) {
      const { node, low, high } = stack.pop()
      const inRange = node.val > low && node.val < high
      steps.push({
        kind: 'visit',
        id: node.id,
        val: node.val,
        low,
        high,
        ok: inRange,
        visited: [...visited],
        stackSnapshot: [...stack].reverse().map((s) => ({ val: s.node.val, low: s.low, high: s.high })),
        msg: inRange
          ? `检查节点 <strong>${node.val}</strong>：要求落在区间 <code>(${fmtNum(low)}, ${fmtNum(
              high,
            )})</code> 内，${node.val} 满足 → 合法。把它的左右子节点（带上各自收紧后的区间）压栈继续检查。`
          : `检查节点 <strong>${node.val}</strong>：要求落在区间 <code>(${fmtNum(low)}, ${fmtNum(
              high,
            )})</code> 内，但 ${node.val} 不满足 → <strong>不是有效二叉搜索树！</strong>`,
      })
      if (!inRange) {
        ok = false
        failedId = node.id
        break
      }
      visited.push(node.id)
      // 先压右、再压左，左子树先被弹出处理（模拟先序遍历）
      if (node.right) stack.push({ node: node.right, low: node.val, high })
      if (node.left) stack.push({ node: node.left, low, high: node.val })
    }

    if (ok) steps[steps.length - 1].allDone = true
    return { steps, result: { ok, failedId } }
  }

  buildStage(state, el) {
    const nodes = this._nodes
    el.innerHTML = `
      <div class="vbt__info"></div>
      <div class="vbt__chartwrap"></div>
      <div class="vbt__stacklabel">待检查栈（顶部最先处理）</div>
      <div class="vbt__stack"></div>
    `
    this.infoEl = el.querySelector('.vbt__info')
    this.chartEl = el.querySelector('.vbt__chartwrap')
    this.stackEl = el.querySelector('.vbt__stack')

    if (!nodes.length) {
      this.chartEl.innerHTML = `<p class="vbt__empty">（空树）</p>`
      this.nodeEls = {}
      return
    }

    const colW = 64
    const rowH = 78
    const padX = 36
    const padY = 32
    const maxX = Math.max(...nodes.map((n) => n.x))
    const maxY = Math.max(...nodes.map((n) => n.y))
    const cx = (n) => padX + n.x * colW + colW / 2
    const cy = (n) => padY + n.y * rowH + 24
    this.geo = { cx, cy }
    const W = (maxX + 1) * colW + padX * 2
    const H = (maxY + 1) * rowH + padY * 2

    let edges = ''
    let circles = ''
    for (const n of nodes) {
      if (n.left) edges += `<line class="vbt-edge" x1="${cx(n)}" y1="${cy(n)}" x2="${cx(n.left)}" y2="${cy(n.left)}"/>`
      if (n.right)
        edges += `<line class="vbt-edge" x1="${cx(n)}" y1="${cy(n)}" x2="${cx(n.right)}" y2="${cy(n.right)}"/>`
    }
    for (const n of nodes) {
      circles += `
        <g class="vbt-node" data-id="${n.id}">
          <circle class="vbt-circle" cx="${cx(n)}" cy="${cy(n)}" r="22"/>
          <text class="vbt-val" x="${cx(n)}" y="${cy(n)}">${n.val}</text>
        </g>`
    }

    this.chartEl.innerHTML = `<svg class="vbt__svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" role="img">
      <g class="vbt-edges">${edges}</g>
      <g class="vbt-nodes">${circles}</g>
    </svg>`

    this.nodeEls = {}
    this.chartEl.querySelectorAll('.vbt-node').forEach((g) => {
      this.nodeEls[g.dataset.id] = g.querySelector('.vbt-circle')
    })
  }

  renderStep(st) {
    if (st.kind === 'empty') {
      this.infoEl.innerHTML = '空树，规定为合法的二叉搜索树。'
      this.stackEl.innerHTML = `<span class="vbt__empty">（空）</span>`
      return
    }

    Object.values(this.nodeEls).forEach((c) =>
      c.classList.remove('is-current', 'is-visited', 'is-fail', 'is-success'),
    )

    st.visited.forEach((id) => this.nodeEls[id]?.classList.add(st.allDone ? 'is-success' : 'is-visited'))
    if (st.ok) {
      this.nodeEls[st.id]?.classList.add(st.allDone ? 'is-success' : 'is-current')
    } else {
      this.nodeEls[st.id]?.classList.add('is-fail')
    }

    this.infoEl.innerHTML = `当前检查节点 <strong>${st.val}</strong>　要求区间 <code>(${fmtNum(
      st.low,
    )}, ${fmtNum(st.high)})</code>`

    this.stackEl.innerHTML = st.stackSnapshot.length
      ? st.stackSnapshot
          .map((s) => `<code class="vbt__chip">节点 ${s.val} ∈ (${fmtNum(s.low)}, ${fmtNum(s.high)})</code>`)
          .join('')
      : `<span class="vbt__empty">（空）</span>`
  }

  resultBanner(result) {
    if (result.ok) {
      return {
        kind: 'success',
        html: `🎉 每个节点都落在祖先们划定的区间里 → 这是一棵<strong>有效</strong>的二叉搜索树，返回 <code>true</code>。`,
      }
    }
    return {
      kind: 'fail',
      html: `🚫 节点 <strong>${
        this._nodes.find((n) => n.id === result.failedId)?.val
      }</strong> 跳出了它应该落在的区间 → <strong>不是</strong>有效的二叉搜索树，返回 <code>false</code>。`,
    }
  }
}

export function mountViz(el, opts) {
  return new ValidateBstViz(el, opts)
}

/*
 * 二叉搜索树最近公共祖先「沿路比大小」动画。
 *
 * 普通二叉树找最近公共祖先要递归地在左右子树里搜，但这是一棵<strong>二叉搜索树</strong>——
 * 左子树全部更小、右子树全部更大，这条性质可以直接当「导航」用：
 * 从根出发，p、q 都比当前节点小 → 答案一定在左子树，往左走；
 * 都比当前节点大 → 答案一定在右子树，往右走；
 * 一旦两者不再同侧（一个 ≤ 当前节点、一个 ≥ 当前节点，或者当前节点正好就是 p / q 本身），
 * 说明从这个节点开始 p、q 就要分家了——这里就是最近公共祖先。
 * 不需要回溯、不需要额外空间，沿着一条路径一路走到底，O(h)。
 */
import { VizPlayer } from '../../components/viz-player/vizPlayer.js'

const MAX_N = 12

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

export class LcaBstViz extends VizPlayer {
  constructor(mountEl) {
    super(mountEl, {
      inputs: [
        {
          key: 'tree',
          label: '层序遍历（LeetCode 格式，null 表示空，逗号分隔）',
          default: '6,2,8,0,4,7,9,null,null,3,5',
          width: '24rem',
        },
        { key: 'p', label: 'p', default: '3', width: '5rem' },
        { key: 'q', label: 'q', default: '5', width: '5rem' },
      ],
      speed: 1300,
      hint: `提示：可改成你自己的 BST、p、q，点「应用」重新演示（最多 ${MAX_N} 个节点，节点值需互不相同）。`,
    })
  }

  parseInputs({ tree, p, q }) {
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
    const nonNull = values.filter((v) => v !== null)
    if (nonNull.length < 2) throw new Error('至少要有 2 个节点')
    if (nonNull.length > MAX_N) throw new Error(`节点数最多 ${MAX_N} 个`)
    if (new Set(nonNull).size !== nonNull.length) {
      throw new Error('节点值必须互不相同（题目保证 BST 节点值唯一）')
    }

    const pv = Math.trunc(Number(p))
    const qv = Math.trunc(Number(q))
    if (!Number.isFinite(pv)) throw new Error('p 不是合法整数')
    if (!Number.isFinite(qv)) throw new Error('q 不是合法整数')
    if (pv === qv) throw new Error('p 和 q 必须是不同的节点（题目保证 p != q）')
    if (!nonNull.includes(pv)) throw new Error(`p = ${pv} 不在树中`)
    if (!nonNull.includes(qv)) throw new Error(`q = ${qv} 不在树中`)

    return {
      tree: values,
      p: pv,
      q: qv,
      display: {
        tree: values.map((v) => (v === null ? 'null' : v)).join(','),
        p: String(pv),
        q: String(qv),
      },
    }
  }

  computeSteps({ tree, p, q }) {
    const { root, nodes } = buildTree(tree)
    this._nodes = nodes
    this._root = root
    layout(root)

    const steps = []
    const path = []
    let cur = root
    let lcaId = null

    while (cur) {
      path.push(cur.id)
      const bothLeft = p < cur.val && q < cur.val
      const bothRight = p > cur.val && q > cur.val
      let goLeft = false
      let goRight = false
      let isLca = false
      let msg

      if (bothLeft) {
        goLeft = true
        msg = `当前节点 <strong>${cur.val}</strong>：p = ${p} 和 q = ${q} 都比它<strong>小</strong> → 答案一定在左子树，往左走。`
      } else if (bothRight) {
        goRight = true
        msg = `当前节点 <strong>${cur.val}</strong>：p = ${p} 和 q = ${q} 都比它<strong>大</strong> → 答案一定在右子树，往右走。`
      } else {
        isLca = true
        lcaId = cur.id
        if (cur.val === p || cur.val === q) {
          msg = `当前节点 <strong>${cur.val}</strong> 正好就是 p 或 q 本身（一个节点也可以是它自己的祖先）→ 这里就是<strong>最近公共祖先</strong>！`
        } else {
          msg = `当前节点 <strong>${cur.val}</strong>：p = ${p} 和 q = ${q} 分别落在它的两侧 → 从这个节点开始 p、q 就要分家了，这里就是<strong>最近公共祖先</strong>！`
        }
      }

      steps.push({ id: cur.id, val: cur.val, path: [...path], goLeft, goRight, isLca, msg })
      if (isLca) break
      cur = goLeft ? cur.left : cur.right
    }

    const lcaNode = nodes.find((n) => n.id === lcaId)
    return { steps, result: { lcaVal: lcaNode?.val ?? null } }
  }

  buildStage(state, el) {
    const nodes = this._nodes
    el.innerHTML = `
      <div class="lca__info"></div>
      <div class="lca__chartwrap"></div>
      <div class="lca__pathlabel">已走过的路径</div>
      <div class="lca__path"></div>
    `
    this.infoEl = el.querySelector('.lca__info')
    this.chartEl = el.querySelector('.lca__chartwrap')
    this.pathEl = el.querySelector('.lca__path')

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
    const H = (maxY + 1) * rowH + padY * 2 + 18

    let edges = ''
    let circles = ''
    for (const n of nodes) {
      if (n.left) edges += `<line class="lca-edge" x1="${cx(n)}" y1="${cy(n)}" x2="${cx(n.left)}" y2="${cy(n.left)}"/>`
      if (n.right)
        edges += `<line class="lca-edge" x1="${cx(n)}" y1="${cy(n)}" x2="${cx(n.right)}" y2="${cy(n.right)}"/>`
    }
    for (const n of nodes) {
      let tag = ''
      if (n.val === state.p) tag = 'p'
      else if (n.val === state.q) tag = 'q'
      circles += `
        <g class="lca-node" data-id="${n.id}">
          <circle class="lca-circle" cx="${cx(n)}" cy="${cy(n)}" r="22"/>
          <text class="lca-val" x="${cx(n)}" y="${cy(n)}">${n.val}</text>
          ${tag ? `<text class="lca-tag" x="${cx(n)}" y="${cy(n) + 34}">${tag}</text>` : ''}
        </g>`
    }

    this.chartEl.innerHTML = `<svg class="lca__svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" role="img">
      <g class="lca-edges">${edges}</g>
      <g class="lca-nodes">${circles}</g>
    </svg>`

    this.nodeEls = {}
    this.chartEl.querySelectorAll('.lca-node').forEach((g) => {
      this.nodeEls[g.dataset.id] = g.querySelector('.lca-circle')
    })
  }

  renderStep(st, { state }) {
    Object.values(this.nodeEls).forEach((c) => c.classList.remove('is-current', 'is-path', 'is-lca'))
    st.path.forEach((id) => {
      if (id === st.id) this.nodeEls[id]?.classList.add(st.isLca ? 'is-lca' : 'is-current')
      else this.nodeEls[id]?.classList.add('is-path')
    })

    this.infoEl.innerHTML = `当前节点 <strong>${st.val}</strong>　p = ${state.p}，q = ${state.q}`

    this.pathEl.innerHTML = st.path
      .map((id) => `<code class="lca__chip${id === st.id && st.isLca ? ' is-hit' : ''}">${this._nodes.find((n) => n.id === id).val}</code>`)
      .join('<span class="lca__arrow">→</span>')
  }

  resultBanner(result, state) {
    return {
      kind: 'success',
      html: `🎉 找到啦！节点 <strong>${result.lcaVal}</strong> 就是 p = ${state.p} 和 q = ${state.q} 的<strong>最近公共祖先</strong>。`,
    }
  }
}

export function mountViz(el, opts) {
  return new LcaBstViz(el, opts)
}

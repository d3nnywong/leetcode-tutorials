/*
 * 相同的树「同步递归比较」动画。
 *
 * 同时从两棵树的根出发往下走：每次比较一对节点 (p, q) ——
 * 两边都是空 → 这一支算相同；只有一边是空，或两边值不相等 → 这一支不同，
 * 立刻短路返回 false；值相同 → 先递归比较左子树，左子树也相同才接着比较右子树。
 * 用一份「递归调用栈」面板把这套同步 DFS 的进栈/出栈过程画出来。
 */
import { VizPlayer } from '../../components/viz-player/vizPlayer.js'

const MAX_NODES = 10

/* ---------- 解析「层序数组」为二叉树 ---------- */
function parseLevelOrder(raw, label) {
  const tokens = (raw ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s !== '')
  const arr = tokens.map((s) => {
    if (s.toLowerCase() === 'null') return null
    const v = Number(s)
    if (!Number.isFinite(v)) throw new Error(`${label} 里的「${s}」不是合法数字或 null`)
    return Math.trunc(v)
  })
  const display = arr.map((v) => (v === null ? 'null' : String(v))).join(',')
  return { arr, display }
}

function buildTree(arr, prefix) {
  if (!arr.length || arr[0] === null) return { root: null, count: 0 }
  let counter = 0
  const mk = (v) => ({ id: `${prefix}${counter++}`, val: v, left: null, right: null })
  const root = mk(arr[0])
  const queue = [root]
  let i = 1
  while (queue.length && i < arr.length) {
    const node = queue.shift()
    if (i < arr.length) {
      const v = arr[i++]
      if (v !== null) {
        node.left = mk(v)
        queue.push(node.left)
      }
    }
    if (i < arr.length) {
      const v = arr[i++]
      if (v !== null) {
        node.right = mk(v)
        queue.push(node.right)
      }
    }
  }
  return { root, count: counter }
}

/* 中序位置当 x、深度当 y，画出一棵不重叠的二叉树 */
function layoutTree(root) {
  const nodes = []
  let x = 0
  function walk(node, depth) {
    if (!node) return
    walk(node.left, depth + 1)
    node.x = x++
    node.y = depth
    nodes.push(node)
    walk(node.right, depth + 1)
  }
  walk(root, 0)
  return nodes
}

export class SameTreeViz extends VizPlayer {
  constructor(mountEl) {
    super(mountEl, {
      inputs: [
        { key: 'p', label: '树 p（层序，逗号分隔，null 表示空）', default: '1,2,3,4,5,6,7', width: '15rem' },
        { key: 'q', label: '树 q（层序，逗号分隔，null 表示空）', default: '1,2,3,4,5,6,7', width: '15rem' },
      ],
      speed: 1000,
      hint: `提示：试试 q 改成「1,2,3,4,5,6,8」看哪里第一次出现不同；每棵树最多 ${MAX_NODES} 个节点。`,
    })
  }

  parseInputs({ p, q }) {
    const pp = parseLevelOrder(p, '树 p')
    const qq = parseLevelOrder(q, '树 q')
    const { root: pRoot, count: pCount } = buildTree(pp.arr, 'p')
    const { root: qRoot, count: qCount } = buildTree(qq.arr, 'q')
    if (pCount > MAX_NODES || qCount > MAX_NODES) {
      throw new Error(`每棵树最多 ${MAX_NODES} 个节点`)
    }
    return { pRoot, qRoot, display: { p: pp.display, q: qq.display } }
  }

  computeSteps({ pRoot, qRoot }) {
    const steps = []
    const stack = []
    const matched = []
    let mismatch = null

    const idOf = (n) => (n ? n.id : null)
    const describe = (n) => (n ? `${n.val}` : '空')
    const snapshotStack = () =>
      stack.map((f) => ({ p: idOf(f.p), q: idOf(f.q), pv: f.p ? f.p.val : null, qv: f.q ? f.q.val : null }))

    const push = (kind, current, msg) => {
      steps.push({
        kind,
        current,
        stack: snapshotStack(),
        matched: matched.map((m) => ({ ...m })),
        mismatch: mismatch ? { ...mismatch } : null,
        msg,
      })
    }

    function rec(p, q) {
      stack.push({ p, q })
      let result
      if (!p && !q) {
        result = true
        push('both-null', { p: null, q: null }, `这一支两边都是<strong>空节点</strong> → 相同，返回 <strong>true</strong>。`)
      } else if (!p || !q) {
        result = false
        mismatch = { p: idOf(p), q: idOf(q) }
        push(
          'one-null',
          { p: idOf(p), q: idOf(q) },
          `这一支一边是节点（${describe(p)}），一边是空节点（${describe(
            q,
          )}）→ <strong>结构不同</strong>，返回 <strong>false</strong>。`,
        )
      } else if (p.val !== q.val) {
        result = false
        mismatch = { p: idOf(p), q: idOf(q) }
        push(
          'val-mismatch',
          { p: idOf(p), q: idOf(q) },
          `p.val = <strong>${p.val}</strong>，q.val = <strong>${q.val}</strong>，值不相等 → 返回 <strong>false</strong>。`,
        )
      } else {
        push(
          'match-enter',
          { p: idOf(p), q: idOf(q) },
          `p.val = q.val = <strong>${p.val}</strong>，值相同 → 继续递归比较左、右子树。`,
        )
        const leftOk = rec(p.left, q.left)
        const rightOk = leftOk ? rec(p.right, q.right) : false
        result = leftOk && rightOk
        if (result) matched.push({ p: idOf(p), q: idOf(q) })
        push(
          'return',
          { p: idOf(p), q: idOf(q) },
          result
            ? `p(${p.val}) 与 q(${q.val}) 这一支左右子树都相同 → 这一支返回 <strong>true</strong>。`
            : `p(${p.val}) 与 q(${q.val}) 这一支左右子树存在不同 → 这一支返回 <strong>false</strong>。`,
        )
      }
      stack.pop()
      return result
    }

    const value = rec(pRoot, qRoot)
    return { steps, result: { value, mismatch } }
  }

  buildStage({ pRoot, qRoot }, el) {
    el.innerHTML = `
      <div class="stree__trees">
        <div class="stree__col">
          <div class="stree__label">树 p</div>
          <div class="stree__wrap">${this.#renderTreeSvg(pRoot)}</div>
        </div>
        <div class="stree__col">
          <div class="stree__label">树 q</div>
          <div class="stree__wrap">${this.#renderTreeSvg(qRoot)}</div>
        </div>
      </div>
      <div class="stree__stackwrap">
        <div class="stree__label">递归调用栈（最上面 = 当前正在比较的一对节点）</div>
        <div class="stree__stack"></div>
      </div>
    `
    this.stage = el
    this.stackEl = el.querySelector('.stree__stack')
  }

  #renderTreeSvg(root) {
    if (!root) return `<p class="stree__empty">（空树）</p>`
    const nodes = layoutTree(root)
    const r = 17
    const xGap = 56
    const yGap = 66
    const marginX = 30
    const marginY = 28
    const maxX = Math.max(...nodes.map((n) => n.x))
    const maxY = Math.max(...nodes.map((n) => n.y))
    const px = (n) => marginX + n.x * xGap
    const py = (n) => marginY + n.y * yGap
    const width = marginX * 2 + maxX * xGap
    const height = marginY * 2 + maxY * yGap

    let edges = ''
    let circles = ''
    for (const n of nodes) {
      if (n.left) edges += `<line class="stree-edge" x1="${px(n)}" y1="${py(n)}" x2="${px(n.left)}" y2="${py(n.left)}"/>`
      if (n.right) edges += `<line class="stree-edge" x1="${px(n)}" y1="${py(n)}" x2="${px(n.right)}" y2="${py(n.right)}"/>`
      circles += `<g class="stree-node" data-id="${n.id}">
        <circle cx="${px(n)}" cy="${py(n)}" r="${r}"/>
        <text x="${px(n)}" y="${py(n)}">${n.val}</text>
      </g>`
    }
    return `<svg class="stree__svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet" role="img">
      ${edges}${circles}
    </svg>`
  }

  renderStep(st) {
    const allNodes = this.stage.querySelectorAll('.stree-node')
    allNodes.forEach((g) => g.classList.remove('is-current', 'is-match', 'is-mismatch'))

    const mark = (id, cls) => {
      if (!id) return
      const g = this.stage.querySelector(`.stree-node[data-id="${id}"]`)
      if (g) g.classList.add(cls)
    }
    st.matched.forEach((m) => {
      mark(m.p, 'is-match')
      mark(m.q, 'is-match')
    })
    if (st.mismatch) {
      mark(st.mismatch.p, 'is-mismatch')
      mark(st.mismatch.q, 'is-mismatch')
    }
    mark(st.current.p, 'is-current')
    mark(st.current.q, 'is-current')

    const frames = [...st.stack].reverse()
    this.stackEl.innerHTML = frames
      .map(
        (f, i) =>
          `<div class="stree__frame${i === 0 ? ' is-top' : ''}">
            <code>compare(p: ${f.pv ?? '∅'}, q: ${f.qv ?? '∅'})</code>${i === 0 ? '<span class="stree__cur">◀ 当前</span>' : ''}
          </div>`,
      )
      .join('')
  }

  resultBanner(result) {
    if (result.value) {
      return {
        kind: 'success',
        html: `🎉 两棵树结构相同，对应节点的值也完全相同 → <strong>true</strong>。`,
      }
    }
    return {
      kind: 'fail',
      html: `🚫 标红的位置出现了不同（结构或值不一致）→ <strong>false</strong>。`,
    }
  }
}

export function mountViz(el, opts) {
  return new SameTreeViz(el, opts)
}

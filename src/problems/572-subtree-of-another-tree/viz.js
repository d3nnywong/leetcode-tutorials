/*
 * 另一棵树的子树「逐个候选根 + 复用同树比较」动画。
 *
 * 在 root 里做先序 DFS：走到每一个节点，就把它当成「候选根」，
 * 整体调用一次 isSameTree(候选根, subRoot) 比较。
 *   - 比上了 → 找到子树，直接返回 true（短路，不再继续找）。
 *   - 没比上 → 这个候选不行，但不代表它的子节点也不行，继续去它的左、右子树里找下一个候选。
 * root 所有节点都试过仍没比上，才返回 false。
 */
import { VizPlayer } from '../../components/viz-player/vizPlayer.js'

const ROOT_MAX = 14
const SUB_MAX = 8

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

function collectIds(node, out = []) {
  if (!node) return out
  out.push(node.id)
  collectIds(node.left, out)
  collectIds(node.right, out)
  return out
}

export class SubtreeViz extends VizPlayer {
  constructor(mountEl) {
    super(mountEl, {
      inputs: [
        { key: 'root', label: 'root（层序，逗号分隔，null 表示空）', default: '3,4,5,1,2', width: '17rem' },
        { key: 'subRoot', label: 'subRoot（层序，逗号分隔）', default: '4,1,2', width: '11rem' },
      ],
      speed: 1100,
      hint: `提示：试试 root 改成「3,4,5,1,2,null,null,null,null,0」（其余不变），看哪个候选根第一次比对失败、又怎么换到下一个候选；root 最多 ${ROOT_MAX} 个节点，subRoot 最多 ${SUB_MAX} 个节点。`,
    })
  }

  parseInputs({ root, subRoot }) {
    const r = parseLevelOrder(root, 'root')
    const s = parseLevelOrder(subRoot, 'subRoot')
    const { root: rootNode, count: rootCount } = buildTree(r.arr, 'r')
    const { root: subNode, count: subCount } = buildTree(s.arr, 's')
    if (!rootNode) throw new Error('root 不能是空树（至少要有 1 个节点）')
    if (!subNode) throw new Error('subRoot 不能是空树（至少要有 1 个节点）')
    if (rootCount > ROOT_MAX) throw new Error(`root 最多 ${ROOT_MAX} 个节点`)
    if (subCount > SUB_MAX) throw new Error(`subRoot 最多 ${SUB_MAX} 个节点`)
    return {
      rootNode,
      subNode,
      display: { root: r.display, subRoot: s.display },
    }
  }

  computeSteps({ rootNode, subNode }) {
    const steps = []
    const triedMismatch = []
    let finalResult = false
    let foundVal = null
    let stopped = false

    const idOf = (n) => (n ? n.id : null)

    function sameTreeCheck(p, q) {
      if (!p && !q) return { ok: true, diff: null }
      if (!p || !q) {
        return { ok: false, diff: { p: idOf(p), q: idOf(q), pv: p ? p.val : null, qv: q ? q.val : null } }
      }
      if (p.val !== q.val) {
        return { ok: false, diff: { p: idOf(p), q: idOf(q), pv: p.val, qv: q.val } }
      }
      const left = sameTreeCheck(p.left, q.left)
      if (!left.ok) return left
      return sameTreeCheck(p.right, q.right)
    }

    const snapshotTried = () => triedMismatch.map((t) => ({ ...t }))

    function dfs(node) {
      if (stopped || !node) return
      steps.push({
        kind: 'visit',
        candidate: node.id,
        candidateVal: node.val,
        tried: snapshotTried(),
        msg: `DFS 走到 root 中的节点 <strong>${node.val}</strong>，把它当成候选根，整体比较一次它和 subRoot。`,
      })
      const { ok, diff } = sameTreeCheck(node, subNode)
      if (ok) {
        finalResult = true
        foundVal = node.val
        stopped = true
        steps.push({
          kind: 'match',
          candidate: node.id,
          matchedIds: collectIds(node),
          tried: snapshotTried(),
          msg: `以节点 <strong>${node.val}</strong> 为根的子树，和 subRoot 结构、节点值<strong>完全相同</strong> → 找到了，返回 <strong>true</strong>！`,
        })
        return
      }
      steps.push({
        kind: 'mismatch',
        candidate: node.id,
        diff,
        tried: snapshotTried(),
        msg: `候选根 <strong>${node.val}</strong> 这一支和 subRoot 在「${
          diff.pv != null ? `root 节点 ${diff.pv}` : 'root 一侧空节点'
        } vs ${
          diff.qv != null ? `subRoot 节点 ${diff.qv}` : 'subRoot 一侧空节点'
        }」处出现不同 → 这个候选不行，但它的子节点还可能行，继续往下找下一个候选。`,
      })
      triedMismatch.push({ candidate: node.id, diff })
      dfs(node.left)
      if (stopped) return
      dfs(node.right)
    }

    dfs(rootNode)
    if (!finalResult) {
      steps.push({
        kind: 'done-fail',
        tried: snapshotTried(),
        msg: `root 里所有节点都当过候选根了，没有一棵子树和 subRoot 完全相同 → 返回 <strong>false</strong>。`,
      })
    }
    return { steps, result: { value: finalResult, foundVal } }
  }

  buildStage({ rootNode, subNode }, el) {
    el.innerHTML = `
      <div class="ist__trees">
        <div class="ist__col ist__col--root">
          <div class="ist__label">root</div>
          <div class="ist__wrap">${this.#renderTreeSvg(rootNode)}</div>
        </div>
        <div class="ist__col ist__col--sub">
          <div class="ist__label">subRoot</div>
          <div class="ist__wrap">${this.#renderTreeSvg(subNode)}</div>
        </div>
      </div>
    `
    this.stage = el
    this.subAllIds = collectIds(subNode)
  }

  #renderTreeSvg(root) {
    if (!root) return `<p class="ist__empty">（空树）</p>`
    const nodes = layoutTree(root)
    const r = 17
    const xGap = 52
    const yGap = 62
    const marginX = 28
    const marginY = 26
    const maxX = Math.max(...nodes.map((n) => n.x))
    const maxY = Math.max(...nodes.map((n) => n.y))
    const px = (n) => marginX + n.x * xGap
    const py = (n) => marginY + n.y * yGap
    const width = marginX * 2 + maxX * xGap
    const height = marginY * 2 + maxY * yGap

    let edges = ''
    let circles = ''
    for (const n of nodes) {
      if (n.left) edges += `<line class="ist-edge" x1="${px(n)}" y1="${py(n)}" x2="${px(n.left)}" y2="${py(n.left)}"/>`
      if (n.right) edges += `<line class="ist-edge" x1="${px(n)}" y1="${py(n)}" x2="${px(n.right)}" y2="${py(n.right)}"/>`
      circles += `<g class="ist-node" data-id="${n.id}">
        <circle cx="${px(n)}" cy="${py(n)}" r="${r}"/>
        <text x="${px(n)}" y="${py(n)}">${n.val}</text>
      </g>`
    }
    return `<svg class="ist__svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet" role="img">
      ${edges}${circles}
    </svg>`
  }

  renderStep(st) {
    const allNodes = this.stage.querySelectorAll('.ist-node')
    allNodes.forEach((g) => g.classList.remove('is-current', 'is-match', 'is-diff', 'is-tried'))

    const mark = (id, cls) => {
      if (!id) return
      const g = this.stage.querySelector(`.ist-node[data-id="${id}"]`)
      if (g) g.classList.add(cls)
    }

    // 之前比对失败、已经「淘汰」的候选根 —— 弱化标记
    ;(st.tried ?? []).forEach((t) => mark(t.candidate, 'is-tried'))

    if (st.kind === 'visit') {
      mark(st.candidate, 'is-current')
    } else if (st.kind === 'mismatch') {
      mark(st.candidate, 'is-current')
      if (st.diff) {
        mark(st.diff.p, 'is-diff')
        mark(st.diff.q, 'is-diff')
      }
    } else if (st.kind === 'match') {
      st.matchedIds.forEach((id) => mark(id, 'is-match'))
      this.subAllIds.forEach((id) => mark(id, 'is-match'))
    }
  }

  resultBanner(result) {
    if (result.value) {
      return {
        kind: 'success',
        html: `🎉 root 中以节点 <strong>${result.foundVal}</strong> 为根的子树，和 subRoot 完全相同 → <strong>true</strong>。`,
      }
    }
    return {
      kind: 'fail',
      html: `🚫 root 里没有任何一棵子树和 subRoot 完全相同 → <strong>false</strong>。`,
    }
  }
}

export function mountViz(el, opts) {
  return new SubtreeViz(el, opts)
}

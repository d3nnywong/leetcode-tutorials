/*
 * 从前序与中序遍历序列构造二叉树「递归分治」动画。
 *
 * 关键洞察：
 *   1. 先序遍历的第一个数，永远是「这一段」的根节点。
 *   2. 拿这个根节点的值去中序遍历里定位，左边的一段就是左子树的中序遍历，
 *      右边的一段就是右子树的中序遍历（个数也就分别是左右子树的节点数）。
 *   3. 先序遍历的顺序是「根 → 整个左子树 → 整个右子树」，
 *      所以只要按顺序从前序数组里依次取值去配中序里收缩出来的区间，
 *      先递归拼完左子树、再拼右子树，就能把整棵树拼出来。
 * 用一个哈希表把「值 → 中序下标」记下来，定位根节点就是 O(1)，整体 O(n)。
 */
import { VizPlayer } from '../../components/viz-player/vizPlayer.js'

const MAX_N = 10

export class ConstructTreeViz extends VizPlayer {
  constructor(mountEl) {
    super(mountEl, {
      inputs: [
        {
          key: 'preorder',
          label: '先序遍历 preorder（逗号分隔）',
          default: '3,9,20,15,7',
          width: '15rem',
        },
        {
          key: 'inorder',
          label: '中序遍历 inorder（逗号分隔）',
          default: '9,3,15,20,7',
          width: '15rem',
        },
      ],
      speed: 1400,
      hint: `提示：可改成你自己的前序/中序数组，点「应用」重新演示（最多 ${MAX_N} 个节点，元素须互不相同，且两个数组要能配成同一棵树）。`,
    })
  }

  parseInputs({ preorder, inorder }) {
    const parseArr = (s, label) => {
      const toks = (s ?? '')
        .split(',')
        .map((x) => x.trim())
        .filter((x) => x !== '')
      return toks.map((x) => {
        const v = Number(x)
        if (!Number.isFinite(v) || !Number.isInteger(v)) throw new Error(`${label} 里的「${x}」不是合法整数`)
        return v
      })
    }
    const pre = parseArr(preorder, 'preorder').slice(0, MAX_N)
    const ino = parseArr(inorder, 'inorder').slice(0, MAX_N)
    if (pre.length === 0) throw new Error('preorder 不能为空')
    if (pre.length !== ino.length) throw new Error('preorder 和 inorder 的长度必须相同')
    if (new Set(pre).size !== pre.length) throw new Error('preorder 中含有重复元素，节点值必须互不相同')
    const inoSet = new Set(ino)
    if (inoSet.size !== ino.length) throw new Error('inorder 中含有重复元素，节点值必须互不相同')
    for (const v of pre) {
      if (!inoSet.has(v)) throw new Error(`inorder 里找不到 ${v}，preorder 和 inorder 必须来自同一棵树`)
    }
    return {
      preorder: pre,
      inorder: ino,
      display: { preorder: pre.join(','), inorder: ino.join(',') },
    }
  }

  computeSteps(state) {
    const { preorder, inorder } = state
    const n = preorder.length
    const idx = new Map()
    inorder.forEach((v, i) => idx.set(v, i))

    const steps = []
    const nodes = []
    let pre = 0
    let nodeId = 0
    let maxDepth = 0

    const build = (l, r, depth, parentId, side) => {
      if (l > r) return null
      const usedPre = pre
      const rootVal = preorder[pre]
      pre++
      const mid = idx.get(rootVal)
      const id = nodeId++
      maxDepth = Math.max(maxDepth, depth)
      nodes.push({ id, val: rootVal, x: mid, depth, parentId, side })

      const leftRange = [l, mid - 1]
      const rightRange = [mid + 1, r]
      const leftEmpty = leftRange[0] > leftRange[1]
      const rightEmpty = rightRange[0] > rightRange[1]
      const leftDesc = leftEmpty
        ? '左边没有元素 → 左子树是 <strong>null</strong>'
        : `左边 inorder[${leftRange[0]}..${leftRange[1]}]（${leftRange[1] - leftRange[0] + 1} 个）是左子树`
      const rightDesc = rightEmpty
        ? '右边没有元素 → 右子树是 <strong>null</strong>'
        : `右边 inorder[${rightRange[0]}..${rightRange[1]}]（${rightRange[1] - rightRange[0] + 1} 个）是右子树`

      steps.push({
        kind: 'pick',
        l,
        r,
        pre: usedPre,
        mid,
        rootVal,
        depth,
        parentId,
        side,
        id,
        nodes: nodes.map((nd) => ({ ...nd })),
        msg:
          `preorder 指针 pre = ${usedPre} → 取出 <strong>${rootVal}</strong>，它是 inorder[${l}..${r}] 这一段的根节点。` +
          `在 inorder 里定位到 ${rootVal}，下标 mid = <strong>${mid}</strong>：${leftDesc}，${rightDesc}。`,
      })

      build(l, mid - 1, depth + 1, id, 'left')
      build(mid + 1, r, depth + 1, id, 'right')
      return id
    }

    build(0, n - 1, 0, null, null)

    steps.push({
      kind: 'done',
      pre: n,
      nodes: nodes.map((nd) => ({ ...nd })),
      msg: 'preorder 和 inorder 都用完了，整棵树构建完成！',
    })

    // 给 buildStage 用：最终的完整节点表 / 最大深度 / 节点数（state 在 rebuild() 里
    // 先经过 computeSteps 再传给 buildStage，这里挂在 state 上正好能被它读到）。
    state.finalNodes = nodes
    state.maxDepth = maxDepth
    state.n = n

    return { steps, result: { nodes, n } }
  }

  buildStage(state, el) {
    const { preorder, inorder, finalNodes, maxDepth, n } = state
    el.innerHTML = `
      <div class="ctt__arrwrap">
        <div class="ctt__arrlabel">preorder（先序：root → 左子树 → 右子树）</div>
        <div class="ctt__row ctt__row--pre"></div>
      </div>
      <div class="ctt__arrwrap">
        <div class="ctt__arrlabel">inorder（中序：左子树 → root → 右子树）</div>
        <div class="ctt__row ctt__row--in"></div>
      </div>
      <div class="ctt__treewrap"></div>
    `
    this.preRowEl = el.querySelector('.ctt__row--pre')
    this.inRowEl = el.querySelector('.ctt__row--in')
    this.treeEl = el.querySelector('.ctt__treewrap')

    this.preRowEl.innerHTML = preorder
      .map(
        (v, i) =>
          `<span class="ctt__cell" data-i="${i}"><b class="ctt__val">${v}</b><span class="ctt__idx">${i}</span></span>`,
      )
      .join('')
    this.inRowEl.innerHTML = inorder
      .map(
        (v, i) =>
          `<span class="ctt__cell" data-i="${i}"><b class="ctt__val">${v}</b><span class="ctt__idx">${i}</span></span>`,
      )
      .join('')
    this.preCellEls = [...this.preRowEl.querySelectorAll('.ctt__cell')]
    this.inCellEls = [...this.inRowEl.querySelectorAll('.ctt__cell')]

    // 树的横坐标直接用「中序下标」——这正是中序遍历的几何意义：
    // 同一层节点从左到右排开，天然不会交叉重叠。
    const colW = 56
    const rowH = 78
    const padX = 30
    const padY = 30
    const cx = (nd) => padX + nd.x * colW + colW / 2
    const cy = (nd) => padY + nd.depth * rowH + 24
    this.geo = { cx, cy }
    const W = n * colW + padX * 2
    const H = (maxDepth + 1) * rowH + padY * 2

    const byId = new Map(finalNodes.map((nd) => [nd.id, nd]))
    let edges = ''
    let circles = ''
    for (const nd of finalNodes) {
      if (nd.parentId != null) {
        const p = byId.get(nd.parentId)
        edges += `<line class="ctt-edge" data-id="${nd.id}" x1="${cx(p)}" y1="${cy(p)}" x2="${cx(nd)}" y2="${cy(nd)}"/>`
      }
    }
    for (const nd of finalNodes) {
      circles += `
        <g class="ctt-node" data-id="${nd.id}">
          <circle class="ctt-circle" cx="${cx(nd)}" cy="${cy(nd)}" r="20"/>
          <text class="ctt-val" x="${cx(nd)}" y="${cy(nd)}">${nd.val}</text>
        </g>`
    }
    this.treeEl.innerHTML = `<svg class="ctt__svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" role="img">
      <g class="ctt-edges">${edges}</g>
      <g class="ctt-nodes">${circles}</g>
    </svg>`

    this.nodeEls = {}
    this.treeEl.querySelectorAll('.ctt-node').forEach((g) => {
      this.nodeEls[g.dataset.id] = g.querySelector('.ctt-circle')
    })
    this.edgeEls = {}
    this.treeEl.querySelectorAll('.ctt-edge').forEach((ln) => {
      this.edgeEls[ln.dataset.id] = ln
    })
  }

  renderStep(st, { state }) {
    const consumedUpTo = st.kind === 'done' ? state.n : st.pre + 1
    this.preCellEls.forEach((c, i) => {
      c.classList.toggle('is-used', i < consumedUpTo)
      c.classList.toggle('is-current', st.kind === 'pick' && i === st.pre)
    })
    this.inCellEls.forEach((c, i) => {
      const inRange = st.kind === 'pick' && i >= st.l && i <= st.r
      c.classList.toggle('is-inrange', inRange)
      c.classList.toggle('is-root', st.kind === 'pick' && i === st.mid)
    })

    const present = new Set(st.nodes.map((nd) => nd.id))
    Object.entries(this.nodeEls).forEach(([id, circle]) => {
      const idNum = Number(id)
      const shown = present.has(idNum)
      const isCurrent = shown && st.kind === 'pick' && idNum === st.id
      circle.classList.toggle('is-pending', !shown)
      circle.classList.toggle('is-current', isCurrent)
      circle.classList.toggle('is-built', shown && !isCurrent)
    })
    Object.entries(this.edgeEls).forEach(([id, line]) => {
      line.classList.toggle('is-pending', !present.has(Number(id)))
    })
    this.treeEl.classList.toggle('is-done', st.kind === 'done')
  }

  resultBanner(result) {
    const arr = toLevelOrder(result.nodes)
    return {
      kind: 'success',
      html: `🎉 构建完成！返回的二叉树根节点是 <strong>${
        result.nodes.find((nd) => nd.parentId == null)?.val
      }</strong>，层序遍历（LeetCode 格式）= <code>[${arr.join(',')}]</code>。`,
    }
  }
}

// 把节点表（带 parentId / side）转成 LeetCode 风格的层序数组，末尾的 null 会被裁掉。
function toLevelOrder(nodes) {
  if (!nodes.length) return []
  const byParent = new Map()
  let root = null
  for (const nd of nodes) {
    if (nd.parentId == null) {
      root = nd
    } else {
      const entry = byParent.get(nd.parentId) ?? {}
      entry[nd.side] = nd
      byParent.set(nd.parentId, entry)
    }
  }
  const out = []
  const queue = [root]
  while (queue.length) {
    const nd = queue.shift()
    if (nd === null) {
      out.push('null')
      continue
    }
    out.push(nd.val)
    const kids = byParent.get(nd.id) ?? {}
    queue.push(kids.left ?? null, kids.right ?? null)
  }
  while (out.length && out[out.length - 1] === 'null') out.pop()
  return out
}

export function mountViz(el, opts) {
  return new ConstructTreeViz(el, opts)
}

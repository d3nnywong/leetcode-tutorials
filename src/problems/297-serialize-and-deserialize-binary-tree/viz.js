/*
 * 297. 二叉树的序列化与反序列化 —— 「前序 DFS + null 占位符」动画。
 *
 * 序列化：按前序遍历（根 → 左 → 右）走一遍树，每到一个真实节点就把它的值写进字符串；
 * 每到一个空位置（没有左 / 右孩子）也明确写一个 null 占位——这一步是关键：
 * 光有一串数字，根本不知道谁是谁的孩子；补上 null，结构信息才算完整保留了下来。
 *
 * 反序列化：把字符串按逗号拆开，当成一个「先写的先读」的队列，再按同样的前序顺序读：
 * 读到 null 就返回空、不建节点；读到数字就新建一个节点，再递归去读它的左孩子、右孩子。
 * 因为读的顺序和写的顺序完全一致，每一步都能读到「正确」的下一个值，原样重建出整棵树。
 */
import { VizPlayer } from '../../components/viz-player/vizPlayer.js'

const MAX_REAL_NODES = 8

// 按 LeetCode 层序数组（null 表示空节点）建出二叉树：id -> {val,left,right}
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

// 把「真实节点」树补成一棵满二叉树：每个真实节点缺失的孩子都补一个 null 占位叶子，
// 这样动画里能直接画出「序列化时到底在哪些位置写了 null」。结构从头到尾不再变化，只算一次。
function augment(state, rootId) {
  const aug = {}
  let nullSeq = 0
  function clone(id) {
    if (id == null) {
      const nid = `n${nullSeq++}`
      aug[nid] = { val: null, left: null, right: null, isNull: true }
      return nid
    }
    const node = state[id]
    aug[id] = { val: node.val, left: null, right: null, isNull: false }
    aug[id].left = clone(node.left)
    aug[id].right = clone(node.right)
    return id
  }
  const augRoot = clone(rootId)
  return { aug, augRoot }
}

// 中序走一遍补全后的树，分配横向位置 xIndex（null 叶子也占位，避免子树重叠），
// 纵向用深度 depth。
function layoutAug(aug, augRoot) {
  const pos = {}
  const edges = []
  let xCounter = 0
  function dfs(id, depth) {
    const node = aug[id]
    if (node.left != null) dfs(node.left, depth + 1)
    pos[id] = { xIndex: xCounter++, depth }
    if (node.right != null) dfs(node.right, depth + 1)
    if (node.left != null) edges.push({ a: id, b: node.left })
    if (node.right != null) edges.push({ a: id, b: node.right })
  }
  dfs(augRoot, 0)
  return { pos, edges, width: xCounter }
}

export class CodecViz extends VizPlayer {
  constructor(mountEl) {
    super(mountEl, {
      inputs: [
        {
          key: 'tree',
          label: '二叉树（层序，逗号分隔，null 表示空，如 1,2,3,null,null,4,5）',
          default: '1,2,3,null,null,4,5',
          width: '24rem',
        },
      ],
      speed: 850,
      hint: `提示：可改成你自己的树，点「应用」重新演示（最多 ${MAX_REAL_NODES} 个真实节点；空树输入 [] ）。`,
    })
  }

  parseInputs({ tree }) {
    const raw = (tree ?? '').trim()
    if (raw === '' || raw === '[]') {
      return { tokens: [], realCount: 0, display: { tree: '[]' } }
    }
    const cleaned = raw.replace(/^\[/, '').replace(/\]$/, '')
    const parts = cleaned.split(',').map((s) => s.trim())
    const tokens = parts.map((s) => {
      if (s === '' || s.toLowerCase() === 'null' || s === '#') return null
      const v = Number(s)
      if (!Number.isFinite(v) || !Number.isInteger(v)) throw new Error(`「${s}」不是合法整数`)
      if (v < -1000 || v > 1000) throw new Error(`节点值 ${v} 超出范围 [-1000, 1000]`)
      return v
    })
    if (tokens[0] === null) {
      return { tokens: [], realCount: 0, display: { tree: '[]' } }
    }
    const realCount = tokens.filter((t) => t !== null).length
    if (realCount > MAX_REAL_NODES) {
      throw new Error(`节点数最多 ${MAX_REAL_NODES} 个，方便看清动画`)
    }
    return { tokens, realCount, display: { tree: parts.join(',') } }
  }

  computeSteps({ tokens }) {
    const { state, rootId } = buildTree(tokens)
    const { aug, augRoot } = augment(state, rootId)
    this.aug = aug
    this.augRoot = augRoot
    this.layout = layoutAug(aug, augRoot)

    const serTokens = []
    const steps = []

    // ===== 阶段一：序列化（前序 DFS，边走边写） =====
    const dfsSerialize = (id) => {
      const node = aug[id]
      if (node.isNull) {
        serTokens.push({ kind: 'null', id })
        steps.push({
          phase: 'serialize',
          id,
          isNull: true,
          written: serTokens.length,
          msg:
            id === augRoot
              ? `树是空的（<code>root = null</code>）→ 直接写一个 <code>null</code>。`
              : `走到一个空位置（这里没有孩子）→ 写一个 <code>null</code> 占位，标记「没有孩子」。`,
        })
        return
      }
      serTokens.push({ kind: 'val', id, val: node.val })
      steps.push({
        phase: 'serialize',
        id,
        isNull: false,
        val: node.val,
        written: serTokens.length,
        msg:
          (id === augRoot ? `从根节点开始做前序遍历（根 → 左 → 右）：` : '') +
          `访问到节点 <strong>${node.val}</strong> → 写入它的值，再去写它的左子树、右子树。`,
      })
      dfsSerialize(node.left)
      dfsSerialize(node.right)
    }
    dfsSerialize(augRoot)

    this.serTokens = serTokens
    const tokenStr = serTokens.map((t) => (t.kind === 'null' ? 'null' : t.val)).join(',')
    this.tokenStr = tokenStr

    steps.push({
      phase: 'serialize-done',
      written: serTokens.length,
      msg: `序列化完成！前序遍历 + null 占位，得到字符串：<code>"${tokenStr}"</code>。`,
    })

    // ===== 阶段二：反序列化（按同样的前序顺序读，重建一棵新树） =====
    let readIdx = 0
    const dfsDeserialize = () => {
      const tk = serTokens[readIdx]
      const curIdx = readIdx
      readIdx++
      const prefix = curIdx === 0 ? `开始反序列化：按写入时完全相同的顺序，从第一个 token 读起。` : ''
      if (tk.kind === 'null') {
        steps.push({
          phase: 'deserialize',
          id: tk.id,
          isNull: true,
          readIdx: curIdx,
          msg: `${prefix}读到 <code>null</code> → 这里没有孩子，返回空，不建节点。`,
        })
        return
      }
      steps.push({
        phase: 'deserialize',
        id: tk.id,
        isNull: false,
        val: tk.val,
        readIdx: curIdx,
        msg: `${prefix}读到 <strong>${tk.val}</strong> → 新建一个节点，挂回它在树里原来的位置，再去读它的左孩子、右孩子。`,
      })
      dfsDeserialize()
      dfsDeserialize()
    }
    if (serTokens.length) dfsDeserialize()

    steps.push({
      phase: 'done',
      msg: '反序列化完成！按同样的顺序读完，重建出的树和原树结构、节点值完全一致。',
    })

    return { steps, result: { tokenStr } }
  }

  buildStage(state, el) {
    const { pos, edges, width } = this.layout
    const aug = this.aug
    const colW = 54
    const rowH = 78
    const padX = 30
    const padY = 36
    const R = 19
    const NS = 8
    const maxDepth = Object.values(pos).reduce((m, p) => Math.max(m, p.depth), 0)
    const W = Math.max(width, 1) * colW + padX * 2
    const H = (maxDepth + 1) * rowH + padY * 2

    const posPx = {}
    for (const id in pos) {
      posPx[id] = {
        x: pos[id].xIndex * colW + colW / 2 + padX,
        y: pos[id].depth * rowH + rowH / 2 + padY,
      }
    }
    this.posPx = posPx

    const nodeSvg = Object.keys(aug)
      .map((id) => {
        const node = aug[id]
        const p = posPx[id]
        return node.isNull
          ? `<g class="sdt-node sdt-node--null" data-id="${id}" transform="translate(${p.x},${p.y})">
               <rect class="sdt-null" x="${-NS}" y="${-NS}" width="${NS * 2}" height="${NS * 2}" rx="3"/>
             </g>`
          : `<g class="sdt-node" data-id="${id}" transform="translate(${p.x},${p.y})">
               <circle class="sdt-circle" r="${R}"/>
               <text class="sdt-val">${node.val}</text>
             </g>`
      })
      .join('')
    const edgeSvg = edges
      .map((e) => {
        const pa = posPx[e.a]
        const pb = posPx[e.b]
        return `<line class="sdt-edge" data-a="${e.a}" data-b="${e.b}" x1="${pa.x}" y1="${pa.y}" x2="${pb.x}" y2="${pb.y}"/>`
      })
      .join('')

    el.innerHTML = `
      <div class="sdt__panels">
        <div class="sdt__panel">
          <div class="sdt__panel-title">原始二叉树（序列化）</div>
          <div class="sdt__chartwrap">
            <svg class="sdt__svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" role="img">
              <g class="sdt-edges">${edgeSvg}</g>
              <g class="sdt-nodes">${nodeSvg}</g>
            </svg>
          </div>
        </div>
        <div class="sdt__panel">
          <div class="sdt__panel-title">重建的二叉树（反序列化）</div>
          <div class="sdt__chartwrap">
            <svg class="sdt__svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" role="img">
              <g class="sdt-edges">${edgeSvg}</g>
              <g class="sdt-nodes">${nodeSvg}</g>
            </svg>
          </div>
        </div>
      </div>
      <div class="sdt__tapewrap">
        <div class="sdt__tape-label">序列化字符串（先写后读，逗号分隔；虚线方块 = null 占位）</div>
        <div class="sdt__tape"></div>
      </div>
    `

    const svgs = el.querySelectorAll('.sdt__svg')
    this.origSvg = svgs[0]
    this.buildSvg = svgs[1]
    this.tapeEl = el.querySelector('.sdt__tape')

    this.origNodeEls = new Map(
      [...this.origSvg.querySelectorAll('.sdt-node')].map((g) => [g.dataset.id, g]),
    )
    this.buildNodeEls = new Map(
      [...this.buildSvg.querySelectorAll('.sdt-node')].map((g) => [g.dataset.id, g]),
    )
    this.buildEdgeEls = [...this.buildSvg.querySelectorAll('.sdt-edge')].map((line) => ({
      a: line.dataset.a,
      b: line.dataset.b,
      el: line,
    }))

    // 重建树一开始全部隐藏，靠反序列化阶段逐个揭开
    this.buildNodeEls.forEach((g) => g.classList.add('is-hidden'))
    this.buildEdgeEls.forEach(({ el: line }) => line.classList.add('is-hidden'))

    // 字符串纸带：先按 token 数量建好占位格子，序列化阶段逐格填字
    this.tapeEl.innerHTML = this.serTokens.map((_, i) => `<span class="sdt-tok" data-i="${i}"></span>`).join('')
    this.tapeCells = [...this.tapeEl.querySelectorAll('.sdt-tok')]
  }

  renderStep(st, { idx }) {
    // 原始树：高亮序列化阶段正在访问 / 写入的那个节点（或 null 占位）
    this.origNodeEls.forEach((g, id) => {
      g.classList.toggle('is-current', st.phase === 'serialize' && id === String(st.id))
    })

    // 重建树：揭开 idx 之前（含当前）反序列化阶段读到过的所有节点 + 对应连线
    const revealed = new Set()
    for (let i = 0; i <= idx; i++) {
      const s = this.steps[i]
      if (s.phase === 'deserialize') revealed.add(String(s.id))
    }
    const curStep = this.steps[idx]
    const curBuildId = curStep.phase === 'deserialize' ? String(curStep.id) : null
    const isDone = st.phase === 'done'

    this.buildNodeEls.forEach((g, id) => {
      const isRevealed = revealed.has(id)
      g.classList.toggle('is-hidden', !isRevealed)
      g.classList.toggle('is-current', id === curBuildId)
      g.classList.toggle('is-built', isRevealed && id !== curBuildId && !isDone)
      g.classList.toggle('is-final', isDone && isRevealed)
    })
    this.buildEdgeEls.forEach(({ a, b, el: line }) => {
      line.classList.toggle('is-hidden', !(revealed.has(a) && revealed.has(b)))
      line.classList.toggle('is-final', isDone && revealed.has(a) && revealed.has(b))
    })

    // 字符串纸带：序列化阶段逐格填字；反序列化阶段把已读过的格子淡出，当前读到的高亮
    const writtenCount = st.phase === 'serialize' ? st.written : this.serTokens.length
    const readCount =
      st.phase === 'deserialize' ? st.readIdx + 1 : st.phase === 'done' ? this.serTokens.length : 0
    this.tapeCells.forEach((cell, i) => {
      cell.classList.remove('is-current', 'is-read', 'is-written')
      if (i < writtenCount) {
        const t = this.serTokens[i]
        cell.textContent = t.kind === 'null' ? 'null' : String(t.val)
        cell.classList.add('is-written')
      } else {
        cell.textContent = ''
      }
      if (st.phase === 'serialize' && i === writtenCount - 1) cell.classList.add('is-current')
      if (i < readCount) cell.classList.add('is-read')
      if (st.phase === 'deserialize' && i === st.readIdx) cell.classList.add('is-current')
    })
  }

  resultBanner(result, state) {
    if (state.realCount === 0) {
      return {
        kind: 'info',
        html: `空树：序列化得到 <code>"null"</code>，反序列化读到 <code>null</code> 直接返回空，往返一致。`,
      }
    }
    return {
      kind: 'success',
      html: `🎉 往返成功！序列化字符串 <code>"${result.tokenStr}"</code>，反序列化后重建出的树与原树结构、节点值完全一致。`,
    }
  }
}

export function mountViz(el, opts) {
  return new CodecViz(el, opts)
}

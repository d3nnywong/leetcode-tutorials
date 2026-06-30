/*
 * 二叉树层序遍历「BFS + 队列」动画。
 *
 * 用一个队列从根节点开始，先把 root 放进去；
 * 每一轮只处理「当前队列里已有的全部节点」——这一批节点正好就是同一层。
 * 出队一个节点就记下它的值，再把它的左右孩子（如果存在）放进队尾。
 * 一轮处理完，队列里剩下的全是下一层的节点，循环直到队列空。
 * 因为同一层的节点总是被同一轮处理完，按层收集天然就对。
 */
import { VizPlayer } from '../../components/viz-player/vizPlayer.js'

const MAX_NODES = 10

/* 按 LeetCode 的层序数组（null 表示空节点）建出二叉树，
 * 节点 id 按出现顺序分配，正好与 BFS 访问顺序一致。 */
function buildTree(vals) {
  if (!vals.length || vals[0] == null) {
    return { root: null, nodes: new Map(), maxDepth: 0, maxSlot: -1 }
  }
  const nodes = new Map()
  let idSeq = 0
  const makeNode = (val) => {
    const n = { id: idSeq++, val, left: null, right: null, depth: 0, slot: 0 }
    nodes.set(n.id, n)
    return n
  }
  const root = makeNode(vals[0])
  const queue = [root]
  let i = 1
  while (queue.length && i < vals.length) {
    const node = queue.shift()
    if (i < vals.length) {
      const lv = vals[i++]
      if (lv != null) {
        node.left = makeNode(lv)
        queue.push(node.left)
      }
    }
    if (i < vals.length) {
      const rv = vals[i++]
      if (rv != null) {
        node.right = makeNode(rv)
        queue.push(node.right)
      }
    }
  }
  // 中序遍历分配横向槽位 slot，纵向用 depth，让子树不互相重叠
  let slot = 0
  let maxDepth = 0
  const assign = (node, depth) => {
    if (!node) return
    assign(node.left, depth + 1)
    node.slot = slot++
    node.depth = depth
    if (depth > maxDepth) maxDepth = depth
    assign(node.right, depth + 1)
  }
  assign(root, 0)
  return { root, nodes, maxDepth, maxSlot: slot - 1 }
}

function formatLevels(result) {
  return `[${result.map((lv) => `[${lv.join(', ')}]`).join(', ')}]`
}

export class LevelOrderViz extends VizPlayer {
  constructor(mountEl) {
    super(mountEl, {
      inputs: [
        {
          key: 'root',
          label: '层序数组 root（逗号分隔，null 表示空节点）',
          default: '3,9,20,null,null,15,7',
          width: '22rem',
        },
      ],
      speed: 1100,
      hint: `提示：按 LeetCode 的层序写法填，比如 3,9,20,null,null,15,7（最多 ${MAX_NODES} 个真实节点）。`,
    })
  }

  parseInputs({ root }) {
    const tokens = (root ?? '')
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s !== '')
    const vals = tokens.map((s) => {
      if (s.toLowerCase() === 'null' || s === '#') return null
      const v = Number(s)
      if (!Number.isFinite(v)) throw new Error(`「${s}」不是合法数字（空节点请写 null）`)
      return Math.trunc(v)
    })
    if (vals.length && vals[0] == null) throw new Error('根节点不能是 null（空树请把输入框清空）')
    const count = vals.filter((v) => v != null).length
    if (count > MAX_NODES) throw new Error(`节点数最多 ${MAX_NODES} 个，方便看清动画`)
    const tree = buildTree(vals)
    return {
      tree,
      display: { root: vals.map((v) => (v == null ? 'null' : String(v))).join(',') },
    }
  }

  computeSteps({ tree }) {
    if (!tree.root) {
      return {
        steps: [
          {
            kind: 'empty',
            visitedId: null,
            visitedIds: [],
            queueIds: [],
            childrenAdded: [],
            levelIdx: -1,
            levelSoFar: [],
            resultSoFar: [],
            msg: '根节点是空的，树里一个节点都没有 → 直接返回空列表 <code>[]</code>。',
          },
        ],
        result: [],
      }
    }

    const steps = []
    const queue = [tree.root]
    const visitedIds = []
    const result = []
    let levelIdx = 0

    while (queue.length) {
      const levelSize = queue.length
      const levelVals = []
      for (let i = 0; i < levelSize; i++) {
        const node = queue.shift()
        visitedIds.push(node.id)
        levelVals.push(node.val)
        const childrenAdded = []
        if (node.left) {
          queue.push(node.left)
          childrenAdded.push(node.left.id)
        }
        if (node.right) {
          queue.push(node.right)
          childrenAdded.push(node.right.id)
        }

        let msg = ''
        if (i === 0) {
          msg += `开始第 <strong>${levelIdx + 1}</strong> 层：队列里现在正好是这一层的 ${levelSize} 个节点。`
        }
        msg += `出队 <code>${node.val}</code>，记进本层结果`
        if (childrenAdded.length) {
          msg += `，把它的子节点 ${childrenAdded
            .map((id) => tree.nodes.get(id).val)
            .join('、')} 放入队尾。`
        } else {
          msg += '（它没有子节点）。'
        }
        if (i === levelSize - 1) {
          msg += ` 第 ${levelIdx + 1} 层处理完 → <strong>[${levelVals.join(', ')}]</strong> 加入结果。`
        }

        steps.push({
          kind: 'visit',
          visitedId: node.id,
          visitedIds: [...visitedIds],
          queueIds: queue.map((n) => n.id),
          childrenAdded,
          levelIdx,
          levelSoFar: [...levelVals],
          resultSoFar: result.map((lv) => [...lv]),
          msg,
        })
      }
      result.push(levelVals)
      levelIdx++
    }

    steps.push({
      kind: 'done',
      visitedId: null,
      visitedIds: [...visitedIds],
      queueIds: [],
      childrenAdded: [],
      levelIdx,
      levelSoFar: [],
      resultSoFar: result.map((lv) => [...lv]),
      msg: `队列空了，遍历结束。层序遍历结果：<strong>${formatLevels(result)}</strong>。`,
    })

    return { steps, result }
  }

  buildStage({ tree }, el) {
    el.innerHTML = `
      ${tree.root ? '<div class="lo__chartwrap"></div>' : '<p class="lo__empty-tree">（空树，没有节点）</p>'}
      <div class="lo__queue">
        <div class="lo__queue-label">队列 queue（左边先进，右边后进）</div>
        <div class="lo__queue-row"></div>
      </div>
      <div class="lo__result">
        <div class="lo__result-label">结果 result（按层收集）</div>
        <div class="lo__result-rows"></div>
      </div>
    `
    this.queueRowEl = el.querySelector('.lo__queue-row')
    this.resultRowsEl = el.querySelector('.lo__result-rows')
    this.nodeEls = new Map()
    this.edgeEls = []
    this.nodesById = null
    if (!tree.root) return

    this.nodesById = tree.nodes
    this.geo = this.#geometry(tree)
    el.querySelector('.lo__chartwrap').innerHTML = this.#svg(tree)
    this.svgEl = el.querySelector('.lo__svg')
    this.svgEl
      .querySelectorAll('.lo-node')
      .forEach((g) => this.nodeEls.set(Number(g.dataset.id), g))
    this.edgeEls = [...this.svgEl.querySelectorAll('.lo-edge')]
  }

  #geometry(tree) {
    const unitW = 56
    const levelH = 64
    const marginX = 30
    const marginTop = 26
    const W = (tree.maxSlot + 1) * unitW + marginX * 2
    const H = (tree.maxDepth + 1) * levelH + marginTop + 26
    const pos = (id) => {
      const n = tree.nodes.get(id)
      return { x: marginX + n.slot * unitW + unitW / 2, y: marginTop + n.depth * levelH }
    }
    return { W, H, pos }
  }

  #svg(tree) {
    const { W, H, pos } = this.geo
    let edges = ''
    let nodes = ''
    for (const n of tree.nodes.values()) {
      const p = pos(n.id)
      if (n.left) {
        const c = pos(n.left.id)
        edges += `<line class="lo-edge" data-to="${n.left.id}" x1="${p.x}" y1="${p.y}" x2="${c.x}" y2="${c.y}"/>`
      }
      if (n.right) {
        const c = pos(n.right.id)
        edges += `<line class="lo-edge" data-to="${n.right.id}" x1="${p.x}" y1="${p.y}" x2="${c.x}" y2="${c.y}"/>`
      }
    }
    for (const n of tree.nodes.values()) {
      const p = pos(n.id)
      nodes += `<g class="lo-node" data-id="${n.id}" transform="translate(${p.x},${p.y})">
        <circle class="lo-node__circle" r="19"/>
        <text class="lo-node__val">${n.val}</text>
      </g>`
    }
    return `<svg class="lo__svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" role="img">${edges}${nodes}</svg>`
  }

  renderStep(st) {
    if (!this.nodeEls.size) {
      this.queueRowEl.innerHTML = `<span class="lo__empty">（空）</span>`
      this.resultRowsEl.innerHTML = `<span class="lo__empty">[]</span>`
      return
    }

    this.nodeEls.forEach((g) =>
      g.classList.remove('is-current', 'is-queued', 'is-visited', 'is-new'),
    )
    this.edgeEls.forEach((l) => l.classList.remove('is-active'))

    const visited = new Set(st.visitedIds ?? [])
    const inQueue = new Set(st.queueIds ?? [])
    const justAdded = new Set(st.childrenAdded ?? [])

    visited.forEach((id) => this.nodeEls.get(id)?.classList.add('is-visited'))
    inQueue.forEach((id) => this.nodeEls.get(id)?.classList.add('is-queued'))
    justAdded.forEach((id) => this.nodeEls.get(id)?.classList.add('is-new'))
    if (st.visitedId != null) this.nodeEls.get(st.visitedId)?.classList.add('is-current')

    this.edgeEls.forEach((l) => {
      if (justAdded.has(Number(l.dataset.to))) l.classList.add('is-active')
    })

    // 队列行：从左到右是队首到队尾
    this.queueRowEl.innerHTML = (st.queueIds ?? []).length
      ? st.queueIds
          .map(
            (id, i) =>
              `<span class="lo__qchip${i === 0 ? ' is-front' : ''}">${
                this.nodesById.get(id).val
              }</span>`,
          )
          .join('')
      : `<span class="lo__empty">（空）</span>`

    // 结果区：已收完的层 + 正在收集中的当前层
    const rows = (st.resultSoFar ?? []).map(
      (lv, i) =>
        `<div class="lo__row"><span class="lo__row-label">第 ${i + 1} 层</span>${lv
          .map((v) => `<code class="lo__chip is-done">${v}</code>`)
          .join('')}</div>`,
    )
    if (st.kind === 'visit' && st.levelSoFar?.length) {
      rows.push(
        `<div class="lo__row"><span class="lo__row-label">第 ${
          st.levelIdx + 1
        } 层</span>${st.levelSoFar
          .map((v) => `<code class="lo__chip is-current">${v}</code>`)
          .join('')}</div>`,
      )
    }
    this.resultRowsEl.innerHTML = rows.length
      ? rows.join('')
      : `<span class="lo__empty">（还没有）</span>`
  }

  resultBanner(result) {
    if (!result.length) {
      return { kind: 'info', html: '空树：层序遍历结果是空列表 <code>[]</code>。' }
    }
    return {
      kind: 'success',
      html: `🎉 层序遍历完成，共 <strong>${result.length}</strong> 层：<code>${formatLevels(
        result,
      )}</code>。`,
    }
  }
}

export function mountViz(el, opts) {
  return new LevelOrderViz(el, opts)
}

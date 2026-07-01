/*
 * 「字典树（Trie）插入 + 通配符回溯查找」动画。
 *
 * addWord 把单词逐字符插入一棵共享前缀的树：相同前缀只占一条路径，省空间也省时间。
 * search 从根节点出发逐字符往下走：普通字符只有唯一一条边可以走；
 * 遇到 '.' 就要把当前节点的每一个分支都试一遍——这是一次「试了不行就回溯」的深度优先搜索，
 * 只要有一个分支能撑到单词末尾、并且终点恰好是某个单词的结尾，就算匹配成功。
 */
import { VizPlayer } from '../../components/viz-player/vizPlayer.js'

const MAX_WORDS = 6
const MAX_WORD_LEN = 8
const MAX_QUERY_LEN = 10
const MAX_DOTS = 2

export class WordDictionaryViz extends VizPlayer {
  constructor(mountEl) {
    super(mountEl, {
      inputs: [
        { key: 'words', label: 'addWord 的单词（逗号分隔）', default: 'bad,dad,mad,pat', width: '14rem' },
        { key: 'query', label: 'search 的单词（. 表示通配符）', default: '.at', width: '8rem' },
      ],
      speed: 1100,
      hint: `提示：可改成你自己的单词表和查询词，点「应用」重新演示（最多 ${MAX_WORDS} 个单词，单词与查询词都不超过 ${MAX_WORD_LEN}/${MAX_QUERY_LEN} 个字符，查询词最多 ${MAX_DOTS} 个 .）。`,
    })
  }

  parseInputs({ words, query }) {
    const wordList = (words ?? '')
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter((s) => s !== '')
    if (!wordList.length) throw new Error('至少要 addWord 一个单词')
    if (wordList.length > MAX_WORDS) throw new Error(`单词最多 ${MAX_WORDS} 个`)
    for (const w of wordList) {
      if (!/^[a-z]+$/.test(w)) throw new Error(`「${w}」只能是小写英文字母`)
      if (w.length > MAX_WORD_LEN) throw new Error(`单词「${w}」长度不能超过 ${MAX_WORD_LEN}`)
    }
    const q = (query ?? '').trim().toLowerCase()
    if (!q) throw new Error('查询单词不能为空')
    if (!/^[a-z.]+$/.test(q)) throw new Error('查询单词只能包含小写字母或 .')
    if (q.length > MAX_QUERY_LEN) throw new Error(`查询单词长度不能超过 ${MAX_QUERY_LEN}`)
    const dotCount = (q.match(/\./g) ?? []).length
    if (dotCount > MAX_DOTS) throw new Error(`查询单词里的 . 最多 ${MAX_DOTS} 个`)
    return { words: wordList, query: q, display: { words: wordList.join(','), query: q } }
  }

  computeSteps({ words, query }) {
    let idCounter = 0
    const root = { id: idCounter++, char: '', isEnd: false, children: new Map(), x: 0, y: 0 }

    // ===== 1. 依次插入单词，记录每个词插入时「走过的路径」与「新建的节点」 =====
    const buildOps = []
    for (const word of words) {
      let node = root
      const pathIds = [root.id]
      const newIds = []
      for (const ch of word) {
        let child = node.children.get(ch)
        if (!child) {
          child = { id: idCounter++, char: ch, isEnd: false, children: new Map(), x: 0, y: 0 }
          node.children.set(ch, child)
          newIds.push(child.id)
        }
        pathIds.push(child.id)
        node = child
      }
      node.isEnd = true
      buildOps.push({ word, pathIds, newIds })
    }

    // ===== 2. 收集所有节点 + 给整棵最终的树定坐标（叶子从左到右编号，父节点取子节点中点） =====
    const allNodes = []
    const collect = (node) => {
      allNodes.push(node)
      ;[...node.children.values()].sort((a, b) => a.char.localeCompare(b.char)).forEach(collect)
    }
    collect(root)

    let nextX = 0
    const assignXY = (node, depth) => {
      node.y = depth
      const kids = [...node.children.values()].sort((a, b) => a.char.localeCompare(b.char))
      if (!kids.length) {
        node.x = nextX++
      } else {
        kids.forEach((k) => assignXY(k, depth + 1))
        node.x = (kids[0].x + kids[kids.length - 1].x) / 2
      }
    }
    assignXY(root, 0)

    const edges = []
    for (const n of allNodes) {
      for (const child of n.children.values()) edges.push({ parentId: n.id, childId: child.id })
    }

    this._root = root
    this._nodes = allNodes
    this._edges = edges
    this._nodeById = new Map(allNodes.map((n) => [n.id, n]))
    const allIds = allNodes.map((n) => n.id)

    // ===== 3. 生成「插入」阶段的动画步骤（累计揭示已经建好的节点） =====
    const steps = []
    const builtSoFar = new Set([root.id])
    for (const op of buildOps) {
      op.pathIds.forEach((id) => builtSoFar.add(id))
      steps.push({
        phase: 'build',
        word: op.word,
        builtIds: new Set(builtSoFar),
        pathIds: op.pathIds,
        newIds: op.newIds,
        msg: `执行 <code>addWord("${op.word}")</code>：沿着 ${op.word
          .split('')
          .map((c) => `“${c}”`)
          .join(' → ')} 在字典树里往下走，${
          op.newIds.length ? `新建 ${op.newIds.length} 个节点，` : '路径上的节点都已经存在，'
        }并把终点标记为「单词结尾」（双圈）。`,
      })
    }

    // ===== 4. 生成「查询」阶段：从根出发的 DFS，遇到 '.' 就尝试所有分支，失败就回溯 =====
    let foundPathIds = null
    const dfs = (node, idx, pathIds, branchCtx) => {
      if (idx === query.length) {
        const ok = node.isEnd
        steps.push({
          phase: 'search',
          builtIds: new Set(allIds),
          pathIds: [...pathIds],
          currentId: node.id,
          branchCtx,
          msg: ok
            ? `“${query}” 的 ${query.length} 个字符都匹配完了，当前节点正好是某个单词的结尾 → <strong>命中！</strong>`
            : `“${query}” 的字符都匹配完了，但当前节点不是任何单词的结尾 → 这条路不算数，回溯。`,
        })
        if (ok) foundPathIds = [...pathIds]
        return ok
      }
      const ch = query[idx]
      if (ch !== '.') {
        const child = node.children.get(ch)
        if (!child) {
          steps.push({
            phase: 'search',
            builtIds: new Set(allIds),
            pathIds: [...pathIds],
            currentId: node.id,
            branchCtx,
            msg: `第 ${idx + 1} 个字符要求是 “${ch}”，但当前节点没有这条分支 → 走不通，回溯。`,
          })
          return false
        }
        steps.push({
          phase: 'search',
          builtIds: new Set(allIds),
          pathIds: [...pathIds, child.id],
          currentId: child.id,
          branchCtx,
          msg: `第 ${idx + 1} 个字符是 “${ch}”（普通字符），唯一一条边，直接往下走。`,
        })
        return dfs(child, idx + 1, [...pathIds, child.id], branchCtx)
      }
      // 通配符：把当前节点拥有的每一条分支都试一遍
      const candidates = [...node.children.keys()].sort()
      const failedChars = []
      const wildCtx = { candidates, failedChars, activeChar: null }
      steps.push({
        phase: 'search',
        builtIds: new Set(allIds),
        pathIds: [...pathIds],
        currentId: node.id,
        branchCtx: wildCtx,
        msg: candidates.length
          ? `第 ${idx + 1} 个字符是通配符 “.”，要依次试过当前节点的每条分支：${candidates
              .map((c) => `“${c}”`)
              .join('、')}。`
          : `第 ${idx + 1} 个字符是通配符 “.”，但当前节点没有任何分支可走 → 走不通，回溯。`,
      })
      for (const c of candidates) {
        const child = node.children.get(c)
        const activeCtx = { candidates, failedChars: [...failedChars], activeChar: c }
        steps.push({
          phase: 'search',
          builtIds: new Set(allIds),
          pathIds: [...pathIds, child.id],
          currentId: child.id,
          branchCtx: activeCtx,
          msg: `尝试分支 “${c}”…`,
        })
        if (dfs(child, idx + 1, [...pathIds, child.id], activeCtx)) return true
        failedChars.push(c)
        steps.push({
          phase: 'search',
          builtIds: new Set(allIds),
          pathIds: [...pathIds],
          currentId: node.id,
          branchCtx: { candidates, failedChars: [...failedChars], activeChar: null },
          msg: `分支 “${c}” 这条路没有命中，回溯回来，继续试下一个分支。`,
        })
      }
      return false
    }

    steps.push({
      phase: 'search',
      builtIds: new Set(allIds),
      pathIds: [root.id],
      currentId: root.id,
      branchCtx: null,
      msg: `字典树搭建完成，开始执行 <code>search("${query}")</code>：从根节点出发，逐个字符匹配。`,
    })
    const found = dfs(root, 0, [root.id], null)
    steps[steps.length - 1][found ? 'success' : 'fail'] = true

    return { steps, result: { found, query, foundPathIds } }
  }

  buildStage(state, el) {
    const nodes = this._nodes
    const edges = this._edges
    el.innerHTML = `
      <div class="asw__info"></div>
      <div class="asw__chartwrap"></div>
      <div class="asw__branchlabel">通配符候选分支</div>
      <div class="asw__branches" hidden></div>
      <div class="asw__pathlabel">当前路径</div>
      <div class="asw__path"></div>
    `
    this.infoEl = el.querySelector('.asw__info')
    this.chartEl = el.querySelector('.asw__chartwrap')
    this.branchEl = el.querySelector('.asw__branches')
    this.pathEl = el.querySelector('.asw__path')

    const colW = 52
    const rowH = 70
    const padX = 30
    const padY = 28
    const maxX = Math.max(...nodes.map((n) => n.x))
    const maxY = Math.max(...nodes.map((n) => n.y))
    const cx = (n) => padX + n.x * colW + colW / 2
    const cy = (n) => padY + n.y * rowH + 20
    const W = (maxX + 1) * colW + padX * 2
    const H = (maxY + 1) * rowH + padY * 2

    let edgesHtml = ''
    for (const e of edges) {
      const p = this._nodeById.get(e.parentId)
      const c = this._nodeById.get(e.childId)
      edgesHtml += `<line class="asw-edge" data-child="${c.id}" x1="${cx(p)}" y1="${cy(p)}" x2="${cx(
        c,
      )}" y2="${cy(c)}"/>`
    }
    let nodesHtml = ''
    for (const n of nodes) {
      const isRoot = n.id === this._root.id
      const r = isRoot ? 11 : 18
      nodesHtml += `
        <g class="asw-node${isRoot ? ' asw-node--root' : ''}" data-id="${n.id}">
          <circle class="asw-circle" cx="${cx(n)}" cy="${cy(n)}" r="${r}"/>
          ${n.isEnd ? `<circle class="asw-end-ring" cx="${cx(n)}" cy="${cy(n)}" r="${r + 5}"/>` : ''}
          ${isRoot ? '' : `<text class="asw-val" x="${cx(n)}" y="${cy(n)}">${n.char}</text>`}
        </g>`
    }
    this.chartEl.innerHTML = `<svg class="asw__svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" role="img">
      <g class="asw-edges">${edgesHtml}</g>
      <g class="asw-nodes">${nodesHtml}</g>
    </svg>`

    this.nodeEls = {}
    this.chartEl.querySelectorAll('.asw-node').forEach((g) => {
      this.nodeEls[g.dataset.id] = g
    })
    this.edgeEls = {}
    this.chartEl.querySelectorAll('.asw-edge').forEach((l) => {
      this.edgeEls[l.dataset.child] = l
    })
  }

  renderStep(st, { state }) {
    const built = st.builtIds
    Object.entries(this.nodeEls).forEach(([idStr, g]) => {
      const id = Number(idStr)
      g.classList.remove('is-future', 'is-new', 'is-path', 'is-current', 'is-success')
      g.classList.toggle('is-future', !built.has(id))
    })
    Object.entries(this.edgeEls).forEach(([idStr, l]) => {
      const id = Number(idStr)
      l.classList.toggle('is-future', !built.has(id))
    })

    st.pathIds.forEach((id) => this.nodeEls[id]?.classList.add('is-path'))
    if (st.phase === 'build') {
      st.newIds.forEach((id) => this.nodeEls[id]?.classList.add('is-new'))
      this.infoEl.innerHTML = `执行 <code>addWord("${st.word}")</code>`
    } else {
      if (st.currentId != null) this.nodeEls[st.currentId]?.classList.add('is-current')
      if (st.success) st.pathIds.forEach((id) => this.nodeEls[id]?.classList.add('is-success'))
      this.infoEl.innerHTML = `执行 <code>search("${state.query}")</code>`
    }

    this.pathEl.innerHTML = st.pathIds
      .map((id) => this._nodeById.get(id))
      .filter(Boolean)
      .map((n) => (n.id === this._root.id ? '•' : n.char))
      .join(' <span class="asw__arrow">→</span> ')

    const ctx = st.branchCtx
    if (ctx && ctx.candidates && ctx.candidates.length) {
      this.branchEl.hidden = false
      this.branchEl.innerHTML = ctx.candidates
        .map((c) => {
          let cls = 'asw__chip'
          if (ctx.activeChar === c) cls += ' is-active'
          else if (ctx.failedChars.includes(c)) cls += ' is-fail'
          return `<code class="${cls}">${c}</code>`
        })
        .join('')
    } else {
      this.branchEl.hidden = true
      this.branchEl.innerHTML = ''
    }
  }

  resultBanner(result) {
    if (result.found) {
      const matchedWord = result.foundPathIds
        .filter((id) => id !== this._root.id)
        .map((id) => this._nodeById.get(id)?.char)
        .join('')
      return {
        kind: 'success',
        html: `🎉 <code>search("${result.query}")</code> 返回 <strong>true</strong>：金色路径匹配到了单词 <code>${matchedWord}</code>。`,
      }
    }
    return {
      kind: 'fail',
      html: `🚫 <code>search("${result.query}")</code> 返回 <strong>false</strong>：所有可能的分支都试过了，没有任何单词能匹配到底。`,
    }
  }
}

export function mountViz(el, opts) {
  return new WordDictionaryViz(el, opts)
}

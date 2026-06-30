/*
 * 火星词典「建图 + 拓扑排序（Kahn / BFS）」动画。
 *
 * 第一阶段：依次比较相邻两个单词，找到它们第一个不同的字母，
 * 就能确定「这个字母必须排在那个字母前面」——把它画成一条有向边 u → v。
 * 如果某个单词反而比它的前缀单词更长，直接判定无解。
 *
 * 第二阶段：图建好后，对它做拓扑排序——不断把「入度为 0」（没人必须排在它前面）
 * 的字母放进队列、取出来加进结果，再把它指向的字母入度减一；
 * 减到 0 就接着入队。如果最后还有字母没排进结果，说明图里有环，无解。
 */
import { VizPlayer } from '../../components/viz-player/vizPlayer.js'

const MAX_WORDS = 8
const MAX_LEN = 8
const MAX_LETTERS = 10

export class AlienOrderViz extends VizPlayer {
  constructor(mountEl) {
    super(mountEl, {
      inputs: [
        {
          key: 'words',
          label: '单词列表 words（逗号分隔，小写字母，已按外星字典序排好）',
          default: 'wrt,wrf,er,ett,rftt',
          width: '20rem',
        },
      ],
      speed: 1300,
      hint: `提示：可改成你自己的单词列表，点「应用」重新演示（最多 ${MAX_WORDS} 个单词、每词最多 ${MAX_LEN} 个字母、不同字母最多 ${MAX_LETTERS} 个）。`,
    })
  }

  parseInputs({ words }) {
    const arr = (words ?? '')
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter((s) => s !== '')
      .slice(0, MAX_WORDS)
    if (arr.length < 1) throw new Error('至少要输入 1 个单词')
    for (const w of arr) {
      if (!/^[a-z]+$/.test(w)) throw new Error(`「${w}」只能包含小写英文字母`)
      if (w.length > MAX_LEN) throw new Error(`单词「${w}」太长，最多 ${MAX_LEN} 个字母`)
    }
    const letters = new Set(arr.join('').split(''))
    if (letters.size > MAX_LETTERS) {
      throw new Error(`不同字母太多（最多 ${MAX_LETTERS} 个），换个小一点的例子吧`)
    }
    return { words: arr, display: { words: arr.join(',') } }
  }

  computeSteps({ words }) {
    const steps = []
    const letters = [...new Set(words.join('').split(''))].sort()
    const adj = new Map(letters.map((c) => [c, new Set()]))
    const edgeList = []
    let invalid = null

    // —— 第一阶段：比较相邻单词，建图 ——
    for (let i = 0; i < words.length - 1 && !invalid; i++) {
      const w1 = words[i]
      const w2 = words[i + 1]
      const len = Math.min(w1.length, w2.length)
      let diffIndex = -1
      for (let j = 0; j < len; j++) {
        if (w1[j] !== w2[j]) {
          diffIndex = j
          break
        }
      }

      if (diffIndex === -1) {
        if (w1.length > w2.length) {
          invalid = { reason: 'prefix' }
          steps.push({
            phase: 'edge',
            i,
            w1,
            w2,
            diffIndex: -1,
            edgeAdded: null,
            edgesSoFar: edgeList.map((e) => [...e]),
            msg: `比较「${w1}」和「${w2}」：前 ${len} 个字母都相同，「${w2}」其实是「${w1}」的前缀，但更短的「${w2}」却排在「${w1}」后面——这违反字典序规则（前缀必须排在前面），直接判定<strong>无解</strong>。`,
          })
          break
        }
        steps.push({
          phase: 'edge',
          i,
          w1,
          w2,
          diffIndex: -1,
          edgeAdded: null,
          edgesSoFar: edgeList.map((e) => [...e]),
          msg: `比较「${w1}」和「${w2}」：前 ${len} 个字母都相同，「${w1}」是「${w2}」的前缀（或两者相同），顺序天然成立，没有新信息，跳过。`,
        })
        continue
      }

      const a = w1[diffIndex]
      const b = w2[diffIndex]
      let edgeAdded = null
      if (!adj.get(a).has(b)) {
        adj.get(a).add(b)
        edgeList.push([a, b])
        edgeAdded = [a, b]
      }
      steps.push({
        phase: 'edge',
        i,
        w1,
        w2,
        diffIndex,
        edgeAdded,
        edgesSoFar: edgeList.map((e) => [...e]),
        msg: edgeAdded
          ? `比较「${w1}」和「${w2}」：第 ${diffIndex + 1} 个字母第一次不同——「${a}」在「${b}」前面。连一条边 <code>${a} → ${b}</code>。`
          : `比较「${w1}」和「${w2}」：第 ${diffIndex + 1} 个字母第一次不同——「${a}」在「${b}」前面，但这条边 <code>${a} → ${b}</code> 之前已经记过了，跳过。`,
      })
    }

    if (invalid) {
      return { steps, result: { order: null, reason: 'prefix' } }
    }

    // —— 第二阶段：拓扑排序（Kahn 算法 / BFS）——
    const inDegree = new Map(letters.map((c) => [c, 0]))
    for (const [, v] of edgeList) inDegree.set(v, inDegree.get(v) + 1)
    const snapshot = () => Object.fromEntries(inDegree)

    const queue = letters.filter((c) => inDegree.get(c) === 0)
    const order = []

    steps.push({
      phase: 'bfsInit',
      queue: [...queue],
      order: [...order],
      inDegree: snapshot(),
      edgesSoFar: edgeList.map((e) => [...e]),
      msg: `图建好了，一共 ${letters.length} 个字母。先找出所有<strong>入度为 0</strong>（没有字母必须排在它前面）的字母入队：${
        queue.length ? queue.map((c) => `<code>${c}</code>`).join('、') : '一个都没有，说明一开始就存在环'
      }。`,
    })

    let qi = 0
    while (qi < queue.length) {
      const u = queue[qi]
      qi++
      order.push(u)
      const newly = []
      for (const v of adj.get(u)) {
        inDegree.set(v, inDegree.get(v) - 1)
        if (inDegree.get(v) === 0) {
          queue.push(v)
          newly.push(v)
        }
      }
      steps.push({
        phase: 'bfsPop',
        u,
        queue: queue.slice(qi),
        order: [...order],
        inDegree: snapshot(),
        newly,
        edgesSoFar: edgeList.map((e) => [...e]),
        msg: `从队列取出「${u}」，加进结果序列。把它指向的字母的入度都减 1${
          newly.length
            ? `，其中 ${newly.map((c) => `<code>${c}</code>`).join('、')} 的入度也变成了 0，入队。`
            : '，但没有新的字母入度归零。'
        }`,
      })
    }

    if (order.length < letters.length) {
      const stuck = letters.filter((c) => !order.includes(c))
      steps.push({
        phase: 'done',
        order: [...order],
        inDegree: snapshot(),
        stuck,
        edgesSoFar: edgeList.map((e) => [...e]),
        msg: `队列空了，但 ${stuck.map((c) => `<code>${c}</code>`).join('、')} 始终没能排进结果——它们的入度降不到 0，说明图里存在<strong>环</strong>，没有合法的字母顺序。`,
      })
      return { steps, result: { order: null, reason: 'cycle', stuck } }
    }

    steps.push({
      phase: 'done',
      order: [...order],
      inDegree: snapshot(),
      stuck: [],
      edgesSoFar: edgeList.map((e) => [...e]),
      msg: `所有 ${letters.length} 个字母都排进了结果，拓扑排序完成！外星语言的字母顺序是：<strong>${order.join('')}</strong>。`,
    })

    return { steps, result: { order: order.join(''), reason: 'ok' } }
  }

  buildStage({ words }, el) {
    const letters = [...new Set(words.join('').split(''))].sort()
    this.letters = letters
    this.geo = this.#geometry(letters)
    el.innerHTML = `
      <div class="adic__words"></div>
      <div class="adic__graphwrap">${this.#svg(letters)}</div>
      <div class="adic__row">
        <div class="adic__col">
          <span class="adic__label">BFS 队列（入度为 0）</span>
          <div class="adic__queue"></div>
        </div>
        <div class="adic__col">
          <span class="adic__label">已确定的顺序</span>
          <div class="adic__order"></div>
        </div>
      </div>
    `
    this.wordsEl = el.querySelector('.adic__words')
    this.svgEl = el.querySelector('.adic__svg')
    this.edgesEl = el.querySelector('.adic__edges')
    this.queueEl = el.querySelector('.adic__queue')
    this.orderEl = el.querySelector('.adic__order')

    this.wordsEl.innerHTML = words
      .map(
        (w, wi) =>
          `<span class="adic__word" data-w="${wi}">${[...w]
            .map((c, ci) => `<span class="adic__ch" data-c="${ci}">${c}</span>`)
            .join('')}</span>`,
      )
      .join('')
    this.wordEls = [...this.wordsEl.querySelectorAll('.adic__word')]
  }

  #geometry(letters) {
    const n = Math.max(letters.length, 1)
    const W = 300
    const H = 280
    const cx = W / 2
    const cy = H / 2 + 6
    const R = Math.min(105, 40 + n * 9)
    const r = 19
    const pos = {}
    letters.forEach((c, i) => {
      const angle = -Math.PI / 2 + (2 * Math.PI * i) / n
      pos[c] = { x: cx + R * Math.cos(angle), y: cy + R * Math.sin(angle) }
    })
    return { W, H, pos, r }
  }

  #svg(letters) {
    const g = this.geo
    const nodes = letters
      .map((c) => {
        const p = g.pos[c]
        return `<g class="adic__node" data-c="${c}" transform="translate(${p.x},${p.y})">
          <circle r="${g.r}"></circle>
          <text class="adic__letter" dy="0.32em">${c}</text>
          <text class="adic__deg" x="${g.r - 2}" y="${-g.r - 4}"></text>
        </g>`
      })
      .join('')
    return `<svg class="adic__svg" viewBox="0 0 ${g.W} ${g.H}" preserveAspectRatio="xMidYMid meet" role="img">
      <defs>
        <marker id="adic-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0L10,5L0,10z"></path>
        </marker>
      </defs>
      <g class="adic__edges"></g>
      ${nodes}
    </svg>`
  }

  renderStep(st) {
    // 1. 单词行：高亮当前比较的一对单词与第一个不同的字母
    this.wordEls.forEach((wEl, wi) => {
      const isPair = st.phase === 'edge' && (wi === st.i || wi === st.i + 1)
      wEl.classList.toggle('is-pair', isPair)
      const chEls = [...wEl.querySelectorAll('.adic__ch')]
      chEls.forEach((chEl, ci) => {
        chEl.className = 'adic__ch'
        if (!isPair) return
        if (st.diffIndex >= 0 && ci === st.diffIndex) {
          chEl.classList.add(wi === st.i ? 'is-from' : 'is-to')
        } else if (st.diffIndex === -1 || ci < st.diffIndex) {
          chEl.classList.add('is-same')
        }
      })
    })

    // 2. 图：边
    const g = this.geo
    this.edgesEl.innerHTML = (st.edgesSoFar ?? [])
      .map(([u, v]) => {
        const p1 = g.pos[u]
        const p2 = g.pos[v]
        const dx = p2.x - p1.x
        const dy = p2.y - p1.y
        const len = Math.hypot(dx, dy) || 1
        const ux = dx / len
        const uy = dy / len
        const x1 = p1.x + ux * g.r
        const y1 = p1.y + uy * g.r
        const x2 = p2.x - ux * (g.r + 7)
        const y2 = p2.y - uy * (g.r + 7)
        const isNew =
          st.phase === 'edge' && st.edgeAdded && st.edgeAdded[0] === u && st.edgeAdded[1] === v
        return `<line class="adic__edge${isNew ? ' is-new' : ''}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" marker-end="url(#adic-arrow)"></line>`
      })
      .join('')

    // 3. 图：节点
    this.svgEl.querySelectorAll('.adic__node').forEach((nEl) => {
      const c = nEl.dataset.c
      nEl.classList.remove('is-from', 'is-to', 'is-current', 'is-queued', 'is-done', 'is-stuck')
      if (st.phase === 'edge' && st.diffIndex >= 0) {
        if (c === st.w1[st.diffIndex]) nEl.classList.add('is-from')
        if (c === st.w2[st.diffIndex]) nEl.classList.add('is-to')
      }
      if (st.phase === 'bfsPop' && c === st.u) nEl.classList.add('is-current')
      if ((st.phase === 'bfsInit' || st.phase === 'bfsPop') && st.queue?.includes(c)) {
        nEl.classList.add('is-queued')
      }
      if (st.order?.includes(c) && c !== st.u) nEl.classList.add('is-done')
      if (st.phase === 'done' && st.stuck?.includes(c)) nEl.classList.add('is-stuck')

      const degEl = nEl.querySelector('.adic__deg')
      degEl.textContent = st.inDegree ? st.inDegree[c] : ''
    })

    // 4. 队列 / 顺序两行
    this.queueEl.innerHTML = st.queue?.length
      ? st.queue.map((c) => `<code class="adic__chip">${c}</code>`).join('')
      : `<span class="adic__empty">${st.phase === 'edge' ? '（建图中…）' : '（空）'}</span>`
    this.orderEl.innerHTML = st.order?.length
      ? st.order.map((c) => `<code class="adic__chip is-ok">${c}</code>`).join('')
      : `<span class="adic__empty">（还没有）</span>`
  }

  resultBanner(result) {
    if (result.reason === 'ok') {
      return {
        kind: 'success',
        html: `🎉 拓扑排序成功！这门外星语言的字母顺序是 <strong>${result.order}</strong>。`,
      }
    }
    if (result.reason === 'prefix') {
      return {
        kind: 'fail',
        html: `🚫 顺序不合法：某个单词其实是前一个单词的前缀，却被排在了后面，这违反字典序规则，<strong>没有合法顺序</strong>，应返回 <code>""</code>。`,
      }
    }
    return {
      kind: 'fail',
      html: `🚫 检测到环：字母 ${result.stuck
        ?.map((c) => `<code>${c}</code>`)
        .join('、')} 之间互相要求对方排在前面，<strong>没有合法顺序</strong>，应返回 <code>""</code>。`,
    }
  }
}

export function mountViz(el, opts) {
  return new AlienOrderViz(el, opts)
}

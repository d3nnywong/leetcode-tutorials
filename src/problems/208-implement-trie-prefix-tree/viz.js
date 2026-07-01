/*
 * 实现 Trie (前缀树)「逐字符走树」动画。
 *
 * Trie 是一棵多叉树：根节点不代表任何字符，每条边代表「往下走一个字符」，
 * 节点本身只是「走到这里」这个状态，会不会是某个完整单词的结尾，
 * 靠节点上的 isEnd 标记决定（而不是看它是不是叶子）。
 *
 * insert(word)：从根出发，逐个字符往下走，没有对应的子节点就新建一个，
 *   最后把走到的节点标记 isEnd = true。
 * search(word)：逐字符往下走，只要某一步没有对应分支就提前判定 false；
 *   走完整个单词后，还要看终点是否 isEnd —— 走得到不代表它是一个完整插入过的单词，
 *   可能只是别的词的前缀（比如插入了 "apple" 后 search("app") 应该是 false）。
 * startsWith(prefix)：和 search 一样逐字符走，但走完就直接算 true，不用看 isEnd。
 *
 * 核心：插入、查找、查前缀，三件事用的是同一套「逐字符下树」的骨架，
 * 区别只在「走不到怎么办」和「走到了之后还要不要再看 isEnd」。
 */
import { VizPlayer } from '../../components/viz-player/vizPlayer.js'

const MAX_OPS = 8
const MAX_WORD = 12

// 中序式布局：叶子节点按出现顺序排开，内部节点取子节点 x 的中点
function snapshotNodes(root) {
  const list = []
  let leafCounter = 0
  function visit(node) {
    const chars = Object.keys(node.children).sort()
    let x
    if (chars.length === 0) {
      x = leafCounter++
    } else {
      chars.forEach((c) => visit(node.children[c]))
      const xs = chars.map((c) => node.children[c]._x)
      x = (Math.min(...xs) + Math.max(...xs)) / 2
    }
    node._x = x
    list.push({
      id: node.id,
      parentId: node.parent,
      char: node.char,
      depth: node.depth,
      isEnd: node.isEnd,
      x,
    })
  }
  visit(root)
  return list
}

export class TrieViz extends VizPlayer {
  constructor(mountEl) {
    super(mountEl, {
      inputs: [
        {
          key: 'ops',
          label: '操作序列（insert/search/startsWith 单词，逗号分隔）',
          default: 'insert apple, search apple, search app, startsWith app, insert app, search app',
          width: '34rem',
        },
      ],
      speed: 850,
      hint: `格式：「insert 单词」「search 单词」「startsWith 单词」用逗号分隔，最多 ${MAX_OPS} 条，单词为 1~${MAX_WORD} 位小写字母。`,
    })
  }

  parseInputs({ ops }) {
    const raw = (ops ?? '')
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s !== '')
      .slice(0, MAX_OPS)
    if (raw.length === 0) throw new Error('至少要有 1 条操作')
    const parsed = raw.map((tok) => {
      const m = tok.match(/^(insert|search|startswith)\s+([a-z]{1,12})$/i)
      if (!m) {
        throw new Error(
          `「${tok}」格式不对，应写成「insert 单词」「search 单词」或「startsWith 单词」（单词 1~${MAX_WORD} 位小写字母）`,
        )
      }
      const type = m[1].toLowerCase() === 'startswith' ? 'startsWith' : m[1].toLowerCase()
      return { type, word: m[2].toLowerCase() }
    })
    return { ops: parsed, display: { ops: raw.join(', ') } }
  }

  computeSteps({ ops }) {
    let nodeId = 0
    const root = { id: nodeId++, char: '', parent: null, depth: 0, children: {}, isEnd: false }
    const steps = []
    const resultsSoFar = ops.map(() => undefined)

    for (let oi = 0; oi < ops.length; oi++) {
      const { type, word } = ops[oi]
      let cur = root
      const path = [root.id]
      let fail = false

      for (let i = 0; i < word.length; i++) {
        const c = word[i]
        const existed = !!cur.children[c]

        if (type === 'insert') {
          if (!existed) {
            cur.children[c] = { id: nodeId++, char: c, parent: cur.id, depth: cur.depth + 1, children: {}, isEnd: false }
          }
          cur = cur.children[c]
          path.push(cur.id)
          steps.push({
            kind: 'walk',
            type,
            word,
            oi,
            i,
            path: [...path],
            current: cur.id,
            newId: existed ? null : cur.id,
            nodes: snapshotNodes(root),
            resultsSoFar: [...resultsSoFar],
            msg: `<strong>insert("${word}")</strong>：第 ${i + 1}/${word.length} 个字符 '${c}'：${
              existed ? '已有这条分支，直接复用节点' : '没有这条分支，新建一个节点'
            }，指针下移一层。`,
          })
        } else if (existed) {
          cur = cur.children[c]
          path.push(cur.id)
          steps.push({
            kind: 'walk',
            type,
            word,
            oi,
            i,
            path: [...path],
            current: cur.id,
            newId: null,
            nodes: snapshotNodes(root),
            resultsSoFar: [...resultsSoFar],
            msg: `<strong>${type}("${word}")</strong>：第 ${i + 1}/${word.length} 个字符 '${c}' 存在 → 指针下移一层。`,
          })
        } else {
          fail = true
          steps.push({
            kind: 'walk',
            type,
            word,
            oi,
            i,
            path: [...path],
            current: cur.id,
            newId: null,
            missing: true,
            missingChar: c,
            nodes: snapshotNodes(root),
            resultsSoFar: [...resultsSoFar],
            msg: `<strong>${type}("${word}")</strong>：第 ${
              i + 1
            }/${word.length} 个字符 '${c}' 在当前节点下不存在 → 半路判定失败，停止下探。`,
          })
          break
        }
      }

      let result
      if (type === 'insert') {
        cur.isEnd = true
        result = 'void'
        steps.push({
          kind: 'done',
          type,
          word,
          oi,
          path: [...path],
          current: cur.id,
          fail: false,
          result: 'void',
          nodes: snapshotNodes(root),
          msg: `<strong>insert("${word}")</strong> 完成：把走到的节点标记为「单词结尾」。`,
        })
      } else {
        if (fail) {
          result = false
        } else if (type === 'search') {
          result = cur.isEnd
        } else {
          result = true
        }
        steps.push({
          kind: 'done',
          type,
          word,
          oi,
          path: [...path],
          current: cur.id,
          fail,
          result,
          nodes: snapshotNodes(root),
          msg: fail
            ? `<strong>${type}("${word}")</strong> → 字符路径中断 → 返回 <strong>false</strong>。`
            : type === 'search'
              ? result
                ? `<strong>search("${word}")</strong> → 路径存在，且终点标记了「单词结尾」→ 返回 <strong>true</strong>。`
                : `<strong>search("${word}")</strong> → 路径存在，但终点<strong>没有</strong>标记「单词结尾」（只是别的词的前缀）→ 返回 <strong>false</strong>。`
              : `<strong>startsWith("${word}")</strong> → 路径完整存在（不用管是不是单词结尾）→ 返回 <strong>true</strong>。`,
        })
      }
      resultsSoFar[oi] = result
      steps[steps.length - 1].resultsSoFar = [...resultsSoFar]
    }

    return { steps, result: ops.map((o, i) => ({ ...o, result: resultsSoFar[i] })) }
  }

  buildStage(state, el) {
    el.innerHTML = `
      <div class="tn__ops"></div>
      <div class="tn__chartwrap"></div>
      <div class="tn__pathline"></div>
    `
    this.opsEl = el.querySelector('.tn__ops')
    this.chartEl = el.querySelector('.tn__chartwrap')
    this.pathEl = el.querySelector('.tn__pathline')
  }

  #layout(nodes) {
    const colW = 50
    const rowH = 66
    const padX = 28
    const padY = 26
    const maxX = Math.max(...nodes.map((n) => n.x))
    const maxY = Math.max(...nodes.map((n) => n.depth))
    const cx = (n) => padX + n.x * colW + colW / 2
    const cy = (n) => padY + n.depth * rowH + 22
    return { cx, cy, W: (maxX + 1) * colW + padX * 2, H: (maxY + 1) * rowH + padY * 2 }
  }

  #renderSvg(nodes, st) {
    const geo = this.#layout(nodes)
    const byId = new Map(nodes.map((n) => [n.id, n]))
    const pathSet = new Set(st.path)
    const celebrate = st.kind === 'done' && !st.fail && (st.result === true || st.result === 'void')
    const failId = st.kind === 'done' && st.fail ? st.current : st.kind === 'walk' && st.missing ? st.current : null

    let edges = ''
    let circles = ''
    for (const n of nodes) {
      if (n.parentId == null) continue
      const p = byId.get(n.parentId)
      const active = pathSet.has(n.id) && pathSet.has(p.id)
      const x1 = geo.cx(p)
      const y1 = geo.cy(p)
      const x2 = geo.cx(n)
      const y2 = geo.cy(n)
      edges += `<line class="tn-edge${active ? ' is-active' : ''}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`
      edges += `<text class="tn-edgelabel${active ? ' is-active' : ''}" x="${(x1 + x2) / 2}" y="${
        (y1 + y2) / 2 - 6
      }">${n.char}</text>`
    }
    for (const n of nodes) {
      let kind = 'idle'
      if (failId === n.id) kind = 'fail'
      else if (celebrate && pathSet.has(n.id)) kind = 'success'
      else if (st.current === n.id) kind = 'current'
      else if (pathSet.has(n.id)) kind = 'path'
      const cx = geo.cx(n)
      const cy = geo.cy(n)
      const label = n.parentId == null ? '•' : n.char
      circles += `
        <g class="tn-node" data-id="${n.id}">
          <circle class="tn-circle tn-circle--${kind}${n.id === st.newId ? ' is-new' : ''}" cx="${cx}" cy="${cy}" r="17"/>
          <text class="tn-val" x="${cx}" y="${cy}">${label}</text>
          ${n.isEnd ? `<circle class="tn-enddot" cx="${cx + 12}" cy="${cy - 12}" r="4.5"/>` : ''}
        </g>`
    }

    return `<svg class="tn__svg" width="${geo.W}" height="${geo.H}" viewBox="0 0 ${geo.W} ${geo.H}" preserveAspectRatio="xMidYMid meet" role="img">
      <g class="tn-edges">${edges}</g>
      <g class="tn-nodes">${circles}</g>
    </svg>`
  }

  renderStep(st, { state }) {
    // 操作队列
    this.opsEl.innerHTML = state.ops
      .map((o, idx) => {
        const status = idx < st.oi ? 'is-done' : idx === st.oi ? 'is-active' : 'is-pending'
        const rv = st.resultsSoFar ? st.resultsSoFar[idx] : undefined
        let resHtml = ''
        if (rv === 'void') resHtml = ` <span class="tn__opres">✓</span>`
        else if (rv === true) resHtml = ` <span class="tn__opres tn__opres--ok">true</span>`
        else if (rv === false) resHtml = ` <span class="tn__opres tn__opres--bad">false</span>`
        return `<span class="tn__opchip ${status}">${o.type}("${o.word}")${resHtml}</span>`
      })
      .join('')

    // 树
    this.chartEl.innerHTML = this.#renderSvg(st.nodes, st)

    // 当前路径文字
    const word = st.word
    const matchedChars = word.slice(0, st.path.length - 1)
    let line = `当前路径：<code>root</code>${matchedChars
      .split('')
      .map((c) => ` → <code>${c}</code>`)
      .join('')}`
    if ((st.kind === 'walk' && st.missing) || (st.kind === 'done' && st.fail)) {
      const missingChar = st.missingChar ?? word[st.path.length - 1]
      line += ` → <code class="tn__pathmiss">${missingChar} ✗</code>`
    }
    this.pathEl.innerHTML = line
  }

  resultBanner(result) {
    const items = result
      .map((r) =>
        r.type === 'insert'
          ? `<code>insert("${r.word}") → 完成</code>`
          : `<code>${r.type}("${r.word}") → ${r.result}</code>`,
      )
      .join(' &nbsp; ')
    return {
      kind: 'info',
      html: `🌲 全部操作演示完毕：${items}`,
    }
  }
}

export function mountViz(el, opts) {
  return new TrieViz(el, opts)
}

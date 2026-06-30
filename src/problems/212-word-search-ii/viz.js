/*
 * 单词搜索 II「Trie（字典树）+ 回溯 DFS」动画。
 *
 * 笨办法是对每个单词都在网格上跑一次「单词搜索 I」的 DFS —— 单词一多，
 * 相同的前缀（比如多个单词都以 "th" 开头）会被反复地、独立地搜很多遍。
 *
 * 聪明的办法：先把所有单词一起插进一棵 Trie（公共前缀只存一份），
 * 然后只对网格做 **一次** DFS：每走到一个格子，就看 Trie 当前节点
 * 有没有这个字母的分支——
 *   - 没有 → 这个方向连前缀都不对，直接剪掉，不用往下试任何单词；
 *   - 有 → 往下走，如果恰好落在某个单词的结尾，就说明找到了它。
 * 用过的格子临时标记为已访问（防止同一单词重复用同一个格子），
 * 回溯时再还原，这样才能换别的方向继续试。
 */
import { VizPlayer } from '../../components/viz-player/vizPlayer.js'

const MAX_ROWS = 6
const MAX_COLS = 6
const MAX_WORDS = 6
const MAX_WORD_LEN = 8
const DIRS = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
]

function buildTrie(words) {
  const root = { children: {}, word: null }
  for (const w of words) {
    let node = root
    for (const ch of w) {
      if (!node.children[ch]) node.children[ch] = { children: {}, word: null }
      node = node.children[ch]
    }
    node.word = w
  }
  return root
}

function pathStr(board, path) {
  return path.map(([i, j]) => board[i][j]).join('')
}

export class WordSearchViz extends VizPlayer {
  constructor(mountEl) {
    super(mountEl, {
      inputs: [
        {
          key: 'board',
          label: '字母网格 board（行用「;」分隔，列用逗号分隔）',
          default: 'o,a,a,n;e,t,a,e;i,h,k,r;i,f,l,v',
          width: '21rem',
        },
        {
          key: 'words',
          label: '单词列表 words（逗号分隔）',
          default: 'oath,pea,eat,rain',
          width: '14rem',
        },
      ],
      speed: 850,
      hint: `提示：网格最多 ${MAX_ROWS}×${MAX_COLS}，单词最多 ${MAX_WORDS} 个、每个最长 ${MAX_WORD_LEN} 个字母；改完点「应用」重新演示。`,
    })
  }

  parseInputs({ board, words }) {
    const rows = (board ?? '')
      .split(';')
      .map((row) =>
        row
          .split(',')
          .map((c) => c.trim().toLowerCase())
          .filter((c) => c !== ''),
      )
      .filter((row) => row.length > 0)
      .slice(0, MAX_ROWS)
      .map((row) => row.slice(0, MAX_COLS))

    if (rows.length === 0) throw new Error('网格 board 不能为空')
    const cols = rows[0].length
    for (const row of rows) {
      if (row.length !== cols) throw new Error('每一行的列数必须相同')
      for (const c of row) {
        if (!/^[a-z]$/.test(c)) throw new Error(`「${c}」不是合法的单个小写字母`)
      }
    }

    const seen = new Set()
    const wordList = (words ?? '')
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter((s) => s !== '')
      .slice(0, MAX_WORDS)
      .map((s) => s.slice(0, MAX_WORD_LEN))
      .filter((s) => {
        if (seen.has(s)) return false
        seen.add(s)
        return true
      })
    if (wordList.length === 0) throw new Error('至少要有 1 个单词')
    for (const w of wordList) {
      if (!/^[a-z]+$/.test(w)) throw new Error(`「${w}」必须只由小写英文字母组成`)
    }

    return {
      board: rows,
      words: wordList,
      display: {
        board: rows.map((r) => r.join(',')).join(';'),
        words: wordList.join(','),
      },
    }
  }

  computeSteps({ board, words }) {
    const rows = board.length
    const cols = board[0].length
    const root = buildTrie(words)
    const grid = board.map((r) => r.slice())
    const steps = []
    const foundSet = new Set()

    const dfs = (i, j, node, path) => {
      const ch = grid[i][j]
      const next = node.children[ch]
      path.push([i, j])
      let foundWord = null
      if (next.word) {
        foundWord = next.word
        next.word = null // 避免之后又把同一个单词重复算一遍
        foundSet.add(foundWord)
      }
      steps.push({
        type: 'enter',
        i,
        j,
        path: path.slice(),
        found: foundWord,
        foundSoFar: [...foundSet],
        msg: foundWord
          ? `走到 (${i},${j}) = <code>${ch}</code>，路径 "<strong>${pathStr(
              board,
              path,
            )}</strong>" 正好落在 Trie 的单词结尾上 → 找到单词「<strong>${foundWord}</strong>」！顺手把这个单词节点清空，避免以后重复统计。`
          : `走到 (${i},${j}) = <code>${ch}</code>，路径 "<strong>${pathStr(
              board,
              path,
            )}</strong>" 命中 Trie 上的对应节点。标记这个格子已访问，继续往上下左右四个方向，看 Trie 这个节点还能不能接下去。`,
      })
      const saved = grid[i][j]
      grid[i][j] = '#'
      for (const [di, dj] of DIRS) {
        const ni = i + di
        const nj = j + dj
        if (ni < 0 || nj < 0 || ni >= rows || nj >= cols) continue
        if (grid[ni][nj] === '#') continue
        if (!next.children[grid[ni][nj]]) continue
        dfs(ni, nj, next, path)
      }
      grid[i][j] = saved
      path.pop()
      steps.push({
        type: 'backtrack',
        i,
        j,
        path: path.slice(),
        foundSoFar: [...foundSet],
        msg: `从 (${i},${j}) 回溯：撤销「已访问」标记，把字母还给格子，路径退回到 "<strong>${pathStr(
          board,
          path,
        )}</strong>"，继续尝试这个节点剩下的方向。`,
      })
    }

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const ch = grid[i][j]
        if (!root.children[ch]) {
          steps.push({
            type: 'skip',
            i,
            j,
            path: [],
            foundSoFar: [...foundSet],
            msg: `扫描起点 (${i},${j})：格子是 <code>${ch}</code>，但 Trie 的根节点没有 <code>${ch}</code> 这个分支——所有目标单词都不是以 <code>${ch}</code> 开头，直接跳过，省掉一次没意义的 DFS。`,
          })
          continue
        }
        dfs(i, j, root, [])
      }
    }

    return { steps, result: [...foundSet] }
  }

  buildStage({ board, words }, el) {
    const cols = board[0].length
    el.innerHTML = `
      <div class="ws__top">
        <div class="ws__boardwrap">
          <div class="ws__board" style="grid-template-columns: repeat(${cols}, 1fr)"></div>
        </div>
        <div class="ws__side">
          <div class="ws__box">
            <div class="ws__boxlabel">当前 Trie 路径</div>
            <div class="ws__trie"></div>
          </div>
          <div class="ws__box">
            <div class="ws__boxlabel">目标单词（${words.length} 个）</div>
            <div class="ws__found"></div>
          </div>
        </div>
      </div>
    `
    this.boardEl = el.querySelector('.ws__board')
    this.trieEl = el.querySelector('.ws__trie')
    this.foundEl = el.querySelector('.ws__found')

    this.boardEl.innerHTML = board
      .map((row, i) =>
        row
          .map(
            (c, j) =>
              `<span class="ws__cell" data-i="${i}" data-j="${j}">${c}</span>`,
          )
          .join(''),
      )
      .join('')
    this.cellEls = {}
    this.boardEl.querySelectorAll('.ws__cell').forEach((c) => {
      this.cellEls[`${c.dataset.i}-${c.dataset.j}`] = c
    })
  }

  renderStep(st, { state }) {
    Object.values(this.cellEls).forEach((c) => (c.className = 'ws__cell'))

    if (st.type === 'skip') {
      this.cellEls[`${st.i}-${st.j}`]?.classList.add('is-skip')
    } else {
      const path = st.path ?? []
      path.forEach(([i, j], idx) => {
        const cell = this.cellEls[`${i}-${j}`]
        if (!cell) return
        if (st.found) cell.classList.add('is-gold')
        else if (idx === path.length - 1) cell.classList.add('is-current')
        else cell.classList.add('is-path')
      })
    }

    const path = st.path ?? []
    this.trieEl.innerHTML =
      `<span class="ws__node ws__node--root">root</span>` +
      path
        .map(([i, j], idx) => {
          const isLast = idx === path.length - 1
          const cls = st.found && isLast ? ' is-found' : ''
          return `<span class="ws__arrow">→</span><span class="ws__node${cls}">${state.board[i][j]}</span>`
        })
        .join('')

    const foundSoFar = new Set(st.foundSoFar ?? [])
    this.foundEl.innerHTML = state.words
      .map((w) => {
        const found = foundSoFar.has(w)
        return `<span class="ws__wordchip${found ? ' is-found' : ''}">${
          found ? '✓ ' : ''
        }${w}</span>`
      })
      .join('')
  }

  resultBanner(result, state) {
    const notFound = state.words.filter((w) => !result.includes(w))
    if (result.length === 0) {
      return {
        kind: 'fail',
        html: `🚫 网格里一个目标单词都拼不出来：${state.words
          .map((w) => `<code>${w}</code>`)
          .join('、')}。`,
      }
    }
    return {
      kind: 'success',
      html:
        `🎉 一次 DFS 扫描，从网格里找到了 ${result.length} 个单词：` +
        `${result.map((w) => `<code>${w}</code>`).join('、')}。` +
        (notFound.length
          ? ` 没找到的：${notFound
              .map((w) => `<code>${w}</code>`)
              .join('、')}（在这个网格里拼不出来）。`
          : ''),
    }
  }
}

export function mountViz(el, opts) {
  return new WordSearchViz(el, opts)
}

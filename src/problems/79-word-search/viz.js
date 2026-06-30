/*
 * 单词搜索「网格上的 DFS + 回溯」动画。
 *
 * 从网格里任意一个等于 word[0] 的格子出发，往上/下/左/右四个方向尝试：
 * 如果某个相邻格子的字母正好是 word 的下一个字符，就「走过去」继续匹配下一个字符
 * （走过的格子要标记为「已用」，同一个格子在这趟搜索里不能重复使用）。
 * 一旦四个方向都走不通（或越界、或已用过、或字母对不上），就「回溯」——
 * 把当前格子的「已用」标记撤销，退回上一格，换一个方向再试。
 * 只要某次尝试把 word 的所有字符都匹配完，就找到了；
 * 如果所有起点、所有分支都试过仍然找不到，单词就不存在于网格中。
 */
import { VizPlayer } from '../../components/viz-player/vizPlayer.js'

const MAX_ROWS = 6
const MAX_COLS = 6
const MAX_WORD_LEN = 10
const MAX_STEPS = 600

// 固定按 上、下、左、右 的顺序尝试四个方向
const DIRS = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
]

class StepLimitExceeded {}

export class WordSearchViz extends VizPlayer {
  constructor(mountEl) {
    super(mountEl, {
      inputs: [
        {
          key: 'board',
          label: '网格 board（分号分隔行，逗号分隔列，单字母）',
          default: 'A,B,C,E;S,F,C,S;A,D,E,E',
          width: '17rem',
        },
        { key: 'word', label: 'word', default: 'SEE', width: '8rem', maxlength: MAX_WORD_LEN },
      ],
      speed: 900,
      hint: `提示：试试把 word 改成 ABCCED 看一路匹配、零回溯就成功；改成 ABCB 看所有起点都试过、
             全部回溯后仍找不到。网格最多 ${MAX_ROWS}×${MAX_COLS}，word 最多 ${MAX_WORD_LEN} 个字母。`,
    })
  }

  parseInputs({ board, word }) {
    const rows = (board ?? '')
      .split(';')
      .map((r) => r.trim())
      .filter((r) => r !== '')
    if (rows.length === 0) throw new Error('网格不能为空')
    if (rows.length > MAX_ROWS) throw new Error(`行数最多 ${MAX_ROWS} 行`)

    const parsedBoard = rows.map((r) =>
      r
        .split(',')
        .map((c) => c.trim())
        .filter((c) => c !== ''),
    )
    const n = parsedBoard[0].length
    if (n === 0) throw new Error('每行至少要有 1 个字母')
    if (n > MAX_COLS) throw new Error(`列数最多 ${MAX_COLS} 列`)
    if (parsedBoard.some((r) => r.length !== n)) throw new Error('每行的列数必须相同')
    for (const row of parsedBoard) {
      for (const c of row) {
        if (!/^[A-Za-z]$/.test(c)) throw new Error(`「${c}」不是合法的单个英文字母`)
      }
    }

    const w = (word ?? '').trim()
    if (w === '') throw new Error('word 不能为空')
    if (!/^[A-Za-z]+$/.test(w)) throw new Error('word 只能由英文字母组成')
    if (w.length > MAX_WORD_LEN) throw new Error(`word 长度最多 ${MAX_WORD_LEN} 个字母，方便演示`)

    return {
      board: parsedBoard,
      m: parsedBoard.length,
      n,
      word: w,
      display: { board: parsedBoard.map((r) => r.join(',')).join(';'), word: w },
    }
  }

  computeSteps({ board, m, n, word }) {
    const steps = []
    const visited = Array.from({ length: m }, () => Array(n).fill(false))
    let found = false
    let foundPath = null
    let truncated = false

    const dfs = (i, j, k, path) => {
      if (steps.length >= MAX_STEPS) throw new StepLimitExceeded()
      const ch = board[i][j]
      path.push([i, j])
      steps.push({
        type: 'enter',
        i,
        j,
        k,
        path: path.slice(),
        matchedLen: path.length,
        msg:
          k === 0
            ? `选 <code>(${i}, ${j})</code> = "${ch}" 作为新的起点，匹配 <code>word[0]</code> = "${ch}"。`
            : `从上一格走到相邻格 <code>(${i}, ${j})</code> = "${ch}"，匹配 <code>word[${k}]</code> = "${ch}"，
               当前已连续匹配 <strong>${k + 1}</strong> 个字母。`,
      })
      visited[i][j] = true

      if (k === word.length - 1) {
        steps[steps.length - 1].success = true
        return true
      }

      for (const [di, dj] of DIRS) {
        const ni = i + di
        const nj = j + dj
        if (ni < 0 || ni >= m || nj < 0 || nj >= n) continue
        if (visited[ni][nj]) continue
        if (board[ni][nj] !== word[k + 1]) continue
        if (dfs(ni, nj, k + 1, path)) return true
      }

      visited[i][j] = false
      path.pop()
      steps.push({
        type: 'pop',
        i,
        j,
        k,
        path: path.slice(),
        matchedLen: path.length,
        msg: `<code>(${i}, ${j})</code> 的四个方向都接不上 <code>word[${k + 1}]</code> = "${
          word[k + 1]
        }"（越界 / 已用过 / 字母不对）。<strong>回溯</strong>：撤销这一格的「已用」标记，把它从路径里去掉，退回上一格换方向再试。`,
      })
      return false
    }

    try {
      outer: for (let i = 0; i < m && !found; i++) {
        for (let j = 0; j < n && !found; j++) {
          if (board[i][j] === word[0]) {
            if (dfs(i, j, 0, [])) {
              found = true
              foundPath = steps[steps.length - 1].path
              break outer
            }
          }
        }
      }
    } catch (err) {
      if (err instanceof StepLimitExceeded) truncated = true
      else throw err
    }

    if (steps.length === 0) {
      steps.push({
        type: 'none',
        path: [],
        matchedLen: 0,
        msg: `网格里没有任何格子等于 <code>word[0]</code> = "${word[0]}"，连起点都找不到，所以单词一定不存在于网格中。`,
      })
    }

    return { steps, result: { found, path: foundPath, truncated } }
  }

  buildStage({ board, m, n, word }, el) {
    el.innerHTML = `
      <div class="ws__word"></div>
      <div class="ws__board" style="--ws-cols:${n}"></div>
      <div class="ws__pathlabel">当前路径（已匹配的格子，按顺序）</div>
      <div class="ws__path"></div>
    `
    this.wordEl = el.querySelector('.ws__word')
    this.boardEl = el.querySelector('.ws__board')
    this.pathEl = el.querySelector('.ws__path')

    this.wordEl.innerHTML = word
      .split('')
      .map((ch, idx) => `<span class="ws__wchip" data-k="${idx}">${ch}</span>`)
      .join('')
    this.wordChipEls = [...this.wordEl.querySelectorAll('.ws__wchip')]

    this.boardEl.innerHTML = board
      .map((row, i) =>
        row
          .map(
            (c, j) =>
              `<span class="ws__cell" data-i="${i}" data-j="${j}"><b class="ws__val">${c}</b></span>`,
          )
          .join(''),
      )
      .join('')
    this.cellEls = []
    for (let i = 0; i < m; i++) {
      this.cellEls.push([])
      for (let j = 0; j < n; j++) {
        this.cellEls[i].push(this.boardEl.querySelector(`.ws__cell[data-i="${i}"][data-j="${j}"]`))
      }
    }
  }

  renderStep(st) {
    for (const row of this.cellEls) {
      for (const cell of row) cell.className = 'ws__cell'
    }
    for (const chip of this.wordChipEls) chip.className = 'ws__wchip'

    const path = st.path ?? []
    path.forEach(([i, j], idx) => {
      const cell = this.cellEls[i]?.[j]
      if (!cell) return
      if (st.type === 'enter' && idx === path.length - 1) cell.classList.add('is-current')
      else cell.classList.add('is-path')
    })
    if (st.type === 'pop') {
      const cell = this.cellEls[st.i]?.[st.j]
      cell?.classList.add('is-pop')
    }

    const matchedLen = st.matchedLen ?? path.length
    this.wordChipEls.forEach((chip, idx) => {
      if (idx < matchedLen) chip.classList.add('is-matched')
    })
    if (st.type === 'enter' && matchedLen > 0) {
      this.wordChipEls[matchedLen - 1]?.classList.add('is-current')
    }

    this.pathEl.innerHTML = path.length
      ? path
          .map(([i, j], idx) => {
            const cur = st.type === 'enter' && idx === path.length - 1 ? ' is-current' : ''
            return `<code class="ws__pchip${cur}">${this.cellEls[i][j].querySelector('.ws__val').textContent}<span class="ws__pchip-pos">(${i},${j})</span></code>`
          })
          .join('')
      : `<span class="ws__empty">（空，还没选定起点）</span>`
  }

  resultBanner(result, state) {
    if (result.truncated) {
      return {
        kind: 'info',
        html: `⚠️ 自定义输入触发的分支太多，这里只演示了前 ${MAX_STEPS} 步，结论还不确定 —— 试试换一个更小的网格或更短的单词。`,
      }
    }
    if (result.found) {
      const route = result.path.map(([i, j]) => `(${i},${j})`).join(' → ')
      return {
        kind: 'success',
        html: `🎉 找到啦！路径 <code>${route}</code> 拼出了 <strong>${state.word}</strong>。`,
      }
    }
    return {
      kind: 'fail',
      html: `🚫 所有可能的起点、所有分支都试过并回溯完了，网格中不存在单词 <strong>${state.word}</strong>。`,
    }
  }
}

export function mountViz(el, opts) {
  return new WordSearchViz(el, opts)
}

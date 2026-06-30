/*
 * DpTable —— 可交互的「最长公共子序列」动态规划表格组件。
 *
 * 它做三件事：
 *   1. 根据两个字符串算出完整的 dp 二维表，并把「填表过程」拆成一步一步；
 *   2. 把表格画到页面上，逐格高亮：当前正在算的格子 + 它依赖的来源格；
 *   3. 提供「上一步 / 下一步 / 自动播放 / 重置」和自定义输入。
 *
 * 用法：
 *   import { DpTable } from '.../DpTable.js'
 *   new DpTable(document.querySelector('#mount'), { text1: 'abcde', text2: 'ace' })
 */

const MAX_LEN = 12 // 字符串太长表格会看不清，做个上限

export class DpTable {
  constructor(mountEl, { text1 = 'abcde', text2 = 'ace' } = {}) {
    this.mountEl = mountEl
    this.text1 = text1
    this.text2 = text2
    this.timer = null
    this.#buildSkeleton()
    this.rebuild(text1, text2)
  }

  /* ---------- 1. 计算 dp 表 + 拆出每一步 ---------- */
  #compute() {
    const a = this.text1
    const b = this.text2
    const m = a.length
    const n = b.length

    // dp[i][j] = a 的前 i 个字符 与 b 的前 j 个字符 的 LCS 长度
    const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0))
    const steps = []

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        const matched = a[i - 1] === b[j - 1]
        if (matched) {
          dp[i][j] = dp[i - 1][j - 1] + 1
          steps.push({
            i,
            j,
            matched,
            value: dp[i][j],
            sources: [{ i: i - 1, j: j - 1 }],
            explain:
              `第 ${i} 个字符 “${a[i - 1]}” 和 第 ${j} 个字符 “${b[j - 1]}” ` +
              `相同 ✅ ——它们能接在「左上角」那段公共子序列后面，` +
              `所以 dp=左上角(${dp[i - 1][j - 1]}) + 1 = ${dp[i][j]}。`,
          })
        } else {
          const up = dp[i - 1][j]
          const left = dp[i][j - 1]
          dp[i][j] = Math.max(up, left)
          steps.push({
            i,
            j,
            matched,
            value: dp[i][j],
            sources: [
              { i: i - 1, j },
              { i, j: j - 1 },
            ],
            explain:
              `“${a[i - 1]}” 和 “${b[j - 1]}” 不同 ❌ ——只能放弃其中一个字符，` +
              `在「上面(${up})」和「左边(${left})」里取较大的那个：dp=${dp[i][j]}。`,
          })
        }
      }
    }

    this.dp = dp
    this.steps = steps
    this.lcs = this.#backtrack(dp, a, b)
  }

  // 从右下角往回走，还原出 LCS 字符串和它经过的格子（用于最终高亮）
  #backtrack(dp, a, b) {
    let i = a.length
    let j = b.length
    const chars = []
    const path = new Set()
    while (i > 0 && j > 0) {
      if (a[i - 1] === b[j - 1]) {
        chars.push(a[i - 1])
        path.add(`${i},${j}`)
        i--
        j--
      } else if (dp[i - 1][j] >= dp[i][j - 1]) {
        i--
      } else {
        j--
      }
    }
    return { str: chars.reverse().join(''), path }
  }

  /* ---------- 2. 搭页面骨架（只建一次）---------- */
  #buildSkeleton() {
    this.mountEl.classList.add('dp')
    this.mountEl.innerHTML = `
      <div class="dp__inputs">
        <label>字符串 1
          <input class="dp__in dp__in--1" maxlength="${MAX_LEN}" />
        </label>
        <label>字符串 2
          <input class="dp__in dp__in--2" maxlength="${MAX_LEN}" />
        </label>
        <button class="btn btn--primary dp__apply" type="button">应用并重新演示</button>
      </div>
      <p class="dp__hint"></p>

      <div class="dp__table-wrap">
        <table class="dp__table"></table>
      </div>

      <div class="dp__explain" aria-live="polite"></div>

      <div class="dp__controls">
        <button class="btn dp__btn-prev" type="button">‹ 上一步</button>
        <button class="btn dp__btn-play" type="button">▶ 自动播放</button>
        <button class="btn dp__btn-next" type="button">下一步 ›</button>
        <button class="btn dp__btn-reset" type="button">↺ 重置</button>
        <span class="dp__progress"></span>
      </div>

      <div class="dp__result" hidden></div>
    `

    // 缓存常用节点
    this.$ = {
      in1: this.mountEl.querySelector('.dp__in--1'),
      in2: this.mountEl.querySelector('.dp__in--2'),
      apply: this.mountEl.querySelector('.dp__apply'),
      hint: this.mountEl.querySelector('.dp__hint'),
      table: this.mountEl.querySelector('.dp__table'),
      explain: this.mountEl.querySelector('.dp__explain'),
      prev: this.mountEl.querySelector('.dp__btn-prev'),
      play: this.mountEl.querySelector('.dp__btn-play'),
      next: this.mountEl.querySelector('.dp__btn-next'),
      reset: this.mountEl.querySelector('.dp__btn-reset'),
      progress: this.mountEl.querySelector('.dp__progress'),
      result: this.mountEl.querySelector('.dp__result'),
    }

    // 绑定事件
    this.$.next.addEventListener('click', () => this.next())
    this.$.prev.addEventListener('click', () => this.prev())
    this.$.reset.addEventListener('click', () => this.reset())
    this.$.play.addEventListener('click', () => this.togglePlay())
    this.$.apply.addEventListener('click', () => {
      this.rebuild(this.$.in1.value, this.$.in2.value)
    })
  }

  /* ---------- 渲染表格 ---------- */
  #renderTable() {
    const a = this.text1
    const b = this.text2
    const m = a.length
    const n = b.length

    // 表头：空角 + ∅ + b 的每个字符
    let html = '<thead><tr><th class="dp__corner"></th><th class="dp__head">∅</th>'
    for (let j = 0; j < n; j++) html += `<th class="dp__head">${b[j]}</th>`
    html += '</tr></thead><tbody>'

    // 每一行：行首是 a 的字符（第 0 行是 ∅），后面是各个格子
    for (let i = 0; i <= m; i++) {
      const rowHead = i === 0 ? '∅' : a[i - 1]
      html += `<tr><th class="dp__head">${rowHead}</th>`
      for (let j = 0; j <= n; j++) {
        const isBase = i === 0 || j === 0
        html += `<td class="dp__cell" data-i="${i}" data-j="${j}">${
          isBase ? 0 : ''
        }</td>`
      }
      html += '</tr>'
    }
    html += '</tbody>'
    this.$.table.innerHTML = html

    // 存一份格子节点引用，刷新时直接改，不重建 DOM
    this.cells = {}
    this.$.table.querySelectorAll('.dp__cell').forEach((td) => {
      this.cells[`${td.dataset.i},${td.dataset.j}`] = td
    })
  }

  /* ---------- 3. 状态切换 ---------- */
  rebuild(text1, text2) {
    this.stopPlay()
    // 清洗输入：去空格、截断长度；空则给个默认值
    const clean = (s, fallback) => {
      const t = (s ?? '').trim().slice(0, MAX_LEN)
      return t.length ? t : fallback
    }
    this.text1 = clean(text1, 'abcde')
    this.text2 = clean(text2, 'ace')
    this.$.in1.value = this.text1
    this.$.in2.value = this.text2

    const tooLong =
      (text1 && text1.length > MAX_LEN) || (text2 && text2.length > MAX_LEN)
    this.$.hint.textContent = tooLong
      ? `为了表格清晰，字符串最长 ${MAX_LEN} 个字符，已自动截断。`
      : '提示：可以改成你自己的字符串，点「应用」重新演示。'

    this.#compute()
    this.#renderTable()
    // step = -1 表示「只填好了边界 0，还没开始算内部格子」
    this.step = -1
    this.#render()
  }

  reset() {
    this.stopPlay()
    this.step = -1
    this.#render()
  }

  next() {
    if (this.step < this.steps.length - 1) {
      this.step++
      this.#render()
    } else {
      this.stopPlay()
    }
  }

  prev() {
    this.stopPlay()
    if (this.step > -1) {
      this.step--
      this.#render()
    }
  }

  togglePlay() {
    this.timer ? this.stopPlay() : this.startPlay()
  }

  startPlay() {
    if (this.step >= this.steps.length - 1) this.step = -1 // 播放完了再点就从头来
    this.$.play.textContent = '⏸ 暂停'
    this.timer = setInterval(() => this.next(), 900)
  }

  stopPlay() {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
    if (this.$) this.$.play.textContent = '▶ 自动播放'
  }

  /* ---------- 把当前状态画出来 ---------- */
  #render() {
    const total = this.steps.length
    const orderIndex = (i, j) => (i - 1) * this.text2.length + (j - 1)
    const finished = this.step === total - 1 && total > 0

    // 逐格更新：填值、上色
    for (const key in this.cells) {
      const td = this.cells[key]
      const i = Number(td.dataset.i)
      const j = Number(td.dataset.j)
      td.className = 'dp__cell'

      if (i === 0 || j === 0) {
        td.classList.add('dp__cell--base')
        continue
      }
      const idx = orderIndex(i, j)
      if (idx <= this.step) {
        td.textContent = this.dp[i][j]
        td.classList.add('dp__cell--filled')
      } else {
        td.textContent = ''
      }
    }

    // 高亮当前格 + 来源格
    if (this.step >= 0) {
      const s = this.steps[this.step]
      const cur = this.cells[`${s.i},${s.j}`]
      cur.classList.add(s.matched ? 'dp__cell--match' : 'dp__cell--nomatch')
      cur.classList.add('dp__cell--current')
      s.sources.forEach((src) => {
        this.cells[`${src.i},${src.j}`]?.classList.add('dp__cell--source')
      })
      this.$.explain.innerHTML = `<strong>第 ${this.step + 1} / ${total} 步：</strong>${s.explain}`
    } else {
      this.$.explain.innerHTML =
        '<strong>第 0 步（边界）：</strong>第一行和第一列代表「其中一个字符串为空」，' +
        '空串和谁都没有公共子序列，所以全部填 0。点「下一步」开始填内部格子。'
    }

    // 完成时高亮 LCS 路径 + 显示结果
    if (finished) {
      this.lcs.path.forEach((key) => {
        this.cells[key]?.classList.add('dp__cell--path')
      })
      this.$.result.hidden = false
      this.$.result.innerHTML = `
        🎉 填完啦！右下角的 <strong>${this.dp[this.text1.length][this.text2.length]}</strong>
        就是答案——最长公共子序列的长度。
        其中一个具体的 LCS 是：<code>${this.lcs.str || '（空）'}</code>
        （金色格子就是它走过的路径）。`
    } else {
      this.$.result.hidden = true
    }

    // 控件状态
    this.$.prev.disabled = this.step <= -1
    this.$.next.disabled = this.step >= total - 1
    this.$.progress.textContent = `进度 ${this.step + 1} / ${total}`
  }
}

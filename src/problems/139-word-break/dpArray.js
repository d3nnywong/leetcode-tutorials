/*
 * DpArray —— 「单词拆分」的一维 DP 动画。
 *
 *   dp[i] 表示：s 的前 i 个字符能否被拆分成词典里的词。
 *   dp[0] = true（空串）。
 *   算 dp[i] 时，枚举上一个切点 j（0 <= j < i）：
 *     若 dp[j] == true 且子串 s[j..i) 在词典里，则 dp[i] = true。
 *   最终答案就是 dp[n]。
 *
 * 动画把「双重循环」拆成一步一步：高亮当前的 i、正在试的 j、对应子串 s[j..i)，
 * 命中就把 dp[i] 点亮成绿色。
 *
 * 用法：
 *   import { mountDpArray } from './dpArray.js'
 *   mountDpArray(document.querySelector('#mount'), { s: 'leetcode', dict: ['leet','code'] })
 */

const MAX_S = 16
const MAX_WORDS = 8

function clean(sRaw, dictRaw) {
  const s = (sRaw ?? '').replace(/\s+/g, '').toLowerCase().slice(0, MAX_S)
  const dict = [
    ...new Set(
      (dictRaw ?? '')
        .split(',')
        .map((w) => w.replace(/\s+/g, '').toLowerCase())
        .filter(Boolean)
        .slice(0, MAX_WORDS),
    ),
  ]
  return { s: s || 'leetcode', dict: dict.length ? dict : ['leet', 'code'] }
}

export function mountDpArray(mountEl, opts = {}) {
  const view = new DpArray(mountEl)
  view.rebuild(opts.s ?? 'leetcode', (opts.dict ?? ['leet', 'code']).join(','))
  return view
}

class DpArray {
  constructor(mountEl) {
    this.mountEl = mountEl
    this.timer = null
    this.#skeleton()
  }

  #skeleton() {
    this.mountEl.classList.add('dpa')
    this.mountEl.innerHTML = `
      <div class="dpa__inputs">
        <label>字符串 s
          <input class="dpa__in dpa__in--s" maxlength="${MAX_S}" />
        </label>
        <label>词典（逗号分隔）
          <input class="dpa__in dpa__in--dict" />
        </label>
        <button class="btn btn--primary dpa__apply" type="button">应用并重新演示</button>
      </div>
      <p class="dpa__hint"></p>

      <div class="dpa__board">
        <div class="dpa__row dpa__row--chars"></div>
        <div class="dpa__row dpa__row--cells"></div>
      </div>

      <div class="dpa__msg" aria-live="polite"></div>

      <div class="dpa__controls">
        <button class="btn dpa__prev" type="button">‹ 上一步</button>
        <button class="btn dpa__play" type="button">▶ 自动播放</button>
        <button class="btn dpa__next" type="button">下一步 ›</button>
        <button class="btn dpa__reset" type="button">↺ 重置</button>
        <span class="dpa__progress"></span>
      </div>

      <div class="dpa__result" hidden></div>
    `
    this.$ = {
      inS: this.mountEl.querySelector('.dpa__in--s'),
      inDict: this.mountEl.querySelector('.dpa__in--dict'),
      apply: this.mountEl.querySelector('.dpa__apply'),
      hint: this.mountEl.querySelector('.dpa__hint'),
      chars: this.mountEl.querySelector('.dpa__row--chars'),
      cells: this.mountEl.querySelector('.dpa__row--cells'),
      msg: this.mountEl.querySelector('.dpa__msg'),
      prev: this.mountEl.querySelector('.dpa__prev'),
      play: this.mountEl.querySelector('.dpa__play'),
      next: this.mountEl.querySelector('.dpa__next'),
      reset: this.mountEl.querySelector('.dpa__reset'),
      progress: this.mountEl.querySelector('.dpa__progress'),
      result: this.mountEl.querySelector('.dpa__result'),
    }
    this.$.next.addEventListener('click', () => this.next())
    this.$.prev.addEventListener('click', () => this.prev())
    this.$.reset.addEventListener('click', () => this.reset())
    this.$.play.addEventListener('click', () => this.togglePlay())
    this.$.apply.addEventListener('click', () =>
      this.rebuild(this.$.inS.value, this.$.inDict.value),
    )
  }

  /* ---------- 生成每一步 ---------- */
  #compute() {
    const s = this.s
    const n = s.length
    const dict = new Set(this.dict)
    const steps = []
    // known[k]: 已确定的 dp[k]（true / false / null=尚未确定）
    const known = new Array(n + 1).fill(null)
    known[0] = true
    const snap = (o) => ({ known: [...known], ...o })

    for (let i = 1; i <= n; i++) {
      let found = false
      for (let j = 0; j < i; j++) {
        const sub = s.slice(j, i)
        const dpj = known[j]
        const hit = dict.has(sub)
        const step = snap({
          i,
          j,
          sub,
          kind: 'check',
          msg: dpj
            ? hit
              ? `dp[${j}] = 可拆，且子串 “${sub}” 在词典里 → 把 dp[${i}] 标记为「可拆」✓`
              : `dp[${j}] = 可拆，但子串 “${sub}” 不在词典里，换下一个切点继续找。`
            : `dp[${j}] = 不可拆，前 ${j} 个字符都拼不出来，这个切点没意义，跳过。`,
        })
        steps.push(step)
        if (dpj && hit) {
          known[i] = true
          found = true
          step.set = true
          step.known = [...known] // 刷新快照，让 dp[i] 当场点亮
          break
        }
      }
      if (!found) {
        known[i] = false
        steps.push(
          snap({
            i,
            j: null,
            kind: 'fail-i',
            msg: `所有切点都试过了，没有能拼到第 ${i} 个字符的方案 → dp[${i}] = 不可拆。`,
          }),
        )
      }
    }

    this.result = known[n]
    this.steps = steps
  }

  /* ---------- 渲染骨架 ---------- */
  #renderBoard() {
    const s = this.s
    const n = s.length
    // 字符行：在 dp 格子之间对齐，所以每个字符占一格、首尾各留半格
    this.$.chars.innerHTML =
      `<span class="dpa__gap"></span>` +
      [...s].map((ch) => `<span class="dpa__char">${ch}</span>`).join('') +
      `<span class="dpa__gap"></span>`
    // dp 格子行：dp[0..n] 共 n+1 个，落在字符的边界缝隙上
    let cells = ''
    for (let k = 0; k <= n; k++) {
      cells += `<span class="dpa__cell" data-k="${k}"><b>dp${k}</b><span class="dpa__val"></span></span>`
    }
    this.$.cells.innerHTML = cells
    this.cellEls = [...this.$.cells.querySelectorAll('.dpa__cell')]
    this.charEls = [...this.$.chars.querySelectorAll('.dpa__char')]
  }

  rebuild(sRaw, dictRaw) {
    this.stopPlay()
    const { s, dict } = clean(sRaw, dictRaw)
    this.s = s
    this.dict = dict
    this.$.inS.value = s
    this.$.inDict.value = dict.join(',')
    this.$.hint.textContent =
      '提示：dp 格子落在字符之间的「缝」上。可改成你自己的 s 和词典，点「应用」重新演示。'
    this.#compute()
    this.#renderBoard()
    this.step = 0
    this.#render()
  }

  reset() {
    this.stopPlay()
    this.step = 0
    this.#render()
  }
  next() {
    if (this.step < this.steps.length - 1) {
      this.step++
      this.#render()
    } else this.stopPlay()
  }
  prev() {
    this.stopPlay()
    if (this.step > 0) {
      this.step--
      this.#render()
    }
  }
  togglePlay() {
    this.timer ? this.stopPlay() : this.startPlay()
  }
  startPlay() {
    if (this.step >= this.steps.length - 1) this.step = 0
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

  #render() {
    const total = this.steps.length
    const st = this.steps[this.step]

    // dp 格子取值与配色
    this.cellEls.forEach((el, k) => {
      el.className = 'dpa__cell'
      const v = st.known[k]
      const valEl = el.querySelector('.dpa__val')
      if (v === true) {
        el.classList.add('is-true')
        valEl.textContent = 'T'
      } else if (v === false) {
        el.classList.add('is-false')
        valEl.textContent = 'F'
      } else {
        el.classList.add('is-unknown')
        valEl.textContent = '?'
      }
    })
    if (st.set) this.cellEls[st.i]?.classList.add('is-justset')
    if (typeof st.i === 'number') this.cellEls[st.i]?.classList.add('is-current')
    if (typeof st.j === 'number') this.cellEls[st.j]?.classList.add('is-source')

    // 字符高亮：当前子串 s[j..i)
    this.charEls.forEach((el) => (el.className = 'dpa__char'))
    if (typeof st.j === 'number' && typeof st.i === 'number') {
      for (let c = st.j; c < st.i; c++) this.charEls[c]?.classList.add('is-sub')
    }

    this.$.msg.innerHTML = `<strong>第 ${this.step + 1} / ${total} 步：</strong>${st.msg}`

    const last = this.step === total - 1
    if (last) {
      this.$.result.hidden = false
      this.$.result.className = `dpa__result dpa__result--${this.result ? 'success' : 'fail'}`
      this.$.result.innerHTML = this.result
        ? `🎉 dp[${this.s.length}] = <strong>T</strong> → <code>${this.s}</code> 可以被拆分，返回 <strong>true</strong>。`
        : `🚫 dp[${this.s.length}] = <strong>F</strong> → <code>${this.s}</code> 无法被拆分，返回 <strong>false</strong>。`
    } else {
      this.$.result.hidden = true
    }

    this.$.prev.disabled = this.step <= 0
    this.$.next.disabled = this.step >= total - 1
    this.$.progress.textContent = `进度 ${this.step + 1} / ${total}`
  }
}

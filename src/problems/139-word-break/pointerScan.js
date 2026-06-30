/*
 * PointerScan —— 「单词拆分」的暴力直觉动画。
 *
 * 把问题想成一次「从左往右试着切词」的搜索：
 *   从位置 0 出发，尝试以当前位置开头、长度递增的前缀；
 *   命中词典就「切一刀」往前跳，走到字符串末尾就成功；
 *   某个位置所有词都试过仍走不通，就回退（撤回上一刀）继续试更长的词。
 * 这正是暴力 DFS 的直觉，也顺势引出「同一个位置会被反复试」——于是需要记忆化 / DP。
 *
 * 为保证步骤有限且结论正确，内部用 DFS + 记忆化生成「每一步」，再逐步播放。
 *
 * 用法：
 *   import { mountPointerScan } from './pointerScan.js'
 *   mountPointerScan(document.querySelector('#mount'), { s: 'leetcode', dict: ['leet','code'] })
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

export function mountPointerScan(mountEl, opts = {}) {
  const view = new PointerScan(mountEl)
  view.rebuild(opts.s ?? 'leetcode', (opts.dict ?? ['leet', 'code']).join(','))
  return view
}

class PointerScan {
  constructor(mountEl) {
    this.mountEl = mountEl
    this.timer = null
    this.#skeleton()
  }

  #skeleton() {
    this.mountEl.classList.add('ps')
    this.mountEl.innerHTML = `
      <div class="ps__inputs">
        <label>字符串 s
          <input class="ps__in ps__in--s" maxlength="${MAX_S}" />
        </label>
        <label>词典（逗号分隔）
          <input class="ps__in ps__in--dict" />
        </label>
        <button class="btn btn--primary ps__apply" type="button">应用并重新演示</button>
      </div>
      <p class="ps__hint"></p>

      <div class="ps__stage">
        <div class="ps__chars"></div>
        <div class="ps__dict"></div>
      </div>

      <div class="ps__msg" aria-live="polite"></div>

      <div class="ps__controls">
        <button class="btn ps__prev" type="button">‹ 上一步</button>
        <button class="btn ps__play" type="button">▶ 自动播放</button>
        <button class="btn ps__next" type="button">下一步 ›</button>
        <button class="btn ps__reset" type="button">↺ 重置</button>
        <span class="ps__progress"></span>
      </div>

      <div class="ps__result" hidden></div>
    `
    this.$ = {
      inS: this.mountEl.querySelector('.ps__in--s'),
      inDict: this.mountEl.querySelector('.ps__in--dict'),
      apply: this.mountEl.querySelector('.ps__apply'),
      hint: this.mountEl.querySelector('.ps__hint'),
      chars: this.mountEl.querySelector('.ps__chars'),
      dict: this.mountEl.querySelector('.ps__dict'),
      msg: this.mountEl.querySelector('.ps__msg'),
      prev: this.mountEl.querySelector('.ps__prev'),
      play: this.mountEl.querySelector('.ps__play'),
      next: this.mountEl.querySelector('.ps__next'),
      reset: this.mountEl.querySelector('.ps__reset'),
      progress: this.mountEl.querySelector('.ps__progress'),
      result: this.mountEl.querySelector('.ps__result'),
    }
    this.$.next.addEventListener('click', () => this.next())
    this.$.prev.addEventListener('click', () => this.prev())
    this.$.reset.addEventListener('click', () => this.reset())
    this.$.play.addEventListener('click', () => this.togglePlay())
    this.$.apply.addEventListener('click', () =>
      this.rebuild(this.$.inS.value, this.$.inDict.value),
    )
  }

  /* ---------- 用 DFS + 记忆化生成每一步 ---------- */
  #compute() {
    const s = this.s
    const n = s.length
    const dict = new Set(this.dict)
    const maxLen = Math.max(...this.dict.map((w) => w.length))
    const steps = []
    const memo = new Map() // start -> 是否能从这里走到末尾
    const stack = [] // 当前已「切」好的段：[start, end)

    const snap = (extra) => ({ committed: stack.map((seg) => [...seg]), ...extra })

    const dfs = (start) => {
      if (start === n) {
        steps.push(
          snap({
            pointer: start,
            kind: 'end',
            done: 'success',
            msg: '指针走到了末尾，前面每一段都成功切成了词典里的词 —— s 可以被拆分 ✓',
          }),
        )
        return true
      }
      if (memo.has(start)) {
        const v = memo.get(start)
        steps.push(
          snap({
            pointer: start,
            kind: 'memo',
            msg: `位置 ${start} 之前已经试过，结论是「${
              v ? '走得通' : '此路不通'
            }」，直接${v ? '采用' : '跳过'}（这就是「记忆化」帮我们省下的重复功）。`,
          }),
        )
        return v
      }
      for (let len = 1; start + len <= n && len <= maxLen; len++) {
        const word = s.slice(start, start + len)
        const hit = dict.has(word)
        steps.push(
          snap({
            pointer: start,
            trySpan: [start, start + len],
            tryState: hit ? 'hit' : 'miss',
            kind: 'try',
            msg: `从位置 ${start} 起试 “${word}” —— ${
              hit ? `在词典里 ✓，切一刀往前跳到位置 ${start + len}` : '不在词典里 ✗'
            }`,
          }),
        )
        if (hit) {
          stack.push([start, start + len])
          if (dfs(start + len)) {
            memo.set(start, true)
            return true
          }
          stack.pop()
          steps.push(
            snap({
              pointer: start,
              kind: 'back',
              msg: `从位置 ${start + len} 往后走不通，撤回 “${word}” 这一刀，回到位置 ${start} 继续试更长的词。`,
            }),
          )
        }
      }
      memo.set(start, false)
      steps.push(
        snap({
          pointer: start,
          kind: 'dead',
          done: start === 0 ? 'fail' : null,
          msg: `位置 ${start} 开头的词都试完了，没有能走通的 —— 此路不通。`,
        }),
      )
      return false
    }

    this.result = dfs(0)
    this.steps = steps
  }

  /* ---------- 渲染骨架（字符行 + 词典）---------- */
  #renderStage() {
    const s = this.s
    this.$.chars.innerHTML = [...s]
      .map(
        (ch, i) =>
          `<span class="ps__char" data-idx="${i}">${ch}<i class="ps__ptr">▲</i></span>`,
      )
      .join('')
    this.charEls = [...this.$.chars.querySelectorAll('.ps__char')]
    this.$.dict.innerHTML =
      '<span class="ps__dict-label">词典</span>' +
      this.dict.map((w) => `<code class="ps__word">${w}</code>`).join('')
  }

  rebuild(sRaw, dictRaw) {
    this.stopPlay()
    const { s, dict } = clean(sRaw, dictRaw)
    this.s = s
    this.dict = dict
    this.$.inS.value = s
    this.$.inDict.value = dict.join(',')
    this.$.hint.textContent =
      '提示：可以改成你自己的 s 和词典，点「应用」重新演示（s 最长 16 个字符）。'
    this.#compute()
    this.#renderStage()
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
    this.timer = setInterval(() => this.next(), 1100)
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

    // 重置字符样式
    this.charEls.forEach((el) => {
      el.className = 'ps__char'
    })
    // 已切好的段
    st.committed.forEach(([a, b]) => {
      for (let i = a; i < b; i++) this.charEls[i].classList.add('is-committed')
      this.charEls[a]?.classList.add('is-seg-start')
    })
    // 当前尝试的区间
    if (st.trySpan) {
      const [a, b] = st.trySpan
      for (let i = a; i < b; i++) {
        this.charEls[i].classList.add('is-trying', `is-${st.tryState}`)
      }
    }
    // 指针位置
    if (st.pointer < this.charEls.length) {
      this.charEls[st.pointer].classList.add('is-pointer')
    }

    this.$.msg.innerHTML = `<strong>第 ${this.step + 1} / ${total} 步：</strong>${st.msg}`

    if (st.done) {
      this.$.result.hidden = false
      this.$.result.className = `ps__result ps__result--${st.done}`
      this.$.result.innerHTML =
        st.done === 'success'
          ? `🎉 成功！<code>${this.s}</code> 能被词典完整拼出来 → 返回 <strong>true</strong>。`
          : `🚫 失败：<code>${this.s}</code> 无论怎么切都拼不出来 → 返回 <strong>false</strong>。`
    } else {
      this.$.result.hidden = true
    }

    this.$.prev.disabled = this.step <= 0
    this.$.next.disabled = this.step >= total - 1
    this.$.progress.textContent = `进度 ${this.step + 1} / ${total}`
  }
}

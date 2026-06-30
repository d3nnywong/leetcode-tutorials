/*
 * VizPlayer —— 全站交互动画的通用「分步播放器」基类。
 *
 * 它替每个动画包办了重复的部分：
 *   - 输入区（按 cfg.inputs 自动生成输入框 + 「应用」按钮）
 *   - 控件区（上一步 / 自动播放 / 下一步 / 重置 + 进度）
 *   - 步骤消息、完成结果横幅、播放定时器、按钮禁用状态
 *
 * 每道题的动画只要继承它，实现下面 4 个钩子（其余不用管）：
 *   parseInputs(values)      把输入框的原始字符串清洗成 state（可抛 Error 显示报错）
 *   computeSteps(state)      预先算好 { steps:[{msg, ...}], result }
 *   buildStage(state, el)    一次性把舞台 DOM 建到 el 里（缓存好节点，后面只改不重建）
 *   renderStep(step, ctx)    把某一步画到舞台；ctx = { state, idx, total }
 *   resultBanner(result, s)  （可选）完成时的结果横幅 { kind:'success'|'fail'|'info', html }
 *
 * 约定：parseInputs 可在返回的 state 上放 `display`（key→规范字符串）来回填输入框。
 */

export class VizPlayer {
  constructor(mountEl, { inputs = [], speed = 900, applyLabel = '应用并重新演示', hint = '' } = {}) {
    this.mountEl = mountEl
    this.cfg = { inputs, speed, applyLabel, hint }
    this.timer = null
    this.steps = [{ msg: '' }]
    this.step = 0
    this.state = {}
    this._skeleton()
    // 延迟首次构建到下一个微任务：等子类的字段 / 私有方法（# 成员）
    // 在 super() 之后初始化完成，buildStage/computeSteps 才能安全用到它们。
    queueMicrotask(() =>
      this.rebuild(Object.fromEntries(inputs.map((i) => [i.key, i.default ?? '']))),
    )
  }

  /* ===== 子类钩子（默认空实现） ===== */
  parseInputs(values) {
    return { ...values }
  }
  computeSteps() {
    return { steps: [], result: null }
  }
  buildStage() {}
  renderStep() {}
  resultBanner() {
    return null
  }

  /* ===== 骨架 ===== */
  _skeleton() {
    this.mountEl.classList.add('viz')
    const inputsHtml = this.cfg.inputs
      .map(
        (i) =>
          `<label>${i.label}<input class="viz__in" data-key="${i.key}"${
            i.maxlength ? ` maxlength="${i.maxlength}"` : ''
          }${i.width ? ` style="width:${i.width}"` : ''} /></label>`,
      )
      .join('')
    this.mountEl.innerHTML = `
      ${
        this.cfg.inputs.length
          ? `<div class="viz__inputs">${inputsHtml}<button class="btn btn--primary viz__apply" type="button">${this.cfg.applyLabel}</button></div>
             <p class="viz__hint">${this.cfg.hint}</p>`
          : ''
      }
      <div class="viz__stage"></div>
      <div class="viz__msg" aria-live="polite"></div>
      <div class="viz__controls">
        <button class="btn viz__prev" type="button">‹ 上一步</button>
        <button class="btn viz__play" type="button">▶ 自动播放</button>
        <button class="btn viz__next" type="button">下一步 ›</button>
        <button class="btn viz__reset" type="button">↺ 重置</button>
        <span class="viz__progress"></span>
      </div>
      <div class="viz__result" hidden></div>
    `
    this.$ = {
      stage: this.mountEl.querySelector('.viz__stage'),
      msg: this.mountEl.querySelector('.viz__msg'),
      prev: this.mountEl.querySelector('.viz__prev'),
      play: this.mountEl.querySelector('.viz__play'),
      next: this.mountEl.querySelector('.viz__next'),
      reset: this.mountEl.querySelector('.viz__reset'),
      progress: this.mountEl.querySelector('.viz__progress'),
      result: this.mountEl.querySelector('.viz__result'),
      apply: this.mountEl.querySelector('.viz__apply'),
      hint: this.mountEl.querySelector('.viz__hint'),
    }
    this.inputEls = {}
    this.mountEl.querySelectorAll('.viz__in').forEach((el) => {
      this.inputEls[el.dataset.key] = el
    })

    this.$.next.addEventListener('click', () => this.next())
    this.$.prev.addEventListener('click', () => this.prev())
    this.$.reset.addEventListener('click', () => this.reset())
    this.$.play.addEventListener('click', () => this.togglePlay())
    this.$.apply?.addEventListener('click', () => this.rebuild(this._readInputs()))
  }

  setHint(text) {
    if (this.$.hint) this.$.hint.textContent = text
  }

  _readInputs() {
    const out = {}
    for (const key in this.inputEls) out[key] = this.inputEls[key].value
    return out
  }

  /* ===== 重建（输入变化 / 初始化） ===== */
  rebuild(values) {
    this.stopPlay()
    let state
    try {
      state = this.parseInputs(values)
    } catch (err) {
      this.$.msg.innerHTML = `<span class="viz__err">⚠️ ${err.message}</span>`
      return
    }
    this.state = state
    // 回填输入框（用 display 规范值，没有就用原值）
    const disp = state.display ?? values
    for (const key in this.inputEls) {
      if (disp[key] != null) this.inputEls[key].value = disp[key]
    }
    const { steps, result } = this.computeSteps(state)
    this.steps = steps.length ? steps : [{ msg: '' }]
    this.result = result
    this.$.stage.innerHTML = ''
    this.buildStage(state, this.$.stage)
    this.step = 0
    this._render()
  }

  /* ===== 播放控制 ===== */
  reset() {
    this.stopPlay()
    this.step = 0
    this._render()
  }
  next() {
    if (this.step < this.steps.length - 1) {
      this.step++
      this._render()
    } else this.stopPlay()
  }
  prev() {
    this.stopPlay()
    if (this.step > 0) {
      this.step--
      this._render()
    }
  }
  togglePlay() {
    this.timer ? this.stopPlay() : this.startPlay()
  }
  startPlay() {
    if (this.step >= this.steps.length - 1) this.step = 0
    this.$.play.textContent = '⏸ 暂停'
    this.timer = setInterval(() => this.next(), this.cfg.speed)
  }
  stopPlay() {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
    if (this.$) this.$.play.textContent = '▶ 自动播放'
  }

  /* ===== 渲染当前步 ===== */
  _render() {
    const total = this.steps.length
    const st = this.steps[this.step]
    this.renderStep(st, { state: this.state, idx: this.step, total })

    this.$.msg.innerHTML =
      st && st.msg ? `<strong>第 ${this.step + 1} / ${total} 步：</strong>${st.msg}` : ''

    const banner = this.step === total - 1 ? this.resultBanner(this.result, this.state) : null
    if (banner) {
      this.$.result.hidden = false
      this.$.result.className = `viz__result viz__result--${banner.kind}`
      this.$.result.innerHTML = banner.html
    } else {
      this.$.result.hidden = true
    }

    this.$.prev.disabled = this.step <= 0
    this.$.next.disabled = this.step >= total - 1
    this.$.progress.textContent = `进度 ${this.step + 1} / ${total}`
  }
}

/*
 * 有效的字母异位词「计数数组」动画。
 *
 * 先把字符串 s 的每个字符都 +1 记进计数表（count[c]）；
 * 再扫一遍 t，每个字符把对应计数 −1：
 *   - 如果某个字符的计数已经是 0，说明 t 里这个字符比 s 多 → 不是异位词；
 *   - 如果 t 扫完都顺利抵消，说明两边字母种类和个数完全一致 → 是异位词。
 * 因为只用小写字母，计数表固定 26 格，整个过程是 O(n) 时间、O(1) 额外空间。
 */
import { VizPlayer } from '../../components/viz-player/vizPlayer.js'

const MAX_LEN = 16

export class ValidAnagramViz extends VizPlayer {
  constructor(mountEl) {
    super(mountEl, {
      inputs: [
        { key: 's', label: '字符串 s（小写字母）', default: 'anagram', width: '11rem' },
        { key: 't', label: '字符串 t（小写字母）', default: 'nagaram', width: '11rem' },
      ],
      speed: 700,
      hint: `提示：可改成你自己的字符串，点「应用」重新演示（每个最多 ${MAX_LEN} 个字符，仅限小写字母 a-z）。`,
    })
  }

  parseInputs({ s, t }) {
    const clean = (raw, name) => {
      const v = (raw ?? '').trim().toLowerCase().slice(0, MAX_LEN)
      if (v.length === 0) throw new Error(`字符串 ${name} 不能为空`)
      if (!/^[a-z]+$/.test(v)) throw new Error(`字符串 ${name} 只能包含小写字母 a-z`)
      return v
    }
    const sv = clean(s, 's')
    const tv = clean(t, 't')
    const letters = [...new Set((sv + tv).split(''))].sort()
    return { s: sv, t: tv, letters, display: { s: sv, t: tv } }
  }

  computeSteps({ s, t, letters }) {
    const steps = []
    const zeroSnapshot = Object.fromEntries(letters.map((c) => [c, 0]))

    if (s.length !== t.length) {
      steps.push({
        phase: 'len-mismatch',
        countSnapshot: zeroSnapshot,
        msg: `s 长度为 ${s.length}，t 长度为 ${t.length}，长度都不一样，字母个数不可能凑成一样 → 直接判定<strong>不是</strong>字母异位词。`,
      })
      return { steps, result: false }
    }

    const count = { ...zeroSnapshot }

    for (let i = 0; i < s.length; i++) {
      const c = s[i]
      count[c]++
      steps.push({
        phase: 's',
        i,
        char: c,
        countSnapshot: { ...count },
        msg: `统计 s 的第 ${i + 1} 个字符 <strong>'${c}'</strong>：count['${c}'] + 1 = ${count[c]}`,
      })
    }

    let failed = false
    for (let j = 0; j < t.length; j++) {
      const c = t[j]
      if (count[c] <= 0) {
        failed = true
        steps.push({
          phase: 't-fail',
          j,
          char: c,
          countSnapshot: { ...count },
          msg: `检查 t 的第 ${j + 1} 个字符 <strong>'${c}'</strong>：count['${c}'] 已经是 0，说明 s 里没有多余的 '${c}' 可以抵消 → 不是字母异位词。`,
        })
        break
      }
      count[c]--
      steps.push({
        phase: 't',
        j,
        char: c,
        countSnapshot: { ...count },
        msg: `抵消 t 的第 ${j + 1} 个字符 <strong>'${c}'</strong>：count['${c}'] − 1 = ${count[c]}`,
      })
    }

    if (failed) return { steps, result: false }

    steps.push({
      phase: 'done',
      countSnapshot: { ...count },
      msg: `t 的每个字符都成功抵消，所有计数都回到了 0 → 是字母异位词！`,
    })
    return { steps, result: true }
  }

  buildStage({ s, t, letters }, el) {
    el.innerHTML = `
      <div class="va__row">
        <span class="va__rowlabel">s</span>
        <div class="va__chars" data-role="s"></div>
      </div>
      <div class="va__row">
        <span class="va__rowlabel">t</span>
        <div class="va__chars" data-role="t"></div>
      </div>
      <div class="va__countlabel">字母计数表 count（s 中 +1，t 中 −1）</div>
      <div class="va__count"></div>
    `
    const sEl = el.querySelector('.va__chars[data-role="s"]')
    const tEl = el.querySelector('.va__chars[data-role="t"]')
    sEl.innerHTML = [...s]
      .map((c, i) => `<span class="va__char" data-i="${i}">${c}</span>`)
      .join('')
    tEl.innerHTML = [...t]
      .map((c, i) => `<span class="va__char" data-i="${i}">${c}</span>`)
      .join('')
    this.sCellEls = [...sEl.querySelectorAll('.va__char')]
    this.tCellEls = [...tEl.querySelectorAll('.va__char')]

    const countEl = el.querySelector('.va__count')
    countEl.innerHTML = letters
      .map(
        (c) =>
          `<span class="va__chip" data-c="${c}"><b class="va__chipkey">${c}</b><span class="va__chipval">0</span></span>`,
      )
      .join('')
    this.chipEls = {}
    countEl.querySelectorAll('.va__chip').forEach((chip) => {
      this.chipEls[chip.dataset.c] = chip
    })
  }

  renderStep(st, { state }) {
    const { s, t, letters } = state

    // s 行：哪些已经数过 / 当前正在数
    const sDoneCount = st.phase === 's' ? st.i + 1 : st.phase === 'len-mismatch' ? 0 : s.length
    const sCurrentIdx = st.phase === 's' ? st.i : -1
    this.sCellEls.forEach((el, i) => {
      let cls = 'va__char'
      if (i === sCurrentIdx) cls += ' is-current'
      else if (i < sDoneCount) cls += ' is-done'
      el.className = cls
    })

    // t 行：哪些已经抵消 / 当前正在处理 / 是否失败
    let tDoneCount = 0
    let tCurrentIdx = -1
    let tBad = false
    if (st.phase === 't') {
      tDoneCount = st.j + 1
      tCurrentIdx = st.j
    } else if (st.phase === 't-fail') {
      tDoneCount = st.j
      tCurrentIdx = st.j
      tBad = true
    } else if (st.phase === 'done') {
      tDoneCount = t.length
    }
    this.tCellEls.forEach((el, i) => {
      let cls = 'va__char'
      if (i === tCurrentIdx) cls += tBad ? ' is-current is-bad' : ' is-current'
      else if (i < tDoneCount) cls += ' is-done'
      el.className = cls
    })

    // 计数表
    const snap = st.countSnapshot ?? {}
    letters.forEach((c) => {
      const chip = this.chipEls[c]
      const v = snap[c] ?? 0
      let cls = 'va__chip'
      if (v > 0) cls += ' is-pos'
      if (st.char === c && (st.phase === 's' || st.phase === 't')) cls += ' is-current'
      if (st.char === c && st.phase === 't-fail') cls += ' is-bad'
      chip.className = cls
      chip.querySelector('.va__chipval').textContent = v
    })
  }

  resultBanner(result, state) {
    if (result) {
      return {
        kind: 'success',
        html: `🎉 <code>t = "${state.t}"</code> 用到的字母种类和个数和 <code>s = "${state.s}"</code> 完全一致 → 是字母异位词，返回 <strong>true</strong>。`,
      }
    }
    return {
      kind: 'fail',
      html: `🚫 <code>s = "${state.s}"</code> 和 <code>t = "${state.t}"</code> 的字母构成不一样 → 不是字母异位词，返回 <strong>false</strong>。`,
    }
  }
}

export function mountViz(el, opts) {
  return new ValidAnagramViz(el, opts)
}

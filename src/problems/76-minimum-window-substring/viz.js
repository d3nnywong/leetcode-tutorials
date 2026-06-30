/*
 * 最小覆盖子串「滑动窗口 + 字符计数」动画。
 *
 * 维护一个窗口 [left, right]：
 *   - need：t 里每个字符要出现几次。
 *   - window：当前窗口里每个字符出现了几次。
 *   - valid：窗口里「已经凑够数量」的字符种类数（不是字符总数）。
 * right 一路向右扩，把 s[right] 计入 window；一旦 valid === need 的种类数，
 * 说明窗口已经覆盖了 t 的全部要求——这时候窗口只可能「太宽」不可能「太窄」，
 * 于是反过来收缩 left，每收缩一格都记录一次「更短的可行窗口」，直到收缩到
 * 窗口失效为止。right 再继续扩，循环往复。right 和 left 各自最多走 n 步，
 * 整体 O(m + n)。
 */
import { VizPlayer } from '../../components/viz-player/vizPlayer.js'

const MAX_S = 16
const MAX_T = 8

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

export class MinWindowViz extends VizPlayer {
  constructor(mountEl) {
    super(mountEl, {
      inputs: [
        { key: 's', label: '字符串 s', default: 'ADOBECODEBANC', width: '14rem', maxlength: MAX_S },
        { key: 't', label: '字符串 t', default: 'ABC', width: '6rem', maxlength: MAX_T },
      ],
      speed: 850,
      hint: `提示：可改成你自己的 s 和 t，点「应用」重新演示（s 最多 ${MAX_S} 个字符，t 最多 ${MAX_T} 个字符，仅限英文字母）。`,
    })
  }

  parseInputs({ s, t }) {
    const sv = (s ?? '').trim().slice(0, MAX_S)
    const tv = (t ?? '').trim().slice(0, MAX_T)
    if (!sv) throw new Error('s 不能为空')
    if (!tv) throw new Error('t 不能为空')
    if (!/^[A-Za-z]+$/.test(sv)) throw new Error('s 只能包含英文字母')
    if (!/^[A-Za-z]+$/.test(tv)) throw new Error('t 只能包含英文字母')
    return { s: sv, t: tv, display: { s: sv, t: tv } }
  }

  computeSteps({ s, t }) {
    const need = new Map()
    for (const c of t) need.set(c, (need.get(c) || 0) + 1)
    const needSize = need.size
    const window = new Map()
    let valid = 0
    let left = 0
    let bestLen = Infinity
    let bestStart = 0
    const steps = []

    for (let right = 0; right < s.length; right++) {
      const c = s[right]
      let justSatisfied = false
      if (need.has(c)) {
        const cur = (window.get(c) || 0) + 1
        window.set(c, cur)
        if (cur === need.get(c)) {
          valid++
          justSatisfied = true
        }
      }

      let msg
      if (!need.has(c)) {
        msg = `右边界扩到 <code>s[${right}] = '${esc(c)}'</code>：不是 t 需要的字符，跳过计数。`
      } else if (justSatisfied) {
        msg =
          `右边界扩到 <code>s[${right}] = '${esc(c)}'</code>：t 需要的字符，窗口里 '${esc(c)}' ` +
          `的个数刚好凑够 ${need.get(c)} 个 → 多满足 1 种字符（${valid}/${needSize}）。`
      } else {
        msg =
          `右边界扩到 <code>s[${right}] = '${esc(c)}'</code>：t 需要的字符，窗口里 '${esc(c)}' ` +
          `个数变成 ${window.get(c)}（早就够了，不算新满足）。`
      }

      steps.push({
        type: 'expand',
        left,
        right,
        need,
        window: new Map(window),
        valid,
        needSize,
        bestLen,
        bestStart,
        removedIdx: null,
        msg,
      })

      while (valid === needSize) {
        const len = right - left + 1
        const improved = len < bestLen
        if (improved) {
          bestLen = len
          bestStart = left
        }
        const windowStr = esc(s.slice(left, right + 1))
        steps.push({
          type: 'check',
          left,
          right,
          need,
          window: new Map(window),
          valid,
          needSize,
          bestLen,
          bestStart,
          removedIdx: null,
          msg:
            `窗口 <code>[${left}, ${right}]</code> = "<strong>${windowStr}</strong>" 已经覆盖 t 的全部字符` +
            `（长度 ${len}）。` +
            (improved
              ? `刷新最短窗口 → 长度 <strong>${bestLen}</strong>。`
              : `没有比当前最短（长度 ${bestLen}）更短。`) +
            `试着收缩左边界，看能不能更短。`,
        })

        const d = s[left]
        let willInvalidate = false
        if (need.has(d)) {
          if (window.get(d) === need.get(d)) {
            willInvalidate = true
            valid--
          }
          window.set(d, window.get(d) - 1)
        }
        const removedIdx = left
        left++

        let shrinkMsg
        if (!need.has(d)) {
          shrinkMsg = `移出左边界 <code>s[${removedIdx}] = '${esc(d)}'</code>：不是 t 需要的字符，移出不影响覆盖。`
        } else if (willInvalidate) {
          shrinkMsg =
            `移出左边界 <code>s[${removedIdx}] = '${esc(d)}'</code>：t 需要的字符，移出后窗口里 '${esc(d)}' ` +
            `的个数不够了 → 少满足 1 种字符（${valid}/${needSize}），窗口失效，停止收缩。`
        } else {
          shrinkMsg =
            `移出左边界 <code>s[${removedIdx}] = '${esc(d)}'</code>：t 需要的字符，但移出后窗口里还有富余` +
            `（剩 ${window.get(d)} 个 ≥ 需要 ${need.get(d)} 个），继续保持有效。`
        }

        steps.push({
          type: 'shrink',
          left,
          right,
          need,
          window: new Map(window),
          valid,
          needSize,
          bestLen,
          bestStart,
          removedIdx,
          msg: shrinkMsg,
        })
      }
    }

    const result = bestLen === Infinity ? null : s.slice(bestStart, bestStart + bestLen)
    steps.push({
      type: 'done',
      left,
      right: s.length - 1,
      need,
      window: new Map(window),
      valid,
      needSize,
      bestLen,
      bestStart,
      removedIdx: null,
      final: true,
      msg: result
        ? `s 扫描完毕。最小覆盖子串是 "<strong>${esc(result)}</strong>"（长度 ${bestLen}，下标 ` +
          `[${bestStart}, ${bestStart + bestLen - 1}]）。`
        : `s 扫描完毕，没有任何窗口能覆盖 t 的所有字符，返回空字符串 <code>""</code>。`,
    })

    return { steps, result }
  }

  buildStage({ s, t }, el) {
    el.innerHTML = `
      <div class="mws__status"></div>
      <div class="mws__striplabel">s = "${esc(s)}"</div>
      <div class="mws__strip"></div>
      <div class="mws__needlabel">需要凑齐 t = "${esc(t)}"</div>
      <div class="mws__chips"></div>
    `
    this.statusEl = el.querySelector('.mws__status')
    this.stripEl = el.querySelector('.mws__strip')
    this.chipsEl = el.querySelector('.mws__chips')
    this.stripEl.innerHTML = [...s]
      .map(
        (ch, i) => `<span class="mws__cell" data-i="${i}">
          <b class="mws__ch">${esc(ch)}</b>
          <span class="mws__idx">${i}</span>
          <span class="mws__ptr"></span>
        </span>`,
      )
      .join('')
    this.cellEls = [...this.stripEl.querySelectorAll('.mws__cell')]
  }

  renderStep(st, { state }) {
    this.cellEls.forEach((c) => {
      c.className = 'mws__cell'
      const ptr = c.querySelector('.mws__ptr')
      if (ptr) ptr.textContent = ''
    })

    if (st.final) {
      if (st.bestLen !== Infinity) {
        for (let i = st.bestStart; i < st.bestStart + st.bestLen; i++) {
          this.cellEls[i]?.classList.add('is-best')
        }
      }
    } else {
      for (let i = st.left; i <= st.right; i++) this.cellEls[i]?.classList.add('is-window')
      if (st.removedIdx != null) this.cellEls[st.removedIdx]?.classList.add('is-removed')
      const lCell = this.cellEls[st.left]
      const rCell = this.cellEls[st.right]
      lCell?.classList.add('is-left')
      rCell?.classList.add('is-right')
      const lLabel = lCell?.querySelector('.mws__ptr')
      const rLabel = rCell?.querySelector('.mws__ptr')
      if (st.left === st.right) {
        if (lLabel) lLabel.textContent = 'L R'
      } else {
        if (lLabel) lLabel.textContent = 'L'
        if (rLabel) rLabel.textContent = 'R'
      }
    }

    this.chipsEl.innerHTML = [...st.need.entries()]
      .map(([ch, needCnt]) => {
        const have = st.window.get(ch) || 0
        const ok = have >= needCnt
        return `<code class="mws__chip${ok ? ' is-ok' : ''}">'${esc(ch)}': ${have}/${needCnt}</code>`
      })
      .join('')

    const bestText =
      st.bestLen !== Infinity
        ? `・ 当前最优 "<strong class="mws__best">${esc(
            state.s.slice(st.bestStart, st.bestStart + st.bestLen),
          )}</strong>"（长度 ${st.bestLen}）`
        : '・ 暂无可行窗口'
    this.statusEl.innerHTML = st.final
      ? `<span>扫描结束 ${bestText}</span>`
      : `<span>当前窗口 <code>[${st.left}, ${st.right}]</code>（长度 ${
          st.right - st.left + 1
        }） ・ 已满足 <strong>${st.valid}/${st.needSize}</strong> 种字符 ${bestText}</span>`
  }

  resultBanner(result, state) {
    if (result) {
      return {
        kind: 'success',
        html: `🎉 最小覆盖子串是 <code>"${esc(result)}"</code>，长度 <strong>${result.length}</strong>。`,
      }
    }
    return {
      kind: 'fail',
      html: `🚫 在 <code>"${esc(state.s)}"</code> 里找不到任何能覆盖 <code>"${esc(
        state.t,
      )}"</code> 全部字符的窗口，返回空字符串 <code>""</code>。`,
    }
  }
}

export function mountViz(el, opts) {
  return new MinWindowViz(el, opts)
}

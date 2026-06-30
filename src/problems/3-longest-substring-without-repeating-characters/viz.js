/*
 * 无重复字符的最长子串「滑动窗口 + 哈希表记最后位置」动画。
 *
 * 维护一个窗口 [left, right]，right 一格一格往右扩；
 * 同时用哈希表记录每个字符「最后一次出现的下标」。
 * 扫到 s[right] 时，如果它在哈希表里 *并且* 那次出现还在当前窗口内
 * （即下标 >= left），说明窗口里已经有重复了——直接把 left 跳到
 * 那次出现的下一格，保证窗口重新无重复；否则窗口照常扩大。
 * 每一步窗口长度 right-left+1 都是「以 right 结尾的最长无重复子串」，
 * 取这些长度里的最大值就是答案。整个过程 right 只走一遍，O(n)。
 */
import { VizPlayer } from '../../components/viz-player/vizPlayer.js'

const MAX_N = 16

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
// 展示用：把空格换成看得见的 ␣，其余字符照常转义
function dispCh(ch) {
  return esc(ch === ' ' ? '␣' : ch)
}

export class LongestSubstringViz extends VizPlayer {
  constructor(mountEl) {
    super(mountEl, {
      inputs: [
        { key: 's', label: '字符串 s', default: 'abcabcbb', width: '14rem', maxlength: MAX_N },
      ],
      speed: 1000,
      hint: `提示：可改成你自己的字符串，点「应用」重新演示（最多 ${MAX_N} 个字符，支持字母/数字/符号/空格）。`,
    })
  }

  parseInputs({ s }) {
    const str = (s ?? '').slice(0, MAX_N)
    return { s: str, display: { s: str } }
  }

  computeSteps({ s }) {
    const n = s.length

    if (n === 0) {
      return {
        steps: [
          {
            right: -1,
            left: 0,
            ch: null,
            dupIndex: null,
            len: 0,
            max: 0,
            bestL: 0,
            bestR: -1,
            last: true,
            lastSeen: [],
            msg: '字符串为空，最长无重复字符的子串长度为 <strong>0</strong>。',
          },
        ],
        result: { max: 0, bestL: 0, bestR: -1 },
      }
    }

    const steps = []
    let left = 0
    let max = 0
    let bestL = 0
    let bestR = -1
    const lastSeen = new Map() // char -> 最后出现的下标

    for (let right = 0; right < n; right++) {
      const ch = s[right]
      const hadBefore = lastSeen.has(ch)
      const prevIdx = hadBefore ? lastSeen.get(ch) : null
      const inWindow = hadBefore && prevIdx >= left
      if (inWindow) left = prevIdx + 1
      lastSeen.set(ch, right)

      const len = right - left + 1
      const improved = len > max
      if (improved) {
        max = len
        bestL = left
        bestR = right
      }

      const windowStr = esc(s.slice(left, right + 1))
      let msg
      if (inWindow) {
        msg =
          `看 s[${right}] = '${dispCh(ch)}'：它在当前窗口里出现过（下标 ${prevIdx}），` +
          `左边界跳到 <code>${prevIdx} + 1 = ${left}</code>。当前窗口 <code>"${windowStr}"</code>，长度 ${len}。` +
          (improved ? `刷新最长 → <strong>${max}</strong>。` : `没超过当前最长 ${max}。`)
      } else if (hadBefore) {
        msg =
          `看 s[${right}] = '${dispCh(ch)}'：之前出现过，但那次出现在窗口左边界 ${left} 之外，不影响窗口。` +
          `窗口扩大到 <code>"${windowStr}"</code>，长度 ${len}。` +
          (improved ? `刷新最长 → <strong>${max}</strong>。` : `没超过当前最长 ${max}。`)
      } else {
        msg =
          `看 s[${right}] = '${dispCh(ch)}'：窗口内首次出现，窗口扩大到 <code>"${windowStr}"</code>，长度 ${len}。` +
          (improved ? `刷新最长 → <strong>${max}</strong>。` : `没超过当前最长 ${max}。`)
      }

      steps.push({
        right,
        left,
        ch,
        dupIndex: inWindow ? prevIdx : null,
        len,
        max,
        bestL,
        bestR,
        improved,
        last: false,
        lastSeen: [...lastSeen.entries()],
        msg,
      })
    }

    const bestStr = esc(s.slice(bestL, bestR + 1))
    steps.push({
      right: n - 1,
      left: bestL,
      ch: null,
      dupIndex: null,
      len: max,
      max,
      bestL,
      bestR,
      improved: false,
      last: true,
      lastSeen: [...lastSeen.entries()],
      msg: `扫描结束。最长无重复字符子串是 <code>"${bestStr}"</code>（下标 ${bestL}..${bestR}），长度 <strong>${max}</strong>。`,
    })

    return { steps, result: { max, bestL, bestR } }
  }

  buildStage({ s }, el) {
    if (s.length === 0) {
      el.innerHTML = `<p class="lsw__empty">（空字符串，没有字符可以演示）</p>`
      this.cellEls = []
      this.statsEl = null
      this.mapEl = null
      return
    }
    el.innerHTML = `
      <div class="lsw__stats"></div>
      <div class="lsw__strip"></div>
      <div class="lsw__maplabel">每个字符最后出现的下标</div>
      <div class="lsw__map"></div>
    `
    this.statsEl = el.querySelector('.lsw__stats')
    this.stripEl = el.querySelector('.lsw__strip')
    this.mapEl = el.querySelector('.lsw__map')
    this.stripEl.innerHTML = [...s]
      .map(
        (ch, i) => `<span class="lsw__cell" data-i="${i}">
          <b class="lsw__ch">${dispCh(ch)}</b>
          <span class="lsw__idx">${i}</span>
          <span class="lsw__ptr"></span>
        </span>`,
      )
      .join('')
    this.cellEls = [...this.stripEl.querySelectorAll('.lsw__cell')]
  }

  renderStep(st, { state }) {
    if (state.s.length === 0) return

    this.cellEls.forEach((c) => {
      c.className = 'lsw__cell'
      const ptr = c.querySelector('.lsw__ptr')
      if (ptr) ptr.textContent = ''
    })

    if (st.last) {
      for (let i = st.bestL; i <= st.bestR; i++) this.cellEls[i]?.classList.add('is-best')
    } else {
      for (let i = st.left; i <= st.right; i++) this.cellEls[i]?.classList.add('is-window')
      this.cellEls[st.right]?.classList.add('is-current')
      if (st.dupIndex != null) this.cellEls[st.dupIndex]?.classList.add('is-dup')

      const lLabel = this.cellEls[st.left]?.querySelector('.lsw__ptr')
      const rLabel = this.cellEls[st.right]?.querySelector('.lsw__ptr')
      if (st.left === st.right) {
        if (lLabel) lLabel.textContent = 'L R'
      } else {
        if (lLabel) lLabel.textContent = 'L'
        if (rLabel) rLabel.textContent = 'R'
      }
    }

    if (this.statsEl) {
      this.statsEl.innerHTML = st.last
        ? `<span>最终窗口长度 <strong>${st.max}</strong></span>`
        : `<span>当前窗口长度 <strong>${st.len}</strong></span><span class="lsw__max">历史最长 <strong>${st.max}</strong></span>`
    }

    if (this.mapEl) {
      const entries = st.lastSeen ?? []
      this.mapEl.innerHTML = entries.length
        ? entries
            .map(
              ([ch, idx]) =>
                `<code class="lsw__chip${
                  !st.last && ch === st.ch ? ' is-hit' : ''
                }">'${dispCh(ch)}' → ${idx}</code>`,
            )
            .join('')
        : `<span class="lsw__empty">（空）</span>`
    }
  }

  resultBanner(result, state) {
    if (result.bestR < result.bestL) {
      return { kind: 'info', html: '空字符串，最长无重复字符子串长度为 0。' }
    }
    const sub = esc(state.s.slice(result.bestL, result.bestR + 1))
    return {
      kind: 'success',
      html: `🎉 最长无重复字符子串是 <code>"${sub}"</code>（下标 ${result.bestL}..${result.bestR}），长度 <strong>${result.max}</strong>。`,
    }
  }
}

export function mountViz(el, opts) {
  return new LongestSubstringViz(el, opts)
}

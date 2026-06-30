/*
 * 424. 替换后的最长重复字符 ——「滑动窗口 + 出现次数最多的字母」动画。
 *
 * 维护一个窗口 [left, right]，一边向右扩张一边统计窗口内每个字母出现的次数。
 * 设 maxCount 为窗口内出现次数最多的那个字母的次数，那么这个窗口想要靠「最多 k 次替换」
 * 变成「全同一个字母」，需要把窗口内剩下的 (窗口长度 − maxCount) 个字符都替换掉。
 * 只要 (窗口长度 − maxCount) ≤ k，这个窗口就是合法的；一旦超过 k，就把左边界右移一格收缩窗口。
 *
 * 妙处在于：maxCount 只增不减（不用每次重新算最大值），因为只有「不再合法」时才收缩，
 * 而收缩只会让窗口长度最多回退 1——所以最终窗口长度的最大值，就是答案。
 */
import { VizPlayer } from '../../components/viz-player/vizPlayer.js'

const MAX_N = 40
const LETTER_RE = /^[A-Z]+$/

export class LrcrViz extends VizPlayer {
  constructor(mountEl) {
    super(mountEl, {
      inputs: [
        { key: 's', label: '字符串 s（大写字母）', default: 'AABABBA', width: '14rem' },
        { key: 'k', label: 'k（最多替换次数）', default: '1', width: '5rem' },
      ],
      speed: 900,
      hint: `提示：可改成你自己的字符串和 k，点「应用」重新演示（最多 ${MAX_N} 个字符，仅大写字母）。`,
    })
  }

  parseInputs({ s, k }) {
    const str = (s ?? '').trim().toUpperCase()
    if (str === '') throw new Error('字符串不能为空')
    if (str.length > MAX_N) throw new Error(`字符串最多 ${MAX_N} 个字符`)
    if (!LETTER_RE.test(str)) throw new Error('字符串只能包含大写英文字母 A-Z')
    const kv = Math.trunc(Number(k))
    if (!Number.isFinite(kv) || kv < 0) throw new Error('k 必须是非负整数')
    if (kv > str.length) throw new Error('k 不能超过字符串长度')
    return { s: str, k: kv, display: { s: str, k: String(kv) } }
  }

  computeSteps({ s, k }) {
    const n = s.length
    const count = new Array(26).fill(0)
    let left = 0
    let maxCount = 0
    let ansLen = 0
    let ansL = 0
    let ansR = -1
    const steps = []

    for (let right = 0; right < n; right++) {
      const ci = s.charCodeAt(right) - 65
      count[ci]++
      maxCount = Math.max(maxCount, count[ci])

      let shrunk = false
      let shrinkIdx = -1
      let shrinkChar = ''
      const rawLen = right - left + 1
      if (rawLen - maxCount > k) {
        const li = s.charCodeAt(left) - 65
        count[li]--
        shrinkIdx = left
        shrinkChar = s[left]
        left++
        shrunk = true
      }

      const winLen = right - left + 1
      const improved = winLen > ansLen
      if (improved) {
        ansLen = winLen
        ansL = left
        ansR = right
      }

      const baseMsg =
        `扫到 <code>s[${right}] = '${s[right]}'</code>，右边界右移，窗口先扩张为 ` +
        `<code>[${shrunk ? left - 1 : left}, ${right}]</code>。` +
        `'${s[right]}' 出现次数变为 ${count[ci]}，窗口内最多次数 maxCount = <strong>${maxCount}</strong>。`

      const checkMsg = shrunk
        ? `窗口长度 ${rawLen} − maxCount ${maxCount} = ${rawLen - maxCount} &gt; k(${k})，
           不合法 → 把左边字符 <code>'${shrinkChar}'</code>（下标 ${shrinkIdx}）移出窗口，
           left 右移到 <strong>${left}</strong>。`
        : `窗口长度 ${rawLen} − maxCount ${maxCount} = ${rawLen - maxCount} ≤ k(${k})，窗口合法，不用收缩。`

      const resultMsg = improved
        ? `当前窗口长度 <strong>${winLen}</strong>，刷新答案为 <strong>${ansLen}</strong>。`
        : `当前窗口长度 ${winLen}，没有超过当前最大值 ${ansLen}。`

      steps.push({
        right,
        left,
        char: s[right],
        count: count.slice(),
        maxCount,
        shrunk,
        shrinkIdx,
        shrinkChar,
        winLen,
        rawLen,
        ansLen,
        ansL,
        ansR,
        improved,
        msg: `${baseMsg} ${checkMsg} ${resultMsg}`,
      })
    }

    return { steps, result: { ansLen, ansL, ansR } }
  }

  buildStage({ s }, el) {
    el.innerHTML = `
      <div class="lrc__strip"></div>
      <div class="lrc__stats"></div>
      <div class="lrc__countslabel">窗口内每个字母出现的次数</div>
      <div class="lrc__counts"></div>
    `
    this.stripEl = el.querySelector('.lrc__strip')
    this.statsEl = el.querySelector('.lrc__stats')
    this.countsEl = el.querySelector('.lrc__counts')
    this.stripEl.innerHTML = [...s]
      .map(
        (ch, i) =>
          `<span class="lrc__cell" data-i="${i}"><b class="lrc__ch">${ch}</b><span class="lrc__idx">${i}</span></span>`,
      )
      .join('')
    this.cellEls = [...this.stripEl.querySelectorAll('.lrc__cell')]
  }

  renderStep(st, { state }) {
    this.cellEls.forEach((c) => (c.className = 'lrc__cell'))

    // 当前窗口 [left, right]
    for (let i = st.left; i <= st.right; i++) this.cellEls[i]?.classList.add('is-window')
    // 当前右指针刚扫到的字符
    this.cellEls[st.right]?.classList.add('is-current')
    // 本步因收缩而移出窗口的字符
    if (st.shrunk && st.shrinkIdx >= 0) this.cellEls[st.shrinkIdx]?.classList.add('is-out')
    // 历史最优子串（始终用「截止到本步为止」的最优结果标出）
    for (let i = st.ansL; i <= st.ansR; i++) this.cellEls[i]?.classList.add('is-best')

    this.statsEl.innerHTML = `
      <span>k = <strong>${state.k}</strong></span>
      <span>窗口 <code>[${st.left}, ${st.right}]</code>，长度 <strong>${st.rawLen}</strong></span>
      <span>maxCount = <strong>${st.maxCount}</strong></span>
      <span class="lrc__answer">当前最长 <strong>${st.ansLen}</strong></span>
    `

    const A = 'A'.charCodeAt(0)
    const chips = []
    for (let i = 0; i < 26; i++) {
      if (st.count[i] > 0) {
        const letter = String.fromCharCode(A + i)
        const isMax = st.count[i] === st.maxCount
        chips.push(
          `<code class="lrc__chip${isMax ? ' is-max' : ''}">${letter}:${st.count[i]}</code>`,
        )
      }
    }
    this.countsEl.innerHTML = chips.length
      ? chips.join('')
      : `<span class="lrc__empty">（空）</span>`
  }

  resultBanner(result, state) {
    const sub = state.s.slice(result.ansL, result.ansR + 1)
    return {
      kind: 'success',
      html:
        `🎉 扫描结束，最长可变成「全同一字母」的子串长度是 <strong>${result.ansLen}</strong>` +
        `（下标 <code>[${result.ansL}, ${result.ansR}]</code>，原子串 <code>"${sub}"</code>，` +
        `用最多 k=${state.k} 次替换可以把它变成全同一个字母）。`,
    }
  }
}

export function mountViz(el, opts) {
  return new LrcrViz(el, opts)
}

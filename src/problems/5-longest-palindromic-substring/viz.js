/*
 * 最长回文子串「中心扩展法」动画。
 *
 * 一个回文串总是关于中心对称的：要么中心是「一个字符」（奇数长度），
 * 要么中心是「两个字符之间的缝」（偶数长度）。
 * 所以只要把字符串里 2n-1 个可能的中心都试一遍：从中心出发，
 * 左右指针 L、R 同时向外挪，只要 s[L] === s[R] 就继续扩，
 * 一旦不相等（或越界）就停——这个中心能扩出的回文就定了。
 * 全程记录「目前扩到过的最长回文」，扫完所有中心就是答案。
 */
import { VizPlayer } from '../../components/viz-player/vizPlayer.js'

const MAX_LEN = 16

export class LongestPalindromeViz extends VizPlayer {
  constructor(mountEl) {
    super(mountEl, {
      inputs: [{ key: 's', label: '字符串 s', default: 'babad', width: '12rem' }],
      speed: 800,
      hint: `提示：可改成你自己的字符串，点「应用」重新演示（仅数字/英文字母，最多 ${MAX_LEN} 个字符）。`,
    })
  }

  parseInputs({ s }) {
    const str = (s ?? '').trim().slice(0, MAX_LEN)
    if (str.length === 0) throw new Error('字符串不能为空')
    if (!/^[A-Za-z0-9]+$/.test(str)) throw new Error('s 只能包含数字和英文字母')
    return { s: str, display: { s: str } }
  }

  computeSteps({ s }) {
    const n = s.length
    const steps = []
    let best = { start: 0, len: 1 }

    steps.push({
      kind: 'intro',
      bestStart: best.start,
      bestLen: best.len,
      msg: `把每个字符 / 每条字符间的缝都当成一次「对称中心」试一试：从中心向左右两边扩，
            只要两边字符相同就继续扩，扩不动了就停。一共要试 <strong>${2 * n - 1}</strong> 个中心。
            先假设最长回文是第 0 个字符（长度 1），点「下一步」开始逐个中心尝试。`,
    })

    for (let c = 0; c < 2 * n - 1; c++) {
      let L = Math.floor(c / 2)
      let R = L + (c % 2)
      const centerLabel =
        c % 2 === 0 ? `字符 s[${L}]="${s[L]}"` : `s[${L}] 和 s[${R}] 之间的缝`

      while (true) {
        if (L < 0 || R >= n) {
          steps.push({
            kind: 'center',
            boundary: true,
            center: c,
            L,
            R,
            bestStart: best.start,
            bestLen: best.len,
            msg: `中心 ${c + 1}/${2 * n - 1}（${centerLabel}）：已经扩到字符串边界，停止扩展。`,
          })
          break
        }
        const matched = s[L] === s[R]
        if (matched) {
          const len = R - L + 1
          const isNewBest = len > best.len
          if (isNewBest) best = { start: L, len }
          steps.push({
            kind: 'center',
            boundary: false,
            matched: true,
            center: c,
            L,
            R,
            bestStart: best.start,
            bestLen: best.len,
            msg:
              L === R
                ? `中心 ${c + 1}/${2 * n - 1}（${centerLabel}）：单个字符自身就是回文，长度 1。`
                : `中心 ${c + 1}/${2 * n - 1}（${centerLabel}）：比较 s[${L}]="${s[L]}" 和 s[${R}]="${s[R]}" → 相同 ✅，回文扩展为长度 <strong>${len}</strong>。${
                    isNewBest ? '（刷新最长回文！）' : ''
                  }`,
          })
          L--
          R++
        } else {
          steps.push({
            kind: 'center',
            boundary: false,
            matched: false,
            center: c,
            L,
            R,
            bestStart: best.start,
            bestLen: best.len,
            msg: `中心 ${c + 1}/${2 * n - 1}（${centerLabel}）：比较 s[${L}]="${s[L]}" 和 s[${R}]="${s[R]}" → 不同 ❌，扩不动了，停止。`,
          })
          break
        }
      }
    }

    return { steps, result: best }
  }

  buildStage({ s }, el) {
    el.innerHTML = `
      <div class="lps__cells"></div>
      <div class="lps__bestline">
        当前最长回文：<code class="lps__bestcode"></code>
        （长度 <span class="lps__bestlen"></span>）
      </div>
    `
    this.cellsEl = el.querySelector('.lps__cells')
    this.bestCodeEl = el.querySelector('.lps__bestcode')
    this.bestLenEl = el.querySelector('.lps__bestlen')
    this.cellsEl.innerHTML = s
      .split('')
      .map(
        (ch, i) =>
          `<span class="lps__cell" data-i="${i}"><b class="lps__ch">${ch}</b><span class="lps__idx">${i}</span></span>`,
      )
      .join('')
    this.cellEls = [...this.cellsEl.querySelectorAll('.lps__cell')]
  }

  renderStep(st, { state }) {
    this.cellEls.forEach((c) => (c.className = 'lps__cell'))

    // 当前已知最长回文（持续高亮）
    const bStart = st.bestStart
    const bLen = st.bestLen
    for (let i = bStart; i < bStart + bLen; i++) this.cellEls[i]?.classList.add('is-best')
    this.bestCodeEl.textContent = state.s.slice(bStart, bStart + bLen)
    this.bestLenEl.textContent = String(bLen)

    if (st.kind === 'center' && !st.boundary) {
      const { L, R, matched } = st
      if (matched) {
        for (let i = L; i <= R; i++) this.cellEls[i]?.classList.add('is-range')
      } else {
        this.cellEls[L]?.classList.add('is-bad')
        this.cellEls[R]?.classList.add('is-bad')
      }
      this.cellEls[L]?.classList.add('is-L')
      this.cellEls[R]?.classList.add('is-R')
    }
  }

  resultBanner(result, state) {
    const str = state.s.slice(result.start, result.start + result.len)
    return {
      kind: 'success',
      html: `🎉 试完所有中心啦！最长回文子串是 <code>"${str}"</code>
             （下标 [${result.start}, ${result.start + result.len - 1}]，长度 ${result.len}）。`,
    }
  }
}

export function mountViz(el, opts) {
  return new LongestPalindromeViz(el, opts)
}

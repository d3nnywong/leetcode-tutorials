/*
 * 回文子串「中心扩展」动画。
 *
 * 一个回文串必然有一个「中心」：要么是单个字符（奇数长度），
 * 要么是相邻两个字符之间的缝隙（偶数长度）。长度为 n 的字符串一共有
 * 2n − 1 个这样的中心。对每个中心，让左右指针 L、R 从中心向两边扩张：
 * 只要 s[L] === s[R] 就说明又多确认了一个回文子串（计数 +1），
 * 然后继续往外扩；一旦越界或两边字符不相等，这个中心就到此为止，换下一个。
 * 把所有中心都扫一遍，加起来就是答案。时间 O(n²)，空间 O(1)。
 */
import { VizPlayer } from '../../components/viz-player/vizPlayer.js'

const MAX_N = 8

export class PalindromicSubstringsViz extends VizPlayer {
  constructor(mountEl) {
    super(mountEl, {
      inputs: [{ key: 's', label: '字符串 s（小写字母）', default: 'aabaa', width: '12rem' }],
      speed: 900,
      hint: `提示：可改成你自己的字符串，点「应用」重新演示（最多 ${MAX_N} 个小写字母）。`,
    })
  }

  parseInputs({ s }) {
    const str = (s ?? '').trim().toLowerCase().slice(0, MAX_N)
    if (!/^[a-z]+$/.test(str)) {
      throw new Error(`请输入 1~${MAX_N} 个小写英文字母`)
    }
    return { s: str, display: { s: str } }
  }

  computeSteps({ s }) {
    const n = s.length
    const steps = []
    const found = []
    let count = 0

    for (let c = 0; c <= 2 * n - 2; c++) {
      const centerL = Math.floor(c / 2)
      const centerR = centerL + (c % 2)
      const isEven = c % 2 === 1
      const centerDesc = isEven
        ? `s[${centerL}]='${s[centerL]}' 与 s[${centerR}]='${s[centerR]}' 之间（偶数长度）`
        : `s[${centerL}]='${s[centerL]}'（奇数长度）`

      let L = centerL
      let R = centerR
      while (true) {
        const inBounds = L >= 0 && R < n
        const match = inBounds && s[L] === s[R]
        if (match) {
          count++
          const sub = s.slice(L, R + 1)
          found.push(sub)
          steps.push({
            c,
            isEven,
            centerL,
            centerR,
            centerDesc,
            L,
            R,
            status: 'match',
            count,
            sub,
            list: [...found],
            msg: `${centerDesc}。比较 s[${L}]='${s[L]}' 与 s[${R}]='${s[R]}'：<strong>相等</strong>，
              「${sub}」是回文，计数 +1 → 共 <strong>${count}</strong> 个。继续向外扩展。`,
          })
          L--
          R++
        } else {
          steps.push({
            c,
            isEven,
            centerL,
            centerR,
            centerDesc,
            L,
            R,
            status: inBounds ? 'mismatch' : 'bound',
            count,
            list: [...found],
            msg: inBounds
              ? `${centerDesc}。比较 s[${L}]='${s[L]}' 与 s[${R}]='${s[R]}'：<strong>不相等</strong>，
                 停止扩展，换下一个中心。`
              : `${centerDesc}。已经扩到字符串边界，停止扩展，换下一个中心。`,
          })
          break
        }
      }
    }
    if (!steps.length) {
      steps.push({ status: 'mismatch', count: 0, list: [], msg: '空输入。' })
    }
    return { steps, result: { count, s } }
  }

  buildStage({ s }, el) {
    el.innerHTML = `
      <div class="ps__center"></div>
      <div class="ps__row"></div>
      <div class="ps__stats"></div>
      <div class="ps__foundlabel">已确认的回文子串</div>
      <div class="ps__found"></div>
    `
    this.centerEl = el.querySelector('.ps__center')
    this.rowEl = el.querySelector('.ps__row')
    this.statsEl = el.querySelector('.ps__stats')
    this.foundEl = el.querySelector('.ps__found')
    this.rowEl.innerHTML = s
      .split('')
      .map(
        (ch, i) =>
          `<span class="ps__cell" data-i="${i}"><b class="ps__ch">${ch}</b><span class="ps__idx">${i}</span></span>`,
      )
      .join('')
    this.cellEls = [...this.rowEl.querySelectorAll('.ps__cell')]
  }

  renderStep(st, { state }) {
    this.cellEls.forEach((c) => (c.className = 'ps__cell'))

    if (typeof st.centerL === 'number') {
      this.cellEls[st.centerL]?.classList.add('is-center')
      this.cellEls[st.centerR]?.classList.add('is-center')
    }
    if (st.status === 'match') {
      for (let i = st.L; i <= st.R; i++) this.cellEls[i]?.classList.add('is-range')
      this.cellEls[st.L]?.classList.add('is-l')
      this.cellEls[st.R]?.classList.add('is-r')
    } else if (st.status === 'mismatch') {
      this.cellEls[st.L]?.classList.add('is-bad')
      this.cellEls[st.R]?.classList.add('is-bad')
    }

    this.centerEl.innerHTML = st.centerDesc ? `当前中心：<code>${st.centerDesc}</code>` : ''

    this.statsEl.innerHTML = `已确认 <strong>${st.count}</strong> 个回文子串（字符串长度 ${state.s.length}）`

    const list = st.list ?? []
    this.foundEl.innerHTML = list.length
      ? list
          .map(
            (sub, i) =>
              `<code class="ps__chip${i === list.length - 1 && st.status === 'match' ? ' is-new' : ''}">${sub}</code>`,
          )
          .join('')
      : `<span class="ps__empty">（还没有）</span>`
  }

  resultBanner(result) {
    return {
      kind: 'success',
      html: `🎉 字符串 <code>"${result.s}"</code> 一共有 <strong>${result.count}</strong> 个回文子串。`,
    }
  }
}

export function mountViz(el, opts) {
  return new PalindromicSubstringsViz(el, opts)
}

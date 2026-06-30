/*
 * 解码方法「一维 DP」动画。
 *
 *   dp[i] 表示：s 的前 i 个字符，一共有多少种合法的解码方式。
 *   dp[0] = 1（空串只有「什么都不解码」这一种方式）。
 *
 *   算 dp[i] 时只看两种「最后一步」：
 *     1) 把第 i 位单独解码成一个字母 —— 要求这一位不是 '0'，贡献 dp[i-1]；
 *     2) 把第 i-1、i 位合在一起解码成一个字母 —— 要求这两位组成的两位数在 10~26
 *        之间（包含 10 和 26），贡献 dp[i-2]。
 *   两种情况互不冲突，能成立的都要加上：dp[i] = 贡献1 + 贡献2。
 *   如果两种都不成立，dp[i] = 0，说明走到这里这条路就「死」了，后面即使数值再大也只会是 0。
 *
 *   最终答案就是 dp[n]。
 */
import { VizPlayer } from '../../components/viz-player/vizPlayer.js'

const MAX_N = 14

export class DecodeWaysViz extends VizPlayer {
  constructor(mountEl) {
    super(mountEl, {
      inputs: [{ key: 's', label: '数字字符串 s（只含数字）', default: '226', maxlength: MAX_N, width: '11rem' }],
      speed: 1100,
      hint: `提示：可以改成你自己的数字串，点「应用」重新演示（最多 ${MAX_N} 位）。试试 "06" 看开头 0 直接无解、"2101" 看死路怎么往后传播。`,
    })
  }

  parseInputs({ s }) {
    const clean = (s ?? '').replace(/\s+/g, '').slice(0, MAX_N)
    if (!clean) throw new Error('请输入一个数字字符串')
    if (!/^[0-9]+$/.test(clean)) throw new Error('只能输入数字 0-9')
    return { s: clean, display: { s: clean } }
  }

  computeSteps({ s }) {
    const n = s.length
    const steps = []
    // dp：dp[0..n]，null 表示还没算出来（用于回填「?」）
    const dp = new Array(n + 1).fill(null)
    dp[0] = 1

    for (let i = 1; i <= n; i++) {
      const oneDigit = s[i - 1]
      const oneValid = oneDigit !== '0'
      const contribOne = oneValid ? dp[i - 1] : 0

      let twoDigit = null
      let twoNum = null
      let twoValid = false
      let contribTwo = 0
      if (i >= 2) {
        twoDigit = s.slice(i - 2, i)
        twoNum = Number(twoDigit)
        twoValid = twoNum >= 10 && twoNum <= 26
        contribTwo = twoValid ? dp[i - 2] : 0
      }

      const val = contribOne + contribTwo
      dp[i] = val

      let msg
      if (oneValid && twoValid) {
        msg = `看第 ${i} 位 <code>s[${i - 1}] = "${oneDigit}"</code>：单独解码成立（非 0），贡献
          <code>dp[${i - 1}] = ${dp[i - 1]}</code>；它和前一位组成两位数 <code>"${twoDigit}"</code>
          （${twoNum}，在 10~26 之间）也成立，贡献 <code>dp[${i - 2}] = ${dp[i - 2]}</code>。
          dp[${i}] = ${dp[i - 1]} + ${dp[i - 2]} = <strong>${val}</strong>。`
      } else if (oneValid && i >= 2) {
        const reason = twoNum < 10 ? `${twoNum} 比 10 还小` : `${twoNum} 超过了 26`
        msg = `看第 ${i} 位 <code>s[${i - 1}] = "${oneDigit}"</code>：单独解码成立，贡献
          <code>dp[${i - 1}] = ${dp[i - 1]}</code>；两位数 <code>"${twoDigit}"</code>（${reason}）不合法，没有贡献。
          dp[${i}] = dp[${i - 1}] = <strong>${val}</strong>。`
      } else if (oneValid) {
        msg = `看第 ${i} 位 <code>s[${i - 1}] = "${oneDigit}"</code>：非 0，单独解码成立，贡献
          <code>dp[0] = 1</code>。这是第一位，还组不成两位数。dp[1] = <strong>${val}</strong>。`
      } else if (twoValid) {
        msg = `看第 ${i} 位 <code>s[${i - 1}] = "0"</code>：不能单独解码成字母；但它和前一位组成两位数
          <code>"${twoDigit}"</code>（${twoNum}，在 10~26 之间）合法，贡献 <code>dp[${i - 2}] = ${dp[i - 2]}</code>。
          dp[${i}] = dp[${i - 2}] = <strong>${val}</strong>。`
      } else if (i >= 2) {
        msg = `看第 ${i} 位 <code>s[${i - 1}] = "0"</code>：不能单独解码；两位数 <code>"${twoDigit}"</code>
          （${twoNum}）也不在 10~26 之间，两条路都走不通。dp[${i}] = <strong>0</strong> —— 这条路径「死」了。`
      } else {
        msg = `看第 ${i} 位 <code>s[${i - 1}] = "0"</code>：字符串开头就是 0，没法解码成任何字母。
          dp[1] = <strong>0</strong>。`
      }

      steps.push({
        i,
        oneDigit,
        oneValid,
        twoDigit,
        twoValid,
        dp: [...dp],
        msg,
      })
    }

    return { steps, result: dp[n] }
  }

  buildStage({ s }, el) {
    const n = s.length
    el.innerHTML = `
      <div class="dw__board">
        <div class="dw__row dw__row--chars"></div>
        <div class="dw__row dw__row--cells"></div>
      </div>
    `
    const charsEl = el.querySelector('.dw__row--chars')
    const cellsEl = el.querySelector('.dw__row--cells')
    // 字符行：在 dp 格子之间对齐，首尾各留半格空位
    charsEl.innerHTML =
      `<span class="dw__gap"></span>` +
      [...s].map((ch) => `<span class="dw__char">${ch}</span>`).join('') +
      `<span class="dw__gap"></span>`
    // dp 格子行：dp[0..n] 共 n+1 个，落在字符的边界缝隙上
    let cells = ''
    for (let k = 0; k <= n; k++) {
      cells += `<span class="dw__cell" data-k="${k}"><b class="dw__cell-label">dp${k}</b><span class="dw__cell-val">${
        k === 0 ? '1' : '?'
      }</span></span>`
    }
    cellsEl.innerHTML = cells
    this.charEls = [...charsEl.querySelectorAll('.dw__char')]
    this.cellEls = [...cellsEl.querySelectorAll('.dw__cell')]
  }

  renderStep(st) {
    this.charEls.forEach((c) => (c.className = 'dw__char'))
    this.cellEls.forEach((c) => (c.className = 'dw__cell'))

    const dp = st.dp ?? [1]
    this.cellEls.forEach((el, k) => {
      const v = dp[k]
      const valEl = el.querySelector('.dw__cell-val')
      if (v == null) {
        el.classList.add('is-unknown')
        valEl.textContent = '?'
      } else if (v === 0) {
        el.classList.add('is-zero')
        valEl.textContent = '0'
      } else {
        el.classList.add('is-known')
        valEl.textContent = String(v)
      }
    })

    if (typeof st.i === 'number') {
      const i = st.i
      this.cellEls[i]?.classList.add('is-current')
      if (st.oneValid) this.cellEls[i - 1]?.classList.add('is-source')
      if (st.twoValid) this.cellEls[i - 2]?.classList.add('is-source2')

      this.charEls[i - 1]?.classList.add('is-current')
      if (typeof st.twoDigit === 'string') {
        const pairClass = st.twoValid ? 'is-pair-ok' : 'is-pair-bad'
        this.charEls[i - 2]?.classList.add(pairClass)
        this.charEls[i - 1]?.classList.add(pairClass)
      }
    }
  }

  resultBanner(result, state) {
    if (result > 0) {
      return {
        kind: 'success',
        html: `🎉 字符串 <code>${state.s}</code> 一共有 <strong>${result}</strong> 种合法的解码方式 →
          <code>dp[${state.s.length}] = ${result}</code>。`,
      }
    }
    return {
      kind: 'fail',
      html: `🚫 字符串 <code>${state.s}</code> 没有任何合法的解码方式，返回 <strong>0</strong>
        （多半是某处出现了孤立、组不成合法编码的 "0"）。`,
    }
  }
}

export function mountViz(el, opts) {
  return new DecodeWaysViz(el, opts)
}

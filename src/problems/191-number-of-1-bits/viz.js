/*
 * 位1的个数（汉明重量）—— 「n & (n-1) 消去最低位的 1」动画。
 *
 * 核心技巧：cur & (cur - 1) 总能精确地把 cur 二进制里最低的那个 1 变成 0，
 * 其余位都不受影响。于是只要数「做了几次这个操作才能把 cur 变成 0」，
 * 这个次数就是原数里 1 的个数——比逐位检查 32 次更快，循环次数 = 1 的个数。
 */
import { VizPlayer } from '../../components/viz-player/vizPlayer.js'

const MAX_N = 1048575 // 2^20 - 1，限制位宽方便动画展示，原理对完整 32 位整数同样成立

function toBin(num, width) {
  return num.toString(2).padStart(width, '0')
}

export class NumberOf1BitsViz extends VizPlayer {
  constructor(mountEl) {
    super(mountEl, {
      inputs: [{ key: 'n', label: 'n（正整数）', default: '11', width: '9rem' }],
      speed: 1100,
      hint: `提示：可改成你自己的 n，点「应用」重新演示（为了看清动画，限制 1 ~ ${MAX_N}）。`,
    })
  }

  parseInputs({ n }) {
    const raw = (n ?? '').toString().trim()
    if (raw === '') throw new Error('请输入一个正整数 n')
    if (!/^\d+$/.test(raw)) throw new Error(`「${raw}」不是合法的正整数`)
    const v = Number(raw)
    if (!Number.isInteger(v) || v < 1 || v > MAX_N) {
      throw new Error(`n 请输入 1 ~ ${MAX_N} 之间的整数`)
    }
    const bitWidth = v.toString(2).length
    return { n: v, bitWidth, display: { n: String(v) } }
  }

  computeSteps({ n, bitWidth }) {
    const steps = []
    steps.push({
      cur: n,
      count: 0,
      clearedPos: null,
      msg: `n = <strong>${n}</strong>，二进制是 <code>${toBin(n, bitWidth)}</code>（共 ${bitWidth} 位）。
        我们要数里面有几个 1。用技巧：<code>cur = cur &amp; (cur - 1)</code> 每次都能精确清掉
        cur 最低位的那个 1，数一数要清几次。`,
    })
    let cur = n
    let count = 0
    while (cur !== 0) {
      const before = cur
      const after = before & (before - 1)
      const clearedPos = Math.log2(before ^ after)
      count++
      cur = after
      steps.push({
        cur,
        count,
        clearedPos,
        before,
        after,
        msg: `cur = <code>${toBin(before, bitWidth)}</code> &amp; <code>${toBin(
          before - 1,
          bitWidth,
        )}</code>（即 cur − 1）= <code>${toBin(
          after,
          bitWidth,
        )}</code>，清掉了第 ${clearedPos} 位那个 1。已经数到 <strong>${count}</strong> 个。`,
      })
    }
    if (steps.length > 1) {
      steps[steps.length - 1].msg += ' cur 变成 0，循环结束。'
    }
    return { steps, result: count }
  }

  buildStage({ n, bitWidth }, el) {
    el.innerHTML = `
      <div class="nb__n">n = <strong>${n}</strong>　二进制（${bitWidth} 位）<code class="nb__nbin">${toBin(
        n,
        bitWidth,
      )}</code></div>
      <div class="nb__bits"></div>
      <div class="nb__op"></div>
      <div class="nb__count"></div>
    `
    this.bitsEl = el.querySelector('.nb__bits')
    this.opEl = el.querySelector('.nb__op')
    this.countEl = el.querySelector('.nb__count')

    this.bitsEl.innerHTML = Array.from({ length: bitWidth })
      .map((_, idx) => {
        const pos = bitWidth - 1 - idx // 从左到右，每格对应的是「第几位（从最低位 0 数起）」
        return `<span class="nb__cell" data-pos="${pos}"><b class="nb__bitval">0</b><span class="nb__pos">${pos}</span></span>`
      })
      .join('')
    this.cellEls = [...this.bitsEl.querySelectorAll('.nb__cell')]
  }

  renderStep(st) {
    this.cellEls.forEach((cell) => {
      const pos = Number(cell.dataset.pos)
      const bit = (st.cur >>> pos) & 1
      cell.querySelector('.nb__bitval').textContent = String(bit)
      cell.classList.remove('is-one', 'is-cleared')
      if (bit === 1) cell.classList.add('is-one')
      else if (st.clearedPos === pos) cell.classList.add('is-cleared')
    })

    this.opEl.innerHTML =
      st.clearedPos != null
        ? `本步操作：<code>cur &amp; (cur − 1)</code> → 清掉第 <strong>${st.clearedPos}</strong> 位的 1`
        : '尚未开始操作，下面是 n 的初始二进制状态'

    const chips = Array.from({ length: st.count })
      .map(
        (_, i) =>
          `<span class="nb__chip${i === st.count - 1 ? ' is-new' : ''}">${i + 1}</span>`,
      )
      .join('')
    this.countEl.innerHTML = `已数到 <strong>${st.count}</strong> 个 1${
      st.count ? `<div class="nb__tally">${chips}</div>` : ''
    }`
  }

  resultBanner(result, state) {
    return {
      kind: 'success',
      html: `🎉 数完啦！<code>${state.n}</code> 的二进制 <code>${toBin(
        state.n,
        state.bitWidth,
      )}</code> 里一共有 <strong>${result}</strong> 个设置位（1），也就是汉明重量 = ${result}。`,
    }
  }
}

export function mountViz(el, opts) {
  return new NumberOf1BitsViz(el, opts)
}

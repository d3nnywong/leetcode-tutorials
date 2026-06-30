/*
 * 比特位计数「一维 DP：用已经算好的更小数字」动画。
 *
 *   dp[i] 表示：整数 i 的二进制表示里有几个 1。
 *   把 i 的二进制最低位「砍掉」，剩下的部分就是 i >> 1（右移一位）。
 *   砍掉的那一位是 i & 1（0 或 1）。
 *   所以 i 里 1 的个数 = (i >> 1) 里 1 的个数，再加上被砍掉那一位是不是 1：
 *     dp[i] = dp[i >> 1] + (i & 1)
 *   边界：dp[0] = 0（0 的二进制全是 0，没有 1）。
 *
 * 因为 i >> 1 永远比 i 小，所以从 0 往后一个一个算，dp[i >> 1] 早就算好了——
 * 不需要再去数 i 本身的每一位，整个数组只需要扫一遍，O(n) 搞定。
 */
import { VizPlayer } from '../../components/viz-player/vizPlayer.js'

const MAX_N = 16

function toBin(num, width) {
  return num.toString(2).padStart(width, '0')
}

export class CountingBitsViz extends VizPlayer {
  constructor(mountEl) {
    super(mountEl, {
      inputs: [{ key: 'n', label: 'n（0 ~ ' + MAX_N + '）', default: '5', width: '6rem' }],
      speed: 950,
      hint: `提示：可以改成你自己的 n，点「应用」重新演示（为了看清动画，限制 0 ~ ${MAX_N}，原题 0 ≤ n ≤ 10^5）。`,
    })
  }

  parseInputs({ n }) {
    const raw = (n ?? '').toString().trim()
    if (raw === '') throw new Error('请输入一个整数 n')
    if (!/^\d+$/.test(raw)) throw new Error(`「${raw}」不是合法的非负整数`)
    const v = Number(raw)
    if (!Number.isInteger(v) || v < 0 || v > MAX_N) {
      throw new Error(`n 请输入 0 ~ ${MAX_N} 之间的整数`)
    }
    const bitWidth = Math.max(1, v.toString(2).length)
    return { n: v, bitWidth, display: { n: String(v) } }
  }

  computeSteps({ n, bitWidth }) {
    const dp = new Array(n + 1).fill(null)
    const steps = []

    dp[0] = 0
    steps.push({
      kind: 'base',
      i: 0,
      dp: [...dp],
      msg: `dp[0] = <strong>0</strong>：0 的二进制是 <code>${toBin(
        0,
        bitWidth,
      )}</code>，里面没有任何 1，这是地基。`,
    })

    for (let i = 1; i <= n; i++) {
      const src = i >> 1
      const bit = i & 1
      const value = dp[src] + bit
      dp[i] = value
      steps.push({
        kind: 'trans',
        i,
        src,
        bit,
        srcValue: dp[src],
        dp: [...dp],
        msg: `i = ${i}（二进制 <code>${toBin(
          i,
          bitWidth,
        )}</code>）：右移一位 i &gt;&gt; 1 = <strong>${src}</strong>（二进制 <code>${toBin(
          src,
          bitWidth,
        )}</code>），被砍掉的最低位是 <strong>${bit}</strong>。
          dp[${i}] = dp[${src}] + ${bit} = ${dp[src]} + ${bit} = <strong>${value}</strong>。`,
      })
    }

    const result = dp.slice()
    return { steps, result }
  }

  buildStage({ n, bitWidth }, el) {
    el.innerHTML = `
      <div class="cb__n">n = <strong>${n}</strong>，要算出 <code>ans[0..${n}]</code> 共 ${
        n + 1
      } 个数</div>
      <div class="cb__row"></div>
      <div class="cb__eq"></div>
    `
    this.rowEl = el.querySelector('.cb__row')
    this.eqEl = el.querySelector('.cb__eq')

    this.rowEl.innerHTML = Array.from({ length: n + 1 })
      .map(
        (_, i) => `
        <div class="cb__cell" data-i="${i}">
          <span class="cb__idx">i=${i}</span>
          <span class="cb__bin">${toBin(i, bitWidth)}</span>
          <span class="cb__dp">?</span>
        </div>`,
      )
      .join('')
    this.cellEls = [...this.rowEl.querySelectorAll('.cb__cell')]
  }

  renderStep(st) {
    this.cellEls.forEach((cellEl) => {
      cellEl.className = 'cb__cell'
      const i = Number(cellEl.dataset.i)
      const v = st.dp[i]
      cellEl.querySelector('.cb__dp').textContent = v != null ? String(v) : '?'
    })

    const cur = this.cellEls[st.i]
    cur?.classList.add('is-current')
    if (st.kind === 'trans') {
      this.cellEls[st.src]?.classList.add('is-source')
    }

    this.eqEl.innerHTML =
      st.kind === 'base'
        ? `<code>dp[0]</code> = <strong>0</strong>（边界条件，没有更小的数字可以参考）`
        : `<code>dp[${st.i}]</code> = dp[${st.i} &gt;&gt; 1] + (${st.i} &amp; 1) = dp[${st.src}] + ${st.bit} = ${st.srcValue} + ${st.bit} = <strong>${st.dp[st.i]}</strong>`
  }

  resultBanner(result) {
    return {
      kind: 'success',
      html: `🎉 全部算完啦！<code>ans = [${result.join(
        ', ',
      )}]</code>，每个 i 都只用了「更小的、已经算好的 dp[i &gt;&gt; 1]」，整个数组只扫了一遍。`,
    }
  }
}

export function mountViz(el, opts) {
  return new CountingBitsViz(el, opts)
}

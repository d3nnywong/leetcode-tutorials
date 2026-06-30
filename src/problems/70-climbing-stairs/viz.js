/*
 * 爬楼梯「一维 DP」动画。
 *
 *   dp[i] 表示：爬到第 i 阶一共有多少种不同的方法。
 *   要爬到第 i 阶，最后一步只有两种可能：
 *     - 从第 i-1 阶迈 1 阶上来
 *     - 从第 i-2 阶迈 2 阶上来
 *   这两种情况互不重叠，把它们的方法数加起来就是 dp[i]：
 *     dp[i] = dp[i-1] + dp[i-2]
 *   边界：dp[1] = 1（只能 1+1+...+1 这一种走法的「前缀」），dp[2] = 2（1+1 或 2）。
 *
 * 动画把"一阶一阶往上算"拆成一步一步：当前在算的台阶 i 高亮，
 * 它依赖的 i-1、i-2 两级台阶高亮成"来源"，算完把数字填上去；
 * 最后一级台阶（第 n 阶）用金色标出最终答案。
 */
import { VizPlayer } from '../../components/viz-player/vizPlayer.js'

const MAX_N = 10

export class ClimbingStairsViz extends VizPlayer {
  constructor(mountEl) {
    super(mountEl, {
      inputs: [{ key: 'n', label: '楼梯阶数 n', default: '5', width: '5rem' }],
      speed: 1000,
      hint: `提示：可以改成你自己的阶数 n，点「应用」重新演示（最多 ${MAX_N} 阶，原题 1 ≤ n ≤ 45）。`,
    })
  }

  parseInputs({ n }) {
    const v = Math.trunc(Number(n))
    if (!Number.isFinite(v)) throw new Error(`「${n}」不是合法的整数`)
    if (v < 1) throw new Error('n 至少是 1')
    const clamped = Math.min(v, MAX_N)
    return { n: clamped, display: { n: String(clamped) } }
  }

  computeSteps({ n }) {
    const dp = new Array(n + 1).fill(null)
    const steps = []

    dp[1] = 1
    steps.push({
      kind: 'base',
      i: 1,
      dp: [...dp],
      msg: `地基：第 1 阶只有一种走法——直接迈 1 阶上去，所以 dp[1] = <strong>1</strong>。`,
    })

    if (n >= 2) {
      dp[2] = 2
      steps.push({
        kind: 'base',
        i: 2,
        dp: [...dp],
        msg: `地基：到第 2 阶有两种走法——「1 阶 + 1 阶」或「直接迈 2 阶」，所以 dp[2] = <strong>2</strong>。`,
      })
    }

    for (let i = 3; i <= n; i++) {
      dp[i] = dp[i - 1] + dp[i - 2]
      steps.push({
        kind: 'trans',
        i,
        src1: i - 1,
        src2: i - 2,
        dp: [...dp],
        msg:
          `要到第 ${i} 阶，最后一步要么是从第 ${i - 1} 阶迈 1 阶上来，要么是从第 ${
            i - 2
          } 阶迈 2 阶上来，两种情况互不重叠：` +
          `dp[${i}] = dp[${i - 1}] + dp[${i - 2}] = ${dp[i - 1]} + ${dp[i - 2]} = <strong>${
            dp[i]
          }</strong>。`,
      })
    }

    if (steps.length) steps[steps.length - 1].final = true
    return { steps, result: dp[n] }
  }

  buildStage({ n }, el) {
    el.innerHTML = `
      <div class="cs__target">目标：爬到第 <strong>${n}</strong> 阶楼梯（每次 1 阶或 2 阶）</div>
      <div class="cs__stairs"></div>
      <div class="cs__eq"></div>
    `
    this.stairsEl = el.querySelector('.cs__stairs')
    this.eqEl = el.querySelector('.cs__eq')

    let html = ''
    for (let i = 0; i <= n; i++) {
      html += `
        <div class="cs__stair" data-i="${i}" style="--i:${i}">
          <span class="cs__count">${i === 0 ? '' : '?'}</span>
          <span class="cs__tread"></span>
          <span class="cs__idx">${i === 0 ? '起点' : i}</span>
        </div>`
    }
    this.stairsEl.innerHTML = html
    this.stairEls = [...this.stairsEl.querySelectorAll('.cs__stair')]
  }

  renderStep(st) {
    this.stairEls.forEach((el) => {
      el.className = 'cs__stair'
      const i = Number(el.dataset.i)
      const countEl = el.querySelector('.cs__count')
      const v = st.dp[i]
      countEl.textContent = i === 0 ? '' : v != null ? String(v) : '?'
    })

    const cur = this.stairEls[st.i]
    cur?.classList.add('is-current')
    if (st.kind === 'trans') {
      this.stairEls[st.src1]?.classList.add('is-source')
      this.stairEls[st.src2]?.classList.add('is-source2')
    }
    if (st.final) cur?.classList.add('is-final')

    this.eqEl.innerHTML =
      st.kind === 'base'
        ? `<code>dp[${st.i}]</code> = <strong>${st.dp[st.i]}</strong>（边界条件，直接给定）`
        : `<code>dp[${st.i}]</code> = <code>dp[${st.src1}]</code> + <code>dp[${st.src2}]</code> = ${
            st.dp[st.src1]
          } + ${st.dp[st.src2]} = <strong>${st.dp[st.i]}</strong>`
  }

  resultBanner(result, state) {
    return {
      kind: 'success',
      html: `🎉 爬到第 ${state.n} 阶楼梯，一共有 <strong>${result}</strong> 种不同的方法！`,
    }
  }
}

export function mountViz(el, opts) {
  return new ClimbingStairsViz(el, opts)
}

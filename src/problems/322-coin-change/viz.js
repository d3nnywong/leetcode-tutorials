/*
 * 零钱兑换「一维动态规划（自底向上）」动画。
 *
 * dp[j] = 凑出金额 j 所需的最少硬币数（凑不出就是 ∞）。
 * 边界：dp[0] = 0（凑出 0 元不需要任何硬币）。
 * 转移：dp[j] = min( dp[j-c] + 1 )，对每个面额 c ≤ j（且 dp[j-c] 不是 ∞）取最小。
 * 因为 j-c < j，按 j 从小到大算，等算到 j 时 dp[j-c] 早就算好了——这就是「自底向上」。
 * 最终答案就是 dp[amount]，是 ∞ 就返回 -1。
 */
import { VizPlayer } from '../../components/viz-player/vizPlayer.js'

const MAX_COINS = 8
const MAX_AMOUNT = 16

export class CoinChangeViz extends VizPlayer {
  constructor(mountEl) {
    super(mountEl, {
      inputs: [
        { key: 'coins', label: '硬币面额 coins（逗号分隔）', default: '1,2,5', width: '11rem' },
        { key: 'amount', label: 'amount', default: '11', width: '5rem' },
      ],
      speed: 1100,
      hint: `提示：可改成你自己的面额和 amount，点「应用」重新演示（最多 ${MAX_COINS} 种面额，amount 最大 ${MAX_AMOUNT}，演示用；原题 amount 可到 10⁴）。`,
    })
  }

  parseInputs({ coins, amount }) {
    const arr = (coins ?? '')
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s !== '')
      .slice(0, MAX_COINS)
      .map((s) => {
        const v = Number(s)
        if (!Number.isInteger(v) || v <= 0) throw new Error(`硬币面额「${s}」必须是正整数`)
        return v
      })
    if (arr.length < 1) throw new Error('至少要有 1 种硬币面额')

    const amt = Math.trunc(Number(amount))
    if (!Number.isFinite(amt) || amt < 0) throw new Error('amount 必须是 ≥ 0 的整数')
    if (amt > MAX_AMOUNT) throw new Error(`amount 最大支持 ${MAX_AMOUNT}（演示用，原题可到 10^4）`)

    return {
      coins: arr,
      amount: amt,
      display: { coins: arr.join(','), amount: String(amt) },
    }
  }

  computeSteps({ coins, amount }) {
    const INF = Infinity
    const dp = new Array(amount + 1).fill(INF)
    dp[0] = 0
    const steps = []

    // 第 0 步：边界
    steps.push({
      i: 0,
      candidates: [],
      best: null,
      base: true,
      dpSnapshot: [...dp],
      msg: `边界：凑出金额 <strong>0</strong> 不需要任何硬币，<code>dp[0] = 0</code>。`,
    })

    for (let i = 1; i <= amount; i++) {
      const candidates = coins
        .filter((c) => c <= i)
        .map((c) => ({ coin: c, from: i - c, fromVal: dp[i - c] }))

      let best = null
      for (const cand of candidates) {
        if (cand.fromVal === INF) continue
        const val = cand.fromVal + 1
        if (best === null || val < best.val) best = { ...cand, val }
      }
      dp[i] = best ? best.val : INF

      let msg
      if (best) {
        msg =
          `凑 <strong>${i}</strong>：试每种 ≤ ${i} 的硬币 c，看 <code>dp[${i}−c] + 1</code>。` +
          `用硬币 <strong>${best.coin}</strong> 最划算：dp[${best.from}] + 1 = ${best.fromVal} + 1 = <strong>${best.val}</strong>` +
          ` → <code>dp[${i}] = ${best.val}</code>。`
      } else if (candidates.length === 0) {
        msg = `凑 <strong>${i}</strong>：没有任何面额 ≤ ${i}，<code>dp[${i}]</code> 暂时凑不出（∞）。`
      } else {
        msg =
          `凑 <strong>${i}</strong>：试了面额 ${candidates.map((c) => c.coin).join('、')}，` +
          `但它们对应的 dp[${i}−c] 全是「凑不出」（∞），所以 <code>dp[${i}]</code> 也凑不出。`
      }

      steps.push({ i, candidates, best, base: false, dpSnapshot: [...dp], msg })
    }

    const finalVal = dp[amount]
    const result = finalVal === INF ? -1 : finalVal
    return { steps, result, dpFinal: dp }
  }

  buildStage({ coins, amount }, el) {
    el.innerHTML = `
      <div class="cc__coins-row">
        <span class="cc__label">硬币面额</span>
        <div class="cc__coins"></div>
      </div>
      <div class="cc__dp-row">
        <span class="cc__label">dp 数组（凑出金额 j 的最少硬币数）</span>
        <div class="cc__dp"></div>
      </div>
      <div class="cc__candidates-row">
        <span class="cc__label">当前格的候选转移</span>
        <div class="cc__candidates"></div>
      </div>
    `
    this.coinsEl = el.querySelector('.cc__coins')
    this.dpEl = el.querySelector('.cc__dp')
    this.candEl = el.querySelector('.cc__candidates')

    this.coinsEl.innerHTML = coins
      .map((c, idx) => `<span class="cc__coin" data-coin="${idx}">${c}</span>`)
      .join('')
    this.coinCells = [...this.coinsEl.querySelectorAll('.cc__coin')]

    this.dpEl.innerHTML = Array.from(
      { length: amount + 1 },
      (_, j) =>
        `<span class="cc__cell" data-j="${j}"><b class="cc__val"></b><span class="cc__idx">${j}</span></span>`,
    ).join('')
    this.dpCells = [...this.dpEl.querySelectorAll('.cc__cell')]
  }

  renderStep(st, { state, idx, total }) {
    const fmt = (v) => (v === Infinity ? '∞' : String(v))

    // dp 格子
    this.dpCells.forEach((cell, j) => {
      cell.className = 'cc__cell'
      cell.querySelector('.cc__val').textContent = fmt(st.dpSnapshot[j])
      if (j === 0) cell.classList.add('is-base')
      if (st.best && j === st.best.from) cell.classList.add('is-source')
      if (j === st.i) cell.classList.add('is-current')
      if (idx === total - 1 && j === state.amount) cell.classList.add('is-final')
    })

    // 硬币面额：高亮本步用上的那个
    this.coinCells.forEach((c) => c.classList.remove('is-used', 'is-tried'))
    if (st.candidates) {
      st.candidates.forEach((cand) => {
        const i = state.coins.indexOf(cand.coin)
        if (i >= 0) this.coinCells[i]?.classList.add('is-tried')
      })
    }
    if (st.best) {
      const i = state.coins.indexOf(st.best.coin)
      if (i >= 0) this.coinCells[i]?.classList.add('is-used')
    }

    // 候选转移面板
    if (st.candidates.length === 0) {
      this.candEl.innerHTML = `<span class="cc__empty">（没有可用的面额）</span>`
    } else {
      this.candEl.innerHTML = st.candidates
        .map((cand) => {
          const isBest = st.best && cand.coin === st.best.coin
          const isDead = cand.fromVal === Infinity
          const tail = isDead ? '' : ` + 1 = ${fmt(cand.fromVal + 1)}`
          return `<code class="cc__cand${isBest ? ' is-best' : ''}${isDead ? ' is-dead' : ''}">硬币 ${cand.coin}：dp[${cand.from}] = ${fmt(cand.fromVal)}${tail}</code>`
        })
        .join('')
    }
  }

  resultBanner(result, state) {
    if (state.amount === 0) {
      return {
        kind: 'success',
        html: `🎉 金额是 <strong>0</strong>，不需要任何硬币，<code>dp[0] = 0</code>。`,
      }
    }
    if (result === -1) {
      return {
        kind: 'fail',
        html: `🚫 用 <code>[${state.coins.join(', ')}]</code> 这些面额，无论怎么组合都凑不出 <strong>${state.amount}</strong> → 返回 <strong>-1</strong>。`,
      }
    }
    // 回溯一条具体的硬币方案
    const path = []
    let cur = state.amount
    while (cur > 0) {
      const st = this.steps[cur]
      if (!st || !st.best) {
        path.length = 0
        break
      }
      path.push(st.best.coin)
      cur = st.best.from
    }
    const pathHtml = path.length ? ` （例如 ${path.join(' + ')} = ${state.amount}）` : ''
    return {
      kind: 'success',
      html: `🎉 凑出 <strong>${state.amount}</strong> 最少需要 <strong>${result}</strong> 枚硬币${pathHtml}。`,
    }
  }
}

export function mountViz(el, opts) {
  return new CoinChangeViz(el, opts)
}

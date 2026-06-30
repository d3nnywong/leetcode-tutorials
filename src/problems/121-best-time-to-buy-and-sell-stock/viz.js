/*
 * 买卖股票的最佳时机「一遍扫描 + 维护历史最低价」动画。
 *
 * 从左往右扫一遍价格数组，边走边记「目前为止见过的最低价 minPrice」（也就是最划算的买入点）。
 * 走到第 i 天时：
 *   - 如果今天价格比 minPrice 还低 → 它才是更好的买入点，更新 minPrice。
 *   - 否则 → 今天可以当卖出日，算一下「今天价格 − minPrice」这笔利润，
 *     如果比历史最大利润还大，就刷新答案。
 * 全程只扫一遍、只比较，不回头，O(n) 时间、O(1) 空间。
 */
import { VizPlayer } from '../../components/viz-player/vizPlayer.js'

const MAX_N = 12

export class BestStockViz extends VizPlayer {
  constructor(mountEl) {
    super(mountEl, {
      inputs: [
        {
          key: 'prices',
          label: '股价数组 prices（逗号分隔）',
          default: '7,1,5,3,6,4',
          width: '15rem',
        },
      ],
      speed: 1100,
      hint: `提示：可改成你自己的价格数组，点「应用」重新演示（最多 ${MAX_N} 天）。`,
    })
  }

  parseInputs({ prices }) {
    const arr = (prices ?? '')
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s !== '')
      .slice(0, MAX_N)
      .map((s) => {
        const v = Number(s)
        if (!Number.isFinite(v) || v < 0) throw new Error(`「${s}」不是合法的非负价格`)
        return Math.trunc(v)
      })
    if (arr.length < 1) throw new Error('至少要有 1 天的价格')
    return { prices: arr, display: { prices: arr.join(',') } }
  }

  computeSteps({ prices }) {
    const steps = []
    let minPrice = prices[0]
    let minIdx = 0
    let maxProfit = 0
    let buyIdx = 0
    let sellIdx = 0

    steps.push({
      i: 0,
      minIdx,
      minPrice,
      profit: 0,
      maxProfit,
      buyIdx,
      sellIdx,
      isNewMin: true,
      isFirst: true,
      msg: `从第 0 天开始：价格 prices[0] = <strong>${prices[0]}</strong>，先把它当成目前见过的最低买入价。`,
    })

    for (let i = 1; i < prices.length; i++) {
      const price = prices[i]
      if (price < minPrice) {
        minPrice = price
        minIdx = i
        steps.push({
          i,
          minIdx,
          minPrice,
          profit: 0,
          maxProfit,
          buyIdx,
          sellIdx,
          isNewMin: true,
          msg: `第 ${i} 天，价格 prices[${i}] = ${price}，比当前最低价更低 → 更新最低买入价为 <strong>${price}</strong>（第 ${i} 天）。`,
        })
      } else {
        const profit = price - minPrice
        const improved = profit > maxProfit
        if (improved) {
          maxProfit = profit
          buyIdx = minIdx
          sellIdx = i
        }
        steps.push({
          i,
          minIdx,
          minPrice,
          profit,
          maxProfit,
          buyIdx,
          sellIdx,
          isNewMin: false,
          improved,
          msg:
            `第 ${i} 天，价格 prices[${i}] = ${price}。若第 ${minIdx} 天（价格 ${minPrice}）买入、今天卖出，` +
            `利润 = ${price} − ${minPrice} = <strong>${profit}</strong>。` +
            (improved
              ? `刷新历史最大利润 → <strong>${maxProfit}</strong>。`
              : `没有超过当前最大利润 ${maxProfit}，不更新。`),
        })
      }
    }

    steps.push({
      i: prices.length - 1,
      minIdx,
      minPrice,
      profit: maxProfit,
      maxProfit,
      buyIdx,
      sellIdx,
      isNewMin: false,
      last: true,
      msg:
        maxProfit > 0
          ? `扫描结束。最大利润来自第 <code>${buyIdx}</code> 天买入（价格 ${prices[buyIdx]}）、` +
            `第 <code>${sellIdx}</code> 天卖出（价格 ${prices[sellIdx]}）→ <strong>${maxProfit}</strong>。`
          : `扫描结束。价格一路非递增，找不到能获利的买卖组合 → 返回 <strong>0</strong>。`,
    })

    return { steps, result: { maxProfit, buyIdx, sellIdx } }
  }

  buildStage({ prices }, el) {
    this.geo = this.#geometry(prices)
    el.innerHTML = `
      <div class="bs__stats"></div>
      <div class="bs__chartwrap">${this.#svg(prices)}</div>
    `
    this.statsEl = el.querySelector('.bs__stats')
    this.svgEl = el.querySelector('.bs__svg')
  }

  #geometry(prices) {
    const n = prices.length
    const colW = 44
    const W = n * colW
    const H = 210
    const base = H - 24 // 底部留给下标
    const maxV = Math.max(...prices, 1)
    const scale = (H - 54) / maxV
    return { n, colW, W, H, base, scale, center: (i) => i * colW + colW / 2 }
  }

  #svg(prices) {
    const g = this.geo
    let bars = ''
    for (let i = 0; i < prices.length; i++) {
      const bw = g.colW - 14
      const x = i * g.colW + 7
      const bh = prices[i] * g.scale
      const y = g.base - bh
      bars += `<rect class="bs-bar" data-i="${i}" x="${x}" y="${y}" width="${bw}" height="${bh}" rx="3"/>`
      bars += `<text class="bs-price" x="${g.center(i)}" y="${y - 5}">${prices[i]}</text>`
      bars += `<text class="bs-idx" x="${g.center(i)}" y="${g.H - 7}">${i}</text>`
    }
    return `<svg class="bs__svg" viewBox="0 0 ${g.W} ${g.H}" preserveAspectRatio="xMidYMid meet" role="img">
      <line class="bs-minline" x1="0" y1="0" x2="${g.W}" y2="0"/>
      <rect class="bs-profit" x="0" y="0" width="0" height="0"/>
      ${bars}
      <text class="bs-profit-label" x="0" y="0"></text>
    </svg>`
  }

  renderStep(st, { state }) {
    const g = this.geo
    const prices = state.prices

    this.statsEl.innerHTML =
      `<span>历史最低价 <strong>${st.minPrice}</strong>（第 ${st.minIdx} 天）</span>` +
      `<span class="bs__profit">${
        st.isNewMin ? '今天是新低，暂不卖出' : `今天卖出利润 <strong>${st.profit}</strong>`
      }</span>` +
      `<span class="bs__max">历史最大利润 <strong>${st.maxProfit}</strong></span>`

    // 柱子配色：最后一步高亮最终买卖点，其余步高亮当前日 / 历史最低价日
    this.svgEl.querySelectorAll('.bs-bar').forEach((b) => {
      b.classList.remove('is-min', 'is-current', 'is-best')
      const i = Number(b.dataset.i)
      if (st.last && (i === st.buyIdx || i === st.sellIdx)) b.classList.add('is-best')
      else if (i === st.i) b.classList.add('is-current')
      else if (i === st.minIdx) b.classList.add('is-min')
    })

    // 最低价参考线
    const minLine = this.svgEl.querySelector('.bs-minline')
    const minY = g.base - st.minPrice * g.scale
    minLine.setAttribute('y1', minY)
    minLine.setAttribute('y2', minY)
    minLine.classList.toggle('is-hidden', !!st.last)

    // 利润条：从买入日顶端到卖出日顶端之间的色带
    const profitRect = this.svgEl.querySelector('.bs-profit')
    const profitLabel = this.svgEl.querySelector('.bs-profit-label')
    const buy = st.last ? st.buyIdx : st.minIdx
    const sell = st.last ? st.sellIdx : st.i
    const profit = st.last ? st.maxProfit : st.profit
    const showBand = !st.isFirst && !st.isNewMin && profit > 0

    if (showBand) {
      const x1 = g.center(buy)
      const x2 = g.center(sell)
      const yTop = g.base - prices[sell] * g.scale
      const yBottom = g.base - prices[buy] * g.scale
      profitRect.setAttribute('x', Math.min(x1, x2))
      profitRect.setAttribute('width', Math.abs(x2 - x1))
      profitRect.setAttribute('y', yTop)
      profitRect.setAttribute('height', Math.max(0, yBottom - yTop))
      profitRect.classList.toggle('is-record', !!(st.last || st.improved))
      profitRect.classList.remove('is-hidden')

      profitLabel.setAttribute('x', (x1 + x2) / 2)
      profitLabel.setAttribute('y', yTop - 9)
      profitLabel.textContent = `+${profit}`
      profitLabel.classList.remove('is-hidden')
      profitLabel.classList.toggle('is-record', !!(st.last || st.improved))
    } else {
      profitRect.classList.add('is-hidden')
      profitLabel.classList.add('is-hidden')
    }
  }

  resultBanner(result, state) {
    const { maxProfit, buyIdx, sellIdx } = result
    if (maxProfit > 0) {
      return {
        kind: 'success',
        html: `🎉 最大利润是 <strong>${maxProfit}</strong>：第 <code>${buyIdx}</code> 天（价格 ${state.prices[buyIdx]}）买入，第 <code>${sellIdx}</code> 天（价格 ${state.prices[sellIdx]}）卖出。`,
      }
    }
    return {
      kind: 'fail',
      html: `🚫 价格一路非递增，无论哪天买入都卖不出更高的价 → 最大利润为 <strong>0</strong>。`,
    }
  }
}

export function mountViz(el, opts) {
  return new BestStockViz(el, opts)
}

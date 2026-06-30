/*
 * 盛最多水的容器「双指针」动画。
 *
 * 左右两个指针从两端开始。面积 = 矮的那条边 × 两条线之间的宽度。
 * 想变大只有一个办法：把<strong>矮</strong>的那条指针往里移——
 * 因为面积被矮边卡住，移高的那条只会让宽度变小、矮边不变，绝不会更好。
 * 每次移动矮指针，扫一遍就能找到最大面积，O(n)。
 */
import { VizPlayer } from '../../components/viz-player/vizPlayer.js'

const MAX_N = 12

export class ContainerViz extends VizPlayer {
  constructor(mountEl) {
    super(mountEl, {
      inputs: [
        {
          key: 'height',
          label: '高度数组 height（逗号分隔）',
          default: '1,8,6,2,5,4,8,3,7',
          width: '17rem',
        },
      ],
      speed: 1100,
      hint: `提示：可改成你自己的高度数组，点「应用」重新演示（最多 ${MAX_N} 条线）。`,
    })
  }

  parseInputs({ height }) {
    const arr = (height ?? '')
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s !== '')
      .slice(0, MAX_N)
      .map((s) => {
        const v = Number(s)
        if (!Number.isFinite(v) || v < 0) throw new Error(`「${s}」不是合法的非负高度`)
        return Math.trunc(v)
      })
    if (arr.length < 2) throw new Error('至少要有 2 条线')
    return { height: arr, display: { height: arr.join(',') } }
  }

  computeSteps({ height }) {
    const h = height
    const steps = []
    let l = 0
    let r = h.length - 1
    let max = 0
    let bestL = 0
    let bestR = h.length - 1
    while (l < r) {
      const area = Math.min(h[l], h[r]) * (r - l)
      const improved = area > max
      if (improved) {
        max = area
        bestL = l
        bestR = r
      }
      const moveL = h[l] < h[r]
      steps.push({
        l,
        r,
        area,
        max,
        bestL,
        bestR,
        improved,
        last: false,
        msg:
          `左 <code>${l}</code>(高 ${h[l]})、右 <code>${r}</code>(高 ${h[r]})：` +
          `宽 ${r - l} × 矮边 ${Math.min(h[l], h[r])} = 面积 <strong>${area}</strong>。` +
          (improved ? `刷新最大值 → <strong>${max}</strong>。` : `没超过当前最大 ${max}。`) +
          `矮的是${moveL ? '左' : '右'}边，${moveL ? '左指针右移' : '右指针左移'}（移高的只会更窄）。`,
      })
      if (moveL) l++
      else r--
    }
    // 收尾步：展示最终答案的那一对
    steps.push({
      l: bestL,
      r: bestR,
      area: max,
      max,
      bestL,
      bestR,
      improved: false,
      last: true,
      msg: `两指针相遇，扫描结束。最大面积来自下标 <code>${bestL}</code> 和 <code>${bestR}</code> → <strong>${max}</strong>。`,
    })
    return { steps, result: { max, bestL, bestR } }
  }

  buildStage({ height }, el) {
    this.geo = this.#geometry(height)
    el.innerHTML = `
      <div class="cw__stats"></div>
      <div class="cw__chartwrap">${this.#svg(height)}</div>
    `
    this.statsEl = el.querySelector('.cw__stats')
    this.svgEl = el.querySelector('.cw__svg')
  }

  #geometry(h) {
    const n = h.length
    const colW = 44
    const W = n * colW
    const H = 210
    const base = H - 24 // 底部留给下标
    const maxH = Math.max(...h, 1)
    const scale = (H - 54) / maxH
    return { n, colW, W, H, base, scale, center: (i) => i * colW + colW / 2 }
  }

  #svg(h) {
    const g = this.geo
    let bars = ''
    for (let i = 0; i < h.length; i++) {
      const bw = g.colW - 14
      const x = i * g.colW + 7
      const bh = h[i] * g.scale
      const y = g.base - bh
      bars += `<rect class="cw-bar" data-i="${i}" x="${x}" y="${y}" width="${bw}" height="${bh}" rx="3"/>`
      bars += `<text class="cw-h" x="${g.center(i)}" y="${y - 5}">${h[i]}</text>`
      bars += `<text class="cw-idx" x="${g.center(i)}" y="${g.H - 7}">${i}</text>`
    }
    return `<svg class="cw__svg" viewBox="0 0 ${g.W} ${g.H}" preserveAspectRatio="xMidYMid meet" role="img">
      <rect class="cw-water" x="0" y="0" width="0" height="0"/>
      ${bars}
      <g class="cw-ptrs"></g>
    </svg>`
  }

  renderStep(st, { state }) {
    const g = this.geo
    const h = state.height
    // 统计行
    this.statsEl.innerHTML =
      `<span>当前面积 <strong>${st.area}</strong></span>` +
      `<span class="cw__max">历史最大 <strong>${st.max}</strong></span>`

    // 柱子配色
    this.svgEl.querySelectorAll('.cw-bar').forEach((b) => {
      b.classList.remove('is-l', 'is-r', 'is-best')
      const i = Number(b.dataset.i)
      if (st.last && (i === st.bestL || i === st.bestR)) b.classList.add('is-best')
      else if (i === st.l) b.classList.add('is-l')
      else if (i === st.r) b.classList.add('is-r')
    })

    // 水面矩形
    const water = this.svgEl.querySelector('.cw-water')
    const x1 = g.center(st.l)
    const x2 = g.center(st.r)
    const wh = Math.min(h[st.l], h[st.r]) * g.scale
    water.setAttribute('x', x1)
    water.setAttribute('width', Math.max(0, x2 - x1))
    water.setAttribute('y', g.base - wh)
    water.setAttribute('height', wh)
    water.classList.toggle('is-best', !!st.last)

    // 指针标记
    const ptrs = this.svgEl.querySelector('.cw-ptrs')
    ptrs.innerHTML =
      `<text class="cw-ptr" x="${g.center(st.l)}" y="${g.base + 16}">▲L</text>` +
      `<text class="cw-ptr" x="${g.center(st.r)}" y="${g.base + 16}">▲R</text>`
  }

  resultBanner(result) {
    return {
      kind: 'success',
      html: `🎉 最大水量是 <strong>${result.max}</strong>（下标 ${result.bestL} 与 ${result.bestR} 的两条线）。`,
    }
  }
}

export function mountContainer(el, opts) {
  return new ContainerViz(el, opts)
}

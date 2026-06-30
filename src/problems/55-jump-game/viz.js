/*
 * 跳跃游戏「贪心：维护能到达的最远下标」动画。
 *
 * 不用一格一格地枚举所有跳法（那样是指数级），而是从左到右扫一遍数组，
 * 全程只记一个数：farthest —— 目前为止，从已经走过的位置出发，最远能跳到哪个下标。
 * 走到下标 i 时：
 *   - 如果 i 已经超过 farthest，说明前面所有跳跃加起来都够不到这里 → 卡住，到不了终点。
 *   - 否则更新 farthest = max(farthest, i + nums[i])；
 *     一旦 farthest 覆盖了最后一个下标，立刻就能确定可以到达，不用再往下扫。
 * 整个过程只扫一遍数组，O(n)。
 */
import { VizPlayer } from '../../components/viz-player/vizPlayer.js'

const MAX_N = 12

export class JumpGameViz extends VizPlayer {
  constructor(mountEl) {
    super(mountEl, {
      inputs: [
        {
          key: 'nums',
          label: '数组 nums（逗号分隔，非负整数）',
          default: '2,3,1,1,4',
          width: '15rem',
        },
      ],
      speed: 1100,
      hint: `提示：可改成你自己的数组，点「应用」重新演示（最多 ${MAX_N} 个数，试试 3,2,1,0,4 看看卡住的样子）。`,
    })
  }

  parseInputs({ nums }) {
    const arr = (nums ?? '')
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s !== '')
      .slice(0, MAX_N)
      .map((s) => {
        const v = Number(s)
        if (!Number.isInteger(v) || v < 0) throw new Error(`「${s}」不是合法的非负整数`)
        return v
      })
    if (arr.length < 1) throw new Error('至少要有 1 个数')
    return { nums: arr, display: { nums: arr.join(',') } }
  }

  computeSteps({ nums }) {
    const n = nums.length
    const steps = []
    let farthest = 0
    let result = false

    for (let i = 0; i < n; i++) {
      if (i > farthest) {
        steps.push({
          i,
          farthestBefore: farthest,
          farthestAfter: farthest,
          stuck: true,
          done: false,
          improved: false,
          msg: `走到下标 <code>${i}</code>，但目前为止最远只能到达下标 <strong>${farthest}</strong>，
                够不着这里 → <strong>卡住了，无法到达终点</strong>。`,
        })
        result = false
        break
      }
      const reach = i + nums[i]
      const improved = reach > farthest
      const farthestBefore = farthest
      if (improved) farthest = reach
      const done = farthest >= n - 1
      const reachShown = Math.min(reach, n - 1)
      steps.push({
        i,
        farthestBefore,
        farthestAfter: farthest,
        reach,
        reachShown,
        improved,
        stuck: false,
        done,
        msg:
          `下标 <code>${i}</code>（值 ${nums[i]}）最远能跳到下标 <strong>${reach}</strong>。` +
          (improved
            ? ` 比之前的最远 ${farthestBefore} 更远，刷新「最远可达」→ <strong>${farthest}</strong>。`
            : ` 没超过当前最远可达 ${farthestBefore}，先不更新。`) +
          (done
            ? ` 已经覆盖到终点下标 <strong>${n - 1}</strong> → <strong>可以到达！</strong>`
            : ''),
      })
      if (done) {
        result = true
        break
      }
    }

    return { steps, result }
  }

  buildStage({ nums }, el) {
    const n = nums.length
    el.innerHTML = `
      <div class="jg__stats"></div>
      <div class="jg__board">
        <div class="jg__cells" style="grid-template-columns:repeat(${n},minmax(2.4rem,1fr))"></div>
        <div class="jg__track" style="grid-template-columns:repeat(${n},minmax(2.4rem,1fr))">
          <div class="jg__fill"></div>
        </div>
      </div>
    `
    this.statsEl = el.querySelector('.jg__stats')
    this.cellsEl = el.querySelector('.jg__cells')
    this.fillEl = el.querySelector('.jg__fill')
    this.cellsEl.innerHTML = nums
      .map(
        (v, i) =>
          `<span class="jg__cell" data-i="${i}"><b class="jg__val">${v}</b><span class="jg__idx">${i}</span></span>`,
      )
      .join('')
    this.cellEls = [...this.cellsEl.querySelectorAll('.jg__cell')]
  }

  renderStep(st, { state }) {
    const n = state.nums.length

    this.cellEls.forEach((c, idx) => {
      const cls = ['jg__cell']
      if (st.stuck) {
        if (idx === st.i) cls.push('is-stuck')
        else if (idx <= st.farthestBefore) cls.push('is-reachable')
      } else {
        if (idx === st.i) cls.push('is-current')
        else if (st.improved && idx === st.reachShown) cls.push('is-target')
        else if (idx <= st.farthestAfter) cls.push('is-reachable')
      }
      if (st.done && idx === n - 1) cls.push('is-goal')
      c.className = cls.join(' ')
    })

    const span = Math.max(1, Math.min(st.farthestAfter, n - 1) + 1)
    this.fillEl.style.gridColumn = `1 / span ${span}`
    this.fillEl.classList.toggle('is-stuck', !!st.stuck)
    this.fillEl.classList.toggle('is-goal', !!st.done)

    this.statsEl.innerHTML =
      `<span>当前下标 <strong>${st.i}</strong></span>` +
      `<span class="jg__farthest">最远可达 <strong>${st.farthestAfter}</strong></span>` +
      `<span>终点下标 <strong>${n - 1}</strong></span>`
  }

  resultBanner(result, state) {
    const n = state.nums.length
    if (result) {
      return {
        kind: 'success',
        html: `🎉 「最远可达下标」最终覆盖到了终点 <strong>${n - 1}</strong> → 返回 <strong>true</strong>，可以到达最后一个下标。`,
      }
    }
    return {
      kind: 'fail',
      html: `🚫 扫到某个下标时，前面所有跳跃加起来也够不到它 → 返回 <strong>false</strong>，无法到达最后一个下标。`,
    }
  }
}

export function mountViz(el, opts) {
  return new JumpGameViz(el, opts)
}

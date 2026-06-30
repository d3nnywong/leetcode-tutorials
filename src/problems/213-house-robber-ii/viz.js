/*
 * 打家劫舍 II「拆环为链」一维 DP 动画。
 *
 * 房子围成一圈，第 1 号和第 n 号相邻——意味着这两间不能同时偷。
 * 但只要这两间房不会同时被偷，剩下就只有两种互斥的可能：
 *   情形 A：干脆不偷第 n 号房 → 问题退化成在 [第1号 .. 第n-1号] 这条「直线」上做标准打家劫舍
 *   情形 B：干脆不偷第 1 号房 → 问题退化成在 [第2号 .. 第n号] 这条「直线」上做标准打家劫舍
 * 两种情形各自跑一遍经典一维 DP（dp[i] = max(dp[i-1], dp[i-2] + nums[i])），
 * 答案就是两者的较大值。
 *
 * 动画分三段：先点出首尾相邻的矛盾，再依次跑「情形 A」「情形 B」两条 DP 链
 * （被排除的那间房整间变暗），最后比较两个总额，取较大者为答案。
 */
import { VizPlayer } from '../../components/viz-player/vizPlayer.js'

const MAX_N = 10

export class HouseRobberIIViz extends VizPlayer {
  constructor(mountEl) {
    super(mountEl, {
      inputs: [
        {
          key: 'nums',
          label: '各房屋金额 nums（逗号分隔，首尾相邻围成一圈）',
          default: '5,1,2,7,4',
          width: '16rem',
        },
      ],
      speed: 1200,
      hint: `提示：可以改成你自己的房屋金额，点「应用」重新演示（最多 ${MAX_N} 间房，原题 1 ≤ nums.length ≤ 100）。`,
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
        if (!Number.isFinite(v)) throw new Error(`「${s}」不是合法数字`)
        const t = Math.trunc(v)
        if (t < 0) throw new Error('房屋金额不能是负数')
        return t
      })
    if (arr.length < 1) throw new Error('至少要有 1 间房')
    return { nums: arr, display: { nums: arr.join(',') } }
  }

  computeSteps(state) {
    const { nums } = state
    const n = nums.length
    const houseNo = (i) => i + 1
    const steps = []

    if (n === 1) {
      steps.push({
        kind: 'single',
        i: 0,
        dp: [nums[0]],
        lo: 0,
        final: true,
        msg: `只有 1 间房（第 1 号），不存在「首尾相邻」的冲突，直接偷它就好：答案 = <strong>${nums[0]}</strong>。`,
      })
      state.totalA = nums[0]
      state.totalB = nums[0]
      return { steps, result: nums[0] }
    }

    steps.push({
      kind: 'intro',
      excludeIdx: null,
      msg: `房子围成一圈：第 1 号和第 ${n} 号是相邻的（首尾相连），这两间<strong>不能同时偷</strong>。
        既然不能同时偷，就只剩两种互斥的情形：要么彻底不偷第 ${n} 号，要么彻底不偷第 1 号。
        分别按「一条直线」做标准的打家劫舍 DP，再取较大者。`,
    })

    let totalA = 0
    let totalB = 0
    let dpAFinal = []
    let dpBFinal = []

    const runPhase = (lo, hi, phaseKey, phaseLabel, excludeIdx) => {
      const m = hi - lo + 1
      const dp = new Array(m).fill(null)
      steps.push({
        kind: 'phase-start',
        activePhase: phaseKey,
        excludeIdx,
        lo,
        dp: [],
        msg: `${phaseLabel}：不偷第 ${houseNo(excludeIdx)} 号房，问题退化成在第 ${houseNo(
          lo,
        )} ~ ${houseNo(hi)} 号房这条直线上做标准的一维 DP：dp[i] = max(dp[i-1], dp[i-2] + nums[i])。`,
      })

      for (let i = 0; i < m; i++) {
        const origIdx = lo + i
        if (i === 0) {
          dp[0] = nums[origIdx]
          steps.push({
            kind: 'base',
            activePhase: phaseKey,
            excludeIdx,
            lo,
            i: origIdx,
            dp: [...dp],
            msg: `地基：第 ${houseNo(origIdx)} 号房是这条直线的第一间，偷了它 dp = <strong>${
              dp[0]
            }</strong>。`,
          })
        } else if (i === 1) {
          dp[1] = Math.max(nums[lo], nums[lo + 1])
          steps.push({
            kind: 'base',
            activePhase: phaseKey,
            excludeIdx,
            lo,
            i: origIdx,
            src1: lo,
            dp: [...dp],
            msg: `地基：前两间房（第 ${houseNo(lo)}、${houseNo(
              lo + 1,
            )} 号）不能同时偷，取金额较大的一间：dp = max(${nums[lo]}, ${nums[lo + 1]}) = <strong>${
              dp[1]
            }</strong>。`,
          })
        } else {
          const src1 = origIdx - 1
          const src2 = origIdx - 2
          const skip = dp[i - 1]
          const take = dp[i - 2] + nums[origIdx]
          dp[i] = Math.max(skip, take)
          steps.push({
            kind: 'trans',
            activePhase: phaseKey,
            excludeIdx,
            lo,
            i: origIdx,
            src1,
            src2,
            dp: [...dp],
            msg: `第 ${houseNo(
              origIdx,
            )} 号房：偷它就要跳过紧邻的第 ${houseNo(src1)} 号，金额是 dp[${houseNo(
              src2,
            )}] + nums[${houseNo(origIdx)}] = ${dp[i - 2]} + ${nums[origIdx]} = ${take}；
              不偷它就沿用 dp[${houseNo(src1)}] = ${skip}。两者取大：dp = <strong>${dp[i]}</strong>。`,
          })
        }
      }

      const total = dp[m - 1]
      steps.push({
        kind: 'phase-end',
        activePhase: phaseKey,
        excludeIdx,
        lo,
        i: lo + m - 1,
        dp: [...dp],
        total,
        msg: `${phaseLabel}算完：不偷第 ${houseNo(
          excludeIdx,
        )} 号房的前提下，最多能偷到 <strong>${total}</strong>。`,
      })
      return { total, dp }
    }

    const resA = runPhase(0, n - 2, 'A', '情形 A', n - 1)
    totalA = resA.total
    dpAFinal = resA.dp
    const resB = runPhase(1, n - 1, 'B', '情形 B', 0)
    totalB = resB.total
    dpBFinal = resB.dp

    const result = Math.max(totalA, totalB)
    const winPhase = totalA >= totalB ? 'A' : 'B'
    const winLo = winPhase === 'A' ? 0 : 1
    const winExclude = winPhase === 'A' ? n - 1 : 0
    const winDp = winPhase === 'A' ? dpAFinal : dpBFinal

    steps.push({
      kind: 'final',
      activePhase: winPhase,
      excludeIdx: winExclude,
      lo: winLo,
      i: winLo + winDp.length - 1,
      dp: [...winDp],
      final: true,
      totalA,
      totalB,
      msg: `两种情形取较大者：max(情形 A = ${totalA}, 情形 B = ${totalB}) = <strong>${result}</strong>，
        这就是首尾相连、不触动警报的情况下能偷到的最高金额。`,
    })

    // 记录累计的「已知总额」，供渲染时随时显示两个情形当前进度
    let knownA = null
    let knownB = null
    for (const st of steps) {
      if (st.kind === 'phase-end' || st.kind === 'final') {
        if (st.activePhase === 'A' && st.kind === 'phase-end') knownA = st.total
        if (st.activePhase === 'B' && st.kind === 'phase-end') knownB = st.total
      }
      st.knownA = knownA
      st.knownB = knownB
    }
    steps[steps.length - 1].knownA = totalA
    steps[steps.length - 1].knownB = totalB

    state.totalA = totalA
    state.totalB = totalB

    return { steps, result }
  }

  buildStage({ nums }, el) {
    const n = nums.length
    el.innerHTML = `
      <div class="hr__target">街道围成一圈：共 <strong>${n}</strong> 间房${
        n > 1 ? `（第 1 号与第 ${n} 号首尾相邻）` : ''
      }</div>
      <div class="hr__circle-note"></div>
      <div class="hr__houses"></div>
      <div class="hr__phase"></div>
      <div class="hr__eq"></div>
      <div class="hr__totals">
        ${
          n > 1
            ? `<span class="hr__chip" data-phase="A">情形 A（不偷第 ${n} 号）：<strong>?</strong></span>
               <span class="hr__chip" data-phase="B">情形 B（不偷第 1 号）：<strong>?</strong></span>`
            : ''
        }
      </div>
    `
    this.houseRowEl = el.querySelector('.hr__houses')
    this.noteEl = el.querySelector('.hr__circle-note')
    this.phaseEl = el.querySelector('.hr__phase')
    this.eqEl = el.querySelector('.hr__eq')
    this.chipAEl = el.querySelector('.hr__chip[data-phase="A"] strong')
    this.chipBEl = el.querySelector('.hr__chip[data-phase="B"] strong')
    this.chipAWrap = el.querySelector('.hr__chip[data-phase="A"]')
    this.chipBWrap = el.querySelector('.hr__chip[data-phase="B"]')

    this.houseRowEl.innerHTML = nums
      .map(
        (v, i) => `
        <div class="hr__house" data-i="${i}">
          <span class="hr__dp"></span>
          <span class="hr__value">${v}</span>
          <span class="hr__no">${i + 1}</span>
        </div>`,
      )
      .join('')
    this.houseEls = [...this.houseRowEl.querySelectorAll('.hr__house')]
  }

  renderStep(st, { state }) {
    const { nums } = state

    this.houseEls.forEach((h) => {
      h.className = 'hr__house'
      h.querySelector('.hr__dp').textContent = ''
    })

    if (st.excludeIdx != null) {
      const exEl = this.houseEls[st.excludeIdx]
      exEl.classList.add('is-excluded')
      exEl.querySelector('.hr__dp').textContent = '×'
    }

    if (Array.isArray(st.dp) && st.lo != null) {
      st.dp.forEach((v, local) => {
        if (v == null) return
        const origIdx = st.lo + local
        this.houseEls[origIdx].querySelector('.hr__dp').textContent = v
      })
    }

    if (st.final) {
      this.houseEls[st.i]?.classList.add('is-final')
    } else if (typeof st.i === 'number') {
      this.houseEls[st.i]?.classList.add('is-current')
    }
    if (typeof st.src1 === 'number') this.houseEls[st.src1]?.classList.add('is-source')
    if (typeof st.src2 === 'number') this.houseEls[st.src2]?.classList.add('is-source2')

    this.noteEl.textContent =
      st.kind === 'single'
        ? '只有 1 间房，不存在首尾相邻的冲突。'
        : st.excludeIdx != null
          ? `✂ 已断开成一条直线：不偷第 ${st.excludeIdx + 1} 号房，第 1 号与第 ${
              nums.length
            } 号就不会再同时被偷。`
          : `🔗 第 1 号与第 ${nums.length} 号房首尾相邻（围成一圈），不能同时偷。`

    this.phaseEl.textContent =
      st.kind === 'single'
        ? '只有 1 间房，没有首尾相邻的问题'
        : st.activePhase === 'A'
          ? `情形 A：不偷第 ${nums.length} 号房`
          : st.activePhase === 'B'
            ? '情形 B：不偷第 1 号房'
            : '观察：首尾相邻的矛盾'

    if (st.kind === 'single') {
      this.eqEl.innerHTML = `dp[1] = nums[1] = <strong>${nums[0]}</strong>`
    } else if (st.kind === 'base' && st.src1 == null) {
      this.eqEl.innerHTML = `dp[${st.i + 1}] = nums[${st.i + 1}] = <strong>${
        st.dp[st.i - st.lo]
      }</strong>`
    } else if (st.kind === 'base') {
      this.eqEl.innerHTML = `dp[${st.i + 1}] = max(nums[${st.src1 + 1}], nums[${
        st.i + 1
      }]) = max(${nums[st.src1]}, ${nums[st.i]}) = <strong>${st.dp[st.i - st.lo]}</strong>`
    } else if (st.kind === 'trans') {
      const local = st.i - st.lo
      const skipVal = st.dp[local - 1]
      const takeVal = st.dp[local - 2] + nums[st.i]
      this.eqEl.innerHTML = `dp[${st.i + 1}] = max(dp[${st.src1 + 1}], dp[${st.src2 + 1}] + nums[${
        st.i + 1
      }]) = max(${skipVal}, ${takeVal}) = <strong>${st.dp[local]}</strong>`
    } else if (st.kind === 'phase-end') {
      this.eqEl.innerHTML = `情形 ${st.activePhase} 总额 = <strong>${st.total}</strong>`
    } else if (st.kind === 'final') {
      this.eqEl.innerHTML = `max(情形 A = ${st.totalA}, 情形 B = ${st.totalB}) = <strong>${Math.max(
        st.totalA,
        st.totalB,
      )}</strong>`
    } else {
      this.eqEl.innerHTML = ''
    }

    if (this.chipAEl) this.chipAEl.textContent = st.knownA != null ? String(st.knownA) : '?'
    if (this.chipBEl) this.chipBEl.textContent = st.knownB != null ? String(st.knownB) : '?'
    this.chipAWrap?.classList.toggle('is-winner', st.kind === 'final' && st.activePhase === 'A')
    this.chipBWrap?.classList.toggle('is-winner', st.kind === 'final' && st.activePhase === 'B')
  }

  resultBanner(result, state) {
    const { nums } = state
    if (nums.length === 1) {
      return {
        kind: 'success',
        html: `🎉 只有 1 间房，直接偷走 <strong>${result}</strong> 元，没有相邻的烦恼。`,
      }
    }
    const winner = state.totalA >= state.totalB ? 'A（不偷最后一间）' : 'B（不偷第一间）'
    return {
      kind: 'success',
      html: `🎉 房子围成一圈，最多能偷到 <strong>${result}</strong> 元，来自情形 ${winner}。`,
    }
  }
}

export function mountViz(el, opts) {
  return new HouseRobberIIViz(el, opts)
}

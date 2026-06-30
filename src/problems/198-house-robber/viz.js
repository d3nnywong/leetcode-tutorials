/*
 * 打家劫舍「一维 DP」动画。
 *
 *   dp[i] 表示：只考虑下标 0..i 这些房子时，能偷到的最高金额。
 *   偷到第 i 间房子时，最后一步只有两种选择：
 *     - 不偷第 i 间：金额就是 dp[i-1]（前面已经算好的最优解）
 *     - 偷第 i 间：相邻的第 i-1 间就不能动，所以是 dp[i-2] + nums[i]
 *   两者取较大的：
 *     dp[i] = max(dp[i-1], dp[i-2] + nums[i])
 *   边界：dp[0] = nums[0]（只有一间房，没得选）；
 *         dp[1] = max(nums[0], nums[1])（两间相邻，二选一）。
 *
 * 动画把"一间一间往后算"拆成一步一步：当前在算的房子高亮，
 * 它依赖的 dp[i-1]（不偷的方案）与 dp[i-2]（偷的方案）标成来源色；
 * 算到最后一间后，再回溯出真正被偷的那几间房子，用金色标出最终方案。
 */
import { VizPlayer } from '../../components/viz-player/vizPlayer.js'

const MAX_N = 9

// 从「每一步是否选择偷」的记录里回溯出真正被偷的房子下标集合（从后往前推）。
function backtrack(n, choice) {
  const robbed = []
  let i = n - 1
  while (i >= 0) {
    if (i === 0) {
      robbed.push(0)
      break
    }
    if (i === 1) {
      robbed.push(choice[1] ? 1 : 0)
      break
    }
    if (choice[i]) {
      robbed.push(i)
      i -= 2
    } else {
      i -= 1
    }
  }
  return robbed.sort((a, b) => a - b)
}

export class HouseRobberViz extends VizPlayer {
  constructor(mountEl) {
    super(mountEl, {
      inputs: [
        { key: 'nums', label: '每间房的金额 nums（逗号分隔）', default: '2,7,9,3,1', width: '13rem' },
      ],
      speed: 1100,
      hint: `提示：可以改成你自己的金额数组，点「应用」重新演示（最多 ${MAX_N} 间房，原题 1 ≤ nums.length ≤ 100）。`,
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
        const iv = Math.trunc(v)
        if (iv < 0) throw new Error('金额不能是负数')
        return iv
      })
    if (arr.length < 1) throw new Error('至少要有 1 间房子')
    return { nums: arr, display: { nums: arr.join(',') } }
  }

  computeSteps({ nums }) {
    const n = nums.length
    const dp = new Array(n).fill(null)
    const choice = new Array(n).fill(false) // 这一步「最终选择偷」吗
    const steps = []

    dp[0] = nums[0]
    choice[0] = true
    steps.push({
      kind: 'base',
      i: 0,
      dp: [...dp],
      robbedHere: true,
      msg: `只有 0 号房子，没有相邻的房子可比较，直接偷：dp[0] = nums[0] = <strong>${dp[0]}</strong>。`,
    })

    if (n >= 2) {
      const rob1 = nums[1] > nums[0]
      dp[1] = Math.max(nums[0], nums[1])
      choice[1] = rob1
      steps.push({
        kind: 'base',
        i: 1,
        dp: [...dp],
        robbedHere: rob1,
        msg: rob1
          ? `1 号房子和 0 号相邻，二选一：比较 nums[0] = ${nums[0]} 与 nums[1] = ${nums[1]}，偷 1 号更多：dp[1] = <strong>${dp[1]}</strong>。`
          : `1 号房子和 0 号相邻，二选一：比较 nums[0] = ${nums[0]} 与 nums[1] = ${nums[1]}，偷 0 号更划算（或相等）：dp[1] 维持 <strong>${dp[1]}</strong>。`,
      })
    }

    for (let i = 2; i < n; i++) {
      const skipValue = dp[i - 1]
      const robValue = dp[i - 2] + nums[i]
      const willRob = robValue > skipValue
      dp[i] = Math.max(skipValue, robValue)
      choice[i] = willRob
      steps.push({
        kind: 'trans',
        i,
        src1: i - 1,
        src2: i - 2,
        skipValue,
        robValue,
        dp: [...dp],
        robbedHere: willRob,
        msg: willRob
          ? `${i} 号房子：不偷的话维持 dp[${i - 1}] = ${skipValue}；偷的话 ${i - 1} 号不能动，是 dp[${i - 2}] + nums[${i}] = ${dp[i - 2]} + ${nums[i]} = ${robValue}。${robValue} &gt; ${skipValue}，偷它更划算：dp[${i}] = <strong>${dp[i]}</strong>。`
          : `${i} 号房子：不偷的话维持 dp[${i - 1}] = ${skipValue}；偷的话 ${i - 1} 号不能动，是 dp[${i - 2}] + nums[${i}] = ${dp[i - 2]} + ${nums[i]} = ${robValue}。${skipValue} &ge; ${robValue}，不偷更划算：dp[${i}] = <strong>${dp[i]}</strong>。`,
      })
    }

    const robbedSet = backtrack(n, choice)
    if (steps.length) {
      steps[steps.length - 1].final = true
      steps[steps.length - 1].robbedSet = robbedSet
    }

    return { steps, result: { amount: dp[n - 1], robbed: robbedSet } }
  }

  buildStage({ nums }, el) {
    el.innerHTML = `
      <div class="hr__target">这条街有 <strong>${nums.length}</strong> 间房子，金额：<code>${nums.join(', ')}</code></div>
      <div class="hr__street"></div>
      <div class="hr__eq"></div>
    `
    this.streetEl = el.querySelector('.hr__street')
    this.eqEl = el.querySelector('.hr__eq')

    this.streetEl.innerHTML = nums
      .map(
        (v, i) => `
        <div class="hr__house" data-i="${i}">
          <span class="hr__dp">?</span>
          <span class="hr__roof">🏠</span>
          <span class="hr__money">¥${v}</span>
          <span class="hr__idx">${i}</span>
        </div>`,
      )
      .join('')
    this.houseEls = [...this.streetEl.querySelectorAll('.hr__house')]
  }

  renderStep(st) {
    this.houseEls.forEach((el) => {
      el.className = 'hr__house'
      const i = Number(el.dataset.i)
      const dpEl = el.querySelector('.hr__dp')
      const v = st.dp[i]
      dpEl.textContent = v != null ? String(v) : '?'
    })

    const cur = this.houseEls[st.i]
    cur?.classList.add('is-current')
    if (st.kind === 'trans') {
      this.houseEls[st.src1]?.classList.add('is-source')
      this.houseEls[st.src2]?.classList.add('is-source2')
    }

    if (st.final && st.robbedSet) {
      st.robbedSet.forEach((idx) => this.houseEls[idx]?.classList.add('is-robbed'))
    }

    this.eqEl.innerHTML =
      st.kind === 'base'
        ? `<code>dp[${st.i}]</code> = <strong>${st.dp[st.i]}</strong>（${
            st.robbedHere ? '偷它' : '不偷它'
          }，边界条件）`
        : `<code>dp[${st.i}]</code> = max(dp[${st.src1}], dp[${st.src2}] + nums[${st.i}]) = max(${st.skipValue}, ${st.robValue}) = <strong>${st.dp[st.i]}</strong>`
  }

  resultBanner(result, state) {
    const { amount, robbed } = result
    const detail = robbed.map((i) => `${i} 号(¥${state.nums[i]})`).join(' + ')
    return {
      kind: 'success',
      html: `🎉 不触动警报的情况下，最多能偷到 <strong>${amount}</strong> 元！具体方案：偷 ${detail} = <strong>${amount}</strong>。`,
    }
  }
}

export function mountViz(el, opts) {
  return new HouseRobberViz(el, opts)
}

/*
 * 两数之和「哈希表一遍扫描」动画。
 *
 * 一边从左往右扫数组，一边把见过的「值 → 下标」记进哈希表。
 * 到 nums[i] 时先算出还差多少：need = target - nums[i]，
 * 去哈希表里查 need 在不在；在 → 找到答案；不在 → 把 nums[i] 自己记进表里继续。
 * 关键就是：用哈希表把「查找另一半」从 O(n) 降到 O(1)，整体 O(n)。
 */
import { VizPlayer } from '../../components/viz-player/vizPlayer.js'

const MAX_N = 10

export class TwoSumViz extends VizPlayer {
  constructor(mountEl) {
    super(mountEl, {
      inputs: [
        { key: 'nums', label: '数组 nums（逗号分隔）', default: '2,7,11,15', width: '13rem' },
        { key: 'target', label: 'target', default: '9', width: '5rem' },
      ],
      speed: 1100,
      hint: `提示：可改成你自己的数组和 target，点「应用」重新演示（最多 ${MAX_N} 个数）。`,
    })
  }

  parseInputs({ nums, target }) {
    const arr = (nums ?? '')
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s !== '')
      .slice(0, MAX_N)
      .map((s) => {
        const v = Number(s)
        if (!Number.isFinite(v)) throw new Error(`「${s}」不是合法数字`)
        return Math.trunc(v)
      })
    if (arr.length < 2) throw new Error('至少要有 2 个数')
    const t = Math.trunc(Number(target))
    if (!Number.isFinite(t)) throw new Error('target 不是合法数字')
    return { nums: arr, target: t, display: { nums: arr.join(','), target: String(t) } }
  }

  computeSteps({ nums, target }) {
    const steps = []
    const map = new Map()
    let result = null
    for (let i = 0; i < nums.length; i++) {
      const x = nums[i]
      const need = target - x
      const found = map.has(need)
      steps.push({
        kind: 'look',
        i,
        need,
        found,
        j: found ? map.get(need) : null,
        map: [...map.entries()],
        msg: found
          ? `看 nums[${i}] = ${x}，还差 need = ${target} − ${x} = <strong>${need}</strong>。哈希表里有 ${need}（在下标 ${map.get(
              need,
            )}）→ 配对成功！`
          : `看 nums[${i}] = ${x}，还差 need = ${target} − ${x} = <strong>${need}</strong>。哈希表里没有 ${need}，把 ${x} 记进表里继续。`,
      })
      if (found) {
        result = [map.get(need), i]
        break
      }
      map.set(x, i)
      steps[steps.length - 1].mapAfter = [...map.entries()]
    }
    if (!result && steps.length) steps[steps.length - 1].exhausted = true
    return { steps, result }
  }

  buildStage({ nums }, el) {
    el.innerHTML = `
      <div class="ts__target"></div>
      <div class="ts__nums"></div>
      <div class="ts__maplabel">哈希表（值 → 下标）</div>
      <div class="ts__map"></div>
    `
    this.numsEl = el.querySelector('.ts__nums')
    this.mapEl = el.querySelector('.ts__map')
    this.targetEl = el.querySelector('.ts__target')
    this.numsEl.innerHTML = nums
      .map(
        (v, i) =>
          `<span class="ts__cell" data-i="${i}"><b class="ts__val">${v}</b><span class="ts__idx">${i}</span></span>`,
      )
      .join('')
    this.cellEls = [...this.numsEl.querySelectorAll('.ts__cell')]
  }

  renderStep(st, { state }) {
    this.targetEl.innerHTML = `目标 target = <strong>${state.target}</strong>`
    this.cellEls.forEach((c) => (c.className = 'ts__cell'))
    // 哈希表里已有的（用本步开始时的快照）
    const entries = st.map ?? []
    const inMap = new Set(entries.map(([, idx]) => idx))
    inMap.forEach((idx) => this.cellEls[idx]?.classList.add('is-stored'))
    // 当前元素
    if (typeof st.i === 'number') this.cellEls[st.i]?.classList.add('is-current')
    // 命中的配对来源
    if (st.found && st.j != null) this.cellEls[st.j]?.classList.add('is-match')

    // 哈希表区：命中步显示查询的 need，存入步显示存入后的表
    const showEntries = st.found ? entries : st.mapAfter ?? entries
    this.mapEl.innerHTML =
      showEntries.length === 0
        ? `<span class="ts__empty">（空）</span>`
        : showEntries
            .map(
              ([val, idx]) =>
                `<code class="ts__chip${
                  st.found && val === st.need ? ' is-hit' : ''
                }">${val} → ${idx}</code>`,
            )
            .join('')
  }

  resultBanner(result, state) {
    if (result) {
      const [a, b] = result
      return {
        kind: 'success',
        html: `🎉 找到啦！<code>nums[${a}] + nums[${b}] = ${state.nums[a]} + ${state.nums[b]} = ${state.target}</code> → 返回 <strong>[${a}, ${b}]</strong>。`,
      }
    }
    return {
      kind: 'fail',
      html: `🚫 扫完整个数组也没有两个数之和等于 <strong>${state.target}</strong>（自定义输入可能无解；原题保证有唯一解）。`,
    }
  }
}

export function mountTwoSum(el, opts) {
  return new TwoSumViz(el, opts)
}

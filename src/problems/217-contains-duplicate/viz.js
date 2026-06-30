/*
 * 存在重复元素「哈希表一遍扫描」动画。
 *
 * 从左往右扫数组，一边把见过的数记进哈希表（值 → 第一次出现的下标）。
 * 扫到 nums[i] 时先查表：这个数有没有出现过？
 * 出现过 → 立刻返回 true（不用扫完整个数组）；没出现过 → 把它记进表里继续。
 * 扫完整个数组都没撞上 → 说明所有元素互不相同，返回 false。
 * 核心同样是用哈希表把「之前是否见过」从 O(n) 查找降到 O(1)，整体 O(n)。
 */
import { VizPlayer } from '../../components/viz-player/vizPlayer.js'

const MAX_N = 12

export class ContainsDuplicateViz extends VizPlayer {
  constructor(mountEl) {
    super(mountEl, {
      inputs: [{ key: 'nums', label: '数组 nums（逗号分隔）', default: '1,2,3,1', width: '15rem' }],
      speed: 1000,
      hint: `提示：可改成你自己的数组，点「应用」重新演示（最多 ${MAX_N} 个数）。`,
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
        return Math.trunc(v)
      })
    if (arr.length < 1) throw new Error('至少要有 1 个数')
    return { nums: arr, display: { nums: arr.join(',') } }
  }

  computeSteps({ nums }) {
    const steps = []
    const seen = new Map() // 值 -> 第一次出现的下标
    let found = false
    let pair = null
    for (let i = 0; i < nums.length; i++) {
      const x = nums[i]
      const dup = seen.has(x)
      steps.push({
        i,
        val: x,
        dup,
        matchIdx: dup ? seen.get(x) : null,
        seenBefore: [...seen.entries()],
        msg: dup
          ? `看 nums[${i}] = ${x}，哈希表里已经有 ${x}（第一次出现在下标 ${seen.get(
              x,
            )}）→ 撞上了，直接返回 <strong>true</strong>！`
          : `看 nums[${i}] = ${x}，哈希表里没有 ${x}，把它记进去继续往后扫。`,
      })
      if (dup) {
        found = true
        pair = [seen.get(x), i]
        break
      }
      seen.set(x, i)
      steps[steps.length - 1].seenAfter = [...seen.entries()]
    }
    if (!found && steps.length) steps[steps.length - 1].exhausted = true
    return { steps, result: { found, pair } }
  }

  buildStage({ nums }, el) {
    el.innerHTML = `
      <div class="cd__nums"></div>
      <div class="cd__setlabel">哈希表（已经见过的数）</div>
      <div class="cd__set"></div>
    `
    this.numsEl = el.querySelector('.cd__nums')
    this.setEl = el.querySelector('.cd__set')
    this.numsEl.innerHTML = nums
      .map(
        (v, i) =>
          `<span class="cd__cell" data-i="${i}"><b class="cd__val">${v}</b><span class="cd__idx">${i}</span></span>`,
      )
      .join('')
    this.cellEls = [...this.numsEl.querySelectorAll('.cd__cell')]
  }

  renderStep(st) {
    this.cellEls.forEach((c) => (c.className = 'cd__cell'))
    // 哈希表里已有的（用本步开始时的快照）
    const entries = st.seenBefore ?? []
    const inSet = new Set(entries.map(([, idx]) => idx))
    inSet.forEach((idx) => this.cellEls[idx]?.classList.add('is-stored'))
    // 当前元素
    if (typeof st.i === 'number') this.cellEls[st.i]?.classList.add('is-current')
    // 撞上的那个「第一次出现」的下标
    if (st.dup && st.matchIdx != null) this.cellEls[st.matchIdx]?.classList.add('is-match')

    // 哈希表区：撞上步显示撞上前的表，存入步显示存入后的表
    const showEntries = st.dup ? entries : st.seenAfter ?? entries
    this.setEl.innerHTML =
      showEntries.length === 0
        ? `<span class="cd__empty">（空）</span>`
        : showEntries
            .map(
              ([val]) =>
                `<code class="cd__chip${st.dup && val === st.val ? ' is-hit' : ''}">${val}</code>`,
            )
            .join('')
  }

  resultBanner(result, state) {
    if (result.found) {
      const [a, b] = result.pair
      return {
        kind: 'success',
        html: `🎉 发现重复！<code>nums[${a}] = nums[${b}] = ${state.nums[a]}</code> → 返回 <strong>true</strong>。`,
      }
    }
    return {
      kind: 'info',
      html: `✅ 扫完整个数组，没有任何数字重复 → 返回 <strong>false</strong>。`,
    }
  }
}

export function mountViz(el, opts) {
  return new ContainsDuplicateViz(el, opts)
}

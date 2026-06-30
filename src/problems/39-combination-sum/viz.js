/*
 * 组合总和「回溯 + 剪枝」动画。
 *
 * 候选数组先从小到大排序。从下标 start 开始逐个尝试：
 *   - 选了 candidates[i] 之后，剩余目标 remain 减去它；
 *     remain 减到 0 → 这是一组合法组合；remain 还大于 0 → 继续往下选
 *     （下标仍可以从 i 开始，因为同一个数允许重复使用）。
 *   - 因为数组已排序，一旦 candidates[i] 比 remain 还大，后面的数只会更大，
 *     不可能再凑出 remain —— 直接跳出这一层循环（剪枝），不用一个个去试。
 *   - 试完一个分支就要「回溯」：把刚选的数从路径里拿掉，换下一个候选再试。
 */
import { VizPlayer } from '../../components/viz-player/vizPlayer.js'

const MAX_N = 5
const MIN_VAL = 2
const MAX_VAL = 18
const MAX_TARGET = 12

export class CombinationSumViz extends VizPlayer {
  constructor(mountEl) {
    super(mountEl, {
      inputs: [
        {
          key: 'candidates',
          label: `候选数 candidates（逗号分隔，最多 ${MAX_N} 个，${MIN_VAL}~${MAX_VAL}）`,
          default: '2,3,6,7',
          width: '13rem',
        },
        { key: 'target', label: `target（≤ ${MAX_TARGET}）`, default: '7', width: '5rem' },
      ],
      speed: 850,
      hint: `提示：为了演示清晰，这里把规模缩小到最多 ${MAX_N} 个候选数、target ≤ ${MAX_TARGET}（原题允许更大规模，思路完全一样）。`,
    })
  }

  parseInputs({ candidates, target }) {
    const seen = new Set()
    const arr = (candidates ?? '')
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s !== '')
      .map((s) => {
        const v = Number(s)
        if (!Number.isInteger(v)) throw new Error(`「${s}」不是合法整数`)
        return v
      })
      .filter((v) => {
        if (v < MIN_VAL || v > MAX_VAL) return false
        if (seen.has(v)) return false
        seen.add(v)
        return true
      })
      .sort((a, b) => a - b)
      .slice(0, MAX_N)

    if (arr.length === 0) {
      throw new Error(`候选数组里至少要有 1 个 ${MIN_VAL}~${MAX_VAL} 之间的不重复整数`)
    }

    const t = Math.trunc(Number(target))
    if (!Number.isFinite(t)) throw new Error('target 不是合法数字')
    if (t < 1 || t > MAX_TARGET) throw new Error(`target 请控制在 1~${MAX_TARGET} 之间，方便演示`)

    return {
      candidates: arr,
      target: t,
      display: { candidates: arr.join(','), target: String(t) },
    }
  }

  computeSteps({ candidates, target }) {
    const steps = []
    const path = []
    const results = []
    const n = candidates.length
    const fmtPath = (p) => (p.length ? p.join(' + ') : '（空）')

    function rec(start, remain) {
      for (let i = start; i < n; i++) {
        const c = candidates[i]
        if (c > remain) {
          steps.push({
            kind: 'prune',
            i,
            start,
            remain,
            path: [...path],
            results: [...results],
            msg: `候选数组已经从小到大排好序：<code>candidates[${i}] = ${c}</code> 已经比剩下要凑的
                  <code>remain = ${remain}</code> 还大，它和它后面的数就更不可能凑出 remain 了 ——
                  直接<strong>剪枝</strong>，跳出这一层循环，不用一个个再试。`,
          })
          break
        }
        path.push(c)
        const newRemain = remain - c
        const success = newRemain === 0
        steps.push({
          kind: 'push',
          i,
          start,
          remain: newRemain,
          path: [...path],
          success,
          results: [...results],
          msg: success
            ? `选 <code>candidates[${i}] = ${c}</code>，剩余 remain 正好减到 <strong>0</strong>
               → 路径 <strong>[${fmtPath(path)}]</strong> 是一组合法组合！`
            : `选 <code>candidates[${i}] = ${c}</code>（同一个数允许重复选），
               剩余 remain = ${remain} − ${c} = <strong>${newRemain}</strong>，继续往下选
               （下标仍可以从 ${i} 开始，因为可以重复选自己）。`,
        })
        if (success) {
          results.push([...path])
          steps[steps.length - 1].results = [...results]
        } else {
          rec(i, newRemain)
        }
        path.pop()
        steps.push({
          kind: 'pop',
          i,
          start,
          remain,
          path: [...path],
          results: [...results],
          msg: `回溯：把 <code>${c}</code> 从路径里拿掉，撤销刚才的选择，回到 remain = ${remain}，
                继续尝试下标 ${i} 的下一个候选。`,
        })
      }
    }

    rec(0, target)

    if (steps.length === 0) {
      steps.push({
        kind: 'none',
        i: null,
        start: 0,
        remain: target,
        path: [],
        results: [],
        msg: '没有可用的候选数。',
      })
    }

    return { steps, result: results }
  }

  buildStage({ candidates }, el) {
    el.innerHTML = `
      <div class="cs__target"></div>
      <div class="cs__cands"></div>
      <div class="cs__pathlabel">当前路径（已选的数，按选择顺序排列）</div>
      <div class="cs__path"></div>
      <div class="cs__resultslabel">已找到的合法组合</div>
      <div class="cs__results"></div>
    `
    this.targetEl = el.querySelector('.cs__target')
    this.candsEl = el.querySelector('.cs__cands')
    this.pathEl = el.querySelector('.cs__path')
    this.resultsEl = el.querySelector('.cs__results')

    this.candsEl.innerHTML = candidates
      .map(
        (v, i) =>
          `<span class="cs__cand" data-i="${i}"><b class="cs__cand-val">${v}</b><span class="cs__cand-idx">${i}</span></span>`,
      )
      .join('')
    this.candEls = [...this.candsEl.querySelectorAll('.cs__cand')]
  }

  renderStep(st, { state }) {
    const remainCls = st.remain === 0 ? ' is-zero' : ''
    this.targetEl.innerHTML = `目标 target = <strong>${state.target}</strong>　&nbsp;
      剩余 remain = <strong class="cs__remain${remainCls}">${st.remain}</strong>`

    this.candEls.forEach((c, i) => {
      c.className = 'cs__cand'
      if (i < st.start) c.classList.add('is-locked')
    })
    if (typeof st.i === 'number') {
      let cls = 'is-current'
      if (st.kind === 'prune') cls = 'is-prune'
      else if (st.kind === 'pop') cls = 'is-popped'
      else if (st.kind === 'push' && st.success) cls = 'is-success'
      this.candEls[st.i]?.classList.add(cls)
    }

    this.pathEl.innerHTML = st.path.length
      ? st.path
          .map((v, idx) => {
            const isTop = idx === st.path.length - 1
            const top = st.kind === 'push' && isTop ? (st.success ? ' is-success' : ' is-current') : ''
            return `<span class="cs__path-cell${top}">${v}</span>`
          })
          .join('')
      : `<span class="cs__empty">（空，还没选任何数）</span>`

    const results = st.results ?? []
    this.resultsEl.innerHTML = results.length
      ? results
          .map(
            (combo, idx) =>
              `<code class="cs__chip${
                idx === results.length - 1 && st.kind === 'push' && st.success ? ' is-new' : ''
              }">[${combo.join(', ')}]</code>`,
          )
          .join('')
      : `<span class="cs__empty">（暂无）</span>`
  }

  resultBanner(result, state) {
    if (!result || result.length === 0) {
      return {
        kind: 'fail',
        html: `🚫 没有任何组合的和恰好等于 <strong>${state.target}</strong>（自定义输入可能无解）。`,
      }
    }
    return {
      kind: 'success',
      html: `🎉 一共找到 <strong>${result.length}</strong> 组合法组合：${result
        .map((c) => `<code>[${c.join(', ')}]</code>`)
        .join(' ')}`,
    }
  }
}

export function mountViz(el, opts) {
  return new CombinationSumViz(el, opts)
}

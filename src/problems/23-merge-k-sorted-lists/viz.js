/*
 * 合并 K 个升序链表「小顶堆」动画。
 *
 * k 个链表已经各自有序，每个链表当前能拿出来的最小值，就是它「最前面那个还没用掉的节点」。
 * 把这 k 个候选节点都放进一个小顶堆，每次从堆顶弹出全局最小的那个，接到结果链表末尾；
 * 它所在的链表往前走一格，如果还有下一个节点，就把新的候选节点放回堆里继续。
 * 堆每次弹出/插入是 O(log k)，一共要弹 n 个节点（n 是所有节点总数），整体 O(n log k)。
 */
import { VizPlayer } from '../../components/viz-player/vizPlayer.js'

const MAX_LISTS = 6
const MAX_NODES_PER_LIST = 6
const MAX_TOTAL_NODES = 14

export class MergeKListsViz extends VizPlayer {
  constructor(mountEl) {
    super(mountEl, {
      inputs: [{ key: 'lists', label: '链表数组（用 | 分隔各链表，逗号分隔节点）', default: '1,4,5|1,3,4|2,6', width: '20rem' }],
      speed: 950,
      hint: `提示：每个链表内必须是升序，可以留空表示空链表（比如 1,4,5|）。最多 ${MAX_LISTS} 条链表，每条最多 ${MAX_NODES_PER_LIST} 个节点。`,
    })
  }

  parseInputs({ lists }) {
    const raw = (lists ?? '').trim()
    const parts = raw === '' ? [] : raw.split('|')
    if (parts.length > MAX_LISTS) throw new Error(`最多支持 ${MAX_LISTS} 条链表`)
    const arr = parts.map((part, li) => {
      const vals = part
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s !== '')
        .slice(0, MAX_NODES_PER_LIST)
        .map((s) => {
          const v = Number(s)
          if (!Number.isFinite(v)) throw new Error(`链表 ${li + 1} 里的「${s}」不是合法数字`)
          return Math.trunc(v)
        })
      for (let i = 1; i < vals.length; i++) {
        if (vals[i] < vals[i - 1]) throw new Error(`链表 ${li + 1} 必须是升序排列（${vals.join(',')} 不满足）`)
      }
      return vals
    })
    const total = arr.reduce((s, a) => s + a.length, 0)
    if (total > MAX_TOTAL_NODES) throw new Error(`节点总数最多 ${MAX_TOTAL_NODES} 个`)
    return {
      lists: arr,
      display: { lists: arr.map((a) => a.join(',')).join('|') },
    }
  }

  computeSteps({ lists }) {
    const steps = []
    const k = lists.length
    const ptr = new Array(k).fill(0)
    const merged = []

    const heapEntries = () => {
      const out = []
      for (let li = 0; li < k; li++) {
        if (ptr[li] < lists[li].length) out.push({ list: li, idx: ptr[li], val: lists[li][ptr[li]] })
      }
      return out
    }

    if (k === 0) {
      steps.push({ kind: 'init', heap: [], merged: [], msg: '链表数组为空（k = 0），合并结果也是空链表。' })
      return { steps, result: [] }
    }

    steps.push({
      kind: 'init',
      heap: heapEntries(),
      merged: [...merged],
      msg: `把每个链表当前的头节点放进小顶堆。一共 ${k} 条链表，堆里有 ${heapEntries().length} 个候选节点。`,
    })

    while (true) {
      const entries = heapEntries()
      if (entries.length === 0) break
      let min = entries[0]
      for (const e of entries) if (e.val < min.val) min = e
      const tie = entries.filter((e) => e.val === min.val).length > 1

      steps.push({
        kind: 'peek',
        heap: entries,
        min,
        merged: [...merged],
        msg: `堆顶是最小值 <strong>${min.val}</strong>（来自链表 ${min.list + 1}）${
          tie ? '，和其他候选并列最小，取其中一个' : ''
        }。`,
      })

      merged.push(min.val)
      ptr[min.list]++
      const hasNext = ptr[min.list] < lists[min.list].length
      const next = hasNext ? { list: min.list, idx: ptr[min.list], val: lists[min.list][ptr[min.list]] } : null

      steps.push({
        kind: 'pop',
        popped: min,
        next,
        merged: [...merged],
        heapAfter: heapEntries(),
        msg: `弹出 ${min.val}，接到结果链表末尾。${
          next
            ? `链表 ${min.list + 1} 的下一个节点 <strong>${next.val}</strong> 顶替它入堆。`
            : `链表 ${min.list + 1} 已经空了，不再补充候选。`
        }`,
      })
    }

    steps.push({
      kind: 'done',
      merged: [...merged],
      msg: `堆空了，所有节点都已合并。结果链表：<strong>${merged.join(' → ')}</strong>。`,
    })

    return { steps, result: merged }
  }

  buildStage({ lists }, el) {
    const k = lists.length
    el.innerHTML = `
      <div class="mkl__lists"></div>
      <div class="mkl__heap">
        <div class="mkl__panel-title">小顶堆（各链表当前候选节点）</div>
        <div class="mkl__heap-chips"></div>
      </div>
      <div class="mkl__merged">
        <div class="mkl__panel-title">合并结果链表</div>
        <div class="mkl__merged-nodes"></div>
      </div>
    `
    this.listsEl = el.querySelector('.mkl__lists')
    this.heapChipsEl = el.querySelector('.mkl__heap-chips')
    this.mergedEl = el.querySelector('.mkl__merged-nodes')

    if (k === 0) {
      this.listsEl.innerHTML = `<p class="mkl__empty">（链表数组为空）</p>`
      this.nodeEls = []
      return
    }

    this.listsEl.innerHTML = lists
      .map((nodes, li) => {
        const nodesHtml =
          nodes.length === 0
            ? `<span class="mkl__null">null（空链表）</span>`
            : nodes
                .map(
                  (v, ni) =>
                    `<span class="mkl__node" data-list="${li}" data-idx="${ni}"><b>${v}</b></span>${
                      ni < nodes.length - 1 ? `<span class="mkl__arrow">→</span>` : `<span class="mkl__arrow">→</span><span class="mkl__null">null</span>`
                    }`,
                )
                .join('')
        return `<div class="mkl__list-row"><span class="mkl__list-label">链表 ${li + 1}</span><div class="mkl__nodes">${nodesHtml}</div></div>`
      })
      .join('')
    this.nodeEls = [...this.listsEl.querySelectorAll('.mkl__node')]
  }

  renderStep(st, { state }) {
    // 重置所有节点状态
    this.nodeEls.forEach((n) => n.classList.remove('is-consumed', 'is-candidate', 'is-min'))

    // 已经被合并走的节点：标灰。从 heap/heapAfter 推断每条链表已消耗的节点数
    // （堆候选指向的下标之前的节点都已被消耗；链表已空则全部消耗）
    const consumedCount = new Array(state.lists.length).fill(0)
    for (let li = 0; li < state.lists.length; li++) {
      // 该链表里，堆候选指向的下标之前的节点都已消耗
      let aheadIdx = state.lists[li].length // 默认全部消耗（链表已空）
      const heapNow = st.kind === 'pop' ? st.heapAfter : st.heap
      const found = (heapNow ?? []).find((e) => e.list === li)
      if (found) aheadIdx = found.idx
      consumedCount[li] = aheadIdx
    }
    consumedCount.forEach((cnt, li) => {
      for (let i = 0; i < cnt; i++) {
        this.listsEl.querySelector(`.mkl__node[data-list="${li}"][data-idx="${i}"]`)?.classList.add('is-consumed')
      }
    })

    // 当前堆候选：高亮为候选；其中最小的高亮为 is-min
    const heapShown = st.kind === 'pop' ? st.heapAfter : st.heap
    ;(heapShown ?? []).forEach((e) => {
      this.listsEl.querySelector(`.mkl__node[data-list="${e.list}"][data-idx="${e.idx}"]`)?.classList.add('is-candidate')
    })
    if (st.kind === 'peek' && st.min) {
      this.listsEl.querySelector(`.mkl__node[data-list="${st.min.list}"][data-idx="${st.min.idx}"]`)?.classList.add('is-min')
    }
    if (st.kind === 'pop' && st.popped) {
      this.listsEl.querySelector(`.mkl__node[data-list="${st.popped.list}"][data-idx="${st.popped.idx}"]`)?.classList.add('is-consumed')
    }

    // 堆面板
    const heapEntries = st.kind === 'pop' ? st.heapAfter : st.heap ?? []
    const minVal = st.kind === 'peek' && st.min ? st.min.val : null
    this.heapChipsEl.innerHTML = heapEntries.length
      ? heapEntries
          .slice()
          .sort((a, b) => a.val - b.val)
          .map(
            (e) =>
              `<span class="mkl__chip${e.val === minVal ? ' is-min' : ''}">${e.val}<small>链表${e.list + 1}</small></span>`,
          )
          .join('')
      : `<span class="mkl__empty">（空）</span>`

    // 合并结果面板
    const merged = st.merged ?? []
    this.mergedEl.innerHTML = merged.length
      ? merged
          .map(
            (v, i) =>
              `<span class="mkl__node mkl__node--merged">${v}</span>${
                i < merged.length - 1 ? `<span class="mkl__arrow">→</span>` : ''
              }`,
          )
          .join('') + `<span class="mkl__arrow">→</span><span class="mkl__null">null</span>`
      : `<span class="mkl__empty">（还没有节点）</span>`
  }

  resultBanner(result) {
    if (!result || result.length === 0) {
      return { kind: 'info', html: '🪹 合并结果是空链表（输入的链表数组本身为空，或所有链表都是空的）。' }
    }
    return {
      kind: 'success',
      html: `🎉 合并完成！结果链表：<code>${result.join(' → ')} → null</code>，一共 ${result.length} 个节点。`,
    }
  }
}

export function mountViz(el, opts) {
  return new MergeKListsViz(el, opts)
}

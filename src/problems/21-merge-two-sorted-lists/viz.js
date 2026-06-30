/*
 * 合并两个有序链表「双指针 + 哨兵节点」动画。
 *
 * 两个链表都已经从小到大排好序。用两个指针 p1、p2 分别指向 list1、list2
 * 当前还没接走的节点，每一步比较 p1、p2 指向的值，把更小的那个接到结果链表
 * 末尾，再把对应指针后移一步。哪个链表先走到 NULL，就把另一个链表剩下的
 * 整段直接接上去——因为它本来就是有序的，不用再比较。
 */
import { VizPlayer } from '../../components/viz-player/vizPlayer.js'

const MAX_N = 12

function isNonDecreasing(arr) {
  return arr.every((v, i) => i === 0 || arr[i - 1] <= v)
}

export class MergeTwoListsViz extends VizPlayer {
  constructor(mountEl) {
    super(mountEl, {
      inputs: [
        { key: 'l1', label: 'list1（逗号分隔，升序）', default: '1,2,4', width: '12rem' },
        { key: 'l2', label: 'list2（逗号分隔，升序）', default: '1,3,4', width: '12rem' },
      ],
      speed: 1100,
      hint: `提示：两个数组都要保持从小到大排列（最多 ${MAX_N} 个数），点「应用」重新演示。留空表示空链表。`,
    })
  }

  parseInputs({ l1, l2 }) {
    const parseArr = (raw, name) => {
      const trimmed = (raw ?? '').trim()
      if (trimmed === '') return []
      return trimmed
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s !== '')
        .slice(0, MAX_N)
        .map((s) => {
          const v = Number(s)
          if (!Number.isFinite(v)) throw new Error(`${name} 里的「${s}」不是合法数字`)
          return Math.trunc(v)
        })
    }
    const a = parseArr(l1, 'list1')
    const b = parseArr(l2, 'list2')
    if (!isNonDecreasing(a) || !isNonDecreasing(b)) {
      throw new Error('list1 和 list2 都必须是非递减（从小到大）顺序，这是合并算法成立的前提')
    }
    return { l1: a, l2: b, display: { l1: a.join(','), l2: b.join(',') } }
  }

  computeSteps({ l1, l2 }) {
    const steps = []
    const merged = []

    if (l1.length === 0 && l2.length === 0) {
      steps.push({
        atI: 0,
        atJ: 0,
        picked: null,
        merged: [],
        msg: 'list1 和 list2 都是空链表，合并结果还是空链表 NULL。',
      })
      return { steps, result: [] }
    }

    steps.push({
      atI: 0,
      atJ: 0,
      picked: null,
      merged: [],
      msg: `准备合并：指针 <strong>p1</strong> 指向 list1 的第一个节点，<strong>p2</strong> 指向
        list2 的第一个节点；再建一个空的结果链表。接下来每一步比较 p1、p2 指向的值，
        把较小的那个接到结果链表末尾。`,
    })

    let i = 0
    let j = 0
    while (i < l1.length && j < l2.length) {
      const atI = i
      const atJ = j
      const a = l1[i]
      const b = l2[j]
      let picked
      let val
      if (a <= b) {
        picked = 'l1'
        val = a
        i++
      } else {
        picked = 'l2'
        val = b
        j++
      }
      merged.push(val)
      steps.push({
        atI,
        atJ,
        picked,
        merged: [...merged],
        msg:
          picked === 'l1'
            ? `比较 p1 = <strong>${a}</strong> 和 p2 = <strong>${b}</strong>：${a} ≤ ${b}，
               接上 list1 的 ${a}，p1 后移一步。`
            : `比较 p1 = <strong>${a}</strong> 和 p2 = <strong>${b}</strong>：${b} &lt; ${a}，
               接上 list2 的 ${b}，p2 后移一步。`,
      })
    }
    while (i < l1.length) {
      const atI = i
      const atJ = j
      const val = l1[i]
      i++
      merged.push(val)
      steps.push({
        atI,
        atJ,
        picked: 'l1',
        merged: [...merged],
        msg: `list2 已经全部接完了（p2 到达 NULL），剩下的 list1 本身就是有序的，
          直接把节点 <strong>${val}</strong> 接到结果末尾，p1 后移一步。`,
      })
    }
    while (j < l2.length) {
      const atI = i
      const atJ = j
      const val = l2[j]
      j++
      merged.push(val)
      steps.push({
        atI,
        atJ,
        picked: 'l2',
        merged: [...merged],
        msg: `list1 已经全部接完了（p1 到达 NULL），剩下的 list2 本身就是有序的，
          直接把节点 <strong>${val}</strong> 接到结果末尾，p2 后移一步。`,
      })
    }
    return { steps, result: merged }
  }

  _chainHtml(arr, newIdx = -1) {
    if (!arr.length) return `<span class="ml__node ml__node--null">NULL</span>`
    let html = ''
    arr.forEach((v, idx) => {
      html += `<span class="ml__node${idx === newIdx ? ' is-new' : ''}" data-i="${idx}"><b class="ml__val">${v}</b></span><span class="ml__arrow">→</span>`
    })
    html += `<span class="ml__node ml__node--null">NULL</span>`
    return html
  }

  buildStage({ l1, l2 }, el) {
    el.innerHTML = `
      <div class="ml__row">
        <span class="ml__rowlabel">list1</span>
        <div class="ml__chain ml__chain--l1"></div>
      </div>
      <div class="ml__row">
        <span class="ml__rowlabel">list2</span>
        <div class="ml__chain ml__chain--l2"></div>
      </div>
      <div class="ml__row ml__row--merged">
        <span class="ml__rowlabel">合并结果</span>
        <div class="ml__chain ml__chain--merged"></div>
      </div>
    `
    this.chain1El = el.querySelector('.ml__chain--l1')
    this.chain2El = el.querySelector('.ml__chain--l2')
    this.chainMEl = el.querySelector('.ml__chain--merged')
    this.chain1El.innerHTML = this._chainHtml(l1)
    this.chain2El.innerHTML = this._chainHtml(l2)
    this.nodes1 = [...this.chain1El.querySelectorAll('.ml__node[data-i]')]
    this.nodes2 = [...this.chain2El.querySelectorAll('.ml__node[data-i]')]
    this.null1El = this.chain1El.querySelector('.ml__node--null')
    this.null2El = this.chain2El.querySelector('.ml__node--null')
  }

  renderStep(st, { state }) {
    const { l1, l2 } = state

    this.nodes1.forEach((n) => n.classList.remove('is-p1', 'is-win'))
    this.null1El?.classList.remove('is-p1')
    this.nodes2.forEach((n) => n.classList.remove('is-p2', 'is-win'))
    this.null2El?.classList.remove('is-p2')

    if (st.atI < l1.length) this.nodes1[st.atI]?.classList.add('is-p1')
    else this.null1El?.classList.add('is-p1')

    if (st.atJ < l2.length) this.nodes2[st.atJ]?.classList.add('is-p2')
    else this.null2El?.classList.add('is-p2')

    if (st.picked === 'l1' && st.atI < l1.length) this.nodes1[st.atI]?.classList.add('is-win')
    if (st.picked === 'l2' && st.atJ < l2.length) this.nodes2[st.atJ]?.classList.add('is-win')

    this.chainMEl.innerHTML = this._chainHtml(st.merged, st.picked ? st.merged.length - 1 : -1)
  }

  resultBanner(result) {
    return {
      kind: 'success',
      html: `🎉 合并完成！结果链表为 <code>[${result.join(',')}]</code>${
        result.length ? '' : '（空链表 NULL）'
      }，长度 ${result.length}。`,
    }
  }
}

export function mountViz(el, opts) {
  return new MergeTwoListsViz(el, opts)
}

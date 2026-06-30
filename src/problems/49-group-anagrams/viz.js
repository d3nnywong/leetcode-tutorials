/*
 * 字母异位词分组「签名哈希表」动画。
 *
 * 字母异位词的本质是：把字母重新排序后会变成同一个字符串。
 * 所以给每个字符串算一个「签名」——把它的字母排个序（比如 "eat" → "aet"）。
 * 签名相同的字符串一定是字母异位词。用哈希表把「签名 → 这一组字符串」记下来，
 * 扫一遍数组，每个字符串按签名归到对应的组里（没有就新建一组），整体 O(n·k log k)。
 */
import { VizPlayer } from '../../components/viz-player/vizPlayer.js'

const MAX_N = 12
const MAX_LEN = 16

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[c])
}

export class GroupAnagramsViz extends VizPlayer {
  constructor(mountEl) {
    super(mountEl, {
      inputs: [
        {
          key: 'strs',
          label: '字符串数组 strs（逗号分隔，可含空串）',
          default: 'eat,tea,tan,ate,nat,bat',
          width: '20rem',
        },
      ],
      speed: 1100,
      hint: `提示：可改成你自己的字符串数组，点「应用」重新演示（最多 ${MAX_N} 个，每个最多 ${MAX_LEN} 个字符，仅小写字母）。`,
    })
  }

  parseInputs({ strs }) {
    const arr = (strs ?? '')
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .slice(0, MAX_N)
    if (arr.length === 0) throw new Error('至少要有 1 个字符串')
    arr.forEach((s, idx) => {
      if (s.length > MAX_LEN) throw new Error(`第 ${idx + 1} 个字符串过长（最多 ${MAX_LEN} 个字符）`)
      if (s !== '' && !/^[a-z]+$/.test(s)) {
        throw new Error(`第 ${idx + 1} 个字符串「${s}」只能包含小写字母（或留空表示空串）`)
      }
    })
    return { strs: arr, display: { strs: arr.join(',') } }
  }

  computeSteps({ strs }) {
    const steps = []
    const groups = [] // { key, items: [] }
    const map = new Map() // key -> groupIndex
    const assigned = []
    for (let i = 0; i < strs.length; i++) {
      const str = strs[i]
      const key = [...str].sort().join('')
      const isNew = !map.has(key)
      let groupIndex
      if (isNew) {
        groupIndex = groups.length
        groups.push({ key, items: [] })
        map.set(key, groupIndex)
      } else {
        groupIndex = map.get(key)
      }
      groups[groupIndex].items.push(str)
      assigned.push(groupIndex)

      const keyDisp = key === '' ? '(空)' : esc(key)
      const strDisp = str === '' ? '(空串)' : `"${esc(str)}"`
      steps.push({
        i,
        str,
        key,
        isNew,
        groupIndex,
        assigned: [...assigned],
        groups: groups.map((g) => ({ key: g.key, items: [...g.items] })),
        msg: isNew
          ? `第 ${i + 1} 个字符串 ${strDisp}：排序字母得到签名 <code>${keyDisp}</code>，哈希表里还没有这个签名 → <strong>新建第 ${
              groupIndex + 1
            } 组</strong>。`
          : `第 ${i + 1} 个字符串 ${strDisp}：排序字母得到签名 <code>${keyDisp}</code>，哈希表里已经有这个签名 → <strong>加入第 ${
              groupIndex + 1
            } 组</strong>。`,
      })
    }
    const result = groups.map((g) => g.items)
    return { steps, result }
  }

  buildStage({ strs }, el) {
    el.innerHTML = `
      <div class="ga__strs"></div>
      <div class="ga__key"></div>
      <div class="ga__groupslabel">分组结果（签名 → 字符串组）</div>
      <div class="ga__groups"></div>
    `
    this.strsEl = el.querySelector('.ga__strs')
    this.keyEl = el.querySelector('.ga__key')
    this.groupsEl = el.querySelector('.ga__groups')
    this.strsEl.innerHTML = strs
      .map(
        (s, i) =>
          `<span class="ga__cell" data-i="${i}"><b class="ga__val">${
            s === '' ? '∅' : esc(s)
          }</b><span class="ga__idx">${i}</span></span>`,
      )
      .join('')
    this.cellEls = [...this.strsEl.querySelectorAll('.ga__cell')]
  }

  renderStep(st) {
    this.cellEls.forEach((c, idx) => {
      c.className = 'ga__cell'
      if (idx < st.assigned.length) c.classList.add('is-processed')
    })
    this.cellEls[st.i]?.classList.add('is-current')

    const keyDisp = st.key === '' ? '(空)' : esc(st.key)
    const strDisp = st.str === '' ? '(空串)' : `"${esc(st.str)}"`
    this.keyEl.innerHTML = `当前字符串 ${strDisp} → 排序字母后得到签名 <code>${keyDisp}</code>`

    this.groupsEl.innerHTML = st.groups
      .map((g, gi) => {
        const cls = gi === st.groupIndex ? (st.isNew ? ' is-new' : ' is-match') : ''
        const gKeyDisp = g.key === '' ? '(空)' : esc(g.key)
        const items = g.items
          .map((s, ii) => {
            const isLast = gi === st.groupIndex && ii === g.items.length - 1
            return `<code class="ga__chip${isLast ? ' is-added' : ''}">${
              s === '' ? '∅' : esc(s)
            }</code>`
          })
          .join('')
        return `<div class="ga__group${cls}">
          <div class="ga__group-key">签名 <code>${gKeyDisp}</code></div>
          <div class="ga__group-items">${items}</div>
        </div>`
      })
      .join('')
  }

  resultBanner(result) {
    const html = result
      .map((g) => `[${g.map((s) => (s === '' ? '""' : `"${esc(s)}"`)).join(', ')}]`)
      .join(', ')
    return {
      kind: 'success',
      html: `🎉 全部分组完成，共 <strong>${result.length}</strong> 组：<code>[${html}]</code>`,
    }
  }
}

export function mountViz(el, opts) {
  return new GroupAnagramsViz(el, opts)
}

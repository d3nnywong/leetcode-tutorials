/*
 * 字符串编码与解码「长度前缀」动画。
 *
 * 核心套路：给每个字符串前面写上「它的长度 + 一个分隔符 #」，再把所有片段首尾拼起来，
 * 例如 "ab" 编码成 "2#ab"。解码时从左往右扫：先读数字直到遇到 #，拿到长度 L，
 * 再不多不少地往后取 L 个字符——不管这 L 个字符里有什么（逗号、#、空格……）都不会读错，
 * 因为我们是「按长度跳」，而不是「找下一个分隔符」。
 */
import { VizPlayer } from '../../components/viz-player/vizPlayer.js'

const MAX_N = 5
const MAX_LEN = 10

function escapeHtml(s) {
  return String(s).replace(
    /[&<>"]/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c],
  )
}

function displayStr(s) {
  return s === '' ? '<em>(空串)</em>' : `"${escapeHtml(s)}"`
}

export class EncodeDecodeViz extends VizPlayer {
  constructor(mountEl) {
    super(mountEl, {
      inputs: [
        {
          key: 'raw',
          label: '字符串数组（用 | 分隔，可含逗号 / # / 空串）',
          default: 'am#1|co,de||ab',
          width: '20rem',
        },
      ],
      speed: 1300,
      hint: `提示：用「|」分隔每个字符串（避免和字符串里可能出现的逗号混淆），点「应用」重新演示（最多 ${MAX_N} 个字符串，每个最多 ${MAX_LEN} 字符）。`,
    })
  }

  parseInputs({ raw }) {
    const items = String(raw ?? '')
      .trim()
      .split('|')
      .slice(0, MAX_N)
      .map((s) => s.slice(0, MAX_LEN))
    if (items.length === 0) throw new Error('至少要有 1 个字符串（可以是空串）')
    return { strs: items, display: { raw: items.join('|') } }
  }

  computeSteps({ strs }) {
    const n = strs.length
    // 预计算每个 chunk（len#str）的边界
    const chunks = []
    let offset = 0
    for (let i = 0; i < n; i++) {
      const lenStr = String(strs[i].length)
      const prefix = `${lenStr}#`
      const chunk = prefix + strs[i]
      chunks.push({
        lenStart: offset,
        lenEnd: offset + prefix.length, // [lenStart, lenEnd) 覆盖数字 + #
        contentStart: offset + prefix.length,
        contentEnd: offset + chunk.length, // [contentStart, contentEnd) 覆盖原字符串内容
        chunk,
        prefix,
      })
      offset += chunk.length
    }
    const encoded = chunks.map((c) => c.chunk).join('')

    const steps = []

    // ── 编码阶段：逐个字符串写入 ──
    for (let i = 0; i < n; i++) {
      const c = chunks[i]
      steps.push({
        phase: 'encode',
        i,
        resFilled: 0,
        hiStart: c.lenStart,
        hiEnd: c.contentEnd,
        doneEnd: c.lenStart,
        msg: `处理第 <code>${i}</code> 个字符串 ${displayStr(strs[i])}（长度 ${
          strs[i].length
        }）：先写长度前缀 <code>${escapeHtml(c.prefix)}</code>，再接上字符串本身 → 片段
        <code>${escapeHtml(c.chunk)}</code>，追加到编码结果末尾。`,
      })
    }
    steps.push({
      phase: 'encode-done',
      i: -1,
      resFilled: 0,
      hiStart: -1,
      hiEnd: -1,
      doneEnd: encoded.length,
      msg: `编码完成！${n} 个字符串被拼成了<strong>一整条字符串</strong>：
        <code>${escapeHtml(encoded)}</code>。这就是真正在网络上传输的内容。`,
    })

    // ── 解码阶段：逐个 chunk 先读长度、再按长度取内容 ──
    for (let j = 0; j < n; j++) {
      const c = chunks[j]
      steps.push({
        phase: 'decode-len',
        i: j,
        resFilled: j,
        hiStart: c.lenStart,
        hiEnd: c.lenEnd,
        doneEnd: c.lenStart,
        msg: `指针走到位置 <code>${c.lenStart}</code>：向右扫描数字字符，直到遇到 <code>#</code> 为止
        → 读到长度前缀 <code>${escapeHtml(c.prefix)}</code>，也就是说接下来要读
        <strong>${strs[j].length}</strong> 个字符。`,
      })
      steps.push({
        phase: 'decode-str',
        i: j,
        resFilled: j + 1,
        hiStart: c.contentStart,
        hiEnd: c.contentEnd,
        doneEnd: c.contentEnd,
        msg: `从 <code>#</code> 后面开始，不多不少地读 <strong>${strs[j].length}</strong> 个字符
        → 得到 ${displayStr(strs[j])}，放进结果数组第 <code>${j}</code> 位。`,
      })
    }
    steps.push({
      phase: 'decode-done',
      i: -1,
      resFilled: n,
      hiStart: -1,
      hiEnd: -1,
      doneEnd: encoded.length,
      msg: `解码完成！还原出的数组与最初的 <code>strs</code> 完全一致 ✅ ——
      即使里面藏着逗号、<code>#</code>、空字符串这些「捣乱分子」，也没有读错一个字符。`,
    })

    return { steps, result: { strs, encoded } }
  }

  buildStage({ strs }, el) {
    el.innerHTML = `
      <div class="eds__row">
        <div class="eds__label">原始数组 strs</div>
        <div class="eds__arr"></div>
      </div>
      <div class="eds__row">
        <div class="eds__label">编码后的单一字符串</div>
        <div class="eds__enc"></div>
      </div>
      <div class="eds__row">
        <div class="eds__label">解码还原的数组</div>
        <div class="eds__res"></div>
      </div>
    `
    this.arrEl = el.querySelector('.eds__arr')
    this.encEl = el.querySelector('.eds__enc')
    this.resEl = el.querySelector('.eds__res')

    this.arrEl.innerHTML = strs
      .map(
        (s, i) =>
          `<span class="eds__chip" data-i="${i}"><span class="eds__chip-val">${displayStr(
            s,
          )}</span><span class="eds__chip-idx">${i}</span></span>`,
      )
      .join('')
    this.arrChips = [...this.arrEl.querySelectorAll('.eds__chip')]

    this.encEl.innerHTML = ''
    this.encChars = null // 解码字符格子按最终编码字符串建好（字符固定，只切换样式类），首次 renderStep 时建
  }

  renderStep(st, { state }) {
    const { strs } = state

    // 编码字符格子：第一次渲染时按最终编码字符串建好（字符固定，只切换样式类）
    if (!this.encChars) {
      const full = this.result.encoded
      this.encEl.innerHTML = [...full]
        .map(
          (ch, idx) =>
            `<span class="eds__char${ch === '#' ? ' is-hash' : ''}" data-i="${idx}"><span class="eds__char-val">${
              ch === ' ' ? '␣' : escapeHtml(ch)
            }</span><span class="eds__char-idx">${idx}</span></span>`,
        )
        .join('')
      this.encChars = [...this.encEl.querySelectorAll('.eds__char')]
    }

    // 顶部数组：编码阶段高亮当前正在处理的字符串
    this.arrChips.forEach((c) => c.classList.remove('is-current', 'is-done'))
    if (st.phase === 'encode' && st.i >= 0) {
      this.arrChips[st.i]?.classList.add('is-current')
      for (let k = 0; k < st.i; k++) this.arrChips[k]?.classList.add('is-done')
    } else if (st.phase !== 'encode') {
      this.arrChips.forEach((c) => c.classList.add('is-done'))
    }

    // 中间编码字符串：按 hiStart/hiEnd/doneEnd 切换三态
    this.encChars.forEach((c) => {
      const idx = Number(c.dataset.i)
      c.classList.remove('is-current', 'is-done', 'is-pending')
      if (idx >= st.hiStart && idx < st.hiEnd) c.classList.add('is-current')
      else if (idx < st.doneEnd) c.classList.add('is-done')
      else c.classList.add('is-pending')
    })

    // 底部结果数组：随解码进度逐个填充
    const filled = st.resFilled
    this.resEl.innerHTML = strs
      .map((s, i) => {
        if (i < filled) {
          const cls = st.phase === 'decode-str' && i === filled - 1 ? ' is-current' : ' is-done'
          return `<span class="eds__chip${cls}" data-i="${i}"><span class="eds__chip-val">${displayStr(
            s,
          )}</span><span class="eds__chip-idx">${i}</span></span>`
        }
        return `<span class="eds__chip eds__chip--empty" data-i="${i}"><span class="eds__chip-val">?</span><span class="eds__chip-idx">${i}</span></span>`
      })
      .join('')
  }

  resultBanner(result) {
    const list = result.strs.map((s) => displayStr(s)).join(', ')
    return {
      kind: 'success',
      html: `🎉 编码 → 传输 → 解码，全程往返成功！还原出的数组：<strong>[${list}]</strong>，
      与最初的 <code>strs</code> 完全一致。`,
    }
  }
}

export function mountViz(el, opts) {
  return new EncodeDecodeViz(el, opts)
}

/*
 * 颠倒二进制位「逐位镜像搬运」动画。
 *
 * 32 位整数共有 32 个二进制位，从最低位 bit0 到最高位 bit31。
 * 颠倒之后，原来 bit i 的值会跑到新数的 bit (31 - i) 上 —— 也就是说，
 * 第 i 位和第 (31-i) 位「整体对调」了位置（最低变最高、最高变最低，往中间逐步靠拢）。
 *
 * 对应到 Java 代码：每次循环把 result 整体左移一位、塞进 n 当前的最低位，
 * 再把 n 右移一位丢掉这一位。循环 32 次后，第 i 次循环塞进去的那一位，
 * 后面还会被再左移 (31-i) 次，所以它最终正好落在第 (31-i) 位 —— 和下面动画
 * 「直接把 bit i 搬到 bit (31-i)」的效果完全一致，只是动画把「最终归宿」直接画出来，
 * 看起来更直观。
 */
import { VizPlayer } from '../../components/viz-player/vizPlayer.js'

const BITS = 32
const MAX_N = 0xffffffff // 2^32 - 1，无符号 32 位整数上限

export class ReverseBitsViz extends VizPlayer {
  constructor(mountEl) {
    super(mountEl, {
      inputs: [{ key: 'n', label: 'n（0 ~ 4294967295 的整数）', default: '43261596', width: '12rem' }],
      speed: 220,
      hint: '提示：可改成你自己的整数，点「应用并重新演示」（按 32 位无符号整数处理）。',
    })
  }

  parseInputs({ n }) {
    const raw = (n ?? '').trim()
    if (raw === '') throw new Error('请输入一个整数')
    const v = Number(raw)
    if (!Number.isFinite(v) || !Number.isInteger(v)) throw new Error(`「${raw}」不是合法整数`)
    if (v < 0 || v > MAX_N) throw new Error(`n 需要在 0 ~ ${MAX_N}（32 位无符号整数）之间`)
    return { n: v, display: { n: String(v) } }
  }

  computeSteps({ n }) {
    // inputBits[c]：显示第 c 格（从左到右），c=0 是最高位 bit31，c=31 是最低位 bit0
    const inputBits = (n >>> 0).toString(2).padStart(BITS, '0').split('')
    const steps = []
    const outputBits = new Array(BITS).fill(null)
    for (let i = 0; i < BITS; i++) {
      const srcCol = BITS - 1 - i // 本次读取：原数第 i 位（从最低位数起），显示列 = 31-i
      const dstCol = i // 写入位置：新数第 (31-i) 位，显示列 = i
      const bit = inputBits[srcCol]
      outputBits[dstCol] = bit
      const lastStep = i === BITS - 1
      steps.push({
        i,
        srcCol,
        dstCol,
        bit,
        outputBits: outputBits.slice(),
        msg:
          `第 ${i + 1}/32 步（i = ${i}）：取原数第 <strong>${i}</strong> 位` +
          `${i === 0 ? '（最低位 LSB）' : ''}${i === 31 ? '（最高位 MSB）' : ''} = <strong>${bit}</strong>，` +
          `把它放到结果的第 <strong>${BITS - 1 - i}</strong> 位` +
          `${BITS - 1 - i === 31 ? '（最高位 MSB）' : ''}${BITS - 1 - i === 0 ? '（最低位 LSB）' : ''}。` +
          (lastStep ? ' 32 位全部搬完，颠倒完成！' : ''),
      })
    }
    const resultBin = outputBits.join('')
    const result = parseInt(resultBin, 2) >>> 0
    return { steps, result: { value: result, bin: resultBin, nBin: inputBits.join('') } }
  }

  buildStage({ n }, el) {
    el.innerHTML = `
      <div class="rb__nrow-label">原始 n = <strong class="rb__ndec"></strong>（从左到右：bit31 → bit0）</div>
      <div class="rb__row rb__row--in"></div>
      <div class="rb__arrowline" aria-hidden="true">读取 ──▶ 镜像搬运 ──▶ 写入</div>
      <div class="rb__row rb__row--out"></div>
      <div class="rb__rrow-label">结果 result（从左到右：bit31 → bit0，正在逐位拼出）</div>
    `
    this.ndecEl = el.querySelector('.rb__ndec')
    this.inRowEl = el.querySelector('.rb__row--in')
    this.outRowEl = el.querySelector('.rb__row--out')
    this.ndecEl.textContent = n

    const bits = (n >>> 0).toString(2).padStart(BITS, '0').split('')
    this.inRowEl.innerHTML = bits
      .map(
        (b, c) =>
          `<span class="rb__cell${c % 8 === 7 && c !== BITS - 1 ? ' rb__cell--group' : ''}" data-c="${c}"><b>${b}</b><span class="rb__pos">${BITS - 1 - c}</span></span>`,
      )
      .join('')
    this.outRowEl.innerHTML = new Array(BITS)
      .fill(0)
      .map(
        (_, c) =>
          `<span class="rb__cell rb__cell--empty${c % 8 === 7 && c !== BITS - 1 ? ' rb__cell--group' : ''}" data-c="${c}"><b>·</b><span class="rb__pos">${BITS - 1 - c}</span></span>`,
      )
      .join('')
    this.inCells = [...this.inRowEl.querySelectorAll('.rb__cell')]
    this.outCells = [...this.outRowEl.querySelectorAll('.rb__cell')]
  }

  renderStep(st) {
    this.inCells.forEach((c, idx) => {
      c.classList.remove('is-current', 'is-consumed')
      if (idx === st.srcCol) c.classList.add('is-current')
      else if (idx > st.srcCol) c.classList.add('is-consumed') // 已经处理过的更低位（显示列更靠右）
    })
    this.outCells.forEach((c, idx) => {
      const b = st.outputBits[idx]
      c.classList.toggle('rb__cell--empty', b == null)
      c.classList.remove('is-current', 'is-filled')
      if (b != null) {
        c.querySelector('b').textContent = b
        if (idx === st.dstCol) c.classList.add('is-current')
        else c.classList.add('is-filled')
      } else {
        c.querySelector('b').textContent = '·'
      }
    })
  }

  resultBanner(result) {
    return {
      kind: 'success',
      html:
        `🎉 颠倒完成！result 的二进制是 <code>${result.bin}</code>，` +
        `十进制是 <strong>${result.value}</strong>。`,
    }
  }
}

export function mountViz(el, opts) {
  return new ReverseBitsViz(el, opts)
}

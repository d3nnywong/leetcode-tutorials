/*
 * 两整数之和「位运算手算加法」动画。
 *
 * 不用 +/-，那加法到底是什么？回想小学竖式加法：每一位先算「这一位本身的和」，
 * 再单独处理「进位」，最后把进位加到高一位上去——如此反复，直到没有新的进位为止。
 *
 * 二进制下这两步都能用位运算精确表达：
 *   1) 无进位和 = a ^ b   （按位异或：相同为 0、不同为 1，正是「不考虑进位」时这一位该有的结果）
 *   2) 进位     = (a & b) << 1   （按位与：两位都是 1 才会进位；左移一位，因为进位要加到高一位）
 * 然后令 a = 无进位和、b = 进位，重复上面两步，直到 b 变成 0（没有进位可加了），此时 a 就是答案。
 * 在 32 位整数范围内，这个过程最多循环 32 轮就一定会结束。
 */
import { VizPlayer } from '../../components/viz-player/vizPlayer.js'

const BITS = 32
const MAX_ROUNDS = 40 // 安全上限：32 位整数最多 32 轮就会收敛，这里留足余量
const MIN_V = -1000
const MAX_V = 1000

// 把整数按 32 位二进制补码展开成字符数组，下标 0 = bit31（最高位），下标 31 = bit0（最低位）
function toBits32(n) {
  return (n >>> 0).toString(2).padStart(BITS, '0').split('')
}

export class SumTwoIntegersViz extends VizPlayer {
  constructor(mountEl) {
    super(mountEl, {
      inputs: [
        { key: 'a', label: 'a（-1000 ~ 1000 的整数）', default: '5', width: '9rem' },
        { key: 'b', label: 'b（-1000 ~ 1000 的整数）', default: '7', width: '9rem' },
      ],
      speed: 1500,
      hint:
        '提示：不用 +/-，只靠「异或算无进位和」与「与并左移算进位」反复推进，直到进位归零。' +
        '试试把 a 改成 -1、b 改成 1，看看负数的补码要绕多少轮才能把所有的 1 都进位抵消掉。',
    })
  }

  parseInputs({ a, b }) {
    const parseOne = (raw, name) => {
      const s = (raw ?? '').trim()
      if (s === '') throw new Error(`请输入 ${name}`)
      const v = Number(s)
      if (!Number.isFinite(v) || !Number.isInteger(v)) throw new Error(`「${s}」不是合法整数`)
      if (v < MIN_V || v > MAX_V) throw new Error(`${name} 需要在 ${MIN_V} ~ ${MAX_V} 之间`)
      return v
    }
    const av = parseOne(a, 'a')
    const bv = parseOne(b, 'b')
    return { a: av, b: bv, display: { a: String(av), b: String(bv) } }
  }

  computeSteps({ a, b }) {
    const steps = []
    let curA = a
    let curB = b
    let round = 0
    while (curB !== 0 && round < MAX_ROUNDS) {
      round++
      const xor = curA ^ curB
      const andRaw = curA & curB
      const carry = andRaw << 1
      steps.push({
        phase: 'xor',
        round,
        a: curA,
        b: curB,
        value: xor,
        msg:
          `第 ${round} 轮 · ① 先算「无进位和」：<code>a ^ b</code> = ${curA} ^ ${curB} = <strong>${xor}</strong>` +
          `（按位异或：同一位上两数不同记 1、相同记 0，正是不考虑进位时这一位该有的和）。`,
      })
      steps.push({
        phase: 'carry',
        round,
        a: curA,
        b: curB,
        xor,
        andRaw,
        value: carry,
        msg:
          `第 ${round} 轮 · ② 再算「进位」：<code>(a &amp; b) &lt;&lt; 1</code> = (${curA} &amp; ${curB}) &lt;&lt; 1 = <strong>${carry}</strong>` +
          `（两数同一位都是 1，就会向高一位产生进位，所以先按位与、再整体左移一位）。` +
          ` 接下来 a ← ${xor}，b ← ${carry}，继续判断 b 是否为 0。`,
      })
      curA = xor
      curB = carry
    }
    steps.push({
      phase: 'done',
      round,
      a: curA,
      b: curB,
      value: curA,
      msg:
        round >= MAX_ROUNDS && curB !== 0
          ? `已演示 ${MAX_ROUNDS} 轮（理论上 32 位整数最多 32 轮就会收敛）。`
          : `<code>b</code> 变成 <strong>0</strong>，没有进位可加了，循环结束，返回 <strong>a = ${curA}</strong>。`,
    })
    return { steps, result: { value: curA, a, b } }
  }

  buildStage(state, el) {
    const rowHtml = (rowKey, label) => `
      <div class="soi__row soi__row--${rowKey}">
        <span class="soi__label">${label}</span>
        <div class="soi__bits" data-row="${rowKey}">${Array.from(
          { length: BITS },
          (_, c) =>
            `<span class="soi__cell${
              c % 8 === 7 && c !== BITS - 1 ? ' soi__cell--group' : ''
            }" data-c="${c}"><b></b></span>`,
        ).join('')}</div>
        <span class="soi__dec" data-dec="${rowKey}"></span>
      </div>
    `
    el.innerHTML = `
      <p class="soi__caption">每行 32 位，从左到右依次是 <code>bit31</code>（最高位，含符号）→
      <code>bit0</code>（最低位）；负数按 32 位二进制补码显示。</p>
      <div class="soi__board">
        ${rowHtml('a', 'a')}
        <div class="soi__opline"><span class="soi__op" data-op></span></div>
        ${rowHtml('b', 'b')}
        <div class="soi__rule" aria-hidden="true"></div>
        ${rowHtml('r', '结果')}
      </div>
      <p class="soi__roundinfo"></p>
    `
    this.rows = {
      a: { bits: el.querySelector('[data-row="a"]'), dec: el.querySelector('[data-dec="a"]') },
      b: { bits: el.querySelector('[data-row="b"]'), dec: el.querySelector('[data-dec="b"]') },
      r: { bits: el.querySelector('[data-row="r"]'), dec: el.querySelector('[data-dec="r"]') },
    }
    for (const key in this.rows) {
      this.rows[key].cells = [...this.rows[key].bits.querySelectorAll('.soi__cell')]
    }
    this.opEl = el.querySelector('[data-op]')
    this.roundInfoEl = el.querySelector('.soi__roundinfo')
  }

  renderStep(st) {
    const aBits = toBits32(st.a)
    const bBits = toBits32(st.b)
    const rBits = toBits32(st.value)

    // a / b 行：按当前阶段标出参与运算的位
    ;[
      [this.rows.a, aBits],
      [this.rows.b, bBits],
    ].forEach(([row, bits]) => {
      row.cells.forEach((cell, i) => {
        cell.querySelector('b').textContent = bits[i]
        cell.classList.remove('is-diff', 'is-and')
        if (st.phase === 'xor' && aBits[i] !== bBits[i]) cell.classList.add('is-diff')
        if (st.phase === 'carry' && aBits[i] === '1' && bBits[i] === '1') cell.classList.add('is-and')
      })
    })

    // 结果行：本步算出来的值（异或 / 进位 / 最终答案）
    this.rows.r.cells.forEach((cell, i) => {
      cell.querySelector('b').textContent = rBits[i]
      cell.classList.remove('is-bit', 'is-final')
      if (rBits[i] === '1') {
        cell.classList.add('is-bit')
        if (st.phase === 'done') cell.classList.add('is-final')
      }
    })

    this.rows.a.dec.textContent = `= ${st.a}`
    this.rows.b.dec.textContent = `= ${st.b}`
    this.rows.r.dec.textContent = `= ${st.value}`

    this.opEl.textContent =
      st.phase === 'xor' ? 'a ^ b =' : st.phase === 'carry' ? '(a & b) << 1 =' : '返回 a ='

    this.roundInfoEl.textContent =
      st.phase === 'done'
        ? 'b 已为 0，循环结束'
        : `第 ${st.round} 轮 · ${st.phase === 'xor' ? '① 算无进位和（异或）' : '② 算进位（与 + 左移）'}`
  }

  resultBanner(result) {
    return {
      kind: 'success',
      html: `🎉 ${result.a} + ${result.b} = <strong>${result.value}</strong>（全程没用一次 <code>+</code> 或 <code>-</code>）。`,
    }
  }
}

export function mountViz(el, opts) {
  return new SumTwoIntegersViz(el, opts)
}

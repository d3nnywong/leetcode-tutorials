/*
 * 有效的括号「用栈逐字符匹配」动画。
 *
 * 从左到右扫描字符串：
 *   - 碰到左括号 ( [ { → 直接压入栈顶。
 *   - 碰到右括号 ) ] } → 看栈顶：
 *       栈是空的 → 没有左括号能配它，无效；
 *       栈顶类型不一致 → 配错了，无效；
 *       栈顶类型一致 → 配对成功，把栈顶弹出。
 * 扫完整个字符串后，如果栈也正好空了，说明所有括号都被正确配对 → 有效；
 * 如果栈里还剩东西，说明还有左括号没被配上 → 无效。
 * 栈的「后进先出」天然对应括号「最近打开的要最先闭合」这个规则。
 */
import { VizPlayer } from '../../components/viz-player/vizPlayer.js'

const MAX_N = 16
const PAIR_OF_CLOSE = { ')': '(', ']': '[', '}': '{' }
const OPENS = new Set(['(', '[', '{'])

export class ValidParenthesesViz extends VizPlayer {
  constructor(mountEl) {
    super(mountEl, {
      inputs: [{ key: 's', label: '字符串 s（仅含括号）', default: '{[()()]}', width: '13rem' }],
      speed: 1000,
      hint: `提示：可改成你自己的括号字符串，点「应用」重新演示（最多 ${MAX_N} 个字符，试试 "([)]" 看看失败长什么样）。`,
    })
  }

  parseInputs({ s }) {
    const str = (s ?? '').trim()
    if (!str) throw new Error('请输入一个只包含括号的字符串')
    if (str.length > MAX_N) throw new Error(`为了演示清晰，长度最多 ${MAX_N} 个字符`)
    if (!/^[()[\]{}]+$/.test(str)) throw new Error('只能包含括号字符 ()[]{}')
    return { s: str, display: { s: str } }
  }

  computeSteps({ s }) {
    const steps = []
    const stack = []
    let result = null

    for (let i = 0; i < s.length; i++) {
      const c = s[i]
      if (OPENS.has(c)) {
        stack.push(c)
        steps.push({
          kind: 'push',
          i,
          ch: c,
          stack: [...stack],
          msg: `第 ${i + 1} 个字符是左括号 <code>${c}</code>，入栈。当前栈：<code>${
            stack.join('') || '（空）'
          }</code>`,
        })
        continue
      }
      if (stack.length === 0) {
        steps.push({
          kind: 'fail-empty',
          i,
          ch: c,
          stack: [],
          msg: `第 ${i + 1} 个字符是右括号 <code>${c}</code>，但栈是空的，没有左括号能跟它配对 → <strong>无效</strong>！`,
        })
        result = false
        break
      }
      const top = stack[stack.length - 1]
      if (PAIR_OF_CLOSE[c] === top) {
        stack.pop()
        steps.push({
          kind: 'pop',
          i,
          ch: c,
          matched: top,
          stack: [...stack],
          msg: `第 ${i + 1} 个字符是右括号 <code>${c}</code>，正好和栈顶 <code>${top}</code> 配对，弹出。当前栈：<code>${
            stack.join('') || '（空）'
          }</code>`,
        })
        continue
      }
      steps.push({
        kind: 'fail-mismatch',
        i,
        ch: c,
        top,
        stack: [...stack],
        msg: `第 ${i + 1} 个字符是右括号 <code>${c}</code>，但栈顶是 <code>${top}</code>，类型不一致 → <strong>无效</strong>！`,
      })
      result = false
      break
    }

    if (result === null) {
      const ok = stack.length === 0
      steps.push({
        kind: 'final',
        i: null,
        stack: [...stack],
        msg: ok
          ? `字符串扫描完毕，栈刚好是空的 → 所有括号都正确配对，<strong>有效</strong>！`
          : `字符串扫描完毕，栈里还剩 <code>${stack.join(
              '',
            )}</code> 没被配对 → <strong>无效</strong>！`,
      })
      result = ok
    }

    return { steps, result }
  }

  buildStage({ s }, el) {
    el.innerHTML = `
      <div class="vp__string"></div>
      <div class="vp__panels">
        <div class="vp__stackbox">
          <div class="vp__stacklabel">栈（自下往上，顶部 = 最近压入）</div>
          <div class="vp__stack"></div>
        </div>
      </div>
    `
    this.strEl = el.querySelector('.vp__string')
    this.stackEl = el.querySelector('.vp__stack')
    this.strEl.innerHTML = [...s]
      .map((c, i) => `<span class="vp__char" data-i="${i}">${c}</span>`)
      .join('')
    this.charEls = [...this.strEl.querySelectorAll('.vp__char')]
  }

  renderStep(st) {
    this.charEls.forEach((c, idx) => {
      c.className = 'vp__char'
      if (typeof st.i === 'number' && idx < st.i) c.classList.add('is-done')
    })
    if (typeof st.i === 'number') {
      const cur = this.charEls[st.i]
      cur.classList.add('is-current')
      if (st.kind === 'push') cur.classList.add('is-open')
      else if (st.kind === 'pop') cur.classList.add('is-ok')
      else cur.classList.add('is-bad')
    }

    const stackArr = st.stack ?? []
    this.stackEl.innerHTML = stackArr.length
      ? stackArr
          .map((c, idx) => {
            const isTop = idx === stackArr.length - 1
            const extra =
              isTop && st.kind === 'push'
                ? ' is-new'
                : isTop && st.kind === 'fail-mismatch'
                  ? ' is-bad'
                  : ''
            return `<span class="vp__sitem${extra}">${c}</span>`
          })
          .join('')
      : `<span class="vp__sempty">空</span>`
  }

  resultBanner(result, state) {
    if (result) {
      return {
        kind: 'success',
        html: `🎉 字符串 <code>${state.s}</code> 是<strong>有效</strong>的括号序列：每个左括号都被同类型的右括号、以正确顺序闭合了。`,
      }
    }
    return {
      kind: 'fail',
      html: `🚫 字符串 <code>${state.s}</code> <strong>不是</strong>有效的括号序列。`,
    }
  }
}

export function mountViz(el, opts) {
  return new ValidParenthesesViz(el, opts)
}

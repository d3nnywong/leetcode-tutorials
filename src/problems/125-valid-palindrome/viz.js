/*
 * 验证回文串「双指针向中间靠拢」动画。
 *
 * 左右各放一个指针，从字符串两端往中间走：
 * 遇到不是字母/数字的字符就跳过（不参与比较）；
 * 两个指针都停在字母/数字上时，忽略大小写比较是否相同——
 * 不同就立刻能断定不是回文串，相同就同时往中间靠拢，直到两指针相遇/交错。
 * 全程只扫一遍，O(n) 时间、O(1) 额外空间。
 */
import { VizPlayer } from '../../components/viz-player/vizPlayer.js'

const MAX_LEN = 40
const isAlnum = (c) => /[a-z0-9]/i.test(c)
const display = (c) => (c === ' ' ? '␣' : c)

export class PalindromeViz extends VizPlayer {
  constructor(mountEl) {
    super(mountEl, {
      inputs: [
        {
          key: 's',
          label: '字符串 s',
          default: 'A man, a plan, a canal: Panama',
          width: '20rem',
          maxlength: MAX_LEN,
        },
      ],
      speed: 750,
      hint: `提示：可改成你自己的字符串，点「应用」重新演示（最多 ${MAX_LEN} 个字符，空格显示为 ␣）。`,
    })
  }

  parseInputs({ s }) {
    const str = (s ?? '').slice(0, MAX_LEN)
    if (str.length === 0) throw new Error('字符串不能为空')
    return { s: str, display: { s: str } }
  }

  computeSteps({ s }) {
    const n = s.length
    const steps = []
    let l = 0
    let r = n - 1
    let result = true
    const matched = []

    while (l < r) {
      if (!isAlnum(s[l])) {
        steps.push({
          kind: 'skipL',
          l,
          r,
          matched: [...matched],
          msg: `s[${l}] = <code>'${display(s[l])}'</code> 不是字母或数字，不参与比较，左指针右移。`,
        })
        l++
        continue
      }
      if (!isAlnum(s[r])) {
        steps.push({
          kind: 'skipR',
          l,
          r,
          matched: [...matched],
          msg: `s[${r}] = <code>'${display(s[r])}'</code> 不是字母或数字，不参与比较，右指针左移。`,
        })
        r--
        continue
      }
      const cl = s[l].toLowerCase()
      const cr = s[r].toLowerCase()
      if (cl === cr) {
        matched.push([l, r])
        steps.push({
          kind: 'match',
          l,
          r,
          matched: [...matched],
          msg: `比较 s[${l}] = <code>'${s[l]}'</code> 与 s[${r}] = <code>'${s[r]}'</code>（忽略大小写）：相同 ✓，两指针同时向中间靠拢。`,
        })
        l++
        r--
      } else {
        result = false
        steps.push({
          kind: 'mismatch',
          l,
          r,
          matched: [...matched],
          msg: `比较 s[${l}] = <code>'${s[l]}'</code> 与 s[${r}] = <code>'${s[r]}'</code>（忽略大小写）：不同 ✗ → 不是回文串，提前结束。`,
        })
        break
      }
    }

    if (result) {
      steps.push({
        kind: 'done',
        l,
        r,
        matched: [...matched],
        msg:
          l === r
            ? `两指针相遇在中间字符 s[${l}]，前面的比较全部通过 → 是回文串！`
            : `两指针交错（l = ${l} > r = ${r}），前面的比较全部通过 → 是回文串！`,
      })
    }

    return { steps, result }
  }

  buildStage({ s }, el) {
    el.innerHTML = `<div class="vp__row"></div>`
    this.rowEl = el.querySelector('.vp__row')
    this.rowEl.innerHTML = [...s]
      .map(
        (c, i) =>
          `<span class="vp__cell${isAlnum(c) ? '' : ' is-skip'}" data-i="${i}">
            <b class="vp__ch">${display(c)}</b>
            <span class="vp__ptr"></span>
          </span>`,
      )
      .join('')
    this.cellEls = [...this.rowEl.querySelectorAll('.vp__cell')]
  }

  renderStep(st) {
    this.cellEls.forEach((c) => {
      c.classList.remove('is-l', 'is-r', 'is-match', 'is-mismatch', 'is-center')
      c.querySelector('.vp__ptr').textContent = ''
    })

    ;(st.matched ?? []).forEach(([a, b]) => {
      this.cellEls[a]?.classList.add('is-match')
      this.cellEls[b]?.classList.add('is-match')
    })

    if (st.kind === 'mismatch') {
      this.cellEls[st.l]?.classList.add('is-mismatch')
      this.cellEls[st.r]?.classList.add('is-mismatch')
    }

    if (st.kind === 'done') {
      if (st.l === st.r) this.cellEls[st.l]?.classList.add('is-center')
      return
    }

    const lCell = this.cellEls[st.l]
    const rCell = this.cellEls[st.r]
    if (lCell) {
      lCell.classList.add('is-l')
      lCell.querySelector('.vp__ptr').textContent = lCell === rCell ? 'L R' : 'L'
    }
    if (rCell && rCell !== lCell) {
      rCell.classList.add('is-r')
      rCell.querySelector('.vp__ptr').textContent = 'R'
    }
  }

  resultBanner(result, state) {
    if (result) {
      return {
        kind: 'success',
        html: `🎉 左右指针一路向中间靠拢，所有字母/数字都两两相同 → <strong>是回文串</strong>，返回 <code>true</code>。`,
      }
    }
    return {
      kind: 'fail',
      html: `🚫 在还没靠拢前就发现一对字符不一样 → <strong>不是回文串</strong>，返回 <code>false</code>（试试 <code>race a car</code>）。`,
    }
  }
}

export function mountViz(el, opts) {
  return new PalindromeViz(el, opts)
}

/*
 * 代码块「一键复制」—— 给页面里每个 pre.code-block 右上角加一个复制按钮。
 *
 *  - 复制的是 <code> 的纯文本（不含语法高亮标签）
 *  - 优先用 navigator.clipboard，失败时回退到 execCommand('copy')
 *  - 复制后按钮短暂变成「已复制 ✓」，再自动恢复
 *  - 文案随语言切换（中 / EN）
 */
import { getLang, onLang, t } from '../../lib/i18n.js'

const FEEDBACK_MS = 1600

// 把代码文本写入剪贴板，返回是否成功
async function copyText(text) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    /* 落到下面的回退方案 */
  }
  // 回退：旧浏览器 / 非安全上下文（http://localhost 之外）
  try {
    const ta = document.createElement('textarea')
    ta.value = text
    ta.setAttribute('readonly', '')
    ta.style.position = 'fixed'
    ta.style.top = '-9999px'
    document.body.appendChild(ta)
    ta.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(ta)
    return ok
  } catch {
    return false
  }
}

function setupButton(block) {
  const code = block.querySelector('code')
  if (!code || block.querySelector('.code-copy')) return

  const btn = document.createElement('button')
  btn.type = 'button'
  btn.className = 'code-copy'
  btn.innerHTML = `
    <svg class="code-copy__icon" width="15" height="15" viewBox="0 0 24 24"
         fill="none" stroke="currentColor" stroke-width="2"
         stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
    <span class="code-copy__label"></span>
  `
  const label = btn.querySelector('.code-copy__label')

  function syncLabel() {
    btn.setAttribute('aria-label', t('code.aria'))
    if (!btn.classList.contains('is-done') && !btn.classList.contains('is-fail')) {
      label.textContent = t('code.copy')
    }
  }
  syncLabel()
  onLang(syncLabel)

  let timer = 0
  btn.addEventListener('click', async () => {
    const ok = await copyText(code.textContent)
    window.clearTimeout(timer)
    btn.classList.toggle('is-done', ok)
    btn.classList.toggle('is-fail', !ok)
    label.textContent = ok ? t('code.copied') : t('code.failed')
    timer = window.setTimeout(() => {
      btn.classList.remove('is-done', 'is-fail')
      label.textContent = t('code.copy')
    }, FEEDBACK_MS)
  })

  block.appendChild(btn)
}

export function mountCodeCopy(sel = '.code-block') {
  document.querySelectorAll(sel).forEach(setupButton)
}

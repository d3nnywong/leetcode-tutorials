/*
 * Notes —— 每个页面一块「学习笔记」，自动保存到浏览器本地（localStorage），
 * 刷新、关页面都不丢。右下角浮动按钮，点开是侧滑面板。界面文案随语言切换。
 *
 * 用法：mountNotes({ key: 'lcs-1143', title: { zh:'1143 笔记', en:'1143 Notes' } })
 *   title 可传字符串或 {zh,en}；key 决定笔记存到哪个槽位（不同页面互不干扰）。
 */
import { getLang, onLang, t } from '../../lib/i18n.js'

const SAVE_DELAY = 400 // 停止输入 400ms 后保存

export function mountNotes({ key = location.pathname, title = '我的笔记' } = {}) {
  const storeKey = `lc-notes:${key}`
  const titleFor = (lang) =>
    typeof title === 'string' ? title : title[lang] ?? title.zh

  const root = document.createElement('div')
  root.className = 'notes'
  root.innerHTML = `
    <button class="notes__fab" id="notes-fab" aria-label="打开学习笔记" aria-expanded="false">
      <span class="notes__fab-icon">📝</span>
      <span class="notes__fab-text"></span>
    </button>

    <aside class="notes__panel" id="notes-panel" role="dialog" aria-hidden="true">
      <header class="notes__head">
        <strong id="notes-title"></strong>
        <button class="notes__close" id="notes-close">✕</button>
      </header>
      <textarea class="notes__text" id="notes-text"></textarea>
      <footer class="notes__foot">
        <span class="notes__status" id="notes-status"></span>
        <span class="notes__actions">
          <button class="btn notes__btn" id="notes-export"></button>
          <button class="btn notes__btn" id="notes-clear"></button>
        </span>
      </footer>
    </aside>
  `
  document.body.appendChild(root)

  const fab = root.querySelector('#notes-fab')
  const fabText = root.querySelector('.notes__fab-text')
  const panel = root.querySelector('#notes-panel')
  const titleEl = root.querySelector('#notes-title')
  const text = root.querySelector('#notes-text')
  const statusEl = root.querySelector('#notes-status')
  const closeBtn = root.querySelector('#notes-close')
  const exportBtn = root.querySelector('#notes-export')
  const clearBtn = root.querySelector('#notes-clear')

  // —— 本地存储读写 ——
  const safeGet = () => {
    try {
      return localStorage.getItem(storeKey) ?? ''
    } catch {
      return ''
    }
  }
  const safeSet = (v) => {
    try {
      localStorage.setItem(storeKey, v)
      return true
    } catch {
      return false
    }
  }

  text.value = safeGet()

  // —— 按语言刷新所有界面文案 ——
  function applyLabels() {
    const lang = getLang()
    fabText.textContent = t('notes.fab')
    fab.setAttribute('aria-label', t('notes.fab'))
    panel.setAttribute('aria-label', titleFor(lang))
    titleEl.textContent = titleFor(lang)
    text.setAttribute('placeholder', t('notes.ph'))
    closeBtn.setAttribute('aria-label', t('notes.close'))
    exportBtn.textContent = t('notes.export')
    if (!armed) clearBtn.textContent = t('notes.clear')
    refreshStatus()
  }

  function refreshStatus() {
    const n = text.value.length
    statusEl.textContent = n ? `${t('notes.saved')} · ${n} ${t('notes.unit')}` : t('notes.empty')
    statusEl.classList.remove('is-saving')
  }

  // 防抖保存
  let timer = null
  text.addEventListener('input', () => {
    statusEl.textContent = t('notes.typing')
    statusEl.classList.add('is-saving')
    clearTimeout(timer)
    timer = setTimeout(() => {
      const ok = safeSet(text.value)
      statusEl.textContent = ok
        ? `${t('notes.saved')} · ${text.value.length} ${t('notes.unit')}`
        : t('notes.failed')
      statusEl.classList.remove('is-saving')
    }, SAVE_DELAY)
  })

  // 开/关面板
  const open = () => {
    panel.classList.add('is-open')
    panel.setAttribute('aria-hidden', 'false')
    fab.setAttribute('aria-expanded', 'true')
    text.focus()
  }
  const close = () => {
    panel.classList.remove('is-open')
    panel.setAttribute('aria-hidden', 'true')
    fab.setAttribute('aria-expanded', 'false')
  }
  fab.addEventListener('click', () =>
    panel.classList.contains('is-open') ? close() : open(),
  )
  closeBtn.addEventListener('click', close)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && panel.classList.contains('is-open')) close()
  })

  // 导出 Markdown
  exportBtn.addEventListener('click', () => {
    const md = `# ${titleFor(getLang())}\n\n${text.value || '（空）'}\n`
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${key}-notes.md`
    a.click()
    URL.revokeObjectURL(url)
  })

  // 清空：两步确认
  let armed = false
  let armTimer = null
  clearBtn.addEventListener('click', () => {
    if (!armed) {
      armed = true
      clearBtn.textContent = t('notes.clearConfirm')
      clearBtn.classList.add('is-danger')
      armTimer = setTimeout(() => {
        armed = false
        clearBtn.textContent = t('notes.clear')
        clearBtn.classList.remove('is-danger')
      }, 2500)
      return
    }
    clearTimeout(armTimer)
    armed = false
    clearBtn.textContent = t('notes.clear')
    clearBtn.classList.remove('is-danger')
    text.value = ''
    safeSet('')
    refreshStatus()
    text.focus()
  })

  applyLabels()
  onLang(applyLabels)
}

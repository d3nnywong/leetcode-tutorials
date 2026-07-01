/*
 * App Shell —— 全站共享的「全屏应用外壳」：左侧固定侧边栏（语言切换 + 搜索 + 题目导航），
 * 右侧是各页面自己的主内容。每个页面只要：
 *   1. HTML 里放好 .app / #app-sidebar / #sidebar-toggle / #sidebar-scrim 结构；
 *   2. 调一次 mountAppShell({ activeSlug })。
 *
 * 搜索：实时过滤题号 / 标题 / 英文名 / 标签；按 "/" 快速聚焦搜索框。
 * 语言：中 / EN 切换，题目标题与界面文案随之切换（深入讲解正文保持中文）。
 */
import { problems } from '../../data/problems.js'
import { getLang, setLang, onLang, applyStatic, CATEGORIES, categoryName } from '../../lib/i18n.js'

export function mountAppShell({ activeSlug = null } = {}) {
  const sidebar = document.querySelector('#app-sidebar')
  if (!sidebar) return

  sidebar.innerHTML = `
    <div class="sidebar__brand-row">
      <a class="sidebar__brand" href="${import.meta.env.BASE_URL}index.html">
        <span class="site-header__logo">LC</span>
        <span>算法图解教程</span>
      </a>
      <div class="lang-switch" role="group" aria-label="语言 / Language">
        <button type="button" class="lang-switch__btn" data-lang="zh">中</button>
        <button type="button" class="lang-switch__btn" data-lang="en">EN</button>
      </div>
    </div>

    <div class="sidebar__search">
      <input
        id="problem-search"
        class="sidebar__search-input"
        type="search"
        autocomplete="off"
        aria-label="搜索题目"
        data-i18n-ph="search.ph"
      />
      <kbd class="sidebar__search-kbd">/</kbd>
    </div>

    <nav class="sidebar__nav" aria-label="题目导航">
      <p class="sidebar__nav-title">
        <span data-i18n="nav.title"></span>
        <span class="sidebar__nav-count" id="problem-count">0</span>
      </p>
      <ul id="sidebar-list" class="sidebar__list"></ul>
      <p id="sidebar-empty" class="sidebar__empty" hidden data-i18n="search.empty"></p>
    </nav>

    <p class="sidebar__foot" data-i18n="sidebar.foot"></p>
  `

  const listEl = sidebar.querySelector('#sidebar-list')
  const emptyEl = sidebar.querySelector('#sidebar-empty')
  const countEl = sidebar.querySelector('#problem-count')
  const searchEl = sidebar.querySelector('#problem-search')

  function itemMarkup(p, lang) {
    const isActive = p.slug === activeSlug
    const planned = p.status !== 'done'
    const title = lang === 'en' ? p.titleEn : p.title
    const cls = ['sidebar__item', isActive ? 'is-active' : '', planned ? 'is-planned' : '']
      .filter(Boolean)
      .join(' ')
    const soon = lang === 'en' ? 'Soon' : '待更新'
    const inner = `
      <span class="sidebar__item-id">#${p.id}</span>
      <span class="sidebar__item-title">${title}</span>
      ${planned ? `<span class="sidebar__item-soon">${soon}</span>` : ''}
    `
    if (planned) return `<li><span class="${cls}">${inner}</span></li>`
    if (isActive) return `<li><span class="${cls}" aria-current="page">${inner}</span></li>`
    return `<li><a class="${cls}" href="${import.meta.env.BASE_URL}${p.url}">${inner}</a></li>`
  }

  function render(query = '') {
    const lang = getLang()
    const q = query.trim().toLowerCase()
    const matched = problems.filter((p) => {
      const hay = `${p.id} ${p.title} ${p.titleEn} ${p.tags.join(' ')} ${p.category} ${categoryName(
        p.category,
        'en',
      )}`.toLowerCase()
      return hay.includes(q)
    })
    // 按专题分组：每组一个小标题，组内是题目条目
    const byCat = new Map()
    for (const p of matched) {
      if (!byCat.has(p.category)) byCat.set(p.category, [])
      byCat.get(p.category).push(p)
    }
    listEl.innerHTML = CATEGORIES.filter((c) => byCat.has(c.zh))
      .map((c) => {
        const items = byCat.get(c.zh)
        const head = `<li class="sidebar__cat"><span>${categoryName(
          c.zh,
          lang,
        )}</span><span class="sidebar__cat-count">${items.length}</span></li>`
        return head + items.map((p) => itemMarkup(p, lang)).join('')
      })
      .join('')
    countEl.textContent = matched.length
    emptyEl.hidden = matched.length > 0
  }

  // —— 语言切换 —— //
  const langBtns = sidebar.querySelectorAll('.lang-switch__btn')
  function reflectLang() {
    const lang = getLang()
    langBtns.forEach((b) => b.classList.toggle('is-active', b.dataset.lang === lang))
  }
  langBtns.forEach((b) => b.addEventListener('click', () => setLang(b.dataset.lang)))
  onLang(() => {
    reflectLang()
    render(searchEl.value)
  })

  // 初始渲染
  applyStatic()
  reflectLang()
  render()

  searchEl.addEventListener('input', () => render(searchEl.value))

  // 按 "/" 快速聚焦搜索（输入框内除外）
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement !== searchEl) {
      e.preventDefault()
      searchEl.focus()
    }
    if (e.key === 'Escape') document.body.classList.remove('sidebar-open')
  })

  // 移动端抽屉开关
  document.querySelector('#sidebar-toggle')?.addEventListener('click', () => {
    document.body.classList.toggle('sidebar-open')
  })
  document.querySelector('#sidebar-scrim')?.addEventListener('click', () => {
    document.body.classList.remove('sidebar-open')
  })
}

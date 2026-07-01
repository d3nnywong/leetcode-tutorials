// 首页逻辑：渲染应用外壳（侧边栏 + 搜索 + 语言切换）、题目卡片列表、笔记面板。
import { problems, difficultyColor } from './data/problems.js'
import { mountAppShell } from './components/app-shell/appShell.js'
import { mountNotes } from './components/notes/notes.js'
import { getLang, onLang, difficulty, tag, CATEGORIES, categoryName, categoryDesc } from './lib/i18n.js'

mountAppShell({ activeSlug: null })
mountNotes({ key: 'home', title: { zh: '学习总笔记', en: 'My Notes' } })

const listEl = document.querySelector('#problem-list')

function cardMarkup(p, lang) {
  const planned = p.status !== 'done'
  const badgeColor = difficultyColor[p.difficulty] ?? 'var(--color-text-soft)'
  const primary = lang === 'en' ? p.titleEn : p.title
  const secondary = lang === 'en' ? p.title : p.titleEn
  const summary = lang === 'en' ? p.summaryEn ?? p.summary : p.summary
  const soon = lang === 'en' ? 'Coming soon' : '敬请期待'

  const inner = `
    <div class="problem-card__top">
      <span class="problem-card__id">#${p.id}</span>
      <span class="problem-card__badge" style="background:${badgeColor}">${difficulty(
        p.difficulty,
        lang,
      )}</span>
      ${planned ? `<span class="tag">${soon}</span>` : ''}
    </div>
    <h3 class="problem-card__title">
      ${primary} <small>${secondary}</small>
    </h3>
    <p class="problem-card__summary">${summary}</p>
    <div class="problem-card__tags">
      ${p.tags.map((t) => `<span class="tag">${tag(t, lang)}</span>`).join('')}
    </div>
  `

  if (planned) {
    return `<li><div class="card problem-card problem-card--planned">${inner}</div></li>`
  }
  return `<li><a class="card problem-card" href="${import.meta.env.BASE_URL}${p.url}">${inner}</a></li>`
}

function renderCards() {
  const lang = getLang()
  // 按专题分组（顺序取 CATEGORIES），每组一个小标题 + 卡片网格
  const byCat = new Map()
  for (const p of problems) {
    if (!byCat.has(p.category)) byCat.set(p.category, [])
    byCat.get(p.category).push(p)
  }
  listEl.innerHTML = CATEGORIES.filter((c) => byCat.has(c.zh))
    .map((c) => {
      const list = byCat.get(c.zh)
      const cards = list.map((p) => cardMarkup(p, lang)).join('')
      return `<section class="cat-block">
        <h3 class="cat-heading">
          <span class="cat-heading__name">${categoryName(c.zh, lang)}</span>
          <span class="cat-count">${list.length}</span>
        </h3>
        <p class="cat-desc">${categoryDesc(c.zh, lang)}</p>
        <ul class="problem-list">${cards}</ul>
      </section>`
    })
    .join('')
}

renderCards()
onLang(renderCards)

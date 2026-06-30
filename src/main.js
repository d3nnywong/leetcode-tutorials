// 首页逻辑：渲染应用外壳（侧边栏 + 搜索 + 语言切换）、题目卡片列表、笔记面板。
import { problems, difficultyColor } from './data/problems.js'
import { mountAppShell } from './components/app-shell/appShell.js'
import { mountNotes } from './components/notes/notes.js'
import { getLang, onLang, difficulty, tag } from './lib/i18n.js'

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
  listEl.innerHTML = problems.map((p) => cardMarkup(p, lang)).join('')
}

renderCards()
onLang(renderCards)

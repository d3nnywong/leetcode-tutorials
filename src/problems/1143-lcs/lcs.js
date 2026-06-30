// 1143 页面逻辑：应用外壳 + 笔记 + 官方原题（中/英切换）+ 交互式 DP 表格。
import { DpTable } from '../../components/dp-table/DpTable.js'
import { mountAppShell } from '../../components/app-shell/appShell.js'
import { mountNotes } from '../../components/notes/notes.js'
import { mountToc } from '../../components/toc/toc.js'
import { mountCodeCopy } from '../../components/code-copy/codeCopy.js'
import { problems, difficultyColor } from '../../data/problems.js'
import { getLang, onLang, difficulty, tag } from '../../lib/i18n.js'
import { statement } from './statement.js'

const problem = problems.find((p) => p.slug === '1143-lcs')

mountAppShell({ activeSlug: '1143-lcs' })
mountNotes({ key: '1143-lcs', title: { zh: '1143 · 我的笔记', en: '1143 · My Notes' } })

const metaEl = document.querySelector('#article-meta')
const titleEl = document.querySelector('#article-title')
const subtitleEl = document.querySelector('#article-subtitle')
const statementEl = document.querySelector('#statement')

// 根据当前语言渲染标题、难度、标签、副标题与官方题面
function renderForLang() {
  const lang = getLang()
  const badgeColor = difficultyColor[problem.difficulty] ?? 'var(--color-text-soft)'

  metaEl.innerHTML = `
    <span class="problem-card__id">#${problem.id}</span>
    <span class="problem-card__badge" style="background:${badgeColor}">
      ${difficulty(problem.difficulty, lang)}
    </span>
    ${problem.tags.map((t) => `<span class="tag">${tag(t, lang)}</span>`).join('')}
  `

  // 主标题用当前语言，副标题用另一种语言（双语对照）
  titleEl.textContent = lang === 'en' ? problem.titleEn : problem.title
  subtitleEl.textContent = lang === 'en' ? problem.title : problem.titleEn

  statementEl.innerHTML = lang === 'en' ? statement.en : statement.zh
  const suffix = lang === 'en' ? 'Illustrated' : '图解'
  document.title = `${problem.id}. ${
    lang === 'en' ? problem.titleEn : problem.title
  } · ${suffix}`
}

renderForLang()
onLang(renderForLang)

// 右侧目录（基于正文小节标题）
mountToc()

// 给每个代码块加「一键复制」按钮
mountCodeCopy()

// 交互式 DP 表格
new DpTable(document.querySelector('#dp-mount'), {
  text1: 'abcde',
  text2: 'ace',
})

// 「返回题目列表」链接：站内链接必须用 BASE_URL 拼接，否则项目页部署会 404
// （Vite 不会重写 HTML 里 <a> 的 href，所以这里在运行时设置）
const backLink = document.querySelector('#back-link')
if (backLink) backLink.href = `${import.meta.env.BASE_URL}index.html`

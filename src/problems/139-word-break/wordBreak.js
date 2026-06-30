// 139 页面逻辑：应用外壳 + 笔记 + 官方原题（中/英切换）+ 两个交互动画（指针扫描 / 一维 DP）。
import { mountAppShell } from '../../components/app-shell/appShell.js'
import { mountNotes } from '../../components/notes/notes.js'
import { mountToc } from '../../components/toc/toc.js'
import { mountCodeCopy } from '../../components/code-copy/codeCopy.js'
import { problems, difficultyColor } from '../../data/problems.js'
import { getLang, onLang, difficulty, tag } from '../../lib/i18n.js'
import { statement, src } from './statement.js'
import { mountPointerScan } from './pointerScan.js'
import { mountDpArray } from './dpArray.js'

const problem = problems.find((p) => p.slug === '139-word-break')

mountAppShell({ activeSlug: '139-word-break' })
mountNotes({ key: '139-word-break', title: { zh: '139 · 我的笔记', en: '139 · My Notes' } })

const metaEl = document.querySelector('#article-meta')
const titleEl = document.querySelector('#article-title')
const subtitleEl = document.querySelector('#article-subtitle')
const statementEl = document.querySelector('#statement')
const srcEl = document.querySelector('#statement-src')

// 根据当前语言渲染标题、难度、标签、副标题、官方题面与题源链接
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

  titleEl.textContent = lang === 'en' ? problem.titleEn : problem.title
  subtitleEl.textContent = lang === 'en' ? problem.title : problem.titleEn

  statementEl.innerHTML = lang === 'en' ? statement.en : statement.zh
  if (srcEl) srcEl.href = lang === 'en' ? src.en : src.zh

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

// 动画一：指针扫描（暴力直觉）
mountPointerScan(document.querySelector('#scan-mount'), {
  s: 'leetcode',
  dict: ['leet', 'code'],
})

// 动画二：一维 DP 数组（优化解法）—— 默认用「拼不出来」的反例，体会 DP 怎么判否
mountDpArray(document.querySelector('#dp-mount'), {
  s: 'leetcode',
  dict: ['leet', 'code'],
})

// 「返回题目列表」链接：站内链接必须用 BASE_URL 拼接，否则项目页部署会 404
// （Vite 不会重写 HTML 里 <a> 的 href，所以这里在运行时设置）
const backLink = document.querySelector('#back-link')
if (backLink) backLink.href = `${import.meta.env.BASE_URL}index.html`

/*
 * mountProblemShell —— 每个题解页通用的「页面引导」。
 *
 * 负责所有题目页都一样的事：挂应用外壳 / 笔记 / 目录 / 代码复制按钮，
 * 按当前语言渲染标题区（题号 + 难度 + 标签 + 中英标题）、官方题面与题源链接，
 * 并把「返回题目列表」链接用 BASE_URL 拼好（HTML 里的 <a> Vite 不会重写）。
 *
 * 页面 HTML 需要提供这些约定 id：
 *   #article-meta #article-title #article-subtitle #statement #statement-src #back-link
 *
 * 用法：
 *   import { mountProblemShell } from '../../lib/problemPage.js'
 *   import { statement, src } from './statement.js'
 *   mountProblemShell({ slug: '1-two-sum', statement, src })
 *   // 然后页面再挂自己的动画
 */
import { mountAppShell } from '../components/app-shell/appShell.js'
import { mountNotes } from '../components/notes/notes.js'
import { mountToc } from '../components/toc/toc.js'
import { mountCodeCopy } from '../components/code-copy/codeCopy.js'
import { problems, difficultyColor } from '../data/problems.js'
import { getLang, onLang, difficulty, tag } from './i18n.js'

export function mountProblemShell({ slug, statement, src, notesTitle } = {}) {
  const problem = problems.find((p) => p.slug === slug)
  if (!problem) throw new Error(`mountProblemShell: 找不到题目 slug=${slug}`)

  mountAppShell({ activeSlug: slug })
  mountNotes({
    key: slug,
    title: notesTitle ?? { zh: `${problem.id} · 我的笔记`, en: `${problem.id} · My Notes` },
  })

  const metaEl = document.querySelector('#article-meta')
  const titleEl = document.querySelector('#article-title')
  const subtitleEl = document.querySelector('#article-subtitle')
  const statementEl = document.querySelector('#statement')
  const srcEl = document.querySelector('#statement-src')

  function render() {
    const lang = getLang()
    const badge = difficultyColor[problem.difficulty] ?? 'var(--color-text-soft)'
    if (metaEl) {
      metaEl.innerHTML = `
        <span class="problem-card__id">#${problem.id}</span>
        <span class="problem-card__badge" style="background:${badge}">
          ${difficulty(problem.difficulty, lang)}
        </span>
        ${problem.tags.map((t) => `<span class="tag">${tag(t, lang)}</span>`).join('')}
      `
    }
    if (titleEl) titleEl.textContent = lang === 'en' ? problem.titleEn : problem.title
    if (subtitleEl) subtitleEl.textContent = lang === 'en' ? problem.title : problem.titleEn
    if (statementEl && statement) statementEl.innerHTML = lang === 'en' ? statement.en : statement.zh
    if (srcEl && src) srcEl.href = lang === 'en' ? src.en : src.zh
    document.title = `${problem.id}. ${
      lang === 'en' ? problem.titleEn : problem.title
    } · ${lang === 'en' ? 'Illustrated' : '图解'}`
  }

  render()
  onLang(render)

  mountToc()
  mountCodeCopy()

  const back = document.querySelector('#back-link')
  if (back) back.href = `${import.meta.env.BASE_URL}index.html`

  return problem
}

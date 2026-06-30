/*
 * TOC —— 题解页右侧「本页目录」。自动收集正文里的小节标题，
 * 点击平滑滚动，滚动时用 IntersectionObserver 高亮当前所在小节。
 * 窄屏（< 1100px）由 CSS 隐藏，回退成单列阅读。
 */
import { onLang, applyStatic } from '../../lib/i18n.js'

export function mountToc({ mountSel = '#toc', headingSel = '.article__section h2' } = {}) {
  const toc = document.querySelector(mountSel)
  if (!toc) return

  const heads = [...document.querySelectorAll(headingSel)]
  if (!heads.length) {
    toc.hidden = true
    return
  }

  // 给每个标题一个稳定 id，供锚点跳转
  heads.forEach((h, i) => {
    if (!h.id) h.id = `sec-${i}`
  })

  function build() {
    const items = heads
      .map(
        (h) =>
          `<li><a class="toc__link" href="#${h.id}" data-target="${h.id}">${h.textContent.trim()}</a></li>`,
      )
      .join('')
    toc.innerHTML = `
      <p class="toc__title" data-i18n="toc.title"></p>
      <ul class="toc__list">${items}</ul>
    `
    applyStatic(toc)
    wire()
  }

  let links = []
  function wire() {
    links = [...toc.querySelectorAll('.toc__link')]
    links.forEach((a) =>
      a.addEventListener('click', (e) => {
        e.preventDefault()
        document.getElementById(a.dataset.target)?.scrollIntoView({ block: 'start' })
        history.replaceState(null, '', `#${a.dataset.target}`)
      }),
    )
  }

  function setActive(id) {
    links.forEach((a) => a.classList.toggle('is-active', a.dataset.target === id))
  }

  build()

  // 滚动监听：高亮视口中最靠上的小节
  const visible = new Set()
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) visible.add(en.target.id)
        else visible.delete(en.target.id)
      })
      // 选当前可见里文档顺序最靠前的；都不可见时保持上一个
      const firstVisible = heads.find((h) => visible.has(h.id))
      if (firstVisible) setActive(firstVisible.id)
    },
    { rootMargin: '-80px 0px -65% 0px', threshold: 0 },
  )
  heads.forEach((h) => observer.observe(h))

  // 语言切换后标题文字可能变化（如「原题描述」），重建目录
  onLang(build)
}

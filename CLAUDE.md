# CLAUDE.md

本文件给 Claude Code（claude.ai/code）在本仓库工作时提供指引。

## 项目简介

一个**零基础友好**的 LeetCode 题解教程站：每道题从「人话」讲起，配可交互的算法动画。

- 技术栈：**Vite 6 + 原生 JS（ESM）+ 原生 CSS**，零框架、零运行时依赖。
- 多页面（MPA）：首页 `index.html` + 每道题一个独立 `index.html`。
- 纯静态站点，部署在 GitHub Pages。

## 常用命令

```bash
pnpm install                 # 安装依赖（包管理器锁定为 pnpm@11，见 package.json）
pnpm dev                     # 开发服务器
pnpm build                   # 打包到 dist/
pnpm preview                 # 本地预览打包结果
```

> ⚠️ `vite.config.js` 里设了 `base: '/leetcode-tutorials/'`，**dev 与 build 都生效**。
> 本地开发请访问 `http://localhost:5173/leetcode-tutorials/`（直接开 `/` 会 404）。

## 架构

```
index.html                         首页（题目列表）
vite.config.js                     多页面入口；每加一题加一行 input
src/
├── main.js                        首页逻辑
├── home.css                       首页样式
├── data/problems.js               题目清单（加题先改这里）
├── lib/i18n.js                    轻量中/EN 切换 + 界面文案字典
├── styles/
│   ├── tokens.css                 设计变量（颜色/间距/字号/代码块配色）
│   └── global.css                 全局样式 + 代码块（.code-block）
├── components/                    按「功能」分目录，JS + CSS 同处
│   ├── app-shell/                 全屏外壳：侧边栏 + 搜索 + 语言切换（全站共享）
│   ├── toc/                       右侧「本页目录」
│   ├── notes/                     学习笔记（localStorage 自动保存）
│   ├── code-copy/                 代码块「一键复制」按钮
│   └── dp-table/                  可交互 DP 表格动画组件
└── problems/
    └── 1143-lcs/                  1143 题解页（index.html + lcs.js + lcs.css + statement.js）
```

数据流：页面 `index.html` 用 `<link>` 引入所需 CSS，用 `<script type="module">` 引入页面 JS；
页面 JS 调用各 `mount*()` 组件函数挂载到对应 DOM 节点。语言切换通过 `i18n.js` 的 `onLang()` 订阅重渲染。

## 约定

- **路由链接**：JS 里生成的站内链接必须用 `import.meta.env.BASE_URL` 拼接（例如
  `href="${import.meta.env.BASE_URL}${p.url}"`），**不要**写死 `/...`，否则项目页部署会 404。
  Vite 只会重写 HTML 里的 `<link>/<script>`，不会重写 JS 字符串里的运行时链接。
- **设计变量优先**：颜色/间距/字号/圆角统一用 `tokens.css` 的 CSS 变量，别在组件里硬编码。
- **组件按功能分目录**，JS（camelCase 文件名导出 `mountXxx`）与 CSS（kebab-case）放一起。
- **代码块**：结构为 `<pre class="code-block"><code>…</code></pre>`；语法高亮用内联
  `<span class="kw|ty|st|nm|cm">`。横向滚动在内部 `<code>` 上，窗口条钉在 `pre` 顶部。
  注意全局 `code{}` 有浅色底，深色代码块靠 `.code-block code` 覆盖掉。
- **可访问性 / 动效**：尊重 `prefers-reduced-motion`；交互元素要有 hover/focus 状态。

## 怎么再加一道题

1. 在 `src/data/problems.js` 数组加一条记录（含 `slug`、`url`、标题、难度、标签等）。
2. 复制 `src/problems/1143-lcs/` 改成新题内容（`index.html` 讲解 + 页面 JS/CSS）。
3. 在 `vite.config.js` 的 `rollupOptions.input` 加一行指向新页面的 `index.html`。
4. 若有界面新文案，加到 `src/lib/i18n.js` 的 `UI` 字典（中/EN 两条）。

首页会自动列出新题。

## 部署

- 推送到 `main` 触发 `.github/workflows/deploy.yml`：`pnpm build` → 上传 `dist/` → 发布到 GitHub Pages。
- 线上地址：`https://d3nnywong.github.io/leetcode-tutorials/`。
- Pages 源已设为 **GitHub Actions**；`public/.nojekyll` 防止 Jekyll 干扰 `assets/`。
- 若更换仓库名，同步修改 `vite.config.js` 的 `base`。
- 免费账号的 Pages 需要仓库为 **public**；转成 private 会使线上站点失效（除非 GitHub Pro 及以上）。

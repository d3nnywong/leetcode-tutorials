import { resolve } from 'node:path'
import { defineConfig } from 'vite'

// 多页面站点：首页 + 每道题一个独立页面。
// 以后新增题目时，在 input 里再加一行即可。
export default defineConfig({
  root: '.',
  // 部署到 GitHub 项目页：https://<用户名>.github.io/leetcode-tutorials/
  // 注意：base 同时影响 dev 与 build，本地开发请访问
  //   http://localhost:5173/leetcode-tutorials/
  // 若仓库名不是 leetcode-tutorials，改成 '/<你的仓库名>/'。
  base: '/leetcode-tutorials/',
  build: {
    rollupOptions: {
      input: {
        home: resolve(__dirname, 'index.html'),
        wordBreak139: resolve(__dirname, 'src/problems/139-word-break/index.html'),
        lcs1143: resolve(__dirname, 'src/problems/1143-lcs/index.html'),
      },
    },
  },
})

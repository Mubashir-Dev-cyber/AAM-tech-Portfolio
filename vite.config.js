import { copyFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages serves the site from /<repo>/, so the build needs that base path.
// Dev keeps / so the local preview works as before.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/AAM-tech-Portfolio/' : '/',
  plugins: [
    react(),
    {
      // GitHub Pages has no rewrites, so a refresh on /work returns 404.
      // Serving index.html as 404.html lets the router render the page anyway.
      name: 'github-pages-spa-fallback',
      closeBundle() {
        copyFileSync(resolve('dist', 'index.html'), resolve('dist', '404.html'))
      },
    },
  ],
}))

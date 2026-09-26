import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Relative base so the built site works from any path (Vercel, Netlify, GitHub Pages, subfolders)
  base: './',
  plugins: [react()],
})

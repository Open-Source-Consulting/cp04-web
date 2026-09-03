import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Deploy alvo: Vercel (base '/'). Para GitHub Pages, defina BASE_PATH='/<repo>/'.
export default defineConfig({
  base: process.env.BASE_PATH || '/',
  plugins: [react()],
})

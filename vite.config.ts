import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Enable network access
    port: 5173, // Default port
    open: true, // Open browser automatically
  },
  build: {
    rollupOptions: {
      external: [
        '@rollup/rollup-android-arm-eabi',
        '@rollup/rollup-android-arm64',
        '@rollup/rollup-darwin-arm64',
        '@rollup/rollup-darwin-x64',
        '@rollup/rollup-linux-arm-gnueabihf',
        '@rollup/rollup-linux-arm64-gnu',
        '@rollup/rollup-linux-arm64-musl',
        '@rollup/rollup-linux-ia32-gnu',
        '@rollup/rollup-linux-mips64el-gnu',
        '@rollup/rollup-linux-powerpc64-gnu',
        '@rollup/rollup-linux-riscv64-gnu',
        '@rollup/rollup-linux-s390x-gnu',
        '@rollup/rollup-linux-x64-gnu',
        '@rollup/rollup-linux-x64-musl',
        '@rollup/rollup-win32-arm64-msvc',
        '@rollup/rollup-win32-ia32-msvc',
        '@rollup/rollup-win32-x64-msvc'
      ]
    }
  }
})

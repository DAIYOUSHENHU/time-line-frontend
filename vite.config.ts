import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig(() => {
  const apiProxyTarget = 'http://127.0.0.1:6070'

  return {
    plugins: [vue(), vueDevTools()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    // ========== 打包核心 build 配置 ==========
    build: {
      outDir: 'dist', // 打包输出文件夹名称
      assetsDir: 'assets', // js/css/img 资源放在dist下的assets目录
      emptyOutDir: true, // 打包前清空dist目录

      // 是否生成sourcemap，生产环境关闭，调试打包报错时打开
      sourcemap: false,

      minify: 'esbuild', // 压缩器，esbuild速度快；需要更强压缩改为terser（要装依赖）
      cssCodeSplit: true, // 拆分css，不全部打包进一个css文件

      // rollup底层打包配置，用来分包、控制输出文件名
      rollupOptions: {
        output: {
          // 分包：第三方库单独打包（vue、element-plus等），改代码时用户不用重新下载大js包
          manualChunks(id) {
            if (!id.includes('node_modules')) {
              return
            }

            const normalizedId = id.replaceAll('\\', '/')

            if (
              normalizedId.includes('/vue/') ||
              normalizedId.includes('/vue-router/') ||
              normalizedId.includes('/pinia/')
            ) {
              return 'vue'
            }

            if (
              normalizedId.includes('/element-plus/') ||
              normalizedId.includes('/@element-plus/')
            ) {
              return 'element-plus'
            }

            if (normalizedId.includes('/axios/')) {
              return 'axios'
            }

            return 'vendor'
          },
          // 自定义打包后文件命名，带hash缓存，浏览器自动更新
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
        },
      },

      // 图片资源小于这个大小，直接内联base64，减少http请求，单位byte
      assetsInlineLimit: 4096,
    },
    server: {
      open: true,
      port: 3423,
      strictPort: true,
      proxy: {
        '/api': {
          target: apiProxyTarget,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
    preview: {
      port: 3423,
      strictPort: true,
    },
  }
})

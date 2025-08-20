import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: "0.0.0.0",
  },
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1500, // 调整包的大小
    rollupOptions: {
      output: {
        // 用于从入口点创建的块的打包输出格式[name]表示文件名,[hash]表示该文件内容hash值
        entryFileNames: "assets/js/[name].[hash].js", // 用于命名代码拆分时创建的共享块的输出命名
        chunkFileNames: "assets/js/[name].[hash].js", // 用于输出静态资源的命名，[ext]表示文件扩展名
        assetFileNames: "assets/[ext]/[name].[hash].[ext]",
      },
    },
  },
});

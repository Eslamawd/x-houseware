import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5175, // ✅ استخدم بورت غير مستخدم
    host: true, // ✅ ضروري لتشغيل التطبيق من خارج localhost (على CloudPanel)
  },
});

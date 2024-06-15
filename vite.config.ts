import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv';
import tsconfigPaths from "vite-tsconfig-paths";



// run package config
dotenv.config();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  define: {
    'process.env': process.env
  },
})

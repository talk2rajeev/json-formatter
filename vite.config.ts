import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import monacoEditorPlugin from 'vite-plugin-monaco-editor';
import path from 'node:path'; // Add this import for customDistPath

import { loader } from '@monaco-editor/react';
loader.config({ paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.44.0/min/vs' } });

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    
    // Use default export with type assertion to bypass lint error
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    // monacoEditorPlugin.default({
    //   // Here you can specify which languages you want to include
    //   // For example, if you only need JSON and JavaScript
    //   // languageWorkers: ['json', 'editorWorker'],
    //   // Or you can leave this empty to include all workers by default
    // }),

    (monacoEditorPlugin as unknown as { default: (options: any) => Plugin }).default({
      // Here you can specify which languages you want to include
      // For example, if you only need JSON and JavaScript
      // languageWorkers: ['json', 'editorWorker'],
      // Or you can leave this empty to include all workers by default

      customDistPath: (root: string, buildOutDir: string) => {
        // Use the plugin's customDistPath option to override the worker output directory. 
        // This places the workers directly at dist/monacoeditorwork/ (no base prefix in the file path) 
        return path.join(root, buildOutDir, 'monacoeditorwork');
      },
      // custom path
      publicPath: '/monacoeditorwork/'
    }),
  ],
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'monaco-editor': ['monaco-editor'],
        },
      },
    },
  },
  worker: {
    format: 'es',
  },
  base: '/json-formatter/',
});
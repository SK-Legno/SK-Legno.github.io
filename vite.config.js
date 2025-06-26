import { defineConfig } from 'vite'

export default defineConfig({
    root: '.',
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        sourcemap: false,
        minify: 'terser',
        rollupOptions: {
            input: {
                main: 'index.html',
                certification: 'pages/certification.html',
                portfolio: 'pages/portfolio.html',
                contact: 'pages/contact.html'
            }
        }
    },
    server: {
        port: 3000,
        open: true
    },
    preview: {
        port: 4173
    }
}) 
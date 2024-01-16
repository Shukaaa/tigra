import {defineConfig} from 'vite'

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                app: './temp/index.html',
            },
        },
    },
    server: {
        open: '/temp/index.html',
    },
})
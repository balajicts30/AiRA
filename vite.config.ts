import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import trustedSearchHandler from './api/trusted-search'
import sourceRegistryHandler from './api/source-registry'

function readJsonBody(req: any): Promise<any> {
  return new Promise((resolve) => {
    let data = ''
    req.on('data', (chunk: any) => {
      data += chunk
    })
    req.on('end', () => {
      if (!data) return resolve({})
      try {
        resolve(JSON.parse(data))
      } catch {
        resolve({})
      }
    })
  })
}

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'aira-trusted-engine-backend',
      configureServer(server) {
        server.middlewares.use(async (req: any, res: any, next: any) => {
          if (!req.url) return next()
          if (req.url.startsWith('/api/trusted-search')) {
            if (req.method === 'POST') {
              req.body = await readJsonBody(req)
            }
            return trustedSearchHandler(req, res)
          }
          if (req.url.startsWith('/api/source-registry')) {
            if (req.method === 'POST') {
              req.body = await readJsonBody(req)
            }
            return sourceRegistryHandler(req, res)
          }
          return next()
        })
      },
    },
  ],
  build: {
    outDir: 'dist',
  },
})

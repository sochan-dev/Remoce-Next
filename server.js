const express = require('express')
const next = require('next')
const { createProxyMiddleware } = require('http-proxy-middleware')
console.log(
  '!!!!!env確認!!!!!!!',
  process.env.PORT,
  process.env.NODE_ENV,
  process.env.API_URL
)
const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const API_URL =
  process.env.API_URL ||
  'https://asia-northeast1-remoce-7a22f.cloudfunctions.net/remoce'

const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = express()

  server.use(
    '/employee',
    createProxyMiddleware({
      target: 'https://asia-northeast1-remoce-7a22f.cloudfunctions.net/remoce',
      changeOrigin: true
    })
  )

  server.use(
    '/furniture',
    createProxyMiddleware({
      target: 'https://asia-northeast1-remoce-7a22f.cloudfunctions.net/remoce',
      changeOrigin: true
    })
  )

  server.all('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`)
  })
})

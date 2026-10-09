import express from 'express'
import cors from 'cors'

const app = express()

const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

app.use(cors({ origin: allowedOrigins }))
app.use(express.json({ limit: '100kb' }))

// Health check endpoint
app.get('/healthz', (request, response) => {
  response.json({ ok: true, app: "paradu'l API" })
})

app.get('/api', (request, response) => {
  response.json({
    message: "paradu'l API service",
    status: 'online',
    backend: 'Supabase BaaS (PostgreSQL + Auth + Storage)',
  })
})

app.use((request, response) => {
  response.status(404).json({ error: 'No such route' })
})

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`)
})

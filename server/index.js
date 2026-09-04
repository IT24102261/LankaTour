import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import { pool } from './db.js'
import { initDatabase } from './initDb.js'
import authRoutes from './routes/auth.js'
import placeRoutes from './routes/places.js'
import stayRoutes from './routes/accommodations.js'
import feedbackRoutes from './routes/feedback.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '.env') })

const app = express()
app.use(cors())
app.use(express.json({ limit: '8mb' }))

app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1')
    res.json({ ok: true, database: process.env.PGDATABASE })
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message })
  }
})

app.use('/api/auth', authRoutes)
app.use('/api/places', placeRoutes)
app.use('/api/accommodations', stayRoutes)
app.use('/api/feedback', feedbackRoutes)

app.use((error, _req, res, _next) => {
  console.error(error)
  res.status(500).json({ message: 'Something went wrong on the server.' })
})

const port = Number(process.env.PORT || 5000)

initDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`LankaTour API running on http://localhost:${port}`)
      console.log(`Connected database: ${process.env.PGDATABASE}`)
      console.log('In pgAdmin: right-click LankaVisit > Refresh, then expand Schemas > public > Tables')
    })
  })
  .catch((error) => {
    console.error('Could not prepare the LankaVisit database:', error.message)
    process.exit(1)
  })


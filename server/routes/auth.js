import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { query } from '../db.js'
import { mapUser } from '../mappers.js'
import { requireAuth, signToken } from '../middleware/auth.js'

const router = Router()

router.post('/login', async (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase()
  const password = String(req.body.password || '')
  if (!email || !password) {
    return res.status(400).json({ message: 'Please enter both your email and password.' })
  }

  const result = await query('SELECT * FROM users WHERE email = $1', [email])
  const user = result.rows[0]
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return res.status(401).json({ message: 'Invalid email or password. Please try again.' })
  }

  const safe = mapUser(user)
  res.json({ user: safe, token: signToken(safe) })
})

router.post('/register', async (req, res) => {
  const name = String(req.body.name || '').trim()
  const email = String(req.body.email || '').trim().toLowerCase()
  const password = String(req.body.password || '')

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please enter your name, email and password.' })
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'Please choose a password with at least 6 characters.' })
  }

  const existing = await query('SELECT id FROM users WHERE email = $1', [email])
  if (existing.rows.length) {
    return res.status(409).json({ message: 'An account with this email already exists. Please log in.' })
  }

  const id = `user-${Date.now()}`
  const passwordHash = await bcrypt.hash(password, 10)
  const created = await query(
    `INSERT INTO users (id, name, email, password_hash, role, photo_url)
     VALUES ($1, $2, $3, $4, 'traveller', '')
     RETURNING *`,
    [id, name, email, passwordHash],
  )
  const safe = mapUser(created.rows[0])
  res.status(201).json({ user: safe, token: signToken(safe) })
})

router.get('/me', requireAuth, async (req, res) => {
  res.json({ user: req.user })
})

router.put('/me', requireAuth, async (req, res) => {
  const name = req.body.name != null ? String(req.body.name).trim() : req.user.name
  const photoUrl = req.body.photoUrl != null ? String(req.body.photoUrl) : req.user.photoUrl
  if (!name) {
    return res.status(400).json({ message: 'Please enter your name.' })
  }
  const updated = await query(
    'UPDATE users SET name = $1, photo_url = $2 WHERE id = $3 RETURNING *',
    [name, photoUrl, req.user.id],
  )
  res.json({ user: mapUser(updated.rows[0]) })
})

export default router

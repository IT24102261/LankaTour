import jwt from 'jsonwebtoken'
import { query } from '../db.js'
import { mapUser } from '../mappers.js'

export function signToken(user) {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'lankatour-secret', {
    expiresIn: '7d',
  })
}

export async function requireAuth(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) {
    return res.status(401).json({ message: 'Please log in to continue.' })
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'lankatour-secret')
    const result = await query('SELECT * FROM users WHERE id = $1', [payload.id])
    if (!result.rows[0]) {
      return res.status(401).json({ message: 'Account not found. Please log in again.' })
    }
    req.user = mapUser(result.rows[0])
    next()
  } catch {
    return res.status(401).json({ message: 'Your session expired. Please log in again.' })
  }
}

export function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access is required for this action.' })
  }
  next()
}

import { Router } from 'express'
import { query } from '../db.js'
import { mapFeedback } from '../mappers.js'
import { requireAdmin, requireAuth } from '../middleware/auth.js'

const router = Router()

const FEEDBACK_SELECT = `
  SELECT f.*, u.name AS user_name,
         r.message AS response_message, r.admin_name, r.responded_at
  FROM feedback f
  JOIN users u ON u.id = f.user_id
  LEFT JOIN feedback_responses r ON r.feedback_id = f.id
`

router.get('/', async (req, res) => {
  const params = []
  let sql = `${FEEDBACK_SELECT} WHERE 1=1`
  if (req.query.placeId) {
    params.push(req.query.placeId)
    sql += ` AND f.place_id = $${params.length}`
  }
  if (req.query.userId) {
    params.push(req.query.userId)
    sql += ` AND f.user_id = $${params.length}`
  }
  sql += ' ORDER BY f.created_at DESC'
  const result = await query(sql, params)
  res.json(result.rows.map(mapFeedback))
})

router.post('/', requireAuth, async (req, res) => {
  const { placeId, rating, comment, photoUrl } = req.body
  if (!placeId || !String(comment || '').trim()) {
    return res.status(400).json({ message: 'Please select a place and write a comment.' })
  }
  const id = `fb-${Date.now()}`
  await query(
    `INSERT INTO feedback (id, place_id, user_id, rating, comment, photo_url)
     VALUES ($1,$2,$3,$4,$5,$6)`,
    [id, placeId, req.user.id, Number(rating) || 5, String(comment).trim(), photoUrl || ''],
  )
  const created = await query(`${FEEDBACK_SELECT} WHERE f.id = $1`, [id])
  res.status(201).json(mapFeedback(created.rows[0]))
})

router.put('/:id', requireAuth, async (req, res) => {
  const existing = await query('SELECT * FROM feedback WHERE id = $1', [req.params.id])
  if (!existing.rows[0]) return res.status(404).json({ message: 'Feedback not found.' })
  if (req.user.role !== 'admin' && existing.rows[0].user_id !== req.user.id) {
    return res.status(403).json({ message: 'You can only edit your own feedback.' })
  }
  const rating = req.body.rating != null ? Number(req.body.rating) : existing.rows[0].rating
  const comment = req.body.comment != null ? String(req.body.comment).trim() : existing.rows[0].comment
  const photoUrl = req.body.photoUrl != null ? req.body.photoUrl : existing.rows[0].photo_url
  if (!comment) return res.status(400).json({ message: 'Please enter a comment before saving.' })
  await query(
    `UPDATE feedback SET rating=$1, comment=$2, photo_url=$3, updated_at=NOW() WHERE id=$4`,
    [rating, comment, photoUrl || '', req.params.id],
  )
  const updated = await query(`${FEEDBACK_SELECT} WHERE f.id = $1`, [req.params.id])
  res.json(mapFeedback(updated.rows[0]))
})

router.delete('/:id', requireAuth, async (req, res) => {
  const existing = await query('SELECT * FROM feedback WHERE id = $1', [req.params.id])
  if (!existing.rows[0]) return res.status(404).json({ message: 'Feedback not found.' })
  if (req.user.role !== 'admin' && existing.rows[0].user_id !== req.user.id) {
    return res.status(403).json({ message: 'You can only delete your own feedback.' })
  }
  await query('DELETE FROM feedback WHERE id = $1', [req.params.id])
  res.json({ ok: true })
})

router.post('/:id/response', requireAuth, requireAdmin, async (req, res) => {
  const message = String(req.body.message || '').trim()
  if (!message) return res.status(400).json({ message: 'Please write a response before saving.' })
  await query(
    `INSERT INTO feedback_responses (feedback_id, message, admin_name, responded_at)
     VALUES ($1,$2,$3,NOW())
     ON CONFLICT (feedback_id)
     DO UPDATE SET message = EXCLUDED.message, admin_name = EXCLUDED.admin_name, responded_at = NOW()`,
    [req.params.id, message, req.user.name],
  )
  const updated = await query(`${FEEDBACK_SELECT} WHERE f.id = $1`, [req.params.id])
  res.json(mapFeedback(updated.rows[0]))
})

router.delete('/:id/response', requireAuth, requireAdmin, async (req, res) => {
  await query('DELETE FROM feedback_responses WHERE feedback_id = $1', [req.params.id])
  const updated = await query(`${FEEDBACK_SELECT} WHERE f.id = $1`, [req.params.id])
  if (!updated.rows[0]) return res.status(404).json({ message: 'Feedback not found.' })
  res.json(mapFeedback(updated.rows[0]))
})

export default router
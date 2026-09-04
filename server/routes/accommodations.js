import { Router } from 'express'
import { query } from '../db.js'
import { mapStay } from '../mappers.js'
import { requireAdmin, requireAuth } from '../middleware/auth.js'

const router = Router()

router.get('/', async (_req, res) => {
  const result = await query('SELECT * FROM accommodations ORDER BY name')
  res.json(result.rows.map(mapStay))
})

router.post('/', requireAuth, requireAdmin, async (req, res) => {
  const stay = req.body
  if (!stay?.id || !stay?.name || !stay?.placeId) {
    return res.status(400).json({ message: 'Please enter the accommodation name and linked place.' })
  }
  const created = await query(
    `INSERT INTO accommodations (
      id, place_id, name, type, distance, rating, price_category, latitude, longitude
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
    RETURNING *`,
    [
      stay.id,
      stay.placeId,
      stay.name,
      stay.type,
      stay.distance,
      stay.rating,
      stay.priceCategory,
      stay.latitude,
      stay.longitude,
    ],
  )
  res.status(201).json(mapStay(created.rows[0]))
})

router.put('/:id', requireAuth, requireAdmin, async (req, res) => {
  const stay = req.body
  const result = await query(
    `UPDATE accommodations SET
      place_id=$1, name=$2, type=$3, distance=$4, rating=$5, price_category=$6, latitude=$7, longitude=$8
     WHERE id=$9 RETURNING *`,
    [
      stay.placeId,
      stay.name,
      stay.type,
      stay.distance,
      stay.rating,
      stay.priceCategory,
      stay.latitude,
      stay.longitude,
      req.params.id,
    ],
  )
  if (!result.rows[0]) return res.status(404).json({ message: 'Accommodation not found.' })
  res.json(mapStay(result.rows[0]))
})

router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  await query('DELETE FROM accommodations WHERE id = $1', [req.params.id])
  res.json({ ok: true })
})

export default router

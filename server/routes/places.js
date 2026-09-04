import { Router } from 'express'
import { query } from '../db.js'
import { mapPlace } from '../mappers.js'
import { requireAdmin, requireAuth } from '../middleware/auth.js'

const router = Router()

async function nearbyFor(placeId) {
  const result = await query('SELECT nearby_id FROM place_nearby WHERE place_id = $1', [placeId])
  return result.rows.map((row) => row.nearby_id)
}

async function loadPlace(id) {
  const result = await query('SELECT * FROM places WHERE id = $1', [id])
  if (!result.rows[0]) return null
  return mapPlace(result.rows[0], await nearbyFor(id))
}

async function saveNearby(placeId, nearbyPlaceIds = []) {
  await query('DELETE FROM place_nearby WHERE place_id = $1', [placeId])
  for (const nearbyId of nearbyPlaceIds) {
    if (nearbyId && nearbyId !== placeId) {
      await query(
        'INSERT INTO place_nearby (place_id, nearby_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
        [placeId, nearbyId],
      )
    }
  }
}

router.get('/', async (_req, res) => {
  const result = await query('SELECT * FROM places ORDER BY name')
  const places = []
  for (const row of result.rows) {
    places.push(mapPlace(row, await nearbyFor(row.id)))
  }
  res.json(places)
})

router.get('/:id', async (req, res) => {
  const place = await loadPlace(req.params.id)
  if (!place) return res.status(404).json({ message: 'Sorry, this tourist attraction could not be found.' })
  res.json(place)
})

router.post('/', requireAuth, requireAdmin, async (req, res) => {
  const place = req.body
  if (!place?.id || !place?.name) {
    return res.status(400).json({ message: 'Please enter the attraction name.' })
  }
  await query(
    `INSERT INTO places (
      id, name, district, province, category, description, short_description, image,
      latitude, longitude, entry_type, rating, opening_hours, recommended_duration, best_time_to_visit
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)`,
    [
      place.id,
      place.name,
      place.district,
      place.province,
      place.category,
      place.description,
      place.shortDescription,
      place.image,
      place.latitude,
      place.longitude,
      place.entryType,
      place.rating,
      place.openingHours,
      place.recommendedDuration,
      place.bestTimeToVisit,
    ],
  )
  await saveNearby(place.id, place.nearbyPlaceIds)
  res.status(201).json(await loadPlace(place.id))
})

router.put('/:id', requireAuth, requireAdmin, async (req, res) => {
  const place = req.body
  const result = await query(
    `UPDATE places SET
      name=$1, district=$2, province=$3, category=$4, description=$5, short_description=$6, image=$7,
      latitude=$8, longitude=$9, entry_type=$10, rating=$11, opening_hours=$12, recommended_duration=$13,
      best_time_to_visit=$14
     WHERE id=$15 RETURNING id`,
    [
      place.name,
      place.district,
      place.province,
      place.category,
      place.description,
      place.shortDescription,
      place.image,
      place.latitude,
      place.longitude,
      place.entryType,
      place.rating,
      place.openingHours,
      place.recommendedDuration,
      place.bestTimeToVisit,
      req.params.id,
    ],
  )
  if (!result.rows[0]) return res.status(404).json({ message: 'Place not found.' })
  await saveNearby(req.params.id, place.nearbyPlaceIds)
  res.json(await loadPlace(req.params.id))
})

router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  await query('DELETE FROM places WHERE id = $1', [req.params.id])
  res.json({ ok: true })
})

export default router
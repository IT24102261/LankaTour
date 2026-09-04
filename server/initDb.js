import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import pg from 'pg'
import bcrypt from 'bcryptjs'
import { places } from '../src/data/places.js'
import { accommodations } from '../src/data/accommodations.js'
import { dbConfig } from './db.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const { Client } = pg

function adminConfig() {
  return {
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    password: dbConfig.password,
    database: 'postgres',
  }
}

async function ensureDatabase() {
  const client = new Client(adminConfig())
  await client.connect()
  const existing = await client.query('SELECT datname FROM pg_database WHERE datname = $1', [dbConfig.database])
  if (!existing.rows.length) {
    await client.query(`CREATE DATABASE "${dbConfig.database}"`)
    console.log(`Created database ${dbConfig.database}`)
  }
  await client.end()
}

async function withLankaVisit(work) {
  const client = new Client({ ...adminConfig(), database: dbConfig.database })
  await client.connect()
  try {
    await work(client)
  } finally {
    await client.end()
  }
}

export async function initDatabase() {
  await ensureDatabase()
  await withLankaVisit(async (client) => {
    const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8')
    await client.query(schema)
    await client.query('GRANT ALL ON SCHEMA public TO postgres')
    await client.query('GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres')

    const adminHash = await bcrypt.hash('admin123', 10)
    const guestHash = await bcrypt.hash('guest123', 10)

    await client.query(
      `INSERT INTO users (id, name, email, password_hash, role, photo_url)
       VALUES
         ('admin-1', 'LankaTour Admin', 'admin@explorelk.lk', $1, 'admin', ''),
         ('user-1', 'Guest Traveller', 'guest@explorelk.lk', $2, 'traveller', '')
       ON CONFLICT (id) DO NOTHING`,
      [adminHash, guestHash],
    )

    for (const place of places) {
      await client.query(
        `INSERT INTO places (
          id, name, district, province, category, description, short_description, image,
          latitude, longitude, entry_type, rating, opening_hours, recommended_duration, best_time_to_visit
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
        ON CONFLICT (id) DO NOTHING`,
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
    }

    await client.query('DELETE FROM place_nearby')
    for (const place of places) {
      for (const nearbyId of place.nearbyPlaceIds || []) {
        await client.query(
          'INSERT INTO place_nearby (place_id, nearby_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
          [place.id, nearbyId],
        )
      }
    }

    for (const stay of accommodations) {
      await client.query(
        `INSERT INTO accommodations (
          id, place_id, name, type, distance, rating, price_category, latitude, longitude
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
        ON CONFLICT (id) DO NOTHING`,
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
    }

    await client.query(
      `INSERT INTO feedback (id, place_id, user_id, rating, comment, photo_url, created_at)
       VALUES
        ('fb-1', 'nine-arches-bridge', 'user-1', 5, 'Arrived just as the train crossed. Easy walk from Ella town and unforgettable views.', '', '2026-08-12T09:30:00.000Z'),
        ('fb-2', 'sigiriya', 'user-1', 4, 'The climb is steep but worth it. Would love clearer signage for the frescoes.', '', '2026-08-20T11:00:00.000Z')
       ON CONFLICT (id) DO NOTHING`,
    )

    await client.query(
      `INSERT INTO feedback_responses (feedback_id, message, admin_name, responded_at)
       VALUES ('fb-1', 'Thank you! Morning trains are usually the least crowded — enjoy the rest of Ella.', 'LankaTour Admin', '2026-08-12T14:10:00.000Z')
       ON CONFLICT (feedback_id) DO NOTHING`,
    )

    const counts = await client.query(`
      SELECT
        (SELECT COUNT(*) FROM users) AS users,
        (SELECT COUNT(*) FROM places) AS places,
        (SELECT COUNT(*) FROM accommodations) AS stays,
        (SELECT COUNT(*) FROM feedback) AS feedback
    `)
    const row = counts.rows[0]
    console.log(
      `LankaVisit ready — users: ${row.users}, places: ${row.places}, stays: ${row.stays}, feedback: ${row.feedback}`,
    )
  })
}

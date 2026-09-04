import dotenv from 'dotenv'
import pg from 'pg'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '.env') })

const { Pool } = pg

export const dbConfig = {
  host: process.env.PGHOST || 'localhost',
  port: Number(process.env.PGPORT || 5432),
  user: process.env.PGUSER || 'postgres',
  password: String(process.env.PGPASSWORD || ''),
  database: process.env.PGDATABASE || 'LankaVisit',
}

export const pool = new Pool(dbConfig)

export async function query(text, params) {
  return pool.query(text, params)
}

import { initDatabase } from './initDb.js'

initDatabase().catch((error) => {
  console.error('Seed failed:', error.message)
  process.exit(1)
})

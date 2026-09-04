const STORAGE_KEY = 'lankatour-trip-submissions'

export function loadTripPlans() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveTripPlans(plans) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(plans))
}

export function loadTripPlansForUser(userId, userName) {
  return loadTripPlans().filter(
    (plan) => plan.userId === userId || (!plan.userId && userName && plan.userName === userName),
  )
}
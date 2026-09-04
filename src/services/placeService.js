import { places as seedPlaces, POPULAR_DESTINATION_IDS } from '../data/places'
import { accommodations as seedAccommodations } from '../data/accommodations'

export function filterPlaces(placeList, { search = '', district = '', category = '', entryType = '' } = {}) {
  const query = search.trim().toLowerCase()

  return placeList.filter((place) => {
    const matchesSearch =
      !query ||
      place.name.toLowerCase().includes(query) ||
      place.district.toLowerCase().includes(query) ||
      place.shortDescription.toLowerCase().includes(query) ||
      place.category.toLowerCase().includes(query)

    const matchesDistrict = !district || place.district === district
    const matchesCategory = !category || place.category === category
    const matchesEntry = !entryType || place.entryType === entryType

    return matchesSearch && matchesDistrict && matchesCategory && matchesEntry
  })
}

export function getPlaceById(placeList, id) {
  return placeList.find((place) => place.id === id) ?? null
}

export function getPopularDestinations(placeList) {
  const popular = POPULAR_DESTINATION_IDS.map((id) => getPlaceById(placeList, id)).filter(Boolean)
  if (popular.length) return popular
  return placeList.slice(0, 6)
}

function toRadians(value) {
  return (value * Math.PI) / 180
}

export function distanceKm(from, to) {
  const earthRadius = 6371
  const dLat = toRadians(to.latitude - from.latitude)
  const dLon = toRadians(to.longitude - from.longitude)
  const lat1 = toRadians(from.latitude)
  const lat2 = toRadians(to.latitude)
  const a =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2
  return earthRadius * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)))
}

export function formatDistance(km) {
  if (km < 1) return `${Math.round(km * 1000)} m`
  return `${km.toFixed(1)} km`
}

export function getNearbyPlaces(placeList, place) {
  if (!place?.nearbyPlaceIds?.length) return []
  return place.nearbyPlaceIds
    .map((id) => getPlaceById(placeList, id))
    .filter(Boolean)
    .map((nearby) => ({
      ...nearby,
      distanceLabel: formatDistance(distanceKm(place, nearby)),
    }))
}

export function getAccommodationsForPlace(stayList, placeList, placeId) {
  const direct = stayList.filter((item) => item.placeId === placeId)
  if (direct.length) return direct

  const place = getPlaceById(placeList, placeId)
  if (!place?.nearbyPlaceIds?.length) return []

  const nearbyIds = new Set([placeId, ...place.nearbyPlaceIds])
  return stayList.filter((item) => nearbyIds.has(item.placeId)).slice(0, 3)
}

export function estimateTripDays(placeCount) {
  if (!placeCount) return 0
  return Math.ceil(placeCount / 2)
}

export function groupPlacesByDay(tripPlaces) {
  const days = []
  for (let i = 0; i < tripPlaces.length; i += 2) {
    days.push({
      day: days.length + 1,
      places: tripPlaces.slice(i, i + 2),
    })
  }
  return days
}

export { seedPlaces, seedAccommodations }

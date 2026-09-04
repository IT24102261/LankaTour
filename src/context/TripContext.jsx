import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { estimateTripDays } from '../services/placeService'
import { useNotice } from './NoticeContext'

const STORAGE_KEY = 'explorelk-trip'
const TripContext = createContext(null)

function loadTrip() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function TripProvider({ children }) {
  const [trip, setTrip] = useState(loadTrip)
  const { showNotice } = useNotice()

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trip))
  }, [trip])

  const addToTrip = useCallback(
    (place) => {
      if (!place?.id) return false

      const alreadyAdded = trip.some((item) => item.id === place.id)
      if (alreadyAdded) {
        showNotice('warning', 'This place is already in your trip.')
        return false
      }

      setTrip((current) => [
        ...current,
        {
          id: place.id,
          name: place.name,
          district: place.district,
          category: place.category,
          image: place.image,
          rating: place.rating,
          entryType: place.entryType,
        },
      ])
      showNotice('success', `${place.name} added to your trip.`)
      return true
    },
    [showNotice, trip],
  )

  const removeFromTrip = useCallback((placeId) => {
    setTrip((current) => current.filter((item) => item.id !== placeId))
  }, [])

  const clearTrip = useCallback(() => {
    setTrip([])
    showNotice('success', 'Your trip has been cleared.')
  }, [showNotice])

  const isInTrip = useCallback((placeId) => trip.some((item) => item.id === placeId), [trip])

  const value = useMemo(() => {
    const districts = [...new Set(trip.map((item) => item.district))]
    const categories = [...new Set(trip.map((item) => item.category))]

    return {
      trip,
      addToTrip,
      removeFromTrip,
      clearTrip,
      isInTrip,
      totalPlaces: trip.length,
      estimatedDays: estimateTripDays(trip.length),
      districtsCovered: districts,
      categoriesIncluded: categories,
    }
  }, [trip, addToTrip, removeFromTrip, clearTrip, isInTrip])

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>
}

export function useTrip() {
  const context = useContext(TripContext)
  if (!context) {
    throw new Error('useTrip must be used inside TripProvider')
  }
  return context
}
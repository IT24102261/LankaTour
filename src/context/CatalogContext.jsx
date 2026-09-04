import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import {
  filterPlaces,
  getAccommodationsForPlace,
  getNearbyPlaces,
  getPlaceById,
  getPopularDestinations,
} from '../services/placeService'
import api, { getErrorMessage } from '../services/api'

const CatalogContext = createContext(null)

export function CatalogProvider({ children }) {
  const [places, setPlaces] = useState([])
  const [accommodations, setAccommodations] = useState([])
  const [feedback, setFeedback] = useState([])
  const [loadError, setLoadError] = useState('')

  const refresh = useCallback(async () => {
    const [placeRes, stayRes, feedbackRes] = await Promise.all([
      api.get('/places'),
      api.get('/accommodations'),
      api.get('/feedback'),
    ])
    setPlaces(placeRes.data)
    setAccommodations(stayRes.data)
    setFeedback(feedbackRes.data)
    setLoadError('')
  }, [])

  useEffect(() => {
    refresh().catch((error) => {
      setLoadError(getErrorMessage(error, 'Could not load data from the server. Is the API running?'))
    })
  }, [refresh])

  const savePlace = useCallback(
    async (place, { isNew } = { isNew: false }) => {
      if (isNew) await api.post('/places', place)
      else await api.put(`/places/${place.id}`, place)
      await refresh()
    },
    [refresh],
  )

  const deletePlace = useCallback(
    async (placeId) => {
      await api.delete(`/places/${placeId}`)
      await refresh()
    },
    [refresh],
  )

  const saveAccommodation = useCallback(
    async (stay, { isNew } = { isNew: false }) => {
      if (isNew) await api.post('/accommodations', stay)
      else await api.put(`/accommodations/${stay.id}`, stay)
      await refresh()
    },
    [refresh],
  )

  const deleteAccommodation = useCallback(
    async (stayId) => {
      await api.delete(`/accommodations/${stayId}`)
      await refresh()
    },
    [refresh],
  )

  const addFeedback = useCallback(
    async (entry) => {
      await api.post('/feedback', entry)
      await refresh()
    },
    [refresh],
  )

  const updateFeedback = useCallback(
    async (feedbackId, updates) => {
      await api.put(`/feedback/${feedbackId}`, updates)
      await refresh()
    },
    [refresh],
  )

  const deleteFeedback = useCallback(
    async (feedbackId) => {
      await api.delete(`/feedback/${feedbackId}`)
      await refresh()
    },
    [refresh],
  )

  const respondToFeedback = useCallback(
    async (feedbackId, response) => {
      await api.post(`/feedback/${feedbackId}/response`, { message: response.message })
      await refresh()
    },
    [refresh],
  )

  const deleteResponse = useCallback(
    async (feedbackId) => {
      await api.delete(`/feedback/${feedbackId}/response`)
      await refresh()
    },
    [refresh],
  )

  const value = useMemo(
    () => ({
      places,
      accommodations,
      feedback,
      loadError,
      refresh,
      savePlace,
      deletePlace,
      saveAccommodation,
      deleteAccommodation,
      addFeedback,
      updateFeedback,
      deleteFeedback,
      respondToFeedback,
      deleteResponse,
      filterPlaces: (filters) => filterPlaces(places, filters),
      getPlaceById: (id) => getPlaceById(places, id),
      getPopularDestinations: () => getPopularDestinations(places),
      getNearbyPlaces: (place) => getNearbyPlaces(places, place),
      getAccommodationsForPlace: (placeId) =>
        getAccommodationsForPlace(accommodations, places, placeId),
      getFeedbackForPlace: (placeId) => feedback.filter((item) => item.placeId === placeId),
      getFeedbackForUser: (userId) => feedback.filter((item) => item.userId === userId),
    }),
    [
      places,
      accommodations,
      feedback,
      loadError,
      refresh,
      savePlace,
      deletePlace,
      saveAccommodation,
      deleteAccommodation,
      addFeedback,
      updateFeedback,
      deleteFeedback,
      respondToFeedback,
      deleteResponse,
    ],
  )

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
}

export function useCatalog() {
  const context = useContext(CatalogContext)
  if (!context) {
    throw new Error('useCatalog must be used inside CatalogProvider')
  }
  return context
}

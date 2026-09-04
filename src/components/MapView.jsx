import { useEffect, useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import { Link } from 'react-router-dom'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useTrip } from '../context/TripContext'
import LoadingSpinner from './LoadingSpinner'

const SRI_LANKA_CENTER = [7.8731, 80.7718]

const pinIcon = L.divIcon({
  className: '',
  html: `<span style="display:block;width:18px;height:18px;border-radius:999px;background:#12382c;border:3px solid #c4a35a;box-shadow:0 6px 12px rgba(18,56,44,.35)"></span>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
  popupAnchor: [0, -12],
})

function MapFocus({ place }) {
  const map = useMap()

  useEffect(() => {
    if (!place) return
    map.flyTo([place.latitude, place.longitude], 12, { duration: 1.1 })
  }, [map, place])

  return null
}

export default function MapView({ places, focusPlace }) {
  const { addToTrip, isInTrip } = useTrip()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setReady(true)
  }, [])

  if (!ready) return <LoadingSpinner label="Loading map..." />

  return (
    <div className="h-[62vh] min-h-[420px] w-full overflow-hidden rounded-3xl border border-jungle/10 md:h-[72vh]">
      <MapContainer
        center={SRI_LANKA_CENTER}
        zoom={7}
        scrollWheelZoom
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapFocus place={focusPlace} />
        {places.map((place) => (
          <Marker key={place.id} position={[place.latitude, place.longitude]} icon={pinIcon}>
            <Popup>
              <div className="min-w-[180px]">
                <p className="font-semibold text-jungle">{place.name}</p>
                <p className="mt-1 text-xs text-muted">
                  {place.district} · {place.category} · ★ {place.rating}
                </p>
                <div className="mt-3 flex flex-col gap-2">
                  <Link
                    to={`/place/${place.id}`}
                    className="rounded-lg bg-jungle px-3 py-1.5 text-center text-xs font-semibold text-sand"
                  >
                    View Details
                  </Link>
                  <button
                    type="button"
                    onClick={() => addToTrip(place)}
                    className="rounded-lg border border-jungle/20 px-3 py-1.5 text-xs font-semibold text-jungle"
                  >
                    {isInTrip(place.id) ? 'In trip' : 'Add to Trip'}
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}

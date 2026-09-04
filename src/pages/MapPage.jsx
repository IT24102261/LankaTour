import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ExternalLink, MapPin } from 'lucide-react'
import SearchBar from '../components/SearchBar'
import EmptyState from '../components/EmptyState'
import { useCatalog } from '../context/CatalogContext'

function googleEmbedUrl(lat, lng, zoom = 14) {
  return `https://maps.google.com/maps?q=${lat},${lng}&z=${zoom}&hl=en&output=embed`
}

function googleSearchUrl(lat, lng, name) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${lat},${lng} ${name}`)}`
}

export default function MapPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { filterPlaces, getPlaceById } = useCatalog()

  const values = {
    search: searchParams.get('search') || '',
    district: searchParams.get('district') || '',
    category: searchParams.get('category') || '',
  }

  const focusId = searchParams.get('focus')
  const results = useMemo(
    () => filterPlaces(values),
    [filterPlaces, values.search, values.district, values.category],
  )
  const selected = getPlaceById(focusId) || results[0]
  const mapSrc = selected
    ? googleEmbedUrl(selected.latitude, selected.longitude, 15)
    : googleEmbedUrl(7.8731, 80.7718, 7)

  const updateParams = (next) => {
    const params = new URLSearchParams()
    if (next.search.trim()) params.set('search', next.search.trim())
    if (next.district) params.set('district', next.district)
    if (next.category) params.set('category', next.category)
    if (focusId) params.set('focus', focusId)
    setSearchParams(params)
  }

  const selectPlace = (id) => {
    const params = new URLSearchParams(searchParams)
    params.set('focus', id)
    setSearchParams(params)
  }

  return (
    <div>
      <section className="bg-jungle-deep px-4 py-10 text-sand sm:px-6">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">Locations</p>
          <h1 className="mt-2 font-display text-4xl">Places on Google Maps</h1>
          <p className="mt-3 max-w-2xl text-sand/80">
            Choose an attraction to pin its exact latitude and longitude on Google Maps.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
          <aside className="rounded-[1.75rem] border border-jungle/10 bg-white p-4 shadow-[0_18px_40px_rgba(18,56,44,0.08)] lg:max-h-[78vh] lg:overflow-auto">
            <SearchBar
              values={values}
              onChange={updateParams}
              onSubmit={(event) => {
                event.preventDefault()
                updateParams(values)
              }}
              compact
              submitLabel="Filter places"
            />
            <p className="mt-4 text-sm font-semibold text-jungle">{results.length} exact locations</p>
            <ul className="mt-3 space-y-2">
              {results.map((place) => (
                <li key={place.id}>
                  <button
                    type="button"
                    onClick={() => selectPlace(place.id)}
                    className={`w-full rounded-2xl px-3 py-3 text-left text-sm transition ${
                      selected?.id === place.id ? 'bg-jungle text-sand' : 'bg-sand text-jungle hover:bg-gold/20'
                    }`}
                  >
                    <span className="block font-semibold">{place.name}</span>
                    <span className="mt-1 flex items-center gap-1 text-xs opacity-80">
                      <MapPin className="h-3.5 w-3.5" />
                      {place.latitude.toFixed(4)}, {place.longitude.toFixed(4)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          {selected ? (
            <div className="overflow-hidden rounded-[1.75rem] border border-jungle/10 bg-white shadow-[0_18px_40px_rgba(18,56,44,0.08)]">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-jungle/10 px-5 py-4">
                <div>
                  <h2 className="font-display text-2xl text-jungle">{selected.name}</h2>
                  <p className="text-sm text-muted">
                    {selected.district} · {selected.latitude.toFixed(5)}, {selected.longitude.toFixed(5)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link
                    to={`/place/${selected.id}`}
                    className="rounded-full bg-jungle px-4 py-2 text-sm font-semibold text-sand"
                  >
                    View details
                  </Link>
                  <a
                    href={googleSearchUrl(selected.latitude, selected.longitude, selected.name)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 rounded-full border border-jungle/15 px-4 py-2 text-sm font-semibold text-jungle"
                  >
                    Open Google Maps
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
              <iframe
                title={`Google Map of ${selected.name}`}
                src={mapSrc}
                className="h-[62vh] min-h-[420px] w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          ) : (
            <EmptyState
              title="No places to map"
              message="No attractions match your current filters. Try another destination, district or category."
            />
          )}
        </div>
      </div>
    </div>
  )
}
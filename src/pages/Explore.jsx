import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import SearchBar from '../components/SearchBar'
import PlaceGrid from '../components/PlaceGrid'
import EmptyState from '../components/EmptyState'
import { useCatalog } from '../context/CatalogContext'

export default function Explore() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { filterPlaces, getPopularDestinations } = useCatalog()
  const [error, setError] = useState('')

  const values = {
    search: searchParams.get('search') || '',
    district: searchParams.get('district') || '',
    category: searchParams.get('category') || '',
    entryType: searchParams.get('entryType') || '',
  }

  const hasFilters = Boolean(
    values.search.trim() || values.district || values.category || values.entryType,
  )

  const results = useMemo(
    () => filterPlaces(values),
    [filterPlaces, values.search, values.district, values.category, values.entryType],
  )

  const popular = getPopularDestinations()
  const popularIds = new Set(popular.map((place) => place.id))
  const morePlaces = hasFilters ? results : results.filter((place) => !popularIds.has(place.id))

  const updateParams = (next) => {
    const params = new URLSearchParams()
    if (next.search.trim()) params.set('search', next.search.trim())
    if (next.district) params.set('district', next.district)
    if (next.category) params.set('category', next.category)
    if (next.entryType) params.set('entryType', next.entryType)
    setSearchParams(params)
    setError('')
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const hasQuery = values.search.trim() || values.district || values.category || values.entryType
    if (!hasQuery) {
      setError('Please enter a destination or select a district or category.')
      return
    }
    updateParams(values)
  }

  return (
    <div>
      <section className="relative overflow-hidden bg-jungle-deep px-4 py-12 sm:px-6">
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=70"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-jungle-deep/75" />
        <div className="relative mx-auto max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-gold">Tourist Place Finder</p>
          <h1 className="mt-2 font-display text-4xl text-sand">Explore Sri Lanka</h1>
          <p className="mt-3 max-w-2xl text-sand/80">
            Search by destination, then filter by district, category and entry type.
          </p>
          <div className="mt-6 rounded-3xl bg-cream p-4 text-ink shadow-xl sm:p-6">
            <SearchBar
              values={values}
              onChange={updateParams}
              onSubmit={handleSubmit}
              onClear={() => {
                setError('')
                setSearchParams({})
              }}
              error={error}
              showEntryType
              submitLabel="Search"
            />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        {!hasFilters ? (
          <section className="mb-14">
            <div className="mb-8 max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-wide text-palm">Popular Destinations</p>
              <h2 className="mt-2 font-display text-3xl text-jungle sm:text-4xl">Start with the classics</h2>
              <p className="mt-3 text-muted">
                Sigiriya, Ella, Kandy, Galle, Nuwara Eliya and Yala — six island highlights to open your
                itinerary.
              </p>
            </div>
            <PlaceGrid places={popular} />
          </section>
        ) : (
          <p className="mb-6 rounded-full bg-sand px-3 py-1 text-sm font-semibold text-jungle w-fit">
            {results.length} {results.length === 1 ? 'place' : 'places'} found
          </p>
        )}

        {hasFilters && !results.length ? (
          <EmptyState
            title="No matching places"
            message="No attractions match your current filters. Try another destination, district or category."
            actionLabel="Clear filters"
            actionTo="/explore"
          />
        ) : null}

        {hasFilters && results.length ? <PlaceGrid places={results} /> : null}

        {!hasFilters && morePlaces.length ? (
          <section>
            <div className="mb-8 max-w-2xl">
              <h2 className="font-display text-3xl text-jungle">More places to explore</h2>
              <p className="mt-2 text-muted">Temples, beaches, hikes and parks beyond the classics.</p>
            </div>
            <PlaceGrid places={morePlaces} />
          </section>
        ) : null}
      </div>
    </div>
  )
}

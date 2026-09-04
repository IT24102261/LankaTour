import { useMemo, useState } from 'react'
import { CalendarRange, Check, Filter, UtensilsCrossed } from 'lucide-react'
import { DISTRICTS, CATEGORIES } from '../data/places'
import { restaurantsForPlaces } from '../data/restaurants'
import { useCatalog } from '../context/CatalogContext'
import { useAuth } from '../context/AuthContext'
import { useNotice } from '../context/NoticeContext'
import { filterPlaces } from '../services/placeService'
import { loadTripPlans, saveTripPlans } from '../data/tripPlans'

export default function TripPlanner() {
  const { places } = useCatalog()
  const { currentUser } = useAuth()
  const { showNotice } = useNotice()

  const [district, setDistrict] = useState('')
  const [category, setCategory] = useState('')
  const [selectedIds, setSelectedIds] = useState([])
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')
  const [plans, setPlans] = useState(loadTripPlans)

  const filtered = useMemo(
    () => filterPlaces(places, { district, category }),
    [places, district, category],
  )

  const selectedPlaces = places.filter((place) => selectedIds.includes(place.id))
  const nearbyRestaurants = restaurantsForPlaces(selectedIds)

  const togglePlace = (id) => {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    )
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!selectedIds.length) {
      setError('Please select at least one tourist place.')
      return
    }
    if (!startDate || !endDate) {
      setError('Please choose a start date and an end date.')
      return
    }
    if (endDate < startDate) {
      setError('The end date must be on or after the start date.')
      return
    }

    const plan = {
      id: `plan-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      startDate,
      endDate,
      notes: notes.trim(),
      places: selectedPlaces.map((place) => ({
        id: place.id,
        name: place.name,
        district: place.district,
      })),
      restaurants: nearbyRestaurants.map((item) => item.name),
      createdAt: new Date().toISOString(),
    }

    const next = [plan, ...plans]
    saveTripPlans(next)
    setPlans(next)
    setError('')
    setSelectedIds([])
    setNotes('')
    showNotice('success', 'Your trip plan was submitted.')
  }

  const fieldClass =
    'w-full rounded-2xl border border-white/20 bg-white px-4 py-3 text-sm text-ink outline-none ring-gold/40 focus:ring-2'

  return (
    <div>
      <section className="relative overflow-hidden bg-jungle-deep px-4 py-14 text-sand sm:px-6">
        <img
          src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=80"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-jungle-deep via-jungle-deep/85 to-jungle-deep/40" />
        <div className="relative mx-auto max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">Trip planner</p>
          <h1 className="mt-3 max-w-2xl font-display text-4xl sm:text-5xl">Design your Sri Lanka days</h1>
          <p className="mt-4 max-w-xl text-sand/80">
            Filter places, pick travel dates and we will suggest nearby restaurants for the destinations
            you choose.
          </p>
        </div>
      </section>

      <form onSubmit={handleSubmit} className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <section className="rounded-[2rem] border border-jungle/10 bg-white p-6 shadow-[0_20px_50px_rgba(18,56,44,0.08)]">
              <h2 className="flex items-center gap-2 font-display text-2xl text-jungle">
                <Filter className="h-5 w-5 text-gold" /> Filter places
              </h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">
                    District
                  </span>
                  <select className={fieldClass} value={district} onChange={(event) => setDistrict(event.target.value)}>
                    <option value="">All districts</option>
                    {DISTRICTS.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">
                    Category
                  </span>
                  <select className={fieldClass} value={category} onChange={(event) => setCategory(event.target.value)}>
                    <option value="">All categories</option>
                    {CATEGORIES.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </label>
              </div>
              <p className="mt-4 text-sm text-muted">{filtered.length} matching places — tick the ones to visit.</p>
              <div className="mt-4 grid max-h-[28rem] gap-3 overflow-auto pr-1 sm:grid-cols-2">
                {filtered.map((place) => {
                  const checked = selectedIds.includes(place.id)
                  return (
                    <button
                      key={place.id}
                      type="button"
                      onClick={() => togglePlace(place.id)}
                      className={`flex items-center gap-3 rounded-2xl border p-3 text-left transition ${
                        checked
                          ? 'border-gold bg-sand shadow-sm'
                          : 'border-jungle/10 bg-cream/60 hover:border-gold/50'
                      }`}
                    >
                      <img src={place.image} alt="" className="h-14 w-14 shrink-0 rounded-xl object-cover" />
                      <span className="min-w-0">
                        <span className="block truncate font-semibold text-jungle">{place.name}</span>
                        <span className="text-xs text-muted">
                          {place.district} · {place.category}
                        </span>
                      </span>
                      {checked ? <Check className="ml-auto h-4 w-4 shrink-0 text-palm" /> : null}
                    </button>
                  )
                })}
              </div>
            </section>

            <section className="rounded-[2rem] border border-jungle/10 bg-white p-6 shadow-[0_20px_50px_rgba(18,56,44,0.08)]">
              <h2 className="flex items-center gap-2 font-display text-2xl text-jungle">
                <CalendarRange className="h-5 w-5 text-gold" /> Travel dates
              </h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">
                    Start date
                  </span>
                  <input type="date" className={fieldClass} value={startDate} onChange={(event) => setStartDate(event.target.value)} />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">
                    End date
                  </span>
                  <input type="date" className={fieldClass} value={endDate} onChange={(event) => setEndDate(event.target.value)} />
                </label>
              </div>
              <label className="mt-4 block">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">Notes</span>
                <textarea
                  rows={3}
                  className={fieldClass}
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder="Family trip, sunrise hikes, spicy food..."
                />
              </label>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-[2rem] bg-jungle p-6 text-sand shadow-xl">
              <h2 className="flex items-center gap-2 font-display text-2xl">
                <UtensilsCrossed className="h-5 w-5 text-gold" /> Nearby restaurants
              </h2>
              <p className="mt-2 text-sm text-sand/75">Suggested from the places you selected. No booking.</p>
              <div className="mt-4 space-y-3">
                {nearbyRestaurants.length ? (
                  nearbyRestaurants.map((item) => (
                    <article key={item.id} className="rounded-2xl bg-white/10 p-4">
                      <p className="font-semibold">{item.name}</p>
                      <p className="mt-1 text-sm text-sand/75">
                        {item.cuisine} · {item.distance} · {item.priceCategory} · ★ {item.rating}
                      </p>
                    </article>
                  ))
                ) : (
                  <p className="text-sm text-sand/70">Select places to see nearby restaurants.</p>
                )}
              </div>
            </section>

            {error ? (
              <p className="rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-950" role="alert">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              className="w-full rounded-2xl bg-gold py-4 text-sm font-semibold text-jungle-deep shadow-lg transition hover:brightness-105"
            >
              Submit trip plan
            </button>
          </aside>
        </div>
      </form>

      {plans.length ? (
        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
          <h2 className="font-display text-3xl text-jungle">Submitted plans</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {plans.map((plan) => (
              <article key={plan.id} className="rounded-[1.75rem] border border-jungle/10 bg-white p-5 shadow-sm">
                <p className="text-sm font-semibold text-palm">
                  {plan.startDate} → {plan.endDate}
                </p>
                <p className="mt-2 text-sm text-ink/80">{plan.places.map((place) => place.name).join(', ')}</p>
                {plan.restaurants.length ? (
                  <p className="mt-2 text-xs text-muted">Eats: {plan.restaurants.join(', ')}</p>
                ) : null}
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  )
}
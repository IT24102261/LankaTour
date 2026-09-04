import { useState } from 'react'

const fieldClass =
  'w-full rounded-xl border border-jungle/15 bg-white px-3 py-2.5 text-sm outline-none ring-gold/40 focus:ring-2'

const TYPES = ['Hotel', 'Guesthouse', 'Resort', 'Heritage Hotel', 'Boutique Hotel', 'Lodge', 'Camp', 'Homestay']
const PRICES = ['Budget', 'Mid-range', 'Premium']

const emptyStay = {
  placeId: '',
  name: '',
  type: 'Hotel',
  distance: '',
  rating: '4.3',
  priceCategory: 'Mid-range',
  latitude: '',
  longitude: '',
}

export default function AccommodationForm({ initialStay, places, onSave, onCancel }) {
  const [form, setForm] = useState(initialStay ? toForm(initialStay) : { ...emptyStay, placeId: places[0]?.id || '' })
  const [error, setError] = useState('')

  const setField = (key, value) => setForm((current) => ({ ...current, [key]: value }))

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!form.placeId) {
      setError('Please link this stay to a tourist place.')
      return
    }
    if (!form.name.trim() || !form.distance.trim()) {
      setError('Please enter the accommodation name and distance.')
      return
    }
    const latitude = Number(form.latitude)
    const longitude = Number(form.longitude)
    if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
      setError('Please enter valid map coordinates.')
      return
    }

    onSave({
      id: initialStay?.id || `acc-${Date.now()}`,
      placeId: form.placeId,
      name: form.name.trim(),
      type: form.type,
      distance: form.distance.trim(),
      rating: Number(form.rating) || 4,
      priceCategory: form.priceCategory,
      latitude,
      longitude,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl border border-jungle/10 bg-white p-5 shadow-sm">
      <h3 className="font-display text-2xl text-jungle">
        {initialStay ? 'Edit accommodation' : 'Add accommodation'}
      </h3>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <label className="block md:col-span-2">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">Linked place</span>
          <select className={fieldClass} value={form.placeId} onChange={(event) => setField('placeId', event.target.value)}>
            {places.map((place) => (
              <option key={place.id} value={place.id}>
                {place.name}
              </option>
            ))}
          </select>
        </label>
        <Input label="Name" value={form.name} onChange={(value) => setField('name', value)} />
        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">Type</span>
          <select className={fieldClass} value={form.type} onChange={(event) => setField('type', event.target.value)}>
            {TYPES.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
        </label>
        <Input label="Distance (e.g. 1.2 km)" value={form.distance} onChange={(value) => setField('distance', value)} />
        <Input label="Rating" value={form.rating} onChange={(value) => setField('rating', value)} />
        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">Price category</span>
          <select
            className={fieldClass}
            value={form.priceCategory}
            onChange={(event) => setField('priceCategory', event.target.value)}
          >
            {PRICES.map((price) => (
              <option key={price}>{price}</option>
            ))}
          </select>
        </label>
        <Input label="Latitude" value={form.latitude} onChange={(value) => setField('latitude', value)} />
        <Input label="Longitude" value={form.longitude} onChange={(value) => setField('longitude', value)} />
      </div>
      {error ? (
        <p className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-900" role="alert">
          {error}
        </p>
      ) : null}
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <button type="submit" className="rounded-xl bg-jungle px-4 py-2.5 text-sm font-semibold text-sand">
          Save stay
        </button>
        <button type="button" onClick={onCancel} className="rounded-xl border border-jungle/15 px-4 py-2.5 text-sm font-semibold">
          Cancel
        </button>
      </div>
    </form>
  )
}

function Input({ label, value, onChange }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">{label}</span>
      <input className={fieldClass} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  )
}

function toForm(stay) {
  return {
    ...stay,
    latitude: String(stay.latitude),
    longitude: String(stay.longitude),
    rating: String(stay.rating),
  }
}

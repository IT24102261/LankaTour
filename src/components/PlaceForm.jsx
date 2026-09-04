import { useState } from 'react'
import { CATEGORIES, DISTRICTS, ENTRY_TYPES } from '../data/places'

const fieldClass =
  'w-full rounded-xl border border-jungle/15 bg-white px-3 py-2.5 text-sm outline-none ring-gold/40 focus:ring-2'

const emptyPlace = {
  name: '',
  district: 'Kandy',
  province: 'Central',
  category: 'Historical',
  description: '',
  shortDescription: '',
  image: '',
  latitude: '7.2906',
  longitude: '80.6337',
  entryType: 'Paid',
  rating: '4.5',
  openingHours: '8:00 AM – 5:00 PM',
  recommendedDuration: '2 hours',
  bestTimeToVisit: 'December to April',
  nearbyPlaceIds: [],
}

function slugify(name) {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
  return `${base || 'place'}-${Date.now().toString().slice(-5)}`
}

export default function PlaceForm({ initialPlace, allPlaces, onSave, onCancel }) {
  const [form, setForm] = useState(initialPlace ? toForm(initialPlace) : emptyPlace)
  const [error, setError] = useState('')

  const setField = (key, value) => setForm((current) => ({ ...current, [key]: value }))

  const toggleNearby = (id) => {
    setForm((current) => {
      const exists = current.nearbyPlaceIds.includes(id)
      return {
        ...current,
        nearbyPlaceIds: exists
          ? current.nearbyPlaceIds.filter((item) => item !== id)
          : [...current.nearbyPlaceIds, id],
      }
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!form.name.trim()) {
      setError('Please enter the attraction name.')
      return
    }
    if (!form.shortDescription.trim() || !form.description.trim()) {
      setError('Please add a short description and a full description.')
      return
    }
    if (!form.image.trim()) {
      setError('Please add a publicly accessible image URL.')
      return
    }
    const latitude = Number(form.latitude)
    const longitude = Number(form.longitude)
    if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
      setError('Please enter valid latitude and longitude numbers.')
      return
    }

    onSave({
      id: initialPlace?.id || slugify(form.name),
      name: form.name.trim(),
      district: form.district,
      province: form.province.trim() || 'Sri Lanka',
      category: form.category,
      description: form.description.trim(),
      shortDescription: form.shortDescription.trim(),
      image: form.image.trim(),
      latitude,
      longitude,
      entryType: form.entryType,
      rating: Number(form.rating) || 4,
      openingHours: form.openingHours.trim(),
      recommendedDuration: form.recommendedDuration.trim(),
      bestTimeToVisit: form.bestTimeToVisit.trim(),
      nearbyPlaceIds: form.nearbyPlaceIds,
    })
  }

  const otherPlaces = allPlaces.filter((place) => place.id !== initialPlace?.id)

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl border border-jungle/10 bg-white p-5 shadow-sm">
      <h3 className="font-display text-2xl text-jungle">
        {initialPlace ? 'Edit place details' : 'Add tourist place'}
      </h3>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <Input label="Name" value={form.name} onChange={(value) => setField('name', value)} />
        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">District</span>
          <select className={fieldClass} value={form.district} onChange={(event) => setField('district', event.target.value)}>
            {DISTRICTS.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
        </label>
        <Input label="Province" value={form.province} onChange={(value) => setField('province', value)} />
        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">Category</span>
          <select className={fieldClass} value={form.category} onChange={(event) => setField('category', event.target.value)}>
            {CATEGORIES.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">Entry type</span>
          <select className={fieldClass} value={form.entryType} onChange={(event) => setField('entryType', event.target.value)}>
            {ENTRY_TYPES.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
        </label>
        <Input label="Rating (1–5)" value={form.rating} onChange={(value) => setField('rating', value)} />
        <Input label="Latitude" value={form.latitude} onChange={(value) => setField('latitude', value)} />
        <Input label="Longitude" value={form.longitude} onChange={(value) => setField('longitude', value)} />
        <div className="md:col-span-2">
          <Input label="Image URL" value={form.image} onChange={(value) => setField('image', value)} />
        </div>
        <div className="md:col-span-2">
          <Input
            label="Short description"
            value={form.shortDescription}
            onChange={(value) => setField('shortDescription', value)}
          />
        </div>
        <label className="block md:col-span-2">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">Full description</span>
          <textarea
            rows={4}
            className={fieldClass}
            value={form.description}
            onChange={(event) => setField('description', event.target.value)}
          />
        </label>
        <Input label="Opening hours" value={form.openingHours} onChange={(value) => setField('openingHours', value)} />
        <Input
          label="Recommended duration"
          value={form.recommendedDuration}
          onChange={(value) => setField('recommendedDuration', value)}
        />
        <div className="md:col-span-2">
          <Input
            label="Best time to visit"
            value={form.bestTimeToVisit}
            onChange={(value) => setField('bestTimeToVisit', value)}
          />
        </div>
      </div>

      <fieldset className="mt-4">
        <legend className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Nearby attractions</legend>
        <div className="grid max-h-40 grid-cols-1 gap-2 overflow-auto rounded-xl bg-cream p-3 sm:grid-cols-2">
          {otherPlaces.map((place) => (
            <label key={place.id} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.nearbyPlaceIds.includes(place.id)}
                onChange={() => toggleNearby(place.id)}
              />
              {place.name}
            </label>
          ))}
        </div>
      </fieldset>

      {error ? (
        <p className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-900" role="alert">
          {error}
        </p>
      ) : null}

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <button type="submit" className="rounded-xl bg-jungle px-4 py-2.5 text-sm font-semibold text-sand">
          Save place
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

function toForm(place) {
  return {
    ...place,
    latitude: String(place.latitude),
    longitude: String(place.longitude),
    rating: String(place.rating),
    nearbyPlaceIds: place.nearbyPlaceIds || [],
  }
}

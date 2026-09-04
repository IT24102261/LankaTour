import { MapPin, Trash2 } from 'lucide-react'

export default function TripItem({ place, onRemove }) {
  return (
    <article className="flex gap-4 rounded-2xl border border-jungle/10 bg-white p-3 shadow-sm">
      <img src={place.image} alt={place.name} className="h-24 w-28 shrink-0 rounded-xl object-cover" />
      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div>
          <h3 className="truncate font-semibold text-jungle">{place.name}</h3>
          <p className="mt-1 inline-flex items-center gap-1 text-sm text-muted">
            <MapPin className="h-4 w-4" />
            {place.district} · {place.category}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onRemove(place.id)}
          className="inline-flex w-fit items-center gap-1 text-sm font-semibold text-red-700"
        >
          <Trash2 className="h-4 w-4" />
          Remove
        </button>
      </div>
    </article>
  )
}
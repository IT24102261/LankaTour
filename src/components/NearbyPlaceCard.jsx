import { Link } from 'react-router-dom'

export default function NearbyPlaceCard({ place, distance }) {
  return (
    <article className="flex flex-col rounded-2xl border border-jungle/10 bg-white p-4 shadow-sm">
      <div className="mb-3 h-32 overflow-hidden rounded-xl">
        <img src={place.image} alt={place.name} className="h-full w-full object-cover" />
      </div>
      <h3 className="font-semibold text-jungle">{place.name}</h3>
      <p className="mt-1 text-sm text-muted">
        {place.category}
        {distance ? ` · ${distance}` : ''}
      </p>
      <Link
        to={`/place/${place.id}`}
        className="mt-4 rounded-xl bg-jungle px-3 py-2 text-center text-sm font-semibold text-sand"
      >
        View Details
      </Link>
    </article>
  )
}

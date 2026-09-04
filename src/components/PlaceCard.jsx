import { Link } from 'react-router-dom'
import { MapPin, Star } from 'lucide-react'

export default function PlaceCard({ place }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/90 shadow-[0_18px_40px_rgba(18,56,44,0.08)] backdrop-blur transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_55px_rgba(18,56,44,0.14)]">
      <div className="relative h-52 overflow-hidden">
        <img
          src={place.image}
          alt={place.name}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-jungle-deep/55 to-transparent" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <span className="rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-jungle">
            {place.category}
          </span>
          <span className="rounded-full bg-jungle/90 px-2.5 py-1 text-xs font-semibold text-sand">
            {place.entryType}
          </span>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-start justify-between gap-3">
          <h3 className="font-display text-xl leading-tight text-jungle">{place.name}</h3>
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-sand px-2 py-1 text-xs font-semibold text-jungle">
            <Star className="h-3.5 w-3.5 fill-gold text-gold" />
            {place.rating}
          </span>
        </div>
        <p className="mb-2 inline-flex items-center gap-1 text-sm text-muted">
          <MapPin className="h-4 w-4" />
          {place.district}
        </p>
        <p className="mb-5 flex-1 text-sm leading-relaxed text-ink/80">{place.shortDescription}</p>
        <Link
          to={`/place/${place.id}`}
          className="mt-auto rounded-full bg-jungle px-3 py-2.5 text-center text-sm font-semibold text-sand transition hover:bg-jungle-deep"
        >
          View Details
        </Link>
      </div>
    </article>
  )
}

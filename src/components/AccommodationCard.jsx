import { MapPin, Star } from 'lucide-react'

export default function AccommodationCard({ stay }) {
  const mapUrl = `https://www.openstreetmap.org/?mlat=${stay.latitude}&mlon=${stay.longitude}#map=16/${stay.latitude}/${stay.longitude}`

  return (
    <article className="rounded-2xl border border-jungle/10 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-jungle">{stay.name}</h3>
          <p className="text-sm text-muted">{stay.type}</p>
        </div>
        <span className="rounded-full bg-sand px-2.5 py-1 text-xs font-semibold text-jungle">
          {stay.priceCategory}
        </span>
      </div>
      <div className="mb-4 flex flex-wrap gap-3 text-sm text-muted">
        <span className="inline-flex items-center gap-1">
          <MapPin className="h-4 w-4" />
          {stay.distance}
        </span>
        <span className="inline-flex items-center gap-1">
          <Star className="h-4 w-4 fill-gold text-gold" />
          {stay.rating}
        </span>
      </div>
      <a
        href={mapUrl}
        target="_blank"
        rel="noreferrer"
        className="inline-flex w-full justify-center rounded-xl border border-jungle/15 px-3 py-2 text-sm font-semibold text-jungle hover:bg-sand"
      >
        View on Map
      </a>
    </article>
  )
}

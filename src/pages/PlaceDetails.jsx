import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Clock, Compass, MapPin, Star, Ticket } from 'lucide-react'
import AccommodationCard from '../components/AccommodationCard'
import NearbyPlaceCard from '../components/NearbyPlaceCard'
import EmptyState from '../components/EmptyState'
import FeedbackList from '../components/FeedbackList'
import { useCatalog } from '../context/CatalogContext'
import { useAuth } from '../context/AuthContext'
import { useNotice } from '../context/NoticeContext'
import { readImageFile } from '../utils/readImageFile'
import { restaurantsForPlaces } from '../data/restaurants'

export default function PlaceDetails() {
  const { id } = useParams()
  const {
    getPlaceById,
    getAccommodationsForPlace,
    getNearbyPlaces,
    getFeedbackForPlace,
    addFeedback,
  } = useCatalog()
  const place = getPlaceById(id)
  const { currentUser, isAdmin } = useAuth()
  const { showNotice } = useNotice()
  const [rating, setRating] = useState('5')
  const [comment, setComment] = useState('')
  const [photoUrl, setPhotoUrl] = useState('')
  const [formError, setFormError] = useState('')

  if (!place) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <EmptyState
          title="Place not found"
          message="Sorry, this tourist attraction could not be found."
          actionLabel="Explore Places"
          actionTo="/explore"
        />
      </div>
    )
  }

  const stays = getAccommodationsForPlace(place.id)
  const nearby = getNearbyPlaces(place)
  const reviews = getFeedbackForPlace(place.id)
  const dining = restaurantsForPlaces([place.id, ...(place.nearbyPlaceIds || [])])

  const handleFeedback = (event) => {
    event.preventDefault()
    if (!comment.trim()) {
      setFormError('Please write a short comment about this place.')
      return
    }
    addFeedback({
      id: `fb-${Date.now()}`,
      placeId: place.id,
      userId: currentUser.id,
      userName: currentUser.name,
      rating: Number(rating),
      comment: comment.trim(),
      photoUrl,
      createdAt: new Date().toISOString(),
      adminResponse: null,
    })
    setComment('')
    setPhotoUrl('')
    setFormError('')
    showNotice('success', 'Thank you. Your feedback was sent.')
  }

  return (
    <div>
      <div className="relative h-72 w-full sm:h-96">
        <img src={place.image} alt={place.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-jungle-deep via-jungle-deep/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 mx-auto max-w-7xl px-4 pb-8 sm:px-6">
          <div className="mb-3 flex flex-wrap gap-2">
            <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-jungle">
              {place.district}
            </span>
            <span className="rounded-full bg-gold px-3 py-1 text-xs font-semibold text-jungle-deep">
              {place.category}
            </span>
            <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-jungle">
              {place.entryType}
            </span>
          </div>
          <h1 className="font-display text-3xl text-sand sm:text-5xl">{place.name}</h1>
          <p className="mt-2 inline-flex items-center gap-1 text-sand/90">
            <Star className="h-4 w-4 fill-gold text-gold" /> {place.rating} rating
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
          <div className="rounded-3xl border border-jungle/10 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-base leading-relaxed text-ink/80">{place.description}</p>
            <dl className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-cream p-4">
                <dt className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted">
                  <Clock className="h-4 w-4" /> Opening hours
                </dt>
                <dd className="mt-1 font-medium text-jungle">{place.openingHours}</dd>
              </div>
              <div className="rounded-2xl bg-cream p-4">
                <dt className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted">
                  <Compass className="h-4 w-4" /> Recommended duration
                </dt>
                <dd className="mt-1 font-medium text-jungle">{place.recommendedDuration}</dd>
              </div>
              <div className="rounded-2xl bg-cream p-4 sm:col-span-2">
                <dt className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted">
                  <MapPin className="h-4 w-4" /> Coordinates
                </dt>
                <dd className="mt-1 font-medium text-jungle">
                  {place.latitude.toFixed(4)}, {place.longitude.toFixed(4)}
                </dd>
              </div>
            </dl>
          </div>

          <aside className="flex flex-col gap-3 rounded-3xl border border-jungle/10 bg-white p-6 shadow-sm">
            <Link
              to="/trip"
              className="w-full rounded-full bg-jungle px-4 py-3 text-center text-sm font-semibold text-sand"
            >
              Add to a trip plan
            </Link>
            <Link
              to={`/map?focus=${place.id}`}
              className="w-full rounded-full border border-jungle/15 px-4 py-3 text-center text-sm font-semibold text-jungle"
            >
              View on Google Maps
            </Link>
            <Link
              to="/feedback"
              className="w-full rounded-full bg-gold px-4 py-3 text-center text-sm font-semibold text-jungle-deep"
            >
              Leave feedback
            </Link>
            <p className="text-sm text-muted">
              Planning only — LankaTour does not take bookings or payments.
            </p>
          </aside>
        </div>

        <section className="mt-12">
          <h2 className="font-display text-3xl text-jungle">Nearby Accommodation</h2>
          <p className="mt-2 text-sm text-muted">Sample stays near this destination. No booking.</p>
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {stays.length ? (
              stays.map((stay) => <AccommodationCard key={stay.id} stay={stay} />)
            ) : (
              <p className="text-sm text-muted">No sample stays are linked to this attraction yet.</p>
            )}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="font-display text-3xl text-jungle">Nearby restaurants</h2>
          <p className="mt-2 text-sm text-muted">Places to eat around this stop. No reservations.</p>
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {dining.length ? (
              dining.map((item) => (
                <article key={item.id} className="rounded-2xl border border-jungle/10 bg-white p-5 shadow-sm">
                  <h3 className="font-semibold text-jungle">{item.name}</h3>
                  <p className="mt-1 text-sm text-muted">
                    {item.cuisine} · {item.distance} · {item.priceCategory} · ★ {item.rating}
                  </p>
                </article>
              ))
            ) : (
              <p className="text-sm text-muted">No sample restaurants are linked yet.</p>
            )}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="font-display text-3xl text-jungle">Nearby Attractions</h2>
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {nearby.length ? (
              nearby.map((item) => (
                <NearbyPlaceCard key={item.id} place={item} distance={item.distanceLabel} />
              ))
            ) : (
              <p className="text-sm text-muted">No nearby sample attractions are linked yet.</p>
            )}
          </div>
        </section>

        <section className="mt-12 rounded-3xl border border-jungle/10 bg-white p-6 sm:p-8">
          <h2 className="font-display text-3xl text-jungle">Visitor feedback</h2>
          <div className="mt-6">
            <FeedbackList
              items={reviews}
              placesById={{ [place.id]: place }}
              showPlaceLink={false}
              allowReply={isAdmin}
            />
          </div>
          {currentUser && !isAdmin ? (
            <form onSubmit={handleFeedback} className="mt-6 border-t border-jungle/10 pt-6">
              <p className="font-semibold text-jungle">Share your experience</p>
              <select
                className="mt-3 w-full rounded-xl border border-jungle/15 px-3 py-2 text-sm sm:max-w-xs"
                value={rating}
                onChange={(event) => setRating(event.target.value)}
              >
                {[5, 4, 3, 2, 1].map((value) => (
                  <option key={value} value={value}>
                    {value} stars
                  </option>
                ))}
              </select>
              <input type="file" accept="image/*" className="mt-3 w-full text-sm" onChange={async (event) => {
                const file = event.target.files?.[0]
                if (!file) return
                try {
                  setPhotoUrl(await readImageFile(file))
                  setFormError('')
                } catch (photoError) {
                  setFormError(photoError.message)
                }
              }} />
              {photoUrl ? (
                <img src={photoUrl} alt="Attached feedback" className="mt-3 max-h-48 rounded-xl object-cover" />
              ) : null}
              <textarea
                rows={3}
                className="mt-3 w-full rounded-xl border border-jungle/15 px-3 py-2 text-sm"
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                placeholder="What should other travellers know?"
              />
              {formError ? (
                <p className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-900" role="alert">
                  {formError}
                </p>
              ) : null}
              <button type="submit" className="mt-3 rounded-xl bg-jungle px-4 py-2 text-sm font-semibold text-sand">
                Submit feedback
              </button>
            </form>
          ) : !currentUser ? (
            <p className="mt-6 text-sm text-muted">
              <Link to="/login" className="font-semibold text-palm">
                Log in
              </Link>{' '}
              as a traveller to leave feedback.
            </p>
          ) : null}
        </section>

        <section className="mt-12 rounded-3xl border border-jungle/10 bg-white p-6 sm:p-8">
          <h2 className="font-display text-3xl text-jungle">Helpful Visit Information</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">Best time to visit</p>
              <p className="mt-1 font-medium text-jungle">{place.bestTimeToVisit}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">Suggested duration</p>
              <p className="mt-1 font-medium text-jungle">{place.recommendedDuration}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                <Ticket className="mr-1 inline h-4 w-4" />
                Entry type
              </p>
              <p className="mt-1 font-medium text-jungle">{place.entryType}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">District</p>
              <p className="mt-1 font-medium text-jungle">{place.district}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

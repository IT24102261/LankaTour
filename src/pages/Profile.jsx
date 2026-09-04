import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CalendarRange, MapPin, UtensilsCrossed } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useCatalog } from '../context/CatalogContext'
import { useNotice } from '../context/NoticeContext'
import { readImageFile } from '../utils/readImageFile'
import { loadTripPlansForUser } from '../data/tripPlans'
import FeedbackList from '../components/FeedbackList'

export default function Profile() {
  const { currentUser, isAdmin, updateProfile, logout } = useAuth()
  const { places, getFeedbackForUser, feedback } = useCatalog()
  const { showNotice } = useNotice()
  const navigate = useNavigate()
  const [name, setName] = useState(currentUser.name)
  const [error, setError] = useState('')

  const placesById = useMemo(
    () => Object.fromEntries(places.map((place) => [place.id, place])),
    [places],
  )
  const myFeedback = isAdmin ? feedback : getFeedbackForUser(currentUser.id)
  const myTripPlans = useMemo(
    () => loadTripPlansForUser(currentUser.id, currentUser.name),
    [currentUser.id, currentUser.name],
  )

  const saveName = (event) => {
    event.preventDefault()
    if (!name.trim()) {
      setError('Please enter your name.')
      return
    }
    updateProfile({ name: name.trim() })
      .then(() => {
        setError('')
        showNotice('success', 'Profile updated.')
      })
      .catch((profileError) => setError(profileError.response?.data?.message || 'Could not update profile.'))
  }

  const handlePhoto = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    try {
      const photoUrl = await readImageFile(file)
      await updateProfile({ photoUrl })
      showNotice('success', 'Profile photo updated.')
      setError('')
    } catch (photoError) {
      setError(photoError.message)
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-4xl text-jungle">Your profile</h1>
      <p className="mt-2 text-muted">Signed in to LankaTour as {currentUser.role}.</p>

      <section className="mt-8 grid gap-6 rounded-3xl border border-jungle/10 bg-white p-6 shadow-sm md:grid-cols-[200px_1fr]">
        <div className="text-center">
          <div className="mx-auto h-32 w-32 overflow-hidden rounded-full bg-sand">
            {currentUser.photoUrl ? (
              <img src={currentUser.photoUrl} alt={currentUser.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center font-display text-3xl text-jungle">
                {currentUser.name.slice(0, 1)}
              </div>
            )}
          </div>
          <label className="mt-4 inline-block cursor-pointer text-sm font-semibold text-palm">
            Change photo
            <input type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
          </label>
        </div>

        <form onSubmit={saveName} className="space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">Name</span>
            <input
              className="w-full rounded-xl border border-jungle/15 px-3 py-3 text-sm"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </label>
          <p className="text-sm text-muted">Email: {currentUser.email}</p>
          <p className="text-sm text-muted">Role: {currentUser.role}</p>
          {error ? (
            <p className="rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-900" role="alert">
              {error}
            </p>
          ) : null}
          <div className="flex flex-col gap-2 sm:flex-row">
            <button type="submit" className="rounded-xl bg-jungle px-4 py-2.5 text-sm font-semibold text-sand">
              Save profile
            </button>
            <button
              type="button"
              onClick={() => {
                logout()
                navigate('/')
              }}
              className="rounded-xl border border-jungle/15 px-4 py-2.5 text-sm font-semibold"
            >
              Log out
            </button>
            {isAdmin ? (
              <Link to="/admin" className="rounded-xl bg-gold px-4 py-2.5 text-center text-sm font-semibold text-jungle-deep">
                Open admin
              </Link>
            ) : null}
          </div>
        </form>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-2xl text-jungle">Your trip plans</h2>
        <p className="mt-1 text-sm text-muted">Plans you submitted from the Trip Planner page.</p>
        {myTripPlans.length ? (
          <div className="mt-4 space-y-4">
            {myTripPlans.map((plan) => (
              <article key={plan.id} className="rounded-3xl border border-jungle/10 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-center gap-2 text-sm text-palm">
                  <CalendarRange className="h-4 w-4" />
                  <span>
                    {plan.startDate} → {plan.endDate}
                  </span>
                </div>
                <ul className="mt-3 space-y-1 text-sm text-ink">
                  {plan.places?.map((place) => (
                    <li key={place.id} className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-palm" />
                      {place.name} ({place.district})
                    </li>
                  ))}
                </ul>
                {plan.restaurants?.length ? (
                  <p className="mt-3 flex items-start gap-2 text-sm text-muted">
                    <UtensilsCrossed className="mt-0.5 h-4 w-4 shrink-0 text-palm" />
                    Nearby restaurants: {plan.restaurants.join(', ')}
                  </p>
                ) : null}
                {plan.notes ? <p className="mt-3 text-sm text-muted">{plan.notes}</p> : null}
              </article>
            ))}
          </div>
        ) : (
          <p className="mt-4 rounded-2xl border border-dashed border-jungle/20 bg-white px-4 py-6 text-sm text-muted">
            No trip plans yet.{' '}
            <Link to="/trip" className="font-semibold text-palm">
              Open Trip Planner
            </Link>
          </p>
        )}
      </section>

      <section className="mt-10">
        <h2 className="font-display text-2xl text-jungle">{isAdmin ? 'All feedback' : 'Your feedback'}</h2>
        <div className="mt-4">
          <FeedbackList items={myFeedback} placesById={placesById} allowReply={isAdmin} />
        </div>
      </section>
    </div>
  )
}
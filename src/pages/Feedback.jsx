import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCatalog } from '../context/CatalogContext'
import { useNotice } from '../context/NoticeContext'
import { readImageFile } from '../utils/readImageFile'
import FeedbackList from '../components/FeedbackList'

export default function Feedback() {
  const { currentUser, isAdmin } = useAuth()
  const { places, addFeedback, getFeedbackForUser, getFeedbackForPlace, feedback } = useCatalog()
  const { showNotice } = useNotice()

  const [placeId, setPlaceId] = useState('')
  const [rating, setRating] = useState('5')
  const [comment, setComment] = useState('')
  const [photoUrl, setPhotoUrl] = useState('')
  const [error, setError] = useState('')

  const placesById = useMemo(
    () => Object.fromEntries(places.map((place) => [place.id, place])),
    [places],
  )

  const myFeedback = isAdmin ? feedback : getFeedbackForUser(currentUser.id)

  const handlePhoto = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    try {
      setPhotoUrl(await readImageFile(file))
      setError('')
    } catch (photoError) {
      setError(photoError.message)
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!placeId) {
      setError('Please select a tourist place.')
      return
    }
    if (!comment.trim()) {
      setError('Please write a short comment about your visit.')
      return
    }
    addFeedback({
      id: `fb-${Date.now()}`,
      placeId,
      userId: currentUser.id,
      userName: currentUser.name,
      rating: Number(rating),
      comment: comment.trim(),
      photoUrl,
      createdAt: new Date().toISOString(),
      adminResponse: null,
    })
    setError('')
    setComment('')
    setPhotoUrl('')
    showNotice('success', 'Thank you. Your feedback was sent.')
  }

  const fieldClass =
    'w-full rounded-xl border border-jungle/15 bg-white px-3 py-3 text-sm outline-none ring-gold/40 focus:ring-2'

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-4xl text-jungle">Place feedback</h1>
      <p className="mt-3 max-w-2xl text-muted">
        Share how a destination felt and attach a photo. A LankaTour admin can reply with helpful visit
        tips.
      </p>

      {isAdmin ? (
        <p className="mt-4 rounded-xl bg-sand px-4 py-3 text-sm text-jungle">
          You are signed in as admin. Reply, edit or delete feedback below, or manage places on the{' '}
          <Link to="/admin" className="font-semibold underline">
            Admin page
          </Link>
          .
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 rounded-3xl border border-jungle/10 bg-white p-6 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block md:col-span-2">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">
                Tourist place
              </span>
              <select className={fieldClass} value={placeId} onChange={(event) => setPlaceId(event.target.value)}>
                <option value="">Select a place</option>
                {places.map((place) => (
                  <option key={place.id} value={place.id}>
                    {place.name} ({place.district})
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">Rating</span>
              <select className={fieldClass} value={rating} onChange={(event) => setRating(event.target.value)}>
                {[5, 4, 3, 2, 1].map((value) => (
                  <option key={value} value={value}>
                    {value} star{value === 1 ? '' : 's'}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">Photo</span>
              <input type="file" accept="image/*" className={fieldClass} onChange={handlePhoto} />
            </label>
          </div>
          {photoUrl ? (
            <img src={photoUrl} alt="Attached feedback" className="mt-4 max-h-48 rounded-xl object-cover" />
          ) : null}
          <label className="mt-4 block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">Your comment</span>
            <textarea
              rows={4}
              className={fieldClass}
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              placeholder="What should other travellers know?"
            />
          </label>
          {error ? (
            <p className="mt-4 rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-900" role="alert">
              {error}
            </p>
          ) : null}
          <button type="submit" className="mt-5 w-full rounded-xl bg-jungle px-4 py-3 text-sm font-semibold text-sand sm:w-auto">
            Submit feedback
          </button>
        </form>
      )}

      <section className="mt-10">
        <h2 className="font-display text-2xl text-jungle">{isAdmin ? 'All feedback' : 'Your feedback'}</h2>
        <div className="mt-4">
          <FeedbackList items={myFeedback} placesById={placesById} allowReply={isAdmin} />
        </div>
      </section>

      {!isAdmin && placeId ? (
        <section className="mt-10">
          <h2 className="font-display text-2xl text-jungle">What others said</h2>
          <div className="mt-4">
            <FeedbackList
              items={getFeedbackForPlace(placeId)}
              placesById={placesById}
              showPlaceLink={false}
            />
          </div>
        </section>
      ) : null}
    </div>
  )
}
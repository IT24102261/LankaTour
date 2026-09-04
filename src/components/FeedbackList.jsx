import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Star } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useCatalog } from '../context/CatalogContext'
import { useNotice } from '../context/NoticeContext'
import { readImageFile } from '../utils/readImageFile'
 
export default function FeedbackList({ items, placesById, showPlaceLink = true, allowReply = false }) {
  const { currentUser, isAdmin } = useAuth()
  const { updateFeedback, deleteFeedback, respondToFeedback, deleteResponse } = useCatalog()
  const { showNotice } = useNotice()
  const [editingId, setEditingId] = useState(null)
  const [draft, setDraft] = useState({ comment: '', rating: '5', photoUrl: '' })
  const [editingReplyId, setEditingReplyId] = useState(null)
  const [replyDraft, setReplyDraft] = useState('')
  const [formError, setFormError] = useState('')

  if (!items.length) {
    return <p className="text-sm text-muted">No feedback yet for this selection.</p>
  }

  const startEdit = (item) => {
    setEditingId(item.id)
    setDraft({
      comment: item.comment,
      rating: String(item.rating),
      photoUrl: item.photoUrl || '',
    })
    setFormError('')
  }

  const saveEdit = async (item) => {
    if (!draft.comment.trim()) {
      setFormError('Please enter a comment before saving.')
      return
    }
    try {
      await updateFeedback(item.id, {
        comment: draft.comment.trim(),
        rating: Number(draft.rating),
        photoUrl: draft.photoUrl,
      })
      setEditingId(null)
      showNotice('success', 'Feedback updated.')
    } catch (error) {
      setFormError(error.response?.data?.message || 'Could not update feedback.')
    }
  }

  const handlePhoto = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    try {
      const photoUrl = await readImageFile(file)
      setDraft((current) => ({ ...current, photoUrl }))
      setFormError('')
    } catch (error) {
      setFormError(error.message)
    }
  }

  const saveReply = async (item) => {
    if (!replyDraft.trim()) {
      showNotice('warning', 'Please write a response before saving.')
      return
    }
    try {
      await respondToFeedback(item.id, { message: replyDraft.trim() })
      setEditingReplyId(null)
      setReplyDraft('')
      showNotice('success', 'Response saved.')
    } catch (error) {
      showNotice('warning', error.response?.data?.message || 'Could not save the response.')
    }
  }

  return (
    <div className="space-y-4">
      {items.map((item) => {
        const place = placesById[item.placeId]
        const canManage = isAdmin || currentUser?.id === item.userId
        const isEditing = editingId === item.id

        return (
          <article key={item.id} className="rounded-2xl border border-jungle/10 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-jungle">{item.userName}</p>
                {showPlaceLink && place ? (
                  <Link to={`/place/${place.id}`} className="text-sm text-palm hover:underline">
                    {place.name}
                  </Link>
                ) : null}
              </div>
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-jungle">
                <Star className="h-4 w-4 fill-gold text-gold" />
                {item.rating}/5
              </span>
            </div>

            {isEditing ? (
              <div className="mt-3 space-y-3">
                <select
                  className="w-full rounded-xl border border-jungle/15 px-3 py-2 text-sm sm:max-w-xs"
                  value={draft.rating}
                  onChange={(event) => setDraft((current) => ({ ...current, rating: event.target.value }))}
                >
                  {[5, 4, 3, 2, 1].map((value) => (
                    <option key={value} value={value}>
                      {value} stars
                    </option>
                  ))}
                </select>
                <textarea
                  rows={3}
                  className="w-full rounded-xl border border-jungle/15 px-3 py-2 text-sm"
                  value={draft.comment}
                  onChange={(event) => setDraft((current) => ({ ...current, comment: event.target.value }))}
                />
                <input type="file" accept="image/*" onChange={handlePhoto} />
                {draft.photoUrl ? (
                  <img src={draft.photoUrl} alt="Feedback" className="mt-2 max-h-48 rounded-xl object-cover" />
                ) : null}
                {formError ? (
                  <p className="rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-900">{formError}</p>
                ) : null}
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => saveEdit(item)}
                    className="rounded-xl bg-jungle px-3 py-2 text-sm font-semibold text-sand"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    className="rounded-xl border border-jungle/15 px-3 py-2 text-sm font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p className="mt-3 text-sm leading-relaxed text-ink/80">{item.comment}</p>
                {item.photoUrl ? (
                  <img
                    src={item.photoUrl}
                    alt={`Photo from ${item.userName}`}
                    className="mt-3 max-h-56 w-full rounded-xl object-cover"
                  />
                ) : null}
                <p className="mt-2 text-xs text-muted">{new Date(item.createdAt).toLocaleString()}</p>
              </>
            )}

            {item.adminResponse && editingReplyId !== item.id ? (
              <div className="mt-3 rounded-xl bg-sand px-3 py-3 text-sm">
                <p className="font-semibold text-jungle">Admin response · {item.adminResponse.adminName}</p>
                <p className="mt-1 text-ink/80">{item.adminResponse.message}</p>
                {isAdmin ? (
                  <div className="mt-2 flex flex-wrap gap-3">
                    <button
                      type="button"
                      className="text-sm font-semibold text-palm"
                      onClick={() => {
                        setEditingReplyId(item.id)
                        setReplyDraft(item.adminResponse.message)
                      }}
                    >
                      Edit response
                    </button>
                    <button
                      type="button"
                      className="text-sm font-semibold text-red-700"
                      onClick={() => {
                        deleteResponse(item.id)
                        showNotice('success', 'Admin response removed.')
                      }}
                    >
                      Delete response
                    </button>
                  </div>
                ) : null}
              </div>
            ) : null}

            {allowReply && isAdmin && (!item.adminResponse || editingReplyId === item.id) ? (
              <div className="mt-3">
                <textarea
                  rows={3}
                  className="w-full rounded-xl border border-jungle/15 px-3 py-2 text-sm"
                  placeholder="Write a helpful reply..."
                  value={editingReplyId === item.id ? replyDraft : replyDraft}
                  onChange={(event) => {
                    setEditingReplyId(item.id)
                    setReplyDraft(event.target.value)
                  }}
                />
                <div className="mt-2 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => saveReply(item)}
                    className="rounded-xl bg-jungle px-3 py-2 text-sm font-semibold text-sand"
                  >
                    {item.adminResponse ? 'Save response' : 'Send response'}
                  </button>
                  {editingReplyId === item.id ? (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingReplyId(null)
                        setReplyDraft('')
                      }}
                      className="rounded-xl border border-jungle/15 px-3 py-2 text-sm font-semibold"
                    >
                      Cancel
                    </button>
                  ) : null}
                </div>
              </div>
            ) : null}

            {canManage && !isEditing ? (
              <div className="mt-3 flex flex-wrap gap-3">
                <button type="button" className="text-sm font-semibold text-palm" onClick={() => startEdit(item)}>
                  Edit feedback
                </button>
                <button
                  type="button"
                  className="text-sm font-semibold text-red-700"
                  onClick={() => {
                    deleteFeedback(item.id)
                    showNotice('success', 'Feedback deleted.')
                  }}
                >
                  Delete feedback
                </button>
              </div>
            ) : null}
          </article>
        )
      })}
    </div>
  )
}
import { useMemo, useState } from 'react'
import PlaceForm from '../components/PlaceForm'
import AccommodationForm from '../components/AccommodationForm'
import FeedbackList from '../components/FeedbackList'
import { useCatalog } from '../context/CatalogContext'
import { useNotice } from '../context/NoticeContext'

const tabs = [
  { id: 'places', label: 'Tourist places' },
  { id: 'stays', label: 'Accommodation' },
  { id: 'feedback', label: 'Feedback replies' },
]

export default function Admin() {
  const {
    places,
    accommodations,
    feedback,
    savePlace,
    deletePlace,
    saveAccommodation,
    deleteAccommodation,
  } = useCatalog()
  const { showNotice } = useNotice()

  const [tab, setTab] = useState('places')
  const [editingPlace, setEditingPlace] = useState(null)
  const [addingPlace, setAddingPlace] = useState(false)
  const [editingStay, setEditingStay] = useState(null)
  const [addingStay, setAddingStay] = useState(false)

  const pendingCount = feedback.filter((item) => !item.adminResponse).length

  const placesByName = useMemo(
    () => Object.fromEntries(places.map((place) => [place.id, place.name])),
    [places],
  )

  const handleSavePlace = (place) => {
    savePlace(place, { isNew: addingPlace && !editingPlace })
    showNotice('success', `${place.name} saved.`)
    setAddingPlace(false)
    setEditingPlace(null)
  }

  const handleSaveStay = (stay) => {
    saveAccommodation(stay, { isNew: addingStay && !editingStay })
    showNotice('success', `${stay.name} saved.`)
    setAddingStay(false)
    setEditingStay(null)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-wide text-palm">Administration</p>
      <h1 className="mt-2 font-display text-4xl text-jungle">Manage LankaTour content</h1>
      <p className="mt-3 max-w-2xl text-muted">
        Add tourist places, accommodation details and reply to visitor feedback. Changes are stored in
        this browser until a Node.js API is connected.
      </p>

      <div className="mt-8 flex flex-col gap-2 sm:flex-row">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              tab === item.id ? 'bg-jungle text-sand' : 'bg-white text-jungle'
            }`}
          >
            {item.label}
            {item.id === 'feedback' && pendingCount ? ` (${pendingCount})` : ''}
          </button>
        ))}
      </div>

      {tab === 'places' ? (
        <section className="mt-8">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-2xl text-jungle">{places.length} places</h2>
            <button
              type="button"
              onClick={() => {
                setEditingPlace(null)
                setAddingPlace(true)
              }}
              className="rounded-xl bg-gold px-4 py-2.5 text-sm font-semibold text-jungle-deep"
            >
              Add tourist place
            </button>
          </div>
          {addingPlace || editingPlace ? (
            <div className="mb-6">
              <PlaceForm
                key={editingPlace?.id || 'new-place'}
                initialPlace={editingPlace}
                allPlaces={places}
                onSave={handleSavePlace}
                onCancel={() => {
                  setAddingPlace(false)
                  setEditingPlace(null)
                }}
              />
            </div>
          ) : null}
          <div className="overflow-x-auto rounded-3xl border border-jungle/10 bg-white">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-sand text-jungle">
                <tr>
                  <th className="px-4 py-3">Place</th>
                  <th className="px-4 py-3">District</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Entry</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {places.map((place) => (
                  <tr key={place.id} className="border-t border-jungle/10">
                    <td className="px-4 py-3 font-medium text-jungle">{place.name}</td>
                    <td className="px-4 py-3">{place.district}</td>
                    <td className="px-4 py-3">{place.category}</td>
                    <td className="px-4 py-3">{place.entryType}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-2 sm:flex-row">
                        <button
                          type="button"
                          className="text-sm font-semibold text-palm"
                          onClick={() => {
                            setAddingPlace(false)
                            setEditingPlace(place)
                          }}
                        >
                          Edit details
                        </button>
                        <button
                          type="button"
                          className="text-sm font-semibold text-red-700"
                          onClick={() => {
                            deletePlace(place.id)
                            showNotice('success', `${place.name} removed.`)
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      {tab === 'stays' ? (
        <section className="mt-8">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-2xl text-jungle">{accommodations.length} stays</h2>
            <button
              type="button"
              onClick={() => {
                setEditingStay(null)
                setAddingStay(true)
              }}
              className="rounded-xl bg-gold px-4 py-2.5 text-sm font-semibold text-jungle-deep"
            >
              Add accommodation
            </button>
          </div>
          {addingStay || editingStay ? (
            <div className="mb-6">
              <AccommodationForm
                key={editingStay?.id || 'new-stay'}
                initialStay={editingStay}
                places={places}
                onSave={handleSaveStay}
                onCancel={() => {
                  setAddingStay(false)
                  setEditingStay(null)
                }}
              />
            </div>
          ) : null}
          <div className="overflow-x-auto rounded-3xl border border-jungle/10 bg-white">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-sand text-jungle">
                <tr>
                  <th className="px-4 py-3">Stay</th>
                  <th className="px-4 py-3">Linked place</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {accommodations.map((stay) => (
                  <tr key={stay.id} className="border-t border-jungle/10">
                    <td className="px-4 py-3 font-medium text-jungle">{stay.name}</td>
                    <td className="px-4 py-3">{placesByName[stay.placeId] || stay.placeId}</td>
                    <td className="px-4 py-3">{stay.type}</td>
                    <td className="px-4 py-3">{stay.priceCategory}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-2 sm:flex-row">
                        <button
                          type="button"
                          className="text-sm font-semibold text-palm"
                          onClick={() => {
                            setAddingStay(false)
                            setEditingStay(stay)
                          }}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="text-sm font-semibold text-red-700"
                          onClick={() => {
                            deleteAccommodation(stay.id)
                            showNotice('success', `${stay.name} removed.`)
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      {tab === 'feedback' ? (
        <section className="mt-8">
          <h2 className="mb-4 font-display text-2xl text-jungle">Traveller feedback</h2>
          <FeedbackList
            items={feedback}
            placesById={Object.fromEntries(places.map((place) => [place.id, place]))}
            allowReply
          />
        </section>
      ) : null}
    </div>
  )
}
import { CheckCircle2, Users } from 'lucide-react'

const features = [
  'Tourist Place Finder',
  'Place Details',
  'Nearby Accommodation',
  'Nearby Attractions',
  'Visitor Feedback',
  'Admin Content Manager',
]

const users = ['Foreign tourists', 'Local travellers', 'Families', 'Independent travellers']

const valuePoints = [
  'Reduces travel-planning effort',
  'Makes Sri Lankan destinations easier to discover',
  'Helps tourists organize destinations',
  'Promotes tourism locations across Sri Lanka',
]

export default function About() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-wide text-palm">About</p>
      <h1 className="mt-2 font-display text-4xl text-jungle">LankaTour – Smart Sri Lanka Travel Planner</h1>

      <section className="mt-10 rounded-3xl border border-jungle/10 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="font-display text-2xl text-jungle">Problem</h2>
        <p className="mt-3 leading-relaxed text-ink/80">
          Visitors to Sri Lanka often depend on separate platforms to discover tourist attractions,
          identify nearby accommodation and organize their travel itinerary. This makes travel planning
          fragmented and time-consuming.
        </p>
      </section>

      <section className="mt-6 rounded-3xl bg-jungle p-6 text-sand sm:p-8">
        <h2 className="inline-flex items-center gap-2 font-display text-2xl">
          <Users className="h-6 w-6 text-gold" /> Affected users
        </h2>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {users.map((user) => (
            <li key={user} className="rounded-xl bg-white/10 px-4 py-3">
              {user}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6 rounded-3xl border border-jungle/10 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="font-display text-2xl text-jungle">Solution</h2>
        <p className="mt-3 leading-relaxed text-ink/80">
          LankaTour provides one easy-to-use tourism platform where users can discover attractions,
          find nearby accommodation and attractions, share photo feedback, and receive admin replies.
        </p>
      </section>

      <section className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-jungle/10 bg-white p-6 shadow-sm">
          <h2 className="font-display text-2xl text-jungle">Main features</h2>
          <ul className="mt-4 space-y-2">
            {features.map((feature) => (
              <li key={feature} className="flex items-center gap-2 text-ink/80">
                <CheckCircle2 className="h-4 w-4 text-palm" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-3xl border border-jungle/10 bg-white p-6 shadow-sm">
          <h2 className="font-display text-2xl text-jungle">Expected value</h2>
          <ul className="mt-4 space-y-2">
            {valuePoints.map((point) => (
              <li key={point} className="flex items-center gap-2 text-ink/80">
                <CheckCircle2 className="h-4 w-4 text-gold" />
                {point}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}

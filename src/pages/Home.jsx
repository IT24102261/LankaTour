import { Compass, Hotel, MessageSquare, NotebookPen } from 'lucide-react'
import Hero from '../components/Hero'

const reasons = [
  {
    title: 'Discover Attractions',
    text: 'Search and filter Sri Lankan landmarks, beaches, temples and wildlife parks in one catalogue.',
    icon: Compass,
  },
  {
    title: 'Plan With Dates',
    text: 'Submit a trip form: choose places, travel dates and nearby restaurants in one flow.',
    icon: NotebookPen,
  },
  {
    title: 'Find Nearby Stays',
    text: 'View sample hotels and guesthouses around a place — no booking, just planning context.',
    icon: Hotel,
  },
  {
    title: 'Share Feedback',
    text: 'Rate places, attach a photo and read admin replies to plan with more confidence.',
    icon: MessageSquare,
  },
]

export default function Home() {
  return (
    <div>
      <Hero />

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-10 text-center">
            <h2 className="font-display text-3xl text-jungle sm:text-4xl">Why LankaTour?</h2>
            <p className="mx-auto mt-3 max-w-2xl text-muted">
              One responsive planner instead of jumping between attraction lists, maps and hotel sites.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
            {reasons.map((reason) => (
              <article
                key={reason.title}
                className="rounded-[1.75rem] border border-white bg-white/80 p-7 shadow-[0_16px_40px_rgba(18,56,44,0.06)] backdrop-blur"
              >
                <reason.icon className="mb-4 h-8 w-8 text-palm" />
                <h3 className="font-display text-xl text-jungle">{reason.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{reason.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="relative overflow-hidden rounded-[2.2rem] bg-jungle px-6 py-14 text-sand sm:px-12">
          <div className="pointer-events-none absolute -right-10 top-0 h-48 w-48 rounded-full bg-gold/20 blur-3xl" />
          <p className="text-sm font-semibold uppercase tracking-wide text-gold">Sri Lankan problem</p>
          <h2 className="mt-3 max-w-3xl font-display text-3xl sm:text-4xl">
            Making Sri Lankan Travel Planning Simpler
          </h2>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-sand/85">
            Tourists visiting Sri Lanka often use multiple websites and applications to discover
            attractions, locate nearby accommodation and organize their journey. LankaTour brings these
            essential travel-planning functions into one simple platform.
          </p>
        </div>
      </section>
    </div>
  )
}

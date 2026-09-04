import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <section className="relative min-h-[78vh] overflow-hidden bg-jungle-deep text-sand">
      <img
        src="https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9?auto=format&fit=crop&w=2000&q=80"
        alt="Tea country and tropical hills in Sri Lanka"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-jungle-deep via-jungle-deep/75 to-transparent" />
      <div className="relative mx-auto flex min-h-[78vh] max-w-7xl items-center px-4 py-20 sm:px-6">
        <div className="max-w-2xl">
          <p className="mb-5 inline-flex rounded-full border border-gold/50 bg-black/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.28em] text-gold backdrop-blur">
            LankaTour · Island journeys
          </p>
          <h1 className="font-display text-5xl leading-[1.05] sm:text-6xl lg:text-7xl">
            Discover Sri Lanka, Your Way
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-sand/90">
            Search attractions, taste nearby kitchens, and submit a dated trip plan — all in one calm,
            beautiful planner.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/explore"
              className="inline-flex justify-center rounded-full bg-gold px-8 py-3.5 text-sm font-semibold text-jungle-deep shadow-lg shadow-black/20 transition hover:brightness-110"
            >
              Explore Places
            </Link>
            <Link
              to="/map"
              className="inline-flex justify-center rounded-full border border-white/30 bg-white/10 px-8 py-3.5 text-sm font-semibold text-sand backdrop-blur transition hover:bg-white/20"
            >
              View map
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

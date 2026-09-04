import { Link } from 'react-router-dom'
import { Compass, MapPin } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Footer() {
  const { isAdmin, currentUser } = useAuth()

  return (
    <footer className="mt-auto border-t border-jungle/10 bg-jungle-deep text-sand">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <Compass className="h-5 w-5 text-gold" />
            <span className="font-display text-xl">LankaTour</span>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-sand/80">
            Smart Sri Lanka Travel Planner — discover attractions, nearby stays and visitor feedback in
            one place.
          </p>
        </div>
        <div>
          <p className="mb-3 font-semibold">Explore</p>
          <div className="flex flex-col gap-2 text-sm text-sand/80">
            <Link to="/explore" className="hover:text-gold">
              Explore Places
            </Link>
            {!isAdmin ? (
              <Link to="/map" className="hover:text-gold">
                Map
              </Link>
            ) : null}
            {currentUser && !isAdmin ? (
              <Link to="/trip" className="hover:text-gold">
                Trip Planner
              </Link>
            ) : null}
            {currentUser ? (
              <Link to="/feedback" className="hover:text-gold">
                Feedback
              </Link>
            ) : null}
            {isAdmin ? (
              <Link to="/admin" className="hover:text-gold">
                Admin
              </Link>
            ) : null}
            {currentUser ? (
              <Link to="/profile" className="hover:text-gold">
                Profile
              </Link>
            ) : (
              <Link to="/login" className="hover:text-gold">
                Login
              </Link>
            )}
            {!isAdmin ? (
              <Link to="/about" className="hover:text-gold">
                Problem & Solution
              </Link>
            ) : null}
          </div>
        </div>
        <div>
          <p className="mb-3 font-semibold">Sri Lanka</p>
          <p className="flex items-start gap-2 text-sm text-sand/80">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
            Built for tourists and local travellers exploring destinations across the island.
          </p>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-sand/60">
        LankaTour · University mini hackathon demo · Sample data only · No bookings or payments
      </div>
    </footer>
  )
}
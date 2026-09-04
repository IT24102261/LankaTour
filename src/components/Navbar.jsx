import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Compass, Menu, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { currentUser, isAdmin, logout } = useAuth()
  const navigate = useNavigate()

  const close = () => setOpen(false)

  const handleLogout = () => {
    logout()
    close()
    navigate('/')
  }

  const links = isAdmin
    ? [
        { to: '/explore', label: 'Explore Places' },
        { to: '/feedback', label: 'Feedback' },
        { to: '/admin', label: 'Admin' },
        { to: '/profile', label: 'Profile' },
      ]
    : currentUser
      ? [
          { to: '/', label: 'Home' },
          { to: '/explore', label: 'Explore Places' },
          { to: '/map', label: 'Map' },
          { to: '/trip', label: 'Trip Planner' },
          { to: '/feedback', label: 'Feedback' },
          { to: '/about', label: 'About' },
          { to: '/profile', label: 'Profile' },
        ]
      : [
          { to: '/', label: 'Home' },
          { to: '/explore', label: 'Explore Places' },
          { to: '/map', label: 'Map' },
          { to: '/about', label: 'About' },
        ]

  const linkClass = ({ isActive }) =>
    `rounded-full px-3 py-2 text-sm font-medium transition ${
      isActive ? 'bg-jungle text-sand' : 'text-jungle hover:bg-sand'
    }`

  const mobileClass = ({ isActive }) =>
    `rounded-xl px-4 py-3 text-sm font-medium ${
      isActive ? 'bg-jungle text-sand' : 'text-jungle hover:bg-sand'
    }`

  return (
    <header className="sticky top-0 z-40 border-b border-white/40 bg-cream/80 shadow-[0_8px_30px_rgba(18,56,44,0.06)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link to={isAdmin ? '/explore' : '/'} className="flex min-w-0 items-center gap-2 text-jungle" onClick={close}>
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-jungle to-palm text-sand shadow-md">
            <Compass className="h-5 w-5" />
          </span>
          <span className="leading-tight">
            <span className="block font-display text-lg font-semibold tracking-tight">LankaTour</span>
            <span className="hidden text-xs text-muted sm:block">Smart Sri Lanka Travel Planner</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 xl:flex">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className={linkClass}>
              {link.label}
            </NavLink>
          ))}
          {currentUser ? (
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full px-3 py-2 text-sm font-medium text-jungle hover:bg-sand"
            >
              Log out
            </button>
          ) : (
            <NavLink to="/login" className={linkClass}>
              Login
            </NavLink>
          )}
        </nav>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-full border border-jungle/15 p-2 text-jungle xl:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <nav className="border-t border-jungle/10 bg-cream px-4 py-3 xl:hidden">
          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} onClick={close} className={mobileClass}>
                {link.label}
              </NavLink>
            ))}
            {currentUser ? (
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-xl px-4 py-3 text-left text-sm font-medium text-jungle hover:bg-sand"
              >
                Log out ({currentUser.name})
              </button>
            ) : (
              <NavLink to="/login" onClick={close} className={mobileClass}>
                Login
              </NavLink>
            )}
          </div>
        </nav>
      ) : null}
    </header>
  )
}

import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import Toast from './Toast'
import { useCatalog } from '../context/CatalogContext'

export default function Layout() {
  const { loadError } = useCatalog()

  return (
    <div className="flex min-h-svh flex-col bg-cream">
      <Navbar />
      {loadError ? (
        <div className="bg-amber-50 px-4 py-3 text-center text-sm text-amber-950">{loadError}</div>
      ) : null}
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <Toast />
    </div>
  )
}

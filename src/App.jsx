import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { NoticeProvider } from './context/NoticeContext'
import { AuthProvider } from './context/AuthContext'
import { CatalogProvider } from './context/CatalogContext'
import Layout from './components/Layout'
import RequireAuth from './components/RequireAuth'
import Home from './pages/Home'
import Explore from './pages/Explore'
import MapPage from './pages/MapPage'
import PlaceDetails from './pages/PlaceDetails'
import About from './pages/About'
import Login from './pages/Login'
import Register from './pages/Register'
import Feedback from './pages/Feedback'
import Admin from './pages/Admin'
import Profile from './pages/Profile'
import TripPlanner from './pages/TripPlanner'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <NoticeProvider>
      <AuthProvider>
        <CatalogProvider>
            <BrowserRouter>
              <Routes>
                <Route element={<Layout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/explore" element={<Explore />} />
                  <Route path="/map" element={<MapPage />} />
                  <Route path="/place/:id" element={<PlaceDetails />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route
                    path="/profile"
                    element={
                      <RequireAuth>
                        <Profile />
                      </RequireAuth>
                    }
                  />
                  <Route
                    path="/trip"
                    element={
                      <RequireAuth>
                        <TripPlanner />
                      </RequireAuth>
                    }
                  />
                  <Route
                    path="/feedback"
                    element={
                      <RequireAuth>
                        <Feedback />
                      </RequireAuth>
                    }
                  />
                  <Route
                    path="/admin"
                    element={
                      <RequireAuth role="admin">
                        <Admin />
                      </RequireAuth>
                    }
                  />
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </BrowserRouter>
        </CatalogProvider>
      </AuthProvider>
    </NoticeProvider>
  )
}

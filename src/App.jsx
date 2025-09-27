import { Routes, Route } from 'react-router-dom'
import Nav from './components/Nav'
import Login from './pages/login'
import Register from './pages/register'
import Home from './pages/home'
import Profile from './pages/profile'
import ProtectedRoute from './routes/ProtectedRoute'

export default function App() {
  return (
    <div className="app-shell">
      <Nav />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
        <Route path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
      </Routes>
    </div>
  )
}

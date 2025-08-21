// src/App.tsx
import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Login from './pages/Login'
import Items from './pages/Items'
import Public from './pages/Public'

export default function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'))

  const isAuth = Boolean(token)

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 container mx-auto p-4">
          <Routes>
            {/* Página pública */}
            <Route path="/public" element={<Public />} />

            {/* Login recebe setToken */}
            <Route path="/login" element={<Login setToken={setToken} />} />

            {/* Home recebe token e setToken */}
            <Route
              path="/"
              element={isAuth ? <Home token={token!} setToken={setToken} /> : <Navigate to="/login" />}
            />

            {/* Items (admin) protegido também */}
            <Route
              path="/items"
              element={isAuth ? <Items /> : <Navigate to="/login" />}
            />

            {/* fallback */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}





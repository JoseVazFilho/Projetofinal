import { useState } from 'react'
import Login from './pages/Login'
import Home from './pages/Home'
import Public from './pages/Public'

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'))
  const isPublic = window.location.pathname === '/public'

  if (isPublic) return <Public />
  if (!token) return <Login setToken={setToken} />
  return <Home token={token} setToken={setToken} onItemAdded={async () => {}} />
}

export default App

import { useState } from 'react'
import axios from 'axios'

export default function Login({ setToken }: { setToken: (t: string) => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const { data } = await axios.post('http://localhost:3000/auth/login', { email, password })
    localStorage.setItem('token', data.token)
    setToken(data.token)
  }

  return (
    <form onSubmit={handleLogin} className="p-4 max-w-md mx-auto">
      <h1 className="text-xl mb-4">Login</h1>
      <input className="border p-2 w-full mb-2" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <input className="border p-2 w-full mb-2" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Senha" />
      <button className="bg-blue-500 text-white px-4 py-2" type="submit">Entrar</button>
    </form>
  )
}

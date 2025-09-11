import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

type LoginProps = { setToken: (t: string | null) => void }

export default function Login({ setToken }: LoginProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const navigate = useNavigate() // 👈 hook para redirecionar

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError(null)

    try {
      const { data } = await axios.post('/auth/login', { email, password })
      localStorage.setItem('token', data.token)
      localStorage.setItem('isAdmin', data.isAdmin ? 'true' : 'false') // NOVO
      setToken(data.token)
      navigate("/")   // 👈 redireciona para Home após login
    } catch (err: any) {
      setError('Falha no login. Verifique e-mail/senha.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleLogin} className="p-4 max-w-md mx-auto space-y-3">
      <h1 className="text-xl font-bold">Login</h1>
      <input className="border p-2 w-full" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <input className="border p-2 w-full" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Senha" />
      {error && <div className="text-sm text-red-600">{error}</div>}
      <button className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50" disabled={loading}>
        {loading ? 'Entrando...' : 'Entrar'}
      </button>
    </form>
  )
}

import { useEffect, useState } from 'react'
import axios from 'axios'

type Admin = { id: number; email: string; isAdmin: boolean }

export default function Admins() {
  const [admins, setAdmins] = useState<Admin[]>([])
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

  const headers = token ? { Authorization: `Bearer ${token}` } : {}

  const fetchAdmins = async () => {
    const { data } = await axios.get<Admin[]>('/admins', { headers })
    setAdmins(data)
  }

  useEffect(() => { fetchAdmins() }, [])

  const addAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    await axios.post('/admins', { email, password }, { headers })
    setEmail(''); setPassword('')
    fetchAdmins()
  }

  const removeAdmin = async (id: number) => {
    if (!confirm('Remover este administrador?')) return
    await axios.delete(`/admins/${id}`, { headers })
    fetchAdmins()
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Administradores</h1>

      <form onSubmit={addAdmin} className="bg-white border rounded p-4 shadow grid gap-2 max-w-md">
        <h2 className="font-semibold">Adicionar Admin</h2>
        <input className="border p-2" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
        <input className="border p-2" placeholder="Senha" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">Adicionar</button>
      </form>

      <div className="overflow-x-auto bg-white border rounded shadow">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Ações</th>
            </tr>
          </thead>
          <tbody>
            {admins.map(a => (
              <tr key={a.id} className="hover:bg-gray-50">
                <td className="p-2 border">{a.id}</td>
                <td className="p-2 border">{a.email}</td>
                <td className="p-2 border">
                  <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                    onClick={() => removeAdmin(a.id)}>
                    Remover
                  </button>
                </td>
              </tr>
            ))}
            {admins.length === 0 && (
              <tr><td className="p-4 text-center text-gray-500" colSpan={3}>Nenhum admin.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

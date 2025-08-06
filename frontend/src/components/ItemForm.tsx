import { useState } from 'react'
import axios from 'axios'

export default function ItemForm({ token }: { token: string }) {
  const [form, setForm] = useState({ objeto: '', local: '', atendimento: '', prateleira: '' })
  const [imagem, setImagem] = useState<File | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData()
    Object.entries(form).forEach(([key, val]) => formData.append(key, val))
    if (imagem) formData.append('imagem', imagem)

    await axios.post('http://localhost:3000/items', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    })
    alert('Item cadastrado!')
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-2">
      <input className="border p-2" placeholder="Objeto" onChange={e => setForm({ ...form, objeto: e.target.value })} />
      <input className="border p-2" placeholder="Local" onChange={e => setForm({ ...form, local: e.target.value })} />
      <input className="border p-2" placeholder="Atendimento (ex: 46875)" onChange={e => setForm({ ...form, atendimento: e.target.value })} />
      <select className="border p-2" onChange={e => setForm({ ...form, prateleira: e.target.value })}>
        <option value="">Prateleira</option>
        <option>A</option><option>B</option><option>C</option><option>D</option><option>E</option>
      </select>
      <input type="file" onChange={e => setImagem(e.target.files?.[0] ?? null)} />
      <button className="bg-green-600 text-white px-4 py-2" type="submit">Cadastrar</button>
    </form>
  )
}

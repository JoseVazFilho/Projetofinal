import React, { useState, useEffect } from 'react'
import axios from 'axios'
import ItemForm from '../components/ItemForm'
import ItemTable from '../components/ItemTable'

interface Props {
  token: string
  setToken: (token: string | null) => void
}

type Item = {
  id: number
  objeto: string
  local: string
  achadoEm: string
  descricao?: string | null
  publicado: boolean
  imagem?: string | null
  imagemUrl?: string | null
}

export default function Home({ token, setToken }: Props) {
  const [items, setItems] = useState<Item[]>([])
  const [itemEditando, setItemEditando] = useState<Item | null>(null)

  const fetchItems = async () => {
    try {
      const res = await axios.get('http://localhost:3000/items', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setItems(res.data)
    } catch (error) {
      console.error('Erro ao buscar itens:', error)
    }
  }

  useEffect(() => {
    if (token) fetchItems()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  const handleLogout = () => {
    localStorage.removeItem('token')
    setToken(null)
  }
  //  EXCLUIR
  const handleDelete = async (id: number) => {
    if (!confirm('Deseja excluir este item?')) return
    await axios.delete(`http://localhost:3000/items/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    fetchItems()
  }

  //  PUBLICAR (toggle)
  const handleToggle = async (id: number) => {
    await axios.patch(`http://localhost:3000/items/${id}/toggle`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    })
    fetchItems()
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Achados e Perdidos</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Sair
        </button>
      </div>

      <ItemForm
        token={token}
        onItemAdded={() => { setItemEditando(null); fetchItems() }}
        item={itemEditando}
      />

      <ItemTable
        items={items}
        onEdit={(item) => setItemEditando(item)}
        onDelete={handleDelete}
        onToggle={handleToggle}
      />
    </div>
  )
}

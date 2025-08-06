import React, { useState, useEffect } from 'react'
import axios from 'axios'
import ItemForm from '../components/ItemForm'
import ItemTable from '../components/ItemTable'

interface Props {
  token: string
  setToken: (token: string | null) => void
  
}


export default function Home({ token, setToken }: Props) {
  const [items, setItems] = useState([])
  const fetchItems = async () => {
    try {
      const res = await axios.get('http://localhost:3000/items', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setItems(res.data)
    } catch (error) {
      console.error('Erro ao buscar itens:', error)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    setToken(null)
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
      <ItemForm token={token} onItemAdded={fetchItems} />
      <ItemTable items={items} />
    </div>
  )
}

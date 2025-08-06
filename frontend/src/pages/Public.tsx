import { useEffect, useState } from 'react'
import axios from 'axios'

export default function Public() {
  const [items, setItems] = useState([])

  useEffect(() => {
    axios.get('http://localhost:3000/items').then(res => setItems(res.data))
  }, [])

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Itens Encontrados</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item: any) => (
          <div key={item.id} className="border rounded-lg p-4 shadow bg-white">
            <h2 className="font-bold text-lg mb-2">{item.objeto}</h2>
            <p><strong>Local:</strong> {item.local}</p>
            <p><strong>Atendimento:</strong> {item.atendimento}</p>
            <p><strong>Prateleira:</strong> {item.prateleira}</p>
            {item.imagemUrl && (
              <img
                src={`http://localhost:3000${item.imagemUrl}`}
                alt={item.objeto}
                className="mt-2 h-32 object-contain"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

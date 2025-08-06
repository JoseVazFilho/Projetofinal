import { useEffect, useState } from 'react'
import axios from 'axios'

export default function ItemTable() {
  const [items, setItems] = useState([])
  const [objeto, setObjeto] = useState('')
  const [local, setLocal] = useState('')

  const fetchItems = async () => {
    const { data } = await axios.get('http://localhost:3000/items', {
      params: { objeto, local },
    })
    setItems(data)
  }

  useEffect(() => { fetchItems() }, [objeto, local])

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input className="border p-2" placeholder="Filtrar por objeto" onChange={e => setObjeto(e.target.value)} />
        <input className="border p-2" placeholder="Filtrar por local" onChange={e => setLocal(e.target.value)} />
      </div>
      <table className="w-full border">
        <thead>
          <tr>
            <th className="border p-2">Objeto</th>
            <th className="border p-2">Local</th>
            <th className="border p-2">Atendimento</th>
            <th className="border p-2">Prateleira</th>
            <th className="border p-2">Imagem</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item: any) => (
            <tr key={item.id}>
              <td className="border p-2">{item.objeto}</td>
              <td className="border p-2">{item.local}</td>
              <td className="border p-2">{item.atendimento}</td>
              <td className="border p-2">{item.prateleira}</td>
              <td className="border p-2">
                {item.imagemUrl && <img src={`http://localhost:3000${item.imagemUrl}`} alt="" className="h-12" />}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

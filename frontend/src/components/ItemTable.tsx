import React from 'react'

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

type Props = {
  items: Item[]
  onEdit: (item: Item) => void
  onDelete: (id: number) => void
  onToggle: (id: number) => void
}

export default function ItemTable({ items, onEdit, onDelete, onToggle }: Props) {
  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2">Itens cadastrados</h2>
      <table className="w-full table-auto border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-3 py-2">Objeto</th>
            <th className="border px-3 py-2">Local</th>
            <th className="border px-3 py-2">Achado Em</th>
            <th className="border px-3 py-2">Descrição</th>
            <th className="border px-3 py-2">Nº Ocorrência</th>
            <th className="border px-3 py-2">Imagem</th>
            <th className="border px-3 py-2">Publicado</th>            
            <th className="border px-3 py-2">Ações</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const imgSrc =
              item.imagemUrl
                ? `http://localhost:3000${item.imagemUrl}`
                : item.imagem
                ? `http://localhost:3000/uploads/${item.imagem}`
                : null

            return (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="border px-3 py-2">{item.objeto}</td>
                <td className="border px-3 py-2">{item.local}</td>
                <td className="border px-3 py-2">
                  {item.achadoEm ? new Date(item.achadoEm).toLocaleDateString() : '—'}
                </td>
                <td className="border px-3 py-2">{item.descricao || '—'}</td>
                <td className="border px-3 py-2">{(item as any).numeroOcorrencia || '—'}</td>
                
                <td className="border px-3 py-2">
                  {imgSrc ? (
                    <img src={imgSrc} className="h-10 object-contain" />
                  ) : (
                    <span className="text-xs text-gray-500">Sem imagem</span>
                  )}
                </td>
                <td className="border px-3 py-2">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      item.publicado ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {item.publicado ? 'SIM' : 'NÃO'}
                  </span>
                </td>
                <td className="border px-3 py-2">
  <div className="flex flex-nowrap gap-2">
    <button
      className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 text-xs rounded"
      onClick={() => onToggle(item.id)}
      title={item.publicado ? 'Desativar publicação' : 'Ativar publicação'}
    >
      PUBLICAR
    </button>
    <button
      className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 text-xs rounded"
      onClick={() => onEdit(item)}
    >
      EDITAR
    </button>
    <button
      className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 text-xs rounded"
      onClick={() => onDelete(item.id)}
    >
      EXCLUIR
    </button>
  </div>
</td>

              </tr>
            )
          })}
          {items.length === 0 && (
            <tr>
              <td className="p-4 text-center text-gray-500" colSpan={7}>
                Nenhum item cadastrado ainda.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
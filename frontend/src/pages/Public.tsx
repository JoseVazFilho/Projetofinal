import { useEffect, useState } from 'react'
import axios from 'axios'

type Item = {
  id: number
  objeto: string
  local: string
  achadoEm: string
  descricao?: string
  publicado: boolean
  imagem?: string | null
  imagemUrl?: string | null
}

export default function Public() {
  const [items, setItems] = useState<Item[]>([])
  const [busca, setBusca] = useState('')
  const [localFiltro, setLocalFiltro] = useState('')
  const [densidade, setDensidade] = useState<'compacto' | 'normal' | 'espacado'>('normal')

  // paginação
  const [pagina, setPagina] = useState(1)
  const itensPorPagina = 12

  const fetchItems = async () => {
    const { data } = await axios.get<Item[]>('http://localhost:3000/items/public')
    setItems(data)
  }

  useEffect(() => {
    fetchItems()
  }, [])

  // filtros simples
  const itemsFiltrados = items.filter((i) => {
    const byObjeto = busca ? i.objeto.toLowerCase().includes(busca.toLowerCase()) : true
    const byLocal = localFiltro ? i.local.toLowerCase().includes(localFiltro.toLowerCase()) : true
    return byObjeto && byLocal
  })

  // paginação
  const totalPaginas = Math.ceil(itemsFiltrados.length / itensPorPagina)
  const inicio = (pagina - 1) * itensPorPagina
  const fim = inicio + itensPorPagina
  const itensPagina = itemsFiltrados.slice(inicio, fim)

  // grid classes conforme densidade
  const gridClasses =
    densidade === 'compacto'
      ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8'
      : densidade === 'normal'
      ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
      : 'grid-cols-1 sm:grid-cols-2'

  return (
    <div className="min-h-screen px-4 py-6 mx-auto max-w-[1600px]">
      <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Itens Encontrados (Público)</h1>
          <p className="text-sm text-gray-600">
            Veja os itens ainda não devolvidos. Para cadastrar/editar/remover, acesse a área administrativa.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <input
            className="border p-2 rounded w-full sm:w-64"
            placeholder="Buscar por objeto (ex: chave, celular...)"
            value={busca}
            onChange={(e) => {
              setBusca(e.target.value)
              setPagina(1) // reset paginador ao filtrar
            }}
          />
          <input
            className="border p-2 rounded w-full sm:w-64"
            placeholder="Filtrar por local (ex: Biblioteca)"
            value={localFiltro}
            onChange={(e) => {
              setLocalFiltro(e.target.value)
              setPagina(1)
            }}
          />
          <select
            className="border p-2 rounded"
            value={densidade}
            onChange={(e) => setDensidade(e.target.value as any)}
          >
            <option value="compacto">Compacto</option>
            <option value="normal">Normal</option>
            <option value="espacado">Espaçado</option>
          </select>
        </div>
      </header>

      {/* Grid de itens */}
      <div className={`grid gap-4 ${gridClasses}`}>
        {itensPagina.map((item) => {
          const imgSrc =
            item.imagemUrl
              ? `http://localhost:3000${item.imagemUrl}`
              : item.imagem
              ? `http://localhost:3000/uploads/${item.imagem}`
              : null

          return (
            <article key={item.id} className="bg-white rounded-lg border shadow p-3 flex flex-col">
              {imgSrc ? (
                <img
                  src={imgSrc}
                  alt={item.objeto}
                  className="h-36 w-full object-contain mb-3"
                  loading="lazy"
                />
              ) : (
                <div className="h-36 w-full grid place-items-center bg-gray-50 mb-3 text-gray-400 text-sm">
                  Sem imagem
                </div>
              )}

              <h2 className="font-semibold text-lg leading-tight line-clamp-2">{item.objeto}</h2>
              <p className="text-sm text-gray-600 mt-1">
                <span className="font-medium">Local:</span> {item.local}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Achado em:</span>{' '}
                {item.achadoEm ? new Date(item.achadoEm).toLocaleDateString() : '—'}
              </p>

              {item.descricao && (
                <p className="text-sm text-gray-700 mt-1 line-clamp-3">{item.descricao}</p>
              )}

              {!item.publicado && (
                <span className="mt-2 inline-block text-xs px-2 py-1 rounded bg-gray-200 text-gray-700 w-max">
                  Devolvido / Oculto
                </span>
              )}
            </article>
          )
        })}
      </div>

      {/* Paginação */}
      {totalPaginas > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            onClick={() => setPagina((p) => Math.max(p - 1, 1))}
            disabled={pagina === 1}
          >
            Anterior
          </button>
          <span className="px-3 py-1">
            Página {pagina} de {totalPaginas}
          </span>
          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            onClick={() => setPagina((p) => Math.min(p + 1, totalPaginas))}
            disabled={pagina === totalPaginas}
          >
            Próxima
          </button>
        </div>
      )}

      {itemsFiltrados.length === 0 && (
        <div className="text-center text-gray-500 mt-10">
          Nenhum item encontrado com os filtros atuais.
        </div>
      )}
    </div>
  )
}
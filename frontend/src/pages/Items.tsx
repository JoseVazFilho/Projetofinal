import React, { useEffect, useState } from 'react'
import axios from 'axios'

type Item = {
  id: number
  objeto: string
  local: string
  achadoEm: string // ISO ou 'YYYY-MM-DD'
  descricao?: string | null
  publicado: boolean
  imagem?: string | null
  imagemUrl?: string | null
}

export default function Items() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // filtros simples (opcional)
  const [busca, setBusca] = useState('')
  const [localFiltro, setLocalFiltro] = useState('')

  // edição
  const [editItem, setEditItem] = useState<Item | null>(null)
  const [editForm, setEditForm] = useState({
    objeto: '',
    local: '',
    achadoEm: '',
    descricao: '',
  })

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  const authHeader = token ? { Authorization: `Bearer ${token}` } : {}

  const fetchItems = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await axios.get<Item[]>('http://localhost:3000/items', {
        headers: authHeader,
      })
      setItems(res.data)
    } catch (err: any) {
      setError('Erro ao carregar itens.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchItems()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const startEdit = (item: Item) => {
    setEditItem(item)
    // normaliza a data para 'YYYY-MM-DD' no input date
    const d = item.achadoEm ? new Date(item.achadoEm) : null
    const yyyyMMdd = d
      ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
          d.getDate()
        ).padStart(2, '0')}`
      : ''

    setEditForm({
      objeto: item.objeto ?? '',
      local: item.local ?? '',
      achadoEm: yyyyMMdd,
      descricao: item.descricao ?? '',
    })
  }

  const cancelEdit = () => {
    setEditItem(null)
  }

  const saveEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editItem) return
    try {
      setLoading(true)
      setError(null)
      await axios.put(
        `http://localhost:3000/items/${editItem.id}`,
        {
          objeto: editForm.objeto,
          local: editForm.local,
          achadoEm: editForm.achadoEm, // backend converte com new Date()
          descricao: editForm.descricao,
        },
        { headers: { ...authHeader, 'Content-Type': 'application/json' } }
      )
      setEditItem(null)
      await fetchItems()
    } catch (err: any) {
      setError('Erro ao salvar alterações.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const removeItem = async (id: number) => {
    if (!confirm('Deseja excluir este item?')) return
    try {
      setLoading(true)
      setError(null)
      await axios.delete(`http://localhost:3000/items/${id}`, {
        headers: authHeader,
      })
      await fetchItems()
    } catch (err: any) {
      setError('Erro ao excluir item.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const togglePublicacao = async (id: number) => {
    try {
      setLoading(true)
      setError(null)
      await axios.patch(
        `http://localhost:3000/items/${id}/toggle`,
        {},
        { headers: authHeader }
      )
      await fetchItems()
    } catch (err: any) {
      setError('Erro ao alterar publicação.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const itemsFiltrados = items.filter((i) => {
    const byObjeto = busca ? i.objeto?.toLowerCase().includes(busca.toLowerCase()) : true
    const byLocal = localFiltro ? i.local?.toLowerCase().includes(localFiltro.toLowerCase()) : true
    return byObjeto && byLocal
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Gerenciar Itens Encontrados</h1>
          <p className="text-sm text-gray-600">
            Edite, exclua e controle a publicação dos itens que aparecem na página pública.
          </p>
        </div>

        <div className="flex gap-2">
          <input
            className="border p-2 rounded w-56"
            placeholder="Filtrar por objeto"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
          <input
            className="border p-2 rounded w-56"
            placeholder="Filtrar por local"
            value={localFiltro}
            onChange={(e) => setLocalFiltro(e.target.value)}
          />
          <button
            className="border px-3 rounded"
            onClick={() => {
              setBusca('')
              setLocalFiltro('')
            }}
          >
            Limpar
          </button>
        </div>
      </div>

      {loading && <div className="text-sm text-gray-500">Carregando...</div>}
      {error && <div className="text-sm text-red-600">{error}</div>}

      {/* Tabela */}
      <div className="overflow-x-auto bg-white border rounded shadow">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Objeto</th>
              <th className="p-2 border">Local</th>
              <th className="p-2 border">Achado Em</th>
              <th className="p-2 border">Descrição</th>
              <th className="p-2 border">Publicado</th>
              <th className="p-2 border">Ações</th>
            </tr>
          </thead>
          <tbody>
            {itemsFiltrados.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="p-2 border">{item.id}</td>
                <td className="p-2 border">{item.objeto}</td>
                <td className="p-2 border">{item.local}</td>
                <td className="p-2 border">
                  {item.achadoEm ? new Date(item.achadoEm).toLocaleDateString() : '—'}
                </td>
                <td className="p-2 border">{item.descricao || '—'}</td>
                <td className="p-2 border">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      item.publicado ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {item.publicado ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td className="p-2 border space-x-2">
                  <button
                    onClick={() => startEdit(item)}
                    className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => togglePublicacao(item.id)}
                    className="px-3 py-1 rounded bg-yellow-500 text-white hover:bg-yellow-600"
                  >
                    {item.publicado ? 'Desativar' : 'Ativar'}
                  </button>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}

            {itemsFiltrados.length === 0 && (
              <tr>
                <td colSpan={7} className="p-4 text-center text-gray-500">
                  Nenhum item encontrado com os filtros atuais.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Painel de Edição */}
      {editItem && (
        <form
          onSubmit={saveEdit}
          className="border rounded bg-white shadow p-4 space-y-3"
        >
          <h2 className="text-lg font-semibold">Editar item #{editItem.id}</h2>

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-700">Objeto</label>
              <input
                className="border p-2 rounded w-full"
                value={editForm.objeto}
                onChange={(e) => setEditForm((f) => ({ ...f, objeto: e.target.value }))}
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700">Local</label>
              <input
                className="border p-2 rounded w-full"
                value={editForm.local}
                onChange={(e) => setEditForm((f) => ({ ...f, local: e.target.value }))}
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700">Achado Em</label>
              <input
                type="date"
                className="border p-2 rounded w-full"
                value={editForm.achadoEm}
                onChange={(e) => setEditForm((f) => ({ ...f, achadoEm: e.target.value }))}
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700">Descrição (breve)</label>
              <input
                className="border p-2 rounded w-full"
                value={editForm.descricao}
                onChange={(e) => setEditForm((f) => ({ ...f, descricao: e.target.value }))}
                placeholder="Ex.: chave com chaveiro azul"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
              disabled={loading}
            >
              Salvar
            </button>
            <button
              type="button"
              onClick={cancelEdit}
              className="px-4 py-2 rounded border"
              disabled={loading}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

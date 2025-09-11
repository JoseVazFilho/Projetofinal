import { useEffect, useState } from 'react'
import axios from 'axios'

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
  token: string
  onItemAdded: () => void
  item?: Item | null
}

export default function ItemForm({ token, onItemAdded, item }: Props) {
  const [objeto, setObjeto] = useState('')
  const [local, setLocal] = useState('')
  const [achadoEm, setAchadoEm] = useState('')
  const [descricao, setDescricao] = useState('')
  const [numeroOcorrencia, setNumeroOcorrencia] = useState('')
  const [imagem, setImagem] = useState<File | null>(null)

  useEffect(() => {
    if (item) {
      setObjeto(item.objeto || '')
      setLocal(item.local || '')
      const d = item.achadoEm ? new Date(item.achadoEm) : null
      const yyyyMMdd =
        d ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}` : ''
      setAchadoEm(yyyyMMdd)
      setDescricao(item.descricao || '')
      setNumeroOcorrencia((item as any).numeroOcorrencia || '')
      setImagem(null)
    } else {
      // default: data de hoje no cadastro
      const now = new Date()
      const yyyyMMdd =
        `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
      setObjeto('')
      setLocal('')
      setAchadoEm(yyyyMMdd)
      setDescricao('')
      setNumeroOcorrencia('')
      setImagem(null)
    }
  }, [item])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append('objeto', objeto)
    formData.append('local', local)
    formData.append('achadoEm', achadoEm)
    formData.append('descricao', descricao)
    formData.append('numeroOcorrencia', numeroOcorrencia)
    if (imagem) formData.append('imagem', imagem)

    const isEdit = Boolean(item?.id)
    const url = isEdit
      ? `http://localhost:3000/items/${item!.id}`
      : 'http://localhost:3000/items'
    const method = isEdit ? 'put' : 'post'

    await axios({
      method: method as any,
      url,
      data: formData,
      headers: { Authorization: `Bearer ${token}` }, // NÃO defina Content-Type manualmente
    })

    onItemAdded()
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-2 bg-white border rounded p-4 shadow">
      <h2 className="text-lg font-semibold">{item ? 'Editar item' : 'Cadastrar item'}</h2>
      <input className="border p-2" placeholder="Objeto" value={objeto} onChange={e => setObjeto(e.target.value)} required />
      <input className="border p-2" placeholder="Local" value={local} onChange={e => setLocal(e.target.value)} required />
      <input type="date" className="border p-2" value={achadoEm} onChange={e => setAchadoEm(e.target.value)} required />
      <input className="border p-2" placeholder="Descrição breve" value={descricao} onChange={e => setDescricao(e.target.value)} />
      <input className="border p-2" placeholder="Número de Ocorrência (ex: 4578909)" value={numeroOcorrencia} onChange={e => setNumeroOcorrencia(e.target.value)} />
      <input type="file" onChange={e => setImagem(e.target.files?.[0] ?? null)} />
      <div className="flex gap-2">
        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded" type="submit">
          {item ? 'Salvar alterações' : 'Cadastrar'}
        </button>
      </div>
    </form>
  )
}

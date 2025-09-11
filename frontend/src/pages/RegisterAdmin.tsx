import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function RegisterAdmin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [inviteCode, setInviteCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [ok, setOk] = useState<string | null>(null)

  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null); setOk(null)

    if (!email || !password || !inviteCode) {
      setError('Preencha e-mail, senha e o código de convite.')
      return
    }

    try {
      setLoading(true)
      // usando proxy do Vite: /auth
      const { data } = await axios.post('/auth/register-admin', {
        email, password, inviteCode
      })
      // sucesso — você pode já logar com o token retornado, mas aqui vou redirecionar pro login
      setOk('Administrador criado com sucesso! Você será redirecionado para o login.')
      setTimeout(() => navigate('/login'), 1500)
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? 'Erro ao criar administrador.'
      setError(msg)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Cadastro de Administrador</h1>
      <p className="text-sm text-gray-600 mb-4">
        Informe o <strong>código de convite</strong> fornecido pelo responsável do sistema para concluir o cadastro de administrador.
      </p>

      <form onSubmit={handleSubmit} className="space-y-3 bg-white border rounded p-4 shadow">
        <div>
          <label className="block text-sm text-gray-700 mb-1">E-mail</label>
          <input
            type="email"
            className="border p-2 rounded w-full"
            placeholder="admin@ufg.br"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete="username"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">Senha</label>
          <input
            type="password"
            className="border p-2 rounded w-full"
            placeholder="mínimo 6 caracteres"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="new-password"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">Código de Convite</label>
          <input
            className="border p-2 rounded w-full"
            placeholder="código fornecido (invite)"
            value={inviteCode}
            onChange={e => setInviteCode(e.target.value)}
            required
          />
        </div>

        {error && <div className="text-sm text-red-600">{error}</div>}
        {ok && <div className="text-sm text-green-700">{ok}</div>}

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          type="submit"
          disabled={loading || !email || !password || !inviteCode}
        >
          {loading ? 'Criando...' : 'Criar Administrador'}
        </button>
      </form>

      <div className="text-sm text-gray-600 mt-3">
        Já tem conta? <button className="underline" onClick={() => navigate('/login')}>Fazer login</button>
      </div>
    </div>
  )
}

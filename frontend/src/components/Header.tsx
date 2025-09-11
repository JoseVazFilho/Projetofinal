import { Link } from "react-router-dom";

export default function Header() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  const isAdmin = typeof window !== 'undefined' && localStorage.getItem('isAdmin') === 'true'
  return (
    <header className="bg-blue-900 text-white p-4 shadow-md flex justify-between items-center">
      <div className="flex items-center space-x-3">
        <img src="/ufg-logo.png" alt="Logo UFG" className="h-10 w-10 object-contain" />
        <h1 className="text-xl font-bold">UFG - Achados e Perdidos</h1>
      </div>

      <nav className="space-x-4">
        {isAdmin && <Link to="/" className="hover:underline">Início</Link>}
        {isAdmin && <Link to="/public" className="hover:underline">Itens</Link>}
        {isAdmin && <Link to="/items" className="hover:underline">Admin</Link>}
        {isAdmin && <Link to="/admins" className="hover:underline">Administradores</Link>}
        {!token && <Link to="/login" className="hover:underline">Login</Link>}
        {/* opcional: link de convite, pode ocultar em produção */}
        {!token && <Link to="/register-admin" className="hover:underline">Sou Admin (convite)</Link>}
      </nav>
    </header>
  );
}

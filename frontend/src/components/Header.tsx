import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-blue-900 text-white p-4 shadow-md flex justify-between items-center">
      {/* Logo + Nome do sistema */}
      <div className="flex items-center space-x-3">
        <img
          src="/ufg-logo.png"
          alt="Logo UFG"
          className="h-10 w-10 object-contain"
        />
        <h1 className="text-xl font-bold">UFG - Achados e Perdidos</h1>
      </div>

      {/* Navegação */}
      <nav className="space-x-4">
        <Link to="/" className="hover:underline">Início</Link>
        <Link to="/public" className="hover:underline">Itens</Link>
        <Link to="/login" className="hover:underline">Login</Link>
      </nav>
    </header>
  );
}

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-center text-sm text-gray-600 p-4 mt-6 border-t">
      <p>© {new Date().getFullYear()} UFG - Sistema de Achados e Perdidos</p>
    </footer>
  );
}
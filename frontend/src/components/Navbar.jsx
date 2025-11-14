import { Link, useNavigate } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { usuario, logout } = useAuth();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsOpen(false);
  };

  return (
    <nav className="border-b border-gray-200 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            {/* Logo: SVG with gradient and stylized R */}
            <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center" aria-hidden>
              <svg width="36" height="36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="ReservasApp logo">
                <defs>
                  <linearGradient id="g1" x1="0%" x2="100%" y1="0%" y2="100%">
                    <stop offset="0%" stopColor="#2563EB" />
                    <stop offset="100%" stopColor="#06B6D4" />
                  </linearGradient>
                </defs>
                <rect width="36" height="36" rx="8" fill="url(#g1)" />
                <text x="50%" y="56%" textAnchor="middle" fontFamily="Inter, system-ui, sans-serif" fontWeight="700" fontSize="16" fill="#ffffff">R</text>
              </svg>
            </div>
            <span className="font-semibold text-lg text-gray-900">ReservasApp</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium transition">
              Inicio
            </Link>
            <Link to="/usuarios" className="text-gray-700 hover:text-blue-600 font-medium transition">
              Usuarios
            </Link>
            <Link to="/recursos" className="text-gray-700 hover:text-blue-600 font-medium transition">
              Recursos
            </Link>
            <Link to="/reservas" className="text-gray-700 hover:text-blue-600 font-medium transition">
              Reservas
            </Link>

            {!usuario ? (
              <Link
                to="/login"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Ingresar
              </Link>
            ) : (
              <div className="flex items-center gap-4 pl-4 border-l border-gray-200">
                <span className="text-sm text-gray-700">{usuario.nombre}</span>
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-red-600 transition"
                  title="Cerrar sesión"
                >
                  <LogOut size={20} />
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700 hover:text-blue-600 transition"
            onClick={toggleMenu}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-gray-200 space-y-2">
            <Link
              to="/"
              className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded transition"
              onClick={() => setIsOpen(false)}
            >
              Inicio
            </Link>
            <Link
              to="/usuarios"
              className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded transition"
              onClick={() => setIsOpen(false)}
            >
              Usuarios
            </Link>
            <Link
              to="/recursos"
              className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded transition"
              onClick={() => setIsOpen(false)}
            >
              Recursos
            </Link>
            <Link
              to="/reservas"
              className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded transition"
              onClick={() => setIsOpen(false)}
            >
              Reservas
            </Link>
            {!usuario ? (
              <Link
                to="/login"
                className="block py-2 px-4 text-blue-600 hover:bg-blue-50 rounded transition font-medium"
                onClick={() => setIsOpen(false)}
              >
                Ingresar
              </Link>
            ) : (
              <button
                onClick={handleLogout}
                className="w-full text-left py-2 px-4 text-red-600 hover:bg-red-50 rounded transition flex items-center gap-2"
              >
                <LogOut size={18} />
                Cerrar sesión
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

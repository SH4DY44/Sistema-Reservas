import { Link } from "react-router-dom";
import { Users, Calendar, Package, LogIn, Plus, ArrowRight, Lock } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function Home() {
  const { usuario } = useAuth();

  const menuItems = [
    {
      title: "Usuarios",
      description: "Gestiona la información de todos los usuarios del sistema",
      icon: Users,
      href: "/usuarios",
      color: "blue",
      action: "/registrar-usuario",
      actionLabel: "Nuevo Usuario"
    },
    {
      title: "Recursos",
      description: "Administra los recursos disponibles para reservar",
      icon: Package,
      href: "/recursos",
      color: "green",
      action: "/registrar-recurso",
      actionLabel: "Nuevo Recurso"
    },
    {
      title: "Reservas",
      description: "Consulta y gestiona todas las reservas del sistema",
      icon: Calendar,
      href: "/reservas",
      color: "purple",
      action: "/registrar-reserva",
      actionLabel: "Nueva Reserva"
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", button: "bg-blue-600 hover:bg-blue-700" },
      green: { bg: "bg-green-50", border: "border-green-200", text: "text-green-700", button: "bg-green-600 hover:bg-green-700" },
      purple: { bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-700", button: "bg-purple-600 hover:bg-purple-700" }
    };
    return colors[color];
  };

  // Filtrar items según autenticación
  const itemsToDisplay = usuario ? menuItems : [menuItems[0]];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Sistema de Gestión de Reservas
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Plataforma centralizada para gestionar usuarios, recursos y reservas de forma eficiente y organizada.
          </p>
        </div>

        {/* Access Limited Warning */}
        {!usuario && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-12 flex items-start gap-4">
            <Lock size={24} className="text-amber-600 mt-1 flex-shrink-0" />
            <div>
              <p className="text-amber-900 font-semibold text-lg">Acceso Limitado</p>
              <p className="text-amber-800 mt-1">Para acceder a recursos y reservas, debes iniciar sesión o registrarte como nuevo usuario.</p>
            </div>
          </div>
        )}

        {/* Main Grid */}
        <div className={`grid gap-6 mb-12 ${usuario ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1'}`}>
          {itemsToDisplay.map((item) => {
            const colors = getColorClasses(item.color);
            const Icon = item.icon;
            return (
              <div key={item.title} className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition overflow-hidden">
                {/* Header */}
                <div className={`${colors.bg} ${colors.border} border-b p-6`}>
                  <Icon className={`w-8 h-8 ${colors.text} mb-3`} />
                  <h2 className="text-xl font-semibold text-gray-900">{item.title}</h2>
                </div>

                {/* Content */}
                <div className="p-6">
                  <p className="text-gray-600 text-sm mb-6">
                    {item.description}
                  </p>

                  <div className="space-y-3">
                    <Link
                      to={item.href}
                      className={`flex items-center justify-between w-full px-4 py-2 rounded-lg ${colors.button} text-white transition font-medium text-sm`}
                    >
                      <span>Ver Listado</span>
                      <ArrowRight size={18} />
                    </Link>
                    <Link
                      to={item.action}
                      className={`flex items-center justify-between w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition font-medium text-sm`}
                    >
                      <span className="flex items-center gap-2">
                        <Plus size={16} />
                        {item.actionLabel}
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Info Section */}
        {usuario && (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Usuarios</h3>
                <p className="text-gray-600 text-sm">
                  Gestiona el registro y la información de todos los usuarios del sistema
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Recursos</h3>
                <p className="text-gray-600 text-sm">
                  Define los recursos disponibles y su cantidad para las reservas
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Reservas</h3>
                <p className="text-gray-600 text-sm">
                  Crea y gestiona las reservas de recursos por usuario
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

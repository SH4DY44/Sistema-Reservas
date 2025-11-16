import { useNavigate } from "react-router-dom"; // 👈 Usamos useNavigate en lugar de Link
import { ChevronLeft } from "lucide-react";

export default function FormLayout({ children, title, backLink }) {
  // 💡 Obtenemos la función de navegación
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="mb-8">
          {/* 💡 CAMBIAMOS Link POR BUTTON */}
          {backLink && (
            <button
              onClick={() => navigate(-1)} // 👈 Regresa a la página anterior en el historial
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 font-medium text-sm transition-colors"
            >
              <ChevronLeft size={18} />
              Atrás
            </button>
          )}
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          <div className="h-1 w-16 bg-blue-600 mt-3 rounded"></div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
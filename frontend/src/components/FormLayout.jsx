import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

export default function FormLayout({ children, title, backLink }) {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="mb-8">
          {backLink && (
            <Link
              to={backLink}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 font-medium text-sm"
            >
              <ChevronLeft size={18} />
              Atrás
            </Link>
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

import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

export default function FormLayout({ children, title, backLink }) {
  return (
    <div className="min-h-screen bg-brand-dark flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">

      {/* Background decorative blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-blue/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-orange/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 animate-fade-in">
        {/* Header */}
        <div className="mb-8">
          {backLink && (
            <Link
              to={backLink}
              className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 font-medium text-sm transition-colors"
            >
              <ChevronLeft size={18} />
              Atrás
            </Link>
          )}
          <h2 className="text-center text-3xl font-bold text-white tracking-tight">
            {title}
          </h2>
          <p className="mt-2 text-center text-sm text-slate-400">
            Bienvenido a <span className="text-brand-blue font-bold">Nexus WorkSpace</span>
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-brand-surface py-8 px-4 shadow-2xl shadow-black/30 sm:rounded-2xl sm:px-10 border border-slate-700/50">
          {children}
        </div>
      </div>
    </div>
  );
}

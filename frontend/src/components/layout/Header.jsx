import { useAuth } from "../../contexts/AuthContext";
import { Bell, Search, User } from "lucide-react";

export function Header() {
    const { usuario } = useAuth();

    return (
        <header className="h-20 bg-brand-dark/80 backdrop-blur-md border-b border-slate-800/50 sticky top-0 z-10 px-8 flex items-center justify-between">
            {/* Search Bar */}
            <div className="relative w-96 hidden md:block group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-brand-blue transition-colors" />
                <input
                    type="text"
                    placeholder="Buscar en Nexus..."
                    className="w-full pl-10 pr-4 py-2.5 bg-brand-surface border border-slate-700/50 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue transition-all placeholder:text-slate-600"
                />
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-5">
                <button className="relative p-2.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all">
                    <Bell size={22} />
                    {/* Orange Dot for notifications */}
                    <span className="absolute top-2 right-2.5 w-2.5 h-2.5 bg-brand-orange rounded-full border-2 border-brand-dark shadow-[0_0_8px_rgba(249,115,22,0.6)]"></span>
                </button>

                <div className="h-8 w-px bg-slate-800 mx-1"></div>

                <div className="flex items-center gap-3 pl-2">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-white tracking-wide">{usuario?.nombre || "Usuario"}</p>
                        <p className="text-xs text-brand-blue font-medium">{usuario?.email || "Admin"}</p>
                    </div>
                    <div className="w-11 h-11 bg-gradient-to-br from-brand-blue to-blue-700 rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-blue/20 ring-2 ring-brand-surface">
                        <User size={22} />
                    </div>
                </div>
            </div>
        </header>
    );
}

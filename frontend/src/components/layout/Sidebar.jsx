import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    Armchair,
    CalendarDays,
    LogOut,
    ChevronLeft,
    ChevronRight
} from "lucide-react";
import { useState } from "react";
import { cn } from "../../utils/cn";
import { useAuth } from "../../contexts/AuthContext";

export function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const { logout, usuario } = useAuth();

    const isAdmin = usuario?.rol === 'admin';

    const links = [
        { to: "/", label: "Panel Principal", icon: LayoutDashboard },
        // Only show Miembros to Admins
        ...(isAdmin ? [{ to: "/usuarios", label: "Miembros", icon: Users }] : []),
        { to: "/recursos", label: "Espacios y Equipos", icon: Armchair },
        { to: "/reservas", label: "Agenda", icon: CalendarDays },
    ];

    return (
        <aside
            className={cn(
                "bg-brand-surface border-r border-slate-800/50 h-screen sticky top-0 flex flex-col transition-all duration-300 z-20 shadow-xl shadow-black/20",
                collapsed ? "w-20" : "w-64"
            )}
        >
            {/* Logo Area */}
            <div className="h-20 flex items-center justify-between px-5 border-b border-slate-700/50">
                {!collapsed && (
                    <div className="flex flex-col">
                        <div className="flex items-center gap-1">
                            <span className="text-2xl font-bold text-white tracking-tight">
                                Nexus
                            </span>
                            <span className="h-2 w-2 rounded-full bg-brand-orange shadow-[0_0_10px_rgba(249,115,22,0.6)] mt-1"></span>
                        </div>

                        <span className="text-[10px] text-brand-blue font-bold tracking-[0.2em] uppercase mt-0.5">WorkSpace</span>
                    </div>
                )}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="p-1.5 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-white transition-colors ml-auto"
                >
                    {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-8 px-4 space-y-2">
                {links.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        className={({ isActive }) => cn(
                            "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden",
                            isActive
                                ? "bg-gradient-to-r from-brand-blue to-blue-600 text-white shadow-lg shadow-brand-blue/20"
                                : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                        )}
                    >
                        <link.icon size={22} className={cn("shrink-0 transition-transform duration-300 group-hover:scale-110", ({ isActive }) => isActive && "text-white")} />
                        {!collapsed && <span className="font-medium truncate">{link.label}</span>}

                        {/* Orange accent line for active state */}
                        {({ isActive }) => isActive && (
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-orange"></div>
                        )}

                        {/* Tooltip for collapsed state */}
                        {collapsed && (
                            <div className="absolute left-16 bg-brand-surface border border-slate-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-xl">
                                {link.label}
                            </div>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Footer / Logout */}
            <div className="p-4 border-t border-slate-700/50">
                <div className="px-2 mb-4">
                    {!collapsed && (
                        <div className="bg-brand-dark/50 rounded-lg p-3 border border-slate-800">
                            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Tu ROL</p>
                            <div className="flex items-center gap-2">
                                <div className={cn("w-2 h-2 rounded-full", isAdmin ? "bg-brand-orange" : "bg-emerald-500")}></div>
                                <p className="text-sm font-medium text-white capitalize">{usuario?.rol || 'Visitante'}</p>
                            </div>
                        </div>
                    )}
                </div>

                <button
                    onClick={logout}
                    className={cn(
                        "flex items-center gap-3 w-full px-3 py-3 rounded-xl text-slate-400 hover:bg-brand-orange/10 hover:text-brand-orange transition-all group",
                        collapsed && "justify-center px-0"
                    )}
                >
                    <LogOut size={20} className="shrink-0 group-hover:rotate-12 transition-transform" />
                    {!collapsed && <span className="font-medium">Cerrar Sesión</span>}
                </button>
            </div>
        </aside>
    );
}

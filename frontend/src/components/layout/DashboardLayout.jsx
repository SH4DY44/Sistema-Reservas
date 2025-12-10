import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { Outlet, useLocation } from "react-router-dom";

export function DashboardLayout() {
    const location = useLocation();

    return (
        <div className="flex min-h-screen bg-brand-dark font-sans text-slate-200 selection:bg-brand-orange/30 selection:text-white">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
                <Header />
                <main className="flex-1 p-8 overflow-y-auto scrollbar-hide">
                    <div className="max-w-7xl mx-auto w-full space-y-6">
                        <div key={location.pathname} className="animate-slide-up">
                            <Outlet />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

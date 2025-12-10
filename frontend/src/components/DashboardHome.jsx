import { useEffect, useState } from "react";
import {
    Users,
    Armchair,
    CalendarDays,
    Activity
} from "lucide-react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";
import { StatsCard } from "./ui/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";

export default function DashboardHome() {
    const [stats, setStats] = useState({
        usuarios: 0,
        recursos: 0,
        reservas: 0
    });
    const [loading, setLoading] = useState(true);

    // Mock data for chart - Ocupación
    const chartData = [
        { name: '08:00', reservas: 12 },
        { name: '10:00', reservas: 35 },
        { name: '12:00', reservas: 48 },
        { name: '14:00', reservas: 25 },
        { name: '16:00', reservas: 40 },
        { name: '18:00', reservas: 15 },
        { name: '20:00', reservas: 5 },
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersRes, resRes, reservasRes] = await Promise.all([
                    fetch('http://localhost:3000/usuarios'),
                    fetch('http://localhost:3000/recursos'),
                    fetch('http://localhost:3000/reservas')
                ]);

                const [users, resources, reservas] = await Promise.all([
                    usersRes.json(),
                    resRes.json(),
                    reservasRes.json()
                ]);

                setStats({
                    usuarios: users.length,
                    recursos: resources.length,
                    reservas: reservas.length || 0
                });
            } catch (error) {
                console.error("Error loading stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-100">Panel de Control - Sede Central</h1>
                <p className="text-slate-400">Resumen de ocupación y actividad de Nexus WorkSpace.</p>
            </div>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard
                    title="Miembros Activos"
                    value={loading ? "..." : stats.usuarios}
                    trend="up"
                    trendValue="+3 nuevos"
                    icon={Users}
                />
                <StatsCard
                    title="Espacios Habilitados"
                    value={loading ? "..." : stats.recursos}
                    trend="neutral"
                    trendValue="1 en mant."
                    icon={Armchair}
                />
                <StatsCard
                    title="Reuniones Agendadas"
                    value={loading ? "..." : stats.reservas}
                    trend="up"
                    trendValue="+12% vs ayer"
                    icon={CalendarDays}
                />
                <StatsCard
                    title="Tasa de Ocupación"
                    value="76%"
                    trend="up"
                    trendValue="+5.2%"
                    icon={Activity}
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Chart Section */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Ocupación por Hora (Hoy)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorReservas" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.5} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#0f172a',
                                            borderColor: '#1e293b',
                                            borderRadius: '8px',
                                            color: '#f8fafc'
                                        }}
                                        itemStyle={{ color: '#f8fafc' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="reservas"
                                        stroke="#3b82f6"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorReservas)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Side Panel / Quick Action or Secondary List */}
                <Card>
                    <CardHeader>
                        <CardTitle>Espacios más solicitados</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[
                                { name: 'Sala Berlin (Conf)', bookings: 12 },
                                { name: 'Cabina Zoom #1', bookings: 8 },
                                { name: 'Escritorio Flex #4', bookings: 6 },
                                { name: 'Sala Creativa', bookings: 5 },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-800 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 font-bold text-xs border border-blue-500/20">
                                            {i + 1}
                                        </div>
                                        <span className="font-medium text-sm text-slate-300">{item.name}</span>
                                    </div>
                                    <span className="text-sm font-semibold text-slate-100">{item.bookings} h</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}

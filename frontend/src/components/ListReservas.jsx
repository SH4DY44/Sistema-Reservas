import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Edit, Plus, AlertCircle, CheckCircle, Lock, Calendar, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { DataTable } from './ui/DataTable';

export default function ListReservas() {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState('');
  const { usuario } = useAuth();

  const fetchReservas = () => {
    setLoading(true);
    fetch('http://localhost:3000/reservas')
      .then(res => res.json())
      .then(data => {
        const reservasData = data.data || data;
        setReservas(Array.isArray(reservasData) ? reservasData : []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching reservas:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchReservas();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('¿Seguro que deseas cancelar esta reserva de la agenda?')) return;

    try {
      const res = await fetch(`http://localhost:3000/reservas/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMensaje('Reserva eliminada de la agenda');
        setTipoMensaje('success');
        fetchReservas();
        setTimeout(() => setMensaje(''), 3000);
      } else {
        setMensaje('Error al eliminar la reserva');
        setTipoMensaje('error');
      }
    } catch {
      setMensaje('Error de conexión');
      setTipoMensaje('error');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    // Format: "15 Oct, 2025"
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return '-';
    // Format: "14:30"
    return new Date(dateString).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const columns = [
    { key: 'usuario_nombre', header: 'Miembro' },
    { key: 'recurso_nombre', header: 'Espacio / Equipo' },
    {
      key: 'fecha_inicio',
      header: 'Inicio',
      render: (item) => (
        <div className="flex flex-col text-xs">
          <span className="flex items-center gap-1 text-slate-300 font-medium">
            <Calendar size={12} className="text-brand-blue" />
            {formatDate(item.fecha_inicio)}
          </span>
          <span className="flex items-center gap-1 text-slate-500 pl-1 mt-0.5">
            <Clock size={12} />
            {formatTime(item.fecha_inicio)}
          </span>
        </div>
      )
    },
    {
      key: 'fecha_fin',
      header: 'Fin',
      render: (item) => (
        <div className="flex flex-col text-xs">
          <span className="flex items-center gap-1 text-slate-300 font-medium">
            <Calendar size={12} className="text-brand-orange" />
            {formatDate(item.fecha_fin)}
          </span>
          <span className="flex items-center gap-1 text-slate-500 pl-1 mt-0.5">
            <Clock size={12} />
            {formatTime(item.fecha_fin)}
          </span>
        </div>
      )
    },
    {
      key: 'actions',
      header: 'Acciones',
      render: (item) => (
        <div className="flex gap-2 justify-end">
          {usuario && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); navigate(`/editar-reserva/${item.id}`) }}
                className="p-1.5 text-blue-400 hover:bg-brand-blue/10 rounded-lg transition"
                title="Modificar Agenda"
              >
                <Edit size={16} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleDelete(item.id) }}
                className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                title="Cancelar Reserva"
              >
                <Trash2 size={16} />
              </button>
            </>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Agenda Central</h1>
          <p className="text-slate-400">Visualiza y gestiona el calendario de uso de espacios.</p>
        </div>
        {usuario && (
          <button
            onClick={() => navigate('/registrar-reserva')}
            className="flex items-center gap-2 bg-brand-blue text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors shadow-lg shadow-brand-blue/20 font-bold text-sm tracking-wide"
          >
            <Plus size={18} />
            Agendar Espacio
          </button>
        )}
      </div>

      {/* Access Warning */}
      {!usuario && (
        <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-4 flex items-center gap-3">
          <Lock size={20} className="text-amber-500" />
          <div>
            <p className="text-amber-200 font-medium">Modo Lectura</p>
            <p className="text-amber-400/80 text-sm">Necesitas ser miembro para agendar espacios.</p>
          </div>
        </div>
      )}

      {/* Message */}
      {mensaje && (
        <div
          className={`flex items-center gap-2 p-4 rounded-xl border ${tipoMensaje === 'success'
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
            }`}
        >
          {tipoMensaje === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          {mensaje}
        </div>
      )}

      <DataTable
        columns={columns}
        data={reservas}
        isLoading={loading}
        searchPlaceholder="Buscar en la agenda por nombre o espacio..."
      />
    </div>
  );
}

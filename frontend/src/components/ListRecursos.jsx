import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Edit, Plus, AlertCircle, CheckCircle, Lock, Armchair, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { DataTable } from './ui/DataTable';

export default function ListRecursos() {
  const [recursos, setRecursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState('');
  const { usuario } = useAuth();

  const isAdmin = usuario?.rol === 'admin';

  const fetchRecursos = () => {
    setLoading(true);
    fetch('http://localhost:3000/recursos')
      .then(res => res.json())
      .then(data => {
        const recursosData = data.data || data;
        setRecursos(Array.isArray(recursosData) ? recursosData : []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching recursos:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRecursos();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este espacio permanentemente?')) return;

    try {
      const res = await fetch(`http://localhost:3000/recursos/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMensaje('Espacio eliminado del inventario');
        setTipoMensaje('success');
        fetchRecursos();
        setTimeout(() => setMensaje(''), 3000);
      } else {
        setMensaje('Error al eliminar espacio');
        setTipoMensaje('error');
      }
    } catch {
      setMensaje('Error de conexión');
      setTipoMensaje('error');
    }
  };

  const columns = [
    {
      key: 'nombre',
      header: 'Nombre del Espacio',
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="p-2 bg-brand-blue/10 rounded-lg text-brand-blue">
            <Armchair size={18} />
          </div>
          <span className="font-bold text-slate-200">{item.nombre}</span>
        </div>
      )
    },
    {
      key: 'descripcion',
      header: 'Detalles / Equipamiento',
      render: (item) => <span className="text-slate-400 text-sm truncate max-w-[200px] block">{item.descripcion || 'Sin descripción'}</span>
    },
    {
      key: 'cantidad_disponible',
      header: 'Capacidad',
      render: (item) => (
        <div className="flex items-center gap-1 text-slate-300 font-medium">
          <Users size={14} className="text-brand-orange" />
          {item.cantidad_disponible || 1} pax
        </div>
      )
    },
    // Only add Actions column if Admin
    ...(isAdmin ? [{
      key: 'actions',
      header: 'Acciones',
      render: (item) => (
        <div className="flex gap-2 justify-end">
          <button
            onClick={(e) => { e.stopPropagation(); navigate(`/editar-recurso/${item.id}`) }}
            className="p-1.5 text-blue-400 hover:bg-brand-blue/10 rounded-lg transition"
            title="Editar Espacio"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleDelete(item.id) }}
            className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
            title="Eliminar Espacio"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )
    }] : [])
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Espacios y Equipos</h1>
          <p className="text-slate-400">Inventario de áreas disponibles para reserva.</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => navigate('/registrar-recurso')}
            className="flex items-center gap-2 bg-brand-blue text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors shadow-lg shadow-brand-blue/20 font-bold text-sm tracking-wide"
          >
            <Plus size={18} />
            Nuevo Espacio
          </button>
        )}
      </div>

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
        data={recursos}
        isLoading={loading}
        searchPlaceholder="Buscar espacios..."
      />
    </div>
  );
}

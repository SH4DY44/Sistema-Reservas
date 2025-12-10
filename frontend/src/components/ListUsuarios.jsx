import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Edit, Plus, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { DataTable } from './ui/DataTable';

export default function ListUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState('');
  const { usuario } = useAuth();

  const fetchUsuarios = () => {
    setLoading(true);
    fetch('http://localhost:3000/usuarios')
      .then(res => res.json())
      .then(data => {
        const usuariosData = data.data || data;
        setUsuarios(Array.isArray(usuariosData) ? usuariosData : []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching usuarios:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleDelete = async (id, nombre) => {
    if (!window.confirm(`¿Seguro que deseas eliminar a ${nombre}?`)) return;

    try {
      const res = await fetch(`http://localhost:3000/usuarios/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMensaje('Usuario eliminado exitosamente');
        setTipoMensaje('success');
        fetchUsuarios();
        setTimeout(() => setMensaje(''), 3000);
      } else {
        setMensaje('Error al eliminar el usuario');
        setTipoMensaje('error');
      }
    } catch {
      setMensaje('Error de conexión');
      setTipoMensaje('error');
    }
  };

  const columns = [
    { key: 'nombre', header: 'Nombre' },
    { key: 'email', header: 'Email' },
    {
      key: 'actions',
      header: 'Acciones',
      render: (item) => (
        <div className="flex gap-2">
          {usuario && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); navigate(`/editar-usuario/${item.id}`) }}
                className="p-1.5 text-blue-400 hover:bg-blue-500/10 rounded-lg transition"
              >
                <Edit size={16} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleDelete(item.id, item.nombre) }}
                className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
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
          <h1 className="text-2xl font-bold text-slate-100">Usuarios</h1>
          <p className="text-slate-400">Administra los usuarios registrados en la plataforma.</p>
        </div>
        {usuario && (
          <button
            onClick={() => navigate('/registrar-usuario')}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-900/20 font-medium"
          >
            <Plus size={18} />
            Nuevo Usuario
          </button>
        )}
      </div>

      {mensaje && (
        <div
          className={`flex items-center gap-2 p-4 rounded-xl ${tipoMensaje === 'success'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
            }`}
        >
          {tipoMensaje === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          {mensaje}
        </div>
      )}

      <DataTable
        columns={columns}
        data={usuarios}
        isLoading={loading}
        searchPlaceholder="Buscar por nombre o email..."
      />
    </div>
  );
}

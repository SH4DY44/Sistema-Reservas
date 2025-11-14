import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Edit, Plus, AlertCircle, CheckCircle, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function ListRecursos() {
  const [recursos, setRecursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState('');
  const { usuario } = useAuth();

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

  const handleDelete = async (id, nombre) => {
    if (!window.confirm(`¿Seguro que deseas eliminar ${nombre}?`)) return;
    
    try {
      const res = await fetch(`http://localhost:3000/recursos/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMensaje('Recurso eliminado exitosamente');
        setTipoMensaje('success');
        fetchRecursos();
        setTimeout(() => setMensaje(''), 3000);
      } else {
        setMensaje('Error al eliminar el recurso');
        setTipoMensaje('error');
      }
    } catch {
      setMensaje('Error de conexión');
      setTipoMensaje('error');
    }
  };

  const handleEdit = (id) => {
    navigate(`/editar-recurso/${id}`);
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Recursos</h1>
          <p className="text-gray-600 mt-1">Gestiona la lista de recursos disponibles</p>
        </div>
        {usuario && (
          <button
            onClick={() => navigate('/registrar-recurso')}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Plus size={20} />
            Nuevo Recurso
          </button>
        )}
      </div>

      {/* Mensaje sin permisos */}
      {!usuario && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 flex items-center gap-3">
          <Lock size={20} className="text-amber-600" />
          <div>
            <p className="text-amber-900 font-medium">Acceso limitado</p>
            <p className="text-amber-800 text-sm">Inicia sesión para agregar, editar o eliminar recursos</p>
          </div>
        </div>
      )}

      {/* Message */}
      {mensaje && (
        <div
          className={`flex items-center gap-2 p-4 rounded-lg mb-6 ${
            tipoMensaje === 'success'
              ? 'bg-green-100 text-green-700 border border-green-300'
              : 'bg-red-100 text-red-700 border border-red-300'
          }`}
        >
          {tipoMensaje === 'success' ? (
            <CheckCircle size={20} />
          ) : (
            <AlertCircle size={20} />
          )}
          {mensaje}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center h-64 bg-white rounded-lg border border-gray-200">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : recursos.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-600 text-lg font-medium">No hay recursos registrados</p>
          <p className="text-gray-500 mt-1">Crea el primer recurso para comenzar</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Nombre</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Descripción</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Disponibles</th>
                {usuario && <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Acciones</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recursos.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">{r.nombre}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{r.descripcion || '-'}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-700 rounded-full font-semibold text-xs">
                      {r.cantidad_disponible}
                    </span>
                  </td>
                  {usuario && (
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(r.id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Editar"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(r.id, r.nombre)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Eliminar"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

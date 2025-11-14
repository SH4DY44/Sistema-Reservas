import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Edit, Plus, AlertCircle, CheckCircle, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

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

  const handleEdit = (id) => {
    navigate(`/editar-usuario/${id}`);
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Usuarios</h1>
          <p className="text-gray-600 mt-1">Gestiona la lista de usuarios del sistema</p>
        </div>
        {usuario && (
          <button
            onClick={() => navigate('/registrar-usuario')}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Plus size={20} />
            Nuevo Usuario
          </button>
        )}
      </div>

      {/* Mensaje sin permisos */}
      {!usuario && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 flex items-center gap-3">
          <Lock size={20} className="text-amber-600" />
          <div>
            <p className="text-amber-900 font-medium">Acceso limitado</p>
            <p className="text-amber-800 text-sm">Inicia sesión para agregar, editar o eliminar usuarios</p>
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
      ) : usuarios.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-600 text-lg font-medium">No hay usuarios registrados</p>
          <p className="text-gray-500 mt-1">Crea el primer usuario para comenzar</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Nombre</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Teléfono</th>
                {usuario && <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Acciones</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {usuarios.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">{u.nombre}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{u.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{u.telefono || '-'}</td>
                  {usuario && (
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(u.id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Editar"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(u.id, u.nombre)}
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

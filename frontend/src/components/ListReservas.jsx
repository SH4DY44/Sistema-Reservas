import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Edit, Plus, AlertCircle, CheckCircle, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

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
    // NOTA: Para producción, este confirm debe ser reemplazado por un modal de React
    if (!confirm('¿Seguro que deseas eliminar esta reserva?')) return; 
    
    try {
      const res = await fetch(`http://localhost:3000/reservas/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMensaje('Reserva eliminada exitosamente');
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

  const handleEdit = (id) => {
    navigate(`/editar-reserva/${id}`);
  };

  const formatDate = (dateString) => {
    // Usamos el formato completo para el enfoque empresarial
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Función para determinar el estilo del estado
  const getStatusStyle = (status) => {
    switch(status) {
      case 'cancelada':
        return 'bg-red-100 text-red-700';
      case 'confirmada':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reservas Empresariales</h1>
          <p className="text-gray-600 mt-1">Control de horarios, recursos y motivos.</p>
        </div>
        {usuario && (
          <button
            onClick={() => navigate('/registrar-reserva')}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Plus size={20} />
            Nueva Reserva
          </button>
        )}
      </div>

      {/* Access Limited Warning */}
      {!usuario && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 flex items-center gap-3">
          <Lock size={20} className="text-amber-600" />
          <div>
            <p className="text-amber-900 font-medium">Acceso limitado</p>
            <p className="text-amber-800 text-sm">Inicia sesión para agregar, editar o eliminar reservas</p>
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
      ) : reservas.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-600 text-lg font-medium">No hay reservas registradas</p>
          <p className="text-gray-500 mt-1">Crea la primera reserva para comenzar</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Motivo</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Recurso</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Usuario</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Inicio</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Fin</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Estado</th>
                {usuario && <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Acciones</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {reservas.map((res) => (
                <tr key={res.id} className="hover:bg-gray-50 transition">
                  {/* Motivo (Primero) */}
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium max-w-[150px] truncate">{res.motivo || 'N/A'}</td>
                  
                  <td className="px-6 py-4 text-sm text-gray-600">{res.recurso_nombre || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{res.usuario_nombre || 'N/A'}</td>
                  
                  {/* Columna de Fecha y Hora */}
                  <td className="px-6 py-4 text-sm text-gray-600">{formatDate(res.fecha_inicio)}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{formatDate(res.fecha_fin)}</td>

                  {/*Estado */}
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${getStatusStyle(res.estado)}`}>
                      {res.estado || 'pendiente'}
                    </span>
                  </td>

                  {usuario && (
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(res.id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Editar"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(res.id)}
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
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AlertCircle, CheckCircle, Loader, Save } from 'lucide-react';
import FormLayout from './FormLayout';

// Función auxiliar para convertir TIMESTAMP de la DB a formato 'YYYY-MM-DDTHH:mm'
// Necesario para que el input type="datetime-local" lo muestre correctamente.
const formatForInput = (dbTimestamp) => {
  if (!dbTimestamp) return '';
  const date = new Date(dbTimestamp);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 16);
};


export default function EditReserva() {
  const { id } = useParams();
  const [usuarios, setUsuarios] = useState([]);
  const [recursos, setRecursos] = useState([]);
  const [usuarioId, setUsuarioId] = useState('');
  const [recursoId, setRecursoId] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [motivo, setMotivo] = useState(''); 
  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState('');
  const [loading, setLoading] = useState(false);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:3000/usuarios').then(res => res.json()),
      fetch('http://localhost:3000/recursos').then(res => res.json()),
      fetch(`http://localhost:3000/reservas/${id}`).then(res => res.json())
    ])
      .then(([dataU, dataR, dataRes]) => {
        setUsuarios(dataU.data || dataU);
        setRecursos(dataR.data || dataR);

        const res = dataRes.data || dataRes;
        
        if (res && res.id) {
          setUsuarioId(res.usuario_id || '');
          setRecursoId(res.recurso_id || '');
          // Convertir para mostrar en el input
          setFechaInicio(formatForInput(res.fecha_inicio)); 
          setFechaFin(formatForInput(res.fecha_fin));
          setMotivo(res.motivo || ''); // Cargar motivo
        }
        setCargando(false);
      })
      .catch(err => {
        setMensaje('Error al cargar datos de la reserva');
        setTipoMensaje('error');
        setCargando(false);
      });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setLoading(true);

    // Convertimos las fechas locales a UTC (ISO 8601) antes de enviar
    const isoFechaInicio = new Date(fechaInicio).toISOString();
    const isoFechaFin = new Date(fechaFin).toISOString();
    
    if (isoFechaInicio === 'Invalid Date' || isoFechaFin === 'Invalid Date') {
      setMensaje('Formato de fecha u hora inválido.');
      setTipoMensaje('error');
      setLoading(false);
      return;
    }
    if (!motivo.trim()) {
        setMensaje('El motivo de la reserva es obligatorio.');
        setTipoMensaje('error');
        setLoading(false);
        return;
    }

    try {
      const res = await fetch(`http://localhost:3000/reservas/${id}`, {
        method: 'PUT', // Manteniendo PUT, aunque PATCH también funcionaría
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuario_id: parseInt(usuarioId),
          recurso_id: parseInt(recursoId),
          fecha_inicio: isoFechaInicio,
          fecha_fin: isoFechaFin,
          motivo: motivo 
        })
      });
      const data = await res.json();

      if (res.ok) {
        setMensaje('Reserva actualizada exitosamente');
        setTipoMensaje('success');
        setTimeout(() => navigate('/reservas'), 1500);
      } else {
        setMensaje(data.message || 'Error al actualizar reserva');
        setTipoMensaje('error');
      }
    } catch {
      setMensaje('Error de conexión con el servidor');
      setTipoMensaje('error');
    } finally {
      setLoading(false);
    }
  };

  if (cargando) {
    return (
      <FormLayout title="Editar Reserva" backLink="/reservas">
        <div className="flex justify-center py-8">
          <Loader size={32} className="animate-spin text-blue-600" />
        </div>
      </FormLayout>
    );
  }

  return (
    <FormLayout title="Editar Reserva" backLink="/reservas">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Usuario</label>
          <select
            value={usuarioId}
            onChange={e => setUsuarioId(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="">Selecciona usuario</option>
            {usuarios.map(u => (
              <option key={u.id} value={u.id}>
                {u.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Recurso</label>
          <select
            value={recursoId}
            onChange={e => setRecursoId(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="">Selecciona recurso</option>
            {recursos.map(r => (
              <option key={r.id} value={r.id}>
                {r.nombre} ({r.ubicacion} - Cap: {r.capacidad})
              </option>
            ))}
          </select>
        </div>

        {/* Campo Fecha de Inicio (Manejo de formato) */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Fecha y Hora de Inicio</label>
          <input
            type="datetime-local"
            value={fechaInicio}
            onChange={e => setFechaInicio(e.target.value)}
            required
            className="form-input"
          />
        </div>

        {/* Campo Fecha de Fin (Manejo de formato) */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Fecha y Hora de Fin</label>
          <input
            type="datetime-local"
            value={fechaFin}
            onChange={e => setFechaFin(e.target.value)}
            required
            className="form-input"
          />
        </div>
        
        {/* Motivo */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Motivo de la Reserva</label>
          <input
            type="text"
            placeholder="Ej: Reunión de planeación Q3"
            value={motivo}
            onChange={e => setMotivo(e.target.value)}
            required
            className="form-input"
          />
        </div>

        {mensaje && (
          <div
            className={`flex items-center gap-2 p-4 rounded-lg ${
              tipoMensaje === 'success'
                ? 'bg-green-100 text-green-700 border border-green-400'
                : 'bg-red-100 text-red-700 border border-red-400'
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

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:bg-gray-400"
        >
          {loading ? (
            <>
              <Loader size={20} className="animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Save size={20} />
              Guardar Cambios
            </>
          )}
        </button>
      </form>
    </FormLayout>
  );
}
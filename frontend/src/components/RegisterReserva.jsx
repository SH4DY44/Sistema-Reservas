import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle, Loader, Calendar } from 'lucide-react';
import FormLayout from './FormLayout';

export default function RegisterReserva() {
  const [usuarios, setUsuarios] = useState([]);
  const [recursos, setRecursos] = useState([]);
  const [usuarioId, setUsuarioId] = useState('');
  const [recursoId, setRecursoId] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [motivo, setMotivo] = useState(''); // NUEVO: Estado para el motivo
  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState('');
  const [loading, setLoading] = useState(false);
  const [cargandoOpciones, setCargandoOpciones] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:3000/usuarios').then(res => res.json()),
      fetch('http://localhost:3000/recursos').then(res => res.json())
    ])
      .then(([dataU, dataR]) => {
        // Asegúrate de acceder a 'data' si las respuestas están anidadas
        setUsuarios(dataU.data || dataU); 
        setRecursos(dataR.data || dataR);
        setCargandoOpciones(false);
      })
      .catch(() => {
        setMensaje('Error al cargar opciones');
        setTipoMensaje('error');
        setCargandoOpciones(false);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setLoading(true);

    // CONVERSIÓN CRÍTICA: Convertimos las fechas locales a UTC (ISO 8601)
    // Esto asegura que el Backend (PostgreSQL) maneje correctamente la zona horaria y evite conflictos.
    const isoFechaInicio = new Date(fechaInicio).toISOString();
    const isoFechaFin = new Date(fechaFin).toISOString();
    
    // Verificación de formato y motivo
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
      const res = await fetch('http://localhost:3000/reservas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuario_id: parseInt(usuarioId),
          recurso_id: parseInt(recursoId),
          fecha_inicio: isoFechaInicio, // Enviar fecha inicio convertida
          fecha_fin: isoFechaFin,       // Enviar fecha fin convertida
          motivo: motivo                // Incluir el motivo
        })
      });
      const data = await res.json();

      if (res.ok) {
        setMensaje('Reserva registrada con éxito');
        setTipoMensaje('success');
        
        // Limpiar estados
        setUsuarioId('');
        setRecursoId('');
        setFechaInicio('');
        setFechaFin('');
        setMotivo(''); // Limpiamos el motivo
        
        setTimeout(() => navigate('/reservas'), 1500);
      } else {
        setMensaje(data.message || 'Error al registrar reserva');
        setTipoMensaje('error');
      }
    } catch {
      setMensaje('Error de conexión con el servidor');
      setTipoMensaje('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormLayout title="Crear Reserva" backLink="/reservas">
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Usuario</label>
          <select
            value={usuarioId}
            onChange={e => setUsuarioId(e.target.value)}
            required
            disabled={cargandoOpciones}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:bg-gray-100"
          >
            <option value="">{cargandoOpciones ? 'Cargando...' : 'Selecciona usuario'}</option>
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
            disabled={cargandoOpciones}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:bg-gray-100"
          >
            <option value="">{cargandoOpciones ? 'Cargando...' : 'Selecciona recurso'}</option>
            {recursos.map(r => (
              <option key={r.id} value={r.id}>
                {r.nombre} ({r.ubicacion} - Cap: {r.capacidad}) 
              </option>
            ))}
          </select>
        </div>

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

        {/* Motivo de la Reserva */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Motivo de la Reserva</label>
          <input
            type="text"
            placeholder="Ej: Reunión semanal de equipo"
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
          disabled={loading || cargandoOpciones}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:bg-gray-400"
        >
          {loading ? (
            <>
              <Loader size={20} className="animate-spin" />
              Registrando...
            </>
          ) : (
            <>
              <Calendar size={20} />
              Registrar Reserva
            </>
          )}
        </button>
      </form>
    </FormLayout>
  );
}
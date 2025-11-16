import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AlertCircle, CheckCircle, Loader, Save } from 'lucide-react';
import FormLayout from './FormLayout';

export default function EditRecurso() {
  const { id } = useParams();
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [capacidad, setCapacidad] = useState(1); // NUEVO
  const [ubicacion, setUbicacion] = useState(''); // NUEVO
  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingInit, setLoadingInit] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecurso = async () => {
      try {
        const res = await fetch(`http://localhost:3000/recursos/${id}`);
        const data = await res.json();
        const recurso = data.data || data;

        if (recurso && recurso.id) {
          setNombre(recurso.nombre || '');
          setDescripcion(recurso.descripcion || '');
          setCapacidad(recurso.capacidad || 1); // Cargar capacidad
          setUbicacion(recurso.ubicacion || ''); // Cargar ubicación
        } else {
           setMensaje('Recurso no encontrado.');
           setTipoMensaje('error');
        }
      } catch {
        setMensaje('Error al cargar datos del recurso');
        setTipoMensaje('error');
      } finally {
        setLoadingInit(false);
      }
    };
    
    fetchRecurso();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setLoading(true);

    try {
      // Usamos PATCH para enviar solo los campos modificados
      const res = await fetch(`http://localhost:3000/recursos/${id}`, {
        method: 'PATCH', // Usamos PATCH para actualización parcial
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          nombre, 
          descripcion, 
          capacidad: parseInt(capacidad), // Enviar capacidad
          ubicacion // Enviar ubicación
        })
      });
      const data = await res.json();

      if (res.ok) {
        setMensaje('Recurso actualizado exitosamente. Redirigiendo...');
        setTipoMensaje('success');
        setTimeout(() => navigate('/recursos'), 1500);
      } else {
        setMensaje(data.message || 'Error al actualizar recurso');
        setTipoMensaje('error');
      }
    } catch {
      setMensaje('Error de conexión');
      setTipoMensaje('error');
    } finally {
      setLoading(false);
    }
  };

  if (loadingInit) {
    return (
      <FormLayout title="Editar Recurso" backLink="/recursos">
        <div className="flex justify-center py-8">
          <Loader size={32} className="animate-spin text-green-600" />
        </div>
      </FormLayout>
    );
  }

  return (
    <FormLayout title="Editar Recurso" backLink="/recursos">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Nombre del Recurso</label>
          <input
            type="text"
            placeholder="Ej: Sala de conferencias"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            required
            className="form-input"
          />
        </div>
        
        {/* Capacidad */}
        <div>
          <label htmlFor="capacidad" className="block text-gray-700 font-semibold mb-2">Capacidad</label>
          <input
            type="number"
            id="capacidad"
            placeholder="Máximo de personas"
            value={capacidad}
            onChange={e => setCapacidad(e.target.value)}
            required
            min="1"
            className="form-input"
          />
        </div>
        
        {/* Ubicación */}
        <div>
          <label htmlFor="ubicacion" className="block text-gray-700 font-semibold mb-2">Ubicación</label>
          <input
            type="text"
            id="ubicacion"
            placeholder="Ej: Piso 3, Ala Norte"
            value={ubicacion}
            onChange={e => setUbicacion(e.target.value)}
            className="form-input"
          />
        </div>
        
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Descripción</label>
          <textarea
            placeholder="Descripción detallada del recurso"
            value={descripcion}
            onChange={e => setDescripcion(e.target.value)}
            rows="4"
            className="form-input resize-none"
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
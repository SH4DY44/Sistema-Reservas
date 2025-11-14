import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle, Loader } from 'lucide-react';
import FormLayout from './FormLayout';

export default function RegisterRecurso() {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  //const [cantidadDisponible, setCantidadDisponible] = useState('1');
  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:3000/recursos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre,
          descripcion,
          //cantidad_disponible: parseInt(cantidadDisponible)
        })
      });
      const data = await res.json();

      if (res.ok) {
        setMensaje('Recurso registrado con éxito. Redirigiendo...');
        setTipoMensaje('success');
        setNombre('');
        setDescripcion('');
        //setCantidadDisponible('1');
        setTimeout(() => navigate('/recursos'), 1500);
      } else {
        setMensaje(data.message || 'Error al registrar recurso');
        setTipoMensaje('error');
      }
    } catch {
      setMensaje('Error de conexión');
      setTipoMensaje('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormLayout title="Registrar Recurso" backLink="/recursos">
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
          className="w-full flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:bg-gray-400"
        >
          {loading ? (
            <>
              <Loader size={20} className="animate-spin" />
              Registrando...
            </>
          ) : (
            'Registrar Recurso'
          )}
        </button>
      </form>
    </FormLayout>
  );
}

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AlertCircle, CheckCircle, Loader, Users } from 'lucide-react';
import FormLayout from './FormLayout';

export default function EditRecurso() {
  const { id } = useParams();
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [cantidadDisponible, setCantidadDisponible] = useState('1');
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
        const rec = data.data || data; // Handle wrapper if exists

        if (rec) {
          setNombre(rec.nombre || '');
          setDescripcion(rec.descripcion || '');
          setCantidadDisponible(rec.cantidad_disponible || '1');
        }
      } catch {
        setMensaje('Error al cargar datos');
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
      const res = await fetch(`http://localhost:3000/recursos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre,
          descripcion,
          cantidad_disponible: parseInt(cantidadDisponible)
        })
      });
      const data = await res.json();

      if (res.ok) {
        setMensaje('Espacio actualizado exitosamente. Redirigiendo...');
        setTipoMensaje('success');
        setTimeout(() => navigate('/recursos'), 1500);
      } else {
        setMensaje(data.message || 'Error al actualiza espacio');
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
      <FormLayout title="Editar Espacio" backLink="/recursos">
        <div className="flex justify-center py-8">
          <Loader size={32} className="animate-spin text-brand-blue" />
        </div>
      </FormLayout>
    );
  }

  return (
    <FormLayout title="Editar Espacio" backLink="/recursos">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Nombre del Espacio</label>
          <input
            type="text"
            placeholder="Ej: Sala Plenaria"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            required
            className="block w-full rounded-lg bg-brand-dark border border-slate-700 px-4 py-2.5 text-white placeholder:text-slate-600 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 focus:outline-none transition-all"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Capacidad (Pax)</label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="number"
                min="1"
                placeholder="1"
                value={cantidadDisponible}
                onChange={e => setCantidadDisponible(e.target.value)}
                required
                className="block w-full pl-10 rounded-lg bg-brand-dark border border-slate-700 px-4 py-2.5 text-white placeholder:text-slate-600 focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 focus:outline-none transition-all"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Descripción / Equipamiento</label>
          <textarea
            placeholder="Descripción detallada del espacio"
            value={descripcion}
            onChange={e => setDescripcion(e.target.value)}
            rows="4"
            className="block w-full rounded-lg bg-brand-dark border border-slate-700 px-4 py-2.5 text-white placeholder:text-slate-600 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 focus:outline-none transition-all resize-none"
          />
        </div>

        {mensaje && (
          <div
            className={`flex items-center gap-3 p-4 rounded-lg text-sm border ${tipoMensaje === 'success'
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
              }`}
          >
            {tipoMensaje === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            {mensaje}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-brand-blue hover:bg-blue-600 text-white px-4 py-3 rounded-xl transition-all font-bold shadow-lg shadow-brand-blue/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader size={20} className="animate-spin" />
              Guardando...
            </>
          ) : (
            'Guardar Cambios'
          )}
        </button>
      </form>
    </FormLayout>
  );
}

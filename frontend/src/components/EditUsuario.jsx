import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AlertCircle, CheckCircle, Loader, ArrowLeft } from 'lucide-react';
import FormLayout from './FormLayout';

export default function EditUsuario() {
  const { id } = useParams();
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingInit, setLoadingInit] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const res = await fetch(`http://localhost:3000/usuarios/${id}`);
        const data = await res.json();
        if (data.data) {
          setNombre(data.data.nombre || '');
          setEmail(data.data.email || '');
        } else if (data.nombre) {
          setNombre(data.nombre);
          setEmail(data.email);
        }
      } catch {
        setMensaje('Error al cargar datos');
        setTipoMensaje('error');
      } finally {
        setLoadingInit(false);
      }
    };
    
    fetchUsuario();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setLoading(true);

    try {
      const res = await fetch(`http://localhost:3000/usuarios/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email })
      });
      const data = await res.json();

      if (res.ok) {
        setMensaje('Usuario actualizado exitosamente. Redirigiendo...');
        setTipoMensaje('success');
        setTimeout(() => navigate('/usuarios'), 1500);
      } else {
        setMensaje(data.message || 'Error al actualizar usuario');
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
      <FormLayout title="Editar Usuario" backLink="/usuarios">
        <div className="flex justify-center py-8">
          <Loader size={32} className="animate-spin text-blue-600" />
        </div>
      </FormLayout>
    );
  }

  return (
    <FormLayout title="Editar Usuario" backLink="/usuarios">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Nombre Completo</label>
          <input
            type="text"
            placeholder="Juan Pérez"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            required
            className="form-input"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Email</label>
          <input
            type="email"
            placeholder="juan@ejemplo.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
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
            'Guardar Cambios'
          )}
        </button>
      </form>
    </FormLayout>
  );
}

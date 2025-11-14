import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle, Loader } from 'lucide-react';
import FormLayout from './FormLayout';

export default function RegisterUser() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    
    // Validar passwords
    if (password !== confirmPassword) {
      setMensaje('Las contraseñas no coinciden');
      setTipoMensaje('error');
      return;
    }
    
    if (password.length < 6) {
      setMensaje('La contraseña debe tener mínimo 6 caracteres');
      setTipoMensaje('error');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:3000/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, password })
      });
      const data = await res.json();
      
      if (res.ok) {
        setMensaje('Usuario registrado con éxito. Redirigiendo...');
        setTipoMensaje('success');
        setNombre('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setTimeout(() => navigate('/login'), 1500);
      } else {
        setMensaje(data.message || 'Error al registrar usuario');
        setTipoMensaje('error');
      }
    } catch (err) {
      setMensaje('Error de conexión con el servidor');
      setTipoMensaje('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormLayout title="Registrar Usuario" backLink="/">
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

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Contraseña</label>
          <input
            type="password"
            placeholder="Mínimo 6 caracteres"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="form-input"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Confirmar Contraseña</label>
          <input
            type="password"
            placeholder="Repite tu contraseña"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
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
              Registrando...
            </>
          ) : (
            'Registrar Usuario'
          )}
        </button>
      </form>
    </FormLayout>
  );
}

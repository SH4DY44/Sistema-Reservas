import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AlertCircle, CheckCircle, Loader, LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import FormLayout from './FormLayout';

export default function LoginUser() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:3000/usuarios/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (res.ok && data.data) {
        setMensaje('Inicio de sesión exitoso. Redirigiendo...');
        setTipoMensaje('success');
        login(data.data);
        setEmail('');
        setPassword('');
        setTimeout(() => navigate('/'), 1500);
      } else {
        setMensaje(data.message || 'Credenciales incorrectas');
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
    <FormLayout title="Iniciar Sesión" backLink="/">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Email</label>
          <input
            type="email"
            placeholder="tu@ejemplo.com"
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
            placeholder="Tu contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
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
              Iniciando sesión...
            </>
          ) : (
            <>
              <LogIn size={20} />
              Iniciar Sesión
            </>
          )}
        </button>

        <div className="text-center pt-4 border-t border-gray-300">
          <p className="text-gray-600">¿No tienes cuenta?</p>
          <Link
            to="/registrar-usuario"
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            Registrate aquí
          </Link>
        </div>
      </form>
    </FormLayout>
  );
}

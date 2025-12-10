import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AlertCircle, CheckCircle, Loader, LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AuthService from '../services/authService';
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
      const response = await AuthService.login(email, password);

      if (response.success && response.data) {
        setMensaje('Inicio de sesión exitoso. Redirigiendo...');
        setTipoMensaje('success');
        login(response.data); // data.data contains the user info
        setEmail('');
        setPassword('');
        setTimeout(() => navigate('/'), 1500);
      } else {
        setMensaje(response.message || 'Credenciales incorrectas');
        setTipoMensaje('error');
      }
    } catch (error) {
      setMensaje(error.message || 'Error de conexión con el servidor');
      setTipoMensaje('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormLayout title="Iniciar Sesión">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Email Corporativo</label>
          <input
            type="email"
            placeholder="tu@nexus.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="block w-full rounded-lg bg-brand-dark border border-slate-700 px-4 py-2.5 text-white placeholder:text-slate-600 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 focus:outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Contraseña</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="block w-full rounded-lg bg-brand-dark border border-slate-700 px-4 py-2.5 text-white placeholder:text-slate-600 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 focus:outline-none transition-all"
          />
        </div>

        {mensaje && (
          <div
            className={`flex items-center gap-3 p-4 rounded-lg text-sm border ${tipoMensaje === 'success'
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
              }`}
          >
            {tipoMensaje === 'success' ? (
              <CheckCircle size={18} className="shrink-0" />
            ) : (
              <AlertCircle size={18} className="shrink-0" />
            )}
            {mensaje}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-brand-blue hover:bg-blue-600 text-white px-4 py-3 rounded-xl transition-all font-bold shadow-lg shadow-brand-blue/20 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-brand-blue/40"
        >
          {loading ? (
            <>
              <Loader size={20} className="animate-spin" />
              Accediendo...
            </>
          ) : (
            <>
              <LogIn size={20} />
              Entrar al Workspace
            </>
          )}
        </button>

        <div className="text-center pt-2">
          <p className="text-sm text-slate-500">
            ¿No tienes cuenta?{' '}
            <Link
              to="/registrar-usuario"
              className="text-brand-orange hover:text-orange-400 font-semibold transition-colors"
            >
              Solicitar acceso
            </Link>
          </p>
        </div>
      </form>
    </FormLayout>
  );
}

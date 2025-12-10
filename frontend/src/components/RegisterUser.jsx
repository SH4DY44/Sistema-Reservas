import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AlertCircle, CheckCircle, Loader, UserPlus, ShieldAlert } from 'lucide-react';
import AuthService from '../services/authService';
import FormLayout from './FormLayout';

export default function RegisterUser() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [adminCode, setAdminCode] = useState('');
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
      const response = await AuthService.register({ nombre, email, password, adminCode });

      if (response.success) {
        setMensaje('Usuario registrado con éxito. Redirigiendo...');
        setTipoMensaje('success');
        setNombre('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setAdminCode('');
        setTimeout(() => navigate('/login'), 1500);
      } else {
        setMensaje(response.message || 'Error al registrar usuario');
        setTipoMensaje('error');
      }
    } catch (err) {
      setMensaje(err.message || 'Error de conexión con el servidor');
      setTipoMensaje('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormLayout title="Crear Cuenta" backLink="/login">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Nombre Completo</label>
          <input
            type="text"
            placeholder="Juan Pérez"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            required
            className="block w-full rounded-lg bg-brand-dark border border-slate-700 px-4 py-2.5 text-white placeholder:text-slate-600 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 focus:outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Email Corporativo</label>
          <input
            type="email"
            placeholder="juan@nexus.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="block w-full rounded-lg bg-brand-dark border border-slate-700 px-4 py-2.5 text-white placeholder:text-slate-600 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 focus:outline-none transition-all"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Contraseña</label>
            <input
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="block w-full rounded-lg bg-brand-dark border border-slate-700 px-4 py-2.5 text-white placeholder:text-slate-600 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Confirmar</label>
            <input
              type="password"
              placeholder="Repite la contraseña"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              className="block w-full rounded-lg bg-brand-dark border border-slate-700 px-4 py-2.5 text-white placeholder:text-slate-600 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Admin Code Section */}
        <div className="pt-2">
          <div className="relative group">
            <label className="block text-sm font-medium text-brand-orange/80 mb-2 flex items-center gap-2">
              <ShieldAlert size={14} />
              Código de Administrador (Opcional)
            </label>
            <input
              type="text"
              placeholder="Solo si tienes un código especial"
              value={adminCode}
              onChange={e => setAdminCode(e.target.value)}
              className="block w-full rounded-lg bg-brand-dark/50 border border-slate-800 border-dashed px-4 py-2.5 text-brand-orange placeholder:text-slate-700 focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 focus:outline-none transition-all"
            />
          </div>
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
              Creando cuenta...
            </>
          ) : (
            <>
              <UserPlus size={20} />
              Registrarse
            </>
          )}
        </button>

        <div className="text-center pt-2">
          <p className="text-sm text-slate-500">
            ¿Ya tienes cuenta?{' '}
            <Link
              to="/login"
              className="text-brand-orange hover:text-orange-400 font-semibold transition-colors"
            >
              Inicia Sesión
            </Link>
          </p>
        </div>
      </form>
    </FormLayout>
  );
}

import React, { useState } from 'react';
import { Eye, EyeOff, User, Lock, AlertCircle } from 'lucide-react';
import { store, User as UserType } from '../data/store';

interface LoginProps {
  onLogin: (user: UserType) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!username.trim() || !password.trim()) {
      setError('Por favor completa todos los campos.');
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    const user = store.users.find(
      u => u.username === username && u.password === password
    );
    if (user) {
      if (user.status === 'Inactivo') {
        setError('Tu cuenta está desactivada. Contacta al administrador.');
        setLoading(false);
        return;
      }
      store.currentUser = user;
      user.lastLogin = new Date().toLocaleString('es-NI');
      store.activityLogs.unshift({
        id: store.activityLogs.length + 1,
        userId: user.id,
        userName: user.name,
        action: 'Inicio de sesión',
        module: 'Sistema',
        timestamp: new Date().toLocaleString('es-NI'),
        details: 'Acceso exitoso desde escritorio',
      });
      onLogin(user);
    } else {
      setError('Usuario o contraseña incorrectos. Intenta nuevamente.');
    }
    setLoading(false);
  };

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;
    setForgotSent(true);
  };

  return (
    <div className="login-page">
      {/* Background decorations */}
      <div style={{
        position: 'absolute', top: '-100px', left: '-100px',
        width: '400px', height: '400px', background: 'rgba(34,197,94,0.08)',
        borderRadius: '50%', filter: 'blur(60px)'
      }} />
      <div style={{
        position: 'absolute', bottom: '-100px', right: '-100px',
        width: '400px', height: '400px', background: 'rgba(249,115,22,0.08)',
        borderRadius: '50%', filter: 'blur(60px)'
      }} />

      {!forgotMode ? (
        <div className="login-card">
          <div className="login-logo">
            <div className="login-logo-icon">🍓</div>
            <h1 className="login-title">Chily Frutas</h1>
            <p className="login-subtitle">Sistema de Ventas e Inventario</p>
          </div>

          <form className="login-form" onSubmit={handleLogin}>
            {error && (
              <div className="login-error">
                <AlertCircle size={15} />
                {error}
              </div>
            )}

            <div className="form-group">
              <label>Usuario</label>
              <div className="input-wrapper">
                <User className="input-icon" />
                <input
                  type="text"
                  placeholder="Ingresa tu usuario"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  autoFocus
                />
              </div>
            </div>

            <div className="form-group">
              <label>Contraseña</label>
              <div className="input-wrapper">
                <Lock className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(v => !v)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn-login"
              disabled={loading}
              style={{ opacity: loading ? 0.8 : 1 }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <svg style={{ animation: 'spin 1s linear infinite', width: 18, height: 18 }} viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  Iniciando sesión...
                </span>
              ) : 'Iniciar Sesión'}
            </button>
          </form>

          <div className="login-forgot">
            <a href="#" onClick={e => { e.preventDefault(); setForgotMode(true); }}>
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          <div className="login-demo">
            <p>🔑 Credenciales de demostración:</p>
            <span style={{ display: 'block', marginBottom: 2 }}>
              <strong>Admin:</strong> admin / admin123
            </span>
            <span style={{ display: 'block' }}>
              <strong>Cajero:</strong> cajero1 / cajero123
            </span>
          </div>
        </div>
      ) : (
        <div className="login-card">
          {!forgotSent ? (
            <>
              <div className="login-logo">
                <div className="login-logo-icon" style={{ fontSize: 28 }}>🔐</div>
                <h1 className="login-title" style={{ fontSize: 22 }}>Recuperar Contraseña</h1>
                <p className="login-subtitle">Ingresa tu correo electrónico</p>
              </div>
              <form className="login-form" onSubmit={handleForgot}>
                <div className="form-group">
                  <label>Correo Electrónico</label>
                  <div className="input-wrapper">
                    <User className="input-icon" />
                    <input
                      type="email"
                      placeholder="tu@correo.com"
                      value={forgotEmail}
                      onChange={e => setForgotEmail(e.target.value)}
                    />
                  </div>
                </div>
                <button type="submit" className="btn-login">Enviar Instrucciones</button>
              </form>
              <div className="login-forgot">
                <a href="#" onClick={e => { e.preventDefault(); setForgotMode(false); }}>
                  ← Volver al inicio de sesión
                </a>
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: '#1a2e1a', marginBottom: 8 }}>¡Correo enviado!</h2>
              <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 24, lineHeight: 1.6 }}>
                Hemos enviado las instrucciones de recuperación a <strong>{forgotEmail}</strong>. Revisa tu bandeja de entrada.
              </p>
              <button
                className="btn-login"
                onClick={() => { setForgotMode(false); setForgotSent(false); setForgotEmail(''); }}
              >
                Volver al inicio de sesión
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

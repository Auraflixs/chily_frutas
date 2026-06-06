import { useState, useCallback } from 'react';
import Login from './components/Login';
import Sidebar, { Module } from './components/Sidebar';
import Header from './components/Header';
import Toast, { ToastMessage } from './components/Toast';
import Dashboard from './components/modules/Dashboard';
import Ventas from './components/modules/Ventas';
import MenuProductos from './components/modules/MenuProductos';
import Inventario from './components/modules/Inventario';
import Ingredientes from './components/modules/Ingredientes';
import Clientes from './components/modules/Clientes';
import Reportes from './components/modules/Reportes';
import Usuarios from './components/modules/Usuarios';
import Configuracion from './components/modules/Configuracion';
import Ayuda from './components/modules/Ayuda';
import Acerca from './components/modules/Acerca';
import Seguridad from './components/modules/Seguridad';
import { store, User } from './data/store';

let toastCounter = 0;

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeModule, setActiveModule] = useState<Module>('dashboard');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const showToast = useCallback((message: string, type: string = 'success') => {
    const id = ++toastCounter;
    setToasts(prev => [...prev, {
      id,
      message,
      type: type as ToastMessage['type']
    }]);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const handleLogin = (user: User) => {
    setIsLoggedIn(true);
    setActiveModule('dashboard');
  };

  const handleLogout = () => {
    showToast(`Sesión cerrada. ¡Hasta pronto, ${store.currentUser?.name}!`, 'info');
    setTimeout(() => {
      store.currentUser = null;
      setIsLoggedIn(false);
      setActiveModule('dashboard');
    }, 1000);
  };

  const handleNavigate = (module: Module) => {
    setActiveModule(module);
    setRefreshKey(k => k + 1);
  };

  const handleSaleComplete = () => {
    setRefreshKey(k => k + 1);
  };

  const handleRefresh = () => {
    setRefreshKey(k => k + 1);
    showToast('Datos actualizados', 'info');
  };

  // Logout confirmation modal
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const requestLogout = () => setShowLogoutConfirm(true);

  const renderModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return <Dashboard key={refreshKey} />;
      case 'ventas':
        return <Ventas key={refreshKey} onSaleComplete={handleSaleComplete} showToast={showToast} />;
      case 'menu':
        return <MenuProductos key={refreshKey} showToast={showToast} onAddToSale={() => handleNavigate('ventas')} />;
      case 'inventario':
        return <Inventario key={refreshKey} showToast={showToast} />;
      case 'ingredientes':
        return <Ingredientes key={refreshKey} showToast={showToast} />;
      case 'clientes':
        return <Clientes key={refreshKey} showToast={showToast} />;
      case 'reportes':
        return <Reportes key={refreshKey} showToast={showToast} />;
      case 'usuarios':
        return <Usuarios key={refreshKey} showToast={showToast} />;
      case 'configuracion':
        return <Configuracion key={refreshKey} showToast={showToast} />;
      case 'ayuda':
        return <Ayuda key={refreshKey} />;
      case 'acerca':
        return <Acerca key={refreshKey} />;
      case 'seguridad':
        return <Seguridad key={refreshKey} />;
      default:
        return <Dashboard key={refreshKey} />;
    }
  };

  if (!isLoggedIn) {
    return (
      <>
        <Login onLogin={handleLogin} />
        <Toast toasts={toasts} onRemove={removeToast} />
      </>
    );
  }

  return (
    <>
      <div className="app-layout">
        <Sidebar
          activeModule={activeModule}
          onNavigate={handleNavigate}
          onLogout={requestLogout}
        />
        <div className="main-area">
          <Header activeModule={activeModule} onRefresh={handleRefresh} />
          <div className="page-content" key={`content-${activeModule}`}>
            {renderModule()}
          </div>
        </div>
      </div>

      {/* Logout Confirmation */}
      {showLogoutConfirm && (
        <div className="modal-overlay" onClick={() => setShowLogoutConfirm(false)}>
          <div
            className="modal modal-sm animate-modalIn"
            onClick={e => e.stopPropagation()}
          >
            <div className="modal-body" style={{ textAlign: 'center', padding: '36px 28px' }}>
              <div style={{ fontSize: 52, marginBottom: 14 }}>👋</div>
              <h3 style={{ fontSize: 20, fontWeight: 800, color: '#1a2e1a', marginBottom: 8 }}>
                ¿Cerrar Sesión?
              </h3>
              <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 24, lineHeight: 1.6 }}>
                Se cerrará la sesión de <strong>{store.currentUser?.name}</strong>.
                Asegúrate de haber guardado tus cambios.
              </p>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                <button
                  className="btn btn-outline"
                  onClick={() => setShowLogoutConfirm(false)}
                  style={{ flex: 1 }}
                >
                  Cancelar
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => {
                    setShowLogoutConfirm(false);
                    handleLogout();
                  }}
                  style={{ flex: 1 }}
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Toast toasts={toasts} onRemove={removeToast} />
    </>
  );
}

import { useState, useEffect } from 'react';
import { Bell, RefreshCw } from 'lucide-react';
import { store } from '../data/store';

const moduleNames: Record<string, string> = {
  dashboard: 'Dashboard',
  ventas: 'Módulo de Ventas',
  menu: 'Menú de Productos',
  inventario: 'Inventario',
  ingredientes: 'Ingredientes',
  clientes: 'Clientes',
  reportes: 'Reportes',
  usuarios: 'Gestión de Usuarios',
  configuracion: 'Configuración',
  ayuda: 'Ayuda',
  acerca: 'Acerca del Sistema',
  seguridad: 'Seguridad',
};

interface HeaderProps {
  activeModule: string;
  onRefresh?: () => void;
}

export default function Header({ activeModule, onRefresh }: HeaderProps) {
  const [time, setTime] = useState(new Date());
  const lowStock = store.getLowStockProducts().length;
  const outStock = store.getOutOfStockProducts().length;
  const alertCount = lowStock + outStock;

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (d: Date) =>
    d.toLocaleTimeString('es-NI', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  const formatDate = (d: Date) =>
    d.toLocaleDateString('es-NI', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <header className="header">
      <div className="header-left">
        <div>
          <div className="header-title">{moduleNames[activeModule] || 'Panel'}</div>
          <div className="header-breadcrumb">
            Chily Frutas / {moduleNames[activeModule] || 'Panel'}
          </div>
        </div>
      </div>

      <div className="header-right">
        <button className="header-btn" onClick={onRefresh} title="Actualizar">
          <RefreshCw size={17} />
        </button>

        <button className="header-btn" title="Notificaciones" style={{ position: 'relative' }}>
          <Bell size={17} />
          {alertCount > 0 && <span className="header-notif-dot" />}
        </button>

        <div className="header-divider" />

        <div className="header-datetime">
          <div className="header-time">{formatTime(time)}</div>
          <div className="header-date" style={{ textTransform: 'capitalize' }}>
            {formatDate(time)}
          </div>
        </div>

        <div style={{
          width: 36, height: 36,
          background: 'linear-gradient(135deg, #f97316, #ea580c)',
          borderRadius: 8,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, fontWeight: 800, color: 'white',
          cursor: 'pointer'
        }}>
          {store.currentUser?.avatar}
        </div>
      </div>
    </header>
  );
}

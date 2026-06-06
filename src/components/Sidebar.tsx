
import {
  LayoutDashboard, ShoppingCart, UtensilsCrossed, Package, Leaf,
  Users, BarChart3, UserCog, Settings, HelpCircle, Info,
  LogOut, ChevronRight, AlertTriangle
} from 'lucide-react';
import { store } from '../data/store';

export type Module =
  | 'dashboard' | 'ventas' | 'menu' | 'inventario' | 'ingredientes'
  | 'clientes' | 'reportes' | 'usuarios' | 'configuracion' | 'ayuda'
  | 'acerca' | 'seguridad';

interface SidebarProps {
  activeModule: Module;
  onNavigate: (module: Module) => void;
  onLogout: () => void;
}

const navMain = [
  { id: 'dashboard', label: 'Inicio', icon: LayoutDashboard },
  { id: 'ventas', label: 'Ventas', icon: ShoppingCart },
  { id: 'menu', label: 'Menú de Productos', icon: UtensilsCrossed },
  { id: 'inventario', label: 'Inventario', icon: Package },
  { id: 'ingredientes', label: 'Ingredientes', icon: Leaf },
  { id: 'clientes', label: 'Clientes', icon: Users },
  { id: 'reportes', label: 'Reportes', icon: BarChart3 },
];

const navAdmin = [
  { id: 'usuarios', label: 'Usuarios', icon: UserCog },
  { id: 'seguridad', label: 'Seguridad', icon: AlertTriangle },
  { id: 'configuracion', label: 'Configuración', icon: Settings },
];

const navHelp = [
  { id: 'ayuda', label: 'Ayuda', icon: HelpCircle },
  { id: 'acerca', label: 'Acerca del Sistema', icon: Info },
];

export default function Sidebar({ activeModule, onNavigate, onLogout }: SidebarProps) {
  const user = store.currentUser!;
  const lowStock = store.getLowStockProducts().length;
  const outStock = store.getOutOfStockProducts().length;
  const alertCount = lowStock + outStock;

  const isAdmin = user.role === 'Administrador';

  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">🍓</div>
        <div className="sidebar-brand-text">
          <h1>Chily Frutas</h1>
          <p>Sistema Administrativo</p>
        </div>
      </div>

      {/* User */}
      <div className="sidebar-user">
        <div className="sidebar-avatar">{user.avatar}</div>
        <div className="sidebar-user-info">
          <h3>{user.name}</h3>
          <p>{user.role}</p>
        </div>
        <ChevronRight size={14} style={{ color: 'rgba(255,255,255,0.3)', marginLeft: 'auto', flexShrink: 0 }} />
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {/* Main */}
        <div className="nav-section">
          <p className="nav-section-label">Principal</p>
          {navMain.map(item => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className={`nav-item ${activeModule === item.id ? 'active' : ''}`}
                onClick={() => onNavigate(item.id as Module)}
              >
                <Icon className="nav-item-icon" size={18} />
                {item.label}
                {item.id === 'inventario' && alertCount > 0 && (
                  <span className="nav-item-badge">{alertCount}</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Admin */}
        {isAdmin && (
          <div className="nav-section">
            <p className="nav-section-label">Administración</p>
            {navAdmin.map(item => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className={`nav-item ${activeModule === item.id ? 'active' : ''}`}
                  onClick={() => onNavigate(item.id as Module)}
                >
                  <Icon className="nav-item-icon" size={18} />
                  {item.label}
                </div>
              );
            })}
          </div>
        )}

        {/* Help */}
        <div className="nav-section">
          <p className="nav-section-label">Soporte</p>
          {navHelp.map(item => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className={`nav-item ${activeModule === item.id ? 'active' : ''}`}
                onClick={() => onNavigate(item.id as Module)}
              >
                <Icon className="nav-item-icon" size={18} />
                {item.label}
              </div>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <div
          className="nav-item"
          onClick={onLogout}
          style={{ color: '#ef4444' }}
        >
          <LogOut size={18} style={{ color: '#ef4444' }} />
          Cerrar Sesión
        </div>
        <div style={{ padding: '8px 12px', fontSize: 10, color: 'rgba(255,255,255,0.2)', textAlign: 'center' }}>
          Chily Frutas v1.0.0 © 2025
        </div>
      </div>
    </aside>
  );
}

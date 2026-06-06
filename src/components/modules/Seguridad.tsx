
import { Shield, Activity, Lock, Eye, Clock } from 'lucide-react';
import { store } from '../../data/store';

export default function Seguridad() {
  const logs = store.activityLogs;

  const moduleColors: Record<string, string> = {
    'Sistema': 'badge-blue',
    'Ventas': 'badge-green',
    'Inventario': 'badge-orange',
    'Usuarios': 'badge-purple',
    'Configuración': 'badge-gray',
  };

  const actionIcons: Record<string, string> = {
    'Inicio de sesión': '🔐',
    'Venta registrada': '🛒',
    'Producto editado': '✏️',
    'Producto eliminado': '🗑️',
    'Usuario creado': '👤',
  };

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <div className="page-header-left">
          <h2>Módulo de Seguridad</h2>
          <p>Control de accesos y registro de actividades del sistema</p>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)', marginBottom: 20 }}>
        {[
          { icon: '🔐', label: 'Accesos Hoy', value: logs.filter(l => l.action === 'Inicio de sesión').length, color: '#16a34a', bg: '#dcfce7' },
          { icon: '🛒', label: 'Ventas Registradas', value: logs.filter(l => l.action === 'Venta registrada').length, color: '#f97316', bg: '#fff7ed' },
          { icon: '👥', label: 'Usuarios Activos', value: store.users.filter(u => u.status === 'Activo').length, color: '#3b82f6', bg: '#eff6ff' },
          { icon: '📋', label: 'Total Actividades', value: logs.length, color: '#a855f7', bg: '#f5f3ff' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-card-header">
              <div className="stat-card-icon" style={{ background: s.bg, fontSize: 20 }}>{s.icon}</div>
            </div>
            <div className="stat-card-value" style={{ color: s.color }}>{s.value}</div>
            <div className="stat-card-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Security Features */}
      <div className="grid-2" style={{ marginBottom: 20 }}>
        <div className="card">
          <div className="card-header">
            <div className="card-title"><Shield size={18} color="#16a34a" /> Control de Permisos</div>
          </div>
          <div className="card-body">
            {[
              { module: 'Ventas', admin: true, cajero: true },
              { module: 'Menú de Productos', admin: true, cajero: true },
              { module: 'Inventario', admin: true, cajero: true },
              { module: 'Ingredientes', admin: true, cajero: false },
              { module: 'Clientes', admin: true, cajero: true },
              { module: 'Reportes', admin: true, cajero: false },
              { module: 'Usuarios', admin: true, cajero: false },
              { module: 'Configuración', admin: true, cajero: false },
              { module: 'Seguridad', admin: true, cajero: false },
            ].map(row => (
              <div key={row.module} style={{ display: 'grid', gridTemplateColumns: '1fr 80px 80px', gap: 8, padding: '10px 0', borderBottom: '1px solid #f3f4f6', alignItems: 'center', fontSize: 13 }}>
                <span style={{ fontWeight: 500, color: '#374151' }}>{row.module}</span>
                <div style={{ textAlign: 'center' }}>
                  <span className={row.admin ? 'badge badge-green' : 'badge badge-red'} style={{ fontSize: 10 }}>
                    {row.admin ? '✓ Admin' : '✗'}
                  </span>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <span className={row.cajero ? 'badge badge-blue' : 'badge badge-gray'} style={{ fontSize: 10 }}>
                    {row.cajero ? '✓ Cajero' : '✗ No'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title"><Lock size={18} color="#16a34a" /> Estado de Seguridad</div>
          </div>
          <div className="card-body">
            {[
              { icon: <Shield size={18} color="#16a34a" />, label: 'Control de accesos', status: 'Activo', ok: true },
              { icon: <Eye size={18} color="#16a34a" />, label: 'Registro de actividades', status: 'Activo', ok: true },
              { icon: <Lock size={18} color="#16a34a" />, label: 'Autenticación de usuarios', status: 'Activo', ok: true },
              { icon: <Activity size={18} color="#f97316" />, label: 'Doble factor (2FA)', status: 'Inactivo', ok: false },
              { icon: <Clock size={18} color="#f97316" />, label: 'Cierre por inactividad', status: 'Inactivo', ok: false },
              { icon: <Shield size={18} color="#16a34a" />, label: 'Roles y permisos', status: 'Activo', ok: true },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 0', borderBottom: '1px solid #f3f4f6' }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: item.ok ? '#dcfce7' : '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {item.icon}
                </div>
                <div style={{ flex: 1, fontSize: 13, color: '#374151', fontWeight: 500 }}>{item.label}</div>
                <span className={`badge ${item.ok ? 'badge-green' : 'badge-yellow'}`}>{item.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity Log */}
      <div className="card">
        <div className="card-header">
          <div className="card-title"><Activity size={18} color="#16a34a" /> Historial de Actividades</div>
          <span className="badge badge-gray">{logs.length} registros</span>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Acción</th>
                <th>Usuario</th>
                <th>Módulo</th>
                <th>Timestamp</th>
                <th>Detalles</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(log => (
                <tr key={log.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 16 }}>{actionIcons[log.action] || '📌'}</span>
                      <span style={{ fontWeight: 600, fontSize: 13 }}>{log.action}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 28, height: 28, borderRadius: 6, background: 'linear-gradient(135deg,#16a34a,#22c55e)', color: 'white', fontWeight: 800, fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {log.userName.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                      </div>
                      <span style={{ fontSize: 13 }}>{log.userName}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${moduleColors[log.module] || 'badge-gray'}`}>{log.module}</span>
                  </td>
                  <td style={{ fontSize: 12, color: '#9ca3af', fontFamily: 'monospace' }}>{log.timestamp}</td>
                  <td style={{ fontSize: 12, color: '#6b7280' }}>{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

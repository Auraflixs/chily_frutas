import { useState } from 'react';
import { Settings, Bell, Printer, Shield, Palette, Building2 } from 'lucide-react';
import { store } from '../../data/store';

interface ConfiguracionProps {
  showToast: (msg: string, type?: string) => void;
}

export default function Configuracion({ showToast }: ConfiguracionProps) {
  const [config, setConfig] = useState({ ...store.config });
  const [activeTab, setActiveTab] = useState('general');

  const handleSave = () => {
    store.config = { ...config };
    showToast('Configuración guardada exitosamente', 'success');
  };

  const ToggleRow = ({ label, desc, value, onChange }: { label: string; desc: string; value: boolean; onChange: (v: boolean) => void }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid #f3f4f6' }}>
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>{label}</div>
        <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>{desc}</div>
      </div>
      <label className="toggle-switch">
        <input type="checkbox" checked={value} onChange={e => onChange(e.target.checked)} />
        <span className="toggle-slider"></span>
      </label>
    </div>
  );

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <div className="page-header-left">
          <h2>Configuración del Sistema</h2>
          <p>Personaliza el comportamiento de Chily Frutas</p>
        </div>
        <button className="btn btn-primary" onClick={handleSave}>
          Guardar Cambios
        </button>
      </div>

      <div className="tabs">
        {[
          { id: 'general', label: 'General', icon: <Building2 size={14} /> },
          { id: 'apariencia', label: 'Apariencia', icon: <Palette size={14} /> },
          { id: 'notificaciones', label: 'Notificaciones', icon: <Bell size={14} /> },
          { id: 'impresion', label: 'Impresión', icon: <Printer size={14} /> },
          { id: 'seguridad', label: 'Seguridad', icon: <Shield size={14} /> },
        ].map(tab => (
          <div key={tab.id} className={`tab ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
            {tab.icon} {tab.label}
          </div>
        ))}
      </div>

      {activeTab === 'general' && (
        <div className="card">
          <div className="card-header">
            <div className="card-title"><Building2 size={18} color="#16a34a" /> Información del Negocio</div>
          </div>
          <div className="card-body">
            <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 28, padding: 20, background: 'linear-gradient(135deg,#f0fdf4,#dcfce7)', borderRadius: 12 }}>
              <div style={{ fontSize: 56, width: 80, height: 80, background: 'linear-gradient(135deg,#16a34a,#22c55e)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(22,163,74,0.3)' }}>
                {config.logo}
              </div>
              <div>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: '#1a2e1a' }}>{config.businessName}</h3>
                <p style={{ fontSize: 13, color: '#6b7280', marginTop: 2 }}>{config.businessAddress}</p>
                <p style={{ fontSize: 13, color: '#6b7280' }}>Tel: {config.businessPhone}</p>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Nombre del Negocio</label>
                <input className="form-input" value={config.businessName} onChange={e => setConfig(c => ({ ...c, businessName: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Teléfono</label>
                <input className="form-input" value={config.businessPhone} onChange={e => setConfig(c => ({ ...c, businessPhone: e.target.value }))} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Dirección</label>
              <input className="form-input" value={config.businessAddress} onChange={e => setConfig(c => ({ ...c, businessAddress: e.target.value }))} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Moneda</label>
                <select className="form-select" value={config.currency} onChange={e => setConfig(c => ({ ...c, currency: e.target.value }))}>
                  <option value="C$">C$ (Córdoba Nicaragüense)</option>
                  <option value="$">$ (Dólar)</option>
                  <option value="Q">Q (Quetzal)</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Tasa de Impuesto (%)</label>
                <input type="number" className="form-input" value={config.taxRate} onChange={e => setConfig(c => ({ ...c, taxRate: Number(e.target.value) }))} min={0} max={100} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Logo (Emoji)</label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {['🍓', '🍉', '🥭', '🍊', '🍍', '🥑', '🍇', '🫐'].map(e => (
                  <button key={e} type="button" onClick={() => setConfig(c => ({ ...c, logo: e }))} style={{ width: 44, height: 44, fontSize: 22, border: config.logo === e ? '2px solid #16a34a' : '2px solid #e5e7eb', borderRadius: 8, cursor: 'pointer', background: config.logo === e ? '#f0fdf4' : 'white' }}>
                    {e}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'apariencia' && (
        <div className="card">
          <div className="card-header">
            <div className="card-title"><Palette size={18} color="#16a34a" /> Apariencia y Tema</div>
          </div>
          <div className="card-body">
            <div style={{ marginBottom: 24 }}>
              <div className="form-label" style={{ marginBottom: 12 }}>Tema del Sistema</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div
                  onClick={() => setConfig(c => ({ ...c, theme: 'light' }))}
                  style={{
                    padding: 20, borderRadius: 12, border: config.theme === 'light' ? '2px solid #16a34a' : '2px solid #e5e7eb',
                    cursor: 'pointer', background: config.theme === 'light' ? '#f0fdf4' : 'white', transition: 'all 0.2s'
                  }}
                >
                  <div style={{ fontSize: 32, marginBottom: 8 }}>☀️</div>
                  <div style={{ fontWeight: 700, color: '#1a2e1a', marginBottom: 4 }}>Tema Claro</div>
                  <div style={{ fontSize: 12, color: '#6b7280' }}>Interfaz con fondo blanco y colores suaves</div>
                  {config.theme === 'light' && <div style={{ marginTop: 8 }}><span className="badge badge-green">Activo</span></div>}
                </div>
                <div
                  onClick={() => setConfig(c => ({ ...c, theme: 'dark' }))}
                  style={{
                    padding: 20, borderRadius: 12, border: config.theme === 'dark' ? '2px solid #16a34a' : '2px solid #e5e7eb',
                    cursor: 'pointer', background: config.theme === 'dark' ? '#f0fdf4' : 'white', transition: 'all 0.2s'
                  }}
                >
                  <div style={{ fontSize: 32, marginBottom: 8 }}>🌙</div>
                  <div style={{ fontWeight: 700, color: '#1a2e1a', marginBottom: 4 }}>Tema Oscuro</div>
                  <div style={{ fontSize: 12, color: '#6b7280' }}>Interfaz oscura ideal para trabajar de noche</div>
                  {config.theme === 'dark' && <div style={{ marginTop: 8 }}><span className="badge badge-green">Activo</span></div>}
                </div>
              </div>
            </div>

            <div>
              <div className="form-label" style={{ marginBottom: 12 }}>Paleta de Colores</div>
              <div style={{ display: 'flex', gap: 12 }}>
                {[
                  { name: 'Verde Chily', colors: ['#16a34a', '#22c55e', '#f97316'] },
                  { name: 'Azul Marino', colors: ['#1d4ed8', '#3b82f6', '#22c55e'] },
                  { name: 'Púrpura', colors: ['#7c3aed', '#a855f7', '#f97316'] },
                ].map(theme => (
                  <div key={theme.name} style={{ flex: 1, padding: 14, border: theme.name === 'Verde Chily' ? '2px solid #16a34a' : '2px solid #e5e7eb', borderRadius: 10, cursor: 'pointer' }}>
                    <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
                      {theme.colors.map(c => <div key={c} style={{ width: 20, height: 20, borderRadius: '50%', background: c }} />)}
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>{theme.name}</div>
                    {theme.name === 'Verde Chily' && <span className="badge badge-green" style={{ fontSize: 10, marginTop: 4 }}>Activo</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'notificaciones' && (
        <div className="card">
          <div className="card-header">
            <div className="card-title"><Bell size={18} color="#16a34a" /> Notificaciones</div>
          </div>
          <div className="card-body">
            <ToggleRow
              label="Notificaciones del Sistema"
              desc="Habilitar alertas y notificaciones generales"
              value={config.notifications}
              onChange={v => setConfig(c => ({ ...c, notifications: v }))}
            />
            <ToggleRow
              label="Alerta de Stock Bajo"
              desc="Notificar cuando un producto tenga poco stock"
              value={config.lowStockAlert}
              onChange={v => setConfig(c => ({ ...c, lowStockAlert: v }))}
            />
            <ToggleRow
              label="Alerta de Ingredientes"
              desc="Notificar cuando los ingredientes estén por agotarse"
              value={true}
              onChange={() => {}}
            />
            <ToggleRow
              label="Resumen Diario"
              desc="Recibir resumen de ventas al final del día"
              value={true}
              onChange={() => {}}
            />
          </div>
        </div>
      )}

      {activeTab === 'impresion' && (
        <div className="card">
          <div className="card-header">
            <div className="card-title"><Printer size={18} color="#16a34a" /> Configuración de Impresión</div>
          </div>
          <div className="card-body">
            <ToggleRow
              label="Imprimir Recibo Automáticamente"
              desc="Imprimir factura al completar cada venta"
              value={config.printReceipt}
              onChange={v => setConfig(c => ({ ...c, printReceipt: v }))}
            />
            <ToggleRow
              label="Mostrar Logo en Factura"
              desc="Incluir el logo del negocio en las facturas"
              value={true}
              onChange={() => {}}
            />
            <ToggleRow
              label="Mostrar Mensaje de Agradecimiento"
              desc="Incluir mensaje de agradecimiento al final"
              value={true}
              onChange={() => {}}
            />
            <div className="form-group" style={{ marginTop: 16 }}>
              <label className="form-label">Tamaño de Papel</label>
              <select className="form-select">
                <option>58mm (Térmico pequeño)</option>
                <option>80mm (Térmico estándar)</option>
                <option>A4</option>
                <option>Letter</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Mensaje de Pie de Factura</label>
              <textarea className="form-textarea" defaultValue="¡Gracias por su compra! Vuelva pronto. 😊" />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'seguridad' && (
        <div className="card">
          <div className="card-header">
            <div className="card-title"><Shield size={18} color="#16a34a" /> Seguridad</div>
          </div>
          <div className="card-body">
            <ToggleRow
              label="Registro de Actividades"
              desc="Guardar log de todas las acciones realizadas"
              value={true}
              onChange={() => {}}
            />
            <ToggleRow
              label="Bloqueo por Inactividad"
              desc="Cerrar sesión automáticamente después de 30 minutos"
              value={false}
              onChange={() => {}}
            />
            <ToggleRow
              label="Autenticación de Doble Factor"
              desc="Requerir código adicional al iniciar sesión"
              value={false}
              onChange={() => {}}
            />
            <div className="form-group" style={{ marginTop: 16 }}>
              <label className="form-label">Tiempo de Sesión (minutos)</label>
              <input type="number" className="form-input" defaultValue={60} min={15} max={480} style={{ maxWidth: 200 }} />
            </div>
            <div style={{ marginTop: 20, padding: 16, background: '#f0fdf4', borderRadius: 10, border: '1px solid #bbf7d0' }}>
              <div style={{ fontWeight: 600, fontSize: 14, color: '#16a34a', marginBottom: 8 }}>🔐 Cambiar Contraseña</div>
              <div className="form-row" style={{ maxWidth: 400 }}>
                <div className="form-group">
                  <label className="form-label">Contraseña Actual</label>
                  <input type="password" className="form-input" placeholder="••••••••" />
                </div>
                <div className="form-group">
                  <label className="form-label">Nueva Contraseña</label>
                  <input type="password" className="form-input" placeholder="••••••••" />
                </div>
              </div>
              <button className="btn btn-primary btn-sm">Actualizar Contraseña</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20, gap: 10 }}>
        <button className="btn btn-outline" onClick={() => setConfig({ ...store.config })}>Cancelar Cambios</button>
        <button className="btn btn-primary" onClick={handleSave}><Settings size={15} /> Guardar Configuración</button>
      </div>
    </div>
  );
}

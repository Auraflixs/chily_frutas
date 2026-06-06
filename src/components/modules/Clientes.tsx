import { useState } from 'react';
import { Search, Plus, Edit2, Trash2, X, Users, Phone, Mail, Star } from 'lucide-react';
import { store, Client } from '../../data/store';

interface ClientesProps {
  showToast: (msg: string, type?: string) => void;
}

const emptyClient = (): Partial<Client> => ({
  name: '', phone: '', email: '',
  totalPurchases: 0, totalSpent: 0,
  lastPurchase: '', registeredDate: new Date().toISOString().split('T')[0],
});

export default function Clientes({ showToast }: ClientesProps) {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editClient, setEditClient] = useState<Partial<Client>>(emptyClient());
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState<Client | null>(null);
  const [showHistory, setShowHistory] = useState<Client | null>(null);

  const filtered = store.clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  const topClients = [...store.clients].sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 3);

  const openAdd = () => {
    setEditClient(emptyClient());
    setIsEditing(false);
    setShowModal(true);
  };

  const openEdit = (client: Client) => {
    setEditClient({ ...client });
    setIsEditing(true);
    setShowModal(true);
  };

  const handleSave = () => {
    if (!editClient.name?.trim()) {
      showToast('El nombre es requerido', 'error');
      return;
    }
    if (isEditing) {
      const idx = store.clients.findIndex(c => c.id === editClient.id);
      if (idx !== -1) store.clients[idx] = { ...store.clients[idx], ...editClient } as Client;
      showToast('Cliente actualizado exitosamente', 'success');
    } else {
      const newClient: Client = {
        id: Math.max(...store.clients.map(c => c.id)) + 1,
        name: editClient.name!,
        phone: editClient.phone || '',
        email: editClient.email || '',
        totalPurchases: 0,
        totalSpent: 0,
        lastPurchase: '',
        registeredDate: editClient.registeredDate || new Date().toISOString().split('T')[0],
      };
      store.clients.push(newClient);
      showToast('Cliente registrado exitosamente', 'success');
    }
    setShowModal(false);
  };

  const handleDelete = (client: Client) => {
    store.clients = store.clients.filter(c => c.id !== client.id);
    showToast(`Cliente "${client.name}" eliminado`, 'warning');
    setShowDeleteModal(null);
  };

  const getClientSales = (clientId: number) =>
    store.sales.filter(s => s.clientId === clientId);

  const getFrequencyBadge = (purchases: number) => {
    if (purchases >= 30) return <span className="badge badge-orange">⭐ VIP</span>;
    if (purchases >= 15) return <span className="badge badge-green">Frecuente</span>;
    return <span className="badge badge-gray">Regular</span>;
  };

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <div className="page-header-left">
          <h2>Gestión de Clientes</h2>
          <p>Registro y seguimiento de clientes</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          <Plus size={16} />
          Nuevo Cliente
        </button>
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)', marginBottom: 20 }}>
        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-card-icon" style={{ background: '#dcfce7' }}><Users size={22} color="#16a34a" /></div>
          </div>
          <div className="stat-card-value">{store.clients.length}</div>
          <div className="stat-card-label">Total Clientes</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-card-icon" style={{ background: '#fff7ed' }}><Star size={22} color="#f97316" /></div>
          </div>
          <div className="stat-card-value">{store.clients.filter(c => c.totalPurchases >= 30).length}</div>
          <div className="stat-card-label">Clientes VIP</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-card-icon" style={{ background: '#eff6ff' }}><Users size={22} color="#2563eb" /></div>
          </div>
          <div className="stat-card-value">{store.clients.filter(c => c.totalPurchases >= 15).length}</div>
          <div className="stat-card-label">Clientes Frecuentes</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-card-icon" style={{ background: '#f5f3ff' }}><Star size={22} color="#7c3aed" /></div>
          </div>
          <div className="stat-card-value">C${store.clients.reduce((s, c) => s + c.totalSpent, 0).toLocaleString()}</div>
          <div className="stat-card-label">Total Facturado</div>
        </div>
      </div>

      {/* Top Clients */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header">
          <div className="card-title"><Star size={18} color="#f97316" /> Top 3 Clientes</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, padding: 20 }}>
          {topClients.map((c, i) => (
            <div key={c.id} style={{
              background: i === 0 ? 'linear-gradient(135deg,#fefce8,#fde68a)' : i === 1 ? 'linear-gradient(135deg,#f3f4f6,#e5e7eb)' : 'linear-gradient(135deg,#fff7ed,#fed7aa)',
              borderRadius: 12, padding: 16, textAlign: 'center'
            }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>
                {i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}
              </div>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: '#16a34a', color: 'white', fontWeight: 800, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}>
                {c.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#1a2e1a', marginBottom: 2 }}>{c.name}</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: '#16a34a' }}>C${c.totalSpent.toLocaleString()}</div>
              <div style={{ fontSize: 11, color: '#6b7280' }}>{c.totalPurchases} compras</div>
            </div>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="card-header">
          <div className="search-bar">
            <Search className="search-bar-icon" />
            <input type="text" placeholder="Buscar cliente..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <span className="badge badge-gray">{filtered.length} clientes</span>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Teléfono</th>
                <th>Correo</th>
                <th>Compras</th>
                <th>Total Gastado</th>
                <th>Última Compra</th>
                <th>Tipo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(client => (
                <tr key={client.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 34, height: 34, borderRadius: 8, background: 'linear-gradient(135deg,#16a34a,#22c55e)', color: 'white', fontWeight: 800, fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {client.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{client.name}</div>
                        <div style={{ fontSize: 10, color: '#9ca3af' }}>Desde {client.registeredDate}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13 }}>
                      <Phone size={12} color="#9ca3af" />
                      {client.phone || '—'}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#6b7280' }}>
                      <Mail size={12} color="#9ca3af" />
                      {client.email || '—'}
                    </div>
                  </td>
                  <td><span style={{ fontWeight: 700, fontSize: 14 }}>{client.totalPurchases}</span></td>
                  <td><span style={{ fontWeight: 700, color: '#16a34a' }}>C${client.totalSpent.toLocaleString()}</span></td>
                  <td style={{ fontSize: 12, color: '#6b7280' }}>{client.lastPurchase || 'Sin compras'}</td>
                  <td>{getFrequencyBadge(client.totalPurchases)}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 5 }}>
                      <button className="btn btn-outline btn-sm" style={{ fontSize: 11 }} onClick={() => setShowHistory(client)}>
                        Historial
                      </button>
                      <button className="btn btn-outline btn-sm btn-icon" onClick={() => openEdit(client)}><Edit2 size={13} /></button>
                      <button className="btn btn-sm btn-icon" style={{ background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca' }} onClick={() => setShowDeleteModal(client)}><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8}>
                  <div className="empty-state">
                    <div className="empty-state-icon">👥</div>
                    <div className="empty-state-title">No se encontraron clientes</div>
                  </div>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add/Edit */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal modal-md animate-modalIn" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">{isEditing ? '✏️ Editar Cliente' : '➕ Nuevo Cliente'}</span>
              <button className="modal-close" onClick={() => setShowModal(false)}><X size={16} /></button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Nombre Completo *</label>
                <input className="form-input" value={editClient.name || ''} onChange={e => setEditClient(p => ({ ...p, name: e.target.value }))} placeholder="Nombre del cliente" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Teléfono</label>
                  <input className="form-input" value={editClient.phone || ''} onChange={e => setEditClient(p => ({ ...p, phone: e.target.value }))} placeholder="8888-0000" />
                </div>
                <div className="form-group">
                  <label className="form-label">Correo Electrónico</label>
                  <input type="email" className="form-input" value={editClient.email || ''} onChange={e => setEditClient(p => ({ ...p, email: e.target.value }))} placeholder="cliente@correo.com" />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={handleSave}>{isEditing ? 'Guardar Cambios' : 'Registrar Cliente'}</button>
            </div>
          </div>
        </div>
      )}

      {/* History Modal */}
      {showHistory && (
        <div className="modal-overlay" onClick={() => setShowHistory(null)}>
          <div className="modal modal-lg animate-modalIn" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">📋 Historial de Compras — {showHistory.name}</span>
              <button className="modal-close" onClick={() => setShowHistory(null)}><X size={16} /></button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 20 }}>
                <div style={{ background: '#f0fdf4', borderRadius: 10, padding: 14, textAlign: 'center' }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: '#16a34a' }}>{showHistory.totalPurchases}</div>
                  <div style={{ fontSize: 11, color: '#6b7280' }}>Total Compras</div>
                </div>
                <div style={{ background: '#fff7ed', borderRadius: 10, padding: 14, textAlign: 'center' }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: '#f97316' }}>C${showHistory.totalSpent}</div>
                  <div style={{ fontSize: 11, color: '#6b7280' }}>Total Gastado</div>
                </div>
                <div style={{ background: '#eff6ff', borderRadius: 10, padding: 14, textAlign: 'center' }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: '#2563eb' }}>{showHistory.lastPurchase || '—'}</div>
                  <div style={{ fontSize: 11, color: '#6b7280' }}>Última Compra</div>
                </div>
              </div>
              <table>
                <thead><tr>
                  <th>Factura</th><th>Fecha</th><th>Productos</th><th>Total</th><th>Pago</th>
                </tr></thead>
                <tbody>
                  {getClientSales(showHistory.id).length > 0 ? getClientSales(showHistory.id).map(s => (
                    <tr key={s.id}>
                      <td style={{ fontWeight: 600, color: '#16a34a' }}>{s.invoiceNumber}</td>
                      <td style={{ fontSize: 12 }}>{s.date} {s.time}</td>
                      <td style={{ fontSize: 12 }}>{s.items.map(i => i.productName).join(', ')}</td>
                      <td style={{ fontWeight: 700 }}>C${s.total}</td>
                      <td><span className={`badge ${s.paymentMethod === 'Efectivo' ? 'badge-green' : s.paymentMethod === 'Tarjeta' ? 'badge-blue' : 'badge-purple'}`}>{s.paymentMethod}</span></td>
                    </tr>
                  )) : (
                    <tr><td colSpan={5}><div className="empty-state" style={{ padding: 24 }}>
                      <div className="empty-state-title">Sin compras registradas</div>
                    </div></td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowHistory(null)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(null)}>
          <div className="modal modal-sm animate-modalIn" onClick={e => e.stopPropagation()}>
            <div className="modal-body" style={{ textAlign: 'center', padding: 32 }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>⚠️</div>
              <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>¿Eliminar Cliente?</h3>
              <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 20 }}>Se eliminará <strong>{showDeleteModal.name}</strong> permanentemente.</p>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                <button className="btn btn-outline" onClick={() => setShowDeleteModal(null)}>Cancelar</button>
                <button className="btn btn-danger" onClick={() => handleDelete(showDeleteModal)}><Trash2 size={15} /> Eliminar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

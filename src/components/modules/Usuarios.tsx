import { useState } from 'react';
import { Search, Plus, Edit2, Trash2, X, UserCog, ShieldCheck, User } from 'lucide-react';
import { store, User as UserType } from '../../data/store';

interface UsuariosProps {
  showToast: (msg: string, type?: string) => void;
}

const emptyUser = (): Partial<UserType> => ({
  username: '', password: '', name: '', role: 'Cajero',
  email: '', phone: '', status: 'Activo', avatar: '',
});

export default function Usuarios({ showToast }: UsuariosProps) {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState<Partial<UserType>>(emptyUser());
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState<UserType | null>(null);
  const [refresh, setRefresh] = useState(0);

  const filtered = store.users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => { setEditUser(emptyUser()); setIsEditing(false); setShowModal(true); };
  const openEdit = (user: UserType) => { setEditUser({ ...user }); setIsEditing(true); setShowModal(true); };

  const handleSave = () => {
    if (!editUser.name?.trim() || !editUser.username?.trim()) {
      showToast('Nombre y usuario son requeridos', 'error');
      return;
    }
    const avatar = editUser.name!.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
    if (isEditing) {
      const idx = store.users.findIndex(u => u.id === editUser.id);
      if (idx !== -1) store.users[idx] = { ...store.users[idx], ...editUser, avatar } as UserType;
      showToast('Usuario actualizado exitosamente', 'success');
    } else {
      if (store.users.find(u => u.username === editUser.username)) {
        showToast('El nombre de usuario ya existe', 'error');
        return;
      }
      const newUser: UserType = {
        id: Math.max(...store.users.map(u => u.id)) + 1,
        username: editUser.username!,
        password: editUser.password || '123456',
        name: editUser.name!,
        role: editUser.role || 'Cajero',
        email: editUser.email || '',
        phone: editUser.phone || '',
        status: editUser.status || 'Activo',
        lastLogin: '—',
        avatar,
      };
      store.users.push(newUser);
      showToast('Usuario creado exitosamente', 'success');
    }
    setShowModal(false);
    setRefresh(r => r + 1);
  };

  const handleDelete = (user: UserType) => {
    if (user.id === store.currentUser?.id) {
      showToast('No puedes eliminar tu propio usuario', 'error');
      setShowDeleteModal(null);
      return;
    }
    store.users = store.users.filter(u => u.id !== user.id);
    showToast(`Usuario "${user.name}" eliminado`, 'warning');
    setShowDeleteModal(null);
    setRefresh(r => r + 1);
  };

  const toggleStatus = (user: UserType) => {
    const idx = store.users.findIndex(u => u.id === user.id);
    if (idx !== -1) {
      store.users[idx].status = store.users[idx].status === 'Activo' ? 'Inactivo' : 'Activo';
      showToast(`Usuario ${store.users[idx].status === 'Activo' ? 'activado' : 'desactivado'}`, 'info');
      setRefresh(r => r + 1);
    }
  };

  const roleColors: Record<string, string> = {
    'Administrador': 'badge-orange',
    'Cajero': 'badge-blue',
  };

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <div className="page-header-left">
          <h2>Gestión de Usuarios</h2>
          <p>Administra los accesos al sistema</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          <Plus size={16} />
          Nuevo Usuario
        </button>
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)', marginBottom: 20 }}>
        {[
          { label: 'Total Usuarios', value: store.users.length, color: '#16a34a', bg: '#dcfce7', icon: <UserCog size={22} color="#16a34a" /> },
          { label: 'Activos', value: store.users.filter(u => u.status === 'Activo').length, color: '#16a34a', bg: '#dcfce7', icon: <ShieldCheck size={22} color="#16a34a" /> },
          { label: 'Inactivos', value: store.users.filter(u => u.status === 'Inactivo').length, color: '#ef4444', bg: '#fef2f2', icon: <User size={22} color="#ef4444" /> },
          { label: 'Administradores', value: store.users.filter(u => u.role === 'Administrador').length, color: '#f97316', bg: '#fff7ed', icon: <ShieldCheck size={22} color="#f97316" /> },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-card-header">
              <div className="stat-card-icon" style={{ background: s.bg }}>{s.icon}</div>
            </div>
            <div className="stat-card-value" style={{ color: s.color }}>{s.value}</div>
            <div className="stat-card-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Role Permissions */}
      <div className="grid-2" style={{ marginBottom: 20 }}>
        {[
          {
            role: 'Administrador', icon: '👑', color: '#f97316', bg: '#fff7ed',
            perms: ['Acceso completo al sistema', 'Gestión de usuarios', 'Ver reportes', 'Configuración', 'Ventas e inventario', 'Seguridad']
          },
          {
            role: 'Cajero', icon: '👤', color: '#3b82f6', bg: '#eff6ff',
            perms: ['Registrar ventas', 'Ver menú de productos', 'Consultar inventario', 'Ver clientes', 'Generar facturas']
          },
        ].map(r => (
          <div key={r.role} className="card">
            <div className="card-header">
              <div className="card-title">
                <span style={{ fontSize: 18 }}>{r.icon}</span>
                Rol: {r.role}
              </div>
              <span className={`badge ${r.role === 'Administrador' ? 'badge-orange' : 'badge-blue'}`}>{r.role}</span>
            </div>
            <div className="card-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {r.perms.map(p => (
                  <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#374151' }}>
                    <div style={{ width: 18, height: 18, borderRadius: '50%', background: r.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: r.color, fontWeight: 800 }}>✓</div>
                    {p}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="card">
        <div className="card-header">
          <div className="search-bar">
            <Search className="search-bar-icon" />
            <input type="text" placeholder="Buscar usuario..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <span className="badge badge-gray">{filtered.length} usuarios</span>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Usuario</th><th>Username</th><th>Rol</th><th>Correo</th><th>Teléfono</th>
                <th>Último Acceso</th><th>Estado</th><th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 8, background: u.role === 'Administrador' ? 'linear-gradient(135deg,#f97316,#ea580c)' : 'linear-gradient(135deg,#3b82f6,#2563eb)', color: 'white', fontWeight: 800, fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {u.avatar}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{u.name}</div>
                        {u.id === store.currentUser?.id && <span style={{ fontSize: 10, color: '#16a34a', fontWeight: 600 }}>← Sesión actual</span>}
                      </div>
                    </div>
                  </td>
                  <td><span style={{ fontFamily: 'monospace', fontSize: 12, background: '#f3f4f6', padding: '2px 8px', borderRadius: 4 }}>{u.username}</span></td>
                  <td><span className={`badge ${roleColors[u.role]}`}>{u.role}</span></td>
                  <td style={{ fontSize: 12, color: '#6b7280' }}>{u.email}</td>
                  <td style={{ fontSize: 12, color: '#6b7280' }}>{u.phone}</td>
                  <td style={{ fontSize: 11, color: '#9ca3af' }}>{u.lastLogin}</td>
                  <td>
                    <label className="toggle-switch" title={u.status}>
                      <input type="checkbox" checked={u.status === 'Activo'} onChange={() => toggleStatus(u)} />
                      <span className="toggle-slider"></span>
                    </label>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 5 }}>
                      <button className="btn btn-outline btn-sm btn-icon" onClick={() => openEdit(u)}><Edit2 size={13} /></button>
                      <button
                        className="btn btn-sm btn-icon"
                        style={{ background: u.id === store.currentUser?.id ? '#f3f4f6' : '#fef2f2', color: u.id === store.currentUser?.id ? '#9ca3af' : '#ef4444', border: '1px solid #fecaca' }}
                        onClick={() => u.id !== store.currentUser?.id && setShowDeleteModal(u)}
                        disabled={u.id === store.currentUser?.id}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal modal-md animate-modalIn" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">{isEditing ? '✏️ Editar Usuario' : '➕ Nuevo Usuario'}</span>
              <button className="modal-close" onClick={() => setShowModal(false)}><X size={16} /></button>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Nombre Completo *</label>
                  <input className="form-input" value={editUser.name || ''} onChange={e => setEditUser(p => ({ ...p, name: e.target.value }))} placeholder="Carlos Mendoza" />
                </div>
                <div className="form-group">
                  <label className="form-label">Usuario *</label>
                  <input className="form-input" value={editUser.username || ''} onChange={e => setEditUser(p => ({ ...p, username: e.target.value }))} placeholder="carlos.mendoza" disabled={isEditing} />
                </div>
              </div>
              {!isEditing && (
                <div className="form-group">
                  <label className="form-label">Contraseña</label>
                  <input type="password" className="form-input" value={editUser.password || ''} onChange={e => setEditUser(p => ({ ...p, password: e.target.value }))} placeholder="Contraseña segura" />
                </div>
              )}
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Rol</label>
                  <select className="form-select" value={editUser.role || 'Cajero'} onChange={e => setEditUser(p => ({ ...p, role: e.target.value as any }))}>
                    <option>Administrador</option>
                    <option>Cajero</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Estado</label>
                  <select className="form-select" value={editUser.status || 'Activo'} onChange={e => setEditUser(p => ({ ...p, status: e.target.value as any }))}>
                    <option>Activo</option>
                    <option>Inactivo</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Correo Electrónico</label>
                  <input type="email" className="form-input" value={editUser.email || ''} onChange={e => setEditUser(p => ({ ...p, email: e.target.value }))} placeholder="usuario@chilyfrutas.com" />
                </div>
                <div className="form-group">
                  <label className="form-label">Teléfono</label>
                  <input className="form-input" value={editUser.phone || ''} onChange={e => setEditUser(p => ({ ...p, phone: e.target.value }))} placeholder="8888-0000" />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={handleSave}>{isEditing ? 'Guardar Cambios' : 'Crear Usuario'}</button>
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
              <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>¿Eliminar Usuario?</h3>
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

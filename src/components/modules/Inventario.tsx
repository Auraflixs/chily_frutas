import { useState } from 'react';
import { Search, Plus, Edit2, Trash2, X, Package, AlertTriangle } from 'lucide-react';
import { store, Product } from '../../data/store';

interface InventarioProps {
  showToast: (msg: string, type?: string) => void;
}

const emptyProduct = (): Partial<Product> => ({
  code: '',
  name: '',
  category: 'Batidos',
  price: 0,
  cost: 0,
  stock: 0,
  minStock: 5,
  description: '',
  ingredients: [],
  image: '🍓',
  status: 'Disponible',
  dateAdded: new Date().toISOString().split('T')[0],
  unitsSold: 0,
});

const categoryList = ['Batidos', 'Frescos', 'Frutas Preparadas', 'Ensaladas', 'Bowls'];
const emojiList = ['🍓', '🥭', '🍉', '🍊', '🍍', '🥗', '🫙', '🥛', '🍈', '🍱', '🧡', '🌶️'];

export default function Inventario({ showToast }: InventarioProps) {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('Todos');
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState<Partial<Product>>(emptyProduct());
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState<Product | null>(null);

  const statuses = ['Todos', 'Disponible', 'Stock Bajo', 'Agotado'];

  const filtered = store.products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.code.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'Todos' || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const openAdd = () => {
    setEditProduct(emptyProduct());
    setIsEditing(false);
    setShowModal(true);
  };

  const openEdit = (product: Product) => {
    setEditProduct({ ...product });
    setIsEditing(true);
    setShowModal(true);
  };

  const handleSave = () => {
    const p = editProduct;
    if (!p.name?.trim() || !p.code?.trim()) {
      showToast('Nombre y código son requeridos', 'error');
      return;
    }
    const stock = p.stock || 0;
    const minStock = p.minStock || 5;
    const status: Product['status'] = stock === 0 ? 'Agotado' : stock <= minStock ? 'Stock Bajo' : 'Disponible';

    if (isEditing) {
      const idx = store.products.findIndex(prod => prod.id === p.id);
      if (idx !== -1) {
        store.products[idx] = { ...store.products[idx], ...p, status };
      }
      showToast('Producto actualizado exitosamente', 'success');
    } else {
      const newProduct: Product = {
        id: Math.max(...store.products.map(pr => pr.id)) + 1,
        code: p.code!,
        name: p.name!,
        category: p.category || 'Batidos',
        price: p.price || 0,
        cost: p.cost || 0,
        stock: stock,
        minStock: minStock,
        description: p.description || '',
        ingredients: p.ingredients || [],
        image: p.image || '🍓',
        status,
        dateAdded: p.dateAdded || new Date().toISOString().split('T')[0],
        unitsSold: 0,
      };
      store.products.push(newProduct);
      showToast('Producto registrado exitosamente', 'success');
    }
    setShowModal(false);
  };

  const handleDelete = (product: Product) => {
    store.products = store.products.filter(p => p.id !== product.id);
    showToast(`Producto "${product.name}" eliminado`, 'warning');
    setShowDeleteModal(null);
  };

  const getStatusBadge = (status: string) => {
    const map: Record<string, string> = {
      'Disponible': 'badge-green',
      'Stock Bajo': 'badge-yellow',
      'Agotado': 'badge-red',
    };
    return <span className={`badge ${map[status] || 'badge-gray'}`}>{status}</span>;
  };

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <div className="page-header-left">
          <h2>Inventario de Productos</h2>
          <p>Control de stock y gestión de productos</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          <Plus size={16} />
          Nuevo Producto
        </button>
      </div>

      {/* Alerts */}
      {store.getOutOfStockProducts().length > 0 && (
        <div className="alert alert-danger" style={{ marginBottom: 12 }}>
          <AlertTriangle size={16} style={{ flexShrink: 0 }} />
          <span><strong>{store.getOutOfStockProducts().length} producto(s) agotado(s)</strong> — Se requiere reposición urgente</span>
        </div>
      )}
      {store.getLowStockProducts().length > 0 && (
        <div className="alert alert-warning" style={{ marginBottom: 16 }}>
          <AlertTriangle size={16} style={{ flexShrink: 0 }} />
          <span><strong>{store.getLowStockProducts().length} producto(s) con stock bajo</strong> — Considere reabastecer pronto</span>
        </div>
      )}

      {/* Stats */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)', marginBottom: 20 }}>
        {[
          { label: 'Total Productos', value: store.products.length, color: '#16a34a', bg: '#dcfce7' },
          { label: 'Disponibles', value: store.products.filter(p => p.status === 'Disponible').length, color: '#16a34a', bg: '#dcfce7' },
          { label: 'Stock Bajo', value: store.getLowStockProducts().length, color: '#ca8a04', bg: '#fefce8' },
          { label: 'Agotados', value: store.getOutOfStockProducts().length, color: '#ef4444', bg: '#fef2f2' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-card-header">
              <div className="stat-card-icon" style={{ background: s.bg }}>
                <Package size={22} color={s.color} />
              </div>
            </div>
            <div className="stat-card-value" style={{ color: s.color }}>{s.value}</div>
            <div className="stat-card-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: 0 }}>
        <div className="card-header">
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', flex: 1 }}>
            <div className="search-bar">
              <Search className="search-bar-icon" />
              <input
                type="text"
                placeholder="Buscar por nombre o código..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="category-filters">
              {statuses.map(s => (
                <button
                  key={s}
                  className={`category-filter ${filterStatus === s ? 'active' : ''}`}
                  onClick={() => setFilterStatus(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <span className="badge badge-gray">{filtered.length} registros</span>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Producto</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Costo</th>
                <th>Stock</th>
                <th>Stock Mín.</th>
                <th>Estado</th>
                <th>Fecha Ingreso</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id}>
                  <td><span style={{ fontFamily: 'monospace', fontSize: 12, background: '#f3f4f6', padding: '2px 6px', borderRadius: 4 }}>{p.code}</span></td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 20 }}>{p.image}</span>
                      <span style={{ fontWeight: 600, fontSize: 13 }}>{p.name}</span>
                    </div>
                  </td>
                  <td><span className="badge badge-blue">{p.category}</span></td>
                  <td style={{ fontWeight: 700, color: '#16a34a' }}>C${p.price}</td>
                  <td style={{ color: '#6b7280' }}>C${p.cost}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: p.stock === 0 ? '#ef4444' : p.stock <= p.minStock ? '#f97316' : '#16a34a' }} />
                      <span style={{ fontWeight: 600 }}>{p.stock}</span>
                    </div>
                  </td>
                  <td style={{ color: '#9ca3af' }}>{p.minStock}</td>
                  <td>{getStatusBadge(p.status)}</td>
                  <td style={{ fontSize: 12, color: '#9ca3af' }}>{p.dateAdded}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 5 }}>
                      <button className="btn btn-outline btn-sm btn-icon" onClick={() => openEdit(p)} title="Editar">
                        <Edit2 size={13} />
                      </button>
                      <button className="btn btn-sm btn-icon" style={{ background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca' }} onClick={() => setShowDeleteModal(p)} title="Eliminar">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={10}>
                    <div className="empty-state">
                      <div className="empty-state-icon">📦</div>
                      <div className="empty-state-title">No se encontraron productos</div>
                      <div className="empty-state-desc">Ajusta los filtros de búsqueda</div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal modal-lg animate-modalIn" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">
                {isEditing ? '✏️ Editar Producto' : '➕ Nuevo Producto'}
              </span>
              <button className="modal-close" onClick={() => setShowModal(false)}><X size={16} /></button>
            </div>
            <div className="modal-body">
              {/* Emoji picker */}
              <div className="form-group">
                <label className="form-label">Ícono del Producto</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {emojiList.map(e => (
                    <button
                      key={e}
                      type="button"
                      onClick={() => setEditProduct(p => ({ ...p, image: e }))}
                      style={{
                        width: 40, height: 40, fontSize: 22, border: editProduct.image === e ? '2px solid #16a34a' : '2px solid #e5e7eb',
                        borderRadius: 8, cursor: 'pointer', background: editProduct.image === e ? '#f0fdf4' : 'white',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Código *</label>
                  <input className="form-input" value={editProduct.code || ''} onChange={e => setEditProduct(p => ({ ...p, code: e.target.value }))} placeholder="CF-013" />
                </div>
                <div className="form-group">
                  <label className="form-label">Nombre *</label>
                  <input className="form-input" value={editProduct.name || ''} onChange={e => setEditProduct(p => ({ ...p, name: e.target.value }))} placeholder="Nombre del producto" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Categoría</label>
                  <select className="form-select" value={editProduct.category || ''} onChange={e => setEditProduct(p => ({ ...p, category: e.target.value }))}>
                    {categoryList.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Fecha de Ingreso</label>
                  <input type="date" className="form-input" value={editProduct.dateAdded || ''} onChange={e => setEditProduct(p => ({ ...p, dateAdded: e.target.value }))} />
                </div>
              </div>
              <div className="form-row-3">
                <div className="form-group">
                  <label className="form-label">Precio de Venta (C$)</label>
                  <input type="number" className="form-input" value={editProduct.price || 0} onChange={e => setEditProduct(p => ({ ...p, price: Number(e.target.value) }))} min={0} />
                </div>
                <div className="form-group">
                  <label className="form-label">Costo (C$)</label>
                  <input type="number" className="form-input" value={editProduct.cost || 0} onChange={e => setEditProduct(p => ({ ...p, cost: Number(e.target.value) }))} min={0} />
                </div>
                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <label className="form-label">Ganancia</label>
                  <div style={{ padding: '9px 12px', background: '#f0fdf4', borderRadius: 8, fontSize: 14, fontWeight: 700, color: '#16a34a', flex: 1, display: 'flex', alignItems: 'center' }}>
                    C${((editProduct.price || 0) - (editProduct.cost || 0)).toFixed(0)}
                  </div>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Stock Actual</label>
                  <input type="number" className="form-input" value={editProduct.stock || 0} onChange={e => setEditProduct(p => ({ ...p, stock: Number(e.target.value) }))} min={0} />
                </div>
                <div className="form-group">
                  <label className="form-label">Stock Mínimo</label>
                  <input type="number" className="form-input" value={editProduct.minStock || 5} onChange={e => setEditProduct(p => ({ ...p, minStock: Number(e.target.value) }))} min={1} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Descripción</label>
                <textarea className="form-textarea" value={editProduct.description || ''} onChange={e => setEditProduct(p => ({ ...p, description: e.target.value }))} placeholder="Descripción del producto..." />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={handleSave}>
                {isEditing ? 'Guardar Cambios' : 'Registrar Producto'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(null)}>
          <div className="modal modal-sm animate-modalIn" onClick={e => e.stopPropagation()}>
            <div className="modal-body" style={{ textAlign: 'center', padding: 32 }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>⚠️</div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#1a2e1a', marginBottom: 8 }}>¿Eliminar Producto?</h3>
              <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 20, lineHeight: 1.6 }}>
                Se eliminará <strong>{showDeleteModal.name}</strong> permanentemente. Esta acción no se puede deshacer.
              </p>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                <button className="btn btn-outline" onClick={() => setShowDeleteModal(null)}>Cancelar</button>
                <button className="btn btn-danger" onClick={() => handleDelete(showDeleteModal)}>
                  <Trash2 size={15} />
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState } from 'react';
import { Search, Plus, Edit2, Trash2, X, AlertTriangle } from 'lucide-react';
import { store, Ingredient } from '../../data/store';

interface IngredientesProps {
  showToast: (msg: string, type?: string) => void;
}

const emptyIng = (): Partial<Ingredient> => ({
  name: '',
  unit: 'lb',
  stock: 0,
  minStock: 2,
  cost: 0,
  category: 'Frutas',
});

const units = ['lb', 'kg', 'unidad', 'litro', 'bolsa', 'lata', 'oz', 'racimo'];
const ingCategories = ['Frutas', 'Lácteos', 'Endulzantes', 'Condimentos', 'Otros'];

export default function Ingredientes({ showToast }: IngredientesProps) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Todos');
  const [showModal, setShowModal] = useState(false);
  const [editIng, setEditIng] = useState<Partial<Ingredient>>(emptyIng());
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState<Ingredient | null>(null);

  const categories = ['Todos', ...ingCategories];
  const filtered = store.ingredients.filter(i => {
    const matchSearch = i.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'Todos' || i.category === category;
    return matchSearch && matchCat;
  });

  const lowStockIngs = store.ingredients.filter(i => i.stock > 0 && i.stock <= i.minStock);
  const outIngs = store.ingredients.filter(i => i.stock === 0);

  const openAdd = () => {
    setEditIng(emptyIng());
    setIsEditing(false);
    setShowModal(true);
  };

  const openEdit = (ing: Ingredient) => {
    setEditIng({ ...ing });
    setIsEditing(true);
    setShowModal(true);
  };

  const handleSave = () => {
    if (!editIng.name?.trim()) {
      showToast('El nombre es requerido', 'error');
      return;
    }
    if (isEditing) {
      const idx = store.ingredients.findIndex(i => i.id === editIng.id);
      if (idx !== -1) store.ingredients[idx] = { ...store.ingredients[idx], ...editIng } as Ingredient;
      showToast('Ingrediente actualizado', 'success');
    } else {
      const newIng: Ingredient = {
        id: Math.max(...store.ingredients.map(i => i.id)) + 1,
        name: editIng.name!,
        unit: editIng.unit || 'lb',
        stock: editIng.stock || 0,
        minStock: editIng.minStock || 2,
        cost: editIng.cost || 0,
        category: editIng.category || 'Frutas',
      };
      store.ingredients.push(newIng);
      showToast('Ingrediente registrado', 'success');
    }
    setShowModal(false);
  };

  const handleDelete = (ing: Ingredient) => {
    store.ingredients = store.ingredients.filter(i => i.id !== ing.id);
    showToast(`Ingrediente "${ing.name}" eliminado`, 'warning');
    setShowDeleteModal(null);
  };

  const getStockStatus = (ing: Ingredient) => {
    if (ing.stock === 0) return <span className="badge badge-red">Agotado</span>;
    if (ing.stock <= ing.minStock) return <span className="badge badge-yellow">Stock Bajo</span>;
    return <span className="badge badge-green">Normal</span>;
  };

  const getCategoryColor: Record<string, string> = {
    'Frutas': '#f0fdf4',
    'Lácteos': '#eff6ff',
    'Endulzantes': '#fefce8',
    'Condimentos': '#fff7ed',
    'Otros': '#f5f3ff',
  };

  // Find which products use this ingredient
  const getProductsUsingIngredient = (ingId: number) =>
    store.products.filter(p => p.ingredients.some(i => i.ingredientId === ingId));

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <div className="page-header-left">
          <h2>Inventario de Ingredientes</h2>
          <p>Control de ingredientes y materias primas</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          <Plus size={16} />
          Nuevo Ingrediente
        </button>
      </div>

      {/* Alerts */}
      {outIngs.length > 0 && (
        <div className="alert alert-danger" style={{ marginBottom: 8 }}>
          <AlertTriangle size={16} style={{ flexShrink: 0 }} />
          <span><strong>{outIngs.length} ingrediente(s) agotado(s):</strong> {outIngs.map(i => i.name).join(', ')}</span>
        </div>
      )}
      {lowStockIngs.length > 0 && (
        <div className="alert alert-warning" style={{ marginBottom: 16 }}>
          <AlertTriangle size={16} style={{ flexShrink: 0 }} />
          <span><strong>{lowStockIngs.length} ingrediente(s) con stock bajo:</strong> {lowStockIngs.map(i => i.name).join(', ')}</span>
        </div>
      )}

      {/* Category Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 20 }}>
        {ingCategories.map(cat => {
          const items = store.ingredients.filter(i => i.category === cat);
          const lowItems = items.filter(i => i.stock <= i.minStock);
          return (
            <div
              key={cat}
              className="stat-card"
              style={{ cursor: 'pointer', borderLeft: category === cat ? '3px solid #16a34a' : '' }}
              onClick={() => setCategory(category === cat ? 'Todos' : cat)}
            >
              <div style={{ fontSize: 22, marginBottom: 8 }}>
                {cat === 'Frutas' ? '🍎' : cat === 'Lácteos' ? '🥛' : cat === 'Endulzantes' ? '🍯' : cat === 'Condimentos' ? '🧂' : '📦'}
              </div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#1a2e1a' }}>{items.length}</div>
              <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 4 }}>{cat}</div>
              {lowItems.length > 0 && (
                <span className="badge badge-yellow" style={{ fontSize: 10 }}>{lowItems.length} bajo stock</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Table */}
      <div className="card">
        <div className="card-header">
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flex: 1, flexWrap: 'wrap' }}>
            <div className="search-bar">
              <Search className="search-bar-icon" />
              <input type="text" placeholder="Buscar ingrediente..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="category-filters">
              {categories.map(c => (
                <button key={c} className={`category-filter ${category === c ? 'active' : ''}`} onClick={() => setCategory(c)}>{c}</button>
              ))}
            </div>
          </div>
          <span className="badge badge-gray">{filtered.length} registros</span>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Ingrediente</th>
                <th>Categoría</th>
                <th>Stock Actual</th>
                <th>Stock Mín.</th>
                <th>Unidad</th>
                <th>Costo Unit.</th>
                <th>Productos que lo Usan</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(ing => {
                const prods = getProductsUsingIngredient(ing.id);
                return (
                  <tr key={ing.id}>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{ing.name}</div>
                    </td>
                    <td>
                      <span style={{ background: getCategoryColor[ing.category] || '#f3f4f6', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>
                        {ing.category}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontWeight: 700, fontSize: 14, color: ing.stock === 0 ? '#ef4444' : ing.stock <= ing.minStock ? '#f97316' : '#1a2e1a' }}>
                          {ing.stock}
                        </span>
                        <div className="progress-bar" style={{ width: 60, height: 4 }}>
                          <div className="progress-fill" style={{
                            width: `${Math.min(100, (ing.stock / Math.max(ing.minStock * 3, 1)) * 100)}%`,
                            background: ing.stock === 0 ? '#ef4444' : ing.stock <= ing.minStock ? '#f97316' : '#16a34a'
                          }} />
                        </div>
                      </div>
                    </td>
                    <td style={{ color: '#9ca3af' }}>{ing.minStock}</td>
                    <td style={{ fontSize: 12, color: '#6b7280' }}>{ing.unit}</td>
                    <td style={{ fontWeight: 600, color: '#16a34a' }}>C${ing.cost}</td>
                    <td>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                        {prods.slice(0, 2).map(p => (
                          <span key={p.id} style={{ fontSize: 10, background: '#f0fdf4', color: '#16a34a', padding: '1px 6px', borderRadius: 10 }}>
                            {p.name}
                          </span>
                        ))}
                        {prods.length > 2 && <span style={{ fontSize: 10, color: '#9ca3af' }}>+{prods.length - 2}</span>}
                        {prods.length === 0 && <span style={{ fontSize: 10, color: '#d1d5db' }}>Sin asignar</span>}
                      </div>
                    </td>
                    <td>{getStockStatus(ing)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 5 }}>
                        <button className="btn btn-outline btn-sm btn-icon" onClick={() => openEdit(ing)}><Edit2 size={13} /></button>
                        <button className="btn btn-sm btn-icon" style={{ background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca' }} onClick={() => setShowDeleteModal(ing)}><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={9}>
                  <div className="empty-state">
                    <div className="empty-state-icon">🌿</div>
                    <div className="empty-state-title">No se encontraron ingredientes</div>
                  </div>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal modal-md animate-modalIn" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">{isEditing ? '✏️ Editar Ingrediente' : '➕ Nuevo Ingrediente'}</span>
              <button className="modal-close" onClick={() => setShowModal(false)}><X size={16} /></button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Nombre del Ingrediente *</label>
                <input className="form-input" value={editIng.name || ''} onChange={e => setEditIng(p => ({ ...p, name: e.target.value }))} placeholder="Ej: Fresa" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Categoría</label>
                  <select className="form-select" value={editIng.category || 'Frutas'} onChange={e => setEditIng(p => ({ ...p, category: e.target.value }))}>
                    {ingCategories.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Unidad de Medida</label>
                  <select className="form-select" value={editIng.unit || 'lb'} onChange={e => setEditIng(p => ({ ...p, unit: e.target.value }))}>
                    {units.map(u => <option key={u}>{u}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Stock Actual</label>
                  <input type="number" className="form-input" value={editIng.stock || 0} onChange={e => setEditIng(p => ({ ...p, stock: Number(e.target.value) }))} min={0} />
                </div>
                <div className="form-group">
                  <label className="form-label">Stock Mínimo (Alerta)</label>
                  <input type="number" className="form-input" value={editIng.minStock || 2} onChange={e => setEditIng(p => ({ ...p, minStock: Number(e.target.value) }))} min={1} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Costo por Unidad (C$)</label>
                <input type="number" className="form-input" value={editIng.cost || 0} onChange={e => setEditIng(p => ({ ...p, cost: Number(e.target.value) }))} min={0} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={handleSave}>{isEditing ? 'Guardar Cambios' : 'Registrar'}</button>
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
              <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>¿Eliminar Ingrediente?</h3>
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

import { useState } from 'react';
import { Search, Eye, ShoppingCart, X, Info } from 'lucide-react';
import { store, Product } from '../../data/store';

interface MenuProductosProps {
  showToast: (msg: string, type?: string) => void;
  onAddToSale?: () => void;
}

export default function MenuProductos({ showToast, onAddToSale }: MenuProductosProps) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Todos');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const categories = ['Todos', ...Array.from(new Set(store.products.map(p => p.category)))];
  const filtered = store.products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'Todos' || p.category === category;
    return matchSearch && matchCat;
  });

  const getIngredientNames = (product: Product) =>
    product.ingredients.map(ing => {
      const found = store.ingredients.find(i => i.id === ing.ingredientId);
      return found?.name || '';
    }).filter(Boolean);

  const statusClass: Record<string, string> = {
    'Disponible': 'badge-green',
    'Agotado': 'badge-red',
    'Stock Bajo': 'badge-yellow',
  };

  const categoryColors: Record<string, string> = {
    'Batidos': 'linear-gradient(135deg,#dcfce7,#bbf7d0)',
    'Frutas Preparadas': 'linear-gradient(135deg,#fff7ed,#fed7aa)',
    'Frescos': 'linear-gradient(135deg,#eff6ff,#bfdbfe)',
    'Ensaladas': 'linear-gradient(135deg,#f0fdf4,#dcfce7)',
    'Bowls': 'linear-gradient(135deg,#f5f3ff,#ede9fe)',
  };

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <div className="page-header-left">
          <h2>Menú de Productos</h2>
          <p>Explora todos los productos disponibles de Chily Frutas</p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <span className="badge badge-green">{filtered.length} productos</span>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 14, marginBottom: 20, alignItems: 'center', flexWrap: 'wrap' }}>
        <div className="search-bar">
          <Search className="search-bar-icon" />
          <input
            type="text"
            placeholder="Buscar producto..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="category-filters">
          {categories.map(cat => (
            <button
              key={cat}
              className={`category-filter ${category === cat ? 'active' : ''}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="products-grid">
        {filtered.map(product => (
          <div key={product.id} className="product-card">
            <div className="product-card-image" style={{ background: categoryColors[product.category] || 'linear-gradient(135deg,#f0fdf4,#dcfce7)' }}>
              <span style={{ fontSize: 54 }}>{product.image}</span>
              <div className="product-card-status">
                <span className={`badge ${statusClass[product.status]}`}>
                  {product.status}
                </span>
              </div>
            </div>
            <div className="product-card-body">
              <div className="product-card-category">{product.category}</div>
              <div className="product-card-name">{product.name}</div>
              <div className="product-card-price">C${product.price}</div>

              <div style={{ marginBottom: 12, fontSize: 11, color: '#9ca3af', lineHeight: 1.5 }}>
                {product.description.length > 70 ? product.description.slice(0, 70) + '…' : product.description}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                <span style={{ fontSize: 10, color: '#9ca3af' }}>Ingredientes:</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                  {getIngredientNames(product).slice(0, 3).map(name => (
                    <span key={name} style={{
                      fontSize: 10, background: '#f3f4f6', color: '#6b7280',
                      padding: '1px 6px', borderRadius: 10
                    }}>{name}</span>
                  ))}
                  {getIngredientNames(product).length > 3 && (
                    <span style={{ fontSize: 10, color: '#9ca3af' }}>+{getIngredientNames(product).length - 3}</span>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 6 }}>
                <button
                  className="btn btn-outline btn-sm"
                  style={{ flex: 1, justifyContent: 'center' }}
                  onClick={() => setSelectedProduct(product)}
                >
                  <Eye size={13} />
                  Ver Detalles
                </button>
                <button
                  className="btn btn-primary btn-sm"
                  style={{ flex: 1, justifyContent: 'center' }}
                  disabled={product.stock === 0}
                  onClick={() => {
                    if (product.stock === 0) return;
                    showToast(`${product.name} agregado a venta`, 'success');
                    if (onAddToSale) onAddToSale();
                  }}
                >
                  <ShoppingCart size={13} />
                  Agregar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedProduct && (
        <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
          <div className="modal modal-lg animate-modalIn" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Info size={18} color="#16a34a" />
                Detalle del Producto
              </span>
              <button className="modal-close" onClick={() => setSelectedProduct(null)}><X size={16} /></button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 28 }}>
                {/* Image */}
                <div>
                  <div style={{
                    height: 220, borderRadius: 14,
                    background: categoryColors[selectedProduct.category] || 'linear-gradient(135deg,#f0fdf4,#dcfce7)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 90, marginBottom: 14
                  }}>
                    {selectedProduct.image}
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <span className={`badge ${statusClass[selectedProduct.status]}`} style={{ fontSize: 13 }}>
                      {selectedProduct.status}
                    </span>
                  </div>
                  <div style={{ marginTop: 16, background: '#f8fafc', borderRadius: 10, padding: 14 }}>
                    <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                      Información
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13 }}>
                      <span style={{ color: '#6b7280' }}>Código</span>
                      <span style={{ fontWeight: 600 }}>{selectedProduct.code}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13 }}>
                      <span style={{ color: '#6b7280' }}>Categoría</span>
                      <span style={{ fontWeight: 600 }}>{selectedProduct.category}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13 }}>
                      <span style={{ color: '#6b7280' }}>Unidades Vendidas</span>
                      <span style={{ fontWeight: 600, color: '#16a34a' }}>{selectedProduct.unitsSold}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                      <span style={{ color: '#6b7280' }}>Stock Actual</span>
                      <span style={{ fontWeight: 600, color: selectedProduct.stock === 0 ? '#ef4444' : selectedProduct.stock <= selectedProduct.minStock ? '#f97316' : '#16a34a' }}>
                        {selectedProduct.stock} unidades
                      </span>
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div>
                  <div style={{ fontSize: 10, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600, marginBottom: 6 }}>
                    {selectedProduct.category}
                  </div>
                  <h2 style={{ fontSize: 24, fontWeight: 800, color: '#1a2e1a', marginBottom: 6 }}>
                    {selectedProduct.name}
                  </h2>
                  <div style={{ fontSize: 28, fontWeight: 900, color: '#16a34a', marginBottom: 16 }}>
                    C${selectedProduct.price}
                  </div>

                  <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.7, marginBottom: 20 }}>
                    {selectedProduct.description}
                  </p>

                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 10 }}>
                      🌿 Ingredientes:
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {getIngredientNames(selectedProduct).map(name => (
                        <div key={name} style={{
                          display: 'flex', alignItems: 'center', gap: 5,
                          padding: '5px 12px', background: '#f0fdf4',
                          border: '1px solid #bbf7d0', borderRadius: 20,
                          fontSize: 12, fontWeight: 500, color: '#16a34a'
                        }}>
                          ✓ {name}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ background: '#fafafa', borderRadius: 10, padding: 16, marginBottom: 16 }}>
                    <div style={{ fontSize: 12, color: '#9ca3af', fontWeight: 600, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                      Análisis Económico
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
                      <span style={{ color: '#6b7280' }}>Precio de venta</span>
                      <span style={{ fontWeight: 700, color: '#16a34a' }}>C${selectedProduct.price}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
                      <span style={{ color: '#6b7280' }}>Costo estimado</span>
                      <span style={{ fontWeight: 600, color: '#ef4444' }}>C${selectedProduct.cost}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, borderTop: '1px solid #e5e7eb', paddingTop: 8 }}>
                      <span style={{ color: '#6b7280' }}>Ganancia neta</span>
                      <span style={{ fontWeight: 800, color: '#f97316' }}>C${selectedProduct.price - selectedProduct.cost}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setSelectedProduct(null)}>Cerrar</button>
              <button
                className="btn btn-primary"
                disabled={selectedProduct.stock === 0}
                onClick={() => {
                  if (selectedProduct.stock === 0) return;
                  showToast(`${selectedProduct.name} agregado a venta`, 'success');
                  setSelectedProduct(null);
                  if (onAddToSale) onAddToSale();
                }}
              >
                <ShoppingCart size={15} />
                Agregar a Venta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

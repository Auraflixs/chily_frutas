import React, { useState, useCallback } from 'react';
import {
  ShoppingCart, Search, Trash2, Plus, Minus, CreditCard,
  Banknote, Smartphone, X, CheckCircle, Printer, Download, Receipt
} from 'lucide-react';
import { store, Product, SaleItem, Sale } from '../../data/store';

interface CartItem extends SaleItem {
  emoji: string;
}

interface VentasProps {
  onSaleComplete: () => void;
  showToast: (msg: string, type?: string) => void;
}

export default function Ventas({ onSaleComplete, showToast }: VentasProps) {
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [category, setCategory] = useState('Todos');
  const [paymentMethod, setPaymentMethod] = useState<'Efectivo' | 'Tarjeta' | 'Transferencia'>('Efectivo');
  const [amountReceived, setAmountReceived] = useState('');
  const [showCheckout, setShowCheckout] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [lastSale, setLastSale] = useState<Sale | null>(null);
  const [clientName, setClientName] = useState('');

  const categories = ['Todos', ...Array.from(new Set(store.products.map(p => p.category)))];
  const filtered = store.products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'Todos' || p.category === category;
    return matchSearch && matchCat;
  });

  const total = cart.reduce((s, i) => s + i.subtotal, 0);
  const change = paymentMethod === 'Efectivo'
    ? Math.max(0, parseFloat(amountReceived || '0') - total)
    : 0;

  const addToCart = (product: Product) => {
    if (product.stock === 0) {
      showToast('Producto agotado', 'error');
      return;
    }
    setCart(prev => {
      const exists = prev.find(i => i.productId === product.id);
      if (exists) {
        return prev.map(i => i.productId === product.id
          ? { ...i, quantity: i.quantity + 1, subtotal: (i.quantity + 1) * i.unitPrice }
          : i
        );
      }
      return [...prev, {
        productId: product.id,
        productName: product.name,
        quantity: 1,
        unitPrice: product.price,
        subtotal: product.price,
        emoji: product.image,
      }];
    });
  };

  const updateQty = (productId: number, delta: number) => {
    setCart(prev =>
      prev.map(i => {
        if (i.productId !== productId) return i;
        const newQty = i.quantity + delta;
        if (newQty < 1) return i;
        return { ...i, quantity: newQty, subtotal: newQty * i.unitPrice };
      })
    );
  };

  const removeItem = (productId: number) => {
    setCart(prev => prev.filter(i => i.productId !== productId));
  };

  const clearCart = () => setCart([]);

  const handleCheckout = () => {
    if (cart.length === 0) {
      showToast('El carrito está vacío', 'warning');
      return;
    }
    if (paymentMethod === 'Efectivo') {
      const recv = parseFloat(amountReceived || '0');
      if (recv < total) {
        showToast('El monto recibido es menor al total', 'error');
        return;
      }
    }

    const now = new Date();
    const sale: Sale = {
      id: store.sales.length + 1,
      invoiceNumber: store.getNextInvoiceNumber(),
      date: now.toISOString().split('T')[0],
      time: now.toTimeString().slice(0, 8),
      items: cart.map(({ emoji: _emoji, ...rest }) => rest),
      subtotal: total,
      total,
      paymentMethod,
      amountReceived: paymentMethod === 'Efectivo' ? parseFloat(amountReceived) : total,
      change: paymentMethod === 'Efectivo' ? change : 0,
      cashierName: store.currentUser?.name || 'Sistema',
      clientName: clientName || 'Cliente General',
      status: 'Completada',
    };

    store.addSale(sale);
    setLastSale(sale);
    setCart([]);
    setAmountReceived('');
    setClientName('');
    setShowCheckout(false);
    setShowInvoice(true);
    onSaleComplete();
    showToast(`Venta ${sale.invoiceNumber} completada exitosamente`, 'success');
  };

  const handlePrint = () => {
    const printWindow = window.open('', '', 'width=400,height=600');
    if (!printWindow || !lastSale) return;
    printWindow.document.write(generateInvoiceHTML(lastSale));
    printWindow.document.close();
    printWindow.print();
  };

  const generateInvoiceHTML = (sale: Sale) => `
    <html><head><style>
      body { font-family: 'Courier New', monospace; font-size: 12px; width: 300px; margin: 0 auto; }
      .center { text-align: center; }
      .bold { font-weight: bold; }
      .divider { border-top: 1px dashed #333; margin: 8px 0; }
      .row { display: flex; justify-content: space-between; margin: 2px 0; }
      .total { font-size: 14px; font-weight: bold; }
    </style></head><body>
      <div class="center bold" style="font-size:16px;">🍓 CHILY FRUTAS</div>
      <div class="center">Managua, Nicaragua</div>
      <div class="center">Tel: 8888-0000</div>
      <div class="divider"></div>
      <div class="row"><span>Factura:</span><span class="bold">${sale.invoiceNumber}</span></div>
      <div class="row"><span>Fecha:</span><span>${sale.date}</span></div>
      <div class="row"><span>Hora:</span><span>${sale.time}</span></div>
      <div class="row"><span>Cajero:</span><span>${sale.cashierName}</span></div>
      <div class="row"><span>Cliente:</span><span>${sale.clientName || 'General'}</span></div>
      <div class="divider"></div>
      ${sale.items.map(item => `
        <div class="row"><span>${item.productName}</span></div>
        <div class="row"><span>  ${item.quantity} x C$${item.unitPrice}</span><span>C$${item.subtotal}</span></div>
      `).join('')}
      <div class="divider"></div>
      <div class="row total"><span>TOTAL:</span><span>C$${sale.total}</span></div>
      <div class="row"><span>Recibido:</span><span>C$${sale.amountReceived}</span></div>
      <div class="row"><span>Cambio:</span><span>C$${sale.change}</span></div>
      <div class="divider"></div>
      <div class="center">¡Gracias por su compra!</div>
      <div class="center">Vuelva pronto 😊</div>
    </body></html>
  `;

  return (
    <div className="animate-fadeIn">
      <div className="pos-layout">
        {/* Products Panel */}
        <div className="pos-products">
          <div className="pos-products-header">
            <div className="search-bar" style={{ flex: 1 }}>
              <Search className="search-bar-icon" />
              <input
                type="text"
                placeholder="Buscar producto..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ width: '100%' }}
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

          <div className="pos-products-grid">
            {filtered.map(product => (
              <div
                key={product.id}
                className={`pos-product-card ${product.stock === 0 ? 'out-of-stock' : ''}`}
                onClick={() => addToCart(product)}
                title={product.stock === 0 ? 'Agotado' : `Agregar ${product.name}`}
              >
                {product.stock === 0 && (
                  <div style={{
                    position: 'absolute', top: 6, right: 6,
                    background: '#ef4444', color: 'white',
                    fontSize: 9, fontWeight: 700, padding: '2px 5px',
                    borderRadius: 4, zIndex: 1
                  }}>AGOTADO</div>
                )}
                {product.stock > 0 && product.stock <= product.minStock && (
                  <div style={{
                    position: 'absolute', top: 6, right: 6,
                    background: '#f97316', color: 'white',
                    fontSize: 9, fontWeight: 700, padding: '2px 5px',
                    borderRadius: 4, zIndex: 1
                  }}>POCO</div>
                )}
                <span className="pos-product-emoji">{product.image}</span>
                <div className="pos-product-category">{product.category}</div>
                <div className="pos-product-name">{product.name}</div>
                <div className="pos-product-price">C${product.price}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Cart */}
        <div className="pos-cart">
          <div className="pos-cart-header">
            <div className="pos-cart-title">
              <ShoppingCart size={18} />
              Carrito de Venta
              {cart.length > 0 && (
                <span style={{
                  background: '#22c55e', color: 'white',
                  fontSize: 11, fontWeight: 700,
                  padding: '1px 7px', borderRadius: 20, marginLeft: 4
                }}>{cart.length}</span>
              )}
            </div>
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 6, padding: '4px 8px', color: 'rgba(255,255,255,0.7)', fontSize: 11, cursor: 'pointer' }}
              >
                Limpiar
              </button>
            )}
          </div>

          {cart.length === 0 ? (
            <div className="pos-cart-empty">
              <ShoppingCart size={48} />
              <span>Carrito vacío</span>
              <span style={{ fontSize: 11 }}>Haz clic en un producto para agregarlo</span>
            </div>
          ) : (
            <div className="pos-cart-items">
              {cart.map(item => (
                <div key={item.productId} className="pos-cart-item">
                  <span className="pos-cart-item-emoji">{item.emoji}</span>
                  <div className="pos-cart-item-info">
                    <div className="pos-cart-item-name">{item.productName}</div>
                    <div className="pos-cart-item-price">C${item.unitPrice} c/u</div>
                  </div>
                  <div className="pos-cart-qty">
                    <button className="pos-qty-btn" onClick={() => updateQty(item.productId, -1)}>
                      <Minus size={11} />
                    </button>
                    <span className="pos-qty-value">{item.quantity}</span>
                    <button className="pos-qty-btn" onClick={() => updateQty(item.productId, 1)}>
                      <Plus size={11} />
                    </button>
                  </div>
                  <span className="pos-cart-item-total">C${item.subtotal}</span>
                  <button className="pos-remove-btn" onClick={() => removeItem(item.productId)}>
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="pos-cart-footer">
            {/* Client */}
            <div style={{ marginBottom: 10 }}>
              <input
                type="text"
                placeholder="Cliente (opcional)"
                value={clientName}
                onChange={e => setClientName(e.target.value)}
                className="form-input"
                style={{ fontSize: 12, padding: '7px 10px' }}
              />
            </div>

            {/* Totals */}
            <div className="pos-total-row">
              <span>Subtotal:</span>
              <span>C${total}</span>
            </div>
            <div className="pos-total-row" style={{ fontWeight: 800, color: '#1a2e1a', fontSize: 18, marginBottom: 10 }}>
              <span>TOTAL:</span>
              <span className="pos-total-main">C${total}</span>
            </div>

            {/* Payment */}
            <div style={{ fontSize: 11, fontWeight: 600, color: '#6b7280', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.6px' }}>
              Método de Pago
            </div>
            <div className="pos-payment-methods">
              <button
                className={`pos-payment-btn ${paymentMethod === 'Efectivo' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('Efectivo')}
              >
                <Banknote size={16} />
                Efectivo
              </button>
              <button
                className={`pos-payment-btn ${paymentMethod === 'Tarjeta' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('Tarjeta')}
              >
                <CreditCard size={16} />
                Tarjeta
              </button>
              <button
                className={`pos-payment-btn ${paymentMethod === 'Transferencia' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('Transferencia')}
              >
                <Smartphone size={16} />
                Transfer.
              </button>
            </div>

            {/* Amount received (cash only) */}
            {paymentMethod === 'Efectivo' && (
              <div style={{ marginBottom: 10 }}>
                <input
                  type="number"
                  placeholder="Monto recibido (C$)"
                  value={amountReceived}
                  onChange={e => setAmountReceived(e.target.value)}
                  className="form-input"
                  style={{ fontSize: 13, padding: '8px 10px' }}
                  min={total}
                />
                {parseFloat(amountReceived || '0') >= total && total > 0 && (
                  <div style={{
                    marginTop: 6, padding: '6px 10px',
                    background: '#f0fdf4', borderRadius: 6,
                    display: 'flex', justifyContent: 'space-between',
                    fontSize: 13, fontWeight: 700, color: '#16a34a'
                  }}>
                    <span>Cambio:</span>
                    <span>C${change.toFixed(2)}</span>
                  </div>
                )}
              </div>
            )}

            <button
              className="btn btn-primary w-full"
              style={{ justifyContent: 'center', padding: '13px', fontSize: 14, borderRadius: 10 }}
              onClick={() => {
                if (cart.length === 0) { showToast('Agrega productos al carrito', 'warning'); return; }
                setShowCheckout(true);
              }}
            >
              <CheckCircle size={18} />
              Procesar Venta — C${total}
            </button>
          </div>
        </div>
      </div>

      {/* Checkout Confirmation Modal */}
      {showCheckout && (
        <div className="modal-overlay" onClick={() => setShowCheckout(false)}>
          <div className="modal modal-md" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Confirmar Venta</span>
              <button className="modal-close" onClick={() => setShowCheckout(false)}><X size={16} /></button>
            </div>
            <div className="modal-body">
              <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <div style={{ fontSize: 48, marginBottom: 8 }}>🧾</div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#1a2e1a', marginBottom: 4 }}>
                  Confirmar Pago
                </h3>
                <p style={{ fontSize: 13, color: '#6b7280' }}>
                  Revisa los detalles antes de procesar
                </p>
              </div>

              <div style={{ background: '#f8fafc', borderRadius: 10, padding: 16, marginBottom: 16 }}>
                {cart.map(item => (
                  <div key={item.productId} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
                    <span>{item.emoji} {item.productName} × {item.quantity}</span>
                    <span style={{ fontWeight: 600 }}>C${item.subtotal}</span>
                  </div>
                ))}
                <div style={{ borderTop: '1px dashed #e5e7eb', marginTop: 8, paddingTop: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 16, color: '#1a2e1a' }}>
                    <span>TOTAL</span>
                    <span>C${total}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={{ background: '#f0fdf4', borderRadius: 8, padding: 12, textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: '#16a34a', fontWeight: 600, marginBottom: 4 }}>Método de Pago</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#1a2e1a' }}>{paymentMethod}</div>
                </div>
                {paymentMethod === 'Efectivo' && (
                  <div style={{ background: '#fff7ed', borderRadius: 8, padding: 12, textAlign: 'center' }}>
                    <div style={{ fontSize: 11, color: '#f97316', fontWeight: 600, marginBottom: 4 }}>Cambio a Devolver</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#1a2e1a' }}>C${change.toFixed(2)}</div>
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowCheckout(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={handleCheckout}>
                <CheckCircle size={16} />
                Confirmar Venta
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      {showInvoice && lastSale && (
        <div className="modal-overlay">
          <div className="modal modal-md animate-modalIn">
            <div className="modal-header" style={{ background: 'linear-gradient(135deg,#1a2e1a,#16a34a)', borderRadius: '16px 16px 0 0' }}>
              <span className="modal-title" style={{ color: 'white', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Receipt size={18} />
                Factura Generada
              </span>
              <button className="modal-close" style={{ background: 'rgba(255,255,255,0.15)', color: 'white' }} onClick={() => setShowInvoice(false)}>
                <X size={16} />
              </button>
            </div>
            <div className="modal-body">
              {/* Success */}
              <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <div style={{
                  width: 56, height: 56, background: '#dcfce7',
                  borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 12px', fontSize: 24
                }}>✅</div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#1a2e1a', marginBottom: 4 }}>
                  ¡Venta Completada!
                </h3>
                <p style={{ fontSize: 13, color: '#6b7280' }}>
                  {lastSale.invoiceNumber} • {lastSale.date} {lastSale.time}
                </p>
              </div>

              {/* Invoice */}
              <div className="invoice-paper" style={{ border: '1px dashed #e5e7eb', borderRadius: 8 }}>
                <div className="invoice-header">
                  <div style={{ fontSize: 18, marginBottom: 4 }}>🍓</div>
                  <div style={{ fontSize: 14, fontWeight: 'bold' }}>CHILY FRUTAS</div>
                  <div style={{ fontSize: 11 }}>Managua, Nicaragua | Tel: 8888-0000</div>
                </div>
                <hr className="invoice-divider" />
                <div className="invoice-row"><span>Factura:</span><span><b>{lastSale.invoiceNumber}</b></span></div>
                <div className="invoice-row"><span>Fecha:</span><span>{lastSale.date}</span></div>
                <div className="invoice-row"><span>Hora:</span><span>{lastSale.time}</span></div>
                <div className="invoice-row"><span>Cajero:</span><span>{lastSale.cashierName}</span></div>
                <div className="invoice-row"><span>Cliente:</span><span>{lastSale.clientName || 'General'}</span></div>
                <hr className="invoice-divider" />
                {lastSale.items.map((item, i) => (
                  <div key={i}>
                    <div style={{ fontSize: 12 }}>{item.productName}</div>
                    <div className="invoice-row">
                      <span>  {item.quantity} × C${item.unitPrice}</span>
                      <span>C${item.subtotal}</span>
                    </div>
                  </div>
                ))}
                <hr className="invoice-divider" />
                <div className="invoice-total-row">
                  <span>TOTAL:</span><span>C${lastSale.total}</span>
                </div>
                <div className="invoice-row"><span>Recibido:</span><span>C${lastSale.amountReceived}</span></div>
                <div className="invoice-row"><span>Cambio:</span><span>C${lastSale.change}</span></div>
                <div className="invoice-row"><span>Pago:</span><span>{lastSale.paymentMethod}</span></div>
                <hr className="invoice-divider" />
                <div className="invoice-footer">
                  <div>¡Gracias por su compra!</div>
                  <div>Vuelva pronto 😊</div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowInvoice(false)}>Cerrar</button>
              <button className="btn btn-outline" onClick={handlePrint}>
                <Printer size={15} />
                Imprimir
              </button>
              <button className="btn btn-primary" onClick={() => setShowInvoice(false)}>
                <CheckCircle size={15} />
                Nueva Venta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

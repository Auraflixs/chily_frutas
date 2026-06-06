import { useState } from 'react';
import { BarChart3, TrendingUp, Download, FileText, Calendar } from 'lucide-react';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { store } from '../../data/store';

interface ReportesProps {
  showToast: (msg: string, type?: string) => void;
}

export default function Reportes({ showToast }: ReportesProps) {
  const [period, setPeriod] = useState<'diario' | 'semanal' | 'mensual' | 'anual'>('semanal');
  const [dateFrom, setDateFrom] = useState('2025-01-01');
  const [dateTo, setDateTo] = useState('2025-01-31');

  const allSales = store.sales.filter(s => s.status === 'Completada');
  const totalRevenue = allSales.reduce((s, sale) => s + sale.total, 0);
  const estimatedGain = Math.round(totalRevenue * 0.42);
  const totalTransactions = allSales.length;
  const avgTicket = totalTransactions > 0 ? Math.round(totalRevenue / totalTransactions) : 0;

  // Products sold stats
  const productSales: Record<number, { name: string; qty: number; revenue: number; emoji: string }> = {};
  allSales.forEach(s => {
    s.items.forEach(item => {
      if (!productSales[item.productId]) {
        const p = store.products.find(pr => pr.id === item.productId);
        productSales[item.productId] = { name: item.productName, qty: 0, revenue: 0, emoji: p?.image || '🍓' };
      }
      productSales[item.productId].qty += item.quantity;
      productSales[item.productId].revenue += item.subtotal;
    });
  });
  const sortedProducts = Object.values(productSales).sort((a, b) => b.qty - a.qty);

  // Charts
  const weekLabels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  const weekSales = [1850, 2100, 1680, 2450, 2800, 3200, 2760];
  const weekGain = weekSales.map(v => Math.round(v * 0.42));

  const monthLabels = ['1', '5', '10', '15', '20', '25', '31'];
  const monthSales = [2100, 1800, 2400, 3100, 2700, 2900, 3400];

  const paymentData = {
    labels: ['Efectivo', 'Tarjeta', 'Transferencia'],
    datasets: [{
      data: [
        allSales.filter(s => s.paymentMethod === 'Efectivo').length,
        allSales.filter(s => s.paymentMethod === 'Tarjeta').length,
        allSales.filter(s => s.paymentMethod === 'Transferencia').length,
      ],
      backgroundColor: ['#16a34a', '#3b82f6', '#a855f7'],
      borderWidth: 0,
    }]
  };

  const barChartData = {
    labels: weekLabels,
    datasets: [
      {
        label: 'Ventas (C$)',
        data: weekSales,
        backgroundColor: 'rgba(22,163,74,0.8)',
        borderRadius: 6,
        borderSkipped: false,
      },
      {
        label: 'Ganancias (C$)',
        data: weekGain,
        backgroundColor: 'rgba(249,115,22,0.8)',
        borderRadius: 6,
        borderSkipped: false,
      }
    ]
  };

  const lineChartData = {
    labels: monthLabels,
    datasets: [{
      label: 'Ventas del Mes',
      data: monthSales,
      borderColor: '#16a34a',
      backgroundColor: 'rgba(22,163,74,0.1)',
      fill: true,
      tension: 0.4,
      borderWidth: 2,
      pointBackgroundColor: '#16a34a',
    }]
  };

  const chartOpts = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { font: { size: 11, family: 'Inter' }, boxWidth: 12 } },
      tooltip: { callbacks: { label: (ctx: any) => ` C$${ctx.parsed.y?.toLocaleString() || ctx.parsed}` } }
    },
    scales: {
      y: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { font: { size: 11 }, callback: (v: any) => `C$${v.toLocaleString()}` } },
      x: { grid: { display: false }, ticks: { font: { size: 11 } } }
    }
  };

  const doughnutOpts = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' as const, labels: { font: { size: 11 } } }
    },
    cutout: '60%'
  };

  const handleExport = (type: string) => {
    showToast(`Reporte ${type} exportado exitosamente`, 'success');
  };

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <div className="page-header-left">
          <h2>Módulo de Reportes</h2>
          <p>Análisis de ventas, ganancias y rendimiento del negocio</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-outline" onClick={() => handleExport('PDF')}>
            <FileText size={15} />
            Exportar PDF
          </button>
          <button className="btn btn-secondary" onClick={() => handleExport('Excel')}>
            <Download size={15} />
            Exportar Excel
          </button>
        </div>
      </div>

      {/* Period Tabs */}
      <div className="tabs">
        {(['diario', 'semanal', 'mensual', 'anual'] as const).map(p => (
          <div key={p} className={`tab ${period === p ? 'active' : ''}`} onClick={() => setPeriod(p)}>
            <Calendar size={14} />
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </div>
        ))}
      </div>

      {/* Date filters */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-body" style={{ padding: '14px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>Filtrar por fecha:</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <label style={{ fontSize: 12, color: '#6b7280' }}>Desde:</label>
              <input type="date" className="form-input" value={dateFrom} onChange={e => setDateFrom(e.target.value)} style={{ width: 150 }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <label style={{ fontSize: 12, color: '#6b7280' }}>Hasta:</label>
              <input type="date" className="form-input" value={dateTo} onChange={e => setDateTo(e.target.value)} style={{ width: 150 }} />
            </div>
            <button className="btn btn-primary btn-sm">Aplicar Filtro</button>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)', marginBottom: 20 }}>
        <div className="stat-card" style={{ borderTop: '3px solid #16a34a' }}>
          <div className="stat-card-header">
            <div className="stat-card-icon" style={{ background: '#dcfce7' }}><TrendingUp size={22} color="#16a34a" /></div>
            <span className="stat-card-trend trend-up">▲ 15%</span>
          </div>
          <div className="stat-card-value">C${totalRevenue.toLocaleString()}</div>
          <div className="stat-card-label">Ventas Totales</div>
        </div>
        <div className="stat-card" style={{ borderTop: '3px solid #f97316' }}>
          <div className="stat-card-header">
            <div className="stat-card-icon" style={{ background: '#fff7ed' }}><BarChart3 size={22} color="#f97316" /></div>
            <span className="stat-card-trend trend-up">▲ 12%</span>
          </div>
          <div className="stat-card-value">C${estimatedGain.toLocaleString()}</div>
          <div className="stat-card-label">Ganancias Estimadas</div>
        </div>
        <div className="stat-card" style={{ borderTop: '3px solid #3b82f6' }}>
          <div className="stat-card-header">
            <div className="stat-card-icon" style={{ background: '#eff6ff' }}><FileText size={22} color="#3b82f6" /></div>
          </div>
          <div className="stat-card-value">{totalTransactions}</div>
          <div className="stat-card-label">Transacciones</div>
        </div>
        <div className="stat-card" style={{ borderTop: '3px solid #a855f7' }}>
          <div className="stat-card-header">
            <div className="stat-card-icon" style={{ background: '#f5f3ff' }}><TrendingUp size={22} color="#a855f7" /></div>
          </div>
          <div className="stat-card-value">C${avgTicket}</div>
          <div className="stat-card-label">Ticket Promedio</div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid-2" style={{ marginBottom: 20 }}>
        <div className="card">
          <div className="card-header">
            <div className="card-title"><BarChart3 size={18} color="#16a34a" /> Ventas vs Ganancias (Semana)</div>
          </div>
          <div className="card-body">
            <div className="chart-container" style={{ height: 220 }}>
              <Bar data={barChartData} options={chartOpts} />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title"><TrendingUp size={18} color="#f97316" /> Tendencia Mensual</div>
          </div>
          <div className="card-body">
            <div className="chart-container" style={{ height: 220 }}>
              <Line data={lineChartData} options={chartOpts} />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid-2" style={{ marginBottom: 20 }}>
        {/* Top Products */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">🏆 Productos Más Vendidos</div>
            <span className="badge badge-orange">Top {sortedProducts.length}</span>
          </div>
          <div className="card-body">
            {sortedProducts.map((p, i) => (
              <div key={p.name} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#9ca3af', minWidth: 18 }}>#{i + 1}</span>
                    <span style={{ fontSize: 16 }}>{p.emoji}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>{p.name}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#16a34a' }}>{p.qty} uds</div>
                    <div style={{ fontSize: 10, color: '#9ca3af' }}>C${p.revenue}</div>
                  </div>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{
                    width: `${(p.qty / sortedProducts[0].qty) * 100}%`,
                    background: i === 0 ? '#16a34a' : i === 1 ? '#f97316' : i === 2 ? '#3b82f6' : '#a855f7'
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">💳 Métodos de Pago</div>
          </div>
          <div className="card-body">
            <div className="chart-container" style={{ height: 180 }}>
              <Doughnut data={paymentData} options={doughnutOpts} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginTop: 16 }}>
              {['Efectivo', 'Tarjeta', 'Transferencia'].map((method, i) => {
                const count = allSales.filter(s => s.paymentMethod === method).length;
                const revenue = allSales.filter(s => s.paymentMethod === method).reduce((s, sale) => s + sale.total, 0);
                const colors = ['#16a34a', '#3b82f6', '#a855f7'];
                return (
                  <div key={method} style={{ textAlign: 'center', padding: 10, background: '#f8fafc', borderRadius: 8, borderTop: `3px solid ${colors[i]}` }}>
                    <div style={{ fontSize: 16, fontWeight: 800, color: colors[i] }}>{count}</div>
                    <div style={{ fontSize: 10, color: '#6b7280', marginBottom: 2 }}>{method}</div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: '#374151' }}>C${revenue}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Sales Table */}
      <div className="card">
        <div className="card-header">
          <div className="card-title"><FileText size={18} color="#16a34a" /> Historial de Ventas</div>
          <span className="badge badge-gray">{allSales.length} registros</span>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Factura</th><th>Fecha</th><th>Hora</th><th>Cajero</th>
                <th>Cliente</th><th>Artículos</th><th>Total</th><th>Pago</th><th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {allSales.map(s => (
                <tr key={s.id}>
                  <td style={{ fontWeight: 600, color: '#16a34a', fontSize: 12 }}>{s.invoiceNumber}</td>
                  <td style={{ fontSize: 12 }}>{s.date}</td>
                  <td style={{ fontSize: 12, color: '#9ca3af' }}>{s.time}</td>
                  <td style={{ fontSize: 12 }}>{s.cashierName}</td>
                  <td style={{ fontSize: 12 }}>{s.clientName || 'General'}</td>
                  <td style={{ fontSize: 12 }}>{s.items.reduce((sum, i) => sum + i.quantity, 0)} items</td>
                  <td style={{ fontWeight: 700, color: '#16a34a' }}>C${s.total}</td>
                  <td><span className={`badge ${s.paymentMethod === 'Efectivo' ? 'badge-green' : s.paymentMethod === 'Tarjeta' ? 'badge-blue' : 'badge-purple'}`}>{s.paymentMethod}</span></td>
                  <td><span className="badge badge-green">{s.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

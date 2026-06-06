import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';
import {
  TrendingUp, ShoppingBag, Package, AlertTriangle,
  DollarSign, Users, Star, CheckCircle
} from 'lucide-react';
import { store } from '../../data/store';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend, Filler);

export default function Dashboard() {
  const todayTotal = store.getTodayTotal();
  const weekTotal = store.getWeekTotal();
  const monthTotal = store.getMonthTotal();
  const todaySales = store.getTodaySales();
  const lowStock = store.getLowStockProducts();
  const outStock = store.getOutOfStockProducts();
  const recentSales = store.sales.slice(0, 6);

  const topProducts = [...store.products]
    .sort((a, b) => b.unitsSold - a.unitsSold)
    .slice(0, 6);

  const weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  const weekSalesData = [1850, 2100, 1680, 2450, 2800, 3200, 2760];
  const weekGainData = weekSalesData.map(v => Math.round(v * 0.45));

  const salesChartData = {
    labels: weekDays,
    datasets: [
      {
        label: 'Ventas',
        data: weekSalesData,
        backgroundColor: 'rgba(22,163,74,0.15)',
        borderColor: '#16a34a',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#16a34a',
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'Ganancias',
        data: weekGainData,
        backgroundColor: 'rgba(249,115,22,0.1)',
        borderColor: '#f97316',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#f97316',
        pointRadius: 4,
        pointHoverRadius: 6,
      }
    ],
  };

  const topProductsChart = {
    labels: topProducts.map(p => p.name.length > 14 ? p.name.slice(0, 14) + '…' : p.name),
    datasets: [{
      data: topProducts.map(p => p.unitsSold),
      backgroundColor: [
        'rgba(22,163,74,0.85)',
        'rgba(249,115,22,0.85)',
        'rgba(59,130,246,0.85)',
        'rgba(168,85,247,0.85)',
        'rgba(236,72,153,0.85)',
        'rgba(234,179,8,0.85)',
      ],
      borderWidth: 0,
      hoverOffset: 8,
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' as const, labels: { font: { size: 11, family: 'Inter' }, boxWidth: 12 } },
      tooltip: {
        callbacks: {
          label: (ctx: any) => ` C$${ctx.parsed.y?.toLocaleString() || ctx.parsed}`,
        },
      },
    },
    scales: {
      y: {
        grid: { color: 'rgba(0,0,0,0.04)' },
        ticks: { font: { size: 11 }, callback: (v: any) => `C$${v.toLocaleString()}` },
      },
      x: { grid: { display: false }, ticks: { font: { size: 11 } } },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'right' as const, labels: { font: { size: 11, family: 'Inter' }, boxWidth: 12, padding: 12 } },
      tooltip: {
        callbacks: { label: (ctx: any) => ` ${ctx.label}: ${ctx.parsed} unidades` },
      },
    },
    cutout: '62%',
  };

  return (
    <div className="animate-fadeIn">
      {/* Welcome */}
      <div style={{
        background: 'linear-gradient(135deg, #1a2e1a 0%, #16a34a 60%, #22c55e 100%)',
        borderRadius: 16,
        padding: '24px 28px',
        marginBottom: 24,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 8px 32px rgba(22,163,74,0.25)',
      }}>
        <div>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 4 }}>
            ¡Bienvenido de vuelta!
          </p>
          <h2 style={{ color: 'white', fontSize: 26, fontWeight: 800, letterSpacing: -0.5 }}>
            {store.currentUser?.name} 👋
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 4 }}>
            {store.currentUser?.role} • {new Date().toLocaleDateString('es-NI', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, marginBottom: 2 }}>Ventas de hoy</div>
          <div style={{ color: 'white', fontSize: 34, fontWeight: 900, letterSpacing: -1 }}>
            C${todayTotal.toLocaleString()}
          </div>
          <div style={{ color: '#86efac', fontSize: 12, marginTop: 2 }}>
            {todaySales.length} transacciones
          </div>
        </div>
      </div>

      {/* Alerts */}
      {(lowStock.length > 0 || outStock.length > 0) && (
        <div style={{ marginBottom: 20 }}>
          {outStock.length > 0 && (
            <div className="alert alert-danger" style={{ marginBottom: 8 }}>
              <AlertTriangle size={16} style={{ flexShrink: 0 }} />
              <span>
                <strong>{outStock.length} producto(s) agotado(s):</strong>{' '}
                {outStock.map(p => p.name).join(', ')}
              </span>
            </div>
          )}
          {lowStock.length > 0 && (
            <div className="alert alert-warning">
              <AlertTriangle size={16} style={{ flexShrink: 0 }} />
              <span>
                <strong>{lowStock.length} producto(s) con stock bajo:</strong>{' '}
                {lowStock.map(p => p.name).join(', ')}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Stats */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-card-icon" style={{ background: '#dcfce7' }}>
              <DollarSign size={22} color="#16a34a" />
            </div>
            <span className="stat-card-trend trend-up">▲ +12%</span>
          </div>
          <div className="stat-card-value">C${todayTotal.toLocaleString()}</div>
          <div className="stat-card-label">Ventas del Día</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-card-icon" style={{ background: '#fff7ed' }}>
              <TrendingUp size={22} color="#f97316" />
            </div>
            <span className="stat-card-trend trend-up">▲ +8%</span>
          </div>
          <div className="stat-card-value">C${weekTotal.toLocaleString()}</div>
          <div className="stat-card-label">Ventas de la Semana</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-card-icon" style={{ background: '#eff6ff' }}>
              <ShoppingBag size={22} color="#2563eb" />
            </div>
            <span className="stat-card-trend trend-up">▲ +15%</span>
          </div>
          <div className="stat-card-value">C${monthTotal.toLocaleString()}</div>
          <div className="stat-card-label">Ventas del Mes</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-card-icon" style={{ background: '#f5f3ff' }}>
              <Package size={22} color="#7c3aed" />
            </div>
            <span className="stat-card-trend trend-neutral">Total</span>
          </div>
          <div className="stat-card-value">{store.products.length}</div>
          <div className="stat-card-label">Productos Registrados</div>
        </div>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginTop: 0 }}>
        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-card-icon" style={{ background: '#fef2f2' }}>
              <AlertTriangle size={22} color="#ef4444" />
            </div>
          </div>
          <div className="stat-card-value" style={{ color: '#ef4444' }}>{outStock.length}</div>
          <div className="stat-card-label">Productos Agotados</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-card-icon" style={{ background: '#fefce8' }}>
              <AlertTriangle size={22} color="#ca8a04" />
            </div>
          </div>
          <div className="stat-card-value" style={{ color: '#ca8a04' }}>{lowStock.length}</div>
          <div className="stat-card-label">Stock Bajo</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-card-icon" style={{ background: '#f0fdf4' }}>
              <Users size={22} color="#16a34a" />
            </div>
          </div>
          <div className="stat-card-value">{store.clients.length}</div>
          <div className="stat-card-label">Clientes Registrados</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-card-icon" style={{ background: '#fff7ed' }}>
              <Star size={22} color="#f97316" />
            </div>
          </div>
          <div className="stat-card-value" style={{ color: '#f97316' }}>
            C${Math.round(monthTotal * 0.42).toLocaleString()}
          </div>
          <div className="stat-card-label">Ganancias Estimadas</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid-2" style={{ marginBottom: 20 }}>
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <TrendingUp size={18} color="#16a34a" />
              Ventas de la Semana
            </div>
            <span className="badge badge-green">En tiempo real</span>
          </div>
          <div className="card-body">
            <div className="chart-container">
              <Line data={salesChartData} options={chartOptions} />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Star size={18} color="#f97316" />
              Productos Más Vendidos
            </div>
            <span className="badge badge-orange">Top 6</span>
          </div>
          <div className="card-body">
            <div className="chart-container">
              <Doughnut data={topProductsChart} options={doughnutOptions} />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="grid-2">
        {/* Recent Sales */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <ShoppingBag size={18} color="#16a34a" />
              Últimas Ventas
            </div>
            <span className="badge badge-green">{store.sales.length} total</span>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Factura</th>
                  <th>Cliente</th>
                  <th>Total</th>
                  <th>Método</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {recentSales.map(sale => (
                  <tr key={sale.id}>
                    <td><span style={{ fontWeight: 600, color: '#16a34a' }}>{sale.invoiceNumber}</span></td>
                    <td style={{ fontSize: 13 }}>{sale.clientName || 'Cliente General'}</td>
                    <td style={{ fontWeight: 700 }}>C${sale.total}</td>
                    <td>
                      <span className={`badge ${sale.paymentMethod === 'Efectivo' ? 'badge-green' : sale.paymentMethod === 'Tarjeta' ? 'badge-blue' : 'badge-purple'}`}>
                        {sale.paymentMethod}
                      </span>
                    </td>
                    <td><span className="badge badge-green"><CheckCircle size={10} /> {sale.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top products */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Package size={18} color="#16a34a" />
              Rendimiento de Productos
            </div>
          </div>
          <div className="card-body">
            {topProducts.map((p, i) => {
              const maxSold = topProducts[0].unitsSold;
              const pct = Math.round((p.unitsSold / maxSold) * 100);
              const colors = ['#16a34a', '#f97316', '#3b82f6', '#a855f7', '#ec4899', '#eab308'];
              return (
                <div key={p.id} style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 18 }}>{p.image}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>{p.name}</span>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: colors[i] }}>{p.unitsSold} uds</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${pct}%`, background: colors[i] }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

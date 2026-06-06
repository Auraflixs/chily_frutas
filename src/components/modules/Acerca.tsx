
import { Info, Code2, GraduationCap, Users, Star } from 'lucide-react';

export default function Acerca() {
  const team = [
    { name: 'Carlos Eduardo Mendoza López', role: 'Líder de Proyecto / Analista de Sistemas', icon: '👑', contrib: 'Análisis de requerimientos, diseño de base de datos, arquitectura del sistema' },
    { name: 'María Fernanda González Ruiz', role: 'Diseñadora UX/UI / Frontend', icon: '🎨', contrib: 'Diseño de interfaces, prototipado en Figma, experiencia de usuario' },
    { name: 'Luis Alberto Herrera Díaz', role: 'Desarrollador Full Stack', icon: '💻', contrib: 'Desarrollo de módulos, lógica de negocio, integración de componentes' },
    { name: 'Ana Sofía López Morales', role: 'Documentación / QA Tester', icon: '📝', contrib: 'Pruebas del sistema, documentación técnica, manual de usuario' },
  ];

  const features = [
    '✅ Sistema POS completo con carrito de compras',
    '✅ Gestión de inventario con alertas visuales',
    '✅ Control de ingredientes y descuento automático',
    '✅ Módulo de facturación e impresión',
    '✅ Gestión de clientes y historial de compras',
    '✅ Reportes con gráficos interactivos',
    '✅ Control de usuarios con roles y permisos',
    '✅ Dashboard con KPIs en tiempo real',
    '✅ Configuración personalizable del negocio',
    '✅ Registro de actividades y seguridad',
  ];

  const techStack = [
    { name: 'React 18', icon: '⚛️', desc: 'Biblioteca de interfaces' },
    { name: 'TypeScript', icon: '🔷', desc: 'Tipado estático' },
    { name: 'Chart.js', icon: '📊', desc: 'Gráficos interactivos' },
    { name: 'Lucide Icons', icon: '🎯', desc: 'Iconografía' },
    { name: 'Vite', icon: '⚡', desc: 'Bundler moderno' },
    { name: 'Tailwind CSS', icon: '🎨', desc: 'Estilos utilitarios' },
  ];

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <div className="page-header-left">
          <h2>Acerca del Sistema</h2>
          <p>Información del proyecto y equipo de desarrollo</p>
        </div>
      </div>

      {/* System Info */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-body" style={{ padding: 0 }}>
          <div style={{
            background: 'linear-gradient(135deg, #1a2e1a 0%, #16a34a 60%, #22c55e 100%)',
            borderRadius: '12px 12px 0 0',
            padding: '40px 40px 32px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🍓</div>
            <h1 style={{ color: 'white', fontSize: 32, fontWeight: 900, marginBottom: 8, letterSpacing: -1 }}>
              Chily Frutas
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 16, marginBottom: 16 }}>
              Sistema Profesional de Ventas e Inventario
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <span style={{ background: 'rgba(255,255,255,0.15)', padding: '5px 14px', borderRadius: 20, color: 'white', fontSize: 12, fontWeight: 600 }}>
                v1.0.0 — Enero 2025
              </span>
              <span style={{ background: 'rgba(255,255,255,0.15)', padding: '5px 14px', borderRadius: 20, color: 'white', fontSize: 12, fontWeight: 600 }}>
                Uso Académico
              </span>
              <span style={{ background: 'rgba(255,255,255,0.15)', padding: '5px 14px', borderRadius: 20, color: 'white', fontSize: 12, fontWeight: 600 }}>
                Managua, Nicaragua 🇳🇮
              </span>
            </div>
          </div>

          <div style={{ padding: '32px 40px' }}>
            <div className="grid-2">
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1a2e1a', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Info size={18} color="#16a34a" />
                  Descripción del Sistema
                </h3>
                <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.8 }}>
                  <strong>Chily Frutas</strong> es un sistema administrativo completo diseñado para digitalizar y optimizar
                  los procesos operativos de un negocio dedicado a la venta de frutas preparadas, batidos, frescos,
                  ensaladas y productos similares.
                </p>
                <br />
                <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.8 }}>
                  El sistema integra un punto de venta (POS) moderno, control de inventario en tiempo real, gestión de
                  ingredientes con descuento automático, módulo de clientes, reportes analíticos con gráficos interactivos
                  y administración completa de usuarios con roles diferenciados.
                </p>
              </div>

              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1a2e1a', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Star size={18} color="#f97316" />
                  Funcionalidades Implementadas
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {features.map((f, i) => (
                    <div key={i} style={{ fontSize: 13, color: '#374151' }}>{f}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Academic Info */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header">
          <div className="card-title"><GraduationCap size={18} color="#16a34a" /> Información Académica</div>
        </div>
        <div className="card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {[
              { label: 'Asignatura', value: 'Análisis y Diseño de Sistemas', icon: '📚' },
              { label: 'Institución', value: 'Universidad Nacional Autónoma de Nicaragua (UNAN)', icon: '🏛️' },
              { label: 'Carrera', value: 'Ingeniería en Sistemas de Información', icon: '🎓' },
              { label: 'Semestre', value: 'V Semestre — 2025', icon: '📅' },
              { label: 'Docente', value: 'Prof. Dr. Roberto Solís Aguilar', icon: '👨‍🏫' },
              { label: 'Modalidad', value: 'Prototipo Funcional de Alta Fidelidad', icon: '💻' },
            ].map(item => (
              <div key={item.label} style={{ padding: 16, background: '#f8fafc', borderRadius: 10, border: '1px solid #e5e7eb' }}>
                <div style={{ fontSize: 24, marginBottom: 6 }}>{item.icon}</div>
                <div style={{ fontSize: 11, color: '#9ca3af', fontWeight: 600, marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{item.label}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#1a2e1a' }}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header">
          <div className="card-title"><Users size={18} color="#16a34a" /> Equipo de Desarrollo</div>
          <span className="badge badge-green">{team.length} integrantes</span>
        </div>
        <div className="card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
            {team.map((member, i) => (
              <div key={i} style={{ display: 'flex', gap: 14, padding: 16, background: '#f8fafc', borderRadius: 12, border: '1px solid #e5e7eb' }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg,#1a2e1a,#16a34a)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
                  {member.icon}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#1a2e1a', marginBottom: 2 }}>{member.name}</div>
                  <div style={{ fontSize: 11, color: '#f97316', fontWeight: 600, marginBottom: 4 }}>{member.role}</div>
                  <div style={{ fontSize: 11, color: '#9ca3af', lineHeight: 1.5 }}>{member.contrib}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tech Stack */}
      <div className="card">
        <div className="card-header">
          <div className="card-title"><Code2 size={18} color="#16a34a" /> Tecnologías Utilizadas</div>
        </div>
        <div className="card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12 }}>
            {techStack.map(tech => (
              <div key={tech.name} style={{ textAlign: 'center', padding: 14, background: '#f8fafc', borderRadius: 10, border: '1px solid #e5e7eb' }}>
                <div style={{ fontSize: 28, marginBottom: 6 }}>{tech.icon}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#1a2e1a', marginBottom: 2 }}>{tech.name}</div>
                <div style={{ fontSize: 10, color: '#9ca3af' }}>{tech.desc}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 20, padding: 16, background: 'linear-gradient(135deg,#f0fdf4,#dcfce7)', borderRadius: 10, border: '1px solid #bbf7d0', textAlign: 'center' }}>
            <p style={{ fontSize: 13, color: '#16a34a', fontWeight: 600 }}>
              🍓 Chily Frutas Sistema v1.0.0 — Desarrollado con ❤️ para optimizar el negocio
            </p>
            <p style={{ fontSize: 11, color: '#6b7280', marginTop: 4 }}>
              Proyecto académico — Análisis y Diseño de Sistemas — 2025
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

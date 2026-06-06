import { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Phone, Mail, MessageCircle, BookOpen } from 'lucide-react';

export default function Ayuda() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    { q: '¿Cómo registro una nueva venta?', a: 'Ve al módulo de Ventas desde el menú lateral. Busca los productos, agrégalos al carrito haciendo clic, ajusta las cantidades, selecciona el método de pago e ingresa el monto recibido. Finalmente haz clic en "Procesar Venta".' },
    { q: '¿Cómo actualizo el stock de un producto?', a: 'Dirígete al módulo de Inventario. Busca el producto en la tabla y haz clic en el ícono de edición (lápiz). Modifica la cantidad de stock y guarda los cambios.' },
    { q: '¿Cómo agrego un nuevo cliente?', a: 'En el módulo de Clientes, haz clic en el botón "Nuevo Cliente" en la parte superior derecha. Completa el formulario con nombre, teléfono y correo, luego guarda.' },
    { q: '¿Cómo genero un reporte de ventas?', a: 'Accede al módulo de Reportes. Selecciona el período (diario, semanal, mensual o anual), ajusta el rango de fechas si es necesario y podrás visualizar los gráficos y tablas. Usa los botones "Exportar PDF" o "Exportar Excel" para descargar.' },
    { q: '¿Cómo agrego un nuevo usuario?', a: 'Solo los administradores pueden gestionar usuarios. Ve al módulo de Usuarios, haz clic en "Nuevo Usuario" y completa el formulario con nombre, usuario, contraseña y rol.' },
    { q: '¿Qué sucede cuando un ingrediente se agota?', a: 'El sistema muestra alertas visuales en el Dashboard y en el módulo de Ingredientes. Al realizar una venta, el sistema descuenta automáticamente los ingredientes del inventario.' },
    { q: '¿Cómo imprimo una factura?', a: 'Al completar una venta exitosamente, aparece la factura generada. Haz clic en el botón "Imprimir" para imprimir físicamente o descarga el PDF.' },
    { q: '¿Cómo cambio mi contraseña?', a: 'Ve al módulo de Configuración, selecciona la pestaña "Seguridad" y encontrarás la sección para cambiar tu contraseña.' },
  ];

  const guides = [
    { icon: '🛒', title: 'Guía de Ventas', desc: 'Aprende a registrar ventas, manejar el carrito y generar facturas de forma eficiente.' },
    { icon: '📦', title: 'Control de Inventario', desc: 'Gestiona los productos, controla el stock y recibe alertas de reabastecimiento.' },
    { icon: '🌿', title: 'Gestión de Ingredientes', desc: 'Administra los ingredientes y su relación con los productos del menú.' },
    { icon: '📊', title: 'Reportes y Análisis', desc: 'Genera reportes de ventas, ganancias y exporta datos para análisis externos.' },
    { icon: '👥', title: 'Gestión de Usuarios', desc: 'Crea y administra los usuarios del sistema con diferentes niveles de acceso.' },
    { icon: '⚙️', title: 'Configuración', desc: 'Personaliza el sistema: nombre del negocio, moneda, impresión y más.' },
  ];

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <div className="page-header-left">
          <h2>Centro de Ayuda</h2>
          <p>Encuentra respuestas y soporte para usar el sistema</p>
        </div>
      </div>

      {/* Guides */}
      <div className="help-section">
        <h3><BookOpen size={18} color="#16a34a" /> Manual de Usuario — Módulos del Sistema</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {guides.map(g => (
            <div key={g.title} style={{ padding: 16, background: '#f8fafc', borderRadius: 10, border: '1px solid #e5e7eb', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#16a34a')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = '#e5e7eb')}
            >
              <div style={{ fontSize: 28, marginBottom: 8 }}>{g.icon}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#1a2e1a', marginBottom: 4 }}>{g.title}</div>
              <div style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.5 }}>{g.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQs */}
      <div className="help-section">
        <h3><HelpCircle size={18} color="#16a34a" /> Preguntas Frecuentes</h3>
        {faqs.map((faq, i) => (
          <div key={i} className="faq-item">
            <div className="faq-question" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
              <span>{faq.q}</span>
              {openFaq === i ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
            {openFaq === i && (
              <div className="faq-answer animate-slideDown">{faq.a}</div>
            )}
          </div>
        ))}
      </div>

      {/* Support */}
      <div className="help-section">
        <h3><MessageCircle size={18} color="#16a34a" /> Soporte Técnico</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {[
            { icon: <Phone size={24} color="#16a34a" />, title: 'Llamada', desc: 'Lun–Vie 8am–6pm', detail: '+505 8888-0000', bg: '#f0fdf4' },
            { icon: <Mail size={24} color="#3b82f6" />, title: 'Correo Electrónico', desc: 'Respuesta en 24hrs', detail: 'soporte@chilyfrutas.com', bg: '#eff6ff' },
            { icon: <MessageCircle size={24} color="#f97316" />, title: 'Chat en Vivo', desc: 'Disponible ahora', detail: 'Iniciar Chat', bg: '#fff7ed' },
          ].map(s => (
            <div key={s.title} style={{ padding: 20, background: s.bg, borderRadius: 12, textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>{s.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#1a2e1a', marginBottom: 2 }}>{s.title}</div>
              <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 8 }}>{s.desc}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>{s.detail}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="help-section">
        <h3>💡 Consejos y Trucos</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            'Usa la búsqueda en el módulo de ventas para encontrar productos rápidamente durante horas pico.',
            'Configura los stocks mínimos correctamente para recibir alertas antes de que se agoten los productos.',
            'Registra a tus clientes frecuentes para llevar un mejor control de sus compras y fidelización.',
            'Exporta los reportes mensualmente para comparar el rendimiento del negocio.',
            'Revisa diariamente las alertas de ingredientes para garantizar la disponibilidad de los productos.',
            'Usa el módulo de Seguridad para revisar quién accedió al sistema y qué cambios realizó.',
          ].map((tip, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, padding: '12px 16px', background: '#f8fafc', borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 13, color: '#374151', lineHeight: 1.5 }}>
              <span style={{ color: '#16a34a', fontWeight: 800, flexShrink: 0 }}>{i + 1}.</span>
              {tip}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

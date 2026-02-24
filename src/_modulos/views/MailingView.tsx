/* =====================================================
   MailingView — Email Marketing con Resend
   Tabs: Campañas · Suscriptores · Segmentación · A/B · Analíticas
   ===================================================== */
import React, { useState } from 'react';
import { OrangeHeader } from '@/app/components/admin/OrangeHeader';
import type { MainSection } from '@/app/AdminDashboard';
import {
  Mail, Users, TrendingUp, MousePointer, Send, Plus,
  Search, Filter, Eye, Edit2, BarChart2, CheckCircle,
  Clock, XCircle, Pause, Play, Trash2, Star, ChevronRight,
} from 'lucide-react';

const ORANGE = '#FF6835';
interface Props { onNavigate: (s: MainSection) => void; }

type Tab = 'campanas' | 'suscriptores' | 'segmentacion' | 'ab' | 'analiticas';

const campanas = [
  { id: 1, nombre: 'Newsletter Febrero 2026', estado: 'enviada', enviados: 8420, abiertos: 2947, clicks: 834, fecha: '2026-02-20', segmento: 'Todos', color: '#10B981' },
  { id: 2, nombre: 'Oferta San Valentín', estado: 'enviada', enviados: 3200, abiertos: 1536, clicks: 612, fecha: '2026-02-14', segmento: 'VIP', color: '#10B981' },
  { id: 3, nombre: 'Lanzamiento Colección Otoño', estado: 'programada', enviados: 0, abiertos: 0, clicks: 0, fecha: '2026-03-01', segmento: 'Activos', color: '#3B82F6' },
  { id: 4, nombre: 'Recuperación Carrito Abandonado', estado: 'activa', enviados: 1240, abiertos: 372, clicks: 198, fecha: '2026-02-22', segmento: 'Carrito', color: ORANGE },
  { id: 5, nombre: 'Bienvenida Nuevos Suscriptores', estado: 'activa', enviados: 890, abiertos: 712, clicks: 445, fecha: '2026-02-18', segmento: 'Nuevos', color: ORANGE },
  { id: 6, nombre: 'Promoción Fin de Año 2025', estado: 'pausada', enviados: 12000, abiertos: 3600, clicks: 900, fecha: '2025-12-15', segmento: 'Todos', color: '#D97706' },
];

const suscriptores = [
  { id: 1, nombre: 'Ana García', email: 'ana.garcia@email.com', estado: 'activo', segmento: 'VIP', aperturas: 24, clicks: 12, fecha: '2025-08-14', avatar: 'AG', color: ORANGE },
  { id: 2, nombre: 'Carlos Rodríguez', email: 'carlos.r@email.com', estado: 'activo', segmento: 'Regular', aperturas: 8, clicks: 3, fecha: '2025-11-02', avatar: 'CR', color: '#3B82F6' },
  { id: 3, nombre: 'María López', email: 'maria.l@empresa.uy', estado: 'activo', segmento: 'B2B', aperturas: 31, clicks: 18, fecha: '2024-06-20', avatar: 'ML', color: '#8B5CF6' },
  { id: 4, nombre: 'Roberto Fernández', email: 'r.fernandez@corp.com', estado: 'inactivo', segmento: 'Regular', aperturas: 2, clicks: 0, fecha: '2024-03-10', avatar: 'RF', color: '#10B981' },
  { id: 5, nombre: 'Laura Martínez', email: 'laura.m@gmail.com', estado: 'activo', segmento: 'VIP', aperturas: 42, clicks: 27, fecha: '2023-12-05', avatar: 'LM', color: '#EC4899' },
  { id: 6, nombre: 'Diego Pérez', email: 'd.perez@outlook.com', estado: 'baja', segmento: 'Regular', aperturas: 0, clicks: 0, fecha: '2024-07-18', avatar: 'DP', color: '#6B7280' },
];

const segmentos = [
  { nombre: 'Todos los suscriptores', cantidad: 8420, descripcion: 'Lista completa sin filtros', color: '#6B7280', icono: '👥' },
  { nombre: 'VIP', cantidad: 1240, descripcion: 'Clientes con +10 compras o +$5000 gastados', color: '#F59E0B', icono: '⭐' },
  { nombre: 'Activos últimos 30 días', cantidad: 3180, descripcion: 'Abrieron al menos 1 email en 30 días', color: '#10B981', icono: '🟢' },
  { nombre: 'Carrito abandonado', cantidad: 920, descripcion: 'Añadieron al carrito sin comprar', color: ORANGE, icono: '🛒' },
  { nombre: 'Nuevos (últimos 7 días)', cantidad: 214, descripcion: 'Suscriptos en la última semana', color: '#3B82F6', icono: '✨' },
  { nombre: 'B2B / Empresas', cantidad: 340, descripcion: 'Empresas y clientes corporativos', color: '#8B5CF6', icono: '🏢' },
  { nombre: 'Inactivos +90 días', cantidad: 1620, descripcion: 'Sin aperturas en más de 3 meses', color: '#EF4444', icono: '😴' },
];

const abTests = [
  { id: 1, nombre: 'Asunto: Descuento vs Urgencia', estado: 'activo', varianteA: '¡20% OFF solo hoy!', varianteB: 'Quedan pocas unidades 🔥', aA: 34.2, aB: 29.8, ganador: 'A', enviados: 2000 },
  { id: 2, nombre: 'CTA: Botón color', estado: 'completado', varianteA: 'Botón naranja', varianteB: 'Botón verde', aA: 12.4, aB: 15.8, ganador: 'B', enviados: 1500 },
  { id: 3, nombre: 'Hora de envío: Mañana vs Tarde', estado: 'planificado', varianteA: '09:00 AM', varianteB: '06:00 PM', aA: 0, aB: 0, ganador: null, enviados: 0 },
];

const kpis = [
  { label: 'Suscriptores Activos', value: '8.420', change: '+214 esta semana', icon: Users, color: '#3B82F6' },
  { label: 'Tasa de Apertura', value: '35.0%', change: '+2.3% vs mes anterior', icon: Eye, color: '#10B981' },
  { label: 'Tasa de Clicks', value: '9.9%', change: '+0.8% vs mes anterior', icon: MousePointer, color: ORANGE },
  { label: 'Emails Enviados (mes)', value: '48.2K', change: '12 campañas activas', icon: Send, color: '#8B5CF6' },
];

const coloresBar = ['#FF6835', '#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EC4899'];

function StatBadge({ estado }: { estado: string }) {
  const map: Record<string, { bg: string; color: string; label: string }> = {
    enviada: { bg: '#D1FAE5', color: '#059669', label: 'Enviada' },
    programada: { bg: '#DBEAFE', color: '#1D4ED8', label: 'Programada' },
    activa: { bg: `${ORANGE}20`, color: ORANGE, label: 'Activa' },
    pausada: { bg: '#FEF3C7', color: '#D97706', label: 'Pausada' },
  };
  const s = map[estado] ?? { bg: '#F3F4F6', color: '#6B7280', label: estado };
  return (
    <span style={{ fontSize: '0.7rem', fontWeight: '700', backgroundColor: s.bg, color: s.color, padding: '2px 8px', borderRadius: '6px' }}>
      {s.label}
    </span>
  );
}

export function MailingView({ onNavigate }: Props) {
  const [tab, setTab] = useState<Tab>('campanas');
  const [search, setSearch] = useState('');

  const tabs: { id: Tab; label: string }[] = [
    { id: 'campanas', label: '📧 Campañas' },
    { id: 'suscriptores', label: '👥 Suscriptores' },
    { id: 'segmentacion', label: '🎯 Segmentación' },
    { id: 'ab', label: '🔬 A/B Testing' },
    { id: 'analiticas', label: '📊 Analíticas' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', backgroundColor: '#F8F9FA' }}>
      <OrangeHeader
        icon={Mail}
        title="Mailing & Email Marketing"
        subtitle="Campañas con Resend · 8.420 suscriptores activos"
        actions={[
          { label: '← Volver', onClick: () => onNavigate('marketing') },
          { label: '+ Nueva Campaña', primary: true },
        ]}
      />

      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '14px', marginBottom: '22px' }}>
          {kpis.map((k, i) => (
            <div key={i} style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 42, height: 42, borderRadius: '11px', backgroundColor: `${k.color}14`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <k.icon size={20} color={k.color} />
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1A1A2E', lineHeight: 1 }}>{k.value}</div>
                <div style={{ fontSize: '0.72rem', color: '#6C757D', marginTop: 2 }}>{k.label}</div>
                <div style={{ fontSize: '0.7rem', color: k.color, marginTop: 2 }}>{k.change}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: '20px', backgroundColor: '#F3F4F6', padding: '4px', borderRadius: '10px', width: 'fit-content' }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: '7px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '0.82rem', fontWeight: '600',
              backgroundColor: tab === t.id ? '#fff' : 'transparent',
              color: tab === t.id ? '#1A1A2E' : '#6B7280',
              boxShadow: tab === t.id ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
            }}>{t.label}</button>
          ))}
        </div>

        {/* Tab: Campañas */}
        {tab === 'campanas' && (
          <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search size={14} color="#9CA3AF" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar campañas..." style={{ width: '100%', paddingLeft: 30, paddingRight: 12, paddingTop: 7, paddingBottom: 7, border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '0.82rem', outline: 'none' }} />
              </div>
              <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', border: '1px solid #E5E7EB', borderRadius: '8px', backgroundColor: '#F9FAFB', fontSize: '0.82rem', cursor: 'pointer', color: '#374151' }}>
                <Filter size={13} /> Filtros
              </button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#F9FAFB' }}>
                  {['Nombre', 'Segmento', 'Estado', 'Enviados', 'Apertura', 'Clicks', 'Fecha', ''].map((h, i) => (
                    <th key={i} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '0.72rem', fontWeight: '700', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {campanas.filter(c => c.nombre.toLowerCase().includes(search.toLowerCase())).map(c => (
                  <tr key={c.id} style={{ borderTop: '1px solid #F3F4F6' }}>
                    <td style={{ padding: '13px 16px' }}>
                      <div style={{ fontWeight: '600', color: '#1A1A2E', fontSize: '0.85rem' }}>{c.nombre}</div>
                    </td>
                    <td style={{ padding: '13px 16px' }}>
                      <span style={{ fontSize: '0.75rem', backgroundColor: '#F3F4F6', padding: '2px 8px', borderRadius: '6px', color: '#374151' }}>{c.segmento}</span>
                    </td>
                    <td style={{ padding: '13px 16px' }}><StatBadge estado={c.estado} /></td>
                    <td style={{ padding: '13px 16px', fontSize: '0.85rem', color: '#374151' }}>{c.enviados.toLocaleString()}</td>
                    <td style={{ padding: '13px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 50, height: 5, backgroundColor: '#E5E7EB', borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{ width: `${c.enviados ? (c.abiertos / c.enviados) * 100 : 0}%`, height: '100%', backgroundColor: '#10B981', borderRadius: 3 }} />
                        </div>
                        <span style={{ fontSize: '0.82rem', color: '#374151' }}>{c.enviados ? ((c.abiertos / c.enviados) * 100).toFixed(1) : 0}%</span>
                      </div>
                    </td>
                    <td style={{ padding: '13px 16px', fontSize: '0.82rem', color: '#374151' }}>{c.enviados ? ((c.clicks / c.enviados) * 100).toFixed(1) : 0}%</td>
                    <td style={{ padding: '13px 16px', fontSize: '0.8rem', color: '#9CA3AF' }}>{c.fecha}</td>
                    <td style={{ padding: '13px 16px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button style={{ padding: '4px', border: '1px solid #E5E7EB', borderRadius: '6px', backgroundColor: '#F9FAFB', cursor: 'pointer' }}><Eye size={13} color="#6B7280" /></button>
                        <button style={{ padding: '4px', border: '1px solid #E5E7EB', borderRadius: '6px', backgroundColor: '#F9FAFB', cursor: 'pointer' }}><Edit2 size={13} color="#6B7280" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab: Suscriptores */}
        {tab === 'suscriptores' && (
          <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search size={14} color="#9CA3AF" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
                <input placeholder="Buscar suscriptores..." style={{ width: '100%', paddingLeft: 30, paddingRight: 12, paddingTop: 7, paddingBottom: 7, border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '0.82rem', outline: 'none' }} />
              </div>
              <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', border: 'none', borderRadius: '8px', backgroundColor: ORANGE, color: '#fff', fontSize: '0.82rem', cursor: 'pointer', fontWeight: '600' }}>
                <Plus size={14} /> Importar CSV
              </button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#F9FAFB' }}>
                  {['Suscriptor', 'Segmento', 'Estado', 'Aperturas', 'Clicks', 'Desde', ''].map((h, i) => (
                    <th key={i} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '0.72rem', fontWeight: '700', color: '#9CA3AF', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {suscriptores.map(s => (
                  <tr key={s.id} style={{ borderTop: '1px solid #F3F4F6' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 34, height: 34, borderRadius: '50%', backgroundColor: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: '700', color: '#fff', flexShrink: 0 }}>{s.avatar}</div>
                        <div>
                          <div style={{ fontWeight: '600', color: '#1A1A2E', fontSize: '0.85rem' }}>{s.nombre}</div>
                          <div style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>{s.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontSize: '0.75rem', backgroundColor: '#F3F4F6', padding: '2px 8px', borderRadius: '6px', color: '#374151' }}>{s.segmento}</span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: '700', backgroundColor: s.estado === 'activo' ? '#D1FAE5' : s.estado === 'inactivo' ? '#FEF3C7' : '#FEE2E2', color: s.estado === 'activo' ? '#059669' : s.estado === 'inactivo' ? '#D97706' : '#DC2626', padding: '2px 8px', borderRadius: '6px' }}>
                        {s.estado}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '0.85rem', color: '#374151' }}>{s.aperturas}</td>
                    <td style={{ padding: '12px 16px', fontSize: '0.85rem', color: '#374151' }}>{s.clicks}</td>
                    <td style={{ padding: '12px 16px', fontSize: '0.8rem', color: '#9CA3AF' }}>{s.fecha}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <button style={{ padding: '4px', border: '1px solid #E5E7EB', borderRadius: '6px', backgroundColor: '#F9FAFB', cursor: 'pointer' }}><Trash2 size={13} color="#EF4444" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab: Segmentación */}
        {tab === 'segmentacion' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '16px' }}>
            {segmentos.map((s, i) => (
              <div key={i} style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '20px', cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span style={{ fontSize: '1.5rem' }}>{s.icono}</span>
                  <span style={{ fontSize: '1.4rem', fontWeight: '800', color: s.color }}>{s.cantidad.toLocaleString()}</span>
                </div>
                <div style={{ fontWeight: '700', color: '#1A1A2E', marginBottom: 4 }}>{s.nombre}</div>
                <div style={{ fontSize: '0.78rem', color: '#9CA3AF', marginBottom: 12 }}>{s.descripcion}</div>
                <button style={{ width: '100%', padding: '8px', borderRadius: '8px', border: `1px solid ${s.color}`, backgroundColor: `${s.color}10`, color: s.color, fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' }}>
                  Usar en campaña →
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Tab: A/B Testing */}
        {tab === 'ab' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {abTests.map(t => (
              <div key={t.id} style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div>
                    <div style={{ fontWeight: '700', color: '#1A1A2E' }}>{t.nombre}</div>
                    <div style={{ fontSize: '0.78rem', color: '#9CA3AF' }}>{t.enviados.toLocaleString()} enviados</div>
                  </div>
                  <span style={{ fontSize: '0.72rem', fontWeight: '700', padding: '3px 10px', borderRadius: '6px', backgroundColor: t.estado === 'activo' ? `${ORANGE}20` : t.estado === 'completado' ? '#D1FAE5' : '#DBEAFE', color: t.estado === 'activo' ? ORANGE : t.estado === 'completado' ? '#059669' : '#1D4ED8' }}>
                    {t.estado}
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  {[
                    { label: 'Variante A', valor: t.varianteA, apertura: t.aA, ganador: t.ganador === 'A' },
                    { label: 'Variante B', valor: t.varianteB, apertura: t.aB, ganador: t.ganador === 'B' },
                  ].map((v, i) => (
                    <div key={i} style={{ padding: '14px', borderRadius: '10px', border: `2px solid ${v.ganador ? '#10B981' : '#E5E7EB'}`, backgroundColor: v.ganador ? '#F0FDF4' : '#F9FAFB' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                        <span style={{ fontWeight: '700', color: v.ganador ? '#059669' : '#374151' }}>{v.label}</span>
                        {v.ganador && <span style={{ fontSize: '0.68rem', fontWeight: '700', color: '#059669', backgroundColor: '#D1FAE5', padding: '1px 6px', borderRadius: '4px' }}>✓ GANADOR</span>}
                      </div>
                      <div style={{ fontSize: '0.83rem', color: '#374151', marginBottom: 8 }}>{v.valor}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ flex: 1, height: 8, backgroundColor: '#E5E7EB', borderRadius: 4, overflow: 'hidden' }}>
                          <div style={{ width: `${v.apertura}%`, height: '100%', backgroundColor: v.ganador ? '#10B981' : ORANGE, borderRadius: 4 }} />
                        </div>
                        <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1A1A2E' }}>{v.apertura}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab: Analíticas */}
        {tab === 'analiticas' && (
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
            <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '20px' }}>
              <div style={{ fontWeight: '700', color: '#1A1A2E', marginBottom: 20 }}>Rendimiento últimas 6 campañas</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {campanas.slice(0, 5).map((c, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ fontSize: '0.78rem', color: '#374151', width: 180, flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.nombre}</div>
                    <div style={{ flex: 1, height: 10, backgroundColor: '#F3F4F6', borderRadius: 5, overflow: 'hidden' }}>
                      <div style={{ width: `${c.enviados ? (c.abiertos / c.enviados) * 100 : 0}%`, height: '100%', backgroundColor: coloresBar[i], borderRadius: 5 }} />
                    </div>
                    <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#374151', width: 40, textAlign: 'right' }}>
                      {c.enviados ? ((c.abiertos / c.enviados) * 100).toFixed(0) : 0}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { label: 'Mejor horario de apertura', value: '10:00 - 11:00 AM', icon: '⏰', color: '#3B82F6' },
                { label: 'Dispositivo principal', value: 'Mobile 68%', icon: '📱', color: '#8B5CF6' },
                { label: 'Tasa de baja promedio', value: '0.4%', icon: '📉', color: '#10B981' },
                { label: 'ROI estimado', value: '$3.2 por $1', icon: '💰', color: ORANGE },
              ].map((m, i) => (
                <div key={i} style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: '1.5rem' }}>{m.icon}</span>
                  <div>
                    <div style={{ fontWeight: '700', color: '#1A1A2E', fontSize: '0.95rem' }}>{m.value}</div>
                    <div style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>{m.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

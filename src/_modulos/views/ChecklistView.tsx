/* =====================================================
   ChecklistView — Roadmap & Estado del Proyecto
   ===================================================== */
import React, { useState } from 'react';
import { OrangeHeader } from '@/app/components/admin/OrangeHeader';
import type { MainSection } from '@/app/AdminDashboard';
import {
  CheckSquare, CheckCircle, Clock, Circle, AlertCircle,
  Download, Filter, BarChart2, Layers, TrendingUp, Zap,
} from 'lucide-react';

const ORANGE = '#FF6835';
interface Props { onNavigate: (s: MainSection) => void; }

type Estado = 'done' | 'progress' | 'pending' | 'blocked';

interface Modulo {
  id: string;
  nombre: string;
  categoria: string;
  estado: Estado;
  pct: number;
  prioridad: 'alta' | 'media' | 'baja';
  responsable: string;
  nota?: string;
}

const modulos: Modulo[] = [
  { id: 'm1', nombre: 'AdminDashboard (Shell)', categoria: 'Sistema', estado: 'done', pct: 100, prioridad: 'alta', responsable: 'Charlie', nota: 'Sidebar + routing completos' },
  { id: 'm2', nombre: 'DashboardView (KPIs + Charts)', categoria: 'Dashboard', estado: 'done', pct: 100, prioridad: 'alta', responsable: 'Charlie' },
  { id: 'm3', nombre: 'EcommerceView (Hub)', categoria: 'eCommerce', estado: 'done', pct: 100, prioridad: 'alta', responsable: 'Charlie' },
  { id: 'm4', nombre: 'GestionView (Hub ERP)', categoria: 'Gestión', estado: 'done', pct: 100, prioridad: 'alta', responsable: 'Charlie' },
  { id: 'm5', nombre: 'MarketingView (Hub)', categoria: 'Marketing', estado: 'done', pct: 100, prioridad: 'media', responsable: 'Charlie' },
  { id: 'm6', nombre: 'LogisticaView (Hub)', categoria: 'Logística', estado: 'done', pct: 100, prioridad: 'alta', responsable: 'Charlie' },
  { id: 'm7', nombre: 'RRSSHubView', categoria: 'RRSS', estado: 'done', pct: 100, prioridad: 'media', responsable: 'Charlie' },
  { id: 'm8', nombre: 'IntegracionesView (Hub)', categoria: 'Integraciones', estado: 'done', pct: 100, prioridad: 'media', responsable: 'Charlie' },
  { id: 'm9', nombre: 'AuditoriaHubView', categoria: 'Auditoría', estado: 'done', pct: 100, prioridad: 'media', responsable: 'Charlie' },
  { id: 'm10', nombre: 'SistemaView (Hub)', categoria: 'Sistema', estado: 'done', pct: 100, prioridad: 'alta', responsable: 'Charlie' },
  { id: 'm11', nombre: 'HerramientasView (Hub)', categoria: 'Herramientas', estado: 'done', pct: 100, prioridad: 'media', responsable: 'Charlie' },
  { id: 'm12', nombre: 'ClientesView (tabla full)', categoria: 'eCommerce', estado: 'done', pct: 100, prioridad: 'alta', responsable: 'Charlie' },
  { id: 'm13', nombre: 'ERPInventarioView (tabla)', categoria: 'Gestión', estado: 'done', pct: 100, prioridad: 'alta', responsable: 'Charlie' },
  { id: 'm14', nombre: 'ERPCRMView (Kanban)', categoria: 'Gestión', estado: 'done', pct: 100, prioridad: 'alta', responsable: 'Charlie' },
  { id: 'm15', nombre: 'ProyectosView (Kanban)', categoria: 'Gestión', estado: 'done', pct: 100, prioridad: 'alta', responsable: 'Charlie' },
  { id: 'm16', nombre: 'MetaBusinessView (dashboard)', categoria: 'RRSS', estado: 'done', pct: 100, prioridad: 'alta', responsable: 'Charlie' },
  { id: 'm17', nombre: 'ERPFacturacionView (tabla)', categoria: 'Gestión', estado: 'done', pct: 100, prioridad: 'media', responsable: 'Charlie' },
  { id: 'm18', nombre: 'ERPRRHHView (tabla)', categoria: 'Gestión', estado: 'done', pct: 100, prioridad: 'media', responsable: 'Charlie' },
  { id: 'm19', nombre: 'PedidosView (árbol madre→hijos)', categoria: 'eCommerce', estado: 'done', pct: 100, prioridad: 'alta', responsable: 'Charlie' },
  { id: 'm20', nombre: 'POSView (terminal caja)', categoria: 'Gestión', estado: 'progress', pct: 60, prioridad: 'alta', responsable: 'Charlie', nota: 'En desarrollo activo' },
  { id: 'm21', nombre: 'QrGeneratorView', categoria: 'Herramientas', estado: 'progress', pct: 40, prioridad: 'media', responsable: 'Charlie' },
  { id: 'm22', nombre: 'FulfillmentView (picking)', categoria: 'Logística', estado: 'progress', pct: 30, prioridad: 'media', responsable: 'Charlie' },
  { id: 'm23', nombre: 'ERPComprasView (OC)', categoria: 'Gestión', estado: 'pending', pct: 0, prioridad: 'media', responsable: 'Charlie' },
  { id: 'm24', nombre: 'ERPContabilidadView', categoria: 'Gestión', estado: 'pending', pct: 0, prioridad: 'baja', responsable: 'Charlie', nota: 'Próxima versión' },
  { id: 'm25', nombre: 'MailingView (Resend)', categoria: 'Marketing', estado: 'pending', pct: 0, prioridad: 'media', responsable: 'Charlie' },
  { id: 'm26', nombre: 'GoogleAdsView', categoria: 'Marketing', estado: 'pending', pct: 0, prioridad: 'media', responsable: 'Charlie' },
  { id: 'm27', nombre: 'RepositorioAPIsView', categoria: 'Integraciones', estado: 'pending', pct: 0, prioridad: 'baja', responsable: 'Charlie' },
  { id: 'm28', nombre: 'HealthMonitorView', categoria: 'Auditoría', estado: 'pending', pct: 0, prioridad: 'media', responsable: 'Charlie' },
  { id: 'm29', nombre: 'Supabase Edge Functions', categoria: 'Backend', estado: 'blocked', pct: 10, prioridad: 'alta', responsable: 'Charlie', nota: 'Requiere conexión Supabase' },
  { id: 'm30', nombre: 'Auth (Login/Registro)', categoria: 'Sistema', estado: 'blocked', pct: 5, prioridad: 'alta', responsable: 'Charlie', nota: 'Requiere Supabase Auth' },
];

const estadoConfig: Record<Estado, { label: string; color: string; bg: string; icon: typeof CheckCircle }> = {
  done: { label: 'Completado', color: '#059669', bg: '#D1FAE5', icon: CheckCircle },
  progress: { label: 'En progreso', color: ORANGE, bg: '#FFF0EB', icon: Clock },
  pending: { label: 'Pendiente', color: '#6B7280', bg: '#F3F4F6', icon: Circle },
  blocked: { label: 'Bloqueado', color: '#DC2626', bg: '#FEE2E2', icon: AlertCircle },
};

const prioColors: Record<string, string> = { alta: '#DC2626', media: '#D97706', baja: '#6B7280' };
const categorias = ['Todos', ...Array.from(new Set(modulos.map(m => m.categoria)))];

export function ChecklistView({ onNavigate }: Props) {
  const [catFilter, setCatFilter] = useState('Todos');
  const [estadoFilter, setEstadoFilter] = useState('Todos');

  const done = modulos.filter(m => m.estado === 'done').length;
  const progress = modulos.filter(m => m.estado === 'progress').length;
  const pending = modulos.filter(m => m.estado === 'pending').length;
  const blocked = modulos.filter(m => m.estado === 'blocked').length;
  const total = modulos.length;
  const pctGlobal = Math.round((done / total) * 100);

  const filtered = modulos.filter(m => {
    const matchCat = catFilter === 'Todos' || m.categoria === catFilter;
    const matchEstado = estadoFilter === 'Todos' || m.estado === estadoFilter;
    return matchCat && matchEstado;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', backgroundColor: '#F8F9FA' }}>
      <OrangeHeader
        icon={CheckSquare}
        title="Checklist & Roadmap"
        subtitle="Estado del proyecto v1.5 · Progreso por módulo"
        actions={[
          { label: '← Volver', onClick: () => onNavigate('auditoria') },
          { label: '↓ Exportar', primary: false },
        ]}
      />

      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>

        {/* Progreso global */}
        <div style={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #E5E7EB', padding: '24px 28px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800', color: '#111827' }}>Progreso Global del Proyecto</h2>
              <p style={{ margin: '3px 0 0', fontSize: '0.8rem', color: '#6B7280' }}>Charlie Marketplace Builder v1.5 · {total} módulos totales</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: 0, fontSize: '2.5rem', fontWeight: '900', color: ORANGE, lineHeight: 1 }}>{pctGlobal}%</p>
              <p style={{ margin: '2px 0 0', fontSize: '0.72rem', color: '#9CA3AF' }}>completado</p>
            </div>
          </div>
          <div style={{ height: 12, backgroundColor: '#F3F4F6', borderRadius: '6px', overflow: 'hidden', marginBottom: '16px' }}>
            <div style={{ width: `${pctGlobal}%`, height: '100%', background: `linear-gradient(90deg, ${ORANGE}, #ff8c42)`, borderRadius: '6px', transition: 'width 0.6s ease' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
            {[
              { label: 'Completados', value: done, color: '#059669', bg: '#D1FAE5' },
              { label: 'En progreso', value: progress, color: ORANGE, bg: '#FFF0EB' },
              { label: 'Pendientes', value: pending, color: '#6B7280', bg: '#F3F4F6' },
              { label: 'Bloqueados', value: blocked, color: '#DC2626', bg: '#FEE2E2' },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '12px', backgroundColor: s.bg, borderRadius: '10px' }}>
                <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: '800', color: s.color }}>{s.value}</p>
                <p style={{ margin: '2px 0 0', fontSize: '0.72rem', color: s.color, fontWeight: '600' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Filtros */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <select
            value={catFilter}
            onChange={e => setCatFilter(e.target.value)}
            style={{ padding: '7px 12px', borderRadius: '9px', border: '1px solid #E5E7EB', fontSize: '0.82rem', color: '#374151', backgroundColor: '#fff', outline: 'none' }}
          >
            {categorias.map(c => <option key={c}>{c}</option>)}
          </select>
          <div style={{ display: 'flex', gap: 6 }}>
            {(['Todos', 'done', 'progress', 'pending', 'blocked'] as const).map(e => (
              <button
                key={e}
                onClick={() => setEstadoFilter(e)}
                style={{
                  padding: '7px 12px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: '600',
                  border: estadoFilter === e ? 'none' : '1px solid #E5E7EB',
                  backgroundColor: estadoFilter === e ? ORANGE : '#fff',
                  color: estadoFilter === e ? '#fff' : '#6B7280', cursor: 'pointer',
                }}
              >
                {e === 'Todos' ? 'Todos' : estadoConfig[e]?.label || e}
              </button>
            ))}
          </div>
          <div style={{ flex: 1 }} />
          <span style={{ fontSize: '0.78rem', color: '#9CA3AF', alignSelf: 'center' }}>{filtered.length} módulos</span>
        </div>

        {/* Lista de módulos */}
        <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
          {filtered.map((m, i) => {
            const ec = estadoConfig[m.estado];
            const Icon = ec.icon;
            return (
              <div key={m.id} style={{
                display: 'flex', alignItems: 'center', gap: '14px',
                padding: '14px 20px',
                borderBottom: i < filtered.length - 1 ? '1px solid #F3F4F6' : 'none',
                transition: 'background 0.1s',
              }}
                onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.backgroundColor = '#F9FAFB'}
                onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.backgroundColor = ''}
              >
                <Icon size={18} color={ec.color} strokeWidth={2} style={{ flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: '700', color: '#1F2937' }}>{m.nombre}</p>
                    <span style={{ fontSize: '0.65rem', backgroundColor: '#F3F4F6', color: '#6B7280', padding: '1px 7px', borderRadius: '4px', fontWeight: '600' }}>{m.categoria}</span>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: prioColors[m.prioridad] }} title={`Prioridad ${m.prioridad}`} />
                  </div>
                  {m.nota && (
                    <p style={{ margin: '2px 0 0', fontSize: '0.72rem', color: '#9CA3AF' }}>💬 {m.nota}</p>
                  )}
                </div>
                {/* Progress bar */}
                {m.pct > 0 && m.pct < 100 && (
                  <div style={{ width: 80, flexShrink: 0 }}>
                    <div style={{ height: 5, backgroundColor: '#F3F4F6', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${m.pct}%`, height: '100%', backgroundColor: ORANGE, borderRadius: '3px' }} />
                    </div>
                    <p style={{ margin: '2px 0 0', fontSize: '0.65rem', color: '#9CA3AF', textAlign: 'right' }}>{m.pct}%</p>
                  </div>
                )}
                <span style={{ fontSize: '0.7rem', fontWeight: '700', color: ec.color, backgroundColor: ec.bg, padding: '3px 9px', borderRadius: '6px', flexShrink: 0 }}>
                  {ec.label}
                </span>
                <span style={{ fontSize: '0.7rem', color: '#9CA3AF', flexShrink: 0, minWidth: 60, textAlign: 'right' }}>{m.responsable}</span>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}

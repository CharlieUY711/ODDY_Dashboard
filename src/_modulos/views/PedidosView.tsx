/* =====================================================
   PedidosView — Gestión Integral de Pedidos
   Árbol madre → hijos · Flujo de estados · Documentos
   ===================================================== */
import React, { useState } from 'react';
import { OrangeHeader } from '@/app/components/admin/OrangeHeader';
import type { MainSection } from '@/app/AdminDashboard';
import {
  ShoppingCart, Package, Truck, CheckCircle, Clock,
  AlertCircle, XCircle, Search, Filter, ChevronDown,
  ChevronRight, Eye, FileText, Download, MoreHorizontal,
  DollarSign, MapPin, User, Calendar, ArrowRight,
  Plus, RefreshCw, Tag, Circle,
} from 'lucide-react';

const ORANGE = '#FF6835';
interface Props { onNavigate: (s: MainSection) => void; }

/* ── Tipos ────────────────────────────────────────── */
type EstadoPedido =
  | 'nuevo' | 'confirmado' | 'preparando'
  | 'enviado' | 'entregado' | 'cancelado' | 'devolucion';

interface PedidoHijo {
  id: string;
  tipo: 'envio' | 'retiro' | 'devolucion';
  transportista: string;
  tracking?: string;
  estado: EstadoPedido;
  items: number;
  monto: number;
  fecha: string;
  destino: string;
}

interface PedidoMadre {
  id: string;
  cliente: string;
  email: string;
  avatar: string;
  color: string;
  fecha: string;
  estado: EstadoPedido;
  total: number;
  items: number;
  canal: string;
  metodoPago: string;
  hijos: PedidoHijo[];
}

/* ── Mock data ───────────────────────────────────── */
const pedidos: PedidoMadre[] = [
  {
    id: 'ORD-8841', cliente: 'Ana García', email: 'ana.garcia@email.com', avatar: 'AG', color: ORANGE,
    fecha: '2026-02-24', estado: 'preparando', total: 18450, items: 5, canal: 'Web', metodoPago: 'Tarjeta Visa',
    hijos: [
      { id: 'ENV-8841-A', tipo: 'envio', transportista: 'OCA', tracking: 'OCA9823712', estado: 'preparando', items: 3, monto: 12300, fecha: '2026-02-24', destino: 'Montevideo' },
      { id: 'ENV-8841-B', tipo: 'envio', transportista: 'Correo UY', tracking: undefined, estado: 'nuevo', items: 2, monto: 6150, fecha: '2026-02-24', destino: 'Canelones' },
    ],
  },
  {
    id: 'ORD-8840', cliente: 'Carlos Rodríguez', email: 'carlos.r@email.com', avatar: 'CR', color: '#3B82F6',
    fecha: '2026-02-24', estado: 'enviado', total: 3240, items: 2, canal: 'App', metodoPago: 'MercadoPago',
    hijos: [
      { id: 'ENV-8840-A', tipo: 'envio', transportista: 'Brixo', tracking: 'BX445512', estado: 'enviado', items: 2, monto: 3240, fecha: '2026-02-23', destino: 'Canelones' },
    ],
  },
  {
    id: 'ORD-8839', cliente: 'María López', email: 'maria.l@empresa.uy', avatar: 'ML', color: '#8B5CF6',
    fecha: '2026-02-23', estado: 'entregado', total: 42100, items: 9, canal: 'Web', metodoPago: 'Transferencia',
    hijos: [
      { id: 'ENV-8839-A', tipo: 'envio', transportista: 'OCA', tracking: 'OCA9820100', estado: 'entregado', items: 5, monto: 24500, fecha: '2026-02-22', destino: 'Montevideo' },
      { id: 'ENV-8839-B', tipo: 'envio', transportista: 'OCA', tracking: 'OCA9820101', estado: 'entregado', items: 4, monto: 17600, fecha: '2026-02-22', destino: 'Montevideo' },
    ],
  },
  {
    id: 'ORD-8838', cliente: 'Roberto Fernández', email: 'r.fernandez@corp.com', avatar: 'RF', color: '#10B981',
    fecha: '2026-02-23', estado: 'confirmado', total: 28900, items: 6, canal: 'POS', metodoPago: 'Efectivo',
    hijos: [
      { id: 'RET-8838-A', tipo: 'retiro', transportista: 'Retiro en sucursal', tracking: undefined, estado: 'confirmado', items: 6, monto: 28900, fecha: '2026-02-24', destino: 'Sucursal Mvd' },
    ],
  },
  {
    id: 'ORD-8837', cliente: 'Juan Pérez', email: 'jperez@gmail.com', avatar: 'JP', color: '#EC4899',
    fecha: '2026-02-22', estado: 'devolucion', total: 580, items: 1, canal: 'Web', metodoPago: 'Tarjeta Visa',
    hijos: [
      { id: 'DEV-8837-A', tipo: 'devolucion', transportista: 'Correo UY', tracking: 'CUY998231', estado: 'devolucion', items: 1, monto: 580, fecha: '2026-02-23', destino: 'Depósito central' },
    ],
  },
  {
    id: 'ORD-8836', cliente: 'Sofía Martínez', email: 'sofia.m@email.com', avatar: 'SM', color: '#F59E0B',
    fecha: '2026-02-22', estado: 'cancelado', total: 2100, items: 3, canal: 'App', metodoPago: 'MercadoPago',
    hijos: [],
  },
  {
    id: 'ORD-8835', cliente: 'Valentina Torres', email: 'v.torres@empresa.com', avatar: 'VT', color: '#0EA5E9',
    fecha: '2026-02-21', estado: 'entregado', total: 15800, items: 4, canal: 'Web', metodoPago: 'Tarjeta Master',
    hijos: [
      { id: 'ENV-8835-A', tipo: 'envio', transportista: 'Mosca', tracking: 'MSC778123', estado: 'entregado', items: 4, monto: 15800, fecha: '2026-02-20', destino: 'Montevideo' },
    ],
  },
];

/* ── Config de estados ───────────────────────────── */
const estadoCfg: Record<EstadoPedido, { label: string; color: string; bg: string; icon: typeof CheckCircle }> = {
  nuevo:      { label: 'Nuevo',      color: '#6B7280', bg: '#F3F4F6',  icon: Circle     },
  confirmado: { label: 'Confirmado', color: '#3B82F6', bg: '#EFF6FF',  icon: CheckCircle },
  preparando: { label: 'Preparando', color: '#D97706', bg: '#FEF3C7',  icon: Package     },
  enviado:    { label: 'Enviado',    color: ORANGE,    bg: '#FFF0EB',  icon: Truck       },
  entregado:  { label: 'Entregado', color: '#059669', bg: '#D1FAE5',  icon: CheckCircle },
  cancelado:  { label: 'Cancelado', color: '#DC2626', bg: '#FEE2E2',  icon: XCircle     },
  devolucion: { label: 'Devolución', color: '#7C3AED', bg: '#F5F3FF', icon: RefreshCw   },
};

const tipoHijoCfg = {
  envio:     { label: 'Envío', color: ORANGE },
  retiro:    { label: 'Retiro', color: '#3B82F6' },
  devolucion:{ label: 'Devolución', color: '#7C3AED' },
};

/* ── Flujo de estados (stepper) ──────────────────── */
const FLUJO: EstadoPedido[] = ['nuevo', 'confirmado', 'preparando', 'enviado', 'entregado'];

function EstadoStepper({ estado }: { estado: EstadoPedido }) {
  if (estado === 'cancelado' || estado === 'devolucion') {
    const cfg = estadoCfg[estado];
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: '8px', backgroundColor: cfg.bg }}>
        <cfg.icon size={14} color={cfg.color} />
        <span style={{ fontSize: '0.78rem', fontWeight: '700', color: cfg.color }}>{cfg.label}</span>
      </div>
    );
  }
  const currentIdx = FLUJO.indexOf(estado);
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {FLUJO.map((e, i) => {
        const cfg = estadoCfg[e];
        const done = i < currentIdx;
        const active = i === currentIdx;
        const pending = i > currentIdx;
        return (
          <div key={e} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{
              width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
              backgroundColor: done ? '#10B981' : active ? ORANGE : '#E5E7EB',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: active ? `2px solid ${ORANGE}` : 'none',
            }}>
              {done
                ? <CheckCircle size={13} color="#fff" />
                : <span style={{ fontSize: '0.55rem', fontWeight: '800', color: pending ? '#9CA3AF' : '#fff' }}>{i + 1}</span>
              }
            </div>
            {i < FLUJO.length - 1 && (
              <div style={{ height: 2, width: 14, backgroundColor: done ? '#10B981' : '#E5E7EB', flexShrink: 0 }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ── Fila de hijo ────────────────────────────────── */
function FilaHijo({ hijo }: { hijo: PedidoHijo }) {
  const cfg = estadoCfg[hijo.estado];
  const tipoCfg = tipoHijoCfg[hijo.tipo];
  const Icon = cfg.icon;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '10px 16px 10px 44px',
      backgroundColor: '#F9FAFB',
      borderTop: '1px solid #F0F0F0',
    }}>
      {/* Conector visual */}
      <div style={{ width: 16, height: 16, borderLeft: '2px dashed #D1D5DB', borderBottom: '2px dashed #D1D5DB', borderRadius: '0 0 0 6px', flexShrink: 0 }} />

      <span style={{ fontSize: '0.72rem', fontWeight: '700', color: tipoCfg.color, backgroundColor: `${tipoCfg.color}14`, padding: '2px 8px', borderRadius: '5px', flexShrink: 0 }}>
        {tipoCfg.label}
      </span>
      <span style={{ fontSize: '0.8rem', fontFamily: 'monospace', color: '#374151', fontWeight: '600', flexShrink: 0 }}>{hijo.id}</span>
      <span style={{ fontSize: '0.78rem', color: '#6B7280', display: 'flex', alignItems: 'center', gap: 3, flexShrink: 0 }}>
        <Truck size={11} color="#9CA3AF" /> {hijo.transportista}
      </span>
      {hijo.tracking && (
        <span style={{ fontSize: '0.72rem', fontFamily: 'monospace', color: '#9CA3AF', backgroundColor: '#F3F4F6', padding: '1px 6px', borderRadius: '4px' }}>
          {hijo.tracking}
        </span>
      )}
      <span style={{ fontSize: '0.75rem', color: '#9CA3AF', display: 'flex', alignItems: 'center', gap: 3 }}>
        <MapPin size={11} /> {hijo.destino}
      </span>
      <div style={{ flex: 1 }} />
      <span style={{ fontSize: '0.78rem', color: '#6B7280' }}>{hijo.items} ítem{hijo.items > 1 ? 's' : ''}</span>
      <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1F2937' }}>${hijo.monto.toLocaleString()}</span>
      <span style={{ fontSize: '0.7rem', fontWeight: '700', color: cfg.color, backgroundColor: cfg.bg, padding: '2px 8px', borderRadius: '5px' }}>
        {cfg.label}
      </span>
      <button style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #E5E7EB', backgroundColor: '#fff', color: '#6B7280', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3, fontSize: '0.72rem' }}>
        <Eye size={11} /> Ver
      </button>
    </div>
  );
}

/* ── Fila madre (expandible) ─────────────────────── */
function FilaMadre({ pedido }: { pedido: PedidoMadre }) {
  const [open, setOpen] = useState(false);
  const cfg = estadoCfg[pedido.estado];

  return (
    <div style={{ borderBottom: '1px solid #E5E7EB' }}>
      {/* Fila madre */}
      <div
        style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', cursor: 'pointer', transition: 'background 0.1s' }}
        onClick={() => pedido.hijos.length > 0 && setOpen(o => !o)}
        onMouseEnter={e => { if (!open) (e.currentTarget as HTMLDivElement).style.backgroundColor = '#F9FAFB'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.backgroundColor = ''; }}
      >
        {/* Toggle */}
        <div style={{ width: 20, flexShrink: 0, display: 'flex', justifyContent: 'center' }}>
          {pedido.hijos.length > 0
            ? open
              ? <ChevronDown size={15} color="#6B7280" />
              : <ChevronRight size={15} color="#6B7280" />
            : <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#E5E7EB' }} />
          }
        </div>

        {/* Avatar + nombre */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 180 }}>
          <div style={{ width: 34, height: 34, borderRadius: '50%', backgroundColor: pedido.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontSize: '0.62rem', fontWeight: '800', color: '#fff' }}>{pedido.avatar}</span>
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '0.84rem', fontWeight: '700', color: '#1F2937' }}>{pedido.cliente}</p>
            <p style={{ margin: 0, fontSize: '0.68rem', color: '#9CA3AF' }}>{pedido.email}</p>
          </div>
        </div>

        {/* Nº pedido */}
        <span style={{ fontSize: '0.85rem', fontFamily: 'monospace', fontWeight: '700', color: '#374151', minWidth: 100 }}>{pedido.id}</span>

        {/* Fecha */}
        <span style={{ fontSize: '0.78rem', color: '#9CA3AF', minWidth: 90, display: 'flex', alignItems: 'center', gap: 3 }}>
          <Calendar size={11} /> {pedido.fecha}
        </span>

        {/* Canal + pago */}
        <div style={{ minWidth: 130 }}>
          <span style={{ fontSize: '0.72rem', color: '#6B7280', backgroundColor: '#F3F4F6', padding: '2px 7px', borderRadius: '4px', marginRight: 4 }}>{pedido.canal}</span>
          <span style={{ fontSize: '0.72rem', color: '#6B7280' }}>{pedido.metodoPago}</span>
        </div>

        {/* Stepper */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <EstadoStepper estado={pedido.estado} />
        </div>

        {/* Hijos count */}
        {pedido.hijos.length > 0 && (
          <span style={{ fontSize: '0.72rem', color: ORANGE, backgroundColor: `${ORANGE}12`, padding: '2px 8px', borderRadius: '5px', fontWeight: '700', flexShrink: 0 }}>
            {pedido.hijos.length} envío{pedido.hijos.length > 1 ? 's' : ''}
          </span>
        )}

        {/* Total */}
        <span style={{ fontSize: '0.95rem', fontWeight: '800', color: '#111827', minWidth: 90, textAlign: 'right' }}>
          ${pedido.total.toLocaleString()}
        </span>

        {/* Acciones */}
        <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
          <button onClick={e => e.stopPropagation()} style={{ padding: '5px 9px', borderRadius: '7px', border: '1px solid #E5E7EB', backgroundColor: '#fff', color: '#6B7280', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <Eye size={13} />
          </button>
          <button onClick={e => e.stopPropagation()} style={{ padding: '5px 9px', borderRadius: '7px', border: '1px solid #E5E7EB', backgroundColor: '#fff', color: '#6B7280', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <FileText size={13} />
          </button>
          <button onClick={e => e.stopPropagation()} style={{ padding: '5px 9px', borderRadius: '7px', border: '1px solid #E5E7EB', backgroundColor: '#fff', color: '#6B7280', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <MoreHorizontal size={13} />
          </button>
        </div>
      </div>

      {/* Filas hijas */}
      {open && pedido.hijos.map(h => <FilaHijo key={h.id} hijo={h} />)}
    </div>
  );
}

/* ── Vista principal ─────────────────────────────── */
export function PedidosView({ onNavigate }: Props) {
  const [search, setSearch] = useState('');
  const [estadoFilter, setEstadoFilter] = useState<string>('Todos');
  const [canalFilter, setCanalFilter] = useState('Todos');

  const kpis = [
    { label: 'Total Pedidos', value: pedidos.length.toString(), icon: ShoppingCart, color: '#3B82F6', sub: 'este período' },
    { label: 'En Preparación', value: pedidos.filter(p => p.estado === 'preparando').length.toString(), icon: Package, color: '#D97706', sub: 'activos ahora' },
    { label: 'En Tránsito',    value: pedidos.filter(p => p.estado === 'enviado').length.toString(), icon: Truck, color: ORANGE, sub: 'en camino' },
    { label: 'Entregados',     value: pedidos.filter(p => p.estado === 'entregado').length.toString(), icon: CheckCircle, color: '#10B981', sub: 'completados' },
  ];

  const filtered = pedidos.filter(p => {
    const matchSearch = p.id.toLowerCase().includes(search.toLowerCase())
      || p.cliente.toLowerCase().includes(search.toLowerCase())
      || p.email.toLowerCase().includes(search.toLowerCase());
    const matchEstado = estadoFilter === 'Todos' || p.estado === estadoFilter;
    const matchCanal = canalFilter === 'Todos' || p.canal === canalFilter;
    return matchSearch && matchEstado && matchCanal;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', backgroundColor: '#F8F9FA' }}>
      <OrangeHeader
        icon={ShoppingCart}
        title="Pedidos"
        subtitle="Árbol madre → hijos · Flujo de estados · Seguimiento integral"
        actions={[
          { label: '← Volver', onClick: () => onNavigate('ecommerce') },
          { label: '+ Nuevo Pedido', primary: true },
        ]}
      />

      <div style={{ flex: 1, overflowY: 'auto', padding: '22px 28px' }}>

        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '20px' }}>
          {kpis.map((k, i) => (
            <div key={i} style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 42, height: 42, borderRadius: '11px', backgroundColor: `${k.color}14`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <k.icon size={20} color={k.color} strokeWidth={2} />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '0.72rem', color: '#6B7280' }}>{k.label}</p>
                <p style={{ margin: 0, fontSize: '1.7rem', fontWeight: '800', color: '#111827', lineHeight: 1 }}>{k.value}</p>
                <p style={{ margin: '1px 0 0', fontSize: '0.68rem', color: '#9CA3AF' }}>{k.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Leyenda del flujo */}
        <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '12px 20px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em', marginRight: 4 }}>Flujo:</span>
          {FLUJO.map((e, i) => {
            const cfg = estadoCfg[e];
            return (
              <span key={e} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '600', color: cfg.color, backgroundColor: cfg.bg, padding: '3px 10px', borderRadius: '6px' }}>{cfg.label}</span>
                {i < FLUJO.length - 1 && <ArrowRight size={12} color="#D1D5DB" />}
              </span>
            );
          })}
          <div style={{ marginLeft: 8, display: 'flex', gap: 6 }}>
            {(['cancelado', 'devolucion'] as EstadoPedido[]).map(e => {
              const cfg = estadoCfg[e];
              return <span key={e} style={{ fontSize: '0.75rem', fontWeight: '600', color: cfg.color, backgroundColor: cfg.bg, padding: '3px 10px', borderRadius: '6px' }}>{cfg.label}</span>;
            })}
          </div>
        </div>

        {/* Filtros */}
        <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid #F0F0F0', display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, backgroundColor: '#F9FAFB', borderRadius: '8px', border: '1px solid #E5E7EB', padding: '7px 12px', flex: 1, minWidth: 200 }}>
              <Search size={14} color="#9CA3AF" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar por N° pedido, cliente o email..."
                style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.82rem', color: '#374151', width: '100%' }}
              />
            </div>

            {/* Estado filter pills */}
            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
              {['Todos', ...Object.keys(estadoCfg)].map(e => {
                const cfg = estadoCfg[e as EstadoPedido];
                const isActive = estadoFilter === e;
                return (
                  <button
                    key={e}
                    onClick={() => setEstadoFilter(e)}
                    style={{
                      padding: '5px 11px', borderRadius: '7px', fontSize: '0.75rem', fontWeight: '600',
                      border: isActive ? 'none' : `1px solid ${e !== 'Todos' ? cfg?.bg || '#E5E7EB' : '#E5E7EB'}`,
                      backgroundColor: isActive ? (e === 'Todos' ? ORANGE : cfg?.color || ORANGE) : (e !== 'Todos' ? cfg?.bg || '#F9FAFB' : '#F9FAFB'),
                      color: isActive ? '#fff' : (e !== 'Todos' ? cfg?.color || '#6B7280' : '#6B7280'),
                      cursor: 'pointer', transition: 'all 0.1s',
                    }}
                  >
                    {e === 'Todos' ? 'Todos' : cfg?.label}
                  </button>
                );
              })}
            </div>

            {/* Canal filter */}
            <select
              value={canalFilter}
              onChange={e => setCanalFilter(e.target.value)}
              style={{ padding: '7px 10px', borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '0.78rem', color: '#374151', backgroundColor: '#F9FAFB', outline: 'none' }}
            >
              {['Todos', 'Web', 'App', 'POS'].map(c => <option key={c}>{c}</option>)}
            </select>

            <button style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 12px', borderRadius: '8px', border: '1px solid #E5E7EB', backgroundColor: '#F9FAFB', color: '#6B7280', fontSize: '0.78rem', cursor: 'pointer' }}>
              <Download size={13} /> Exportar
            </button>

            <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>{filtered.length} pedidos</span>
          </div>

          {/* Cabecera tabla */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 16px', backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
            <div style={{ width: 20 }} />
            <span style={{ minWidth: 180, fontSize: '0.7rem', fontWeight: '700', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Cliente</span>
            <span style={{ minWidth: 100, fontSize: '0.7rem', fontWeight: '700', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pedido</span>
            <span style={{ minWidth: 90, fontSize: '0.7rem', fontWeight: '700', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Fecha</span>
            <span style={{ minWidth: 130, fontSize: '0.7rem', fontWeight: '700', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Canal / Pago</span>
            <span style={{ flex: 1, fontSize: '0.7rem', fontWeight: '700', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>Estado</span>
            <span style={{ minWidth: 90, fontSize: '0.7rem', fontWeight: '700', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Total</span>
            <span style={{ fontSize: '0.7rem', fontWeight: '700', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', width: 100 }}>Acciones</span>
          </div>

          {/* Filas */}
          {filtered.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center', color: '#9CA3AF' }}>
              <ShoppingCart size={32} color="#E5E7EB" style={{ marginBottom: 12 }} />
              <p style={{ margin: 0, fontSize: '0.9rem' }}>No se encontraron pedidos con esos filtros</p>
            </div>
          ) : (
            filtered.map(p => <FilaMadre key={p.id} pedido={p} />)
          )}

          {/* Footer paginación */}
          <div style={{ padding: '12px 20px', borderTop: '1px solid #F0F0F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', color: '#9CA3AF' }}>Mostrando {filtered.length} de {pedidos.length} pedidos</span>
            <div style={{ display: 'flex', gap: 5 }}>
              {[1, 2, 3, '...', 12].map((n, i) => (
                <button key={i} style={{
                  width: 30, height: 30, borderRadius: '7px',
                  border: n === 1 ? 'none' : '1px solid #E5E7EB',
                  backgroundColor: n === 1 ? ORANGE : 'transparent',
                  color: n === 1 ? '#fff' : '#6B7280',
                  fontSize: '0.78rem', cursor: 'pointer',
                }}>
                  {n}
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

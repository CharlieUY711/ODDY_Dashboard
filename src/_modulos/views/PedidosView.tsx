/* =====================================================
   PedidosView — Gestión Integral de Pedidos
   Árbol madre → hijos · Flujo de estados · Documentos
   ===================================================== */
import React, { useState, useEffect } from 'react';
import { OrangeHeader } from '@/app/components/admin/OrangeHeader';
import type { MainSection } from '@/app/AdminDashboard';
import { api } from '@/app/services/supabaseApi';
import {
  ShoppingCart, Package, Truck, CheckCircle, Clock,
  AlertCircle, XCircle, Search, Filter, ChevronDown,
  ChevronRight, Eye, FileText, Download, MoreHorizontal,
  DollarSign, MapPin, User, Calendar, ArrowRight,
  Plus, RefreshCw, Tag, Circle, Loader2,
} from 'lucide-react';

const ORANGE = '#FF6835';
interface Props { onNavigate: (s: MainSection) => void; }

/* ── Tipos ────────────────────────────────────────── */
type EstadoPedido =
  | 'pendiente' | 'confirmado' | 'enviado'
  | 'entregado' | 'cancelado';

interface PedidoItem {
  id: string;
  pedido_id: string;
  variante_id: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

interface Comprador {
  id: string;
  nombre: string;
  apellido?: string;
  email?: string;
  telefono?: string;
}

interface MetodoPago {
  id: string;
  nombre: string;
  tipo: string;
}

interface Pedido {
  id: string;
  comprador_id: string;
  vendedor_id?: string;
  metodo_pago_id?: string;
  estado: EstadoPedido;
  subtotal: number;
  descuento?: number;
  total: number;
  moneda?: string;
  notas?: string;
  created_at: string;
  items?: PedidoItem[];
  comprador?: Comprador;
  metodo_pago?: MetodoPago;
}

interface PedidosStats {
  total: number;
  por_estado: {
    pendiente: number;
    confirmado: number;
    enviado: number;
    entregado: number;
    cancelado: number;
  };
  revenue_total: number;
}

interface PedidosResponse {
  items: Pedido[];
  total: number;
  page: number;
  limit: number;
}

/* ── Config de estados ───────────────────────────── */
const estadoCfg: Record<EstadoPedido, { label: string; color: string; bg: string; icon: typeof CheckCircle }> = {
  pendiente: { label: 'Pendiente', color: '#6B7280', bg: '#F3F4F6',  icon: Circle     },
  confirmado: { label: 'Confirmado', color: '#3B82F6', bg: '#EFF6FF',  icon: CheckCircle },
  enviado:    { label: 'Enviado',    color: ORANGE,    bg: '#FFF0EB',  icon: Truck       },
  entregado:  { label: 'Entregado', color: '#059669', bg: '#D1FAE5',  icon: CheckCircle },
  cancelado:  { label: 'Cancelado', color: '#DC2626', bg: '#FEE2E2',  icon: XCircle     },
};

/* ── Flujo de estados (stepper) ──────────────────── */
const FLUJO: EstadoPedido[] = ['pendiente', 'confirmado', 'enviado', 'entregado'];

function EstadoStepper({ estado }: { estado: EstadoPedido }) {
  if (estado === 'cancelado') {
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

/* ── Helper para obtener iniciales ───────────────── */
function getInitials(nombre: string, apellido?: string): string {
  const n = nombre?.charAt(0)?.toUpperCase() || '';
  const a = apellido?.charAt(0)?.toUpperCase() || '';
  return (n + a) || '?';
}

/* ── Helper para obtener color de avatar ──────────── */
function getAvatarColor(str: string): string {
  const colors = [ORANGE, '#3B82F6', '#8B5CF6', '#10B981', '#EC4899', '#F59E0B', '#0EA5E9'];
  const hash = str.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
}

/* ── Fila madre ───────────────────────────────────── */
function FilaMadre({ 
  pedido, 
  onViewDetail, 
  onChangeEstado 
}: { 
  pedido: Pedido;
  onViewDetail: (id: string) => void;
  onChangeEstado: (id: string, estado: EstadoPedido) => void;
}) {
  const cfg = estadoCfg[pedido.estado];
  const comprador = pedido.comprador;
  const nombreCompleto = comprador ? `${comprador.nombre} ${comprador.apellido || ''}`.trim() : 'Sin nombre';
  const email = comprador?.email || 'Sin email';
  const avatar = getInitials(comprador?.nombre || '', comprador?.apellido);
  const color = getAvatarColor(pedido.id);
  const fecha = new Date(pedido.created_at).toLocaleDateString('es-UY', { year: 'numeric', month: '2-digit', day: '2-digit' });
  const itemsCount = pedido.items?.length || 0;
  const metodoPago = pedido.metodo_pago?.nombre || 'Sin método';

  return (
    <div style={{ borderBottom: '1px solid #E5E7EB' }}>
      <div
        style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', cursor: 'pointer', transition: 'background 0.1s' }}
        onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.backgroundColor = '#F9FAFB'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.backgroundColor = ''; }}
      >
        {/* Avatar + nombre */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 180 }}>
          <div style={{ width: 34, height: 34, borderRadius: '50%', backgroundColor: color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontSize: '0.62rem', fontWeight: '800', color: '#fff' }}>{avatar}</span>
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '0.84rem', fontWeight: '700', color: '#1F2937' }}>{nombreCompleto}</p>
            <p style={{ margin: 0, fontSize: '0.68rem', color: '#9CA3AF' }}>{email}</p>
          </div>
        </div>

        {/* Nº pedido */}
        <span style={{ fontSize: '0.85rem', fontFamily: 'monospace', fontWeight: '700', color: '#374151', minWidth: 100 }}>{pedido.id.slice(0, 8)}</span>

        {/* Fecha */}
        <span style={{ fontSize: '0.78rem', color: '#9CA3AF', minWidth: 90, display: 'flex', alignItems: 'center', gap: 3 }}>
          <Calendar size={11} /> {fecha}
        </span>

        {/* Método pago */}
        <div style={{ minWidth: 130 }}>
          <span style={{ fontSize: '0.72rem', color: '#6B7280' }}>{metodoPago}</span>
        </div>

        {/* Stepper */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <EstadoStepper estado={pedido.estado} />
        </div>

        {/* Items count */}
        <span style={{ fontSize: '0.72rem', color: ORANGE, backgroundColor: `${ORANGE}12`, padding: '2px 8px', borderRadius: '5px', fontWeight: '700', flexShrink: 0 }}>
          {itemsCount} ítem{itemsCount !== 1 ? 's' : ''}
        </span>

        {/* Total */}
        <span style={{ fontSize: '0.95rem', fontWeight: '800', color: '#111827', minWidth: 90, textAlign: 'right' }}>
          ${pedido.total.toLocaleString()}
        </span>

        {/* Acciones */}
        <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
          <button 
            onClick={e => { e.stopPropagation(); onViewDetail(pedido.id); }} 
            style={{ padding: '5px 9px', borderRadius: '7px', border: '1px solid #E5E7EB', backgroundColor: '#fff', color: '#6B7280', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            title="Ver detalle"
          >
            <Eye size={13} />
          </button>
          <select
            onClick={e => e.stopPropagation()}
            onChange={e => { e.stopPropagation(); onChangeEstado(pedido.id, e.target.value as EstadoPedido); }}
            value={pedido.estado}
            style={{ 
              padding: '5px 8px', 
              borderRadius: '7px', 
              border: '1px solid #E5E7EB', 
              backgroundColor: '#fff', 
              color: '#6B7280', 
              cursor: 'pointer', 
              fontSize: '0.72rem',
              outline: 'none'
            }}
            title="Cambiar estado"
          >
            {Object.keys(estadoCfg).map(est => (
              <option key={est} value={est}>{estadoCfg[est as EstadoPedido].label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

/* ── Vista principal ─────────────────────────────── */
export function PedidosView({ onNavigate }: Props) {
  const [search, setSearch] = useState('');
  const [estadoFilter, setEstadoFilter] = useState<string>('Todos');
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [stats, setStats] = useState<PedidosStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Cargar pedidos
  useEffect(() => {
    loadPedidos();
  }, [page, estadoFilter]);

  // Cargar stats
  useEffect(() => {
    loadStats();
  }, []);

  const loadPedidos = async () => {
    setLoading(true);
    setError(null);
    try {
      const filtros: any = { page, limit: 20 };
      if (estadoFilter !== 'Todos') {
        filtros.estado = estadoFilter;
      }
      const res = await api.pedidos.getPedidos(filtros);
      if (res.ok && res.data) {
        const data = res.data as PedidosResponse;
        setPedidos(data.items || []);
        setTotal(data.total || 0);
      } else {
        setError(res.error || 'Error al cargar pedidos');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    setLoadingStats(true);
    try {
      const res = await api.pedidos.getStatsPedidos();
      if (res.ok && res.data) {
        setStats(res.data as PedidosStats);
      }
    } catch (err) {
      console.error('Error al cargar stats:', err);
    } finally {
      setLoadingStats(false);
    }
  };

  const loadPedidoDetail = async (id: string) => {
    setLoadingDetail(true);
    try {
      const res = await api.pedidos.getPedido(id);
      if (res.ok && res.data) {
        const pedidoData = res.data as any;
        // Mapear pedido_items a items si existe
        if (pedidoData.pedido_items && !pedidoData.items) {
          pedidoData.items = pedidoData.pedido_items;
        }
        setSelectedPedido(pedidoData as Pedido);
      } else {
        alert(res.error || 'Error al cargar detalle del pedido');
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleChangeEstado = async (id: string, nuevoEstado: EstadoPedido) => {
    try {
      const res = await api.pedidos.cambiarEstadoPedido(id, nuevoEstado);
      if (res.ok) {
        await loadPedidos();
        // Si el pedido seleccionado es el que se actualizó, recargar su detalle
        if (selectedPedido && selectedPedido.id === id) {
          await loadPedidoDetail(id);
        }
      } else {
        alert(res.error || 'Error al cambiar estado');
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error desconocido');
    }
  };

  const handleCancelarPedido = async (id: string) => {
    if (!confirm('¿Estás seguro de que querés cancelar este pedido?')) return;
    try {
      const res = await api.pedidos.cancelarPedido(id);
      if (res.ok) {
        await loadPedidos();
        if (selectedPedido && selectedPedido.id === id) {
          setSelectedPedido(null);
        }
      } else {
        alert(res.error || 'Error al cancelar pedido');
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error desconocido');
    }
  };

  const kpis = [
    { 
      label: 'Total Pedidos', 
      value: loadingStats ? '...' : (stats?.total || 0).toString(), 
      icon: ShoppingCart, 
      color: '#3B82F6', 
      sub: 'este período' 
    },
    { 
      label: 'Pendientes', 
      value: loadingStats ? '...' : (stats?.por_estado.pendiente || 0).toString(), 
      icon: Clock, 
      color: '#6B7280', 
      sub: 'por confirmar' 
    },
    { 
      label: 'En Tránsito', 
      value: loadingStats ? '...' : (stats?.por_estado.enviado || 0).toString(), 
      icon: Truck, 
      color: ORANGE, 
      sub: 'en camino' 
    },
    { 
      label: 'Revenue Total', 
      value: loadingStats ? '...' : `$${(stats?.revenue_total || 0).toLocaleString()}`, 
      icon: DollarSign, 
      color: '#10B981', 
      sub: 'ingresos' 
    },
  ];

  const filtered = pedidos.filter(p => {
    const matchSearch = p.id.toLowerCase().includes(search.toLowerCase())
      || (p.comprador?.nombre || '').toLowerCase().includes(search.toLowerCase())
      || (p.comprador?.email || '').toLowerCase().includes(search.toLowerCase());
    const matchEstado = estadoFilter === 'Todos' || p.estado === estadoFilter;
    return matchSearch && matchEstado;
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
            {(['cancelado'] as EstadoPedido[]).map(e => {
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
                    onClick={() => { setEstadoFilter(e); setPage(1); }}
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

            <button style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 12px', borderRadius: '8px', border: '1px solid #E5E7EB', backgroundColor: '#F9FAFB', color: '#6B7280', fontSize: '0.78rem', cursor: 'pointer' }}>
              <Download size={13} /> Exportar
            </button>

            <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>{filtered.length} pedidos</span>
          </div>

          {/* Cabecera tabla */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 16px', backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
            <span style={{ minWidth: 180, fontSize: '0.7rem', fontWeight: '700', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Cliente</span>
            <span style={{ minWidth: 100, fontSize: '0.7rem', fontWeight: '700', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pedido</span>
            <span style={{ minWidth: 90, fontSize: '0.7rem', fontWeight: '700', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Fecha</span>
            <span style={{ minWidth: 130, fontSize: '0.7rem', fontWeight: '700', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Método Pago</span>
            <span style={{ flex: 1, fontSize: '0.7rem', fontWeight: '700', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>Estado</span>
            <span style={{ minWidth: 90, fontSize: '0.7rem', fontWeight: '700', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Total</span>
            <span style={{ fontSize: '0.7rem', fontWeight: '700', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', width: 100 }}>Acciones</span>
          </div>

          {/* Filas */}
          {loading ? (
            <div style={{ padding: '48px', textAlign: 'center', color: '#9CA3AF' }}>
              <Loader2 size={32} color="#9CA3AF" style={{ marginBottom: 12, animation: 'spin 1s linear infinite' }} />
              <p style={{ margin: 0, fontSize: '0.9rem' }}>Cargando pedidos...</p>
            </div>
          ) : error ? (
            <div style={{ padding: '48px', textAlign: 'center', color: '#DC2626' }}>
              <AlertCircle size={32} color="#DC2626" style={{ marginBottom: 12 }} />
              <p style={{ margin: 0, fontSize: '0.9rem' }}>{error}</p>
              <button 
                onClick={loadPedidos}
                style={{ marginTop: 12, padding: '8px 16px', borderRadius: '8px', border: '1px solid #DC2626', backgroundColor: '#fff', color: '#DC2626', cursor: 'pointer', fontSize: '0.85rem' }}
              >
                Reintentar
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center', color: '#9CA3AF' }}>
              <ShoppingCart size={32} color="#E5E7EB" style={{ marginBottom: 12 }} />
              <p style={{ margin: 0, fontSize: '0.9rem' }}>No se encontraron pedidos con esos filtros</p>
            </div>
          ) : (
            filtered.map(p => (
              <FilaMadre 
                key={p.id} 
                pedido={p}
                onViewDetail={loadPedidoDetail}
                onChangeEstado={handleChangeEstado}
              />
            ))
          )}

          {/* Footer paginación */}
          {!loading && (
            <div style={{ padding: '12px 20px', borderTop: '1px solid #F0F0F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.78rem', color: '#9CA3AF' }}>
                Mostrando {filtered.length} de {total} pedidos
              </span>
              <div style={{ display: 'flex', gap: 5 }}>
                <button 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  style={{
                    width: 30, height: 30, borderRadius: '7px',
                    border: '1px solid #E5E7EB',
                    backgroundColor: page === 1 ? '#F3F4F6' : '#fff',
                    color: page === 1 ? '#9CA3AF' : '#6B7280',
                    fontSize: '0.78rem', cursor: page === 1 ? 'not-allowed' : 'pointer',
                  }}
                >
                  ←
                </button>
                <span style={{ padding: '0 8px', display: 'flex', alignItems: 'center', fontSize: '0.78rem', color: '#6B7280' }}>
                  Página {page}
                </span>
                <button 
                  onClick={() => setPage(p => p + 1)}
                  disabled={filtered.length < 20}
                  style={{
                    width: 30, height: 30, borderRadius: '7px',
                    border: '1px solid #E5E7EB',
                    backgroundColor: filtered.length < 20 ? '#F3F4F6' : '#fff',
                    color: filtered.length < 20 ? '#9CA3AF' : '#6B7280',
                    fontSize: '0.78rem', cursor: filtered.length < 20 ? 'not-allowed' : 'pointer',
                  }}
                >
                  →
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Modal de detalle del pedido */}
      {selectedPedido && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setSelectedPedido(null)}
        >
          <div 
            style={{
              backgroundColor: '#fff',
              borderRadius: '16px',
              padding: '24px',
              maxWidth: '800px',
              maxHeight: '90vh',
              overflowY: 'auto',
              width: '90%',
            }}
            onClick={e => e.stopPropagation()}
          >
            {loadingDetail ? (
              <div style={{ padding: '48px', textAlign: 'center' }}>
                <Loader2 size={32} color="#9CA3AF" style={{ marginBottom: 12, animation: 'spin 1s linear infinite' }} />
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#9CA3AF' }}>Cargando detalle...</p>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '800', color: '#111827' }}>
                    Pedido {selectedPedido.id.slice(0, 8)}
                  </h2>
                  <button
                    onClick={() => setSelectedPedido(null)}
                    style={{
                      padding: '8px',
                      borderRadius: '8px',
                      border: '1px solid #E5E7EB',
                      backgroundColor: '#fff',
                      cursor: 'pointer',
                    }}
                  >
                    <XCircle size={20} color="#6B7280" />
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                  <div>
                    <p style={{ margin: '0 0 4px', fontSize: '0.75rem', color: '#9CA3AF', fontWeight: '600' }}>Cliente</p>
                    <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: '700', color: '#111827' }}>
                      {selectedPedido.comprador ? `${selectedPedido.comprador.nombre} ${selectedPedido.comprador.apellido || ''}`.trim() : 'Sin nombre'}
                    </p>
                    <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: '#6B7280' }}>
                      {selectedPedido.comprador?.email || 'Sin email'}
                    </p>
                  </div>
                  <div>
                    <p style={{ margin: '0 0 4px', fontSize: '0.75rem', color: '#9CA3AF', fontWeight: '600' }}>Estado</p>
                    <div style={{ display: 'inline-block' }}>
                      <EstadoStepper estado={selectedPedido.estado} />
                    </div>
                  </div>
                  <div>
                    <p style={{ margin: '0 0 4px', fontSize: '0.75rem', color: '#9CA3AF', fontWeight: '600' }}>Método de Pago</p>
                    <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: '700', color: '#111827' }}>
                      {selectedPedido.metodo_pago?.nombre || 'Sin método'}
                    </p>
                  </div>
                  <div>
                    <p style={{ margin: '0 0 4px', fontSize: '0.75rem', color: '#9CA3AF', fontWeight: '600' }}>Fecha</p>
                    <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: '700', color: '#111827' }}>
                      {new Date(selectedPedido.created_at).toLocaleString('es-UY')}
                    </p>
                  </div>
                </div>

                {selectedPedido.items && selectedPedido.items.length > 0 && (
                  <div style={{ marginBottom: '20px' }}>
                    <p style={{ margin: '0 0 12px', fontSize: '0.9rem', fontWeight: '700', color: '#111827' }}>Items del Pedido</p>
                    <div style={{ border: '1px solid #E5E7EB', borderRadius: '8px', overflow: 'hidden' }}>
                      {selectedPedido.items.map((item, i) => (
                        <div key={item.id || i} style={{ 
                          padding: '12px 16px', 
                          borderBottom: i < selectedPedido.items!.length - 1 ? '1px solid #F3F4F6' : 'none',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          <div>
                            <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: '600', color: '#111827' }}>
                              Variante: {item.variante_id.slice(0, 8)}
                            </p>
                            <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: '#6B7280' }}>
                              Cantidad: {item.cantidad} × ${item.precio_unitario.toLocaleString()}
                            </p>
                          </div>
                          <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: '700', color: ORANGE }}>
                            ${item.subtotal.toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: '#F9FAFB', borderRadius: '8px', marginBottom: '20px' }}>
                  <div>
                    <p style={{ margin: '0 0 4px', fontSize: '0.75rem', color: '#9CA3AF', fontWeight: '600' }}>Subtotal</p>
                    <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700', color: '#111827' }}>
                      ${selectedPedido.subtotal.toLocaleString()}
                    </p>
                  </div>
                  {selectedPedido.descuento && selectedPedido.descuento > 0 && (
                    <div>
                      <p style={{ margin: '0 0 4px', fontSize: '0.75rem', color: '#9CA3AF', fontWeight: '600' }}>Descuento</p>
                      <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700', color: '#DC2626' }}>
                        -${selectedPedido.descuento.toLocaleString()}
                      </p>
                    </div>
                  )}
                  <div>
                    <p style={{ margin: '0 0 4px', fontSize: '0.75rem', color: '#9CA3AF', fontWeight: '600' }}>Total</p>
                    <p style={{ margin: 0, fontSize: '1.3rem', fontWeight: '800', color: ORANGE }}>
                      ${selectedPedido.total.toLocaleString()}
                    </p>
                  </div>
                </div>

                {selectedPedido.notas && (
                  <div style={{ marginBottom: '20px' }}>
                    <p style={{ margin: '0 0 8px', fontSize: '0.9rem', fontWeight: '700', color: '#111827' }}>Notas</p>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#6B7280', padding: '12px', backgroundColor: '#F9FAFB', borderRadius: '8px' }}>
                      {selectedPedido.notas}
                    </p>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                  {selectedPedido.estado !== 'cancelado' && selectedPedido.estado !== 'entregado' && (
                    <button
                      onClick={() => handleCancelarPedido(selectedPedido.id)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '8px',
                        border: '1px solid #DC2626',
                        backgroundColor: '#fff',
                        color: '#DC2626',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                      }}
                    >
                      Cancelar Pedido
                    </button>
                  )}
                  <select
                    onChange={async e => {
                      const nuevoEstado = e.target.value as EstadoPedido;
                      await handleChangeEstado(selectedPedido.id, nuevoEstado);
                    }}
                    value={selectedPedido.estado}
                    style={{ 
                      padding: '8px 12px', 
                      borderRadius: '8px', 
                      border: '1px solid #E5E7EB', 
                      backgroundColor: '#fff', 
                      color: '#6B7280', 
                      cursor: 'pointer', 
                      fontSize: '0.85rem',
                      outline: 'none'
                    }}
                  >
                    {Object.keys(estadoCfg).map(est => (
                      <option key={est} value={est}>{estadoCfg[est as EstadoPedido].label}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => setSelectedPedido(null)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: '1px solid #E5E7EB',
                      backgroundColor: '#fff',
                      color: '#6B7280',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                    }}
                  >
                    Cerrar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

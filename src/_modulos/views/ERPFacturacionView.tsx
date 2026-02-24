/* =====================================================
   ERPFacturacionView — Facturación y Cobros
   ===================================================== */
import React, { useState, useMemo } from 'react';
import { OrangeHeader } from '@/app/components/admin/OrangeHeader';
import type { MainSection } from '@/app/AdminDashboard';
import {
  Receipt, DollarSign, Clock, XCircle, CheckCircle,
  Search, Plus, Download, Eye, Send, AlertTriangle,
  TrendingUp, Filter,
} from 'lucide-react';

const ORANGE = '#FF6835';
interface Props { onNavigate: (s: MainSection) => void; }

type EstadoFactura = 'pagada' | 'pendiente' | 'vencida' | 'borrador';

interface Factura {
  id: number;
  numero: string;
  cliente: string;
  fecha: string;
  vencimiento: string;
  monto: number;
  estado: EstadoFactura;
  metodo: string;
}

const facturas: Factura[] = [
  { id: 1, numero: 'F-2026-0089', cliente: 'Importadora Platino', fecha: '2026-02-20', vencimiento: '2026-03-20', monto: 220000, estado: 'pendiente', metodo: 'Transferencia' },
  { id: 2, numero: 'F-2026-0088', cliente: 'Distribuidora Omega', fecha: '2026-02-18', vencimiento: '2026-03-18', monto: 78000, estado: 'pagada', metodo: 'MercadoPago' },
  { id: 3, numero: 'F-2026-0087', cliente: 'Ana García', fecha: '2026-02-15', vencimiento: '2026-03-15', monto: 18450, estado: 'pagada', metodo: 'Tarjeta Visa' },
  { id: 4, numero: 'F-2026-0086', cliente: 'Tech Solutions UY', fecha: '2026-01-28', vencimiento: '2026-02-28', monto: 89000, estado: 'pendiente', metodo: 'Transferencia' },
  { id: 5, numero: 'F-2026-0085', cliente: 'María López', fecha: '2026-01-20', vencimiento: '2026-02-20', monto: 42100, estado: 'vencida', metodo: 'Cheque' },
  { id: 6, numero: 'F-2026-0084', cliente: 'Hotel Boutique MD', fecha: '2026-01-15', vencimiento: '2026-02-15', monto: 42000, estado: 'pagada', metodo: 'MercadoPago' },
  { id: 7, numero: 'F-2026-0083', cliente: 'Roberto Fernández', fecha: '2026-01-10', vencimiento: '2026-02-10', monto: 28900, estado: 'vencida', metodo: 'Transferencia' },
  { id: 8, numero: 'F-2026-0082', cliente: 'Farmacia Central', fecha: '2026-02-22', vencimiento: '2026-03-22', monto: 12000, estado: 'borrador', metodo: '—' },
  { id: 9, numero: 'F-2026-0081', cliente: 'Sofía Martínez', fecha: '2026-02-10', vencimiento: '2026-03-10', monto: 2100, estado: 'pagada', metodo: 'Efectivo' },
  { id: 10, numero: 'F-2026-0080', cliente: 'Construcciones Norte', fecha: '2026-01-05', vencimiento: '2026-02-05', monto: 156000, estado: 'pagada', metodo: 'Transferencia' },
];

const estadoConfig: Record<EstadoFactura, { label: string; color: string; bg: string }> = {
  pagada: { label: 'Pagada', color: '#059669', bg: '#D1FAE5' },
  pendiente: { label: 'Pendiente', color: '#D97706', bg: '#FEF3C7' },
  vencida: { label: 'Vencida', color: '#DC2626', bg: '#FEE2E2' },
  borrador: { label: 'Borrador', color: '#6B7280', bg: '#F3F4F6' },
};

export function ERPFacturacionView({ onNavigate }: Props) {
  const [search, setSearch] = useState('');
  const [estadoFilter, setEstadoFilter] = useState<string>('Todos');

  const totalFacturado = facturas.reduce((a, f) => a + f.monto, 0);
  const totalPagado = facturas.filter(f => f.estado === 'pagada').reduce((a, f) => a + f.monto, 0);
  const totalPendiente = facturas.filter(f => f.estado === 'pendiente').reduce((a, f) => a + f.monto, 0);
  const totalVencido = facturas.filter(f => f.estado === 'vencida').reduce((a, f) => a + f.monto, 0);

  const filtered = useMemo(() => {
    return facturas.filter(f => {
      const matchSearch = f.numero.toLowerCase().includes(search.toLowerCase())
        || f.cliente.toLowerCase().includes(search.toLowerCase());
      const matchEstado = estadoFilter === 'Todos' || f.estado === estadoFilter;
      return matchSearch && matchEstado;
    });
  }, [search, estadoFilter]);

  const kpis = [
    { label: 'Total Facturado', value: `$${(totalFacturado / 1000).toFixed(0)}k`, icon: DollarSign, color: '#3B82F6', sub: `${facturas.length} facturas` },
    { label: 'Cobrado', value: `$${(totalPagado / 1000).toFixed(0)}k`, icon: CheckCircle, color: '#10B981', sub: `${facturas.filter(f => f.estado === 'pagada').length} pagadas` },
    { label: 'Pendiente', value: `$${(totalPendiente / 1000).toFixed(0)}k`, icon: Clock, color: '#D97706', sub: `${facturas.filter(f => f.estado === 'pendiente').length} facturas` },
    { label: 'Vencido', value: `$${(totalVencido / 1000).toFixed(0)}k`, icon: AlertTriangle, color: '#DC2626', sub: `${facturas.filter(f => f.estado === 'vencida').length} vencidas` },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', backgroundColor: '#F8F9FA' }}>
      <OrangeHeader
        icon={Receipt}
        title="Facturación"
        subtitle="Emisión de facturas, cobros y estado de cobranza"
        actions={[
          { label: '← Volver', onClick: () => onNavigate('gestion') },
          { label: '+ Nueva Factura', primary: true },
        ]}
      />

      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>

        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '22px' }}>
          {kpis.map((k, i) => (
            <div key={i} style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '18px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <div style={{ width: 36, height: 36, borderRadius: '9px', backgroundColor: `${k.color}14`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <k.icon size={18} color={k.color} strokeWidth={2} />
                </div>
              </div>
              <p style={{ margin: '0 0 2px', fontSize: '0.73rem', color: '#6B7280' }}>{k.label}</p>
              <p style={{ margin: '0 0 4px', fontSize: '1.6rem', fontWeight: '800', color: '#111827', lineHeight: 1 }}>{k.value}</p>
              <p style={{ margin: 0, fontSize: '0.7rem', color: '#9CA3AF' }}>{k.sub}</p>
            </div>
          ))}
        </div>

        {/* Resumen cobrado */}
        <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '18px 22px', marginBottom: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#374151' }}>Tasa de cobro</span>
            <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#10B981' }}>{Math.round((totalPagado / totalFacturado) * 100)}%</span>
          </div>
          <div style={{ height: 10, backgroundColor: '#F3F4F6', borderRadius: '5px', overflow: 'hidden' }}>
            <div style={{ height: '100%', borderRadius: '5px', display: 'flex' }}>
              <div style={{ width: `${(totalPagado / totalFacturado) * 100}%`, backgroundColor: '#10B981' }} />
              <div style={{ width: `${(totalPendiente / totalFacturado) * 100}%`, backgroundColor: '#F59E0B' }} />
              <div style={{ width: `${(totalVencido / totalFacturado) * 100}%`, backgroundColor: '#EF4444' }} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
            {[{ label: 'Cobrado', color: '#10B981' }, { label: 'Pendiente', color: '#F59E0B' }, { label: 'Vencido', color: '#EF4444' }].map(l => (
              <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 10, height: 10, borderRadius: '3px', backgroundColor: l.color }} />
                <span style={{ fontSize: '0.72rem', color: '#6B7280' }}>{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Filtros */}
        <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
          <div style={{ borderBottom: '1px solid #F0F0F0', padding: '12px 20px', display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, backgroundColor: '#F9FAFB', borderRadius: '8px', border: '1px solid #E5E7EB', padding: '6px 12px', flex: 1, minWidth: 200 }}>
              <Search size={13} color="#9CA3AF" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar factura o cliente..."
                style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.8rem', color: '#374151', width: '100%' }}
              />
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {['Todos', 'pagada', 'pendiente', 'vencida', 'borrador'].map(e => {
                const cfg = estadoConfig[e as EstadoFactura];
                return (
                  <button
                    key={e}
                    onClick={() => setEstadoFilter(e)}
                    style={{
                      padding: '6px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '600',
                      border: estadoFilter === e ? 'none' : '1px solid #E5E7EB',
                      backgroundColor: estadoFilter === e ? (cfg?.color || ORANGE) : '#F9FAFB',
                      color: estadoFilter === e ? '#fff' : '#6B7280', cursor: 'pointer',
                    }}
                  >
                    {e === 'Todos' ? 'Todas' : cfg?.label}
                  </button>
                );
              })}
            </div>
            <button style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: '8px', border: '1px solid #E5E7EB', backgroundColor: '#F9FAFB', color: '#6B7280', fontSize: '0.78rem', cursor: 'pointer' }}>
              <Download size={13} /> Exportar
            </button>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                {['Nº Factura', 'Cliente', 'Fecha', 'Vencimiento', 'Monto', 'Método', 'Estado', ''].map(h => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '0.7rem', fontWeight: '700', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((f, i) => {
                const ec = estadoConfig[f.estado];
                return (
                  <tr key={f.id}
                    style={{ borderBottom: i < filtered.length - 1 ? '1px solid #F3F4F6' : 'none' }}
                    onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.backgroundColor = '#F9FAFB'}
                    onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.backgroundColor = ''}
                  >
                    <td style={{ padding: '13px 16px' }}>
                      <span style={{ fontSize: '0.83rem', fontFamily: 'monospace', fontWeight: '700', color: '#1F2937' }}>{f.numero}</span>
                    </td>
                    <td style={{ padding: '13px 16px' }}>
                      <span style={{ fontSize: '0.83rem', color: '#374151' }}>{f.cliente}</span>
                    </td>
                    <td style={{ padding: '13px 16px' }}>
                      <span style={{ fontSize: '0.78rem', color: '#6B7280' }}>{f.fecha}</span>
                    </td>
                    <td style={{ padding: '13px 16px' }}>
                      <span style={{ fontSize: '0.78rem', color: f.estado === 'vencida' ? '#DC2626' : '#6B7280', fontWeight: f.estado === 'vencida' ? '700' : '400' }}>
                        {f.vencimiento}
                      </span>
                    </td>
                    <td style={{ padding: '13px 16px' }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: '800', color: '#111827' }}>
                        ${f.monto.toLocaleString()}
                      </span>
                    </td>
                    <td style={{ padding: '13px 16px' }}>
                      <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>{f.metodo}</span>
                    </td>
                    <td style={{ padding: '13px 16px' }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: '700', color: ec.color, backgroundColor: ec.bg, padding: '3px 9px', borderRadius: '6px' }}>
                        {ec.label}
                      </span>
                    </td>
                    <td style={{ padding: '13px 16px' }}>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #E5E7EB', backgroundColor: 'transparent', color: '#6B7280', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                          <Eye size={13} />
                        </button>
                        {f.estado !== 'pagada' && (
                          <button style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #E5E7EB', backgroundColor: 'transparent', color: ORANGE, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                            <Send size={13} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

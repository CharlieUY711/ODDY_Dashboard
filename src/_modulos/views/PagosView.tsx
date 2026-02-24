/* =====================================================
   PagosView — Pagos & Transacciones
   Cobros · Reembolsos · Conciliación bancaria
   ===================================================== */
import React, { useState } from 'react';
import { OrangeHeader } from '@/app/components/admin/OrangeHeader';
import type { MainSection } from '@/app/AdminDashboard';
import { DollarSign, TrendingUp, AlertCircle, CheckCircle, RotateCcw, Search, Filter, Download, CreditCard } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ORANGE = '#FF6835';
interface Props { onNavigate: (s: MainSection) => void; }

const transacciones = [
  { id: 'TXN-88412', pedido: 'ORD-8841', cliente: 'Ana García', monto: 18450, metodo: 'Visa', estado: 'aprobado', fecha: '2026-02-24 09:14', gateway: 'Plexo', comision: 184.5 },
  { id: 'TXN-88409', pedido: 'ORD-8840', cliente: 'Carlos Rodríguez', monto: 3240, metodo: 'MercadoPago', estado: 'aprobado', fecha: '2026-02-24 08:32', gateway: 'MP', comision: 97.2 },
  { id: 'TXN-88406', pedido: 'ORD-8839', cliente: 'María López', monto: 42100, metodo: 'Transferencia', estado: 'aprobado', fecha: '2026-02-23 16:45', gateway: 'Manual', comision: 0 },
  { id: 'TXN-88401', pedido: 'ORD-8835', cliente: 'Diego Pérez', monto: 5600, metodo: 'MasterCard', estado: 'fallido', fecha: '2026-02-23 14:20', gateway: 'Plexo', comision: 0 },
  { id: 'TXN-88398', pedido: 'ORD-8832', cliente: 'Laura Martínez', monto: 9200, metodo: 'Visa', estado: 'reembolso', fecha: '2026-02-22 11:05', gateway: 'Plexo', comision: -92 },
  { id: 'TXN-88390', pedido: 'ORD-8828', cliente: 'Roberto Fernández', monto: 28900, metodo: 'Efectivo', estado: 'aprobado', fecha: '2026-02-22 10:00', gateway: 'Manual', comision: 0 },
];

const flujo7dias = [
  { dia: 'Lun', cobros: 42000, reembolsos: 2000 },
  { dia: 'Mar', cobros: 58000, reembolsos: 500 },
  { dia: 'Mié', cobros: 38000, reembolsos: 1500 },
  { dia: 'Jue', cobros: 64000, reembolsos: 3000 },
  { dia: 'Vie', cobros: 89000, reembolsos: 1800 },
  { dia: 'Sáb', cobros: 112000, reembolsos: 4200 },
  { dia: 'Dom', cobros: 74000, reembolsos: 900 },
];

const kpis = [
  { label: 'Cobrado Hoy', value: '$74.2K', color: '#10B981', icon: TrendingUp },
  { label: 'Transacciones', value: '124', color: '#3B82F6', icon: CreditCard },
  { label: 'Tasa Aprobación', value: '97.4%', color: ORANGE, icon: CheckCircle },
  { label: 'Reembolsos', value: '$9.2K', color: '#EF4444', icon: RotateCcw },
];

const estadoColor: Record<string, { bg: string; color: string }> = {
  aprobado:  { bg: '#D1FAE5', color: '#059669' },
  fallido:   { bg: '#FEE2E2', color: '#DC2626' },
  reembolso: { bg: '#DBEAFE', color: '#1D4ED8' },
  pendiente: { bg: '#FEF3C7', color: '#D97706' },
};

export function PagosView({ onNavigate }: Props) {
  const [tab, setTab] = useState<'transacciones' | 'conciliacion'>('transacciones');
  const [search, setSearch] = useState('');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', backgroundColor: '#F8F9FA' }}>
      <OrangeHeader
        icon={DollarSign}
        title="Pagos & Transacciones"
        subtitle="Cobros · Reembolsos · Conciliación bancaria"
        actions={[
          { label: '← Volver', onClick: () => onNavigate('ecommerce') },
          { label: '⬇️ Exportar', primary: true },
        ]}
      />
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 22 }}>
          {kpis.map((k, i) => (
            <div key={i} style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 42, height: 42, borderRadius: '11px', backgroundColor: `${k.color}14`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <k.icon size={20} color={k.color} />
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1A1A2E', lineHeight: 1 }}>{k.value}</div>
                <div style={{ fontSize: '0.72rem', color: '#6C757D' }}>{k.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Gráfico */}
        <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '20px', marginBottom: 20 }}>
          <div style={{ fontWeight: '700', color: '#1A1A2E', marginBottom: 16 }}>Flujo de Pagos — Últimos 7 días</div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={flujo7dias}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="dia" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `$${(v / 1000).toFixed(0)}K`} />
              <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} />
              <Line type="monotone" dataKey="cobros" stroke="#10B981" strokeWidth={2} dot={false} name="Cobros" />
              <Line type="monotone" dataKey="reembolsos" stroke="#EF4444" strokeWidth={2} dot={false} name="Reembolsos" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div style={{ display: 'flex', gap: 4, marginBottom: 20, backgroundColor: '#F3F4F6', padding: '4px', borderRadius: '10px', width: 'fit-content' }}>
          {[{ id: 'transacciones' as const, label: '💳 Transacciones' }, { id: 'conciliacion' as const, label: '🏦 Conciliación' }].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: '7px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '0.82rem', fontWeight: '600', backgroundColor: tab === t.id ? '#fff' : 'transparent', color: tab === t.id ? '#1A1A2E' : '#6B7280', boxShadow: tab === t.id ? '0 1px 4px rgba(0,0,0,0.08)' : 'none' }}>{t.label}</button>
          ))}
        </div>

        {tab === 'transacciones' && (
          <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
            <div style={{ padding: '14px 16px', borderBottom: '1px solid #F3F4F6', display: 'flex', gap: 10 }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search size={13} color="#9CA3AF" style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)' }} />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar transacción..." style={{ width: '100%', paddingLeft: 28, paddingRight: 10, paddingTop: 7, paddingBottom: 7, border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '0.82rem', outline: 'none' }} />
              </div>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#F9FAFB' }}>
                  {['ID Txn', 'Pedido', 'Cliente', 'Monto', 'Método', 'Gateway', 'Comisión', 'Estado', 'Fecha'].map((h, i) => (
                    <th key={i} style={{ padding: '10px 12px', textAlign: 'left', fontSize: '0.7rem', fontWeight: '700', color: '#9CA3AF', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {transacciones.filter(t => t.id.includes(search) || t.cliente.toLowerCase().includes(search.toLowerCase())).map(t => {
                  const s = estadoColor[t.estado];
                  return (
                    <tr key={t.id} style={{ borderTop: '1px solid #F3F4F6' }}>
                      <td style={{ padding: '11px 12px', fontWeight: '700', color: '#1A1A2E', fontSize: '0.8rem' }}>{t.id}</td>
                      <td style={{ padding: '11px 12px', fontSize: '0.8rem', color: '#3B82F6' }}>{t.pedido}</td>
                      <td style={{ padding: '11px 12px', fontSize: '0.8rem', color: '#374151' }}>{t.cliente}</td>
                      <td style={{ padding: '11px 12px', fontWeight: '700', color: ORANGE }}>${t.monto.toLocaleString()}</td>
                      <td style={{ padding: '11px 12px', fontSize: '0.8rem', color: '#374151' }}>{t.metodo}</td>
                      <td style={{ padding: '11px 12px', fontSize: '0.8rem', color: '#9CA3AF' }}>{t.gateway}</td>
                      <td style={{ padding: '11px 12px', fontSize: '0.8rem', color: t.comision < 0 ? '#DC2626' : '#374151' }}>${Math.abs(t.comision).toFixed(2)}</td>
                      <td style={{ padding: '11px 12px' }}>
                        <span style={{ fontSize: '0.68rem', fontWeight: '700', padding: '2px 7px', borderRadius: '5px', backgroundColor: s.bg, color: s.color }}>{t.estado}</span>
                      </td>
                      <td style={{ padding: '11px 12px', fontSize: '0.75rem', color: '#9CA3AF' }}>{t.fecha}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'conciliacion' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              { gateway: 'Plexo', cobros: 312400, comisiones: 6248, liquidacion: '2026-03-01', estado: 'pendiente' },
              { gateway: 'MercadoPago', cobros: 48600, comisiones: 1458, liquidacion: '2026-02-25', estado: 'pendiente' },
              { gateway: 'Manual / Transferencia', cobros: 128500, comisiones: 0, liquidacion: 'Inmediato', estado: 'conciliado' },
              { gateway: 'PayPal', cobros: 8400, comisiones: 588, liquidacion: '2026-02-28', estado: 'pendiente' },
            ].map((g, i) => (
              <div key={i} style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{ fontWeight: '700', color: '#1A1A2E' }}>{g.gateway}</div>
                  <span style={{ fontSize: '0.72rem', fontWeight: '700', padding: '2px 8px', borderRadius: '6px', backgroundColor: g.estado === 'conciliado' ? '#D1FAE5' : '#FEF3C7', color: g.estado === 'conciliado' ? '#059669' : '#D97706' }}>
                    {g.estado}
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <div style={{ padding: '8px', backgroundColor: '#F9FAFB', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.68rem', color: '#9CA3AF' }}>COBROS</div>
                    <div style={{ fontWeight: '700', color: '#10B981' }}>${g.cobros.toLocaleString()}</div>
                  </div>
                  <div style={{ padding: '8px', backgroundColor: '#F9FAFB', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.68rem', color: '#9CA3AF' }}>COMISIONES</div>
                    <div style={{ fontWeight: '700', color: '#DC2626' }}>${g.comisiones.toLocaleString()}</div>
                  </div>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#9CA3AF', marginTop: 10 }}>Liquidación: {g.liquidacion}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

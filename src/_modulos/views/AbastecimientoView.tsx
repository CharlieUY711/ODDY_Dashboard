/* =====================================================
   AbastecimientoView — MRP / Alertas / OC Automáticas
   ===================================================== */
import React, { useState } from 'react';
import { OrangeHeader } from '@/app/components/admin/OrangeHeader';
import type { MainSection } from '@/app/AdminDashboard';
import { ShoppingCart, AlertTriangle, Package, TrendingUp, Plus, CheckCircle, Clock, DollarSign } from 'lucide-react';

const ORANGE = '#FF6835';
interface Props { onNavigate: (s: MainSection) => void; }

const alertas = [
  { sku: 'PRD-0002', nombre: 'Zapatillas Running X200', stock: 12, minimo: 30, pedidoSugerido: 100, proveedor: 'SportMax UY', precioUnit: 1800, total: 180000, urgencia: 'critica' },
  { sku: 'PRD-0003', nombre: 'Mochila Universitaria Urban', stock: 0, minimo: 10, pedidoSugerido: 50, proveedor: 'Accesorios MX', precioUnit: 620, total: 31000, urgencia: 'critica' },
  { sku: 'PRD-0005', nombre: 'Camiseta Algodón Orgánico', stock: 8, minimo: 50, pedidoSugerido: 200, proveedor: 'Ropa UY', precioUnit: 280, total: 56000, urgencia: 'alta' },
  { sku: 'PRD-0009', nombre: 'Lámpara LED Escritorio', stock: 5, minimo: 15, pedidoSugerido: 40, proveedor: 'LuzMás', precioUnit: 450, total: 18000, urgencia: 'alta' },
  { sku: 'PRD-0007', nombre: 'Teclado Mecánico RGB', stock: 0, minimo: 10, pedidoSugerido: 30, proveedor: 'TechImport', precioUnit: 1600, total: 48000, urgencia: 'critica' },
];

const ocPendientes = [
  { id: 'OC-2026-012', proveedor: 'SportMax UY', items: 3, monto: 245000, estado: 'enviada', fecha: '2026-02-22', eta: '2026-03-01' },
  { id: 'OC-2026-013', proveedor: 'TechImport', items: 2, monto: 89000, estado: 'confirmada', fecha: '2026-02-23', eta: '2026-02-28' },
  { id: 'OC-2026-014', proveedor: 'Ropa UY', items: 5, monto: 112000, estado: 'borrador', fecha: '2026-02-24', eta: '—' },
];

const kpis = [
  { label: 'Alertas Críticas', value: '3', color: '#DC2626', icon: AlertTriangle },
  { label: 'Alertas Altas', value: '2', color: '#D97706', icon: Package },
  { label: 'OC Pendientes', value: '3', color: '#3B82F6', icon: ShoppingCart },
  { label: 'Total a Reponer', value: '$333K', color: ORANGE, icon: DollarSign },
];

export function AbastecimientoView({ onNavigate }: Props) {
  const [tab, setTab] = useState<'alertas' | 'oc'>('alertas');
  const [seleccionados, setSeleccionados] = useState<Set<string>>(new Set());

  const toggleSel = (sku: string) => setSeleccionados(p => { const s = new Set(p); s.has(sku) ? s.delete(sku) : s.add(sku); return s; });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', backgroundColor: '#F8F9FA' }}>
      <OrangeHeader
        icon={ShoppingCart}
        title="Abastecimiento"
        subtitle="MRP · Alertas de stock crítico · OC automáticas"
        actions={[
          { label: '← Volver', onClick: () => onNavigate('logistica') },
          { label: seleccionados.size > 0 ? `+ Crear OC (${seleccionados.size})` : '+ Nueva OC', primary: true },
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

        <div style={{ display: 'flex', gap: 4, marginBottom: 20, backgroundColor: '#F3F4F6', padding: '4px', borderRadius: '10px', width: 'fit-content' }}>
          {[{ id: 'alertas' as const, label: '⚠️ Alertas de Stock' }, { id: 'oc' as const, label: '📋 Órdenes de Compra' }].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: '7px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '0.82rem', fontWeight: '600', backgroundColor: tab === t.id ? '#fff' : 'transparent', color: tab === t.id ? '#1A1A2E' : '#6B7280', boxShadow: tab === t.id ? '0 1px 4px rgba(0,0,0,0.08)' : 'none' }}>{t.label}</button>
          ))}
        </div>

        {tab === 'alertas' && (
          <div>
            {seleccionados.size > 0 && (
              <div style={{ padding: '12px 16px', backgroundColor: `${ORANGE}10`, border: `1px solid ${ORANGE}40`, borderRadius: '10px', marginBottom: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.83rem', fontWeight: '600', color: ORANGE }}>{seleccionados.size} productos seleccionados</span>
                <button style={{ padding: '6px 14px', borderRadius: '7px', border: 'none', backgroundColor: ORANGE, color: '#fff', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer' }}>
                  Crear OC automática →
                </button>
              </div>
            )}
            <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#F9FAFB' }}>
                    <th style={{ padding: '10px 14px', width: 40 }}><input type="checkbox" /></th>
                    {['Producto', 'Stock Actual', 'Mínimo', 'Sugerido', 'Proveedor', 'Costo Total', 'Urgencia'].map((h, i) => (
                      <th key={i} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '0.72rem', fontWeight: '700', color: '#9CA3AF', textTransform: 'uppercase' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {alertas.map((a, i) => (
                    <tr key={i} style={{ borderTop: '1px solid #F3F4F6', backgroundColor: seleccionados.has(a.sku) ? `${ORANGE}05` : 'transparent' }}>
                      <td style={{ padding: '12px 14px' }}>
                        <input type="checkbox" checked={seleccionados.has(a.sku)} onChange={() => toggleSel(a.sku)} />
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ fontWeight: '600', color: '#1A1A2E', fontSize: '0.85rem' }}>{a.nombre}</div>
                        <div style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>{a.sku}</div>
                      </td>
                      <td style={{ padding: '12px 14px', fontWeight: '800', fontSize: '1rem', color: a.stock === 0 ? '#DC2626' : '#D97706' }}>{a.stock}</td>
                      <td style={{ padding: '12px 14px', fontSize: '0.85rem', color: '#374151' }}>{a.minimo}</td>
                      <td style={{ padding: '12px 14px', fontWeight: '700', color: ORANGE }}>{a.pedidoSugerido} ud</td>
                      <td style={{ padding: '12px 14px', fontSize: '0.85rem', color: '#374151' }}>{a.proveedor}</td>
                      <td style={{ padding: '12px 14px', fontWeight: '700', color: '#1A1A2E' }}>${a.total.toLocaleString()}</td>
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: '700', padding: '2px 8px', borderRadius: '6px', backgroundColor: a.urgencia === 'critica' ? '#FEE2E2' : '#FEF3C7', color: a.urgencia === 'critica' ? '#DC2626' : '#D97706' }}>
                          {a.urgencia === 'critica' ? '🔴 Crítica' : '🟡 Alta'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'oc' && (
          <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#F9FAFB' }}>
                  {['OC', 'Proveedor', 'Ítems', 'Monto', 'Estado', 'Fecha', 'ETA'].map((h, i) => (
                    <th key={i} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '0.72rem', fontWeight: '700', color: '#9CA3AF', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ocPendientes.map((oc, i) => {
                  const estadoMap: Record<string, { bg: string; color: string }> = {
                    enviada:    { bg: '#DBEAFE', color: '#1D4ED8' },
                    confirmada: { bg: '#D1FAE5', color: '#059669' },
                    borrador:   { bg: '#F3F4F6', color: '#6B7280' },
                  };
                  const s = estadoMap[oc.estado];
                  return (
                    <tr key={i} style={{ borderTop: '1px solid #F3F4F6' }}>
                      <td style={{ padding: '13px 14px', fontWeight: '700', color: '#1A1A2E' }}>{oc.id}</td>
                      <td style={{ padding: '13px 14px', fontSize: '0.85rem', color: '#374151' }}>{oc.proveedor}</td>
                      <td style={{ padding: '13px 14px', fontSize: '0.85rem', color: '#374151' }}>{oc.items}</td>
                      <td style={{ padding: '13px 14px', fontWeight: '700', color: ORANGE }}>${oc.monto.toLocaleString()}</td>
                      <td style={{ padding: '13px 14px' }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: '700', padding: '2px 8px', borderRadius: '6px', backgroundColor: s.bg, color: s.color }}>{oc.estado}</span>
                      </td>
                      <td style={{ padding: '13px 14px', fontSize: '0.8rem', color: '#9CA3AF' }}>{oc.fecha}</td>
                      <td style={{ padding: '13px 14px', fontSize: '0.8rem', color: '#374151', fontWeight: '600' }}>{oc.eta}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

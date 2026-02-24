/* =====================================================
   FulfillmentView — Depósito / Wave Picking / Empaque
   ===================================================== */
import React, { useState } from 'react';
import { OrangeHeader } from '@/app/components/admin/OrangeHeader';
import type { MainSection } from '@/app/AdminDashboard';
import { Layers, Package, CheckCircle, Clock, AlertTriangle, Plus, Search, BarChart2, Users } from 'lucide-react';

const ORANGE = '#FF6835';
interface Props { onNavigate: (s: MainSection) => void; }

const waves = [
  { id: 'WAVE-001', pedidos: 18, items: 124, operario: 'Juan López', estado: 'en_progreso', inicio: '09:00', progreso: 72, prioridad: 'alta' },
  { id: 'WAVE-002', pedidos: 12, items: 89, operario: 'María Sosa', estado: 'completada', inicio: '08:00', progreso: 100, prioridad: 'normal' },
  { id: 'WAVE-003', pedidos: 22, items: 156, operario: 'Roberto Díaz', estado: 'pendiente', inicio: '10:30', progreso: 0, prioridad: 'alta' },
  { id: 'WAVE-004', pedidos: 8, items: 45, operario: 'Ana Fernández', estado: 'en_progreso', inicio: '09:30', progreso: 45, prioridad: 'normal' },
];

const lotes = [
  { id: 'LOT-2024-001', pedidos: ['ORD-8841', 'ORD-8842', 'ORD-8843'], carrier: 'OCA', zona: 'Mvd Norte', items: 28, estado: 'listo', bultos: 4 },
  { id: 'LOT-2024-002', pedidos: ['ORD-8838', 'ORD-8839'], carrier: 'Brixo', zona: 'Mvd Sur', items: 14, estado: 'empacando', bultos: 2 },
  { id: 'LOT-2024-003', pedidos: ['ORD-8836', 'ORD-8837', 'ORD-8835'], carrier: 'Correo UY', zona: 'Interior', items: 34, estado: 'preparando', bultos: 6 },
];

const materialEmpaque = [
  { material: 'Caja Grande 50x40x30', stock: 240, minimo: 50, unidad: 'ud' },
  { material: 'Caja Mediana 30x25x20', stock: 380, minimo: 100, unidad: 'ud' },
  { material: 'Caja Pequeña 20x15x10', stock: 45, minimo: 80, unidad: 'ud' },
  { material: 'Papel kraft', stock: 12, minimo: 20, unidad: 'rollos' },
  { material: 'Cinta adhesiva', stock: 28, minimo: 10, unidad: 'rollos' },
  { material: 'Burbujas protectoras', stock: 8, minimo: 15, unidad: 'rollos' },
];

const kpis = [
  { label: 'Pedidos en Cola', value: '52', color: ORANGE, icon: Package },
  { label: 'Waves Activas', value: '2', color: '#3B82F6', icon: Layers },
  { label: 'Empacados Hoy', value: '84', color: '#10B981', icon: CheckCircle },
  { label: 'Operarios', value: '4', color: '#8B5CF6', icon: Users },
];

export function FulfillmentView({ onNavigate }: Props) {
  const [tab, setTab] = useState<'waves' | 'lotes' | 'materiales'>('waves');

  const estadoColor: Record<string, { bg: string; color: string }> = {
    en_progreso: { bg: `${ORANGE}15`, color: ORANGE },
    completada:  { bg: '#D1FAE5', color: '#059669' },
    pendiente:   { bg: '#F3F4F6', color: '#6B7280' },
    listo:       { bg: '#D1FAE5', color: '#059669' },
    empacando:   { bg: `${ORANGE}15`, color: ORANGE },
    preparando:  { bg: '#DBEAFE', color: '#1D4ED8' },
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', backgroundColor: '#F8F9FA' }}>
      <OrangeHeader
        icon={Layers}
        title="Fulfillment / Picking"
        subtitle="Wave picking · Lotes · Empaque · Cola de órdenes"
        actions={[
          { label: '← Volver', onClick: () => onNavigate('logistica') },
          { label: '+ Nueva Wave', primary: true },
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
                <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#1A1A2E', lineHeight: 1 }}>{k.value}</div>
                <div style={{ fontSize: '0.72rem', color: '#6C757D' }}>{k.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 4, marginBottom: 20, backgroundColor: '#F3F4F6', padding: '4px', borderRadius: '10px', width: 'fit-content' }}>
          {[
            { id: 'waves' as const, label: '🌊 Waves de Picking' },
            { id: 'lotes' as const, label: '📦 Lotes de Empaque' },
            { id: 'materiales' as const, label: '🎁 Materiales' },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: '7px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '0.82rem', fontWeight: '600', backgroundColor: tab === t.id ? '#fff' : 'transparent', color: tab === t.id ? '#1A1A2E' : '#6B7280', boxShadow: tab === t.id ? '0 1px 4px rgba(0,0,0,0.08)' : 'none' }}>{t.label}</button>
          ))}
        </div>

        {tab === 'waves' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {waves.map(w => {
              const s = estadoColor[w.estado];
              return (
                <div key={w.id} style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div>
                        <div style={{ fontWeight: '700', color: '#1A1A2E' }}>{w.id}</div>
                        <div style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>Inicio: {w.inicio} · {w.operario}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: '0.68rem', fontWeight: '700', padding: '2px 8px', borderRadius: '5px', backgroundColor: w.prioridad === 'alta' ? '#FEE2E2' : '#F3F4F6', color: w.prioridad === 'alta' ? '#DC2626' : '#6B7280' }}>
                        {w.prioridad === 'alta' ? '🔴 Alta' : '⚪ Normal'}
                      </span>
                      <span style={{ fontSize: '0.72rem', fontWeight: '700', padding: '3px 10px', borderRadius: '6px', backgroundColor: s.bg, color: s.color }}>
                        {w.estado.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 14 }}>
                    {[
                      { label: 'Pedidos', value: w.pedidos },
                      { label: 'Ítems', value: w.items },
                      { label: 'Progreso', value: `${w.progreso}%` },
                    ].map((info, i) => (
                      <div key={i} style={{ padding: '10px', backgroundColor: '#F9FAFB', borderRadius: '8px', textAlign: 'center' }}>
                        <div style={{ fontWeight: '800', fontSize: '1.2rem', color: '#1A1A2E' }}>{info.value}</div>
                        <div style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>{info.label}</div>
                      </div>
                    ))}
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                      <span style={{ fontSize: '0.78rem', color: '#374151' }}>Progreso de picking</span>
                      <span style={{ fontSize: '0.78rem', fontWeight: '700', color: s.color }}>{w.progreso}%</span>
                    </div>
                    <div style={{ width: '100%', height: 10, backgroundColor: '#F3F4F6', borderRadius: 5, overflow: 'hidden' }}>
                      <div style={{ width: `${w.progreso}%`, height: '100%', backgroundColor: w.progreso === 100 ? '#10B981' : ORANGE, borderRadius: 5, transition: 'width 0.3s' }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {tab === 'lotes' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {lotes.map(l => {
              const s = estadoColor[l.estado];
              return (
                <div key={l.id} style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                    <div>
                      <div style={{ fontWeight: '700', color: '#1A1A2E' }}>{l.id}</div>
                      <div style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>{l.carrier} → {l.zona}</div>
                    </div>
                    <span style={{ fontSize: '0.72rem', fontWeight: '700', padding: '3px 10px', borderRadius: '6px', backgroundColor: s.bg, color: s.color }}>
                      {l.estado}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 12 }}>
                    {l.pedidos.map(p => (
                      <span key={p} style={{ fontSize: '0.75rem', padding: '3px 8px', borderRadius: '6px', backgroundColor: '#F3F4F6', color: '#374151' }}>{p}</span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: 16 }}>
                    <span style={{ fontSize: '0.8rem', color: '#374151' }}>📦 {l.items} ítems</span>
                    <span style={{ fontSize: '0.8rem', color: '#374151' }}>🎁 {l.bultos} bultos</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {tab === 'materiales' && (
          <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#F9FAFB' }}>
                  {['Material', 'Stock Actual', 'Stock Mínimo', 'Estado'].map((h, i) => (
                    <th key={i} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '0.72rem', fontWeight: '700', color: '#9CA3AF', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {materialEmpaque.map((m, i) => {
                  const ok = m.stock >= m.minimo;
                  return (
                    <tr key={i} style={{ borderTop: '1px solid #F3F4F6' }}>
                      <td style={{ padding: '13px 16px', fontWeight: '600', color: '#1A1A2E' }}>{m.material}</td>
                      <td style={{ padding: '13px 16px', fontWeight: '700', color: ok ? '#1A1A2E' : '#DC2626' }}>{m.stock} {m.unidad}</td>
                      <td style={{ padding: '13px 16px', fontSize: '0.85rem', color: '#9CA3AF' }}>{m.minimo} {m.unidad}</td>
                      <td style={{ padding: '13px 16px' }}>
                        {ok ? (
                          <span style={{ fontSize: '0.72rem', fontWeight: '700', backgroundColor: '#D1FAE5', color: '#059669', padding: '2px 8px', borderRadius: '6px' }}>✅ OK</span>
                        ) : (
                          <span style={{ fontSize: '0.72rem', fontWeight: '700', backgroundColor: '#FEE2E2', color: '#DC2626', padding: '2px 8px', borderRadius: '6px' }}>⚠️ Stock bajo</span>
                        )}
                      </td>
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

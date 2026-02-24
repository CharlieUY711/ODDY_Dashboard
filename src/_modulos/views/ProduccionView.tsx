/* =====================================================
   ProduccionView — Producción / BOM / Kits y Combos
   ===================================================== */
import React, { useState } from 'react';
import { OrangeHeader } from '@/app/components/admin/OrangeHeader';
import type { MainSection } from '@/app/AdminDashboard';
import { Package, Plus, Search, CheckCircle, Clock, AlertTriangle, ChevronDown, ChevronRight } from 'lucide-react';

const ORANGE = '#FF6835';
interface Props { onNavigate: (s: MainSection) => void; }

const ordenes = [
  { id: 'OA-2026-001', kit: 'Kit Auriculares + Funda + Cable', cantidad: 50, completadas: 38, estado: 'en_produccion', fecha: '2026-02-28', prioridad: 'alta' },
  { id: 'OA-2026-002', kit: 'Combo Laptop Stand + Teclado BT', cantidad: 25, completadas: 25, estado: 'completada', fecha: '2026-02-22', prioridad: 'normal' },
  { id: 'OA-2026-003', kit: 'Pack Welcome Box Premium', cantidad: 100, completadas: 0, estado: 'pendiente', fecha: '2026-03-05', prioridad: 'alta' },
  { id: 'OA-2026-004', kit: 'Canasta Navideña Digital', cantidad: 30, completadas: 12, estado: 'en_produccion', fecha: '2026-03-01', prioridad: 'normal' },
];

const kits = [
  {
    nombre: 'Kit Auriculares + Funda + Cable', sku: 'KIT-001', precio: 2890, stock: 48, activo: true,
    componentes: [
      { nombre: 'Auriculares Bluetooth Pro', sku: 'PRD-0001', cantidad: 1, stock: 245 },
      { nombre: 'Funda protectora universal', sku: 'PRD-0045', cantidad: 1, stock: 120 },
      { nombre: 'Cable USB-C 1m', sku: 'PRD-0067', cantidad: 1, stock: 380 },
    ],
  },
  {
    nombre: 'Pack Welcome Box Premium', sku: 'KIT-002', precio: 4500, stock: 12, activo: true,
    componentes: [
      { nombre: 'Agenda Ejecutiva 2026', sku: 'PRD-0010', cantidad: 1, stock: 320 },
      { nombre: 'Bolígrafo premium', sku: 'PRD-0089', cantidad: 2, stock: 90 },
      { nombre: 'Libreta moleskin A5', sku: 'PRD-0112', cantidad: 1, stock: 45 },
      { nombre: 'Caja de madera personalizada', sku: 'PRD-0198', cantidad: 1, stock: 8 },
    ],
  },
  {
    nombre: 'Combo Laptop Stand + Teclado BT', sku: 'KIT-003', precio: 5200, stock: 25, activo: true,
    componentes: [
      { nombre: 'Laptop Stand aluminio', sku: 'PRD-0234', cantidad: 1, stock: 67 },
      { nombre: 'Teclado Mecánico RGB', sku: 'PRD-0007', cantidad: 1, stock: 0 },
    ],
  },
];

const estadoColor: Record<string, { bg: string; color: string }> = {
  en_produccion: { bg: `${ORANGE}15`, color: ORANGE },
  completada:    { bg: '#D1FAE5', color: '#059669' },
  pendiente:     { bg: '#F3F4F6', color: '#6B7280' },
};

const kpis = [
  { label: 'Órdenes Activas', value: '2', color: ORANGE, icon: Package },
  { label: 'Kits Producidos', value: '75', color: '#10B981', icon: CheckCircle },
  { label: 'Kits Pendientes', value: '125', color: '#D97706', icon: Clock },
  { label: 'Catálogo Kits', value: '3', color: '#8B5CF6', icon: Package },
];

export function ProduccionView({ onNavigate }: Props) {
  const [tab, setTab] = useState<'ordenes' | 'catalogo'>('ordenes');
  const [expandedKit, setExpandedKit] = useState<string | null>('KIT-001');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', backgroundColor: '#F8F9FA' }}>
      <OrangeHeader
        icon={Package}
        title="Producción / Armado"
        subtitle="Órdenes de armado · BOM · Kits · Canastas · Combos"
        actions={[
          { label: '← Volver', onClick: () => onNavigate('logistica') },
          { label: '+ Nueva Orden', primary: true },
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
          {[{ id: 'ordenes' as const, label: '📋 Órdenes de Armado' }, { id: 'catalogo' as const, label: '📦 Catálogo BOM' }].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: '7px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '0.82rem', fontWeight: '600', backgroundColor: tab === t.id ? '#fff' : 'transparent', color: tab === t.id ? '#1A1A2E' : '#6B7280', boxShadow: tab === t.id ? '0 1px 4px rgba(0,0,0,0.08)' : 'none' }}>{t.label}</button>
          ))}
        </div>

        {tab === 'ordenes' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {ordenes.map(o => {
              const s = estadoColor[o.estado];
              const pct = (o.completadas / o.cantidad) * 100;
              return (
                <div key={o.id} style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
                    <div>
                      <div style={{ fontWeight: '700', color: '#1A1A2E', fontSize: '0.95rem' }}>{o.kit}</div>
                      <div style={{ fontSize: '0.75rem', color: '#9CA3AF', marginTop: 2 }}>{o.id} · Entrega: {o.fecha}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                      <span style={{ fontSize: '0.68rem', fontWeight: '700', padding: '2px 8px', borderRadius: '5px', backgroundColor: o.prioridad === 'alta' ? '#FEE2E2' : '#F3F4F6', color: o.prioridad === 'alta' ? '#DC2626' : '#6B7280' }}>
                        {o.prioridad === 'alta' ? '🔴 Alta' : '⚪ Normal'}
                      </span>
                      <span style={{ fontSize: '0.72rem', fontWeight: '700', padding: '2px 10px', borderRadius: '6px', backgroundColor: s.bg, color: s.color }}>
                        {o.estado.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                        <span style={{ fontSize: '0.78rem', color: '#374151' }}>Progreso: {o.completadas}/{o.cantidad} unidades</span>
                        <span style={{ fontSize: '0.78rem', fontWeight: '700', color: s.color }}>{pct.toFixed(0)}%</span>
                      </div>
                      <div style={{ width: '100%', height: 10, backgroundColor: '#F3F4F6', borderRadius: 5, overflow: 'hidden' }}>
                        <div style={{ width: `${pct}%`, height: '100%', backgroundColor: pct === 100 ? '#10B981' : ORANGE, borderRadius: 5 }} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {tab === 'catalogo' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {kits.map(kit => (
              <div key={kit.sku} style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
                <div onClick={() => setExpandedKit(expandedKit === kit.sku ? null : kit.sku)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '18px 20px', cursor: 'pointer' }}>
                  <div style={{ color: '#9CA3AF' }}>{expandedKit === kit.sku ? <ChevronDown size={16} /> : <ChevronRight size={16} />}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '700', color: '#1A1A2E' }}>{kit.nombre}</div>
                    <div style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>{kit.sku} · {kit.componentes.length} componentes</div>
                  </div>
                  <div style={{ display: 'flex', items: 'center', gap: 14 }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: '700', color: ORANGE }}>${kit.precio.toLocaleString()}</div>
                      <div style={{ fontSize: '0.72rem', color: kit.stock < 20 ? '#DC2626' : '#9CA3AF' }}>Stock: {kit.stock}</div>
                    </div>
                  </div>
                </div>
                {expandedKit === kit.sku && (
                  <div style={{ borderTop: '1px solid #F3F4F6', padding: '14px 20px' }}>
                    <div style={{ fontWeight: '600', color: '#374151', marginBottom: 10, fontSize: '0.83rem' }}>Bill of Materials (BOM)</div>
                    {kit.componentes.map((c, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: i < kit.componentes.length - 1 ? '1px solid #F9FAFB' : 'none' }}>
                        <div style={{ width: 24, height: 24, borderRadius: '6px', backgroundColor: `${ORANGE}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: '700', color: ORANGE, flexShrink: 0 }}>x{c.cantidad}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '0.83rem', fontWeight: '600', color: '#1A1A2E' }}>{c.nombre}</div>
                          <div style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>{c.sku}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '0.72rem', fontWeight: '700', padding: '2px 7px', borderRadius: '5px', backgroundColor: c.stock === 0 ? '#FEE2E2' : c.stock < 30 ? '#FEF3C7' : '#D1FAE5', color: c.stock === 0 ? '#DC2626' : c.stock < 30 ? '#D97706' : '#059669' }}>
                            {c.stock === 0 ? 'Sin stock' : c.stock < 30 ? `Stock bajo (${c.stock})` : `Stock OK (${c.stock})`}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

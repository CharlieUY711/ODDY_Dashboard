/* =====================================================
   ERPComprasView — Órdenes de Compra y Proveedores
   ===================================================== */
import React, { useState } from 'react';
import { OrangeHeader } from '@/app/components/admin/OrangeHeader';
import type { MainSection } from '@/app/AdminDashboard';
import { ClipboardList, Package, Users, DollarSign, TrendingUp, Plus, Search, Eye, Edit2, CheckCircle, Clock } from 'lucide-react';

const ORANGE = '#FF6835';
interface Props { onNavigate: (s: MainSection) => void; }

const ordenes = [
  { id: 'OC-2026-015', proveedor: 'SportMax UY', items: 4, monto: 245000, estado: 'aprobada', solicitante: 'María García', fecha: '2026-02-24', eta: '2026-03-01', pagado: false },
  { id: 'OC-2026-014', proveedor: 'TechImport SRL', items: 3, monto: 89000, estado: 'confirmada', solicitante: 'Carlos Díaz', fecha: '2026-02-23', eta: '2026-02-28', pagado: false },
  { id: 'OC-2026-013', proveedor: 'Ropa UY SA', items: 8, monto: 112000, estado: 'recibida', solicitante: 'Ana López', fecha: '2026-02-20', eta: '2026-02-25', pagado: true },
  { id: 'OC-2026-012', proveedor: 'LuzMás Uruguay', items: 2, monto: 18000, estado: 'borrador', solicitante: 'Roberto Fernández', fecha: '2026-02-24', eta: '—', pagado: false },
  { id: 'OC-2026-011', proveedor: 'Accesorios MX', items: 5, monto: 54000, estado: 'recibida', solicitante: 'Laura Martínez', fecha: '2026-02-18', eta: '2026-02-22', pagado: true },
];

const proveedores = [
  { id: 1, nombre: 'SportMax UY', categoria: 'Calzado & Deportes', contacto: 'Juan Martínez', email: 'j.martinez@sportmax.uy', terminos: 'Net 30', rating: 4.8, compras: 12, volumen: 980000, activo: true },
  { id: 2, nombre: 'TechImport SRL', categoria: 'Electrónica', contacto: 'Ana Gómez', email: 'ana@techimport.com', terminos: 'Contado', rating: 4.6, compras: 8, volumen: 420000, activo: true },
  { id: 3, nombre: 'Ropa UY SA', categoria: 'Indumentaria', contacto: 'Carlos Pérez', email: 'ventas@ropauy.com', terminos: 'Net 15', rating: 4.3, compras: 15, volumen: 680000, activo: true },
  { id: 4, nombre: 'LuzMás Uruguay', categoria: 'Iluminación', contacto: 'Sofia Silva', email: 'sofia@luzmas.uy', terminos: 'Net 45', rating: 4.1, compras: 4, volumen: 92000, activo: true },
  { id: 5, nombre: 'Accesorios MX', categoria: 'Accesorios varios', contacto: 'Diego Rodríguez', email: 'diego@accmx.com', terminos: 'Net 30', rating: 3.9, compras: 6, volumen: 210000, activo: false },
];

const estadoColor: Record<string, { bg: string; color: string }> = {
  borrador:   { bg: '#F3F4F6', color: '#6B7280' },
  aprobada:   { bg: '#DBEAFE', color: '#1D4ED8' },
  confirmada: { bg: `${ORANGE}15`, color: ORANGE },
  recibida:   { bg: '#D1FAE5', color: '#059669' },
  cancelada:  { bg: '#FEE2E2', color: '#DC2626' },
};

const kpis = [
  { label: 'OCs del mes', value: '15', color: '#3B82F6', icon: ClipboardList },
  { label: 'Total Comprado', value: '$518K', color: ORANGE, icon: DollarSign },
  { label: 'Proveedores', value: '5', color: '#10B981', icon: Users },
  { label: 'Pendientes de Recibir', value: '2', color: '#D97706', icon: Package },
];

export function ERPComprasView({ onNavigate }: Props) {
  const [tab, setTab] = useState<'ordenes' | 'proveedores' | 'nueva'>('ordenes');
  const [search, setSearch] = useState('');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', backgroundColor: '#F8F9FA' }}>
      <OrangeHeader
        icon={ClipboardList}
        title="Compras"
        subtitle="Órdenes de compra · Gestión de proveedores · Control de costos"
        actions={[
          { label: '← Volver', onClick: () => onNavigate('gestion') },
          { label: '+ Nueva OC', primary: true },
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
          {[{ id: 'ordenes' as const, label: '📋 Órdenes' }, { id: 'proveedores' as const, label: '🏭 Proveedores' }, { id: 'nueva' as const, label: '+ Nueva OC' }].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: '7px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '0.82rem', fontWeight: '600', backgroundColor: tab === t.id ? '#fff' : 'transparent', color: tab === t.id ? '#1A1A2E' : '#6B7280', boxShadow: tab === t.id ? '0 1px 4px rgba(0,0,0,0.08)' : 'none' }}>{t.label}</button>
          ))}
        </div>

        {tab === 'ordenes' && (
          <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
            <div style={{ padding: '14px 16px', borderBottom: '1px solid #F3F4F6', display: 'flex', gap: 10 }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search size={13} color="#9CA3AF" style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)' }} />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar OC..." style={{ width: '100%', paddingLeft: 28, paddingRight: 10, paddingTop: 7, paddingBottom: 7, border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '0.82rem', outline: 'none' }} />
              </div>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#F9FAFB' }}>
                  {['Nº OC', 'Proveedor', 'Solicitante', 'Ítems', 'Monto', 'Estado', 'Fecha', 'ETA', 'Pago'].map((h, i) => (
                    <th key={i} style={{ padding: '10px 12px', textAlign: 'left', fontSize: '0.7rem', fontWeight: '700', color: '#9CA3AF', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ordenes.filter(o => o.id.includes(search) || o.proveedor.toLowerCase().includes(search.toLowerCase())).map((oc, i) => {
                  const s = estadoColor[oc.estado];
                  return (
                    <tr key={i} style={{ borderTop: '1px solid #F3F4F6' }}>
                      <td style={{ padding: '12px 12px', fontWeight: '700', color: '#1A1A2E', fontSize: '0.83rem' }}>{oc.id}</td>
                      <td style={{ padding: '12px 12px', fontSize: '0.85rem', color: '#374151' }}>{oc.proveedor}</td>
                      <td style={{ padding: '12px 12px', fontSize: '0.83rem', color: '#9CA3AF' }}>{oc.solicitante}</td>
                      <td style={{ padding: '12px 12px', fontSize: '0.85rem', color: '#374151', textAlign: 'center' }}>{oc.items}</td>
                      <td style={{ padding: '12px 12px', fontWeight: '700', color: ORANGE }}>${oc.monto.toLocaleString()}</td>
                      <td style={{ padding: '12px 12px' }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: '700', padding: '2px 8px', borderRadius: '5px', backgroundColor: s.bg, color: s.color }}>{oc.estado}</span>
                      </td>
                      <td style={{ padding: '12px 12px', fontSize: '0.8rem', color: '#9CA3AF' }}>{oc.fecha}</td>
                      <td style={{ padding: '12px 12px', fontSize: '0.8rem', color: '#374151' }}>{oc.eta}</td>
                      <td style={{ padding: '12px 12px' }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: '700', padding: '2px 8px', borderRadius: '5px', backgroundColor: oc.pagado ? '#D1FAE5' : '#FEF3C7', color: oc.pagado ? '#059669' : '#D97706' }}>
                          {oc.pagado ? '✅ Pagado' : '⏳ Pend.'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'proveedores' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 14 }}>
            {proveedores.map(p => (
              <div key={p.id} style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '18px', opacity: p.activo ? 1 : 0.6 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div>
                    <div style={{ fontWeight: '800', color: '#1A1A2E' }}>{p.nombre}</div>
                    <div style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>{p.categoria}</div>
                  </div>
                  <span style={{ fontSize: '0.68rem', fontWeight: '700', padding: '2px 7px', borderRadius: '5px', backgroundColor: p.activo ? '#D1FAE5' : '#F3F4F6', color: p.activo ? '#059669' : '#9CA3AF' }}>
                    {p.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
                  <div style={{ padding: '8px', backgroundColor: '#F9FAFB', borderRadius: '7px' }}>
                    <div style={{ fontSize: '0.65rem', color: '#9CA3AF' }}>TÉRMINOS</div>
                    <div style={{ fontWeight: '700', color: '#1A1A2E', fontSize: '0.83rem' }}>{p.terminos}</div>
                  </div>
                  <div style={{ padding: '8px', backgroundColor: '#F9FAFB', borderRadius: '7px' }}>
                    <div style={{ fontSize: '0.65rem', color: '#9CA3AF' }}>RATING</div>
                    <div style={{ fontWeight: '700', color: '#F59E0B', fontSize: '0.83rem' }}>⭐ {p.rating}</div>
                  </div>
                  <div style={{ padding: '8px', backgroundColor: '#F9FAFB', borderRadius: '7px' }}>
                    <div style={{ fontSize: '0.65rem', color: '#9CA3AF' }}>COMPRAS</div>
                    <div style={{ fontWeight: '700', color: '#1A1A2E', fontSize: '0.83rem' }}>{p.compras} OC</div>
                  </div>
                  <div style={{ padding: '8px', backgroundColor: '#F9FAFB', borderRadius: '7px' }}>
                    <div style={{ fontSize: '0.65rem', color: '#9CA3AF' }}>VOLUMEN</div>
                    <div style={{ fontWeight: '700', color: ORANGE, fontSize: '0.83rem' }}>${(p.volumen / 1000).toFixed(0)}K</div>
                  </div>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#9CA3AF' }}>{p.contacto} · {p.email}</div>
              </div>
            ))}
          </div>
        )}

        {tab === 'nueva' && (
          <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '28px', maxWidth: 700 }}>
            <div style={{ fontWeight: '800', color: '#1A1A2E', fontSize: '1.1rem', marginBottom: 22 }}>📋 Nueva Orden de Compra</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              {[
                { label: 'Proveedor', placeholder: 'Seleccionar proveedor...' },
                { label: 'Solicitante', placeholder: 'Tu nombre' },
                { label: 'Fecha de necesidad', placeholder: 'dd/mm/aaaa' },
                { label: 'Centro de costo', placeholder: 'Ej: Logística, Ventas...' },
              ].map((f, i) => (
                <div key={i}>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '600', color: '#374151', marginBottom: 5 }}>{f.label}</label>
                  <input placeholder={f.placeholder} style={{ width: '100%', padding: '9px 12px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box' }} />
                </div>
              ))}
            </div>
            <div style={{ border: '1px solid #E5E7EB', borderRadius: '10px', overflow: 'hidden', marginBottom: 16 }}>
              <div style={{ padding: '10px 14px', backgroundColor: '#F9FAFB', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 8 }}>
                {['Producto/SKU', 'Cantidad', 'Precio unit.', 'Total'].map((h, i) => (
                  <span key={i} style={{ fontSize: '0.72rem', fontWeight: '700', color: '#9CA3AF' }}>{h}</span>
                ))}
              </div>
              {[1, 2].map(i => (
                <div key={i} style={{ padding: '8px 14px', borderTop: '1px solid #F3F4F6', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 8 }}>
                  <input placeholder="SKU o nombre del producto" style={{ padding: '6px 8px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '0.82rem', outline: 'none' }} />
                  <input type="number" placeholder="0" style={{ padding: '6px 8px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '0.82rem', outline: 'none' }} />
                  <input type="number" placeholder="$0" style={{ padding: '6px 8px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '0.82rem', outline: 'none' }} />
                  <div style={{ padding: '6px 8px', backgroundColor: '#F9FAFB', borderRadius: '6px', fontSize: '0.82rem', color: '#9CA3AF' }}>—</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button style={{ padding: '10px 20px', borderRadius: '9px', border: '1px solid #E5E7EB', backgroundColor: '#F9FAFB', color: '#374151', fontWeight: '600', cursor: 'pointer', fontSize: '0.85rem' }}>
                Guardar borrador
              </button>
              <button style={{ padding: '10px 20px', borderRadius: '9px', border: 'none', backgroundColor: ORANGE, color: '#fff', fontWeight: '700', cursor: 'pointer', fontSize: '0.85rem' }}>
                Enviar para aprobación →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

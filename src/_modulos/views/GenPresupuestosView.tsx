/* =====================================================
   GenPresupuestosView — Generador de Presupuestos PDF
   Ítems · IVA · Descuentos · Multi-moneda
   ===================================================== */
import React, { useState } from 'react';
import { OrangeHeader } from '@/app/components/admin/OrangeHeader';
import type { MainSection } from '@/app/AdminDashboard';
import { DollarSign, Plus, Trash2, Download, Eye, FileText, Settings } from 'lucide-react';

const ORANGE = '#FF6835';
interface Props { onNavigate: (s: MainSection) => void; }

interface Item { id: number; descripcion: string; cantidad: number; precioUnit: number; descuento: number; }

const presupuestosGuardados = [
  { id: 'PRES-001', cliente: 'Tech Solutions UY', monto: 48900, fecha: '2026-02-22', estado: 'enviado', moneda: 'UYU' },
  { id: 'PRES-002', cliente: 'Supermercados Rivera', monto: 12400, fecha: '2026-02-20', estado: 'aprobado', moneda: 'UYU' },
  { id: 'PRES-003', cliente: 'Farmacia Central', monto: 8200, fecha: '2026-02-18', estado: 'pendiente', moneda: 'USD' },
  { id: 'PRES-004', cliente: 'Constructora Norte', monto: 156000, fecha: '2026-02-10', estado: 'vencido', moneda: 'UYU' },
];

export function GenPresupuestosWorkspace({ onNavigate }: Props) {
  const [tab, setTab] = useState<'nuevo' | 'lista'>('lista');
  const [items, setItems] = useState<Item[]>([
    { id: 1, descripcion: 'Auriculares Bluetooth Pro', cantidad: 10, precioUnit: 1890, descuento: 5 },
    { id: 2, descripcion: 'Silla Ergonómica Home Office', cantidad: 2, precioUnit: 8900, descuento: 10 },
  ]);
  const [moneda, setMoneda] = useState('UYU');
  const [iva, setIva] = useState(22);
  const [clienteNombre, setClienteNombre] = useState('');

  const agregar = () => setItems(p => [...p, { id: Date.now(), descripcion: '', cantidad: 1, precioUnit: 0, descuento: 0 }]);
  const actualizar = (id: number, field: keyof Item, val: string | number) => setItems(p => p.map(i => i.id === id ? { ...i, [field]: val } : i));
  const eliminar = (id: number) => setItems(p => p.filter(i => i.id !== id));

  const subtotal = items.reduce((acc, i) => acc + i.cantidad * i.precioUnit * (1 - i.descuento / 100), 0);
  const montoIva = subtotal * (iva / 100);
  const total = subtotal + montoIva;

  const simbolo = moneda === 'USD' ? 'U$S' : '$';

  const estadoColor: Record<string, { bg: string; color: string }> = {
    enviado: { bg: '#DBEAFE', color: '#1D4ED8' }, aprobado: { bg: '#D1FAE5', color: '#059669' },
    pendiente: { bg: '#FEF3C7', color: '#D97706' }, vencido: { bg: '#FEE2E2', color: '#DC2626' },
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', backgroundColor: '#F8F9FA' }}>
      <OrangeHeader
        icon={DollarSign}
        title="Generador de Presupuestos"
        subtitle="Presupuestos profesionales · Export PDF · Multi-moneda"
        actions={[
          { label: '← Volver', onClick: () => onNavigate('herramientas') },
          { label: tab === 'nuevo' ? '📋 Ver Lista' : '+ Nuevo Presupuesto', onClick: () => setTab(tab === 'nuevo' ? 'lista' : 'nuevo'), primary: true },
        ]}
      />
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
        {tab === 'lista' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 8 }}>
              {[
                { label: 'Enviados', value: 1, color: '#3B82F6' }, { label: 'Aprobados', value: 1, color: '#10B981' },
                { label: 'Pendientes', value: 1, color: '#D97706' }, { label: 'Vencidos', value: 1, color: '#EF4444' },
              ].map((k, i) => (
                <div key={i} style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '14px 18px' }}>
                  <div style={{ fontSize: '1.6rem', fontWeight: '800', color: k.color }}>{k.value}</div>
                  <div style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>{k.label}</div>
                </div>
              ))}
            </div>
            <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#F9FAFB' }}>
                    {['Nº', 'Cliente', 'Moneda', 'Monto', 'Estado', 'Fecha', ''].map((h, i) => (
                      <th key={i} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '0.72rem', fontWeight: '700', color: '#9CA3AF', textTransform: 'uppercase' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {presupuestosGuardados.map((p, i) => {
                    const s = estadoColor[p.estado];
                    return (
                      <tr key={i} style={{ borderTop: '1px solid #F3F4F6' }}>
                        <td style={{ padding: '12px 14px', fontWeight: '700', color: '#1A1A2E' }}>{p.id}</td>
                        <td style={{ padding: '12px 14px', fontSize: '0.85rem', color: '#374151' }}>{p.cliente}</td>
                        <td style={{ padding: '12px 14px', fontSize: '0.82rem', color: '#9CA3AF' }}>{p.moneda}</td>
                        <td style={{ padding: '12px 14px', fontWeight: '700', color: ORANGE }}>{p.moneda === 'USD' ? 'U$S' : '$'}{p.monto.toLocaleString()}</td>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{ fontSize: '0.7rem', fontWeight: '700', padding: '2px 8px', borderRadius: '5px', backgroundColor: s.bg, color: s.color }}>{p.estado}</span>
                        </td>
                        <td style={{ padding: '12px 14px', fontSize: '0.8rem', color: '#9CA3AF' }}>{p.fecha}</td>
                        <td style={{ padding: '12px 14px' }}>
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button style={{ padding: '4px 8px', border: '1px solid #E5E7EB', borderRadius: '6px', backgroundColor: '#F9FAFB', cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 3 }}>
                              <Eye size={12} /> Ver
                            </button>
                            <button style={{ padding: '4px 8px', border: '1px solid #E5E7EB', borderRadius: '6px', backgroundColor: '#F9FAFB', cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 3 }}>
                              <Download size={12} /> PDF
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'nuevo' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>
            {/* Editor */}
            <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '24px' }}>
              <div style={{ fontWeight: '700', color: '#1A1A2E', marginBottom: 18 }}>✍️ Datos del Presupuesto</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '600', color: '#374151', marginBottom: 5 }}>Cliente</label>
                  <input value={clienteNombre} onChange={e => setClienteNombre(e.target.value)} placeholder="Nombre del cliente" style={{ width: '100%', padding: '8px 12px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '600', color: '#374151', marginBottom: 5 }}>Moneda</label>
                  <select value={moneda} onChange={e => setMoneda(e.target.value)} style={{ width: '100%', padding: '8px 12px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '0.85rem', outline: 'none' }}>
                    <option value="UYU">Pesos UYU ($)</option>
                    <option value="USD">Dólares USD (U$S)</option>
                    <option value="ARS">Pesos ARS</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '600', color: '#374151', marginBottom: 5 }}>IVA (%)</label>
                  <input type="number" value={iva} onChange={e => setIva(Number(e.target.value))} style={{ width: '100%', padding: '8px 12px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '600', color: '#374151', marginBottom: 5 }}>Validez (días)</label>
                  <input type="number" defaultValue={30} style={{ width: '100%', padding: '8px 12px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box' }} />
                </div>
              </div>

              {/* Tabla de ítems */}
              <div style={{ border: '1px solid #E5E7EB', borderRadius: '10px', overflow: 'hidden', marginBottom: 14 }}>
                <div style={{ padding: '10px 14px', backgroundColor: '#F9FAFB', display: 'grid', gridTemplateColumns: '2fr 80px 100px 80px 1fr 36px', gap: 8, alignItems: 'center' }}>
                  {['Descripción', 'Cant.', 'Precio unit.', 'Desc.%', 'Subtotal', ''].map((h, i) => (
                    <span key={i} style={{ fontSize: '0.68rem', fontWeight: '700', color: '#9CA3AF', textTransform: 'uppercase' }}>{h}</span>
                  ))}
                </div>
                {items.map(it => (
                  <div key={it.id} style={{ padding: '8px 14px', borderTop: '1px solid #F3F4F6', display: 'grid', gridTemplateColumns: '2fr 80px 100px 80px 1fr 36px', gap: 8, alignItems: 'center' }}>
                    <input value={it.descripcion} onChange={e => actualizar(it.id, 'descripcion', e.target.value)} placeholder="Producto o servicio" style={{ padding: '6px 8px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '0.82rem', outline: 'none' }} />
                    <input type="number" value={it.cantidad} onChange={e => actualizar(it.id, 'cantidad', Number(e.target.value))} style={{ padding: '6px 8px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '0.82rem', outline: 'none', textAlign: 'center' }} />
                    <input type="number" value={it.precioUnit} onChange={e => actualizar(it.id, 'precioUnit', Number(e.target.value))} style={{ padding: '6px 8px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '0.82rem', outline: 'none', textAlign: 'right' }} />
                    <input type="number" value={it.descuento} onChange={e => actualizar(it.id, 'descuento', Number(e.target.value))} min={0} max={100} style={{ padding: '6px 8px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '0.82rem', outline: 'none', textAlign: 'center' }} />
                    <div style={{ padding: '6px 8px', backgroundColor: '#F9FAFB', borderRadius: '6px', fontSize: '0.82rem', fontWeight: '600', color: ORANGE, textAlign: 'right' }}>
                      {simbolo}{(it.cantidad * it.precioUnit * (1 - it.descuento / 100)).toLocaleString('es', { maximumFractionDigits: 0 })}
                    </div>
                    <button onClick={() => eliminar(it.id)} style={{ width: 28, height: 28, borderRadius: '6px', border: '1px solid #FEE2E2', backgroundColor: '#FFF5F5', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Trash2 size={12} color="#EF4444" />
                    </button>
                  </div>
                ))}
                <div style={{ padding: '10px 14px', borderTop: '1px dashed #E5E7EB' }}>
                  <button onClick={agregar} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', border: `1px dashed ${ORANGE}`, borderRadius: '7px', backgroundColor: `${ORANGE}08`, color: ORANGE, fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' }}>
                    <Plus size={13} /> Agregar ítem
                  </button>
                </div>
              </div>
            </div>

            {/* Preview y totales */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '20px' }}>
                <div style={{ fontWeight: '700', color: '#1A1A2E', marginBottom: 14 }}>📊 Resumen</div>
                {[
                  { label: 'Subtotal', value: `${simbolo}${subtotal.toLocaleString('es', { maximumFractionDigits: 0 })}` },
                  { label: `IVA ${iva}%`, value: `${simbolo}${montoIva.toLocaleString('es', { maximumFractionDigits: 0 })}` },
                ].map((t, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F9FAFB' }}>
                    <span style={{ fontSize: '0.83rem', color: '#374151' }}>{t.label}</span>
                    <span style={{ fontSize: '0.83rem', color: '#374151' }}>{t.value}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderTop: '2px solid #E5E7EB', marginTop: 4 }}>
                  <span style={{ fontWeight: '800', color: '#1A1A2E' }}>TOTAL</span>
                  <span style={{ fontWeight: '900', fontSize: '1.2rem', color: ORANGE }}>{simbolo}{total.toLocaleString('es', { maximumFractionDigits: 0 })}</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <button style={{ padding: '12px', borderRadius: '10px', border: 'none', backgroundColor: ORANGE, color: '#fff', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <Download size={16} /> Exportar PDF
                </button>
                <button style={{ padding: '12px', borderRadius: '10px', border: '1px solid #E5E7EB', backgroundColor: '#F9FAFB', color: '#374151', fontWeight: '600', cursor: 'pointer' }}>
                  📧 Enviar por email
                </button>
                <button style={{ padding: '12px', borderRadius: '10px', border: '1px solid #E5E7EB', backgroundColor: '#F9FAFB', color: '#374151', fontWeight: '600', cursor: 'pointer' }}>
                  💾 Guardar borrador
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

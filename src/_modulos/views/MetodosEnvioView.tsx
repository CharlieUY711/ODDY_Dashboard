/* =====================================================
   MetodosEnvioView — Zonas y Tarifas de Entrega
   ===================================================== */
import React, { useState } from 'react';
import { OrangeHeader } from '@/app/components/admin/OrangeHeader';
import type { MainSection } from '@/app/AdminDashboard';
import { MapPin, Truck, DollarSign, Plus, Edit2, Trash2, ChevronDown, ChevronRight } from 'lucide-react';

const ORANGE = '#FF6835';
interface Props { onNavigate: (s: MainSection) => void; }

const zonas = [
  {
    id: 'z1', nombre: 'Montevideo Capital', activa: true, enviosTotal: 1240, carrier: 'OCA',
    tarifas: [
      { peso: '0–1 kg', precio: 180, plazo: '24h' },
      { peso: '1–3 kg', precio: 220, plazo: '24h' },
      { peso: '3–5 kg', precio: 280, plazo: '48h' },
      { peso: '5–10 kg', precio: 380, plazo: '48h' },
    ],
  },
  {
    id: 'z2', nombre: 'Canelones / San José', activa: true, enviosTotal: 380, carrier: 'OCA / Brixo',
    tarifas: [
      { peso: '0–1 kg', precio: 220, plazo: '48h' },
      { peso: '1–3 kg', precio: 270, plazo: '48h' },
      { peso: '3–5 kg', precio: 320, plazo: '48–72h' },
      { peso: '5–10 kg', precio: 420, plazo: '72h' },
    ],
  },
  {
    id: 'z3', nombre: 'Maldonado / Rocha', activa: true, enviosTotal: 180, carrier: 'Correo UY',
    tarifas: [
      { peso: '0–1 kg', precio: 260, plazo: '48h' },
      { peso: '1–3 kg', precio: 320, plazo: '48–72h' },
      { peso: '3–5 kg', precio: 380, plazo: '72h' },
    ],
  },
  {
    id: 'z4', nombre: 'Interior (resto)', activa: true, enviosTotal: 220, carrier: 'Correo UY',
    tarifas: [
      { peso: '0–1 kg', precio: 350, plazo: '72h' },
      { peso: '1–3 kg', precio: 420, plazo: '72–96h' },
      { peso: '3–5 kg', precio: 520, plazo: '96h' },
    ],
  },
  {
    id: 'z5', nombre: 'Internacional (Argentina)', activa: false, enviosTotal: 28, carrier: 'FedEx / DHL',
    tarifas: [
      { peso: '0–0.5 kg', precio: 1200, plazo: '3–5 días' },
      { peso: '0.5–1 kg', precio: 1800, plazo: '3–5 días' },
    ],
  },
];

const metodosEspeciales = [
  { nombre: 'Retiro en sucursal', desc: 'Montevideo centro · Lu-Vi 10-18hs', precio: 0, activo: true, emoji: '🏪' },
  { nombre: 'Entrega Express (mismo día)', desc: 'Solo Mvd Capital · Pedidos antes de las 14hs', precio: 450, activo: true, emoji: '⚡' },
  { nombre: 'Agentes Redpagos', desc: 'Red de 1.200 puntos en Uruguay', precio: 120, activo: true, emoji: '🔴' },
  { nombre: 'Punto de entrega OCA', desc: 'Sucursales OCA en todo el país', precio: 140, activo: true, emoji: '🔵' },
];

export function MetodosEnvioView({ onNavigate }: Props) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['z1']));
  const toggle = (id: string) => setExpanded(p => { const s = new Set(p); s.has(id) ? s.delete(id) : s.add(id); return s; });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', backgroundColor: '#F8F9FA' }}>
      <OrangeHeader
        icon={MapPin}
        title="Métodos de Envío"
        subtitle="Zonas geográficas · Tarifas por peso · Opciones de entrega"
        actions={[
          { label: '← Volver', onClick: () => onNavigate('sistema') },
          { label: '+ Nueva Zona', primary: true },
        ]}
      />
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 22 }}>
          {[
            { label: 'Zonas activas', value: zonas.filter(z => z.activa).length, color: '#10B981' },
            { label: 'Carriers configurados', value: 5, color: ORANGE },
            { label: 'Envíos gestionados', value: '2.048', color: '#3B82F6' },
            { label: 'Tarifa base mínima', value: '$120', color: '#8B5CF6' },
          ].map((k, i) => (
            <div key={i} style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '18px 20px' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: k.color, lineHeight: 1 }}>{k.value}</div>
              <div style={{ fontSize: '0.75rem', color: '#6C757D', marginTop: 4 }}>{k.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>
          {/* Zonas con tarifas */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ fontWeight: '700', color: '#1A1A2E', marginBottom: 4 }}>📍 Zonas y Tarifas por Peso</div>
            {zonas.map(z => (
              <div key={z.id} style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
                <div onClick={() => toggle(z.id)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px', cursor: 'pointer' }}>
                  <div style={{ color: '#9CA3AF' }}>{expanded.has(z.id) ? <ChevronDown size={14} /> : <ChevronRight size={14} />}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '700', color: '#1A1A2E', fontSize: '0.88rem' }}>{z.nombre}</div>
                    <div style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>{z.carrier} · {z.enviosTotal.toLocaleString()} envíos</div>
                  </div>
                  <label style={{ position: 'relative', display: 'inline-block', width: 38, height: 20, cursor: 'pointer' }} onClick={e => e.stopPropagation()}>
                    <input type="checkbox" defaultChecked={z.activa} style={{ opacity: 0, width: 0, height: 0 }} />
                    <span style={{ position: 'absolute', inset: 0, borderRadius: 10, backgroundColor: z.activa ? '#10B981' : '#D1D5DB' }} />
                    <span style={{ position: 'absolute', height: 14, width: 14, left: z.activa ? 21 : 3, bottom: 3, backgroundColor: '#fff', borderRadius: '50%' }} />
                  </label>
                </div>
                {expanded.has(z.id) && (
                  <div style={{ borderTop: '1px solid #F3F4F6', padding: '12px 16px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr>
                          {['Peso', 'Precio', 'Plazo', ''].map((h, i) => (
                            <th key={i} style={{ padding: '6px 8px', textAlign: 'left', fontSize: '0.68rem', fontWeight: '700', color: '#9CA3AF', textTransform: 'uppercase' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {z.tarifas.map((t, i) => (
                          <tr key={i} style={{ borderTop: '1px solid #F9FAFB' }}>
                            <td style={{ padding: '7px 8px', fontSize: '0.82rem', color: '#374151' }}>{t.peso}</td>
                            <td style={{ padding: '7px 8px', fontWeight: '700', color: ORANGE }}>${t.precio}</td>
                            <td style={{ padding: '7px 8px', fontSize: '0.82rem', color: '#9CA3AF' }}>{t.plazo}</td>
                            <td style={{ padding: '7px 8px' }}>
                              <button style={{ padding: '3px 6px', border: '1px solid #E5E7EB', borderRadius: '5px', backgroundColor: '#F9FAFB', cursor: 'pointer' }}><Edit2 size={11} color="#6B7280" /></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <button style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', border: `1px dashed ${ORANGE}`, borderRadius: '7px', backgroundColor: `${ORANGE}08`, color: ORANGE, fontSize: '0.78rem', cursor: 'pointer' }}>
                      <Plus size={12} /> Agregar franja
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Panel derecho */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '18px' }}>
              <div style={{ fontWeight: '700', color: '#1A1A2E', marginBottom: 12, fontSize: '0.88rem' }}>🏪 Métodos Especiales</div>
              {metodosEspeciales.map((m, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: i < metodosEspeciales.length - 1 ? '1px solid #F9FAFB' : 'none' }}>
                  <span style={{ fontSize: '1.3rem' }}>{m.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', color: '#1A1A2E', fontSize: '0.83rem' }}>{m.nombre}</div>
                    <div style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>{m.desc}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: '700', color: m.precio === 0 ? '#10B981' : ORANGE, fontSize: '0.85rem' }}>{m.precio === 0 ? 'Gratis' : `$${m.precio}`}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '18px' }}>
              <div style={{ fontWeight: '700', color: '#1A1A2E', marginBottom: 12, fontSize: '0.88rem' }}>⚙️ Reglas Globales</div>
              {[
                { label: 'Envío gratis desde', value: '$10.000' },
                { label: 'Dimensión máxima', value: '100x80x60 cm' },
                { label: 'Peso máximo', value: '30 kg' },
                { label: 'Seguro de envío', value: 'Obligatorio +$5.000' },
              ].map((r, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < 3 ? '1px solid #F9FAFB' : 'none' }}>
                  <span style={{ fontSize: '0.82rem', color: '#374151' }}>{r.label}</span>
                  <span style={{ fontSize: '0.82rem', fontWeight: '600', color: '#1A1A2E' }}>{r.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

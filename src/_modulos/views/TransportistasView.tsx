/* =====================================================
   TransportistasView — Catálogo de Carriers y Tarifas
   ===================================================== */
import React, { useState } from 'react';
import { OrangeHeader } from '@/app/components/admin/OrangeHeader';
import type { MainSection } from '@/app/AdminDashboard';
import { Users, Truck, DollarSign, MapPin, Star, Plus, Search, ChevronRight, Package } from 'lucide-react';

const ORANGE = '#FF6835';
interface Props { onNavigate: (s: MainSection) => void; }

const carriers = [
  { id: 1, nombre: 'OCA', logo: '🔵', tipo: 'Nacional', zonas: 19, tarifaBase: 180, plazo: '24-48h', activo: true, rating: 4.8, envios: 1240, cobertura: 'Todo Uruguay' },
  { id: 2, nombre: 'Correo Uruguayo', logo: '🟡', tipo: 'Nacional', zonas: 19, tarifaBase: 140, plazo: '48-72h', activo: true, rating: 4.2, envios: 890, cobertura: 'Todo Uruguay' },
  { id: 3, nombre: 'Brixo', logo: '🟢', tipo: 'Nacional', zonas: 8, tarifaBase: 160, plazo: '24h', activo: true, rating: 4.6, envios: 620, cobertura: 'Mvd + GBA' },
  { id: 4, nombre: 'Mosca', logo: '🔴', tipo: 'Nacional', zonas: 6, tarifaBase: 150, plazo: '24-48h', activo: true, rating: 4.3, envios: 340, cobertura: 'Mvd + Canelones' },
  { id: 5, nombre: 'FedEx', logo: '🟣', tipo: 'Internacional', zonas: 220, tarifaBase: 1200, plazo: '3-5 días', activo: true, rating: 4.7, envios: 45, cobertura: 'Internacional' },
  { id: 6, nombre: 'DHL', logo: '🟡', tipo: 'Internacional', zonas: 220, tarifaBase: 1400, plazo: '2-4 días', activo: false, rating: 4.9, envios: 18, cobertura: 'Internacional' },
  { id: 7, nombre: 'PedidosYa', logo: '🟠', tipo: 'Express', zonas: 3, tarifaBase: 220, plazo: 'Mismo día', activo: true, rating: 4.1, envios: 280, cobertura: 'Mvd Centro' },
];

const tarifas = [
  { zona: 'Montevideo Capital', precio: 180, peso: '0-5kg', carrier: 'OCA', plazo: '24h' },
  { zona: 'Montevideo Periferia', precio: 210, peso: '0-5kg', carrier: 'OCA', plazo: '48h' },
  { zona: 'Canelones', precio: 250, peso: '0-5kg', carrier: 'Brixo', plazo: '48h' },
  { zona: 'San José / Florida', precio: 290, peso: '0-5kg', carrier: 'Correo UY', plazo: '48-72h' },
  { zona: 'Interior resto', precio: 380, peso: '0-5kg', carrier: 'Correo UY', plazo: '72h' },
  { zona: 'Tacuarembó / Rivera', precio: 420, peso: '0-5kg', carrier: 'Correo UY', plazo: '96h' },
];

const kpis = [
  { label: 'Carriers Activos', value: '6', color: ORANGE, icon: Truck },
  { label: 'Envíos este mes', value: '3.437', color: '#3B82F6', icon: Package },
  { label: 'Rating Promedio', value: '4.5', color: '#F59E0B', icon: Star },
  { label: 'Costo Promedio', value: '$195', color: '#10B981', icon: DollarSign },
];

export function TransportistasView({ onNavigate }: Props) {
  const [tab, setTab] = useState<'carriers' | 'tarifas' | 'simulador'>('carriers');
  const [peso, setPeso] = useState('2');
  const [zona, setZona] = useState('Montevideo Capital');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', backgroundColor: '#F8F9FA' }}>
      <OrangeHeader
        icon={Users}
        title="Transportistas"
        subtitle="Catálogo de carriers · Tramos · Tarifas · Simulador"
        actions={[
          { label: '← Volver', onClick: () => onNavigate('logistica') },
          { label: '+ Agregar Carrier', primary: true },
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
          {[{ id: 'carriers' as const, label: '🚛 Carriers' }, { id: 'tarifas' as const, label: '💰 Tarifas' }, { id: 'simulador' as const, label: '🧮 Simulador' }].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: '7px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '0.82rem', fontWeight: '600', backgroundColor: tab === t.id ? '#fff' : 'transparent', color: tab === t.id ? '#1A1A2E' : '#6B7280', boxShadow: tab === t.id ? '0 1px 4px rgba(0,0,0,0.08)' : 'none' }}>{t.label}</button>
          ))}
        </div>

        {tab === 'carriers' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 16 }}>
            {carriers.map(c => (
              <div key={c.id} style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: '1.6rem' }}>{c.logo}</span>
                    <div>
                      <div style={{ fontWeight: '800', color: '#1A1A2E' }}>{c.nombre}</div>
                      <div style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>{c.tipo}</div>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.7rem', fontWeight: '700', padding: '2px 8px', borderRadius: '6px', backgroundColor: c.activo ? '#D1FAE5' : '#F3F4F6', color: c.activo ? '#059669' : '#6B7280' }}>
                    {c.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
                  <div style={{ padding: '8px 10px', backgroundColor: '#F9FAFB', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.68rem', color: '#9CA3AF' }}>TARIFA BASE</div>
                    <div style={{ fontWeight: '700', color: '#1A1A2E', fontSize: '0.95rem' }}>${c.tarifaBase}</div>
                  </div>
                  <div style={{ padding: '8px 10px', backgroundColor: '#F9FAFB', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.68rem', color: '#9CA3AF' }}>PLAZO</div>
                    <div style={{ fontWeight: '700', color: '#1A1A2E', fontSize: '0.95rem' }}>{c.plazo}</div>
                  </div>
                  <div style={{ padding: '8px 10px', backgroundColor: '#F9FAFB', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.68rem', color: '#9CA3AF' }}>ENVÍOS/MES</div>
                    <div style={{ fontWeight: '700', color: ORANGE, fontSize: '0.95rem' }}>{c.envios.toLocaleString()}</div>
                  </div>
                  <div style={{ padding: '8px 10px', backgroundColor: '#F9FAFB', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.68rem', color: '#9CA3AF' }}>RATING</div>
                    <div style={{ fontWeight: '700', color: '#F59E0B', fontSize: '0.95rem' }}>⭐ {c.rating}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 8px', backgroundColor: '#F9FAFB', borderRadius: '6px' }}>
                  <MapPin size={12} color="#9CA3AF" />
                  <span style={{ fontSize: '0.75rem', color: '#374151' }}>{c.cobertura} · {c.zonas} zonas</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'tarifas' && (
          <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#F9FAFB' }}>
                  {['Zona', 'Carrier', 'Peso máx.', 'Precio', 'Plazo'].map((h, i) => (
                    <th key={i} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '0.72rem', fontWeight: '700', color: '#9CA3AF', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tarifas.map((t, i) => (
                  <tr key={i} style={{ borderTop: '1px solid #F3F4F6' }}>
                    <td style={{ padding: '13px 16px', fontWeight: '600', color: '#1A1A2E', fontSize: '0.85rem' }}>{t.zona}</td>
                    <td style={{ padding: '13px 16px', fontSize: '0.85rem', color: '#374151' }}>{t.carrier}</td>
                    <td style={{ padding: '13px 16px', fontSize: '0.85rem', color: '#374151' }}>{t.peso}</td>
                    <td style={{ padding: '13px 16px', fontWeight: '700', color: ORANGE, fontSize: '0.9rem' }}>${t.precio}</td>
                    <td style={{ padding: '13px 16px', fontSize: '0.85rem', color: '#374151' }}>{t.plazo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'simulador' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '24px' }}>
              <div style={{ fontWeight: '700', color: '#1A1A2E', marginBottom: 16 }}>🧮 Simulador de Costos</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: '600', color: '#374151', display: 'block', marginBottom: 5 }}>Zona de entrega</label>
                  <select value={zona} onChange={e => setZona(e.target.value)} style={{ width: '100%', padding: '9px 12px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '0.85rem', outline: 'none' }}>
                    {tarifas.map(t => <option key={t.zona}>{t.zona}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: '600', color: '#374151', display: 'block', marginBottom: 5 }}>Peso del paquete (kg)</label>
                  <input type="number" value={peso} onChange={e => setPeso(e.target.value)} style={{ width: '100%', padding: '9px 12px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: '600', color: '#374151', display: 'block', marginBottom: 5 }}>Valor declarado ($)</label>
                  <input type="number" defaultValue={5000} style={{ width: '100%', padding: '9px 12px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box' }} />
                </div>
              </div>
            </div>
            <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '24px' }}>
              <div style={{ fontWeight: '700', color: '#1A1A2E', marginBottom: 16 }}>📊 Cotizaciones</div>
              {carriers.filter(c => c.activo && c.tipo !== 'Internacional').map(c => {
                const base = tarifas.find(t => t.zona === zona);
                const precio = base ? Math.round(base.precio * (1 + (parseFloat(peso) - 2) * 0.1)) : c.tarifaBase;
                return (
                  <div key={c.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #F3F4F6' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: '1.2rem' }}>{c.logo}</span>
                      <div>
                        <div style={{ fontWeight: '600', color: '#1A1A2E', fontSize: '0.85rem' }}>{c.nombre}</div>
                        <div style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>{c.plazo}</div>
                      </div>
                    </div>
                    <div style={{ fontWeight: '800', fontSize: '1.1rem', color: ORANGE }}>${precio}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

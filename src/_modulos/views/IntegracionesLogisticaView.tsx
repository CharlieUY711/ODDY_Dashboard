/* =====================================================
   IntegracionesLogisticaView — Carriers Uruguay & Latam
   ===================================================== */
import React, { useState } from 'react';
import { OrangeHeader } from '@/app/components/admin/OrangeHeader';
import type { MainSection } from '@/app/AdminDashboard';
import { Truck, CheckCircle, Globe, Settings, Zap, MapPin } from 'lucide-react';

const ORANGE = '#FF6835';
interface Props { onNavigate: (s: MainSection) => void; }

const carriers = [
  { nombre: 'OCA', pais: 'Uruguay', logo: '🔵', conectado: true, apiDisponible: true, tracking: true, zonas: 19, desc: 'Carrier líder en Uruguay · API REST moderna', url: 'oca.com.uy' },
  { nombre: 'Correo Uruguayo', pais: 'Uruguay', logo: '🟡', conectado: true, apiDisponible: true, tracking: true, zonas: 19, desc: 'Cobertura nacional total · Tarifas económicas', url: 'correo.com.uy' },
  { nombre: 'Brixo', pais: 'Uruguay', logo: '🟢', conectado: true, apiDisponible: true, tracking: true, zonas: 8, desc: 'Entregas express en Montevideo', url: 'brixo.com' },
  { nombre: 'Mosca', pais: 'Uruguay', logo: '🔴', conectado: false, apiDisponible: true, tracking: false, zonas: 6, desc: 'Última milla Montevideo', url: 'mosca.uy' },
  { nombre: 'PedidosYa', pais: 'Uruguay', logo: '🟠', conectado: true, apiDisponible: true, tracking: true, zonas: 3, desc: 'Mismo día en zonas urbanas', url: 'pedidosya.com' },
  { nombre: 'FedEx', pais: 'Internacional', logo: '🟣', conectado: false, apiDisponible: true, tracking: true, zonas: 220, desc: 'Envíos internacionales globales', url: 'fedex.com' },
  { nombre: 'DHL', pais: 'Internacional', logo: '🟡', conectado: false, apiDisponible: true, tracking: true, zonas: 220, desc: 'Líder global en logística exprés', url: 'dhl.com' },
  { nombre: 'Andreani', pais: 'Argentina', logo: '🔵', conectado: false, apiDisponible: true, tracking: true, zonas: 23, desc: 'Principal carrier de Argentina', url: 'andreani.com' },
];

export function IntegracionesLogisticaView({ onNavigate }: Props) {
  const [filtro, setFiltro] = useState('Todos');
  const paises = ['Todos', 'Uruguay', 'Internacional', 'Argentina'];
  const lista = filtro === 'Todos' ? carriers : carriers.filter(c => c.pais === filtro);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', backgroundColor: '#F8F9FA' }}>
      <OrangeHeader
        icon={Truck}
        title="Integraciones Logística"
        subtitle="Carriers Uruguay · Latam · Internacional · Tracking automático"
        actions={[
          { label: '← Volver', onClick: () => onNavigate('integraciones') },
          { label: '+ Agregar Carrier', primary: true },
        ]}
      />
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 22 }}>
          {[
            { label: 'Carriers activos', value: carriers.filter(c => c.conectado).length, color: '#10B981' },
            { label: 'Con API REST', value: carriers.filter(c => c.apiDisponible).length, color: '#3B82F6' },
            { label: 'Con tracking', value: carriers.filter(c => c.tracking).length, color: ORANGE },
            { label: 'Cobertura zonas', value: '19 dptos.', color: '#8B5CF6' },
          ].map((k, i) => (
            <div key={i} style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '18px 20px' }}>
              <div style={{ fontSize: '1.6rem', fontWeight: '800', color: k.color }}>{k.value}</div>
              <div style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>{k.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
          {paises.map(p => (
            <button key={p} onClick={() => setFiltro(p)} style={{ padding: '5px 14px', borderRadius: '8px', border: `1px solid ${filtro === p ? ORANGE : '#E5E7EB'}`, backgroundColor: filtro === p ? `${ORANGE}10` : '#fff', color: filtro === p ? ORANGE : '#374151', fontSize: '0.82rem', fontWeight: '600', cursor: 'pointer' }}>
              {p}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 14 }}>
          {lista.map((c, i) => (
            <div key={i} style={{ backgroundColor: '#fff', borderRadius: '14px', border: `1px solid ${c.conectado ? '#E5E7EB' : '#F3F4F6'}`, padding: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <span style={{ fontSize: '1.6rem' }}>{c.logo}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '700', color: '#1A1A2E' }}>{c.nombre}</div>
                  <div style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>{c.pais} · {c.zonas} zonas</div>
                </div>
                <span style={{ fontSize: '0.68rem', fontWeight: '700', padding: '2px 8px', borderRadius: '6px', backgroundColor: c.conectado ? '#D1FAE5' : '#F3F4F6', color: c.conectado ? '#059669' : '#9CA3AF' }}>
                  {c.conectado ? 'Conectado' : 'Inactivo'}
                </span>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#9CA3AF', marginBottom: 12 }}>{c.desc}</div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '5px', backgroundColor: c.apiDisponible ? '#DBEAFE' : '#F3F4F6', color: c.apiDisponible ? '#1D4ED8' : '#9CA3AF' }}>
                  {c.apiDisponible ? '✅ API REST' : '❌ Sin API'}
                </span>
                <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '5px', backgroundColor: c.tracking ? '#D1FAE5' : '#F3F4F6', color: c.tracking ? '#059669' : '#9CA3AF' }}>
                  {c.tracking ? '✅ Tracking' : '❌ Sin tracking'}
                </span>
              </div>
              {!c.apiDisponible && (
                <div style={{ fontSize: '0.75rem', color: '#9CA3AF', marginBottom: 10 }}>
                  <div style={{ fontWeight: '600', color: '#374151', marginBottom: 3 }}>URL de tracking manual:</div>
                  <input defaultValue={`https://${c.url}/tracking/{nro}`} style={{ width: '100%', padding: '5px 8px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '0.75rem', outline: 'none', boxSizing: 'border-box' }} />
                </div>
              )}
              <button style={{ width: '100%', padding: '8px', borderRadius: '8px', border: `1px solid ${c.conectado ? '#E5E7EB' : ORANGE}`, backgroundColor: c.conectado ? '#F9FAFB' : `${ORANGE}10`, color: c.conectado ? '#374151' : ORANGE, fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                {c.conectado ? <><Settings size={13} /> Configurar</> : <>Conectar {c.nombre} →</>}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

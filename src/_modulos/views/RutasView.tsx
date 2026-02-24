/* =====================================================
   RutasView — Planificación y Gestión de Rutas
   ===================================================== */
import React, { useState } from 'react';
import { OrangeHeader } from '@/app/components/admin/OrangeHeader';
import type { MainSection } from '@/app/AdminDashboard';
import { Map, Truck, MapPin, CheckCircle, Clock, Package, Navigation, Users } from 'lucide-react';

const ORANGE = '#FF6835';
interface Props { onNavigate: (s: MainSection) => void; }

const rutas = [
  {
    id: 'RUT-001', nombre: 'Ruta Mvd Norte', carrier: 'OCA', conductor: 'Diego Hernández', vehiculo: 'Ford Transit ABC123',
    estado: 'en_progreso', paradas: 12, entregadas: 8, color: ORANGE,
    paradasDetalle: [
      { dir: 'Av. Gral. Rivera 1240', estado: 'entregado', hora: '09:14' },
      { dir: 'Pocitos Shopping, local 24', estado: 'entregado', hora: '09:52' },
      { dir: 'Bvar. Artigas 2100', estado: 'entregado', hora: '10:30' },
      { dir: 'Malvín Norte, calle 8 #450', estado: 'en_camino', hora: '—' },
      { dir: 'Parque Batlle, Av. Italia 2890', estado: 'pendiente', hora: '—' },
    ],
  },
  {
    id: 'RUT-002', nombre: 'Ruta Mvd Sur', carrier: 'Brixo', conductor: 'Ana Méndez', vehiculo: 'Renault Kangoo XY4512',
    estado: 'completada', paradas: 9, entregadas: 9, color: '#10B981',
    paradasDetalle: [
      { dir: 'Ciudad Vieja, Bartolomé Mitre 450', estado: 'entregado', hora: '08:30' },
      { dir: 'Centro, 18 de Julio 1250', estado: 'entregado', hora: '09:10' },
      { dir: 'Palermo, Carlos Roxlo 1890', estado: 'entregado', hora: '10:00' },
    ],
  },
  {
    id: 'RUT-003', nombre: 'Ruta Canelones', carrier: 'Correo UY', conductor: 'Roberto López', vehiculo: 'Fiat Doblò GH7823',
    estado: 'pendiente', paradas: 15, entregadas: 0, color: '#3B82F6',
    paradasDetalle: [
      { dir: 'Las Piedras, Artigas 890', estado: 'pendiente', hora: '—' },
      { dir: 'Pando, Sarandi 340', estado: 'pendiente', hora: '—' },
      { dir: 'Barros Blancos centro', estado: 'pendiente', hora: '—' },
    ],
  },
  {
    id: 'RUT-004', nombre: 'Ruta Express Mvd Centro', carrier: 'PedidosYa', conductor: 'Valentina Cruz', vehiculo: 'Moto PY-5521',
    estado: 'en_progreso', paradas: 6, entregadas: 4, color: '#F59E0B',
    paradasDetalle: [
      { dir: 'Cordón, Juan Paullier 1234', estado: 'entregado', hora: '11:20' },
      { dir: 'Palermo, Av. Brasil 2890', estado: 'en_camino', hora: '—' },
      { dir: 'Parque Rodó, Av. Sarmiento 2100', estado: 'pendiente', hora: '—' },
    ],
  },
];

const estadoRutaColor: Record<string, { bg: string; color: string; label: string }> = {
  en_progreso: { bg: `${ORANGE}15`, color: ORANGE, label: 'En progreso' },
  completada:  { bg: '#D1FAE5', color: '#059669', label: 'Completada' },
  pendiente:   { bg: '#F3F4F6', color: '#6B7280', label: 'Pendiente' },
  demorada:    { bg: '#FEF3C7', color: '#D97706', label: 'Demorada' },
};

const estadoParadaColor: Record<string, string> = {
  entregado: '#10B981', en_camino: ORANGE, pendiente: '#9CA3AF',
};

const kpis = [
  { label: 'Rutas Activas', value: '2', color: ORANGE, icon: Navigation },
  { label: 'En Reparto', value: '14', color: '#3B82F6', icon: Package },
  { label: 'Entregados Hoy', value: '21', color: '#10B981', icon: CheckCircle },
  { label: 'Conductores', value: '4', color: '#8B5CF6', icon: Users },
];

export function RutasView({ onNavigate }: Props) {
  const [selected, setSelected] = useState<string>('RUT-001');
  const ruta = rutas.find(r => r.id === selected)!;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', backgroundColor: '#F8F9FA' }}>
      <OrangeHeader
        icon={Map}
        title="Rutas de Entrega"
        subtitle="Planificación · Seguimiento en tiempo real · Optimización"
        actions={[
          { label: '← Volver', onClick: () => onNavigate('logistica') },
          { label: '+ Nueva Ruta', primary: true },
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

        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 20 }}>
          {/* Lista rutas */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {rutas.map(r => {
              const s = estadoRutaColor[r.estado];
              return (
                <div key={r.id} onClick={() => setSelected(r.id)} style={{ backgroundColor: '#fff', borderRadius: '12px', border: `2px solid ${selected === r.id ? r.color : '#E5E7EB'}`, padding: '14px', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div style={{ fontWeight: '700', color: '#1A1A2E', fontSize: '0.88rem' }}>{r.nombre}</div>
                    <span style={{ fontSize: '0.68rem', fontWeight: '700', padding: '2px 7px', borderRadius: '5px', backgroundColor: s.bg, color: s.color }}>{s.label}</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#9CA3AF', marginBottom: 8 }}>{r.carrier} · {r.conductor}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ flex: 1, height: 6, backgroundColor: '#F3F4F6', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ width: `${(r.entregadas / r.paradas) * 100}%`, height: '100%', backgroundColor: r.color, borderRadius: 3 }} />
                    </div>
                    <span style={{ fontSize: '0.78rem', fontWeight: '700', color: r.color }}>{r.entregadas}/{r.paradas}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detalle ruta */}
          <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div>
                <div style={{ fontWeight: '800', color: '#1A1A2E', fontSize: '1.1rem' }}>{ruta.nombre}</div>
                <div style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>{ruta.id} · {ruta.carrier}</div>
              </div>
              <span style={{ fontSize: '0.78rem', fontWeight: '700', padding: '4px 12px', borderRadius: '8px', backgroundColor: estadoRutaColor[ruta.estado].bg, color: estadoRutaColor[ruta.estado].color }}>
                {estadoRutaColor[ruta.estado].label}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 20 }}>
              {[
                { label: 'Conductor', value: ruta.conductor, icon: '👤' },
                { label: 'Vehículo', value: ruta.vehiculo, icon: '🚛' },
                { label: 'Progreso', value: `${ruta.entregadas}/${ruta.paradas} paradas`, icon: '📦' },
              ].map((info, i) => (
                <div key={i} style={{ padding: '12px', backgroundColor: '#F9FAFB', borderRadius: '10px' }}>
                  <div style={{ fontSize: '1rem', marginBottom: 4 }}>{info.icon}</div>
                  <div style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>{info.label}</div>
                  <div style={{ fontWeight: '600', color: '#1A1A2E', fontSize: '0.83rem' }}>{info.value}</div>
                </div>
              ))}
            </div>

            {/* Mapa simulado */}
            <div style={{ height: 180, backgroundColor: '#EEF2FF', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 29px,#C7D2FE 30px),repeating-linear-gradient(90deg,transparent,transparent 29px,#C7D2FE 30px)', opacity: 0.3 }} />
              <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                <Map size={28} color="#8B5CF6" />
                <div style={{ fontSize: '0.82rem', color: '#374151', marginTop: 6 }}>Mapa de ruta — {ruta.paradas} paradas</div>
              </div>
              {ruta.paradasDetalle.slice(0, 3).map((p, i) => (
                <div key={i} style={{ position: 'absolute', top: 20 + i * 40, left: 60 + i * 80, width: 20, height: 20, borderRadius: '50%', backgroundColor: estadoParadaColor[p.estado], border: '3px solid #fff', boxShadow: '0 2px 6px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '0.55rem', color: '#fff', fontWeight: '700' }}>{i + 1}</span>
                </div>
              ))}
            </div>

            {/* Paradas */}
            <div style={{ fontWeight: '700', color: '#1A1A2E', marginBottom: 12, fontSize: '0.88rem' }}>Paradas</div>
            {ruta.paradasDetalle.map((p, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                  <div style={{ width: 22, height: 22, borderRadius: '50%', backgroundColor: `${estadoParadaColor[p.estado]}20`, border: `2px solid ${estadoParadaColor[p.estado]}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '0.65rem', fontWeight: '700', color: estadoParadaColor[p.estado] }}>{i + 1}</span>
                  </div>
                  {i < ruta.paradasDetalle.length - 1 && <div style={{ width: 2, height: 16, backgroundColor: '#E5E7EB', margin: '2px 0' }} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '600', color: '#1A1A2E', fontSize: '0.83rem' }}>{p.dir}</div>
                  <div style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>{p.estado === 'entregado' ? `✅ Entregado ${p.hora}` : p.estado === 'en_camino' ? '🚴 En camino' : '⏳ Pendiente'}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

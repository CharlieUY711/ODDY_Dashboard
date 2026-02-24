/* =====================================================
   MapaEnviosView — Vista Geográfica de Envíos Activos
   ===================================================== */
import React, { useState } from 'react';
import { OrangeHeader } from '@/app/components/admin/OrangeHeader';
import type { MainSection } from '@/app/AdminDashboard';
import { Navigation, Package, CheckCircle, AlertTriangle, MapPin, Filter, Truck } from 'lucide-react';

const ORANGE = '#FF6835';
interface Props { onNavigate: (s: MainSection) => void; }

const enviosPorZona = [
  { zona: 'Montevideo', envios: 124, entregados: 98, color: '#3B82F6', x: 45, y: 78 },
  { zona: 'Canelones', envios: 38, entregados: 29, color: '#10B981', x: 52, y: 65 },
  { zona: 'San José', envios: 12, entregados: 8, color: ORANGE, x: 35, y: 62 },
  { zona: 'Colonia', envios: 8, entregados: 6, color: '#8B5CF6', x: 22, y: 70 },
  { zona: 'Maldonado', envios: 18, entregados: 14, color: '#EC4899', x: 68, y: 82 },
  { zona: 'Salto', envios: 6, entregados: 4, color: '#F59E0B', x: 25, y: 25 },
  { zona: 'Paysandú', envios: 5, entregados: 3, color: '#06B6D4', x: 20, y: 40 },
  { zona: 'Rivera', envios: 4, entregados: 2, color: '#EF4444', x: 48, y: 18 },
  { zona: 'Rocha', envios: 7, entregados: 5, color: '#14B8A6', x: 78, y: 72 },
  { zona: 'Flores', envios: 3, entregados: 2, color: '#6366F1', x: 38, y: 55 },
];

const enviosRecientes = [
  { id: 'ENV-8841', destino: 'Av. Rivera 1240, Montevideo', estado: 'en_camino', carrier: 'OCA', hora: '14:20' },
  { id: 'ENV-8839', destino: 'Colonia 450, Montevideo', estado: 'demorado', carrier: 'OCA', hora: '—' },
  { id: 'ENV-8845', destino: 'Paysandú 890, Canelones', estado: 'entregado', carrier: 'Brixo', hora: '13:45' },
  { id: 'ENV-8847', destino: 'Artigas 340, San José', estado: 'en_camino', carrier: 'Correo UY', hora: '16:00' },
  { id: 'ENV-8849', destino: 'Gorlero 1200, Punta del Este', estado: 'en_camino', carrier: 'OCA', hora: '18:30' },
];

const estadoColor: Record<string, { bg: string; color: string; label: string }> = {
  en_camino: { bg: `${ORANGE}15`, color: ORANGE, label: '🚛 En camino' },
  entregado: { bg: '#D1FAE5', color: '#059669', label: '✅ Entregado' },
  demorado:  { bg: '#FEF3C7', color: '#D97706', label: '⚠️ Demorado' },
};

const kpis = [
  { label: 'En Tránsito', value: '225', color: ORANGE, icon: Truck },
  { label: 'Entregados Hoy', value: '171', color: '#10B981', icon: CheckCircle },
  { label: 'Demorados', value: '8', color: '#D97706', icon: AlertTriangle },
  { label: 'Departamentos', value: '10', color: '#8B5CF6', icon: MapPin },
];

export function MapaEnviosView({ onNavigate }: Props) {
  const [zonaSeleccionada, setZonaSeleccionada] = useState<string | null>('Montevideo');
  const [filtroEstado, setFiltroEstado] = useState<string>('todos');

  const zona = enviosPorZona.find(z => z.zona === zonaSeleccionada);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', backgroundColor: '#F8F9FA' }}>
      <OrangeHeader
        icon={Navigation}
        title="Mapa de Envíos"
        subtitle="Vista geográfica de envíos activos · Uruguay"
        actions={[
          { label: '← Volver', onClick: () => onNavigate('logistica') },
          { label: '🔄 Actualizar', primary: true },
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

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>
          {/* Mapa */}
          <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '20px' }}>
            <div style={{ fontWeight: '700', color: '#1A1A2E', marginBottom: 14 }}>🗺️ Uruguay — Envíos en tiempo real</div>
            <div style={{ position: 'relative', height: 400, backgroundColor: '#EFF6FF', borderRadius: '12px', overflow: 'hidden' }}>
              {/* Grid de fondo */}
              <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 39px,#BFDBFE 40px),repeating-linear-gradient(90deg,transparent,transparent 39px,#BFDBFE 40px)', opacity: 0.4 }} />
              {/* Silueta simplificada UY */}
              <svg viewBox="0 0 100 100" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.15 }}>
                <path d="M20 15 L75 10 L85 30 L80 60 L70 90 L40 95 L15 80 L10 50 Z" fill="#3B82F6" />
              </svg>
              {/* Puntos de envío */}
              {enviosPorZona.map(z => (
                <button
                  key={z.zona}
                  onClick={() => setZonaSeleccionada(z.zona)}
                  style={{ position: 'absolute', left: `${z.x}%`, top: `${z.y}%`, transform: 'translate(-50%,-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, zIndex: 10 }}
                >
                  <div style={{ position: 'relative' }}>
                    <div style={{ width: zonaSeleccionada === z.zona ? 28 : 20, height: zonaSeleccionada === z.zona ? 28 : 20, borderRadius: '50%', backgroundColor: z.color, border: '3px solid #fff', boxShadow: `0 2px 8px ${z.color}80`, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
                      <span style={{ fontSize: '0.55rem', fontWeight: '800', color: '#fff' }}>{z.envios}</span>
                    </div>
                    {zonaSeleccionada === z.zona && (
                      <div style={{ position: 'absolute', bottom: '110%', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#1A1A2E', color: '#fff', fontSize: '0.7rem', fontWeight: '700', padding: '4px 8px', borderRadius: '6px', whiteSpace: 'nowrap' }}>
                        {z.zona}: {z.envios} envíos
                      </div>
                    )}
                  </div>
                </button>
              ))}
              {/* Leyenda */}
              <div style={{ position: 'absolute', bottom: 12, left: 12, display: 'flex', gap: 12, backgroundColor: 'rgba(255,255,255,0.9)', padding: '8px 12px', borderRadius: '8px' }}>
                {[{ color: ORANGE, label: 'En camino' }, { color: '#10B981', label: 'Entregado' }, { color: '#D97706', label: 'Demorado' }].map((l, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: l.color }} />
                    <span style={{ fontSize: '0.68rem', color: '#374151' }}>{l.label}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Info zona seleccionada */}
            {zona && (
              <div style={{ marginTop: 14, padding: '14px', backgroundColor: `${zona.color}10`, borderRadius: '10px', border: `1px solid ${zona.color}30` }}>
                <div style={{ fontWeight: '700', color: '#1A1A2E', marginBottom: 6 }}>📍 {zona.zona}</div>
                <div style={{ display: 'flex', gap: 16 }}>
                  <span style={{ fontSize: '0.83rem', color: '#374151' }}>Total: <strong>{zona.envios}</strong></span>
                  <span style={{ fontSize: '0.83rem', color: '#059669' }}>Entregados: <strong>{zona.entregados}</strong></span>
                  <span style={{ fontSize: '0.83rem', color: ORANGE }}>En camino: <strong>{zona.envios - zona.entregados}</strong></span>
                </div>
              </div>
            )}
          </div>

          {/* Panel lateral */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Ranking zonas */}
            <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '18px' }}>
              <div style={{ fontWeight: '700', color: '#1A1A2E', marginBottom: 12, fontSize: '0.88rem' }}>Ranking por zona</div>
              {enviosPorZona.sort((a, b) => b.envios - a.envios).map((z, i) => (
                <div key={z.zona} onClick={() => setZonaSeleccionada(z.zona)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', borderBottom: i < enviosPorZona.length - 1 ? '1px solid #F9FAFB' : 'none', cursor: 'pointer' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#9CA3AF', width: 18 }}>{i + 1}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: '600', color: '#1A1A2E' }}>{z.zona}</div>
                    <div style={{ width: '100%', height: 4, backgroundColor: '#F3F4F6', borderRadius: 2, marginTop: 3, overflow: 'hidden' }}>
                      <div style={{ width: `${(z.envios / 124) * 100}%`, height: '100%', backgroundColor: z.color, borderRadius: 2 }} />
                    </div>
                  </div>
                  <span style={{ fontSize: '0.82rem', fontWeight: '700', color: z.color }}>{z.envios}</span>
                </div>
              ))}
            </div>

            {/* Envíos recientes */}
            <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '18px' }}>
              <div style={{ fontWeight: '700', color: '#1A1A2E', marginBottom: 12, fontSize: '0.88rem' }}>Envíos Recientes</div>
              {enviosRecientes.map((e, i) => {
                const s = estadoColor[e.estado];
                return (
                  <div key={i} style={{ padding: '8px 0', borderBottom: i < enviosRecientes.length - 1 ? '1px solid #F9FAFB' : 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#1A1A2E' }}>{e.id}</span>
                      <span style={{ fontSize: '0.68rem', fontWeight: '700', padding: '1px 6px', borderRadius: '4px', backgroundColor: s.bg, color: s.color }}>{s.label}</span>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#9CA3AF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.destino}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

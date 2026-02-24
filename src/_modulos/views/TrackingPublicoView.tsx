/* =====================================================
   TrackingPublicoView — Seguimiento Público para Destinatarios
   ===================================================== */
import React, { useState } from 'react';
import { OrangeHeader } from '@/app/components/admin/OrangeHeader';
import type { MainSection } from '@/app/AdminDashboard';
import { Search, Package, CheckCircle, Truck, MapPin, Clock, Star, ExternalLink } from 'lucide-react';

const ORANGE = '#FF6835';
interface Props { onNavigate: (s: MainSection) => void; }

const trackingMock: Record<string, { carrier: string; estado: string; destino: string; eta: string; timeline: { estado: string; hora: string; lugar: string; completado: boolean }[] }> = {
  'OCA9823712': {
    carrier: 'OCA', estado: 'en_camino', destino: 'Av. Rivera 1240, Montevideo', eta: 'Hoy entre 14:00 y 18:00',
    timeline: [
      { estado: 'Pedido confirmado', hora: '2026-02-23 09:14', lugar: 'Almacén ODDY', completado: true },
      { estado: 'Preparación iniciada', hora: '2026-02-23 10:30', lugar: 'Almacén ODDY', completado: true },
      { estado: 'Retirado por OCA', hora: '2026-02-23 14:20', lugar: 'Centro de distribución Montevideo', completado: true },
      { estado: 'En tránsito', hora: '2026-02-24 08:00', lugar: 'Centro de reparto OCA - Mvd Norte', completado: true },
      { estado: 'En reparto', hora: '2026-02-24 10:15', lugar: 'En camino a tu dirección', completado: true },
      { estado: 'Entregado', hora: 'Estimado: Hoy 14-18h', lugar: 'Av. Rivera 1240, Montevideo', completado: false },
    ],
  },
  'BX445512': {
    carrier: 'Brixo', estado: 'entregado', destino: 'Paysandú 890, Canelones', eta: 'Entregado el 24/02 a las 13:45',
    timeline: [
      { estado: 'Pedido confirmado', hora: '2026-02-22 15:00', lugar: 'Almacén ODDY', completado: true },
      { estado: 'Retirado por Brixo', hora: '2026-02-23 09:00', lugar: 'Sucursal Brixo Mvd', completado: true },
      { estado: 'En reparto', hora: '2026-02-24 11:00', lugar: 'Canelones centro', completado: true },
      { estado: 'Entregado', hora: '2026-02-24 13:45', lugar: 'Paysandú 890, Canelones', completado: true },
    ],
  },
};

const estadoColorMap: Record<string, { bg: string; color: string; label: string; emoji: string }> = {
  en_camino: { bg: `${ORANGE}15`, color: ORANGE, label: 'En camino', emoji: '🚛' },
  entregado: { bg: '#D1FAE5', color: '#059669', label: 'Entregado', emoji: '✅' },
  demorado:  { bg: '#FEF3C7', color: '#D97706', label: 'Demorado', emoji: '⚠️' },
};

const statsTracking = [
  { label: 'Búsquedas hoy', value: '1.240', color: '#3B82F6' },
  { label: 'Tasa de entrega', value: '98.2%', color: '#10B981' },
  { label: 'NPS promedio', value: '4.7/5', color: '#F59E0B' },
  { label: 'Links activos', value: '225', color: ORANGE },
];

export function TrackingPublicoView({ onNavigate }: Props) {
  const [codigo, setCodigo] = useState('');
  const [resultado, setResultado] = useState<typeof trackingMock[string] | null>(null);
  const [nps, setNps] = useState<number | null>(null);
  const [buscando, setBuscando] = useState(false);

  function buscar() {
    setBuscando(true);
    setTimeout(() => {
      setResultado(trackingMock[codigo] ?? null);
      setBuscando(false);
    }, 800);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', backgroundColor: '#F8F9FA' }}>
      <OrangeHeader
        icon={Search}
        title="Tracking Público"
        subtitle="Seguimiento para destinatarios · Sin login requerido"
        actions={[
          { label: '← Volver', onClick: () => onNavigate('logistica') },
          { label: '🔗 Ver página pública', primary: true },
        ]}
      />
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
          {statsTracking.map((s, i) => (
            <div key={i} style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '18px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.6rem', fontWeight: '800', color: s.color }}>{s.value}</div>
              <div style={{ fontSize: '0.75rem', color: '#9CA3AF', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Simulador de tracking público */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div>
            {/* Buscador */}
            <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '24px', marginBottom: 16 }}>
              <div style={{ fontWeight: '700', color: '#1A1A2E', marginBottom: 4 }}>🔍 Simulador — Vista del Destinatario</div>
              <div style={{ fontSize: '0.8rem', color: '#9CA3AF', marginBottom: 16 }}>Probá con: OCA9823712 o BX445512</div>
              <div style={{ display: 'flex', gap: 10 }}>
                <input
                  value={codigo}
                  onChange={e => setCodigo(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && buscar()}
                  placeholder="Ingresá el número de tracking..."
                  style={{ flex: 1, padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: '10px', fontSize: '0.88rem', outline: 'none' }}
                />
                <button onClick={buscar} disabled={buscando} style={{ padding: '10px 18px', borderRadius: '10px', border: 'none', backgroundColor: ORANGE, color: '#fff', fontWeight: '700', cursor: buscando ? 'not-allowed' : 'pointer' }}>
                  {buscando ? '...' : 'Buscar'}
                </button>
              </div>
            </div>

            {/* Resultado */}
            {resultado && (
              <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '24px' }}>
                <div style={{ textAlign: 'center', marginBottom: 20 }}>
                  <div style={{ fontSize: '2rem', marginBottom: 6 }}>{estadoColorMap[resultado.estado]?.emoji}</div>
                  <div style={{ fontWeight: '800', fontSize: '1.2rem', color: '#1A1A2E' }}>{estadoColorMap[resultado.estado]?.label}</div>
                  <div style={{ fontSize: '0.8rem', color: '#9CA3AF', marginTop: 4 }}>{resultado.carrier} · {codigo}</div>
                </div>
                <div style={{ padding: '12px 14px', backgroundColor: '#F9FAFB', borderRadius: '10px', marginBottom: 16 }}>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'flex-start' }}>
                    <MapPin size={13} color={ORANGE} style={{ flexShrink: 0, marginTop: 2 }} />
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>Destino</div>
                      <div style={{ fontSize: '0.85rem', fontWeight: '600', color: '#1A1A2E' }}>{resultado.destino}</div>
                    </div>
                  </div>
                </div>
                <div style={{ padding: '12px 14px', backgroundColor: `${ORANGE}10`, borderRadius: '10px', marginBottom: 20 }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <Clock size={13} color={ORANGE} style={{ flexShrink: 0, marginTop: 2 }} />
                    <div style={{ fontSize: '0.85rem', fontWeight: '600', color: ORANGE }}>{resultado.eta}</div>
                  </div>
                </div>

                {/* Timeline */}
                {resultado.timeline.map((t, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, marginBottom: i < resultado.timeline.length - 1 ? 4 : 0 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                      <div style={{ width: 22, height: 22, borderRadius: '50%', backgroundColor: t.completado ? '#D1FAE5' : '#F3F4F6', border: `2px solid ${t.completado ? '#10B981' : '#E5E7EB'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {t.completado ? <CheckCircle size={11} color="#10B981" /> : <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#D1D5DB' }} />}
                      </div>
                      {i < resultado.timeline.length - 1 && <div style={{ width: 2, height: 18, backgroundColor: t.completado ? '#10B981' : '#E5E7EB', margin: '2px 0' }} />}
                    </div>
                    <div style={{ paddingBottom: 6 }}>
                      <div style={{ fontWeight: '600', fontSize: '0.82rem', color: t.completado ? '#1A1A2E' : '#9CA3AF' }}>{t.estado}</div>
                      <div style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>{t.hora}</div>
                      <div style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>{t.lugar}</div>
                    </div>
                  </div>
                ))}

                {/* NPS */}
                {resultado.estado === 'entregado' && (
                  <div style={{ marginTop: 20, padding: '16px', backgroundColor: '#F9FAFB', borderRadius: '10px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: '600', color: '#374151', marginBottom: 10 }}>¿Cómo fue tu experiencia?</div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
                      {[1, 2, 3, 4, 5].map(n => (
                        <button key={n} onClick={() => setNps(n)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                          <Star size={28} fill={nps !== null && n <= nps ? '#F59E0B' : 'none'} color={nps !== null && n <= nps ? '#F59E0B' : '#D1D5DB'} />
                        </button>
                      ))}
                    </div>
                    {nps && <div style={{ fontSize: '0.8rem', color: '#059669', marginTop: 8 }}>¡Gracias por tu valoración! ⭐</div>}
                  </div>
                )}
              </div>
            )}
            {resultado === null && codigo && !buscando && (
              <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '24px', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: 8 }}>🔍</div>
                <div style={{ color: '#6B7280' }}>No se encontró el número de tracking</div>
              </div>
            )}
          </div>

          {/* Config y stats */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '20px' }}>
              <div style={{ fontWeight: '700', color: '#1A1A2E', marginBottom: 14 }}>⚙️ Configuración de Página Pública</div>
              {[
                { label: 'URL pública', value: 'tracking.oddystore.uy/{codigo}', tipo: 'url' },
                { label: 'Logo de la tienda', value: 'Subir logo personalizado', tipo: 'upload' },
                { label: 'Color de marca', value: '#FF6835', tipo: 'color' },
                { label: 'Solicitar NPS post-entrega', value: 'Activado', tipo: 'toggle' },
                { label: 'Notificaciones push', value: 'Activado', tipo: 'toggle' },
              ].map((c, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < 4 ? '1px solid #F9FAFB' : 'none' }}>
                  <span style={{ fontSize: '0.83rem', color: '#374151' }}>{c.label}</span>
                  <span style={{ fontSize: '0.82rem', fontWeight: '600', color: c.tipo === 'toggle' ? '#059669' : '#9CA3AF' }}>{c.value}</span>
                </div>
              ))}
            </div>

            <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '20px' }}>
              <div style={{ fontWeight: '700', color: '#1A1A2E', marginBottom: 14 }}>📊 Actividad Reciente</div>
              {[
                { texto: 'Ana García escaneó su tracking', hora: 'hace 5 min', ico: '🔍' },
                { texto: 'Carlos Rodríguez dejó 5 estrellas', hora: 'hace 12 min', ico: '⭐' },
                { texto: 'ENV-8847 fue buscado 8 veces', hora: 'hace 20 min', ico: '📦' },
                { texto: 'María López recibió notificación push', hora: 'hace 35 min', ico: '🔔' },
              ].map((a, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, padding: '8px 0', borderBottom: i < 3 ? '1px solid #F9FAFB' : 'none' }}>
                  <span>{a.ico}</span>
                  <div>
                    <div style={{ fontSize: '0.82rem', color: '#374151' }}>{a.texto}</div>
                    <div style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>{a.hora}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

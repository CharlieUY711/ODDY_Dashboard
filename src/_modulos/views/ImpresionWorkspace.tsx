/* =====================================================
   ImpresionWorkspace — Módulo de Impresión
   Cola de trabajos · Preview A4 · Config papel/color/calidad
   ===================================================== */
import React, { useState } from 'react';
import { OrangeHeader } from '@/app/components/admin/OrangeHeader';
import type { MainSection } from '@/app/AdminDashboard';
import { Printer, Plus, Trash2, Play, Pause, CheckCircle, Clock, AlertTriangle, Settings, Eye } from 'lucide-react';

const ORANGE = '#FF6835';
interface Props { onNavigate: (s: MainSection) => void; }

interface Trabajo {
  id: number; nombre: string; paginas: number; estado: 'cola' | 'imprimiendo' | 'completado' | 'error';
  papel: string; orientacion: 'retrato' | 'paisaje'; color: 'color' | 'bn'; calidad: 'borrador' | 'normal' | 'alta';
  copias: number; progreso: number; hora: string; tamaño: string;
}

const trabajosIniciales: Trabajo[] = [
  { id: 1, nombre: 'Factura #8841 — Juan Pérez', paginas: 1, estado: 'completado', papel: 'A4', orientacion: 'retrato', color: 'bn', calidad: 'normal', copias: 1, progreso: 100, hora: '09:42', tamaño: '124 KB' },
  { id: 2, nombre: 'Catálogo Productos Feb 2026', paginas: 12, estado: 'imprimiendo', papel: 'A4', orientacion: 'retrato', color: 'color', calidad: 'alta', copias: 3, progreso: 65, hora: '10:18', tamaño: '4.2 MB' },
  { id: 3, nombre: 'Etiquetas de envío — Lote WAVE-003', paginas: 4, estado: 'cola', papel: 'A5', orientacion: 'retrato', color: 'bn', calidad: 'normal', copias: 1, progreso: 0, hora: '10:22', tamaño: '890 KB' },
  { id: 4, nombre: 'Presupuesto #PRE-082', paginas: 2, estado: 'cola', papel: 'A4', orientacion: 'retrato', color: 'color', calidad: 'alta', copias: 2, progreso: 0, hora: '10:35', tamaño: '560 KB' },
  { id: 5, nombre: 'Remito de entrega ORD-8839', paginas: 1, estado: 'error', papel: 'A4', orientacion: 'retrato', color: 'bn', calidad: 'borrador', copias: 1, progreso: 30, hora: '10:12', tamaño: '88 KB' },
];

const estadoStyle: Record<string, { bg: string; color: string; label: string; icon: React.ElementType }> = {
  cola:        { bg: '#EFF6FF', color: '#1D4ED8', label: 'En cola', icon: Clock },
  imprimiendo: { bg: `${ORANGE}15`, color: ORANGE, label: 'Imprimiendo', icon: Printer },
  completado:  { bg: '#D1FAE5', color: '#059669', label: 'Completado', icon: CheckCircle },
  error:       { bg: '#FEE2E2', color: '#DC2626', label: 'Error', icon: AlertTriangle },
};

const papeles = ['A4', 'A5', 'Carta', 'Legal', 'Sobre C5'];
const calidades = [
  { value: 'borrador', label: 'Borrador (Rápido)' },
  { value: 'normal', label: 'Normal' },
  { value: 'alta', label: 'Alta calidad' },
];

export function ImpresionWorkspace({ onNavigate }: Props) {
  const [trabajos, setTrabajos] = useState<Trabajo[]>(trabajosIniciales);
  const [config, setConfig] = useState({ papel: 'A4', orientacion: 'retrato' as 'retrato' | 'paisaje', color: 'color' as 'color' | 'bn', calidad: 'normal' as 'borrador' | 'normal' | 'alta', copias: 1 });
  const [previewId, setPreviewId] = useState<number | null>(null);
  const [showNuevo, setShowNuevo] = useState(false);
  const [nuevoNombre, setNuevoNombre] = useState('');

  const eliminar = (id: number) => setTrabajos(prev => prev.filter(t => t.id !== id));
  const reanudar = (id: number) => setTrabajos(prev => prev.map(t => t.id === id ? { ...t, estado: 'cola' } : t));

  const agregarTrabajo = () => {
    if (!nuevoNombre.trim()) return;
    const nuevo: Trabajo = {
      id: Date.now(), nombre: nuevoNombre,
      paginas: Math.floor(Math.random() * 8) + 1,
      estado: 'cola', ...config, progreso: 0,
      hora: new Date().toLocaleTimeString().slice(0, 5),
      tamaño: `${(Math.random() * 2000 + 100).toFixed(0)} KB`,
    };
    setTrabajos(prev => [...prev, nuevo]);
    setNuevoNombre('');
    setShowNuevo(false);
  };

  const completados = trabajos.filter(t => t.estado === 'completado').length;
  const enCola = trabajos.filter(t => t.estado === 'cola').length;
  const imprimiendo = trabajos.filter(t => t.estado === 'imprimiendo').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', backgroundColor: '#F8F9FA' }}>
      <OrangeHeader
        icon={Printer}
        title="Módulo de Impresión"
        subtitle="Cola de trabajos · Preview A4 · Papel / Orientación / Color / Calidad"
        actions={[
          { label: '← Volver', onClick: () => onNavigate('herramientas') },
          { label: '+ Nuevo trabajo', onClick: () => setShowNuevo(true), primary: true },
        ]}
      />

      <div style={{ flex: 1, overflow: 'hidden', display: 'grid', gridTemplateColumns: '1fr 320px', gap: 0 }}>

        {/* Cola de impresión */}
        <div style={{ overflowY: 'auto', padding: '24px 24px 24px 32px' }}>

          {/* KPIs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
            {[
              { label: 'Imprimiendo', value: imprimiendo, icon: '🖨️', color: ORANGE },
              { label: 'En cola', value: enCola, icon: '⏳', color: '#3B82F6' },
              { label: 'Completados', value: completados, icon: '✅', color: '#10B981' },
              { label: 'Total trabajos', value: trabajos.length, icon: '📄', color: '#8B5CF6' },
            ].map((k, i) => (
              <div key={i} style={{ backgroundColor: '#fff', borderRadius: 12, border: '1px solid #E5E7EB', padding: 16 }}>
                <div style={{ fontSize: '1.4rem', marginBottom: 4 }}>{k.icon}</div>
                <div style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>{k.label}</div>
                <div style={{ fontSize: '1.6rem', fontWeight: '800', color: k.color }}>{k.value}</div>
              </div>
            ))}
          </div>

          {/* Lista de trabajos */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {trabajos.map(t => {
              const st = estadoStyle[t.estado];
              const Icon = st.icon;
              return (
                <div key={t.id} style={{ backgroundColor: '#fff', borderRadius: 14, border: '1px solid #E5E7EB', padding: 20, position: 'relative', overflow: 'hidden' }}>
                  {/* Barra de progreso de fondo */}
                  {(t.estado === 'imprimiendo' || t.estado === 'error') && (
                    <div style={{ position: 'absolute', bottom: 0, left: 0, height: 4, width: `${t.progreso}%`, backgroundColor: t.estado === 'error' ? '#EF4444' : ORANGE, transition: 'width 0.3s' }} />
                  )}

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                    <div style={{ width: 42, height: 42, borderRadius: 12, backgroundColor: st.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={18} color={st.color} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                        <span style={{ fontWeight: '700', color: '#1A1A2E', fontSize: '0.88rem' }}>{t.nombre}</span>
                        <span style={{ padding: '2px 8px', borderRadius: 6, backgroundColor: st.bg, color: st.color, fontSize: '0.7rem', fontWeight: '700' }}>{st.label}</span>
                      </div>
                      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                        {[
                          { label: 'Papel', value: t.papel },
                          { label: 'Orientación', value: t.orientacion },
                          { label: 'Color', value: t.color === 'color' ? 'Color' : 'B/N' },
                          { label: 'Calidad', value: t.calidad },
                          { label: 'Copias', value: `${t.copias}x` },
                          { label: 'Páginas', value: t.paginas },
                          { label: 'Tamaño', value: t.tamaño },
                          { label: 'Hora', value: t.hora },
                        ].map(d => (
                          <div key={d.label} style={{ display: 'flex', gap: 4 }}>
                            <span style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>{d.label}:</span>
                            <span style={{ fontSize: '0.72rem', color: '#374151', fontWeight: '600' }}>{d.value}</span>
                          </div>
                        ))}
                      </div>
                      {t.estado === 'imprimiendo' && (
                        <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ flex: 1, height: 6, backgroundColor: '#F3F4F6', borderRadius: 3, overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${t.progreso}%`, backgroundColor: ORANGE, borderRadius: 3 }} />
                          </div>
                          <span style={{ fontSize: '0.72rem', color: ORANGE, fontWeight: '700' }}>{t.progreso}%</span>
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                      <button onClick={() => setPreviewId(previewId === t.id ? null : t.id)}
                        style={{ padding: '6px', borderRadius: 8, border: '1px solid #E5E7EB', backgroundColor: previewId === t.id ? `${ORANGE}10` : '#F9FAFB', cursor: 'pointer' }}>
                        <Eye size={14} color={previewId === t.id ? ORANGE : '#6B7280'} />
                      </button>
                      {t.estado === 'error' && (
                        <button onClick={() => reanudar(t.id)} style={{ padding: '6px', borderRadius: 8, border: 'none', backgroundColor: '#FEF3C7', cursor: 'pointer' }}>
                          <Play size={14} color="#D97706" />
                        </button>
                      )}
                      <button onClick={() => eliminar(t.id)} style={{ padding: '6px', borderRadius: 8, border: 'none', backgroundColor: '#FEE2E2', cursor: 'pointer' }}>
                        <Trash2 size={14} color="#DC2626" />
                      </button>
                    </div>
                  </div>

                  {/* Preview A4 */}
                  {previewId === t.id && (
                    <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center' }}>
                      <div style={{
                        width: t.orientacion === 'retrato' ? 210 : 297,
                        height: t.orientacion === 'retrato' ? 297 : 210,
                        backgroundColor: '#fff', border: '1px solid #E5E7EB',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)', borderRadius: 4, padding: 20,
                        display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.65rem', color: '#374151',
                        transform: 'scale(0.55)', transformOrigin: 'top center', marginBottom: -120,
                      }}>
                        <div style={{ fontWeight: '900', fontSize: '0.9rem', color: ORANGE, borderBottom: `2px solid ${ORANGE}`, paddingBottom: 6, marginBottom: 4 }}>ODDY Store</div>
                        <div style={{ fontWeight: '700', fontSize: '0.8rem', color: '#1A1A2E' }}>{t.nombre}</div>
                        {Array.from({ length: 12 }).map((_, i) => (
                          <div key={i} style={{ height: 8, backgroundColor: i % 3 === 0 ? '#F3F4F6' : '#FAFAFA', borderRadius: 2, width: `${70 + (i % 4) * 8}%` }} />
                        ))}
                        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #E5E7EB', paddingTop: 8 }}>
                          <span>Página 1/{t.paginas}</span>
                          <span>{new Date().toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Panel de configuración */}
        <div style={{ backgroundColor: '#fff', borderLeft: '1px solid #E9ECEF', overflowY: 'auto', padding: 24 }}>
          <p style={{ fontWeight: '700', color: '#1A1A2E', fontSize: '0.92rem', margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Settings size={16} color={ORANGE} /> Configuración por defecto
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: '0.78rem', color: '#6B7280', fontWeight: '700', display: 'block', marginBottom: 8 }}>Tamaño de papel</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
                {papeles.map(p => (
                  <button key={p} onClick={() => setConfig(prev => ({ ...prev, papel: p }))}
                    style={{ padding: '8px', borderRadius: 8, border: `2px solid ${config.papel === p ? ORANGE : '#E5E7EB'}`, backgroundColor: config.papel === p ? `${ORANGE}10` : '#F9FAFB', color: config.papel === p ? ORANGE : '#6B7280', fontWeight: config.papel === p ? '700' : '500', fontSize: '0.75rem', cursor: 'pointer' }}>
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', color: '#6B7280', fontWeight: '700', display: 'block', marginBottom: 8 }}>Orientación</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {(['retrato', 'paisaje'] as const).map(o => (
                  <button key={o} onClick={() => setConfig(prev => ({ ...prev, orientacion: o }))}
                    style={{ padding: '12px 8px', borderRadius: 10, border: `2px solid ${config.orientacion === o ? ORANGE : '#E5E7EB'}`, backgroundColor: config.orientacion === o ? `${ORANGE}10` : '#F9FAFB', color: config.orientacion === o ? ORANGE : '#6B7280', fontWeight: config.orientacion === o ? '700' : '500', fontSize: '0.78rem', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: o === 'retrato' ? 20 : 28, height: o === 'retrato' ? 28 : 20, border: `2px solid currentColor`, borderRadius: 2 }} />
                    {o.charAt(0).toUpperCase() + o.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', color: '#6B7280', fontWeight: '700', display: 'block', marginBottom: 8 }}>Modo de color</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {[{ v: 'color', l: '🎨 Color' }, { v: 'bn', l: '⬛ B/N' }].map(c => (
                  <button key={c.v} onClick={() => setConfig(prev => ({ ...prev, color: c.v as 'color' | 'bn' }))}
                    style={{ padding: '10px', borderRadius: 10, border: `2px solid ${config.color === c.v ? ORANGE : '#E5E7EB'}`, backgroundColor: config.color === c.v ? `${ORANGE}10` : '#F9FAFB', color: config.color === c.v ? ORANGE : '#6B7280', fontWeight: config.color === c.v ? '700' : '500', fontSize: '0.82rem', cursor: 'pointer' }}>
                    {c.l}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', color: '#6B7280', fontWeight: '700', display: 'block', marginBottom: 8 }}>Calidad</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {calidades.map(c => (
                  <button key={c.value} onClick={() => setConfig(prev => ({ ...prev, calidad: c.value as 'borrador' | 'normal' | 'alta' }))}
                    style={{ padding: '10px 14px', borderRadius: 10, border: `2px solid ${config.calidad === c.value ? ORANGE : '#E5E7EB'}`, backgroundColor: config.calidad === c.value ? `${ORANGE}10` : '#F9FAFB', color: config.calidad === c.value ? ORANGE : '#6B7280', fontWeight: config.calidad === c.value ? '700' : '500', fontSize: '0.82rem', cursor: 'pointer', textAlign: 'left' }}>
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', color: '#6B7280', fontWeight: '700', display: 'block', marginBottom: 8 }}>Copias: {config.copias}</label>
              <input type="range" min={1} max={20} value={config.copias} onChange={e => setConfig(prev => ({ ...prev, copias: Number(e.target.value) }))}
                style={{ width: '100%', accentColor: ORANGE }} />
            </div>
          </div>

          {/* Impresora conectada */}
          <div style={{ marginTop: 24, padding: 16, borderRadius: 12, backgroundColor: '#D1FAE5', border: '1px solid #A7F3D0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <CheckCircle size={14} color="#059669" />
              <span style={{ fontWeight: '700', fontSize: '0.82rem', color: '#059669' }}>Impresora conectada</span>
            </div>
            <p style={{ margin: 0, fontSize: '0.75rem', color: '#065F46' }}>HP LaserJet Pro M404dn · IP: 192.168.1.42 · Lista</p>
          </div>
        </div>
      </div>

      {/* Modal nuevo trabajo */}
      {showNuevo && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#fff', borderRadius: 20, padding: 28, width: 400, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <h2 style={{ margin: '0 0 20px', color: '#1A1A2E' }}>Nuevo trabajo de impresión</h2>
            <input value={nuevoNombre} onChange={e => setNuevoNombre(e.target.value)} placeholder="Nombre del documento..."
              style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #E5E7EB', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box', marginBottom: 20 }} />
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setShowNuevo(false)} style={{ flex: 1, padding: '11px', borderRadius: 10, border: '1px solid #E5E7EB', backgroundColor: '#F9FAFB', color: '#6B7280', fontWeight: '600', cursor: 'pointer' }}>Cancelar</button>
              <button onClick={agregarTrabajo} style={{ flex: 2, padding: '11px', borderRadius: 10, border: 'none', backgroundColor: ORANGE, color: '#fff', fontWeight: '700', cursor: 'pointer' }}>Agregar a cola</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

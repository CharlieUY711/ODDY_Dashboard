/* =====================================================
   MigracionRRSSView — Migración RRSS / Rebranding
   ===================================================== */
import React, { useState } from 'react';
import { OrangeHeader } from '@/app/components/admin/OrangeHeader';
import type { MainSection } from '@/app/AdminDashboard';
import { ArrowLeftRight, Download, Trash2, RefreshCw, CheckCircle, AlertTriangle, Shield, Archive, Upload } from 'lucide-react';

const ORANGE = '#FF6835';
interface Props { onNavigate: (s: MainSection) => void; }

const cuentas = [
  { plataforma: 'Instagram', handle: '@oddy_store', seguidores: 12400, posts: 486, estado: 'conectada', color: '#E1306C', emoji: '📸' },
  { plataforma: 'Facebook', handle: 'ODDY Store', seguidores: 8900, posts: 312, estado: 'conectada', color: '#1877F2', emoji: '👍' },
  { plataforma: 'TikTok', handle: '@oddy.store', seguidores: 6200, posts: 89, estado: 'pendiente', color: '#000', emoji: '🎵' },
  { plataforma: 'X / Twitter', handle: '@OddyStore', seguidores: 1240, posts: 1892, estado: 'desconectada', color: '#1DA1F2', emoji: '🐦' },
];

const pasos = [
  { paso: 1, titulo: 'Conectar cuentas', descripcion: 'Autorizar OAuth en cada plataforma', estado: 'completado' },
  { paso: 2, titulo: 'Backup completo', descripcion: 'Exportar posts, seguidores y mensajes', estado: 'completado' },
  { paso: 3, titulo: 'Rebranding assets', descripcion: 'Actualizar foto, bio y nombre', estado: 'en-progreso' },
  { paso: 4, titulo: 'Migrar contenido', descripcion: 'Mover a la nueva cuenta destino', estado: 'pendiente' },
  { paso: 5, titulo: 'Verificar y publicar', descripcion: 'Confirmar migración y activar', estado: 'pendiente' },
];

const backupItems = [
  { tipo: 'Posts e imágenes', cantidad: '886 archivos', tamaño: '2.4 GB', color: '#3B82F6', emoji: '🖼️' },
  { tipo: 'Videos y reels', cantidad: '124 archivos', tamaño: '8.1 GB', color: '#8B5CF6', emoji: '🎥' },
  { tipo: 'Stories archivadas', cantidad: '2.840 historias', tamaño: '1.2 GB', color: ORANGE, emoji: '⭕' },
  { tipo: 'Lista de seguidores', cantidad: '23.540 perfiles', tamaño: '18 MB', color: '#10B981', emoji: '👥' },
  { tipo: 'Mensajes directos', cantidad: '1.240 hilos', tamaño: '340 MB', color: '#EC4899', emoji: '💬' },
  { tipo: 'Comentarios', cantidad: '8.920 comentarios', tamaño: '12 MB', color: '#F59E0B', emoji: '💬' },
];

export function MigracionRRSSView({ onNavigate }: Props) {
  const [operacion, setOperacion] = useState<'backup' | 'eliminacion' | 'rebranding'>('backup');
  const [progreso, setProgreso] = useState(0);
  const [ejecutando, setEjecutando] = useState(false);

  function simularProceso() {
    setEjecutando(true);
    setProgreso(0);
    const iv = setInterval(() => {
      setProgreso(p => {
        if (p >= 100) { clearInterval(iv); setEjecutando(false); return 100; }
        return p + Math.random() * 8;
      });
    }, 200);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', backgroundColor: '#F8F9FA' }}>
      <OrangeHeader
        icon={ArrowLeftRight}
        title="Migración RRSS"
        subtitle="Backup · Eliminación segura · Rebranding automático"
        actions={[
          { label: '← Volver', onClick: () => onNavigate('rrss') },
          { label: '🛡️ Backup Ahora', primary: true },
        ]}
      />

      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
        {/* Cuentas conectadas */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
          {cuentas.map((c, i) => (
            <div key={i} style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <span style={{ fontSize: '1.4rem' }}>{c.emoji}</span>
                <div>
                  <div style={{ fontWeight: '700', color: '#1A1A2E', fontSize: '0.88rem' }}>{c.plataforma}</div>
                  <div style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>{c.handle}</div>
                </div>
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: '800', color: c.color }}>{c.seguidores.toLocaleString()}</div>
              <div style={{ fontSize: '0.72rem', color: '#9CA3AF', marginBottom: 8 }}>seguidores · {c.posts} posts</div>
              <span style={{ fontSize: '0.68rem', fontWeight: '700', padding: '2px 8px', borderRadius: '6px', backgroundColor: c.estado === 'conectada' ? '#D1FAE5' : c.estado === 'pendiente' ? '#FEF3C7' : '#FEE2E2', color: c.estado === 'conectada' ? '#059669' : c.estado === 'pendiente' ? '#D97706' : '#DC2626' }}>
                {c.estado}
              </span>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>
          {/* Panel principal */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Selector de operación */}
            <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '20px' }}>
              <div style={{ fontWeight: '700', color: '#1A1A2E', marginBottom: 14 }}>Seleccionar Operación</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
                {[
                  { id: 'backup' as const, emoji: '💾', titulo: 'Backup', desc: 'Exportar todo el contenido', color: '#3B82F6' },
                  { id: 'rebranding' as const, emoji: '🎨', titulo: 'Rebranding', desc: 'Actualizar identidad visual', color: ORANGE },
                  { id: 'eliminacion' as const, emoji: '🗑️', titulo: 'Eliminación', desc: 'Borrar contenido masivamente', color: '#EF4444' },
                ].map(op => (
                  <button key={op.id} onClick={() => setOperacion(op.id)} style={{
                    padding: '16px 12px', borderRadius: '12px', border: `2px solid ${operacion === op.id ? op.color : '#E5E7EB'}`, cursor: 'pointer', textAlign: 'center',
                    backgroundColor: operacion === op.id ? `${op.color}10` : '#F9FAFB',
                  }}>
                    <div style={{ fontSize: '1.8rem', marginBottom: 6 }}>{op.emoji}</div>
                    <div style={{ fontWeight: '700', color: operacion === op.id ? op.color : '#374151', fontSize: '0.85rem' }}>{op.titulo}</div>
                    <div style={{ fontSize: '0.72rem', color: '#9CA3AF', marginTop: 3 }}>{op.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Contenido backup */}
            {operacion === 'backup' && (
              <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '20px' }}>
                <div style={{ fontWeight: '700', color: '#1A1A2E', marginBottom: 14 }}>💾 Contenido a exportar</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
                  {backupItems.map((b, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: '8px', border: '1px solid #F3F4F6', backgroundColor: '#F9FAFB' }}>
                      <span style={{ fontSize: '1.2rem' }}>{b.emoji}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: '600', color: '#1A1A2E' }}>{b.tipo}</div>
                        <div style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>{b.cantidad} · {b.tamaño}</div>
                      </div>
                      <CheckCircle size={14} color="#10B981" />
                    </div>
                  ))}
                </div>
                {progreso > 0 && (
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#374151' }}>Exportando...</span>
                      <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#3B82F6' }}>{Math.round(Math.min(progreso, 100))}%</span>
                    </div>
                    <div style={{ width: '100%', height: 8, backgroundColor: '#E5E7EB', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ width: `${Math.min(progreso, 100)}%`, height: '100%', backgroundColor: '#3B82F6', borderRadius: 4, transition: 'width 0.2s' }} />
                    </div>
                  </div>
                )}
                <button onClick={simularProceso} disabled={ejecutando} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: 'none', backgroundColor: ejecutando ? '#9CA3AF' : '#3B82F6', color: '#fff', fontWeight: '700', cursor: ejecutando ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <Download size={16} /> {ejecutando ? 'Exportando...' : 'Iniciar Exportación (11.1 GB)'}
                </button>
              </div>
            )}

            {operacion === 'rebranding' && (
              <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '20px' }}>
                <div style={{ fontWeight: '700', color: '#1A1A2E', marginBottom: 14 }}>🎨 Configurar Rebranding</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {[
                    { label: 'Nuevo nombre de usuario', placeholder: '@nuevo_handle' },
                    { label: 'Nueva biografía', placeholder: 'Descripción actualizada...' },
                    { label: 'Nuevo nombre visible', placeholder: 'Nombre de la marca' },
                  ].map((f, i) => (
                    <div key={i}>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '600', color: '#374151', marginBottom: 5 }}>{f.label}</label>
                      <input placeholder={f.placeholder} style={{ width: '100%', padding: '8px 12px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '0.83rem', outline: 'none', boxSizing: 'border-box' }} />
                    </div>
                  ))}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '600', color: '#374151', marginBottom: 5 }}>Nueva foto de perfil</label>
                    <div style={{ border: '2px dashed #E5E7EB', borderRadius: '10px', padding: '20px', textAlign: 'center', cursor: 'pointer' }}>
                      <Upload size={20} color="#9CA3AF" style={{ margin: '0 auto 6px' }} />
                      <div style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>Subir imagen (PNG, JPG)</div>
                    </div>
                  </div>
                  <button style={{ padding: '12px', borderRadius: '10px', border: 'none', backgroundColor: ORANGE, color: '#fff', fontWeight: '700', cursor: 'pointer' }}>
                    🚀 Aplicar Rebranding en todas las redes
                  </button>
                </div>
              </div>
            )}

            {operacion === 'eliminacion' && (
              <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '2px solid #FCA5A5', padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <AlertTriangle size={18} color="#DC2626" />
                  <span style={{ fontWeight: '700', color: '#DC2626' }}>Zona de Peligro — Eliminación Masiva</span>
                </div>
                <div style={{ padding: '12px', backgroundColor: '#FEF2F2', borderRadius: '8px', marginBottom: 16, fontSize: '0.82rem', color: '#991B1B' }}>
                  ⚠️ Esta acción es irreversible. Asegurate de tener un backup completo antes de continuar.
                </div>
                {[
                  { label: 'Eliminar todos los posts', desc: '886 posts · 486 reels · 2.840 stories' },
                  { label: 'Eliminar comentarios propios', desc: '4.120 comentarios en publicaciones ajenas' },
                  { label: 'Cancelar seguimientos', desc: 'Dejar de seguir a 1.240 cuentas' },
                ].map((op, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: '8px', border: '1px solid #FCA5A5', marginBottom: 8, backgroundColor: '#FFF5F5' }}>
                    <input type="checkbox" style={{ width: 16, height: 16 }} />
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: '600', color: '#1A1A2E' }}>{op.label}</div>
                      <div style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>{op.desc}</div>
                    </div>
                  </div>
                ))}
                <button style={{ width: '100%', padding: '12px', marginTop: 8, borderRadius: '10px', border: 'none', backgroundColor: '#DC2626', color: '#fff', fontWeight: '700', cursor: 'pointer' }}>
                  <Trash2 size={16} style={{ display: 'inline', marginRight: 6 }} /> Confirmar Eliminación
                </button>
              </div>
            )}
          </div>

          {/* Panel pasos */}
          <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '20px', alignSelf: 'flex-start' }}>
            <div style={{ fontWeight: '700', color: '#1A1A2E', marginBottom: 16 }}>Estado del Proceso</div>
            {pasos.map((p, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, marginBottom: i < pasos.length - 1 ? 16 : 0 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, backgroundColor: p.estado === 'completado' ? '#D1FAE5' : p.estado === 'en-progreso' ? `${ORANGE}20` : '#F3F4F6', border: `2px solid ${p.estado === 'completado' ? '#10B981' : p.estado === 'en-progreso' ? ORANGE : '#E5E7EB'}` }}>
                    {p.estado === 'completado' ? <CheckCircle size={14} color="#10B981" /> : <span style={{ fontSize: '0.72rem', fontWeight: '700', color: p.estado === 'en-progreso' ? ORANGE : '#9CA3AF' }}>{p.paso}</span>}
                  </div>
                  {i < pasos.length - 1 && <div style={{ width: 2, flex: 1, minHeight: 16, backgroundColor: p.estado === 'completado' ? '#10B981' : '#E5E7EB', margin: '4px 0' }} />}
                </div>
                <div style={{ paddingBottom: i < pasos.length - 1 ? 12 : 0 }}>
                  <div style={{ fontWeight: '600', color: p.estado === 'completado' ? '#059669' : p.estado === 'en-progreso' ? ORANGE : '#9CA3AF', fontSize: '0.85rem' }}>{p.titulo}</div>
                  <div style={{ fontSize: '0.75rem', color: '#9CA3AF', marginTop: 2 }}>{p.descripcion}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

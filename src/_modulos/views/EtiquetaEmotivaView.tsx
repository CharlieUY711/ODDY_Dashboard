/* =====================================================
   EtiquetaEmotivaView — Mensajes Personalizados con QR
   ===================================================== */
import React, { useState } from 'react';
import { OrangeHeader } from '@/app/components/admin/OrangeHeader';
import type { MainSection } from '@/app/AdminDashboard';
import { Heart, QrCode, Star, Send, Eye, Download, Plus, Search, CheckCircle, MessageCircle } from 'lucide-react';

const ORANGE = '#FF6835';
interface Props { onNavigate: (s: MainSection) => void; }

const etiquetas = [
  { id: 1, pedido: 'ORD-8841', destinatario: 'Ana García', mensaje: '¡Que lo disfrutes mucho! Un abrazo de parte de todo el equipo 💕', nps: null, estado: 'enviada', qr: 'QR-8841' },
  { id: 2, pedido: 'ORD-8840', destinatario: 'Carlos Rodríguez', mensaje: 'Este regalo fue elegido especialmente para vos 🎁', nps: 5, estado: 'escaneada', qr: 'QR-8840' },
  { id: 3, pedido: 'ORD-8839', destinatario: 'María López', mensaje: 'Con cariño y buenos deseos ✨', nps: 5, estado: 'escaneada', qr: 'QR-8839' },
  { id: 4, pedido: 'ORD-8838', destinatario: 'Roberto Fernández', mensaje: '¡Feliz cumpleaños! Esperamos que te llegue en perfectas condiciones 🎂', nps: 4, estado: 'escaneada', qr: 'QR-8838' },
  { id: 5, pedido: 'ORD-8837', destinatario: 'Laura Martínez', mensaje: 'Un detalle especial para una persona especial 🌺', nps: null, estado: 'enviada', qr: 'QR-8837' },
];

const plantillas = [
  { emoji: '🎁', titulo: 'Regalo', mensaje: '¡Este regalo fue elegido especialmente para vos! Esperamos que lo ames tanto como nosotros.' },
  { emoji: '🎂', titulo: 'Cumpleaños', mensaje: '¡Feliz cumpleaños! Un deseo muy especial acompañando tu pedido.' },
  { emoji: '💕', titulo: 'Amor', mensaje: 'Con todo el cariño del mundo, para que sientas lo especial que sos.' },
  { emoji: '✨', titulo: 'Éxito', mensaje: 'Para celebrar tus logros. ¡Seguí brillando siempre!' },
  { emoji: '🌺', titulo: 'Gratitud', mensaje: 'Gracias por confiar en nosotros. Esto es un pequeño detalle de nuestra parte.' },
  { emoji: '🏆', titulo: 'VIP', mensaje: 'Para nuestros clientes más especiales. Tu fidelidad merece este reconocimiento.' },
];

const kpis = [
  { label: 'Etiquetas Enviadas', value: '1.240', color: ORANGE, icon: Heart },
  { label: 'QRs Escaneados', value: '892', color: '#10B981', icon: QrCode },
  { label: 'NPS Promedio', value: '4.8/5', color: '#F59E0B', icon: Star },
  { label: 'Tasa de Escaneo', value: '72%', color: '#3B82F6', icon: CheckCircle },
];

export function EtiquetaEmotivaView({ onNavigate }: Props) {
  const [tab, setTab] = useState<'lista' | 'crear' | 'plantillas'>('lista');
  const [mensaje, setMensaje] = useState('');
  const [pedidoId, setPedidoId] = useState('');
  const [plantillaSeleccionada, setPlantillaSeleccionada] = useState<number | null>(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', backgroundColor: '#F8F9FA' }}>
      <OrangeHeader
        icon={Heart}
        title="Etiqueta Emotiva ✨"
        subtitle="Mensajes personalizados con QR · NPS de entrega"
        actions={[
          { label: '← Volver', onClick: () => onNavigate('marketing') },
          { label: '+ Nueva Etiqueta', primary: true },
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
          {[
            { id: 'lista' as const, label: '📋 Etiquetas' },
            { id: 'crear' as const, label: '✍️ Crear Etiqueta' },
            { id: 'plantillas' as const, label: '📝 Plantillas' },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: '7px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '0.82rem', fontWeight: '600',
              backgroundColor: tab === t.id ? '#fff' : 'transparent', color: tab === t.id ? '#1A1A2E' : '#6B7280',
              boxShadow: tab === t.id ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
            }}>{t.label}</button>
          ))}
        </div>

        {tab === 'lista' && (
          <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #F3F4F6' }}>
              <div style={{ position: 'relative' }}>
                <Search size={14} color="#9CA3AF" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
                <input placeholder="Buscar por pedido o destinatario..." style={{ width: '100%', paddingLeft: 30, paddingRight: 12, paddingTop: 7, paddingBottom: 7, border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '0.82rem', outline: 'none' }} />
              </div>
            </div>
            <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {etiquetas.map(e => (
                <div key={e.id} style={{ display: 'flex', gap: 14, padding: '16px', borderRadius: '12px', border: '1px solid #F3F4F6', backgroundColor: '#FAFAFA' }}>
                  {/* QR simulado */}
                  <div style={{ width: 72, height: 72, borderRadius: '10px', backgroundColor: '#1A1A2E', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0, gap: 3 }}>
                    <QrCode size={28} color="#fff" />
                    <span style={{ fontSize: '0.55rem', color: '#fff', fontWeight: '700', letterSpacing: '0.05em' }}>{e.qr}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                      <div>
                        <span style={{ fontWeight: '700', color: '#1A1A2E', fontSize: '0.88rem' }}>{e.pedido}</span>
                        <span style={{ fontSize: '0.78rem', color: '#9CA3AF', marginLeft: 8 }}>→ {e.destinatario}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {e.nps && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} size={12} fill={i < e.nps! ? '#F59E0B' : 'none'} color={i < e.nps! ? '#F59E0B' : '#E5E7EB'} />
                            ))}
                          </div>
                        )}
                        <span style={{ fontSize: '0.7rem', fontWeight: '700', padding: '2px 8px', borderRadius: '6px', backgroundColor: e.estado === 'escaneada' ? '#D1FAE5' : `${ORANGE}15`, color: e.estado === 'escaneada' ? '#059669' : ORANGE }}>
                          {e.estado === 'escaneada' ? '✅ Escaneada' : '📬 Enviada'}
                        </span>
                      </div>
                    </div>
                    <div style={{ fontSize: '0.83rem', color: '#374151', fontStyle: 'italic', padding: '6px 10px', backgroundColor: '#fff', borderRadius: '6px', border: '1px solid #E5E7EB' }}>
                      "{e.mensaje}"
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
                    <button style={{ padding: '6px', border: '1px solid #E5E7EB', borderRadius: '7px', backgroundColor: '#F9FAFB', cursor: 'pointer' }}><Eye size={13} color="#6B7280" /></button>
                    <button style={{ padding: '6px', border: '1px solid #E5E7EB', borderRadius: '7px', backgroundColor: '#F9FAFB', cursor: 'pointer' }}><Download size={13} color="#6B7280" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'crear' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ fontWeight: '700', color: '#1A1A2E', fontSize: '1rem' }}>✍️ Crear Etiqueta</div>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: '600', color: '#374151', display: 'block', marginBottom: 5 }}>ID de Pedido</label>
                <input value={pedidoId} onChange={e => setPedidoId(e.target.value)} placeholder="ORD-XXXX" style={{ width: '100%', padding: '9px 12px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: '600', color: '#374151', display: 'block', marginBottom: 5 }}>Mensaje personalizado</label>
                <textarea value={mensaje} onChange={e => setMensaje(e.target.value)} placeholder="Escribe aquí el mensaje emotivo que recibirá el destinatario al escanear el QR..." rows={4} style={{ width: '100%', padding: '9px 12px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '0.85rem', outline: 'none', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                <div style={{ fontSize: '0.72rem', color: '#9CA3AF', textAlign: 'right', marginTop: 3 }}>{mensaje.length}/200 caracteres</div>
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: '600', color: '#374151', display: 'block', marginBottom: 5 }}>Incluir NPS de entrega</label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input type="checkbox" defaultChecked style={{ width: 16, height: 16 }} />
                  <span style={{ fontSize: '0.83rem', color: '#374151' }}>Solicitar valoración al escanear (1-5 estrellas)</span>
                </label>
              </div>
              <button style={{ padding: '12px', borderRadius: '10px', border: 'none', backgroundColor: ORANGE, color: '#fff', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <QrCode size={16} /> Generar Etiqueta con QR
              </button>
            </div>

            {/* Preview */}
            <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
              <div style={{ fontWeight: '700', color: '#1A1A2E', fontSize: '1rem', alignSelf: 'flex-start' }}>👁️ Vista Previa</div>
              <div style={{ width: '100%', maxWidth: 300, border: '2px dashed #E5E7EB', borderRadius: '16px', padding: '24px', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: 8 }}>❤️</div>
                <div style={{ fontWeight: '800', color: ORANGE, fontSize: '1rem', marginBottom: 4 }}>ODDY Store</div>
                <div style={{ width: '100%', height: 2, backgroundColor: '#F3F4F6', margin: '10px 0' }} />
                <div style={{ fontSize: '0.83rem', color: '#374151', fontStyle: 'italic', marginBottom: 12, minHeight: 60 }}>
                  {mensaje || '"Aquí aparecerá tu mensaje..."'}
                </div>
                <div style={{ width: 100, height: 100, backgroundColor: '#1A1A2E', borderRadius: '10px', margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <QrCode size={60} color="#fff" />
                </div>
                <div style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>Escaneá para ver el mensaje</div>
              </div>
            </div>
          </div>
        )}

        {tab === 'plantillas' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 16 }}>
            {plantillas.map((p, i) => (
              <div key={i} onClick={() => { setPlantillaSeleccionada(i); setMensaje(p.mensaje); setTab('crear'); }} style={{ backgroundColor: '#fff', borderRadius: '14px', border: `2px solid ${plantillaSeleccionada === i ? ORANGE : '#E5E7EB'}`, padding: '20px', cursor: 'pointer', transition: 'all 0.1s' }}>
                <div style={{ fontSize: '2rem', marginBottom: 10 }}>{p.emoji}</div>
                <div style={{ fontWeight: '700', color: '#1A1A2E', marginBottom: 6 }}>{p.titulo}</div>
                <div style={{ fontSize: '0.8rem', color: '#6B7280', fontStyle: 'italic', lineHeight: 1.5 }}>"{p.mensaje}"</div>
                <button style={{ marginTop: 14, width: '100%', padding: '8px', borderRadius: '8px', border: 'none', backgroundColor: `${ORANGE}15`, color: ORANGE, fontWeight: '600', fontSize: '0.82rem', cursor: 'pointer' }}>
                  Usar plantilla →
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

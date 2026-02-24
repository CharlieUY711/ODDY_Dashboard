/* =====================================================
   IntegracionesRRSSView — Redes Sociales & Social Commerce
   Meta · Instagram · WhatsApp · TikTok · Pinterest
   ===================================================== */
import React, { useState } from 'react';
import { OrangeHeader } from '@/app/components/admin/OrangeHeader';
import type { MainSection } from '@/app/AdminDashboard';
import { Smartphone, CheckCircle, XCircle, Settings, Zap, RefreshCw, ExternalLink, ShoppingBag, MessageCircle } from 'lucide-react';

const ORANGE = '#FF6835';
interface Props { onNavigate: (s: MainSection) => void; }

const redes = [
  {
    id: 'meta',
    nombre: 'Meta Business Suite',
    descripcion: 'Facebook Ads, páginas, audiencias y Business Manager',
    estado: 'conectado',
    color: '#1877F2',
    emoji: '🔵',
    cuenta: 'ODDY Store UY · ID: 123456789',
    features: ['Facebook Ads', 'Business Manager', 'Pixel de Conversión', 'Catálogo de Productos'],
    stats: { alcance: '48.2K', impresiones: '124K', gasto: '$1,240' },
  },
  {
    id: 'instagram',
    nombre: 'Instagram Shopping',
    descripcion: 'Shop tab, etiquetado de productos y checkout nativo',
    estado: 'conectado',
    color: '#E1306C',
    emoji: '📸',
    cuenta: '@oddy.uy · 12.4K seguidores',
    features: ['Instagram Shop', 'Etiquetado de productos', 'Stories Shopping', 'Reels con productos'],
    stats: { alcance: '12.4K', impresiones: '89K', gasto: '$—' },
  },
  {
    id: 'whatsapp',
    nombre: 'WhatsApp Business API',
    descripcion: 'Mensajería masiva, catálogo y botones de acción',
    estado: 'configurando',
    color: '#25D366',
    emoji: '💬',
    cuenta: 'Pendiente verificación · +598 XXX XXXX',
    features: ['Mensajes masivos', 'Catálogo de productos', 'Botones de acción', 'Automatizaciones'],
    stats: { alcance: '—', impresiones: '—', gasto: '—' },
  },
  {
    id: 'facebook-shops',
    nombre: 'Facebook Shops',
    descripcion: 'Tienda integrada en Facebook con catálogo sincronizado',
    estado: 'conectado',
    color: '#4267B2',
    emoji: '🛍️',
    cuenta: 'ODDY Shop · Catálogo sincronizado',
    features: ['Catálogo Facebook', 'Checkout Facebook', 'Ads de catálogo', 'Colecciones'],
    stats: { alcance: '31K', impresiones: '95K', gasto: '$680' },
  },
  {
    id: 'tiktok',
    nombre: 'TikTok Shop',
    descripcion: 'TikTok for Business y Social Commerce integrado',
    estado: 'desconectado',
    color: '#000000',
    emoji: '🎵',
    cuenta: 'No conectado',
    features: ['TikTok Ads', 'TikTok Shop', 'Spark Ads', 'Creator Marketplace'],
    stats: { alcance: '—', impresiones: '—', gasto: '—' },
  },
  {
    id: 'pinterest',
    nombre: 'Pinterest Ads',
    descripcion: 'Pines de producto, catálogos y campañas de shopping',
    estado: 'desconectado',
    color: '#E60023',
    emoji: '📌',
    cuenta: 'No conectado',
    features: ['Shopping Ads', 'Catálogo de productos', 'Rich Pins', 'Conversions API'],
    stats: { alcance: '—', impresiones: '—', gasto: '—' },
  },
];

const estadoStyle = {
  conectado:    { bg: '#D1FAE5', color: '#059669', label: 'Conectado' },
  configurando: { bg: '#FEF3C7', color: '#D97706', label: 'Configurando' },
  desconectado: { bg: '#F3F4F6', color: '#6B7280', label: 'Desconectado' },
};

export function IntegracionesRRSSView({ onNavigate }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const selectedRed = redes.find(r => r.id === selected);

  const conectadas = redes.filter(r => r.estado === 'conectado').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', backgroundColor: '#F8F9FA' }}>
      <OrangeHeader
        icon={Smartphone}
        title="Integraciones RRSS"
        subtitle="Redes sociales y social commerce — Meta, Instagram, WhatsApp, TikTok, Pinterest"
        actions={[
          { label: '← Volver', onClick: () => onNavigate('integraciones') },
          { label: '🔄 Sincronizar todo', primary: true },
        ]}
      />

      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px' }}>

        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
          {[
            { label: 'Redes Conectadas', value: `${conectadas}/6`, icon: '🔗', color: '#10B981' },
            { label: 'Alcance Total', value: '91.6K', icon: '👥', color: ORANGE },
            { label: 'Impresiones', value: '308K', icon: '👁️', color: '#3B82F6' },
            { label: 'Gasto en Ads', value: '$1,920', icon: '💰', color: '#8B5CF6' },
          ].map((k, i) => (
            <div key={i} style={{ backgroundColor: '#fff', borderRadius: 14, border: '1px solid #E5E7EB', padding: 20 }}>
              <div style={{ fontSize: '1.6rem', marginBottom: 6 }}>{k.icon}</div>
              <div style={{ fontSize: '0.78rem', color: '#6B7280', marginBottom: 3 }}>{k.label}</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: k.color }}>{k.value}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 360px' : '1fr', gap: 20 }}>
          {/* Grid de redes */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16, alignContent: 'flex-start' }}>
            {redes.map(r => {
              const st = estadoStyle[r.estado as keyof typeof estadoStyle];
              const isSelected = selected === r.id;
              return (
                <div key={r.id} onClick={() => setSelected(isSelected ? null : r.id)}
                  style={{ backgroundColor: '#fff', borderRadius: 14, border: `2px solid ${isSelected ? ORANGE : '#E5E7EB'}`, padding: 22, cursor: 'pointer', transition: 'all 0.15s', boxShadow: isSelected ? `0 4px 16px ${ORANGE}20` : 'none' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 46, height: 46, borderRadius: 12, backgroundColor: `${r.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
                        {r.emoji}
                      </div>
                      <div>
                        <div style={{ fontWeight: '700', color: '#1A1A2E', fontSize: '0.92rem' }}>{r.nombre}</div>
                        <div style={{ fontSize: '0.72rem', color: '#9CA3AF', marginTop: 2 }}>{r.cuenta}</div>
                      </div>
                    </div>
                    <span style={{ padding: '4px 10px', borderRadius: 8, backgroundColor: st.bg, color: st.color, fontSize: '0.72rem', fontWeight: '700', flexShrink: 0 }}>
                      {st.label}
                    </span>
                  </div>
                  <p style={{ margin: '0 0 14px', fontSize: '0.8rem', color: '#6B7280' }}>{r.descripcion}</p>
                  <div style={{ display: 'flex', gap: 16 }}>
                    {Object.entries(r.stats).map(([k, v]) => (
                      <div key={k} style={{ textAlign: 'center' }}>
                        <div style={{ fontWeight: '800', color: '#1A1A2E', fontSize: '0.92rem' }}>{v}</div>
                        <div style={{ fontSize: '0.68rem', color: '#9CA3AF', textTransform: 'capitalize' }}>{k}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Panel de detalle */}
          {selectedRed && (
            <div style={{ backgroundColor: '#fff', borderRadius: 16, border: '1px solid #E5E7EB', padding: 24, height: 'fit-content', position: 'sticky', top: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <div style={{ width: 50, height: 50, borderRadius: 14, backgroundColor: `${selectedRed.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem' }}>
                  {selectedRed.emoji}
                </div>
                <div>
                  <div style={{ fontWeight: '800', color: '#1A1A2E' }}>{selectedRed.nombre}</div>
                  <div style={{ fontSize: '0.78rem', color: '#9CA3AF' }}>{selectedRed.cuenta}</div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
                <p style={{ margin: 0, fontWeight: '700', color: '#1A1A2E', fontSize: '0.85rem' }}>Funcionalidades</p>
                {selectedRed.features.map((f, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <CheckCircle size={14} color="#10B981" />
                    <span style={{ fontSize: '0.82rem', color: '#374151' }}>{f}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {selectedRed.estado === 'conectado' ? (
                  <>
                    <button style={{ width: '100%', padding: '10px', borderRadius: 10, border: 'none', backgroundColor: ORANGE, color: '#fff', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                      <Settings size={14} /> Configurar
                    </button>
                    <button style={{ width: '100%', padding: '10px', borderRadius: 10, border: '1px solid #E5E7EB', backgroundColor: '#F9FAFB', color: '#374151', fontWeight: '600', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                      <RefreshCw size={14} /> Sincronizar
                    </button>
                    <button style={{ width: '100%', padding: '10px', borderRadius: 10, border: '1px solid #E5E7EB', backgroundColor: '#F9FAFB', color: '#374151', fontWeight: '600', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                      <ExternalLink size={14} /> Abrir plataforma
                    </button>
                  </>
                ) : selectedRed.estado === 'configurando' ? (
                  <>
                    <button style={{ width: '100%', padding: '10px', borderRadius: 10, border: 'none', backgroundColor: '#D97706', color: '#fff', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                      <Zap size={14} /> Continuar configuración
                    </button>
                  </>
                ) : (
                  <button style={{ width: '100%', padding: '10px', borderRadius: 10, border: 'none', backgroundColor: ORANGE, color: '#fff', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    <Zap size={14} /> Conectar {selectedRed.nombre}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

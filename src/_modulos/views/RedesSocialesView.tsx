/* =====================================================
   RedesSocialesView — Centro Operativo RRSS
   Panel unificado multi-plataforma
   ===================================================== */
import React, { useState } from 'react';
import { OrangeHeader } from '@/app/components/admin/OrangeHeader';
import type { MainSection } from '@/app/AdminDashboard';
import { Share2, TrendingUp, Heart, MessageCircle, Users, Eye, Plus, Calendar, Image, Send, BarChart2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, BarChart, Bar } from 'recharts';

const ORANGE = '#FF6835';
interface Props { onNavigate: (s: MainSection) => void; }

const plataformas = [
  { nombre: 'Instagram', emoji: '📸', color: '#E1306C', seguidores: '12.4K', crecimiento: '+234', alcance: '84K', engagement: '6.2%', posts: 48 },
  { nombre: 'Facebook', emoji: '👍', color: '#1877F2', seguidores: '8.9K', crecimiento: '+89', alcance: '52K', engagement: '3.8%', posts: 36 },
  { nombre: 'TikTok', emoji: '🎵', color: '#000000', seguidores: '6.2K', crecimiento: '+512', alcance: '120K', engagement: '9.4%', posts: 22 },
  { nombre: 'LinkedIn', emoji: '💼', color: '#0A66C2', seguidores: '2.1K', crecimiento: '+45', alcance: '18K', engagement: '4.1%', posts: 14 },
];

const calendario = [
  { fecha: 'Hoy 10:00', plataforma: 'Instagram', tipo: 'Imagen', contenido: 'Nueva colección primavera 🌸', estado: 'programado', emoji: '📸' },
  { fecha: 'Hoy 15:00', plataforma: 'Facebook', tipo: 'Video', contenido: 'Tutorial de uso del producto', estado: 'programado', emoji: '👍' },
  { fecha: 'Mañana 09:00', plataforma: 'TikTok', tipo: 'Reel', contenido: '5 tips para elegir el modelo perfecto', estado: 'borrador', emoji: '🎵' },
  { fecha: 'Mañana 18:00', plataforma: 'Instagram', tipo: 'Story', contenido: 'Encuesta: ¿Cuál te gusta más?', estado: 'programado', emoji: '📸' },
  { fecha: '26 Feb 11:00', plataforma: 'LinkedIn', tipo: 'Artículo', contenido: 'Tendencias del mercado 2026', estado: 'borrador', emoji: '💼' },
];

const metricas7dias = [
  { dia: 'Lun', instagram: 1200, facebook: 680, tiktok: 2100 },
  { dia: 'Mar', instagram: 1450, facebook: 720, tiktok: 2800 },
  { dia: 'Mié', instagram: 1100, facebook: 590, tiktok: 1900 },
  { dia: 'Jue', instagram: 1680, facebook: 840, tiktok: 3200 },
  { dia: 'Vie', instagram: 2100, facebook: 1100, tiktok: 4100 },
  { dia: 'Sáb', instagram: 2400, facebook: 1280, tiktok: 4800 },
  { dia: 'Dom', instagram: 1900, facebook: 1050, tiktok: 3600 },
];

const topPosts = [
  { plataforma: 'Instagram', contenido: '✨ Nueva colección invierno ya disponible', likes: 1248, comentarios: 89, compartidos: 234, alcance: 12400, emoji: '📸' },
  { plataforma: 'TikTok', contenido: '🎯 Cómo elegir la talla correcta', likes: 3420, comentarios: 198, compartidos: 890, alcance: 48000, emoji: '🎵' },
  { plataforma: 'Facebook', contenido: '💰 Oferta especial este fin de semana', likes: 542, comentarios: 34, compartidos: 112, alcance: 8900, emoji: '👍' },
];

export function RedesSocialesView({ onNavigate }: Props) {
  const [tab, setTab] = useState<'overview' | 'calendario' | 'analytics'>('overview');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', backgroundColor: '#F8F9FA' }}>
      <OrangeHeader
        icon={Share2}
        title="Centro Operativo RRSS"
        subtitle="Panel unificado · Instagram · Facebook · TikTok · LinkedIn"
        actions={[
          { label: '← Volver', onClick: () => onNavigate('rrss') },
          { label: '+ Crear Post', primary: true },
        ]}
      />

      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
        {/* Plataformas overview */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 22 }}>
          {plataformas.map((p, i) => (
            <div key={i} style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '18px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: '1.4rem' }}>{p.emoji}</span>
                <span style={{ fontWeight: '700', color: '#1A1A2E' }}>{p.nombre}</span>
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: '800', color: p.color, lineHeight: 1 }}>{p.seguidores}</div>
              <div style={{ fontSize: '0.75rem', color: '#9CA3AF', marginBottom: 8 }}>seguidores</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div style={{ padding: '6px 8px', backgroundColor: '#F9FAFB', borderRadius: '6px' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: '600', color: '#10B981' }}>{p.crecimiento}</div>
                  <div style={{ fontSize: '0.65rem', color: '#9CA3AF' }}>esta semana</div>
                </div>
                <div style={{ padding: '6px 8px', backgroundColor: '#F9FAFB', borderRadius: '6px' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: '600', color: ORANGE }}>{p.engagement}</div>
                  <div style={{ fontSize: '0.65rem', color: '#9CA3AF' }}>engagement</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 20, backgroundColor: '#F3F4F6', padding: '4px', borderRadius: '10px', width: 'fit-content' }}>
          {[
            { id: 'overview' as const, label: '🏠 Overview' },
            { id: 'calendario' as const, label: '📅 Calendario' },
            { id: 'analytics' as const, label: '📊 Analytics' },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: '7px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '0.82rem', fontWeight: '600',
              backgroundColor: tab === t.id ? '#fff' : 'transparent', color: tab === t.id ? '#1A1A2E' : '#6B7280',
              boxShadow: tab === t.id ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
            }}>{t.label}</button>
          ))}
        </div>

        {tab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '20px' }}>
              <div style={{ fontWeight: '700', color: '#1A1A2E', marginBottom: 16 }}>Alcance últimos 7 días</div>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={metricas7dias}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis dataKey="dia" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="instagram" stroke="#E1306C" strokeWidth={2} dot={false} name="Instagram" />
                  <Line type="monotone" dataKey="facebook" stroke="#1877F2" strokeWidth={2} dot={false} name="Facebook" />
                  <Line type="monotone" dataKey="tiktok" stroke="#000" strokeWidth={2} dot={false} name="TikTok" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '20px' }}>
              <div style={{ fontWeight: '700', color: '#1A1A2E', marginBottom: 16 }}>Top Posts de la semana</div>
              {topPosts.map((p, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: i < topPosts.length - 1 ? '1px solid #F3F4F6' : 'none' }}>
                  <span style={{ fontSize: '1.5rem' }}>{p.emoji}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.83rem', fontWeight: '600', color: '#1A1A2E', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.contenido}</div>
                    <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
                      <span style={{ fontSize: '0.72rem', color: '#EC4899' }}>❤ {p.likes.toLocaleString()}</span>
                      <span style={{ fontSize: '0.72rem', color: '#3B82F6' }}>💬 {p.comentarios}</span>
                      <span style={{ fontSize: '0.72rem', color: '#10B981' }}>↗ {p.compartidos}</span>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.8rem', fontWeight: '700', color: ORANGE }}>{(p.alcance / 1000).toFixed(1)}K</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'calendario' && (
          <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: '700', color: '#1A1A2E' }}>📅 Posts Programados</span>
              <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', border: 'none', borderRadius: '8px', backgroundColor: ORANGE, color: '#fff', fontSize: '0.82rem', fontWeight: '600', cursor: 'pointer' }}>
                <Plus size={14} /> Nuevo Post
              </button>
            </div>
            <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {calendario.map((c, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px', border: '1px solid #F3F4F6', borderRadius: '10px', backgroundColor: '#F9FAFB' }}>
                  <div style={{ textAlign: 'center', minWidth: 80 }}>
                    <div style={{ fontSize: '0.72rem', color: '#9CA3AF', fontWeight: '600' }}>{c.fecha.split(' ')[0]}</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1A1A2E' }}>{c.fecha.split(' ')[1]}</div>
                  </div>
                  <div style={{ width: 1, height: 36, backgroundColor: '#E5E7EB' }} />
                  <span style={{ fontSize: '1.4rem' }}>{c.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: '600', color: '#1A1A2E' }}>{c.contenido}</div>
                    <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                      <span style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>{c.plataforma}</span>
                      <span style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>·</span>
                      <span style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>{c.tipo}</span>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.72rem', fontWeight: '700', padding: '3px 8px', borderRadius: '6px', backgroundColor: c.estado === 'programado' ? '#D1FAE5' : '#FEF3C7', color: c.estado === 'programado' ? '#059669' : '#D97706' }}>
                    {c.estado}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'analytics' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 16 }}>
            {[
              { label: 'Alcance Total', value: '274K', sub: 'últimos 7 días', color: '#3B82F6' },
              { label: 'Interacciones', value: '18.4K', sub: 'likes + comentarios', color: '#EC4899' },
              { label: 'Nuevos Seguidores', value: '+880', sub: 'esta semana', color: '#10B981' },
              { label: 'Engagement Global', value: '6.7%', sub: 'promedio todas las redes', color: ORANGE },
            ].map((m, i) => (
              <div key={i} style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '24px', textAlign: 'center' }}>
                <div style={{ fontSize: '2.2rem', fontWeight: '900', color: m.color }}>{m.value}</div>
                <div style={{ fontWeight: '700', color: '#1A1A2E', marginTop: 4 }}>{m.label}</div>
                <div style={{ fontSize: '0.78rem', color: '#9CA3AF', marginTop: 4 }}>{m.sub}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

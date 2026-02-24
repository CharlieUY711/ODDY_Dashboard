/* =====================================================
   MetaBusinessView — Meta Business Suite Dashboard
   ===================================================== */
import React, { useState } from 'react';
import { OrangeHeader } from '@/app/components/admin/OrangeHeader';
import type { MainSection } from '@/app/AdminDashboard';
import {
  BarChart2, TrendingUp, Eye, Heart, Share2, Users,
  CheckCircle, AlertTriangle, RefreshCw, Key, Shield,
  Instagram, Facebook, MessageSquare, Clock,
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar,
} from 'recharts';

const ORANGE = '#FF6835';
const META_BLUE = '#1877F2';
const IG_GRADIENT = 'linear-gradient(135deg, #E1306C 0%, #833AB4 50%, #F77737 100%)';

interface Props { onNavigate: (s: MainSection) => void; }

const engagementData = [
  { dia: 'L', alcance: 4200, interacciones: 380 },
  { dia: 'M', alcance: 5800, interacciones: 520 },
  { dia: 'X', alcance: 4900, interacciones: 440 },
  { dia: 'J', alcance: 7200, interacciones: 690 },
  { dia: 'V', alcance: 9100, interacciones: 820 },
  { dia: 'S', alcance: 11400, interacciones: 1020 },
  { dia: 'D', alcance: 8600, interacciones: 780 },
];

const cuentas = [
  {
    plataforma: 'Facebook',
    cuenta: 'Charlie Marketplace',
    seguidores: 12450,
    tokenEstado: 'activo',
    tokenExpira: '2026-03-15',
    alcanceSemanal: 34200,
    interacciones: 2840,
    color: META_BLUE,
    icon: '📘',
    posts: 24,
  },
  {
    plataforma: 'Instagram',
    cuenta: '@charlie.marketplace',
    seguidores: 8230,
    tokenEstado: 'activo',
    tokenExpira: '2026-03-15',
    alcanceSemanal: 28900,
    interacciones: 4120,
    color: '#E1306C',
    icon: '📷',
    posts: 38,
  },
  {
    plataforma: 'WhatsApp Business',
    cuenta: '+598 91 234 567',
    seguidores: 3180,
    tokenEstado: 'warning',
    tokenExpira: '2026-02-28',
    alcanceSemanal: 3180,
    interacciones: 890,
    color: '#25D366',
    icon: '💬',
    posts: 12,
  },
];

export function MetaBusinessView({ onNavigate }: Props) {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'tokens' | 'publicaciones'>('overview');

  const tokenWarnings = cuentas.filter(c => c.tokenEstado === 'warning').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', backgroundColor: '#F8F9FA' }}>
      <OrangeHeader
        icon={BarChart2}
        title="Meta Business Suite"
        subtitle="Dashboard unificado · Facebook · Instagram · WhatsApp"
        actions={[
          { label: '← Volver', onClick: () => onNavigate('rrss') },
          { label: '↻ Sincronizar', primary: true },
        ]}
      />

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 28px' }}>

        {/* Token warning */}
        {tokenWarnings > 0 && (
          <div style={{ backgroundColor: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '12px', padding: '12px 18px', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <AlertTriangle size={17} color="#D97706" />
            <p style={{ margin: 0, fontSize: '0.83rem', color: '#92400E' }}>
              <strong>{tokenWarnings} token{tokenWarnings > 1 ? 's' : ''}</strong> próximo{tokenWarnings > 1 ? 's' : ''} a vencer (antes del 28 Feb). Renovar antes de que expiren.
            </p>
            <button style={{ marginLeft: 'auto', padding: '5px 12px', borderRadius: '7px', border: '1px solid #FDE68A', backgroundColor: '#FEF3C7', color: '#D97706', fontSize: '0.78rem', fontWeight: '700', cursor: 'pointer' }}>
              Renovar ahora
            </button>
          </div>
        )}

        {/* KPIs totales */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '20px' }}>
          {[
            { label: 'Alcance Total (7d)', value: '51,100', icon: Eye, color: '#3B82F6', change: '+14%' },
            { label: 'Interacciones (7d)', value: '7,850', icon: Heart, color: '#E1306C', change: '+22%' },
            { label: 'Seguidores Totales', value: '23,860', icon: Users, color: '#10B981', change: '+340' },
            { label: 'Posts Publicados', value: '74', icon: Share2, color: ORANGE, change: 'este mes' },
          ].map((k, i) => (
            <div key={i} style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '18px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: '9px', backgroundColor: `${k.color}14`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <k.icon size={17} color={k.color} strokeWidth={2} />
                </div>
                <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#059669', backgroundColor: '#D1FAE5', padding: '2px 7px', borderRadius: '5px' }}>{k.change}</span>
              </div>
              <p style={{ margin: '0 0 2px', fontSize: '0.73rem', color: '#6B7280' }}>{k.label}</p>
              <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: '800', color: '#111827', lineHeight: 1 }}>{k.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', overflow: 'hidden', marginBottom: '18px' }}>
          <div style={{ borderBottom: '1px solid #F0F0F0', display: 'flex' }}>
            {(['overview', 'tokens', 'publicaciones'] as const).map(t => (
              <button
                key={t}
                onClick={() => setSelectedTab(t)}
                style={{
                  padding: '13px 20px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer',
                  fontSize: '0.83rem', fontWeight: '700',
                  color: selectedTab === t ? ORANGE : '#6B7280',
                  borderBottom: selectedTab === t ? `2px solid ${ORANGE}` : '2px solid transparent',
                  marginBottom: '-1px',
                }}
              >
                {t === 'overview' ? '📊 Overview' : t === 'tokens' ? '🔑 Tokens' : '📱 Publicaciones'}
              </button>
            ))}
          </div>

          <div style={{ padding: '20px' }}>

            {selectedTab === 'overview' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <h3 style={{ margin: '0 0 14px', fontSize: '0.9rem', fontWeight: '700', color: '#111827' }}>Alcance semanal</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={engagementData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                      <XAxis dataKey="dia" stroke="#9CA3AF" style={{ fontSize: '0.72rem' }} />
                      <YAxis stroke="#9CA3AF" style={{ fontSize: '0.72rem' }} />
                      <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '0.78rem' }} />
                      <Line type="monotone" dataKey="alcance" stroke={META_BLUE} strokeWidth={3} dot={{ fill: META_BLUE, r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div>
                  <h3 style={{ margin: '0 0 14px', fontSize: '0.9rem', fontWeight: '700', color: '#111827' }}>Interacciones por día</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={engagementData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                      <XAxis dataKey="dia" stroke="#9CA3AF" style={{ fontSize: '0.72rem' }} />
                      <YAxis stroke="#9CA3AF" style={{ fontSize: '0.72rem' }} />
                      <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '0.78rem' }} />
                      <Bar dataKey="interacciones" fill="#E1306C" radius={[5, 5, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {selectedTab === 'tokens' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {cuentas.map((c, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px', backgroundColor: '#F9FAFB', borderRadius: '12px', border: `1px solid ${c.tokenEstado === 'warning' ? '#FDE68A' : '#E5E7EB'}` }}>
                    <div style={{ fontSize: '1.8rem', flexShrink: 0 }}>{c.icon}</div>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: '0 0 2px', fontSize: '0.88rem', fontWeight: '700', color: '#1F2937' }}>{c.plataforma}</p>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: '#6B7280' }}>{c.cuenta}</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ margin: 0, fontSize: '0.68rem', color: '#9CA3AF' }}>Vence</p>
                      <p style={{ margin: 0, fontSize: '0.78rem', fontWeight: '700', color: c.tokenEstado === 'warning' ? '#D97706' : '#374151' }}>{c.tokenExpira}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      {c.tokenEstado === 'activo'
                        ? <><CheckCircle size={15} color="#10B981" /><span style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: '700' }}>Token activo</span></>
                        : <><AlertTriangle size={15} color="#D97706" /><span style={{ fontSize: '0.75rem', color: '#D97706', fontWeight: '700' }}>Por vencer</span></>
                      }
                    </div>
                    <button style={{ padding: '6px 12px', borderRadius: '8px', border: `1px solid ${c.color}40`, backgroundColor: `${c.color}10`, color: c.color, fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
                      <RefreshCw size={12} /> Renovar
                    </button>
                  </div>
                ))}
                <div style={{ backgroundColor: '#F0FDF4', borderRadius: '10px', border: '1px solid #A7F3D0', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Shield size={16} color="#059669" />
                  <p style={{ margin: 0, fontSize: '0.78rem', color: '#065F46' }}>
                    Los tokens se almacenan encriptados en Supabase Vault. Renovación automática 7 días antes del vencimiento.
                  </p>
                </div>
              </div>
            )}

            {selectedTab === 'publicaciones' && (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                  {cuentas.map((c, i) => (
                    <div key={i} style={{ backgroundColor: '#F9FAFB', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                        <span style={{ fontSize: '1.4rem' }}>{c.icon}</span>
                        <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1F2937' }}>{c.plataforma}</span>
                      </div>
                      {[
                        { label: 'Seguidores', value: c.seguidores.toLocaleString(), icon: Users },
                        { label: 'Alcance (7d)', value: c.alcanceSemanal.toLocaleString(), icon: Eye },
                        { label: 'Interacciones', value: c.interacciones.toLocaleString(), icon: Heart },
                        { label: 'Posts totales', value: c.posts.toString(), icon: Share2 },
                      ].map((s, j) => (
                        <div key={j} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: j < 3 ? '10px' : 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <s.icon size={13} color={c.color} />
                            <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>{s.label}</span>
                          </div>
                          <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1F2937' }}>{s.value}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Actividad reciente */}
        <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '20px' }}>
          <h3 style={{ margin: '0 0 14px', fontSize: '0.92rem', fontWeight: '700', color: '#111827' }}>Actividad Reciente</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { icon: '📘', text: 'Post publicado en Facebook — "Nuevos productos primavera"', time: 'Hace 2 horas', interacciones: '234 reacciones' },
              { icon: '📷', text: 'Story publicada en Instagram — Video producto X', time: 'Hace 4 horas', interacciones: '1,240 vistas' },
              { icon: '💬', text: 'Mensaje respondido en WhatsApp Business — Cliente #4421', time: 'Hace 5 horas', interacciones: 'Resuelto' },
              { icon: '🔑', text: 'Token de Facebook renovado automáticamente', time: 'Ayer', interacciones: 'Válido hasta Mar 15' },
            ].map((a, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', paddingBottom: i < 3 ? '10px' : 0, borderBottom: i < 3 ? '1px solid #F3F4F6' : 'none' }}>
                <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{a.icon}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#374151' }}>{a.text}</p>
                  <div style={{ display: 'flex', gap: 10, marginTop: '2px' }}>
                    <span style={{ fontSize: '0.7rem', color: '#9CA3AF' }}>{a.time}</span>
                    <span style={{ fontSize: '0.7rem', color: ORANGE, fontWeight: '600' }}>{a.interacciones}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

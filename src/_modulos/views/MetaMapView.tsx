/* =====================================================
   MetaMapView — MetaMap Config / KYC & Onboarding
   Verificación de identidad · Flujos configurables
   ===================================================== */
import React, { useState } from 'react';
import { OrangeHeader } from '@/app/components/admin/OrangeHeader';
import type { MainSection } from '@/app/AdminDashboard';
import { GitBranch, CheckCircle, AlertTriangle, Settings, Eye, Users, FileText, Shield, Zap, ChevronRight } from 'lucide-react';

const ORANGE = '#FF6835';
interface Props { onNavigate: (s: MainSection) => void; }

type Tab = 'config' | 'flujos' | 'solicitudes' | 'estadisticas';

const solicitudes = [
  { id: 'KYC-001', nombre: 'Ana García', tipo: 'Persona física', estado: 'aprobado', nivel: 'Básico', fecha: '2026-02-24', score: 98, pais: '🇺🇾' },
  { id: 'KYC-002', nombre: 'TechCorp SRL', tipo: 'Empresa', estado: 'en_revision', nivel: 'Empresarial', fecha: '2026-02-24', score: 72, pais: '🇺🇾' },
  { id: 'KYC-003', nombre: 'Carlos Rodríguez', tipo: 'Persona física', estado: 'aprobado', nivel: 'Estándar', fecha: '2026-02-23', score: 91, pais: '🇦🇷' },
  { id: 'KYC-004', nombre: 'María López', tipo: 'Persona física', estado: 'rechazado', nivel: 'Estándar', fecha: '2026-02-22', score: 34, pais: '🇧🇷' },
  { id: 'KYC-005', nombre: 'ODDY Marketplace SRL', tipo: 'Empresa', estado: 'aprobado', nivel: 'Empresarial', fecha: '2026-02-20', score: 100, pais: '🇺🇾' },
];

const flujos = [
  {
    id: 'basico', nombre: 'Verificación Básica', descripcion: 'Email + Selfie + DNI anverso', activo: true, pasos: 3,
    checks: ['Verificación de email', 'Selfie en tiempo real', 'DNI/Pasaporte (frente)'],
    usos: 234, tiempo: '2 min',
  },
  {
    id: 'estandar', nombre: 'Verificación Estándar', descripcion: 'Básico + DNI reverso + Prueba de vida', activo: true, pasos: 5,
    checks: ['Verificación de email', 'Selfie en tiempo real', 'DNI (frente y dorso)', 'Prueba de vida (liveness)', 'Verificación facial biométrica'],
    usos: 89, tiempo: '4 min',
  },
  {
    id: 'empresarial', nombre: 'Verificación Empresarial', descripcion: 'KYB completo para empresas', activo: false, pasos: 8,
    checks: ['Razón social y RUT', 'Documentos societarios', 'Representante legal KYC', 'Estructura de propiedad', 'Verificación domicilio', 'Antecedentes PEP/sancionados', 'Listas negras OFAC', 'Aprobación manual'],
    usos: 12, tiempo: '24-48h',
  },
];

const estadoStyle = {
  aprobado:    { bg: '#D1FAE5', color: '#059669', label: 'Aprobado' },
  en_revision: { bg: '#FEF3C7', color: '#D97706', label: 'En revisión' },
  rechazado:   { bg: '#FEE2E2', color: '#DC2626', label: 'Rechazado' },
};

export function MetaMapView({ onNavigate }: Props) {
  const [tab, setTab] = useState<Tab>('config');
  const [config, setConfig] = useState({
    apiKey: 'mm_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    entorno: 'sandbox',
    webhookUrl: 'https://xxxx.supabase.co/functions/v1/metamap-webhook',
    autoApprove: false,
    notifyEmail: true,
    minScore: 70,
  });

  const aprobados = solicitudes.filter(s => s.estado === 'aprobado').length;
  const rechazados = solicitudes.filter(s => s.estado === 'rechazado').length;
  const enRevision = solicitudes.filter(s => s.estado === 'en_revision').length;

  const TABS: { id: Tab; label: string }[] = [
    { id: 'config', label: '⚙️ Configuración' },
    { id: 'flujos', label: '🔀 Flujos de verificación' },
    { id: 'solicitudes', label: '📋 Solicitudes KYC' },
    { id: 'estadisticas', label: '📊 Estadísticas' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', backgroundColor: '#F8F9FA' }}>
      <OrangeHeader
        icon={GitBranch}
        title="MetaMap Config"
        subtitle="Verificación de identidad KYC/KYB · Onboarding configurable · Documentos · Biometría"
        actions={[
          { label: '← Volver', onClick: () => onNavigate('sistema') },
          { label: '💾 Guardar', primary: true },
        ]}
      />

      {/* Tabs */}
      <div style={{ backgroundColor: '#fff', borderBottom: '1px solid #E9ECEF', padding: '0 32px', display: 'flex', flexShrink: 0 }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id as Tab)}
            style={{ padding: '14px 18px', borderBottom: `3px solid ${tab === t.id ? ORANGE : 'transparent'}`, border: 'none', backgroundColor: 'transparent', color: tab === t.id ? ORANGE : '#6B7280', fontWeight: tab === t.id ? '700' : '500', fontSize: '0.85rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '28px 32px' }}>

        {tab === 'config' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, maxWidth: 900 }}>
            <div style={{ backgroundColor: '#fff', borderRadius: 16, border: '1px solid #E5E7EB', padding: 24 }}>
              <h3 style={{ margin: '0 0 20px', color: '#1A1A2E', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Shield size={16} color={ORANGE} /> Credenciales MetaMap
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ fontSize: '0.78rem', color: '#6B7280', fontWeight: '600', display: 'block', marginBottom: 6 }}>API Key</label>
                  <input value={config.apiKey} onChange={e => setConfig(p => ({ ...p, apiKey: e.target.value }))}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 9, border: '1px solid #E5E7EB', fontSize: '0.82rem', outline: 'none', fontFamily: 'monospace', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', color: '#6B7280', fontWeight: '600', display: 'block', marginBottom: 6 }}>Entorno</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {['sandbox', 'production'].map(e => (
                      <button key={e} onClick={() => setConfig(p => ({ ...p, entorno: e }))}
                        style={{ flex: 1, padding: '9px', borderRadius: 9, border: `2px solid ${config.entorno === e ? ORANGE : '#E5E7EB'}`, backgroundColor: config.entorno === e ? `${ORANGE}10` : '#F9FAFB', color: config.entorno === e ? ORANGE : '#6B7280', fontWeight: config.entorno === e ? '700' : '500', fontSize: '0.82rem', cursor: 'pointer' }}>
                        {e === 'sandbox' ? '🧪 Sandbox' : '🚀 Producción'}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', color: '#6B7280', fontWeight: '600', display: 'block', marginBottom: 6 }}>Webhook URL</label>
                  <input value={config.webhookUrl} onChange={e => setConfig(p => ({ ...p, webhookUrl: e.target.value }))}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 9, border: '1px solid #E5E7EB', fontSize: '0.78rem', outline: 'none', fontFamily: 'monospace', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', color: '#6B7280', fontWeight: '600', display: 'block', marginBottom: 6 }}>Score mínimo de aprobación: {config.minScore}</label>
                  <input type="range" min={0} max={100} value={config.minScore} onChange={e => setConfig(p => ({ ...p, minScore: Number(e.target.value) }))}
                    style={{ width: '100%', accentColor: ORANGE }} />
                </div>
                {[
                  { label: 'Auto-aprobación sobre score mínimo', key: 'autoApprove' },
                  { label: 'Notificar por email al aprobar/rechazar', key: 'notifyEmail' },
                ].map(f => (
                  <div key={f.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 10, backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB' }}>
                    <span style={{ fontSize: '0.82rem', color: '#374151', fontWeight: '600' }}>{f.label}</span>
                    <button onClick={() => setConfig(p => ({ ...p, [f.key]: !p[f.key as keyof typeof config] }))}
                      style={{ width: 40, height: 22, borderRadius: 11, border: 'none', backgroundColor: config[f.key as keyof typeof config] ? ORANGE : '#D1D5DB', cursor: 'pointer', position: 'relative', transition: 'background 0.2s' }}>
                      <div style={{ width: 18, height: 18, borderRadius: '50%', backgroundColor: '#fff', position: 'absolute', top: 2, left: config[f.key as keyof typeof config] ? 20 : 2, transition: 'left 0.2s' }} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ backgroundColor: '#fff', borderRadius: 16, border: '1px solid #E5E7EB', padding: 24 }}>
              <h3 style={{ margin: '0 0 20px', color: '#1A1A2E', fontSize: '1rem' }}>Estado de la integración</h3>
              {[
                { label: 'API Key válida', ok: true },
                { label: 'Webhook configurado', ok: !!config.webhookUrl },
                { label: 'Entorno: ' + config.entorno, ok: true },
                { label: 'Score mínimo: ' + config.minScore, ok: config.minScore >= 50 },
              ].map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 9, backgroundColor: s.ok ? '#D1FAE5' : '#FEE2E2', marginBottom: 8 }}>
                  {s.ok ? <CheckCircle size={14} color="#059669" /> : <AlertTriangle size={14} color="#DC2626" />}
                  <span style={{ fontSize: '0.82rem', color: s.ok ? '#065F46' : '#991B1B', fontWeight: '600' }}>{s.label}</span>
                </div>
              ))}
              <div style={{ marginTop: 16, padding: 16, borderRadius: 12, backgroundColor: '#F0F9FF', border: '1px solid #BFDBFE' }}>
                <p style={{ margin: '0 0 8px', fontWeight: '700', color: '#1D4ED8', fontSize: '0.82rem' }}>🔗 Documentación MetaMap</p>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#374151' }}>docs.metamap.com/v2/quickstart</p>
              </div>
            </div>
          </div>
        )}

        {tab === 'flujos' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {flujos.map(f => (
              <div key={f.id} style={{ backgroundColor: '#fff', borderRadius: 16, border: '1px solid #E5E7EB', padding: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                      <span style={{ fontWeight: '800', color: '#1A1A2E', fontSize: '1rem' }}>{f.nombre}</span>
                      <span style={{ padding: '3px 10px', borderRadius: 8, backgroundColor: f.activo ? '#D1FAE5' : '#F3F4F6', color: f.activo ? '#059669' : '#6B7280', fontSize: '0.72rem', fontWeight: '700' }}>
                        {f.activo ? '● Activo' : 'Inactivo'}
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.82rem', color: '#6B7280' }}>{f.descripcion}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: '700', color: '#1A1A2E', fontSize: '1.1rem' }}>{f.usos}</div>
                    <div style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>usos</div>
                    <div style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: 2 }}>~{f.tiempo}</div>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8 }}>
                  {f.checks.map((c, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 8, backgroundColor: '#F9FAFB' }}>
                      <div style={{ width: 22, height: 22, borderRadius: '50%', backgroundColor: `${ORANGE}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: '800', color: ORANGE, flexShrink: 0 }}>{i + 1}</div>
                      <span style={{ fontSize: '0.78rem', color: '#374151' }}>{c}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'solicitudes' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
              {[
                { label: 'Total solicitudes', value: solicitudes.length, icon: '📋', color: '#1A1A2E' },
                { label: 'Aprobadas', value: aprobados, icon: '✅', color: '#059669' },
                { label: 'En revisión', value: enRevision, icon: '⏳', color: '#D97706' },
                { label: 'Rechazadas', value: rechazados, icon: '❌', color: '#DC2626' },
              ].map((k, i) => (
                <div key={i} style={{ backgroundColor: '#fff', borderRadius: 14, border: '1px solid #E5E7EB', padding: 20 }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: 6 }}>{k.icon}</div>
                  <div style={{ fontSize: '0.78rem', color: '#6B7280' }}>{k.label}</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: '800', color: k.color }}>{k.value}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {solicitudes.map(s => {
                const st = estadoStyle[s.estado as keyof typeof estadoStyle];
                return (
                  <div key={s.id} style={{ backgroundColor: '#fff', borderRadius: 14, border: '1px solid #E5E7EB', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ fontSize: '1.3rem' }}>{s.pais}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '700', color: '#1A1A2E', marginBottom: 2 }}>{s.nombre}</div>
                      <div style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>{s.id} · {s.tipo} · {s.nivel} · {s.fecha}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: '800', color: s.score >= 70 ? '#059669' : '#DC2626', fontSize: '1.1rem' }}>{s.score}</div>
                        <div style={{ fontSize: '0.68rem', color: '#9CA3AF' }}>score</div>
                      </div>
                      <span style={{ padding: '4px 12px', borderRadius: 8, backgroundColor: st.bg, color: st.color, fontSize: '0.75rem', fontWeight: '700' }}>{st.label}</span>
                      <button style={{ padding: '6px', borderRadius: 8, border: '1px solid #E5E7EB', backgroundColor: '#F9FAFB', cursor: 'pointer' }}>
                        <Eye size={14} color="#6B7280" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {tab === 'estadisticas' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, maxWidth: 800 }}>
            {[
              { titulo: 'Tasa de aprobación', valor: `${Math.round((aprobados / solicitudes.length) * 100)}%`, descripcion: `${aprobados} aprobados de ${solicitudes.length} totales`, color: '#10B981' },
              { titulo: 'Tiempo promedio', valor: '3.2 min', descripcion: 'Para verificación Estándar', color: '#3B82F6' },
              { titulo: 'Score promedio', valor: '79', descripcion: 'De todos los verificados', color: ORANGE },
              { titulo: 'Flujos activos', valor: `${flujos.filter(f => f.activo).length}`, descripcion: 'De 3 flujos disponibles', color: '#8B5CF6' },
            ].map((s, i) => (
              <div key={i} style={{ backgroundColor: '#fff', borderRadius: 16, border: '1px solid #E5E7EB', padding: 28, textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: '900', color: s.color, marginBottom: 8 }}>{s.valor}</div>
                <div style={{ fontWeight: '700', color: '#1A1A2E', marginBottom: 4 }}>{s.titulo}</div>
                <div style={{ fontSize: '0.82rem', color: '#9CA3AF' }}>{s.descripcion}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

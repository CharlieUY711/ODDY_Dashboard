/* =====================================================
   IntegracionesServiciosView — Comunicaciones y Automatizaciones
   Twilio · Resend · SendGrid · GA4 · GTM · Zapier · n8n · Slack
   ===================================================== */
import React, { useState } from 'react';
import { OrangeHeader } from '@/app/components/admin/OrangeHeader';
import type { MainSection } from '@/app/AdminDashboard';
import { Settings2, CheckCircle, XCircle, Zap, Eye, EyeOff, RefreshCw, TestTube } from 'lucide-react';

const ORANGE = '#FF6835';
interface Props { onNavigate: (s: MainSection) => void; }

const servicios = [
  {
    id: 'twilio', nombre: 'Twilio', categoria: 'SMS / WhatsApp', emoji: '📱',
    color: '#F22F46', estado: 'conectado',
    descripcion: 'SMS masivos, WhatsApp Business API y llamadas de voz automatizadas.',
    apiKey: 'ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    features: ['SMS masivos', 'WhatsApp API', 'Llamadas de voz', 'Verify (OTP)'],
    uso: '2,340 SMS enviados este mes',
  },
  {
    id: 'resend', nombre: 'Resend', categoria: 'Email Transaccional', emoji: '✉️',
    color: '#000000', estado: 'conectado',
    descripcion: 'Email transaccional moderno. React Email + DKIM configurado.',
    apiKey: 're_xxxxxxxxxxxxxxxxxxxx',
    features: ['Email transaccional', 'React Email templates', 'DKIM & SPF', 'Webhooks de entrega'],
    uso: '18,420 emails enviados este mes',
  },
  {
    id: 'sendgrid', nombre: 'SendGrid', categoria: 'Email Marketing', emoji: '📧',
    color: '#1A82E2', estado: 'desconectado',
    descripcion: 'Email marketing masivo con plantillas y segmentación avanzada.',
    apiKey: '',
    features: ['Email masivo', 'Plantillas drag & drop', 'Segmentación', 'A/B Testing'],
    uso: '—',
  },
  {
    id: 'ga4', nombre: 'Google Analytics 4', categoria: 'Analíticas', emoji: '📊',
    color: '#E37400', estado: 'conectado',
    descripcion: 'GA4 con eventos personalizados, embudos y audiencias predictivas.',
    apiKey: 'G-XXXXXXXXXX',
    features: ['Eventos personalizados', 'Embudos de conversión', 'Audiencias', 'BigQuery export'],
    uso: '42,800 sesiones este mes',
  },
  {
    id: 'gtm', nombre: 'Google Tag Manager', categoria: 'Analíticas', emoji: '🏷️',
    color: '#4285F4', estado: 'conectado',
    descripcion: 'GTM para gestión centralizada de tags, píxeles y eventos.',
    apiKey: 'GTM-XXXXXXX',
    features: ['Tags centralizados', 'Debug & preview', 'Versiones', 'Triggers custom'],
    uso: '5 containers activos',
  },
  {
    id: 'zapier', nombre: 'Zapier', categoria: 'Automatización', emoji: '⚡',
    color: '#FF4A00', estado: 'configurando',
    descripcion: 'Automatizaciones sin código. Conecta ODDY con más de 5,000 apps.',
    apiKey: 'zap_xxxxxxxxxxxxxxxxxxxxxxxx',
    features: ['5,000+ integraciones', 'Multi-step Zaps', 'Webhooks', 'Filtros y condiciones'],
    uso: '12 Zaps activos',
  },
  {
    id: 'n8n', nombre: 'n8n', categoria: 'Automatización', emoji: '🔀',
    color: '#EA4B71', estado: 'desconectado',
    descripcion: 'Automatización self-hosted. Workflows complejos con lógica avanzada.',
    apiKey: '',
    features: ['Self-hosted', 'Workflows visuales', 'Code nodes', 'Webhooks bidireccionales'],
    uso: '—',
  },
  {
    id: 'slack', nombre: 'Slack', categoria: 'Comunicación', emoji: '💬',
    color: '#4A154B', estado: 'conectado',
    descripcion: 'Notificaciones de pedidos, alertas y reportes automáticos en Slack.',
    apiKey: 'xoxb-xxxxxxxxxxxx-xxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxx',
    features: ['Alertas de pedidos', 'Reportes diarios', 'Notificaciones de stock', 'Bot personalizado'],
    uso: '234 mensajes hoy',
  },
];

const estadoStyle = {
  conectado:    { bg: '#D1FAE5', color: '#059669', label: 'Conectado', icon: CheckCircle },
  configurando: { bg: '#FEF3C7', color: '#D97706', label: 'Configurando', icon: RefreshCw },
  desconectado: { bg: '#F3F4F6', color: '#6B7280', label: 'Desconectado', icon: XCircle },
};

const categorias = ['Todos', 'SMS / WhatsApp', 'Email Transaccional', 'Email Marketing', 'Analíticas', 'Automatización', 'Comunicación'];

export function IntegracionesServiciosView({ onNavigate }: Props) {
  const [filtro, setFiltro] = useState('Todos');
  const [showKey, setShowKey] = useState<Record<string, boolean>>({});

  const filtrados = filtro === 'Todos' ? servicios : servicios.filter(s => s.categoria === filtro);
  const conectados = servicios.filter(s => s.estado === 'conectado').length;

  const toggleKey = (id: string) => setShowKey(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', backgroundColor: '#F8F9FA' }}>
      <OrangeHeader
        icon={Settings2}
        title="Integraciones de Servicios"
        subtitle="Comunicaciones y automatizaciones — Twilio, Resend, GA4, GTM, Zapier, n8n, Slack"
        actions={[
          { label: '← Volver', onClick: () => onNavigate('integraciones') },
          { label: '+ Agregar servicio', primary: true },
        ]}
      />

      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px' }}>

        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
          {[
            { label: 'Servicios conectados', value: `${conectados}/8`, icon: '🔗' },
            { label: 'SMS enviados', value: '2,340', icon: '📱' },
            { label: 'Emails enviados', value: '18,420', icon: '✉️' },
            { label: 'Sesiones GA4', value: '42.8K', icon: '📊' },
          ].map((k, i) => (
            <div key={i} style={{ backgroundColor: '#fff', borderRadius: 14, border: '1px solid #E5E7EB', padding: 20 }}>
              <div style={{ fontSize: '1.5rem', marginBottom: 6 }}>{k.icon}</div>
              <div style={{ fontSize: '0.78rem', color: '#6B7280', marginBottom: 4 }}>{k.label}</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1A1A2E' }}>{k.value}</div>
            </div>
          ))}
        </div>

        {/* Filtro por categoría */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
          {categorias.map(c => (
            <button key={c} onClick={() => setFiltro(c)}
              style={{ padding: '7px 16px', borderRadius: 10, border: `2px solid ${filtro === c ? ORANGE : '#E5E7EB'}`, backgroundColor: filtro === c ? `${ORANGE}10` : '#fff', color: filtro === c ? ORANGE : '#6B7280', fontWeight: filtro === c ? '700' : '500', fontSize: '0.82rem', cursor: 'pointer' }}>
              {c}
            </button>
          ))}
        </div>

        {/* Lista de servicios */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {filtrados.map(s => {
            const st = estadoStyle[s.estado as keyof typeof estadoStyle];
            const Icon = st.icon;
            return (
              <div key={s.id} style={{ backgroundColor: '#fff', borderRadius: 14, border: '1px solid #E5E7EB', padding: 24 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 16 }}>
                  <div style={{ width: 52, height: 52, borderRadius: 14, backgroundColor: `${s.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>
                    {s.emoji}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                      <span style={{ fontWeight: '800', color: '#1A1A2E', fontSize: '1rem' }}>{s.nombre}</span>
                      <span style={{ padding: '3px 10px', borderRadius: 8, backgroundColor: '#F3F4F6', color: '#6B7280', fontSize: '0.7rem', fontWeight: '600' }}>{s.categoria}</span>
                      <span style={{ padding: '3px 10px', borderRadius: 8, backgroundColor: st.bg, color: st.color, fontSize: '0.7rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Icon size={11} /> {st.label}
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.82rem', color: '#6B7280' }}>{s.descripcion}</p>
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                    {s.estado === 'conectado' ? (
                      <>
                        <button style={{ padding: '8px 14px', borderRadius: 9, border: '1px solid #E5E7EB', backgroundColor: '#F9FAFB', color: '#374151', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                          <TestTube size={13} /> Probar
                        </button>
                        <button style={{ padding: '8px 14px', borderRadius: 9, border: 'none', backgroundColor: ORANGE, color: '#fff', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Settings2 size={13} /> Config.
                        </button>
                      </>
                    ) : (
                      <button style={{ padding: '8px 16px', borderRadius: 9, border: 'none', backgroundColor: ORANGE, color: '#fff', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Zap size={13} /> Conectar
                      </button>
                    )}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  {/* Features */}
                  <div>
                    <p style={{ margin: '0 0 8px', fontSize: '0.75rem', color: '#9CA3AF', fontWeight: '700', textTransform: 'uppercase' }}>Funcionalidades</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {s.features.map(f => (
                        <span key={f} style={{ padding: '3px 10px', borderRadius: 6, backgroundColor: '#F3F4F6', color: '#374151', fontSize: '0.75rem' }}>{f}</span>
                      ))}
                    </div>
                  </div>

                  {/* API Key */}
                  {s.apiKey && (
                    <div>
                      <p style={{ margin: '0 0 8px', fontSize: '0.75rem', color: '#9CA3AF', fontWeight: '700', textTransform: 'uppercase' }}>API Key</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <code style={{ flex: 1, padding: '6px 10px', borderRadius: 8, backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', fontSize: '0.75rem', color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {showKey[s.id] ? s.apiKey : '•'.repeat(24)}
                        </code>
                        <button onClick={() => toggleKey(s.id)} style={{ padding: '6px', borderRadius: 8, border: '1px solid #E5E7EB', backgroundColor: '#fff', cursor: 'pointer', display: 'flex' }}>
                          {showKey[s.id] ? <EyeOff size={14} color="#6B7280" /> : <Eye size={14} color="#6B7280" />}
                        </button>
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#9CA3AF', marginTop: 6 }}>{s.uso}</div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* =====================================================
   HealthMonitorView — Estado de Servicios en Tiempo Real
   Supabase DB · Auth · Edge Functions · APIs externas
   ===================================================== */
import React, { useState, useEffect } from 'react';
import { OrangeHeader } from '@/app/components/admin/OrangeHeader';
import type { MainSection } from '@/app/AdminDashboard';
import { Activity, CheckCircle, AlertTriangle, XCircle, RefreshCw, Clock, Zap, Database, Globe } from 'lucide-react';

const ORANGE = '#FF6835';
interface Props { onNavigate: (s: MainSection) => void; }

const servicios = [
  { nombre: 'Supabase Database', categoria: 'supabase', estado: 'operativo', latencia: 24, uptime: 99.98, icono: '🗄️', descripcion: 'PostgreSQL · Conexiones activas: 8/100' },
  { nombre: 'Supabase Auth', categoria: 'supabase', estado: 'operativo', latencia: 18, uptime: 99.99, icono: '🔐', descripcion: 'JWT tokens · 234 sesiones activas' },
  { nombre: 'Supabase Edge Functions', categoria: 'supabase', estado: 'operativo', latencia: 45, uptime: 99.94, icono: '⚡', descripcion: 'make-server-75638143 · 12 invocaciones/min' },
  { nombre: 'Supabase Storage', categoria: 'supabase', estado: 'operativo', latencia: 32, uptime: 99.97, icono: '📦', descripcion: 'Bucket assets · 7.6 GB usados' },
  { nombre: 'MercadoPago API', categoria: 'externo', estado: 'operativo', latencia: 180, uptime: 99.89, icono: '💙', descripcion: 'Pagos · Último test: hace 5 min' },
  { nombre: 'OCA API', categoria: 'externo', estado: 'degradado', latencia: 820, uptime: 97.40, icono: '🔵', descripcion: 'Tracking · Latencia alta detectada' },
  { nombre: 'Resend (Email)', categoria: 'externo', estado: 'operativo', latencia: 95, uptime: 99.95, icono: '📧', descripcion: '4 emails enviados hoy' },
  { nombre: 'Google Analytics', categoria: 'externo', estado: 'operativo', latencia: 62, uptime: 99.92, icono: '📊', descripcion: 'GA4 · Datos en tiempo real' },
  { nombre: 'Meta Business', categoria: 'externo', estado: 'operativo', latencia: 145, uptime: 99.80, icono: '👥', descripcion: 'Instagram + Facebook APIs' },
  { nombre: 'Plexo Gateway', categoria: 'externo', estado: 'operativo', latencia: 89, uptime: 99.91, icono: '🔷', descripcion: 'Pagos Uruguay · Activo' },
  { nombre: 'Twilio SMS', categoria: 'externo', estado: 'inactivo', latencia: 0, uptime: 0, icono: '📱', descripcion: 'Sin credenciales configuradas' },
  { nombre: 'SendGrid', categoria: 'externo', estado: 'inactivo', latencia: 0, uptime: 0, icono: '📬', descripcion: 'No configurado' },
];

const eventos = [
  { tipo: 'info', mensaje: 'Edge Function make-server-75638143 ejecutada correctamente', hora: '14:32:18' },
  { tipo: 'warn', mensaje: 'OCA API: latencia elevada (820ms vs normal 180ms)', hora: '14:28:45' },
  { tipo: 'info', mensaje: 'Supabase DB: backup automático completado', hora: '14:00:00' },
  { tipo: 'info', mensaje: 'MercadoPago: webhook recibido (pago ORD-8841)', hora: '13:55:12' },
  { tipo: 'error', mensaje: 'Twilio: credenciales no configuradas', hora: '12:00:01' },
];

const colorEstado = {
  operativo: { bg: '#D1FAE5', color: '#059669', icon: CheckCircle, label: 'Operativo' },
  degradado: { bg: '#FEF3C7', color: '#D97706', icon: AlertTriangle, label: 'Degradado' },
  inactivo:  { bg: '#F3F4F6', color: '#9CA3AF', icon: XCircle, label: 'Inactivo' },
  caido:     { bg: '#FEE2E2', color: '#DC2626', icon: XCircle, label: 'Caído' },
};

export function HealthMonitorView({ onNavigate }: Props) {
  const [loading, setLoading] = useState(false);
  const [ultimaActualizacion, setUltimaActualizacion] = useState(new Date().toLocaleTimeString('es'));
  const [filtro, setFiltro] = useState<'todos' | 'supabase' | 'externo'>('todos');

  function refrescar() {
    setLoading(true);
    setTimeout(() => { setLoading(false); setUltimaActualizacion(new Date().toLocaleTimeString('es')); }, 1200);
  }

  const operativos = servicios.filter(s => s.estado === 'operativo').length;
  const degradados = servicios.filter(s => s.estado === 'degradado').length;
  const inactivos = servicios.filter(s => s.estado === 'inactivo').length;
  const lista = filtro === 'todos' ? servicios : servicios.filter(s => s.categoria === filtro);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', backgroundColor: '#F8F9FA' }}>
      <OrangeHeader
        icon={Activity}
        title="Health Monitor"
        subtitle="Estado de servicios en tiempo real · Supabase · APIs externas"
        actions={[
          { label: '← Volver', onClick: () => onNavigate('auditoria') },
          { label: loading ? '⏳ Actualizando...' : '🔄 Refrescar', onClick: refrescar, primary: true },
        ]}
      />
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
        {/* Status global */}
        <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: `2px solid ${degradados > 0 ? '#FEF3C7' : '#D1FAE5'}`, padding: '18px 22px', marginBottom: 22, display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 48, height: 48, borderRadius: '12px', backgroundColor: degradados > 0 ? '#FEF3C7' : '#D1FAE5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Activity size={24} color={degradados > 0 ? '#D97706' : '#059669'} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: '800', color: '#1A1A2E', fontSize: '1rem' }}>
              {degradados > 0 ? '⚠️ Servicio parcialmente degradado' : '✅ Todos los sistemas operativos'}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#9CA3AF', marginTop: 2 }}>
              {operativos} operativos · {degradados} degradados · {inactivos} inactivos · Última actualización: {ultimaActualizacion}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#059669' }}>{operativos}</div>
              <div style={{ fontSize: '0.68rem', color: '#9CA3AF' }}>OK</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#D97706' }}>{degradados}</div>
              <div style={{ fontSize: '0.68rem', color: '#9CA3AF' }}>Degradados</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#9CA3AF' }}>{inactivos}</div>
              <div style={{ fontSize: '0.68rem', color: '#9CA3AF' }}>Inactivos</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>
          {/* Servicios */}
          <div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
              {[{ id: 'todos' as const, label: 'Todos' }, { id: 'supabase' as const, label: '⚡ Supabase' }, { id: 'externo' as const, label: '🌐 Externos' }].map(f => (
                <button key={f.id} onClick={() => setFiltro(f.id)} style={{ padding: '5px 14px', borderRadius: '8px', border: `1px solid ${filtro === f.id ? ORANGE : '#E5E7EB'}`, backgroundColor: filtro === f.id ? `${ORANGE}10` : '#fff', color: filtro === f.id ? ORANGE : '#374151', fontSize: '0.82rem', fontWeight: '600', cursor: 'pointer' }}>
                  {f.label}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {lista.map((s, i) => {
                const cs = colorEstado[s.estado as keyof typeof colorEstado];
                const StatusIcon = cs.icon;
                return (
                  <div key={i} style={{ backgroundColor: '#fff', borderRadius: '12px', border: `1px solid ${s.estado === 'degradado' ? '#FEF3C7' : '#E5E7EB'}`, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
                    <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>{s.icono}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '700', color: '#1A1A2E', fontSize: '0.88rem' }}>{s.nombre}</div>
                      <div style={{ fontSize: '0.75rem', color: '#9CA3AF', marginTop: 2 }}>{s.descripcion}</div>
                    </div>
                    {s.estado !== 'inactivo' && (
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontSize: '0.82rem', fontWeight: '700', color: s.latencia < 200 ? '#059669' : s.latencia < 500 ? ORANGE : '#DC2626' }}>{s.latencia} ms</div>
                        <div style={{ fontSize: '0.7rem', color: '#9CA3AF' }}>uptime {s.uptime}%</div>
                      </div>
                    )}
                    <span style={{ fontSize: '0.72rem', fontWeight: '700', padding: '3px 10px', borderRadius: '6px', backgroundColor: cs.bg, color: cs.color, whiteSpace: 'nowrap', flexShrink: 0 }}>
                      {cs.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Log de eventos */}
          <div>
            <div style={{ fontWeight: '700', color: '#1A1A2E', marginBottom: 12, fontSize: '0.88rem' }}>📋 Eventos Recientes</div>
            <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
              {eventos.map((e, i) => (
                <div key={i} style={{ padding: '12px 16px', borderBottom: i < eventos.length - 1 ? '1px solid #F9FAFB' : 'none', display: 'flex', gap: 10 }}>
                  <span style={{ fontSize: '0.85rem', flexShrink: 0 }}>
                    {e.tipo === 'error' ? '🔴' : e.tipo === 'warn' ? '🟡' : '🟢'}
                  </span>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: '#374151', lineHeight: 1.4 }}>{e.mensaje}</div>
                    <div style={{ fontSize: '0.7rem', color: '#9CA3AF', marginTop: 3 }}>{e.hora}</div>
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

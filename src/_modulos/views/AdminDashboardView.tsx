/* =====================================================
   AdminDashboardView — Panel de Administración
   Usuarios por rol · Estado de servicios · Alertas
   ===================================================== */
import React, { useState } from 'react';
import { OrangeHeader } from '@/app/components/admin/OrangeHeader';
import type { MainSection } from '@/app/AdminDashboard';
import { LayoutDashboard, Users, Shield, Activity, AlertTriangle, CheckCircle, Settings, TrendingUp, Server } from 'lucide-react';

const ORANGE = '#FF6835';
interface Props { onNavigate: (s: MainSection) => void; }

const usuariosPorRol = [
  { rol: 'Admin', cantidad: 2, color: ORANGE, pct: 4 },
  { rol: 'Operador', cantidad: 8, color: '#3B82F6', pct: 18 },
  { rol: 'Vendedor', cantidad: 15, color: '#10B981', pct: 33 },
  { rol: 'Logístico', cantidad: 6, color: '#8B5CF6', pct: 13 },
  { rol: 'Solo lectura', cantidad: 14, color: '#6B7280', pct: 31 },
];
const totalUsuarios = usuariosPorRol.reduce((a, u) => a + u.cantidad, 0);

const alertas = [
  { tipo: 'error', msg: 'Error de integración PedidosYa — latencia 850ms', hora: '10:08', icono: '🔴' },
  { tipo: 'warning', msg: '3 intentos de login fallidos desde IP 94.23.45.12', hora: '10:07', icono: '⚠️' },
  { tipo: 'warning', msg: 'Stock crítico: Producto A — 3 unidades restantes', hora: '09:52', icono: '📦' },
  { tipo: 'info', msg: 'Backup automático completado — 2.4 GB', hora: '08:00', icono: '💾' },
];

const servicios = [
  { nombre: 'Supabase DB', estado: 'ok', latencia: '55ms' },
  { nombre: 'Edge Functions', estado: 'ok', latencia: '88ms' },
  { nombre: 'Supabase Storage', estado: 'ok', latencia: '120ms' },
  { nombre: 'Twilio SMS', estado: 'ok', latencia: '120ms' },
  { nombre: 'Resend Email', estado: 'ok', latencia: '95ms' },
  { nombre: 'MercadoPago', estado: 'ok', latencia: '210ms' },
  { nombre: 'PedidosYa', estado: 'degradado', latencia: '850ms' },
  { nombre: 'Correo UY', estado: 'ok', latencia: '340ms' },
];

const actividadAdmin = [
  { usuario: 'Sistema', accion: 'Backup automático completado', hora: '08:00', tipo: 'info' },
  { usuario: 'Ana G.', accion: 'Modificó permisos del rol "Vendedor"', hora: '09:15', tipo: 'warning' },
  { usuario: 'Sistema', accion: 'Renovó certificados SSL', hora: '09:30', tipo: 'info' },
  { usuario: 'Carlos R.', accion: 'Agregó nuevo usuario: laura.m@email.com', hora: '09:58', tipo: 'success' },
  { usuario: 'Ana G.', accion: 'Actualización de configuración de mailing', hora: '10:22', tipo: 'info' },
];

export function AdminDashboardView({ onNavigate }: Props) {
  const [periodo, setPeriodo] = useState('hoy');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', backgroundColor: '#F8F9FA' }}>
      <OrangeHeader
        icon={LayoutDashboard}
        title="Dashboard de Administración"
        subtitle="Panel de control del sistema · Usuarios · Estado de servicios · Alertas"
        actions={[
          { label: '← Volver', onClick: () => onNavigate('sistema') },
          { label: '⚙️ Config. sistema', onClick: () => onNavigate('sistema') },
        ]}
      />

      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px' }}>

        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
          {[
            { label: 'Usuarios totales', value: totalUsuarios, icon: '👥', color: '#1A1A2E', sub: `${usuariosPorRol.find(u => u.rol === 'Admin')?.cantidad} admins` },
            { label: 'Sesiones activas', value: 12, icon: '🟢', color: '#10B981', sub: 'En línea ahora' },
            { label: 'Servicios OK', value: `${servicios.filter(s => s.estado === 'ok').length}/${servicios.length}`, icon: '⚡', color: ORANGE, sub: '1 degradado' },
            { label: 'Alertas hoy', value: alertas.length, icon: '🔔', color: '#EF4444', sub: `${alertas.filter(a => a.tipo === 'error').length} críticas` },
          ].map((k, i) => (
            <div key={i} style={{ backgroundColor: '#fff', borderRadius: 14, border: '1px solid #E5E7EB', padding: 22 }}>
              <div style={{ fontSize: '1.6rem', marginBottom: 8 }}>{k.icon}</div>
              <div style={{ fontSize: '0.78rem', color: '#6B7280', marginBottom: 3 }}>{k.label}</div>
              <div style={{ fontSize: '1.8rem', fontWeight: '900', color: k.color, lineHeight: 1 }}>{k.value}</div>
              <div style={{ fontSize: '0.72rem', color: '#9CA3AF', marginTop: 4 }}>{k.sub}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>

          {/* Usuarios por rol */}
          <div style={{ backgroundColor: '#fff', borderRadius: 16, border: '1px solid #E5E7EB', padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ margin: 0, color: '#1A1A2E', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Users size={16} color={ORANGE} /> Usuarios por rol
              </h3>
              <span style={{ fontSize: '0.82rem', color: '#9CA3AF' }}>Total: {totalUsuarios}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {usuariosPorRol.map(u => (
                <div key={u.rol}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: u.color }} />
                      <span style={{ fontSize: '0.82rem', color: '#374151', fontWeight: '600' }}>{u.rol}</span>
                    </div>
                    <span style={{ fontSize: '0.82rem', color: '#1A1A2E', fontWeight: '700' }}>{u.cantidad}</span>
                  </div>
                  <div style={{ height: 8, backgroundColor: '#F3F4F6', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${u.pct}%`, backgroundColor: u.color, borderRadius: 4 }} />
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => onNavigate('auth-registro')}
              style={{ marginTop: 16, width: '100%', padding: '9px', borderRadius: 9, border: `1px solid ${ORANGE}30`, backgroundColor: `${ORANGE}08`, color: ORANGE, fontWeight: '700', fontSize: '0.82rem', cursor: 'pointer' }}>
              Gestionar usuarios →
            </button>
          </div>

          {/* Estado de servicios */}
          <div style={{ backgroundColor: '#fff', borderRadius: 16, border: '1px solid #E5E7EB', padding: 24 }}>
            <h3 style={{ margin: '0 0 16px', color: '#1A1A2E', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Server size={16} color={ORANGE} /> Estado de servicios
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {servicios.map(s => (
                <div key={s.nombre} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 9, backgroundColor: '#F9FAFB' }}>
                  {s.estado === 'ok'
                    ? <CheckCircle size={14} color="#10B981" />
                    : <AlertTriangle size={14} color="#D97706" />}
                  <span style={{ flex: 1, fontSize: '0.82rem', color: '#374151', fontWeight: '600' }}>{s.nombre}</span>
                  <span style={{ fontSize: '0.75rem', color: s.estado === 'ok' ? '#10B981' : '#D97706', fontWeight: '700', backgroundColor: s.estado === 'ok' ? '#D1FAE5' : '#FEF3C7', padding: '2px 8px', borderRadius: 6 }}>
                    {s.latencia}
                  </span>
                </div>
              ))}
            </div>
            <button onClick={() => onNavigate('auditoria-health')}
              style={{ marginTop: 14, width: '100%', padding: '9px', borderRadius: 9, border: `1px solid ${ORANGE}30`, backgroundColor: `${ORANGE}08`, color: ORANGE, fontWeight: '700', fontSize: '0.82rem', cursor: 'pointer' }}>
              Ver Health Monitor completo →
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {/* Alertas del sistema */}
          <div style={{ backgroundColor: '#fff', borderRadius: 16, border: '1px solid #E5E7EB', padding: 24 }}>
            <h3 style={{ margin: '0 0 16px', color: '#1A1A2E', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
              <AlertTriangle size={16} color={ORANGE} /> Alertas del sistema
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {alertas.map((a, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, padding: '10px 14px', borderRadius: 10, backgroundColor: a.tipo === 'error' ? '#FEF2F2' : a.tipo === 'warning' ? '#FFFBEB' : '#F0F9FF' }}>
                  <span style={{ fontSize: '1rem', flexShrink: 0 }}>{a.icono}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: '0 0 2px', fontSize: '0.8rem', color: '#374151', fontWeight: '600' }}>{a.msg}</p>
                    <p style={{ margin: 0, fontSize: '0.68rem', color: '#9CA3AF' }}>{a.hora}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actividad de administración */}
          <div style={{ backgroundColor: '#fff', borderRadius: 16, border: '1px solid #E5E7EB', padding: 24 }}>
            <h3 style={{ margin: '0 0 16px', color: '#1A1A2E', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Activity size={16} color={ORANGE} /> Log de actividad admin
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {actividadAdmin.map((a, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', backgroundColor: a.tipo === 'success' ? '#D1FAE5' : a.tipo === 'warning' ? '#FEF3C7' : '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {a.tipo === 'success' ? <CheckCircle size={12} color="#059669" /> : a.tipo === 'warning' ? <AlertTriangle size={12} color="#D97706" /> : <Activity size={12} color="#3B82F6" />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: '700', color: ORANGE }}>{a.usuario}</span>
                    <p style={{ margin: '2px 0', fontSize: '0.78rem', color: '#374151' }}>{a.accion}</p>
                    <span style={{ fontSize: '0.68rem', color: '#9CA3AF' }}>{a.hora}</span>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => onNavigate('auditoria-logs')}
              style={{ marginTop: 14, width: '100%', padding: '9px', borderRadius: 9, border: '1px solid #E5E7EB', backgroundColor: '#F9FAFB', color: '#374151', fontWeight: '600', fontSize: '0.82rem', cursor: 'pointer' }}>
              Ver todos los logs →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

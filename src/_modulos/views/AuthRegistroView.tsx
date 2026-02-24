/* =====================================================
   AuthRegistroView — Autenticación y Registro
   Login · Registro · OAuth · JWT · Recuperar contraseña
   ===================================================== */
import React, { useState } from 'react';
import { OrangeHeader } from '@/app/components/admin/OrangeHeader';
import type { MainSection } from '@/app/AdminDashboard';
import { LogIn, Shield, Users, Key, Mail, Settings, CheckCircle, Eye, EyeOff, Copy, RefreshCw } from 'lucide-react';

const ORANGE = '#FF6835';
interface Props { onNavigate: (s: MainSection) => void; }

type Tab = 'config' | 'proveedores' | 'roles' | 'sesiones' | 'logs';

const proveedores = [
  { id: 'email', nombre: 'Email / Contraseña', icono: '📧', activo: true, tipo: 'nativo', descripcion: 'Login nativo con email y password. Incluye verificación de email.' },
  { id: 'google', nombre: 'Google OAuth', icono: '🔵', activo: true, tipo: 'oauth', descripcion: 'Login con cuenta Google. Requiere proyecto en Google Cloud Console.' },
  { id: 'meta', nombre: 'Meta (Facebook)', icono: '👥', activo: false, tipo: 'oauth', descripcion: 'Login con cuenta Facebook/Instagram vía Meta Business.' },
  { id: 'github', nombre: 'GitHub', icono: '🐙', activo: false, tipo: 'oauth', descripcion: 'Login con cuenta GitHub. Ideal para equipos técnicos.' },
  { id: 'apple', nombre: 'Apple ID', icono: '🍎', activo: false, tipo: 'oauth', descripcion: 'Sign in with Apple. Requerido para apps iOS en App Store.' },
  { id: 'magic', nombre: 'Magic Link', icono: '✨', activo: true, tipo: 'passwordless', descripcion: 'Email con enlace de login sin contraseña. UX simplificada.' },
];

const sesiones = [
  { id: 1, usuario: 'ana.garcia@email.com', rol: 'Admin', ip: '192.168.1.10', dispositivo: 'Chrome / Windows 11', inicio: '2026-02-24 09:32', activa: true, avatar: 'AG' },
  { id: 2, usuario: 'carlos.r@email.com', rol: 'Vendedor', ip: '186.172.45.89', dispositivo: 'Safari / iPhone 15', inicio: '2026-02-24 10:14', activa: true, avatar: 'CR' },
  { id: 3, usuario: 'maria.l@empresa.uy', rol: 'Operador', ip: '200.40.12.34', dispositivo: 'Firefox / macOS', inicio: '2026-02-24 08:55', activa: false, avatar: 'ML' },
  { id: 4, usuario: 'roberto.f@corp.com', rol: 'Solo lectura', ip: '190.90.123.4', dispositivo: 'Edge / Windows 10', inicio: '2026-02-23 16:42', activa: false, avatar: 'RF' },
];

const logsAuth = [
  { tipo: 'success', msg: 'Login exitoso — ana.garcia@email.com (Google OAuth)', hora: '09:32:14' },
  { tipo: 'success', msg: 'Login exitoso — carlos.r@email.com (Email)', hora: '10:14:08' },
  { tipo: 'warning', msg: 'Intento fallido (contraseña incorrecta) — unknown@test.com', hora: '10:09:22' },
  { tipo: 'success', msg: 'Registro nuevo usuario — laura.m@gmail.com', hora: '09:58:41' },
  { tipo: 'error', msg: '3 intentos fallidos — bloqueo temporal IP 94.23.45.12', hora: '10:07:55' },
  { tipo: 'success', msg: 'Password reset completado — roberto.f@corp.com', hora: '08:44:10' },
  { tipo: 'info', msg: 'Token JWT renovado — maria.l@empresa.uy', hora: '10:02:33' },
];

const roles = [
  { nombre: 'Admin', color: ORANGE, permisos: 'Acceso total al sistema', usuarios: 2 },
  { nombre: 'Operador', color: '#3B82F6', permisos: 'Pedidos, logística, clientes', usuarios: 8 },
  { nombre: 'Vendedor', color: '#10B981', permisos: 'eCommerce, POS, marketing', usuarios: 15 },
  { nombre: 'Logístico', color: '#8B5CF6', permisos: 'Logística, envíos, rutas', usuarios: 6 },
  { nombre: 'Solo lectura', color: '#6B7280', permisos: 'Visualización sin edición', usuarios: 12 },
];

export function AuthRegistroView({ onNavigate }: Props) {
  const [tab, setTab] = useState<Tab>('config');
  const [config, setConfig] = useState({
    sessionTimeout: '8', maxSessions: '3', requireMFA: false,
    requireEmailVerify: true, passwordMinLength: 8, jwtExpiry: '7d',
  });
  const [showJwtSecret, setShowJwtSecret] = useState(false);

  const jwtSecret = 'super_secret_jwt_key_oddy_2026_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';

  const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'config', label: 'Configuración', icon: Settings },
    { id: 'proveedores', label: 'Proveedores OAuth', icon: Key },
    { id: 'roles', label: 'Roles', icon: Shield },
    { id: 'sesiones', label: 'Sesiones activas', icon: Users },
    { id: 'logs', label: 'Logs de Auth', icon: Mail },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', backgroundColor: '#F8F9FA' }}>
      <OrangeHeader
        icon={LogIn}
        title="Registro y Login"
        subtitle="Autenticación completa con Supabase Auth · OAuth · JWT · MFA · Sesiones"
        actions={[
          { label: '← Volver', onClick: () => onNavigate('sistema') },
          { label: '💾 Guardar config', primary: true },
        ]}
      />

      {/* Tabs */}
      <div style={{ backgroundColor: '#fff', borderBottom: '1px solid #E9ECEF', padding: '0 32px', display: 'flex', gap: 0, flexShrink: 0 }}>
        {TABS.map(t => {
          const Icon = t.icon;
          return (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{ padding: '14px 20px', borderBottom: `3px solid ${tab === t.id ? ORANGE : 'transparent'}`, border: 'none', backgroundColor: 'transparent', color: tab === t.id ? ORANGE : '#6B7280', fontWeight: tab === t.id ? '700' : '500', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, transition: 'color 0.15s' }}>
              <Icon size={15} /> {t.label}
            </button>
          );
        })}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '28px 32px' }}>

        {tab === 'config' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, maxWidth: 900 }}>
            <div style={{ backgroundColor: '#fff', borderRadius: 16, border: '1px solid #E5E7EB', padding: 24 }}>
              <h3 style={{ margin: '0 0 20px', color: '#1A1A2E', fontSize: '1rem' }}>Configuración de sesiones</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  { label: 'Timeout de sesión (horas)', key: 'sessionTimeout', type: 'number' },
                  { label: 'Sesiones simultáneas máx.', key: 'maxSessions', type: 'number' },
                  { label: 'Expiración JWT', key: 'jwtExpiry', type: 'select', opts: ['1h','24h','7d','30d'] },
                  { label: 'Longitud mínima de contraseña', key: 'passwordMinLength', type: 'number' },
                ].map(f => (
                  <div key={f.key}>
                    <label style={{ fontSize: '0.78rem', color: '#6B7280', fontWeight: '600', display: 'block', marginBottom: 6 }}>{f.label}</label>
                    {f.type === 'select' ? (
                      <select value={config[f.key as keyof typeof config] as string} onChange={e => setConfig(p => ({ ...p, [f.key]: e.target.value }))}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: 9, border: '1px solid #E5E7EB', fontSize: '0.88rem', outline: 'none', backgroundColor: '#fff' }}>
                        {f.opts?.map(o => <option key={o}>{o}</option>)}
                      </select>
                    ) : (
                      <input type="number" value={config[f.key as keyof typeof config] as string} onChange={e => setConfig(p => ({ ...p, [f.key]: e.target.value }))}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: 9, border: '1px solid #E5E7EB', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box' }} />
                    )}
                  </div>
                ))}
                {[
                  { label: 'Requerir verificación de email', key: 'requireEmailVerify' },
                  { label: 'Autenticación multifactor (MFA)', key: 'requireMFA' },
                ].map(f => (
                  <div key={f.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 10, border: '1px solid #E5E7EB', backgroundColor: '#F9FAFB' }}>
                    <span style={{ fontSize: '0.85rem', color: '#374151', fontWeight: '600' }}>{f.label}</span>
                    <button onClick={() => setConfig(p => ({ ...p, [f.key]: !p[f.key as keyof typeof config] }))}
                      style={{ width: 40, height: 22, borderRadius: 11, border: 'none', backgroundColor: config[f.key as keyof typeof config] ? ORANGE : '#D1D5DB', cursor: 'pointer', position: 'relative', transition: 'background 0.2s' }}>
                      <div style={{ width: 18, height: 18, borderRadius: '50%', backgroundColor: '#fff', position: 'absolute', top: 2, left: config[f.key as keyof typeof config] ? 20 : 2, transition: 'left 0.2s' }} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ backgroundColor: '#fff', borderRadius: 16, border: '1px solid #E5E7EB', padding: 24 }}>
              <h3 style={{ margin: '0 0 20px', color: '#1A1A2E', fontSize: '1rem' }}>JWT Secret</h3>
              <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                <code style={{ flex: 1, padding: '10px 14px', borderRadius: 10, backgroundColor: '#F3F4F6', border: '1px solid #E5E7EB', fontSize: '0.75rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {showJwtSecret ? jwtSecret : '•'.repeat(40)}
                </code>
                <button onClick={() => setShowJwtSecret(!showJwtSecret)} style={{ padding: '10px', borderRadius: 10, border: '1px solid #E5E7EB', backgroundColor: '#F9FAFB', cursor: 'pointer' }}>
                  {showJwtSecret ? <EyeOff size={15} color="#6B7280" /> : <Eye size={15} color="#6B7280" />}
                </button>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button style={{ flex: 1, padding: '9px', borderRadius: 9, border: '1px solid #E5E7EB', backgroundColor: '#F9FAFB', color: '#374151', fontWeight: '600', fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  <Copy size={13} /> Copiar
                </button>
                <button style={{ flex: 1, padding: '9px', borderRadius: 9, border: `1px solid ${ORANGE}30`, backgroundColor: `${ORANGE}08`, color: ORANGE, fontWeight: '700', fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  <RefreshCw size={13} /> Regenerar
                </button>
              </div>

              <div style={{ marginTop: 24, padding: 16, backgroundColor: '#D1FAE5', borderRadius: 12 }}>
                <div style={{ fontWeight: '700', color: '#065F46', fontSize: '0.85rem', marginBottom: 8 }}>Estado del sistema Auth</div>
                {[
                  'Supabase Auth ✅ Conectado',
                  'Email SMTP ✅ Configurado',
                  'OAuth Google ✅ Activo',
                  'RLS Policies ✅ Habilitadas',
                ].map((s, i) => (
                  <div key={i} style={{ fontSize: '0.78rem', color: '#065F46', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <CheckCircle size={12} /> {s}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'proveedores' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
            {proveedores.map(p => (
              <div key={p.id} style={{ backgroundColor: '#fff', borderRadius: 16, border: '1px solid #E5E7EB', padding: 22 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: '1.5rem' }}>{p.icono}</span>
                    <div>
                      <div style={{ fontWeight: '700', color: '#1A1A2E', fontSize: '0.92rem' }}>{p.nombre}</div>
                      <div style={{ fontSize: '0.7rem', color: '#9CA3AF', textTransform: 'capitalize' }}>{p.tipo}</div>
                    </div>
                  </div>
                  <button style={{ width: 44, height: 24, borderRadius: 12, border: 'none', backgroundColor: p.activo ? ORANGE : '#D1D5DB', cursor: 'pointer', position: 'relative', transition: 'background 0.2s' }}>
                    <div style={{ width: 20, height: 20, borderRadius: '50%', backgroundColor: '#fff', position: 'absolute', top: 2, left: p.activo ? 22 : 2, transition: 'left 0.2s' }} />
                  </button>
                </div>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#6B7280', lineHeight: 1.5 }}>{p.descripcion}</p>
                {p.activo && (
                  <div style={{ marginTop: 12, padding: '6px 10px', borderRadius: 8, backgroundColor: '#D1FAE5', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <CheckCircle size={12} color="#059669" />
                    <span style={{ fontSize: '0.72rem', color: '#059669', fontWeight: '700' }}>Activo y configurado</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {tab === 'roles' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 700 }}>
            {roles.map(r => (
              <div key={r.nombre} style={{ backgroundColor: '#fff', borderRadius: 14, border: '1px solid #E5E7EB', padding: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: `${r.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Shield size={20} color={r.color} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '800', color: '#1A1A2E', marginBottom: 3 }}>{r.nombre}</div>
                  <div style={{ fontSize: '0.8rem', color: '#6B7280' }}>{r.permisos}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: '700', color: r.color, fontSize: '1.2rem' }}>{r.usuarios}</div>
                  <div style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>usuarios</div>
                </div>
                <button style={{ padding: '8px 14px', borderRadius: 9, border: '1px solid #E5E7EB', backgroundColor: '#F9FAFB', color: '#374151', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' }}>
                  Editar permisos
                </button>
              </div>
            ))}
          </div>
        )}

        {tab === 'sesiones' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {sesiones.map(s => (
              <div key={s.id} style={{ backgroundColor: '#fff', borderRadius: 14, border: '1px solid #E5E7EB', padding: 20, display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 42, height: 42, borderRadius: '50%', backgroundColor: `${ORANGE}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', color: ORANGE, fontSize: '0.85rem', flexShrink: 0 }}>
                  {s.avatar}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '700', color: '#1A1A2E', marginBottom: 3 }}>{s.usuario}</div>
                  <div style={{ fontSize: '0.78rem', color: '#6B7280' }}>{s.dispositivo} · {s.ip}</div>
                  <div style={{ fontSize: '0.72rem', color: '#9CA3AF', marginTop: 2 }}>Inicio: {s.inicio}</div>
                </div>
                <span style={{ padding: '3px 10px', borderRadius: 8, backgroundColor: s.activa ? '#D1FAE5' : '#F3F4F6', color: s.activa ? '#059669' : '#6B7280', fontSize: '0.72rem', fontWeight: '700' }}>
                  {s.activa ? '● Activa' : 'Cerrada'}
                </span>
                <span style={{ padding: '3px 10px', borderRadius: 8, backgroundColor: `${ORANGE}10`, color: ORANGE, fontSize: '0.72rem', fontWeight: '700' }}>{s.rol}</span>
                {s.activa && (
                  <button style={{ padding: '7px 14px', borderRadius: 9, border: '1px solid #FCA5A5', backgroundColor: '#FEE2E2', color: '#DC2626', fontSize: '0.78rem', fontWeight: '700', cursor: 'pointer' }}>
                    Cerrar sesión
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {tab === 'logs' && (
          <div style={{ backgroundColor: '#1A1A2E', borderRadius: 16, padding: 24, fontFamily: 'monospace', maxWidth: 900 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <span style={{ color: '#A3E635', fontWeight: '700', fontSize: '0.85rem' }}>AUTH LOGS — 2026-02-24</span>
              <button style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid #374151', backgroundColor: 'transparent', color: '#9CA3AF', fontSize: '0.75rem', cursor: 'pointer' }}>
                Exportar logs
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {logsAuth.map((l, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, padding: '8px 12px', borderRadius: 8, backgroundColor: l.tipo === 'error' ? '#2D1B1B' : l.tipo === 'warning' ? '#2D2415' : l.tipo === 'success' ? '#1B2D1B' : '#1D1D2E' }}>
                  <span style={{ fontSize: '0.72rem', color: '#6B7280', flexShrink: 0 }}>{l.hora}</span>
                  <span style={{ fontSize: '0.75rem', color: l.tipo === 'error' ? '#F87171' : l.tipo === 'warning' ? '#FCD34D' : l.tipo === 'success' ? '#A3E635' : '#93C5FD' }}>
                    [{l.tipo.toUpperCase()}]
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#D1D5DB' }}>{l.msg}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

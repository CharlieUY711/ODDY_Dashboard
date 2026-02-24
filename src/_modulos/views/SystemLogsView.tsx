/* =====================================================
   SystemLogsView — Logs del Sistema
   Registro de actividad · Errores · Filtros · Export
   ===================================================== */
import React, { useState } from 'react';
import { OrangeHeader } from '@/app/components/admin/OrangeHeader';
import type { MainSection } from '@/app/AdminDashboard';
import { ScrollText, Search, Download, Filter, AlertTriangle, CheckCircle, Info, XCircle, RefreshCw } from 'lucide-react';

const ORANGE = '#FF6835';
interface Props { onNavigate: (s: MainSection) => void; }

type NivelLog = 'info' | 'warn' | 'error' | 'debug' | 'success';

const logsData: { id: number; nivel: NivelLog; modulo: string; mensaje: string; usuario: string; ip: string; timestamp: string; detalle?: string }[] = [
  { id: 1, nivel: 'success', modulo: 'Pedidos', mensaje: 'Pedido ORD-8841 confirmado y pagado', usuario: 'ana.garcia@email.com', ip: '186.18.xxx.xxx', timestamp: '2026-02-24 14:32:18' },
  { id: 2, nivel: 'info', modulo: 'Auth', mensaje: 'Login exitoso desde nuevo dispositivo', usuario: 'admin@oddy.uy', ip: '190.12.xxx.xxx', timestamp: '2026-02-24 14:28:45' },
  { id: 3, nivel: 'warn', modulo: 'OCA API', mensaje: 'Timeout en request de tracking (820ms)', usuario: 'sistema', ip: 'interno', timestamp: '2026-02-24 14:28:10', detalle: 'GET /tracking/OCA9823712 → 504' },
  { id: 4, nivel: 'error', modulo: 'Facturación', mensaje: 'Error al generar factura PDF — Módulo no configurado', usuario: 'sistema', ip: 'interno', timestamp: '2026-02-24 14:15:30', detalle: 'PrintService: renderer not initialized' },
  { id: 5, nivel: 'info', modulo: 'Inventario', mensaje: 'Stock actualizado: Zapatillas Running X200 = 12ud', usuario: 'carlos.diaz@oddy.uy', ip: '200.40.xxx.xxx', timestamp: '2026-02-24 14:10:22' },
  { id: 6, nivel: 'success', modulo: 'MercadoPago', mensaje: 'Webhook recibido: pago ORD-8841 aprobado', usuario: 'webhook', ip: '190.248.xxx.xxx', timestamp: '2026-02-24 13:55:12' },
  { id: 7, nivel: 'warn', modulo: 'Auth', mensaje: '3 intentos fallidos de login para usuario diego@test.com', usuario: 'sistema', ip: '181.92.xxx.xxx', timestamp: '2026-02-24 13:40:05' },
  { id: 8, nivel: 'info', modulo: 'Edge Functions', mensaje: 'make-server-75638143 ejecutada OK (45ms)', usuario: 'sistema', ip: 'interno', timestamp: '2026-02-24 13:35:00' },
  { id: 9, nivel: 'debug', modulo: 'Supabase DB', mensaje: 'Query SELECT * FROM pedidos → 142ms (lento)', usuario: 'sistema', ip: 'interno', timestamp: '2026-02-24 13:20:18', detalle: 'Consider adding index on status column' },
  { id: 10, nivel: 'success', modulo: 'Envíos', mensaje: 'Lote de 18 envíos OCA procesado correctamente', usuario: 'sistema', ip: 'interno', timestamp: '2026-02-24 13:00:00' },
];

const nivelesUI: { nivel: NivelLog; label: string; bg: string; color: string; icon: React.ElementType }[] = [
  { nivel: 'success', label: 'Success', bg: '#D1FAE5', color: '#059669', icon: CheckCircle },
  { nivel: 'info',    label: 'Info',    bg: '#DBEAFE', color: '#1D4ED8', icon: Info },
  { nivel: 'warn',    label: 'Warning', bg: '#FEF3C7', color: '#D97706', icon: AlertTriangle },
  { nivel: 'error',   label: 'Error',   bg: '#FEE2E2', color: '#DC2626', icon: XCircle },
  { nivel: 'debug',   label: 'Debug',   bg: '#F3F4F6', color: '#6B7280', icon: Info },
];

const modulos = ['Todos', 'Pedidos', 'Auth', 'Inventario', 'Facturación', 'Envíos', 'OCA API', 'MercadoPago', 'Supabase DB', 'Edge Functions'];

export function SystemLogsView({ onNavigate }: Props) {
  const [search, setSearch] = useState('');
  const [nivelFiltro, setNivelFiltro] = useState<string>('todos');
  const [moduloFiltro, setModuloFiltro] = useState('Todos');
  const [expandido, setExpandido] = useState<number | null>(null);

  const logs = logsData.filter(l => {
    const matchSearch = l.mensaje.toLowerCase().includes(search.toLowerCase()) || l.modulo.toLowerCase().includes(search.toLowerCase());
    const matchNivel = nivelFiltro === 'todos' || l.nivel === nivelFiltro;
    const matchModulo = moduloFiltro === 'Todos' || l.modulo === moduloFiltro;
    return matchSearch && matchNivel && matchModulo;
  });

  function getNivelUI(nivel: NivelLog) {
    return nivelesUI.find(n => n.nivel === nivel) ?? nivelesUI[1];
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', backgroundColor: '#F8F9FA' }}>
      <OrangeHeader
        icon={ScrollText}
        title="Logs del Sistema"
        subtitle="Registro de actividad · Errores · Filtros avanzados · Export CSV"
        actions={[
          { label: '← Volver', onClick: () => onNavigate('auditoria') },
          { label: '⬇️ Export CSV', primary: true },
        ]}
      />
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', padding: '20px 28px 24px' }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 10, marginBottom: 18, flexShrink: 0 }}>
          {nivelesUI.map(n => {
            const count = logsData.filter(l => l.nivel === n.nivel).length;
            const StatusIcon = n.icon;
            return (
              <button key={n.nivel} onClick={() => setNivelFiltro(nivelFiltro === n.nivel ? 'todos' : n.nivel)} style={{ backgroundColor: nivelFiltro === n.nivel ? n.bg : '#fff', borderRadius: '12px', border: `2px solid ${nivelFiltro === n.nivel ? n.color : '#E5E7EB'}`, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', textAlign: 'left' }}>
                <StatusIcon size={16} color={n.color} />
                <div>
                  <div style={{ fontWeight: '800', fontSize: '1.1rem', color: n.color }}>{count}</div>
                  <div style={{ fontSize: '0.7rem', color: '#9CA3AF' }}>{n.label}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Filtros */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 14, flexShrink: 0 }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={13} color="#9CA3AF" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar en logs..." style={{ width: '100%', paddingLeft: 30, paddingRight: 12, paddingTop: 8, paddingBottom: 8, border: '1px solid #E5E7EB', borderRadius: '9px', fontSize: '0.82rem', outline: 'none' }} />
          </div>
          <select value={moduloFiltro} onChange={e => setModuloFiltro(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #E5E7EB', borderRadius: '9px', fontSize: '0.82rem', outline: 'none' }}>
            {modulos.map(m => <option key={m}>{m}</option>)}
          </select>
        </div>

        {/* Logs */}
        <div style={{ flex: 1, overflow: 'auto', backgroundColor: '#1A1A2E', borderRadius: '14px', padding: '16px', fontFamily: 'monospace' }}>
          {logs.map(log => {
            const n = getNivelUI(log.nivel);
            const StatusIcon = n.icon;
            return (
              <div key={log.id} onClick={() => setExpandido(expandido === log.id ? null : log.id)} style={{ marginBottom: 6, cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <span style={{ fontSize: '0.72rem', color: '#6B7280', whiteSpace: 'nowrap', flexShrink: 0 }}>{log.timestamp}</span>
                  <span style={{ fontSize: '0.7rem', fontWeight: '700', padding: '1px 6px', borderRadius: '4px', backgroundColor: n.bg, color: n.color, whiteSpace: 'nowrap', flexShrink: 0 }}>{n.label.toUpperCase()}</span>
                  <span style={{ fontSize: '0.72rem', color: '#60A5FA', whiteSpace: 'nowrap', flexShrink: 0 }}>[{log.modulo}]</span>
                  <span style={{ fontSize: '0.82rem', color: '#E2E8F0', flex: 1 }}>{log.mensaje}</span>
                </div>
                {expandido === log.id && (
                  <div style={{ marginTop: 4, marginLeft: 200, padding: '8px 12px', backgroundColor: '#0F172A', borderRadius: '6px', borderLeft: `3px solid ${n.color}` }}>
                    {log.detalle && <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginBottom: 4 }}>💬 {log.detalle}</div>}
                    <div style={{ fontSize: '0.72rem', color: '#64748B' }}>👤 {log.usuario} · 🌐 {log.ip}</div>
                  </div>
                )}
              </div>
            );
          })}
          {logs.length === 0 && (
            <div style={{ color: '#6B7280', textAlign: 'center', padding: 40 }}>No se encontraron logs con ese criterio</div>
          )}
        </div>
      </div>
    </div>
  );
}

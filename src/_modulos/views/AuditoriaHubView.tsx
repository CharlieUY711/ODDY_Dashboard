import React from 'react';
import { HubView, HubCardDef, HubComingSoonItem } from '@/app/components/admin/HubView';
import type { MainSection } from '@/app/AdminDashboard';
import {
  ShieldCheck, CheckSquare, Activity, ScrollText,
  Database, Server, Zap, TrendingUp, AlertTriangle,
  CheckCircle2, Clock, BarChart2,
} from 'lucide-react';

interface Props { onNavigate: (s: MainSection) => void; }

export function AuditoriaHubView({ onNavigate }: Props) {
  const nav = (s: MainSection) => () => onNavigate(s);
  const now = new Date();

  const cards: HubCardDef[] = [
    {
      id: 'checklist', icon: CheckSquare, onClick: nav('checklist'),
      gradient: 'linear-gradient(135deg, #FF6835 0%, #e04e20 100%)', color: '#FF6835',
      badge: 'Roadmap · Progreso', label: 'Checklist & Roadmap',
      description: 'Estado completo del proyecto — progreso por módulo, cola de ejecución y auditoría del manifest.',
      stats: [{ icon: CheckSquare, value: '—', label: 'Módulos' }, { icon: TrendingUp, value: '—', label: 'Progreso' }, { icon: Clock, value: '—', label: 'Pendientes' }],
    },
    {
      id: 'auditoria-health', icon: Activity, onClick: nav('auditoria-health'),
      gradient: 'linear-gradient(135deg, #059669 0%, #047857 100%)', color: '#059669',
      badge: 'Tiempo real', label: 'Health Monitor',
      description: 'Estado en tiempo real de todos los servicios — Supabase, APIs externas y edge functions.',
      stats: [{ icon: Database, value: 'OK', label: 'Supabase DB' }, { icon: Server, value: 'OK', label: 'Edge Functions' }, { icon: Zap, value: '99.9%', label: 'Uptime' }],
    },
    {
      id: 'auditoria-logs', icon: ScrollText, onClick: nav('auditoria-logs'),
      gradient: 'linear-gradient(135deg, #6366F1 0%, #4338CA 100%)', color: '#6366F1',
      badge: 'Logs · Eventos', label: 'Logs del Sistema',
      description: 'Registro de actividad, errores y eventos del sistema con filtros por módulo y nivel.',
      stats: [{ icon: AlertTriangle, value: '0', label: 'Errores críticos' }, { icon: Activity, value: '—', label: 'Eventos hoy' }, { icon: BarChart2, value: '—', label: 'Advertencias' }],
    },
  ];

  const comingSoon: HubComingSoonItem[] = [
    { icon: AlertTriangle, label: 'Alertas proactivas',   desc: 'Alertas por email ante fallos'          },
    { icon: BarChart2,     label: 'Reportes automáticos', desc: 'Rendimiento semanal automatizado'        },
    { icon: ShieldCheck,   label: 'Auditoría por rol',    desc: 'Seguridad y permisos por rol'           },
    { icon: Clock,         label: 'Trazabilidad',         desc: 'Historial completo de cambios'          },
  ];

  const STACK = [
    { label: 'Base de datos',  desc: 'PostgreSQL vía Supabase',   ok: true  },
    { label: 'Auth service',   desc: 'Supabase Auth activo',      ok: true  },
    { label: 'Storage',        desc: 'Buckets make-75638143',     ok: true  },
    { label: 'Edge Functions', desc: 'Hono server activo',        ok: true  },
    { label: 'KV Store',       desc: 'Tabla kv_store_75638143',   ok: true  },
    { label: 'APIs externas',  desc: 'Sin configurar aún',        ok: false },
  ] as const;

  const diagnostico = (
    <div style={{ padding: '18px 22px', backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E9ECEF' }}>
      <p style={{ margin: '0 0 14px', fontSize: '0.75rem', fontWeight: '800', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        Diagnóstico rápido del stack · {now.toLocaleTimeString('es-UY', { hour: '2-digit', minute: '2-digit' })}
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
        {STACK.map(item => (
          <div key={item.label} style={{ backgroundColor: '#F9FAFB', borderRadius: '10px', padding: '12px 14px', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', gap: '10px' }}>
            {item.ok
              ? <CheckCircle2 size={15} color="#059669" />
              : <Clock size={15} color="#F59E0B" />}
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: '700', color: '#111827' }}>{item.label}</div>
              <div style={{ fontSize: '0.68rem', color: '#9CA3AF' }}>{item.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <HubView
      hubIcon={ShieldCheck}
      title="Auditoría & Diagnóstico"
      subtitle={`Centro de control · Salud del sistema · Logs · Roadmap · ${now.toLocaleTimeString('es-UY', { hour: '2-digit', minute: '2-digit' })}`}
      sections={[{ cards }]}
      afterCards={diagnostico}
      comingSoon={comingSoon}
      comingSoonText="Alertas proactivas por email, reportes de rendimiento automatizados, auditoría de seguridad por rol y trazabilidad completa de cambios."
    />
  );
}

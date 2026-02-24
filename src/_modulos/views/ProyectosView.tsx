/* =====================================================
   ProyectosView — Gestión de Proyectos con Kanban
   ===================================================== */
import React, { useState } from 'react';
import { OrangeHeader } from '@/app/components/admin/OrangeHeader';
import type { MainSection } from '@/app/AdminDashboard';
import {
  FolderKanban, CheckCircle, Clock, AlertCircle, Plus,
  Calendar, User, Flag, MoreHorizontal, TrendingUp,
} from 'lucide-react';

const ORANGE = '#FF6835';
interface Props { onNavigate: (s: MainSection) => void; }

interface Task {
  id: number;
  titulo: string;
  proyecto: string;
  prioridad: 'alta' | 'media' | 'baja';
  asignado: string;
  fecha: string;
  color: string;
  tags: string[];
}

const cols: { id: string; label: string; color: string; icon: typeof CheckCircle; tasks: Task[] }[] = [
  {
    id: 'pendiente', label: 'Por Hacer', color: '#6B7280', icon: Clock,
    tasks: [
      { id: 1, titulo: 'Diseñar flujo de onboarding', proyecto: 'App Mobile', prioridad: 'alta', asignado: 'AC', fecha: '2026-03-01', color: '#3B82F6', tags: ['UX', 'Design'] },
      { id: 2, titulo: 'Integrar pasarela MercadoPago', proyecto: 'eCommerce v2', prioridad: 'alta', asignado: 'JP', fecha: '2026-02-28', color: ORANGE, tags: ['Backend', 'Pago'] },
      { id: 3, titulo: 'Redactar política de privacidad', proyecto: 'Legal', prioridad: 'baja', asignado: 'MR', fecha: '2026-03-10', color: '#6B7280', tags: ['Legal'] },
    ],
  },
  {
    id: 'progreso', label: 'En Progreso', color: ORANGE, icon: TrendingUp,
    tasks: [
      { id: 4, titulo: 'Módulo de inventario ERP', proyecto: 'ERP Central', prioridad: 'alta', asignado: 'LD', fecha: '2026-02-25', color: '#F59E0B', tags: ['ERP', 'Stock'] },
      { id: 5, titulo: 'Dashboard Analytics RRSS', proyecto: 'Marketing Suite', prioridad: 'media', asignado: 'VT', fecha: '2026-02-27', color: '#EC4899', tags: ['Analytics'] },
      { id: 6, titulo: 'Optimizar queries Supabase', proyecto: 'Infra', prioridad: 'media', asignado: 'RF', fecha: '2026-02-26', color: '#10B981', tags: ['DB', 'Backend'] },
    ],
  },
  {
    id: 'revision', label: 'En Revisión', color: '#8B5CF6', icon: AlertCircle,
    tasks: [
      { id: 7, titulo: 'Landing page nuevo producto', proyecto: 'Marketing', prioridad: 'media', asignado: 'AG', fecha: '2026-02-24', color: '#8B5CF6', tags: ['Web', 'SEO'] },
      { id: 8, titulo: 'Testing flujo de checkout', proyecto: 'eCommerce v2', prioridad: 'alta', asignado: 'JP', fecha: '2026-02-24', color: ORANGE, tags: ['QA'] },
    ],
  },
  {
    id: 'completado', label: 'Completado', color: '#10B981', icon: CheckCircle,
    tasks: [
      { id: 9, titulo: 'Setup CI/CD pipeline', proyecto: 'Infra', prioridad: 'alta', asignado: 'RF', fecha: '2026-02-20', color: '#10B981', tags: ['DevOps'] },
      { id: 10, titulo: 'Implementar dark mode', proyecto: 'App Mobile', prioridad: 'baja', asignado: 'AC', fecha: '2026-02-18', color: '#3B82F6', tags: ['UX'] },
      { id: 11, titulo: 'Exportar informe Q1', proyecto: 'Management', prioridad: 'media', asignado: 'MR', fecha: '2026-02-15', color: '#6B7280', tags: ['Reporte'] },
    ],
  },
];

const prioColors: Record<string, { color: string; bg: string; label: string }> = {
  alta: { color: '#DC2626', bg: '#FEE2E2', label: '🔴 Alta' },
  media: { color: '#D97706', bg: '#FEF3C7', label: '🟡 Media' },
  baja: { color: '#059669', bg: '#D1FAE5', label: '🟢 Baja' },
};

function TaskCard({ task }: { task: Task }) {
  const prio = prioColors[task.prioridad];
  return (
    <div style={{
      backgroundColor: '#fff', borderRadius: '11px', border: '1px solid #E9ECEF',
      padding: '13px', marginBottom: '8px', cursor: 'pointer',
      borderLeft: `3px solid ${task.color}`,
      boxShadow: '0 1px 4px rgba(0,0,0,0.05)', transition: 'all 0.12s',
    }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-1px)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 1px 4px rgba(0,0,0,0.05)'; (e.currentTarget as HTMLDivElement).style.transform = ''; }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <p style={{ margin: 0, fontSize: '0.83rem', fontWeight: '700', color: '#1F2937', lineHeight: 1.35, flex: 1, marginRight: 6 }}>{task.titulo}</p>
        <button style={{ padding: '2px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', color: '#9CA3AF' }}>
          <MoreHorizontal size={14} />
        </button>
      </div>
      <p style={{ margin: '0 0 8px', fontSize: '0.7rem', color: '#9CA3AF' }}>📁 {task.proyecto}</p>
      <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: 8 }}>
        {task.tags.map(t => (
          <span key={t} style={{ fontSize: '0.65rem', color: task.color, backgroundColor: `${task.color}14`, padding: '1px 6px', borderRadius: '4px', fontWeight: '600' }}>{t}</span>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.65rem', fontWeight: '700', color: prio.color, backgroundColor: prio.bg, padding: '1px 6px', borderRadius: '4px' }}>{prio.label}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Calendar size={10} color="#9CA3AF" />
            <span style={{ fontSize: '0.65rem', color: '#9CA3AF' }}>{task.fecha.slice(5)}</span>
          </div>
          <div style={{ width: 22, height: 22, borderRadius: '50%', backgroundColor: `${task.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '0.55rem', fontWeight: '800', color: task.color }}>{task.asignado}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProyectosView({ onNavigate }: Props) {
  const [activeProj, setActiveProj] = useState('Todos');
  const proyectos = ['Todos', 'App Mobile', 'eCommerce v2', 'ERP Central', 'Infra', 'Marketing Suite', 'Legal'];
  const totalTasks = cols.flatMap(c => c.tasks).length;
  const completadas = cols.find(c => c.id === 'completado')?.tasks.length ?? 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', backgroundColor: '#F8F9FA' }}>
      <OrangeHeader
        icon={FolderKanban}
        title="Proyectos"
        subtitle="Tablero Kanban · Tareas y seguimiento de equipos"
        actions={[
          { label: '← Volver', onClick: () => onNavigate('gestion') },
          { label: '+ Nueva Tarea', primary: true },
        ]}
      />

      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

        {/* Stats + filtro de proyecto */}
        <div style={{ padding: '16px 24px', backgroundColor: '#fff', borderBottom: '1px solid #E9ECEF', display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
          {[
            { label: 'Total tareas', value: totalTasks, color: '#374151' },
            { label: 'Completadas', value: completadas, color: '#10B981' },
            { label: 'En progreso', value: cols.find(c => c.id === 'progreso')?.tasks.length ?? 0, color: ORANGE },
            { label: 'En revisión', value: cols.find(c => c.id === 'revision')?.tasks.length ?? 0, color: '#8B5CF6' },
          ].map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: '1.4rem', fontWeight: '800', color: s.color }}>{s.value}</span>
              <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>{s.label}</span>
              {i < 3 && <div style={{ width: 1, height: 20, backgroundColor: '#E5E7EB', marginLeft: 10 }} />}
            </div>
          ))}
          <div style={{ flex: 1 }} />
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {proyectos.map(p => (
              <button
                key={p}
                onClick={() => setActiveProj(p)}
                style={{
                  padding: '5px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '600',
                  border: activeProj === p ? 'none' : '1px solid #E5E7EB',
                  backgroundColor: activeProj === p ? ORANGE : '#F9FAFB',
                  color: activeProj === p ? '#fff' : '#6B7280', cursor: 'pointer',
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Kanban board */}
        <div style={{ flex: 1, overflowX: 'auto', overflowY: 'hidden', padding: '20px 24px' }}>
          <div style={{ display: 'flex', gap: '16px', height: '100%' }}>
            {cols.map(col => (
              <div key={col.id} style={{ minWidth: 240, flex: '0 0 240px', display: 'flex', flexDirection: 'column', height: '100%' }}>
                {/* Column header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <col.icon size={14} color={col.color} />
                    <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#374151' }}>{col.label}</span>
                    <span style={{ fontSize: '0.7rem', backgroundColor: `${col.color}18`, color: col.color, padding: '1px 6px', borderRadius: '5px', fontWeight: '700' }}>
                      {col.tasks.length}
                    </span>
                  </div>
                  <button style={{ border: 'none', backgroundColor: 'transparent', cursor: 'pointer', color: '#9CA3AF', padding: '2px' }}>
                    <Plus size={16} />
                  </button>
                </div>

                {/* Scrollable tasks */}
                <div style={{ flex: 1, overflowY: 'auto', backgroundColor: '#EDEFF2', borderRadius: '12px', padding: '10px' }}>
                  {col.tasks
                    .filter(t => activeProj === 'Todos' || t.proyecto === activeProj)
                    .map(task => (
                      <TaskCard key={task.id} task={task} />
                    ))}
                  <button style={{
                    width: '100%', padding: '7px', borderRadius: '8px',
                    border: '1.5px dashed #D1D5DB', backgroundColor: 'transparent',
                    color: '#9CA3AF', fontSize: '0.75rem', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                  }}>
                    <Plus size={12} /> Agregar tarea
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

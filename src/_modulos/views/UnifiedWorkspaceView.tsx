/* =====================================================
   UnifiedWorkspaceView — Workspace Unificado
   Editor de documentos · Kanban · Notas sticky · Calendario
   ===================================================== */
import React, { useState } from 'react';
import { OrangeHeader } from '@/app/components/admin/OrangeHeader';
import type { MainSection } from '@/app/AdminDashboard';
import { LayoutGrid, FileText, Columns, StickyNote, Calendar, Plus, Trash2, Edit2, Check } from 'lucide-react';

const ORANGE = '#FF6835';
interface Props { onNavigate: (s: MainSection) => void; }

type Tab = 'docs' | 'kanban' | 'notas' | 'calendario';

// DOCS
const docs = [
  { id: 1, titulo: 'Manual de Procesos Logísticos', emoji: '📦', fecha: '2026-02-24', palabras: 1240, estado: 'Borrador' },
  { id: 2, titulo: 'Política de Devoluciones', emoji: '🔄', fecha: '2026-02-20', palabras: 680, estado: 'Publicado' },
  { id: 3, titulo: 'Guía de Onboarding para Nuevos Vendedores', emoji: '🎯', fecha: '2026-02-18', palabras: 2100, estado: 'En revisión' },
  { id: 4, titulo: 'SOP: Cierre Diario de Caja POS', emoji: '💰', fecha: '2026-02-15', palabras: 420, estado: 'Publicado' },
];

// KANBAN
type KanbanCol = 'pendiente' | 'en_curso' | 'revision' | 'completado';
interface KanbanTask { id: number; titulo: string; prioridad: 'alta' | 'media' | 'baja'; asignado: string; col: KanbanCol; emoji: string; }

const kanbanInicial: KanbanTask[] = [
  { id: 1, titulo: 'Configurar integración con ML', prioridad: 'alta', asignado: 'Ana G.', col: 'en_curso', emoji: '🔗' },
  { id: 2, titulo: 'Diseñar landing page de sorteos', prioridad: 'media', asignado: 'Carlos R.', col: 'pendiente', emoji: '🎨' },
  { id: 3, titulo: 'Testing de módulo POS', prioridad: 'alta', asignado: 'María L.', col: 'revision', emoji: '🧪' },
  { id: 4, titulo: 'Importar catálogo CSV', prioridad: 'alta', asignado: 'Team', col: 'completado', emoji: '📊' },
  { id: 5, titulo: 'Documentar API de envíos', prioridad: 'baja', asignado: 'Roberto F.', col: 'pendiente', emoji: '📝' },
  { id: 6, titulo: 'Optimizar SEO del catálogo', prioridad: 'media', asignado: 'Ana G.', col: 'en_curso', emoji: '🔍' },
];

// NOTAS
interface Nota { id: number; texto: string; color: string; editando: boolean; }

const notasIniciales: Nota[] = [
  { id: 1, texto: '📌 Reunión con equipo tech el viernes 3PM', color: '#FEF3C7', editando: false },
  { id: 2, texto: '🚀 Lanzamiento nueva colección → 01/03/2026', color: '#D1FAE5', editando: false },
  { id: 3, texto: '⚠️ Revisar alertas de stock Producto X antes del jueves', color: '#FEE2E2', editando: false },
  { id: 4, texto: '💡 Idea: newsletter especial San Valentín tardío', color: '#DBEAFE', editando: false },
];

const COLORES_NOTAS = ['#FEF3C7', '#D1FAE5', '#DBEAFE', '#FCE7F3', '#EDE9FE', `${ORANGE}15`];

// CALENDARIO
const MESES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
const eventosCalendario = [
  { dia: 2, texto: 'Reunión equipo', color: ORANGE },
  { dia: 7, texto: 'Lanzamiento colección', color: '#10B981' },
  { dia: 14, texto: 'Sorteo San Valentín', color: '#EC4899' },
  { dia: 20, texto: 'Revisión P&L mensual', color: '#3B82F6' },
  { dia: 24, texto: 'HOY', color: '#1A1A2E' },
  { dia: 28, texto: 'Cierre mes', color: '#8B5CF6' },
];

const kanbanCols: { key: KanbanCol; label: string; color: string }[] = [
  { key: 'pendiente', label: '📋 Pendiente', color: '#6B7280' },
  { key: 'en_curso', label: '🔄 En curso', color: ORANGE },
  { key: 'revision', label: '🔍 En revisión', color: '#3B82F6' },
  { key: 'completado', label: '✅ Completado', color: '#10B981' },
];

export function UnifiedWorkspaceView({ onNavigate }: Props) {
  const [tab, setTab] = useState<Tab>('docs');
  const [tasks, setTasks] = useState<KanbanTask[]>(kanbanInicial);
  const [notas, setNotas] = useState<Nota[]>(notasIniciales);
  const [mesCal, setMesCal] = useState(1); // Febrero

  const moverTask = (id: number, col: KanbanCol) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, col } : t));
  };

  const addNota = () => {
    setNotas(prev => [...prev, { id: Date.now(), texto: 'Nueva nota...', color: COLORES_NOTAS[Math.floor(Math.random() * COLORES_NOTAS.length)], editando: true }]);
  };

  const updateNota = (id: number, texto: string) => setNotas(prev => prev.map(n => n.id === id ? { ...n, texto } : n));
  const deleteNota = (id: number) => setNotas(prev => prev.filter(n => n.id !== id));
  const toggleEdit = (id: number) => setNotas(prev => prev.map(n => n.id === id ? { ...n, editando: !n.editando } : n));

  const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'docs', label: 'Documentos', icon: FileText },
    { id: 'kanban', label: 'Kanban', icon: Columns },
    { id: 'notas', label: 'Notas', icon: StickyNote },
    { id: 'calendario', label: 'Calendario', icon: Calendar },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', backgroundColor: '#F8F9FA' }}>
      <OrangeHeader
        icon={LayoutGrid}
        title="Unified Workspace"
        subtitle="Editor de documentos · Tablero Kanban · Notas sticky · Calendario mensual"
        actions={[
          { label: '← Volver', onClick: () => onNavigate('herramientas') },
        ]}
      />

      {/* Tabs */}
      <div style={{ backgroundColor: '#fff', borderBottom: '1px solid #E9ECEF', padding: '0 32px', display: 'flex', flexShrink: 0 }}>
        {TABS.map(t => {
          const Icon = t.icon;
          return (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{ padding: '14px 20px', borderBottom: `3px solid ${tab === t.id ? ORANGE : 'transparent'}`, border: 'none', backgroundColor: 'transparent', color: tab === t.id ? ORANGE : '#6B7280', fontWeight: tab === t.id ? '700' : '500', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon size={15} /> {t.label}
            </button>
          );
        })}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px' }}>

        {/* DOCUMENTOS */}
        {tab === 'docs' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ margin: 0, color: '#1A1A2E' }}>Mis documentos ({docs.length})</h3>
              <button style={{ padding: '9px 18px', borderRadius: 10, border: 'none', backgroundColor: ORANGE, color: '#fff', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Plus size={14} /> Nuevo documento
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {docs.map(d => (
                <div key={d.id} style={{ backgroundColor: '#fff', borderRadius: 14, border: '1px solid #E5E7EB', padding: '18px 22px', display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer' }}>
                  <div style={{ fontSize: '1.8rem', flexShrink: 0 }}>{d.emoji}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '700', color: '#1A1A2E', marginBottom: 4 }}>{d.titulo}</div>
                    <div style={{ fontSize: '0.78rem', color: '#9CA3AF' }}>{d.palabras.toLocaleString()} palabras · Última edición {d.fecha}</div>
                  </div>
                  <span style={{ padding: '4px 12px', borderRadius: 8, backgroundColor: d.estado === 'Publicado' ? '#D1FAE5' : d.estado === 'Borrador' ? '#F3F4F6' : '#FEF3C7', color: d.estado === 'Publicado' ? '#059669' : d.estado === 'Borrador' ? '#6B7280' : '#D97706', fontSize: '0.75rem', fontWeight: '700' }}>
                    {d.estado}
                  </span>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button style={{ padding: '8px', borderRadius: 8, border: '1px solid #E5E7EB', backgroundColor: '#F9FAFB', cursor: 'pointer' }}><Edit2 size={13} color="#6B7280" /></button>
                    <button style={{ padding: '8px', borderRadius: 8, border: 'none', backgroundColor: '#FEE2E2', cursor: 'pointer' }}><Trash2 size={13} color="#DC2626" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* KANBAN */}
        {tab === 'kanban' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, minHeight: 400 }}>
            {kanbanCols.map(col => {
              const colTasks = tasks.filter(t => t.col === col.key);
              return (
                <div key={col.key} style={{ backgroundColor: '#fff', borderRadius: 14, border: '1px solid #E5E7EB', padding: 16 }}>
                  <div style={{ fontWeight: '700', color: '#1A1A2E', fontSize: '0.88rem', marginBottom: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{col.label}</span>
                    <span style={{ padding: '2px 8px', borderRadius: 6, backgroundColor: '#F3F4F6', color: '#6B7280', fontSize: '0.72rem' }}>{colTasks.length}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {colTasks.map(t => (
                      <div key={t.id} style={{ backgroundColor: '#F9FAFB', borderRadius: 12, padding: 14, border: '1px solid #F3F4F6' }}>
                        <div style={{ fontSize: '1.1rem', marginBottom: 6 }}>{t.emoji}</div>
                        <p style={{ margin: '0 0 8px', fontWeight: '600', fontSize: '0.82rem', color: '#1A1A2E' }}>{t.titulo}</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ padding: '2px 8px', borderRadius: 6, backgroundColor: t.prioridad === 'alta' ? '#FEE2E2' : t.prioridad === 'media' ? '#FEF3C7' : '#D1FAE5', color: t.prioridad === 'alta' ? '#DC2626' : t.prioridad === 'media' ? '#D97706' : '#059669', fontSize: '0.68rem', fontWeight: '700' }}>
                            {t.prioridad}
                          </span>
                          <span style={{ fontSize: '0.68rem', color: '#9CA3AF' }}>{t.asignado}</span>
                        </div>
                        <select value={t.col} onChange={e => moverTask(t.id, e.target.value as KanbanCol)}
                          style={{ marginTop: 10, width: '100%', padding: '5px 8px', borderRadius: 7, border: '1px solid #E5E7EB', fontSize: '0.72rem', outline: 'none', backgroundColor: '#fff', cursor: 'pointer' }}>
                          {kanbanCols.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* NOTAS */}
        {tab === 'notas' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ margin: 0, color: '#1A1A2E' }}>Notas rápidas ({notas.length})</h3>
              <button onClick={addNota} style={{ padding: '9px 18px', borderRadius: 10, border: 'none', backgroundColor: ORANGE, color: '#fff', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Plus size={14} /> Nueva nota
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
              {notas.map(n => (
                <div key={n.id} style={{ backgroundColor: n.color, borderRadius: 16, padding: 18, position: 'relative', minHeight: 140 }}>
                  <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', gap: 4 }}>
                    <button onClick={() => toggleEdit(n.id)} style={{ width: 24, height: 24, borderRadius: '50%', border: 'none', backgroundColor: 'rgba(255,255,255,0.6)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {n.editando ? <Check size={12} color="#059669" /> : <Edit2 size={12} color="#6B7280" />}
                    </button>
                    <button onClick={() => deleteNota(n.id)} style={{ width: 24, height: 24, borderRadius: '50%', border: 'none', backgroundColor: 'rgba(255,255,255,0.6)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Trash2 size={12} color="#EF4444" />
                    </button>
                  </div>
                  {n.editando ? (
                    <textarea value={n.texto} onChange={e => updateNota(n.id, e.target.value)} autoFocus
                      style={{ width: '100%', minHeight: 80, padding: 8, border: '1px dashed rgba(0,0,0,0.15)', borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.5)', fontFamily: 'inherit', fontSize: '0.88rem', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
                  ) : (
                    <p style={{ margin: 0, fontSize: '0.88rem', color: '#1A1A2E', lineHeight: 1.6, whiteSpace: 'pre-wrap', paddingRight: 40 }}>{n.texto}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CALENDARIO */}
        {tab === 'calendario' && (
          <div style={{ maxWidth: 700, backgroundColor: '#fff', borderRadius: 16, border: '1px solid #E5E7EB', padding: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <button onClick={() => setMesCal(m => (m - 1 + 12) % 12)} style={{ padding: '8px 14px', borderRadius: 9, border: '1px solid #E5E7EB', backgroundColor: '#F9FAFB', cursor: 'pointer', fontWeight: '600', color: '#374151' }}>
                ‹
              </button>
              <h2 style={{ margin: 0, color: '#1A1A2E', fontSize: '1.2rem' }}>{MESES[mesCal]} 2026</h2>
              <button onClick={() => setMesCal(m => (m + 1) % 12)} style={{ padding: '8px 14px', borderRadius: 9, border: '1px solid #E5E7EB', backgroundColor: '#F9FAFB', cursor: 'pointer', fontWeight: '600', color: '#374151' }}>
                ›
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 8 }}>
              {['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'].map(d => (
                <div key={d} style={{ textAlign: 'center', fontSize: '0.72rem', fontWeight: '700', color: '#9CA3AF', padding: '6px 0' }}>{d}</div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
              {/* Días vacíos al inicio */}
              {Array.from({ length: 0 }).map((_, i) => <div key={`empty-${i}`} />)}
              {Array.from({ length: 28 }).map((_, i) => {
                const dia = i + 1;
                const evento = eventosCalendario.find(e => e.dia === dia);
                const esHoy = dia === 24 && mesCal === 1;
                return (
                  <div key={dia} style={{ borderRadius: 10, padding: '8px 4px', textAlign: 'center', backgroundColor: esHoy ? '#1A1A2E' : evento ? `${evento.color}10` : '#F9FAFB', border: esHoy ? 'none' : evento ? `1px solid ${evento.color}30` : '1px solid #F3F4F6', cursor: 'pointer' }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: esHoy ? '900' : '600', color: esHoy ? '#fff' : '#1A1A2E' }}>{dia}</div>
                    {evento && <div style={{ fontSize: '0.6rem', color: esHoy ? '#fff' : evento.color, fontWeight: '700', marginTop: 2, lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{evento.texto}</div>}
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: 20, borderTop: '1px solid #F3F4F6', paddingTop: 16 }}>
              <h4 style={{ margin: '0 0 12px', color: '#1A1A2E', fontSize: '0.88rem' }}>Próximos eventos</h4>
              {eventosCalendario.filter(e => e.dia >= 24).map(e => (
                <div key={e.dia} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: `${e.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '0.78rem', color: e.color, flexShrink: 0 }}>{e.dia}</div>
                  <span style={{ fontSize: '0.82rem', color: '#374151' }}>{e.texto}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* =====================================================
   IdeasBoardView — Canvas visual para brainstorming
   Sticky notes · Categorías · Votos · Kanban de ideas
   ===================================================== */
import React, { useState } from 'react';
import { OrangeHeader } from '@/app/components/admin/OrangeHeader';
import type { MainSection } from '@/app/AdminDashboard';
import { Lightbulb, Plus, ThumbsUp, MessageCircle, Tag, Trash2, Edit2, Search, Filter } from 'lucide-react';

const ORANGE = '#FF6835';
interface Props { onNavigate: (s: MainSection) => void; }

interface Idea {
  id: number; titulo: string; descripcion: string; categoria: string;
  prioridad: 'alta' | 'media' | 'baja'; estado: 'nueva' | 'en_revision' | 'aprobada' | 'descartada';
  votos: number; comentarios: number; autor: string; fecha: string; color: string; votado: boolean;
}

const COLORES = [
  { bg: '#FEF3C7', border: '#FDE68A', label: 'Amarillo' },
  { bg: '#DBEAFE', border: '#BFDBFE', label: 'Azul' },
  { bg: '#D1FAE5', border: '#A7F3D0', label: 'Verde' },
  { bg: '#FCE7F3', border: '#F9A8D4', label: 'Rosa' },
  { bg: `${ORANGE}15`, border: `${ORANGE}40`, label: 'Naranja' },
  { bg: '#EDE9FE', border: '#DDD6FE', label: 'Violeta' },
];

const ideasIniciales: Idea[] = [
  { id: 1, titulo: 'Integración con Mercado Libre', descripcion: 'Sincronización bidireccional de stock y pedidos con ML Uruguay/Argentina.', categoria: 'Integraciones', prioridad: 'alta', estado: 'aprobada', votos: 18, comentarios: 5, autor: 'Equipo Tech', fecha: '2026-02-20', color: '#DBEAFE', votado: false },
  { id: 2, titulo: 'App móvil para repartidores', descripcion: 'App React Native para tracking GPS en tiempo real y confirmación de entrega con foto.', categoria: 'Logística', prioridad: 'alta', estado: 'en_revision', votos: 12, comentarios: 8, autor: 'Equipo Logística', fecha: '2026-02-18', color: '#D1FAE5', votado: false },
  { id: 3, titulo: 'Chatbot IA para soporte', descripcion: 'Bot de WhatsApp con GPT-4 para responder preguntas frecuentes de clientes 24/7.', categoria: 'Marketing', prioridad: 'media', estado: 'nueva', votos: 9, comentarios: 3, autor: 'Ana G.', fecha: '2026-02-22', color: '#FEF3C7', votado: false },
  { id: 4, titulo: 'Panel de métricas en tiempo real', descripcion: 'WebSocket dashboard con ventas, pedidos y alertas en vivo.', categoria: 'Dashboard', prioridad: 'alta', estado: 'aprobada', votos: 22, comentarios: 11, autor: 'CTO', fecha: '2026-02-15', color: `${ORANGE}15`, votado: false },
  { id: 5, titulo: 'Programa de afiliados', descripcion: 'Sistema de comisiones y referidos para creadores de contenido.', categoria: 'Marketing', prioridad: 'baja', estado: 'nueva', votos: 6, comentarios: 2, autor: 'Carlos R.', fecha: '2026-02-23', color: '#FCE7F3', votado: false },
  { id: 6, titulo: 'Multi-moneda en checkout', descripcion: 'Soporte para USD, ARS, BRL y UYU con conversión automática en tiempo real.', categoria: 'eCommerce', prioridad: 'media', estado: 'en_revision', votos: 15, comentarios: 7, autor: 'Equipo Producto', fecha: '2026-02-17', color: '#EDE9FE', votado: false },
];

const categorias = ['Todas', 'Integraciones', 'Logística', 'Marketing', 'Dashboard', 'eCommerce'];
const estados = { nueva: { bg: '#F3F4F6', color: '#6B7280' }, en_revision: { bg: '#FEF3C7', color: '#D97706' }, aprobada: { bg: '#D1FAE5', color: '#059669' }, descartada: { bg: '#FEE2E2', color: '#DC2626' } };
const prioridades = { alta: { label: '🔴 Alta', color: '#EF4444' }, media: { label: '🟡 Media', color: '#D97706' }, baja: { label: '🟢 Baja', color: '#10B981' } };

export function IdeasBoardView({ onNavigate }: Props) {
  const [ideas, setIdeas] = useState<Idea[]>(ideasIniciales);
  const [filtrocat, setFiltroCat] = useState('Todas');
  const [filtroest, setFiltroEst] = useState('todos');
  const [search, setSearch] = useState('');
  const [vista, setVista] = useState<'cards' | 'kanban'>('cards');
  const [showModal, setShowModal] = useState(false);
  const [nueva, setNueva] = useState({ titulo: '', descripcion: '', categoria: 'eCommerce', prioridad: 'media' as 'alta' | 'media' | 'baja', color: '#DBEAFE' });

  const votar = (id: number) => {
    setIdeas(prev => prev.map(i => i.id === id ? { ...i, votos: i.votado ? i.votos - 1 : i.votos + 1, votado: !i.votado } : i));
  };

  const agregar = () => {
    if (!nueva.titulo.trim()) return;
    const idea: Idea = {
      id: Date.now(), ...nueva, estado: 'nueva', votos: 0, comentarios: 0,
      autor: 'Yo', fecha: new Date().toISOString().slice(0, 10), votado: false,
    };
    setIdeas(prev => [idea, ...prev]);
    setNueva({ titulo: '', descripcion: '', categoria: 'eCommerce', prioridad: 'media', color: '#DBEAFE' });
    setShowModal(false);
  };

  const eliminar = (id: number) => setIdeas(prev => prev.filter(i => i.id !== id));

  const filtradas = ideas.filter(i =>
    (filtrocat === 'Todas' || i.categoria === filtrocat) &&
    (filtroest === 'todos' || i.estado === filtroest) &&
    (!search || i.titulo.toLowerCase().includes(search.toLowerCase()))
  );

  const kanbanCols: { key: Idea['estado']; label: string }[] = [
    { key: 'nueva', label: '💡 Nuevas' }, { key: 'en_revision', label: '🔍 En revisión' },
    { key: 'aprobada', label: '✅ Aprobadas' }, { key: 'descartada', label: '❌ Descartadas' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', backgroundColor: '#F8F9FA' }}>
      <OrangeHeader
        icon={Lightbulb}
        title="Ideas Board"
        subtitle="Canvas visual para brainstorming · Votos · Kanban · Categorías"
        actions={[
          { label: '← Volver', onClick: () => onNavigate('herramientas') },
          { label: '+ Nueva idea', onClick: () => setShowModal(true), primary: true },
        ]}
      />

      {/* Filtros */}
      <div style={{ backgroundColor: '#fff', borderBottom: '1px solid #E9ECEF', padding: '14px 32px', display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', flexShrink: 0 }}>
        <div style={{ position: 'relative' }}>
          <Search size={14} color="#9CA3AF" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar ideas..."
            style={{ paddingLeft: 32, paddingRight: 12, paddingTop: 8, paddingBottom: 8, border: '1px solid #E5E7EB', borderRadius: 9, fontSize: '0.82rem', outline: 'none', width: 180 }} />
        </div>

        <div style={{ display: 'flex', gap: 6 }}>
          {categorias.map(c => (
            <button key={c} onClick={() => setFiltroCat(c)}
              style={{ padding: '6px 12px', borderRadius: 8, border: `2px solid ${filtrocat === c ? ORANGE : '#E5E7EB'}`, backgroundColor: filtrocat === c ? `${ORANGE}10` : 'transparent', color: filtrocat === c ? ORANGE : '#6B7280', fontWeight: filtrocat === c ? '700' : '500', fontSize: '0.78rem', cursor: 'pointer' }}>
              {c}
            </button>
          ))}
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          {['cards', 'kanban'].map(v => (
            <button key={v} onClick={() => setVista(v as 'cards' | 'kanban')}
              style={{ padding: '6px 14px', borderRadius: 8, border: `2px solid ${vista === v ? ORANGE : '#E5E7EB'}`, backgroundColor: vista === v ? ORANGE : '#fff', color: vista === v ? '#fff' : '#6B7280', fontWeight: '700', fontSize: '0.78rem', cursor: 'pointer' }}>
              {v === 'cards' ? '⊞ Cards' : '⊟ Kanban'}
            </button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px' }}>

        {vista === 'cards' ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
            {filtradas.map(idea => (
              <div key={idea.id} style={{ backgroundColor: idea.color, borderRadius: 16, border: `1px solid ${idea.color === '#DBEAFE' ? '#BFDBFE' : '#E5E7EB'}`, padding: 20, position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <span style={{ padding: '3px 10px', borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.7)', color: '#374151', fontSize: '0.72rem', fontWeight: '700' }}>{idea.categoria}</span>
                  <button onClick={() => eliminar(idea.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: 0.4 }}>
                    <Trash2 size={13} color="#EF4444" />
                  </button>
                </div>
                <h3 style={{ margin: '0 0 8px', color: '#1A1A2E', fontSize: '0.95rem', fontWeight: '800' }}>{idea.titulo}</h3>
                <p style={{ margin: '0 0 14px', color: '#374151', fontSize: '0.82rem', lineHeight: 1.5 }}>{idea.descripcion}</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button onClick={() => votar(idea.id)}
                      style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 10px', borderRadius: 8, border: 'none', backgroundColor: idea.votado ? '#1A1A2E' : 'rgba(255,255,255,0.7)', color: idea.votado ? '#fff' : '#374151', fontSize: '0.78rem', fontWeight: '700', cursor: 'pointer' }}>
                      <ThumbsUp size={12} /> {idea.votos}
                    </button>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.78rem', color: '#6B7280' }}>
                      <MessageCircle size={12} /> {idea.comentarios}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.7rem', color: '#9CA3AF' }}>{idea.autor} · {idea.fecha}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, minHeight: 400 }}>
            {kanbanCols.map(col => {
              const col_ideas = filtradas.filter(i => i.estado === col.key);
              return (
                <div key={col.key} style={{ backgroundColor: '#fff', borderRadius: 14, border: '1px solid #E5E7EB', padding: 16 }}>
                  <div style={{ fontWeight: '800', color: '#1A1A2E', fontSize: '0.88rem', marginBottom: 14 }}>
                    {col.label} <span style={{ fontSize: '0.75rem', color: '#9CA3AF', fontWeight: '500' }}>({col_ideas.length})</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {col_ideas.map(idea => (
                      <div key={idea.id} style={{ backgroundColor: idea.color, borderRadius: 12, padding: 14 }}>
                        <p style={{ margin: '0 0 6px', fontWeight: '700', fontSize: '0.82rem', color: '#1A1A2E' }}>{idea.titulo}</p>
                        <p style={{ margin: '0 0 10px', fontSize: '0.75rem', color: '#6B7280' }}>{idea.descripcion.slice(0, 80)}...</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.7rem', color: '#6B7280' }}>{idea.categoria}</span>
                          <button onClick={() => votar(idea.id)} style={{ display: 'flex', alignItems: 'center', gap: 3, padding: '3px 8px', borderRadius: 6, border: 'none', backgroundColor: idea.votado ? '#1A1A2E' : 'rgba(255,255,255,0.7)', color: idea.votado ? '#fff' : '#374151', fontSize: '0.72rem', fontWeight: '700', cursor: 'pointer' }}>
                            <ThumbsUp size={10} /> {idea.votos}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal nueva idea */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#fff', borderRadius: 20, padding: 32, width: 480, maxWidth: '90vw', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <h2 style={{ margin: '0 0 24px', color: '#1A1A2E', fontSize: '1.2rem' }}>💡 Nueva Idea</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: '700', color: '#374151', display: 'block', marginBottom: 6 }}>Título *</label>
                <input value={nueva.titulo} onChange={e => setNueva(p => ({ ...p, titulo: e.target.value }))} placeholder="Nombre de la idea..."
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #E5E7EB', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: '700', color: '#374151', display: 'block', marginBottom: 6 }}>Descripción</label>
                <textarea value={nueva.descripcion} onChange={e => setNueva(p => ({ ...p, descripcion: e.target.value }))} rows={3} placeholder="¿Qué problema resuelve?"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #E5E7EB', fontSize: '0.88rem', outline: 'none', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: '700', color: '#374151', display: 'block', marginBottom: 6 }}>Categoría</label>
                  <select value={nueva.categoria} onChange={e => setNueva(p => ({ ...p, categoria: e.target.value }))}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #E5E7EB', fontSize: '0.88rem', outline: 'none', backgroundColor: '#fff' }}>
                    {categorias.slice(1).map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: '700', color: '#374151', display: 'block', marginBottom: 6 }}>Prioridad</label>
                  <select value={nueva.prioridad} onChange={e => setNueva(p => ({ ...p, prioridad: e.target.value as 'alta' | 'media' | 'baja' }))}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #E5E7EB', fontSize: '0.88rem', outline: 'none', backgroundColor: '#fff' }}>
                    <option value="alta">Alta</option><option value="media">Media</option><option value="baja">Baja</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: '700', color: '#374151', display: 'block', marginBottom: 8 }}>Color del sticker</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {COLORES.map(c => (
                    <button key={c.label} onClick={() => setNueva(p => ({ ...p, color: c.bg }))}
                      style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: c.bg, border: `2px solid ${nueva.color === c.bg ? '#1A1A2E' : c.border}`, cursor: 'pointer' }} />
                  ))}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: '11px', borderRadius: 10, border: '1px solid #E5E7EB', backgroundColor: '#F9FAFB', color: '#6B7280', fontWeight: '600', cursor: 'pointer' }}>
                Cancelar
              </button>
              <button onClick={agregar} style={{ flex: 2, padding: '11px', borderRadius: 10, border: 'none', backgroundColor: ORANGE, color: '#fff', fontWeight: '700', cursor: 'pointer' }}>
                ✨ Agregar Idea
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

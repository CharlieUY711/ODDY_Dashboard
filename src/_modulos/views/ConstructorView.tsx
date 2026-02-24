/* =====================================================
   ConstructorView — Constructor Visual de Módulos
   Drag & Drop · Preview · Templates · Export
   ===================================================== */
import React, { useState } from 'react';
import { OrangeHeader } from '@/app/components/admin/OrangeHeader';
import type { MainSection } from '@/app/AdminDashboard';
import { Blocks, Plus, Trash2, Eye, Download, Layout, Type, Image, BarChart2, Table, FormInput } from 'lucide-react';

const ORANGE = '#FF6835';
interface Props { onNavigate: (s: MainSection) => void; }

type ComponentType = 'header' | 'kpi' | 'chart' | 'table' | 'form' | 'text' | 'image' | 'button';

interface CanvasItem {
  id: number; type: ComponentType; label: string; w: number; h: number; x: number; y: number; color: string;
}

const COMPONENT_LIBRARY: { type: ComponentType; label: string; icon: React.ElementType; color: string }[] = [
  { type: 'header',  label: 'Header',     icon: Layout,    color: '#1A1A2E' },
  { type: 'kpi',     label: 'KPI Card',   icon: BarChart2, color: ORANGE    },
  { type: 'chart',   label: 'Gráfico',    icon: BarChart2, color: '#3B82F6' },
  { type: 'table',   label: 'Tabla',      icon: Table,     color: '#10B981' },
  { type: 'form',    label: 'Formulario', icon: FormInput, color: '#8B5CF6' },
  { type: 'text',    label: 'Texto',      icon: Type,      color: '#6B7280' },
  { type: 'image',   label: 'Imagen',     icon: Image,     color: '#EC4899' },
  { type: 'button',  label: 'Botón',      icon: Plus,      color: '#D97706' },
];

const TEMPLATES = [
  { nombre: 'Dashboard KPIs', desc: 'Header + 4 KPIs + 2 charts', items: 7 },
  { nombre: 'Formulario de Alta', desc: 'Header + Form + Botones', items: 4 },
  { nombre: 'Lista de Datos', desc: 'Header + Filtros + Tabla', items: 5 },
  { nombre: 'Landing Page', desc: 'Hero + Features + CTA', items: 6 },
];

function renderPreview(type: ComponentType, color: string) {
  switch (type) {
    case 'header': return (
      <div style={{ backgroundColor: color, borderRadius: 6, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 24, height: 24, borderRadius: 6, backgroundColor: 'rgba(255,255,255,0.3)' }} />
        <div style={{ flex: 1 }}>
          <div style={{ height: 8, backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: 3, width: '50%', marginBottom: 4 }} />
          <div style={{ height: 5, backgroundColor: 'rgba(255,255,255,0.4)', borderRadius: 3, width: '70%' }} />
        </div>
      </div>
    );
    case 'kpi': return (
      <div style={{ backgroundColor: '#fff', border: `2px solid ${color}20`, borderRadius: 10, padding: 12 }}>
        <div style={{ fontSize: '0.6rem', color: '#9CA3AF', marginBottom: 4 }}>Métrica</div>
        <div style={{ fontSize: '1.1rem', fontWeight: '900', color: color }}>$48K</div>
        <div style={{ fontSize: '0.55rem', color: '#10B981', marginTop: 3 }}>+12% ↑</div>
      </div>
    );
    case 'chart': return (
      <div style={{ backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: 10, padding: 10 }}>
        <div style={{ height: 5, backgroundColor: '#F3F4F6', borderRadius: 3, width: '40%', marginBottom: 8 }} />
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 40 }}>
          {[60,80,50,90,70,85,65].map((h, i) => (
            <div key={i} style={{ flex: 1, height: `${h}%`, backgroundColor: color, borderRadius: '2px 2px 0 0', opacity: 0.8 }} />
          ))}
        </div>
      </div>
    );
    case 'table': return (
      <div style={{ backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: 10, overflow: 'hidden' }}>
        <div style={{ padding: '6px 10px', backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB', display: 'flex', gap: 6 }}>
          {['Col A','Col B','Col C'].map(c => <div key={c} style={{ flex: 1, height: 5, backgroundColor: '#E5E7EB', borderRadius: 3 }} />)}
        </div>
        {[0,1,2].map(r => (
          <div key={r} style={{ padding: '5px 10px', borderBottom: '1px solid #F9FAFB', display: 'flex', gap: 6 }}>
            {[0,1,2].map(c => <div key={c} style={{ flex: 1, height: 4, backgroundColor: '#F3F4F6', borderRadius: 2 }} />)}
          </div>
        ))}
      </div>
    );
    case 'form': return (
      <div style={{ backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: 10, padding: 10 }}>
        {['Campo 1','Campo 2'].map(f => (
          <div key={f} style={{ marginBottom: 6 }}>
            <div style={{ height: 4, backgroundColor: '#E5E7EB', borderRadius: 2, width: '40%', marginBottom: 4 }} />
            <div style={{ height: 16, backgroundColor: '#F9FAFB', borderRadius: 4, border: '1px solid #E5E7EB' }} />
          </div>
        ))}
        <div style={{ height: 16, backgroundColor: color, borderRadius: 6, marginTop: 6, opacity: 0.8 }} />
      </div>
    );
    default: return (
      <div style={{ backgroundColor: `${color}15`, border: `1px dashed ${color}40`, borderRadius: 10, padding: 16, textAlign: 'center' }}>
        <div style={{ fontSize: '0.7rem', color: color, fontWeight: '700' }}>{type.toUpperCase()}</div>
      </div>
    );
  }
}

export function ConstructorView({ onNavigate }: Props) {
  const [canvas, setCanvas] = useState<CanvasItem[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [preview, setPreview] = useState(false);
  const [pageName, setPageName] = useState('Mi Dashboard');

  const agregar = (type: ComponentType, color: string, label: string) => {
    const item: CanvasItem = { id: Date.now(), type, label, w: 2, h: 1, x: 0, y: canvas.length, color };
    setCanvas(prev => [...prev, item]);
    setSelected(item.id);
  };

  const eliminar = (id: number) => { setCanvas(prev => prev.filter(c => c.id !== id)); setSelected(null); };

  const usarTemplate = (t: typeof TEMPLATES[0]) => {
    const items: CanvasItem[] = [
      { id: 1, type: 'header', label: 'Header', w: 4, h: 1, x: 0, y: 0, color: '#1A1A2E' },
      { id: 2, type: 'kpi', label: 'KPI 1', w: 1, h: 1, x: 0, y: 1, color: ORANGE },
      { id: 3, type: 'kpi', label: 'KPI 2', w: 1, h: 1, x: 1, y: 1, color: '#3B82F6' },
      { id: 4, type: 'kpi', label: 'KPI 3', w: 1, h: 1, x: 2, y: 1, color: '#10B981' },
      { id: 5, type: 'kpi', label: 'KPI 4', w: 1, h: 1, x: 3, y: 1, color: '#8B5CF6' },
      { id: 6, type: 'chart', label: 'Gráfico Ventas', w: 2, h: 2, x: 0, y: 2, color: ORANGE },
      { id: 7, type: 'table', label: 'Tabla de datos', w: 2, h: 2, x: 2, y: 2, color: '#3B82F6' },
    ].slice(0, t.items);
    setCanvas(items);
    setPageName(t.nombre);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', backgroundColor: '#F8F9FA' }}>
      <OrangeHeader
        icon={Blocks}
        title="Constructor Visual"
        subtitle="Drag & Drop · 8 componentes · Templates · Preview en tiempo real"
        actions={[
          { label: '← Volver', onClick: () => onNavigate('dashboard') },
          { label: preview ? '✎ Editar' : '👁 Preview', onClick: () => setPreview(!preview) },
          { label: '⬇ Exportar', primary: false },
        ]}
      />

      <div style={{ flex: 1, overflow: 'hidden', display: 'grid', gridTemplateColumns: preview ? '1fr' : '240px 1fr 220px', gap: 0 }}>

        {/* Panel izquierdo — Componentes */}
        {!preview && (
          <div style={{ backgroundColor: '#fff', borderRight: '1px solid #E9ECEF', overflowY: 'auto', padding: 20 }}>
            <p style={{ fontWeight: '700', color: '#9CA3AF', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 12px' }}>Componentes</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 24 }}>
              {COMPONENT_LIBRARY.map(comp => {
                const Icon = comp.icon;
                return (
                  <button key={comp.type} onClick={() => agregar(comp.type, comp.color, comp.label)}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 10, border: '1px solid #E5E7EB', backgroundColor: '#F9FAFB', color: '#374151', fontSize: '0.82rem', fontWeight: '600', cursor: 'pointer', textAlign: 'left' }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: `${comp.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={14} color={comp.color} />
                    </div>
                    {comp.label}
                  </button>
                );
              })}
            </div>

            <p style={{ fontWeight: '700', color: '#9CA3AF', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 12px' }}>Templates</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {TEMPLATES.map(t => (
                <button key={t.nombre} onClick={() => usarTemplate(t)}
                  style={{ padding: '12px 14px', borderRadius: 10, border: `1px solid ${ORANGE}30`, backgroundColor: `${ORANGE}05`, color: '#374151', fontSize: '0.8rem', cursor: 'pointer', textAlign: 'left' }}>
                  <div style={{ fontWeight: '700', marginBottom: 2 }}>{t.nombre}</div>
                  <div style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>{t.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Canvas central */}
        <div style={{ overflowY: 'auto', backgroundColor: '#E5E7EB', padding: 24 }}>
          <div style={{ backgroundColor: '#fff', borderRadius: 12, minHeight: '100%', padding: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            {/* Nombre de la página */}
            {!preview && (
              <input value={pageName} onChange={e => setPageName(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px dashed #E5E7EB', fontSize: '1.1rem', fontWeight: '800', color: '#1A1A2E', outline: 'none', marginBottom: 20, boxSizing: 'border-box', backgroundColor: 'transparent' }} />
            )}
            {preview && <h1 style={{ margin: '0 0 20px', color: '#1A1A2E' }}>{pageName}</h1>}

            {canvas.length === 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 300, color: '#9CA3AF', textAlign: 'center', border: '2px dashed #E5E7EB', borderRadius: 12 }}>
                <Blocks size={48} style={{ marginBottom: 16, opacity: 0.3 }} />
                <p style={{ fontWeight: '700', marginBottom: 6 }}>Canvas vacío</p>
                <p style={{ fontSize: '0.85rem' }}>Agregá componentes desde el panel izquierdo o elegí un template</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                {canvas.map(item => (
                  <div key={item.id} onClick={() => !preview && setSelected(selected === item.id ? null : item.id)}
                    style={{ gridColumn: `span ${item.w}`, border: !preview && selected === item.id ? `2px solid ${ORANGE}` : '2px solid transparent', borderRadius: 12, cursor: preview ? 'default' : 'pointer', transition: 'border-color 0.15s', position: 'relative' }}>
                    {!preview && selected === item.id && (
                      <button onClick={e => { e.stopPropagation(); eliminar(item.id); }}
                        style={{ position: 'absolute', top: -8, right: -8, width: 20, height: 20, borderRadius: '50%', border: 'none', backgroundColor: '#EF4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
                        <Trash2 size={10} color="#fff" />
                      </button>
                    )}
                    {renderPreview(item.type, item.color)}
                    {!preview && (
                      <div style={{ textAlign: 'center', marginTop: 4, fontSize: '0.65rem', color: '#9CA3AF' }}>{item.label}</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Panel derecho — Propiedades */}
        {!preview && (
          <div style={{ backgroundColor: '#fff', borderLeft: '1px solid #E9ECEF', overflowY: 'auto', padding: 20 }}>
            <p style={{ fontWeight: '700', color: '#9CA3AF', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 16px' }}>Propiedades</p>
            {selected ? (
              <div>
                {(() => {
                  const item = canvas.find(c => c.id === selected);
                  if (!item) return null;
                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                      <div>
                        <label style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: '600', display: 'block', marginBottom: 6 }}>Etiqueta</label>
                        <input value={item.label} onChange={e => setCanvas(prev => prev.map(c => c.id === selected ? { ...c, label: e.target.value } : c))}
                          style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #E5E7EB', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box' }} />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: '600', display: 'block', marginBottom: 6 }}>Ancho (columnas)</label>
                        <input type="range" min={1} max={4} value={item.w} onChange={e => setCanvas(prev => prev.map(c => c.id === selected ? { ...c, w: Number(e.target.value) } : c))}
                          style={{ width: '100%', accentColor: ORANGE }} />
                        <span style={{ fontSize: '0.75rem', color: ORANGE, fontWeight: '700' }}>{item.w} de 4</span>
                      </div>
                      <div>
                        <label style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: '600', display: 'block', marginBottom: 6 }}>Color</label>
                        <input type="color" value={item.color} onChange={e => setCanvas(prev => prev.map(c => c.id === selected ? { ...c, color: e.target.value } : c))}
                          style={{ width: '100%', height: 40, borderRadius: 8, border: '1px solid #E5E7EB', cursor: 'pointer', padding: 2 }} />
                      </div>
                      <button onClick={() => eliminar(selected)}
                        style={{ padding: '10px', borderRadius: 10, border: 'none', backgroundColor: '#FEE2E2', color: '#DC2626', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                        <Trash2 size={14} /> Eliminar componente
                      </button>
                    </div>
                  );
                })()}
              </div>
            ) : (
              <div style={{ textAlign: 'center', color: '#9CA3AF', padding: '30px 10px' }}>
                <Layout size={28} style={{ marginBottom: 10, opacity: 0.3 }} />
                <p style={{ fontSize: '0.82rem' }}>Seleccioná un componente para editar sus propiedades</p>
              </div>
            )}

            <div style={{ marginTop: 24, padding: 12, backgroundColor: `${ORANGE}08`, borderRadius: 10, border: `1px solid ${ORANGE}20` }}>
              <p style={{ margin: '0 0 6px', fontWeight: '700', color: ORANGE, fontSize: '0.78rem' }}>📊 Estadísticas</p>
              <div style={{ fontSize: '0.75rem', color: '#374151', lineHeight: 1.8 }}>
                {canvas.length} componentes<br />
                {canvas.filter(c => c.type === 'kpi').length} KPIs<br />
                {canvas.filter(c => c.type === 'chart').length} gráficos
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

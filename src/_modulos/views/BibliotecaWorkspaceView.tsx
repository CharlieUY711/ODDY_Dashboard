/* =====================================================
   BibliotecaWorkspace — Biblioteca de Assets
   Upload · Colecciones · Tags · Grid/Lista
   ===================================================== */
import React, { useState } from 'react';
import { OrangeHeader } from '@/app/components/admin/OrangeHeader';
import type { MainSection } from '@/app/AdminDashboard';
import { FolderOpen, Upload, Search, Image, FileText, Film, Music, Grid, List, Download, Eye, Tag, Plus, Trash2 } from 'lucide-react';

const ORANGE = '#FF6835';
interface Props { onNavigate: (s: MainSection) => void; }

const colecciones = [
  { nombre: 'Productos', archivos: 124, tamano: '2.4 GB', emoji: '📦', color: ORANGE },
  { nombre: 'Banners Marketing', archivos: 48, tamano: '890 MB', emoji: '🖼️', color: '#3B82F6' },
  { nombre: 'Videos Campaign', archivos: 18, tamano: '4.2 GB', emoji: '🎥', color: '#8B5CF6' },
  { nombre: 'Documentos', archivos: 34, tamano: '120 MB', emoji: '📄', color: '#10B981' },
  { nombre: 'Logos & Brand', archivos: 22, tamano: '45 MB', emoji: '✨', color: '#F59E0B' },
];

const archivos = [
  { id: 1, nombre: 'producto-auriculares-hero.jpg', tipo: 'imagen', tamano: '2.4 MB', dims: '2400×1600', fecha: '2026-02-24', tags: ['producto', 'electrónica'], emoji: '🖼️' },
  { id: 2, nombre: 'banner-febrero-2026.png', tipo: 'imagen', tamano: '1.8 MB', dims: '1920×1080', fecha: '2026-02-20', tags: ['banner', 'marketing'], emoji: '🖼️' },
  { id: 3, nombre: 'catalogo-2026.pdf', tipo: 'documento', tamano: '8.4 MB', dims: '28 pags.', fecha: '2026-02-15', tags: ['catálogo', 'PDF'], emoji: '📄' },
  { id: 4, nombre: 'video-campana-verano.mp4', tipo: 'video', tamano: '124 MB', dims: '1920×1080', fecha: '2026-02-10', tags: ['video', 'verano'], emoji: '🎥' },
  { id: 5, nombre: 'logo-oddy-principal.svg', tipo: 'imagen', tamano: '45 KB', dims: 'Vectorial', fecha: '2025-12-01', tags: ['logo', 'brand'], emoji: '✨' },
  { id: 6, nombre: 'producto-zapatillas-x200.jpg', tipo: 'imagen', tamano: '3.1 MB', dims: '2400×2400', fecha: '2026-02-22', tags: ['producto', 'calzado'], emoji: '🖼️' },
  { id: 7, nombre: 'manual-usuario-v2.pdf', tipo: 'documento', tamano: '2.8 MB', dims: '48 pags.', fecha: '2026-01-28', tags: ['manual', 'PDF'], emoji: '📄' },
  { id: 8, nombre: 'jingle-marca.mp3', tipo: 'audio', tamano: '3.2 MB', dims: '01:24 min', fecha: '2026-01-15', tags: ['audio', 'brand'], emoji: '🎵' },
];

const kpis = [
  { label: 'Archivos totales', value: '246', color: '#3B82F6' },
  { label: 'Espacio usado', value: '7.6 GB', color: ORANGE },
  { label: 'Colecciones', value: '5', color: '#10B981' },
  { label: 'Tags distintos', value: '28', color: '#8B5CF6' },
];

export function BibliotecaWorkspace({ onNavigate }: Props) {
  const [vista, setVista] = useState<'grid' | 'lista'>('grid');
  const [search, setSearch] = useState('');
  const [colSelected, setColSelected] = useState<string | null>(null);
  const [arrastrando, setArrastrando] = useState(false);

  const lista = archivos.filter(a => a.nombre.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', backgroundColor: '#F8F9FA' }}>
      <OrangeHeader
        icon={FolderOpen}
        title="Biblioteca de Assets"
        subtitle="Repositorio centralizado · Upload drag & drop · Tags · Export"
        actions={[
          { label: '← Volver', onClick: () => onNavigate('herramientas') },
          { label: '⬆️ Subir Archivos', primary: true },
        ]}
      />
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 22 }}>
          {kpis.map((k, i) => (
            <div key={i} style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '18px 20px' }}>
              <div style={{ fontSize: '1.6rem', fontWeight: '800', color: k.color }}>{k.value}</div>
              <div style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>{k.label}</div>
            </div>
          ))}
        </div>

        {/* Zona drag & drop */}
        <div
          onDragOver={e => { e.preventDefault(); setArrastrando(true); }}
          onDragLeave={() => setArrastrando(false)}
          onDrop={e => { e.preventDefault(); setArrastrando(false); }}
          style={{ border: `2px dashed ${arrastrando ? ORANGE : '#D1D5DB'}`, borderRadius: '14px', padding: '28px', textAlign: 'center', marginBottom: 22, backgroundColor: arrastrando ? `${ORANGE}06` : '#F9FAFB', transition: 'all 0.2s', cursor: 'pointer' }}
        >
          <Upload size={28} color={arrastrando ? ORANGE : '#9CA3AF'} style={{ margin: '0 auto 8px' }} />
          <div style={{ fontWeight: '600', color: arrastrando ? ORANGE : '#374151' }}>
            {arrastrando ? 'Soltar para subir' : 'Arrastrá archivos aquí o hacé click para seleccionar'}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#9CA3AF', marginTop: 4 }}>PNG, JPG, SVG, PDF, MP4, MP3 · Máx. 500 MB por archivo</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 20 }}>
          {/* Colecciones */}
          <div>
            <div style={{ fontWeight: '700', color: '#1A1A2E', marginBottom: 10, fontSize: '0.88rem' }}>📁 Colecciones</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <button onClick={() => setColSelected(null)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderRadius: '8px', border: 'none', cursor: 'pointer', backgroundColor: !colSelected ? `${ORANGE}10` : 'transparent', color: !colSelected ? ORANGE : '#374151', textAlign: 'left' }}>
                <span style={{ fontSize: '1.1rem' }}>🌐</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '600', fontSize: '0.83rem' }}>Todos los archivos</div>
                  <div style={{ fontSize: '0.7rem', color: '#9CA3AF' }}>246 archivos</div>
                </div>
              </button>
              {colecciones.map((c, i) => (
                <button key={i} onClick={() => setColSelected(c.nombre)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderRadius: '8px', border: 'none', cursor: 'pointer', backgroundColor: colSelected === c.nombre ? `${c.color}10` : 'transparent', color: colSelected === c.nombre ? c.color : '#374151', textAlign: 'left' }}>
                  <span style={{ fontSize: '1.1rem' }}>{c.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', fontSize: '0.83rem' }}>{c.nombre}</div>
                    <div style={{ fontSize: '0.7rem', color: '#9CA3AF' }}>{c.archivos} archivos · {c.tamano}</div>
                  </div>
                </button>
              ))}
              <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 10px', borderRadius: '8px', border: `1px dashed ${ORANGE}`, backgroundColor: `${ORANGE}06`, color: ORANGE, cursor: 'pointer', fontSize: '0.78rem', fontWeight: '600' }}>
                <Plus size={13} /> Nueva colección
              </button>
            </div>
          </div>

          {/* Archivos */}
          <div>
            <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search size={13} color="#9CA3AF" style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)' }} />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar archivos..." style={{ width: '100%', paddingLeft: 28, paddingRight: 10, paddingTop: 7, paddingBottom: 7, border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '0.82rem', outline: 'none' }} />
              </div>
              <div style={{ display: 'flex', gap: 4, backgroundColor: '#F3F4F6', padding: '3px', borderRadius: '8px' }}>
                <button onClick={() => setVista('grid')} style={{ padding: '5px 10px', borderRadius: '6px', border: 'none', backgroundColor: vista === 'grid' ? '#fff' : 'transparent', cursor: 'pointer' }}><Grid size={14} color={vista === 'grid' ? ORANGE : '#9CA3AF'} /></button>
                <button onClick={() => setVista('lista')} style={{ padding: '5px 10px', borderRadius: '6px', border: 'none', backgroundColor: vista === 'lista' ? '#fff' : 'transparent', cursor: 'pointer' }}><List size={14} color={vista === 'lista' ? ORANGE : '#9CA3AF'} /></button>
              </div>
            </div>

            {vista === 'grid' ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: 12 }}>
                {lista.map(a => (
                  <div key={a.id} style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #E5E7EB', overflow: 'hidden', cursor: 'pointer' }}>
                    <div style={{ height: 100, backgroundColor: '#F9FAFB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem' }}>{a.emoji}</div>
                    <div style={{ padding: '10px' }}>
                      <div style={{ fontSize: '0.78rem', fontWeight: '600', color: '#1A1A2E', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.nombre}</div>
                      <div style={{ fontSize: '0.68rem', color: '#9CA3AF', marginTop: 2 }}>{a.tamano} · {a.dims}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
                {lista.map((a, i) => (
                  <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderBottom: i < lista.length - 1 ? '1px solid #F9FAFB' : 'none' }}>
                    <span style={{ fontSize: '1.4rem' }}>{a.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: '600', color: '#1A1A2E' }}>{a.nombre}</div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <span style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>{a.tamano}</span>
                        <span style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>{a.dims}</span>
                        <span style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>{a.fecha}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {a.tags.map(t => <span key={t} style={{ fontSize: '0.65rem', padding: '1px 6px', borderRadius: '4px', backgroundColor: '#F3F4F6', color: '#374151' }}>{t}</span>)}
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button style={{ padding: '4px', border: '1px solid #E5E7EB', borderRadius: '6px', backgroundColor: '#F9FAFB', cursor: 'pointer' }}><Eye size={13} color="#6B7280" /></button>
                      <button style={{ padding: '4px', border: '1px solid #E5E7EB', borderRadius: '6px', backgroundColor: '#F9FAFB', cursor: 'pointer' }}><Download size={13} color="#6B7280" /></button>
                      <button style={{ padding: '4px', border: '1px solid #FEE2E2', borderRadius: '6px', backgroundColor: '#FFF5F5', cursor: 'pointer' }}><Trash2 size={13} color="#EF4444" /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

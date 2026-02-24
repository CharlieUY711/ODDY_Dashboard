/* =====================================================
   DepartamentosView — Árbol de Departamentos y Categorías
   ===================================================== */
import React, { useState } from 'react';
import { OrangeHeader } from '@/app/components/admin/OrangeHeader';
import type { MainSection } from '@/app/AdminDashboard';
import { FolderTree, ChevronDown, ChevronRight, Plus, Edit2, Trash2, FolderOpen, Folder, Tag, Search } from 'lucide-react';

const ORANGE = '#FF6835';
interface Props { onNavigate: (s: MainSection) => void; }

interface Cat { id: string; nombre: string; slug: string; emoji: string; productos: number; activa: boolean; hijos?: Cat[] }

const categorias: Cat[] = [
  {
    id: '1', nombre: 'Electrónica', slug: 'electronica', emoji: '💻', productos: 124, activa: true,
    hijos: [
      { id: '1-1', nombre: 'Audio', slug: 'audio', emoji: '🎧', productos: 32, activa: true, hijos: [
        { id: '1-1-1', nombre: 'Auriculares', slug: 'auriculares', emoji: '🎧', productos: 18, activa: true },
        { id: '1-1-2', nombre: 'Parlantes', slug: 'parlantes', emoji: '🔊', productos: 14, activa: true },
      ]},
      { id: '1-2', nombre: 'Smartphones', slug: 'smartphones', emoji: '📱', productos: 45, activa: true },
      { id: '1-3', nombre: 'Wearables', slug: 'wearables', emoji: '⌚', productos: 22, activa: true },
      { id: '1-4', nombre: 'Accesorios PC', slug: 'accesorios-pc', emoji: '⌨️', productos: 25, activa: true },
    ],
  },
  {
    id: '2', nombre: 'Indumentaria', slug: 'indumentaria', emoji: '👕', productos: 89, activa: true,
    hijos: [
      { id: '2-1', nombre: 'Calzado', slug: 'calzado', emoji: '👟', productos: 34, activa: true },
      { id: '2-2', nombre: 'Ropa Hombre', slug: 'ropa-hombre', emoji: '👔', productos: 28, activa: true },
      { id: '2-3', nombre: 'Ropa Mujer', slug: 'ropa-mujer', emoji: '👗', productos: 27, activa: true },
    ],
  },
  {
    id: '3', nombre: 'Hogar', slug: 'hogar', emoji: '🏠', productos: 56, activa: true,
    hijos: [
      { id: '3-1', nombre: 'Muebles Oficina', slug: 'muebles-oficina', emoji: '🪑', productos: 18, activa: true },
      { id: '3-2', nombre: 'Iluminación', slug: 'iluminacion', emoji: '💡', productos: 24, activa: true },
      { id: '3-3', nombre: 'Decoración', slug: 'decoracion', emoji: '🖼️', productos: 14, activa: false },
    ],
  },
  {
    id: '4', nombre: 'Deportes & Nutrición', slug: 'deportes', emoji: '🏋️', productos: 42, activa: true,
    hijos: [
      { id: '4-1', nombre: 'Suplementos', slug: 'suplementos', emoji: '💪', productos: 18, activa: true },
      { id: '4-2', nombre: 'Equipamiento', slug: 'equipamiento', emoji: '🏃', productos: 24, activa: true },
    ],
  },
];

function NodoCat({ cat, nivel = 0 }: { cat: Cat; nivel?: number }) {
  const [abierto, setAbierto] = useState(nivel < 1);
  return (
    <div>
      <div
        style={{ display: 'flex', alignItems: 'center', gap: 8, padding: `9px ${16 + nivel * 20}px`, borderBottom: '1px solid #F9FAFB', cursor: 'pointer' }}
        onClick={() => cat.hijos && setAbierto(!abierto)}
      >
        <div style={{ color: '#9CA3AF', width: 14 }}>
          {cat.hijos ? (abierto ? <ChevronDown size={13} /> : <ChevronRight size={13} />) : null}
        </div>
        <span style={{ fontSize: '1.1rem' }}>{cat.emoji}</span>
        <span style={{ fontWeight: nivel === 0 ? '700' : nivel === 1 ? '600' : '500', color: '#1A1A2E', fontSize: nivel === 0 ? '0.9rem' : '0.85rem', flex: 1 }}>{cat.nombre}</span>
        <span style={{ fontSize: '0.72rem', color: '#9CA3AF', fontFamily: 'monospace' }}>/{cat.slug}</span>
        <span style={{ fontSize: '0.78rem', color: '#374151', marginLeft: 8, minWidth: 50, textAlign: 'right' }}>{cat.productos} prods.</span>
        <span style={{ marginLeft: 8, fontSize: '0.68rem', fontWeight: '700', padding: '1px 7px', borderRadius: '5px', backgroundColor: cat.activa ? '#D1FAE5' : '#F3F4F6', color: cat.activa ? '#059669' : '#9CA3AF' }}>
          {cat.activa ? 'activa' : 'inactiva'}
        </span>
        <div style={{ display: 'flex', gap: 4, marginLeft: 8, opacity: 0.7 }}>
          <button onClick={e => e.stopPropagation()} style={{ padding: '3px', border: '1px solid #E5E7EB', borderRadius: '5px', backgroundColor: '#F9FAFB', cursor: 'pointer' }}><Edit2 size={11} color="#6B7280" /></button>
          <button onClick={e => e.stopPropagation()} style={{ padding: '3px', border: '1px solid #E5E7EB', borderRadius: '5px', backgroundColor: '#F9FAFB', cursor: 'pointer' }}><Plus size={11} color="#10B981" /></button>
        </div>
      </div>
      {abierto && cat.hijos?.map(h => <NodoCat key={h.id} cat={h} nivel={nivel + 1} />)}
    </div>
  );
}

export function DepartamentosView({ onNavigate }: Props) {
  const [search, setSearch] = useState('');
  const total = categorias.reduce((acc, c) => acc + (c.hijos?.reduce((a, h) => a + (h.hijos?.length ?? 0) + 1, 0) ?? 0) + 1, 0);
  const totalProds = categorias.reduce((acc, c) => acc + c.productos, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', backgroundColor: '#F8F9FA' }}>
      <OrangeHeader
        icon={FolderTree}
        title="Departamentos y Categorías"
        subtitle="Árbol jerárquico de categorías · SEO integrado"
        actions={[
          { label: '← Volver', onClick: () => onNavigate('ecommerce') },
          { label: '+ Nueva Categoría', primary: true },
        ]}
      />
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 22 }}>
          {[
            { label: 'Categorías raíz', value: categorias.length, color: '#3B82F6' },
            { label: 'Total categorías', value: total, color: ORANGE },
            { label: 'Productos catalogados', value: totalProds, color: '#10B981' },
            { label: 'Inactivas', value: 1, color: '#9CA3AF' },
          ].map((k, i) => (
            <div key={i} style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '18px 20px' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: k.color }}>{k.value}</div>
              <div style={{ fontSize: '0.78rem', color: '#9CA3AF', marginTop: 2 }}>{k.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20 }}>
          {/* Árbol */}
          <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid #F3F4F6', display: 'flex', gap: 10 }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search size={13} color="#9CA3AF" style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)' }} />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar categoría..." style={{ width: '100%', paddingLeft: 28, paddingRight: 10, paddingTop: 7, paddingBottom: 7, border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '0.82rem', outline: 'none' }} />
              </div>
            </div>
            {categorias.map(c => <NodoCat key={c.id} cat={c} />)}
          </div>

          {/* SEO panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '18px' }}>
              <div style={{ fontWeight: '700', color: '#1A1A2E', marginBottom: 12, fontSize: '0.88rem' }}>🔍 SEO por Categoría</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {categorias.map(c => (
                  <div key={c.id} style={{ padding: '10px', backgroundColor: '#F9FAFB', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      <span>{c.emoji}</span>
                      <span style={{ fontWeight: '600', fontSize: '0.83rem' }}>{c.nombre}</span>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#9CA3AF', marginBottom: 6 }}>/{c.slug}</div>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#10B981', alignSelf: 'center' }} />
                      <span style={{ fontSize: '0.7rem', color: '#059669' }}>Meta title OK</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '18px' }}>
              <div style={{ fontWeight: '700', color: '#1A1A2E', marginBottom: 12, fontSize: '0.88rem' }}>📊 Distribución</div>
              {categorias.map((c, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: '0.85rem' }}>{c.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                      <span style={{ fontSize: '0.78rem', color: '#374151' }}>{c.nombre}</span>
                      <span style={{ fontSize: '0.78rem', fontWeight: '600', color: '#374151' }}>{c.productos}</span>
                    </div>
                    <div style={{ width: '100%', height: 5, backgroundColor: '#F3F4F6', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ width: `${(c.productos / totalProds) * 100}%`, height: '100%', backgroundColor: ORANGE, borderRadius: 3 }} />
                    </div>
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

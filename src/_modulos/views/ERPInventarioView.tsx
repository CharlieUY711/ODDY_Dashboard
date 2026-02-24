/* =====================================================
   ERPInventarioView — Catálogo de Artículos / Inventario
   ===================================================== */
import React, { useState, useMemo } from 'react';
import { OrangeHeader } from '@/app/components/admin/OrangeHeader';
import type { MainSection } from '@/app/AdminDashboard';
import {
  Package, Search, AlertTriangle, TrendingUp, Tag,
  Plus, Download, Filter, Eye, Edit2, BarChart2, Box,
  CheckCircle, XCircle, ArrowUpDown,
} from 'lucide-react';

const ORANGE = '#FF6835';
interface Props { onNavigate: (s: MainSection) => void; }

const productos = [
  { id: 1, sku: 'PRD-0001', nombre: 'Auriculares Bluetooth Pro', categoria: 'Electrónica', stock: 245, minStock: 20, precio: 1890, costo: 980, estado: 'activo', variantes: 3, imagen: '🎧' },
  { id: 2, sku: 'PRD-0002', nombre: 'Zapatillas Running X200', categoria: 'Calzado', stock: 12, minStock: 30, precio: 3450, costo: 1800, estado: 'activo', variantes: 8, imagen: '👟' },
  { id: 3, sku: 'PRD-0003', nombre: 'Mochila Universitaria Urban', categoria: 'Accesorios', stock: 0, minStock: 10, precio: 1200, costo: 620, estado: 'activo', variantes: 4, imagen: '🎒' },
  { id: 4, sku: 'PRD-0004', nombre: 'Smartwatch Fitness Band', categoria: 'Electrónica', stock: 67, minStock: 15, precio: 2890, costo: 1450, estado: 'activo', variantes: 2, imagen: '⌚' },
  { id: 5, sku: 'PRD-0005', nombre: 'Camiseta Algodón Orgánico', categoria: 'Ropa', stock: 8, minStock: 50, precio: 650, costo: 280, estado: 'activo', variantes: 12, imagen: '👕' },
  { id: 6, sku: 'PRD-0006', nombre: 'Silla Ergonómica Home Office', categoria: 'Hogar', stock: 34, minStock: 5, precio: 8900, costo: 4500, estado: 'activo', variantes: 1, imagen: '🪑' },
  { id: 7, sku: 'PRD-0007', nombre: 'Teclado Mecánico RGB', categoria: 'Electrónica', stock: 0, minStock: 10, precio: 3200, costo: 1600, estado: 'inactivo', variantes: 2, imagen: '⌨️' },
  { id: 8, sku: 'PRD-0008', nombre: 'Proteína Whey 1kg', categoria: 'Nutrición', stock: 189, minStock: 40, precio: 1800, costo: 850, estado: 'activo', variantes: 5, imagen: '💪' },
  { id: 9, sku: 'PRD-0009', nombre: 'Lámpara LED Escritorio', categoria: 'Hogar', stock: 5, minStock: 15, precio: 990, costo: 450, estado: 'activo', variantes: 3, imagen: '💡' },
  { id: 10, sku: 'PRD-0010', nombre: 'Agenda Ejecutiva 2026', categoria: 'Librería', stock: 320, minStock: 25, precio: 480, costo: 200, estado: 'activo', variantes: 1, imagen: '📓' },
];

const categorias = ['Todos', 'Electrónica', 'Calzado', 'Accesorios', 'Ropa', 'Hogar', 'Nutrición', 'Librería'];

function StockBadge({ stock, min }: { stock: number; min: number }) {
  if (stock === 0) return <span style={{ fontSize: '0.7rem', fontWeight: '700', color: '#DC2626', backgroundColor: '#FEE2E2', padding: '2px 8px', borderRadius: '6px' }}>Sin stock</span>;
  if (stock < min) return <span style={{ fontSize: '0.7rem', fontWeight: '700', color: '#D97706', backgroundColor: '#FEF3C7', padding: '2px 8px', borderRadius: '6px' }}>Stock bajo</span>;
  return <span style={{ fontSize: '0.7rem', fontWeight: '700', color: '#059669', backgroundColor: '#D1FAE5', padding: '2px 8px', borderRadius: '6px' }}>En stock</span>;
}

export function ERPInventarioView({ onNavigate }: Props) {
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('Todos');
  const [estadoFilter, setEstadoFilter] = useState('Todos');
  const [tab, setTab] = useState<'todos' | 'alertas'>('todos');

  const kpis = [
    { label: 'Total Productos', value: '10', icon: Package, color: '#3B82F6' },
    { label: 'En Stock', value: '7', icon: CheckCircle, color: '#10B981' },
    { label: 'Stock Bajo', value: '3', icon: AlertTriangle, color: '#D97706' },
    { label: 'Sin Stock', value: '2', icon: XCircle, color: '#EF4444' },
  ];

  const filtered = useMemo(() => {
    let list = productos;
    if (tab === 'alertas') list = list.filter(p => p.stock === 0 || p.stock < p.minStock);
    return list.filter(p => {
      const matchSearch = p.nombre.toLowerCase().includes(search.toLowerCase())
        || p.sku.toLowerCase().includes(search.toLowerCase());
      const matchCat = catFilter === 'Todos' || p.categoria === catFilter;
      const matchEstado = estadoFilter === 'Todos' || p.estado === estadoFilter;
      return matchSearch && matchCat && matchEstado;
    });
  }, [search, catFilter, estadoFilter, tab]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', backgroundColor: '#F8F9FA' }}>
      <OrangeHeader
        icon={Package}
        title="Catálogo de Artículos"
        subtitle="Inventario y stock en tiempo real · ERP"
        actions={[
          { label: '← Volver', onClick: () => onNavigate('gestion') },
          { label: '+ Nuevo Producto', primary: true },
        ]}
      />

      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>

        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '22px' }}>
          {kpis.map((k, i) => (
            <div key={i} style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 42, height: 42, borderRadius: '11px', backgroundColor: `${k.color}14`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <k.icon size={20} color={k.color} strokeWidth={2} />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '0.72rem', color: '#6B7280' }}>{k.label}</p>
                <p style={{ margin: 0, fontSize: '1.6rem', fontWeight: '800', color: '#111827', lineHeight: 1 }}>{k.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Alertas de stock crítico */}
        {productos.filter(p => p.stock < p.minStock).length > 0 && (
          <div style={{ backgroundColor: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '12px', padding: '14px 18px', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <AlertTriangle size={18} color="#D97706" />
            <p style={{ margin: 0, fontSize: '0.83rem', color: '#92400E' }}>
              <strong>{productos.filter(p => p.stock < p.minStock).length} productos</strong> tienen stock por debajo del mínimo configurado. Revisá la pestaña "Alertas".
            </p>
            <button
              onClick={() => setTab('alertas')}
              style={{ marginLeft: 'auto', padding: '5px 12px', borderRadius: '7px', border: '1px solid #FDE68A', backgroundColor: '#FEF3C7', color: '#D97706', fontSize: '0.78rem', fontWeight: '700', cursor: 'pointer' }}
            >
              Ver alertas
            </button>
          </div>
        )}

        {/* Tabs + Filtros */}
        <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
          <div style={{ borderBottom: '1px solid #F0F0F0', padding: '0 20px', display: 'flex', gap: 0, alignItems: 'center' }}>
            {(['todos', 'alertas'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  padding: '14px 18px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer',
                  fontSize: '0.83rem', fontWeight: '700',
                  color: tab === t ? ORANGE : '#6B7280',
                  borderBottom: tab === t ? `2px solid ${ORANGE}` : '2px solid transparent',
                  marginBottom: '-1px',
                }}
              >
                {t === 'todos' ? 'Todos los productos' : '⚠️ Alertas de stock'}
              </button>
            ))}
            <div style={{ flex: 1 }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, backgroundColor: '#F9FAFB', borderRadius: '8px', border: '1px solid #E5E7EB', padding: '6px 12px' }}>
                <Search size={13} color="#9CA3AF" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Buscar producto o SKU..."
                  style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.8rem', color: '#374151', width: 180 }}
                />
              </div>
              <select
                value={catFilter}
                onChange={e => setCatFilter(e.target.value)}
                style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '0.78rem', color: '#374151', backgroundColor: '#F9FAFB', outline: 'none' }}
              >
                {categorias.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                {['Producto', 'SKU', 'Categoría', 'Stock', 'Stock Mín.', 'Estado', 'Precio', 'Margen', ''].map(h => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '0.7rem', fontWeight: '700', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => {
                const margen = Math.round(((p.precio - p.costo) / p.precio) * 100);
                return (
                  <tr key={p.id}
                    style={{ borderBottom: i < filtered.length - 1 ? '1px solid #F3F4F6' : 'none' }}
                    onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.backgroundColor = '#F9FAFB'}
                    onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.backgroundColor = ''}
                  >
                    <td style={{ padding: '13px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 36, height: 36, borderRadius: '9px', backgroundColor: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0 }}>
                          {p.imagen}
                        </div>
                        <div>
                          <p style={{ margin: 0, fontSize: '0.84rem', fontWeight: '700', color: '#1F2937' }}>{p.nombre}</p>
                          <p style={{ margin: 0, fontSize: '0.71rem', color: '#9CA3AF' }}>{p.variantes} variante{p.variantes > 1 ? 's' : ''}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '13px 16px' }}>
                      <span style={{ fontSize: '0.78rem', fontFamily: 'monospace', backgroundColor: '#F3F4F6', padding: '2px 7px', borderRadius: '5px', color: '#374151' }}>{p.sku}</span>
                    </td>
                    <td style={{ padding: '13px 16px' }}>
                      <span style={{ fontSize: '0.78rem', color: '#374151' }}>{p.categoria}</span>
                    </td>
                    <td style={{ padding: '13px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: '800', color: p.stock === 0 ? '#DC2626' : p.stock < p.minStock ? '#D97706' : '#1F2937' }}>
                          {p.stock}
                        </span>
                        <StockBadge stock={p.stock} min={p.minStock} />
                      </div>
                    </td>
                    <td style={{ padding: '13px 16px' }}>
                      <span style={{ fontSize: '0.8rem', color: '#6B7280' }}>{p.minStock}</span>
                    </td>
                    <td style={{ padding: '13px 16px' }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: '700', color: p.estado === 'activo' ? '#059669' : '#9CA3AF', backgroundColor: p.estado === 'activo' ? '#D1FAE5' : '#F3F4F6', padding: '2px 8px', borderRadius: '6px' }}>
                        {p.estado === 'activo' ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td style={{ padding: '13px 16px' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1F2937' }}>${p.precio.toLocaleString()}</span>
                    </td>
                    <td style={{ padding: '13px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 50, height: 5, backgroundColor: '#F3F4F6', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ width: `${margen}%`, height: '100%', backgroundColor: margen > 40 ? '#10B981' : '#F59E0B', borderRadius: '3px' }} />
                        </div>
                        <span style={{ fontSize: '0.78rem', fontWeight: '600', color: '#6B7280' }}>{margen}%</span>
                      </div>
                    </td>
                    <td style={{ padding: '13px 16px' }}>
                      <div style={{ display: 'flex', gap: 5 }}>
                        <button style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #E5E7EB', backgroundColor: 'transparent', color: '#6B7280', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                          <Edit2 size={13} />
                        </button>
                        <button style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #E5E7EB', backgroundColor: 'transparent', color: '#6B7280', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                          <Eye size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div style={{ padding: '12px 20px', borderTop: '1px solid #F0F0F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', color: '#9CA3AF' }}>Mostrando {filtered.length} resultados</span>
            <div style={{ display: 'flex', gap: 6 }}>
              {[1, 2, 3].map(n => (
                <button key={n} style={{ width: 30, height: 30, borderRadius: '7px', border: n === 1 ? 'none' : '1px solid #E5E7EB', backgroundColor: n === 1 ? ORANGE : 'transparent', color: n === 1 ? '#fff' : '#6B7280', fontSize: '0.78rem', cursor: 'pointer' }}>
                  {n}
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

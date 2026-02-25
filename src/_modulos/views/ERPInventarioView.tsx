/* =====================================================
   ERPInventarioView — Catálogo de Artículos / Inventario
   ===================================================== */
import React, { useState, useMemo, useEffect } from 'react';
import { OrangeHeader } from '@/app/components/admin/OrangeHeader';
import type { MainSection } from '@/app/AdminDashboard';
import {
  Package, Search, AlertTriangle, TrendingUp, Tag,
  Plus, Download, Filter, Eye, Edit2, BarChart2, Box,
  CheckCircle, XCircle, ArrowUpDown, Loader2, X,
} from 'lucide-react';
import { api } from '@/app/services/supabaseApi';

const ORANGE = '#FF6835';
interface Props { onNavigate: (s: MainSection) => void; }

interface Producto {
  id: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  precio_original?: number;
  departamento_id?: string;
  departamento_nombre?: string;
  imagen_principal?: string;
  estado?: string;
  producto_stock?: Array<{ cantidad: number; reservado: number }>;
  producto_variantes?: Array<{ id: string; sku?: string }>;
  [key: string]: unknown;
}

interface Departamento {
  id: string;
  nombre: string;
  color?: string;
  icono?: string | null;
  orden?: number;
  activo?: boolean;
}

function StockBadge({ stock, min }: { stock: number; min: number }) {
  if (stock === 0) return <span style={{ fontSize: '0.7rem', fontWeight: '700', color: '#DC2626', backgroundColor: '#FEE2E2', padding: '2px 8px', borderRadius: '6px' }}>Sin stock</span>;
  if (stock < min) return <span style={{ fontSize: '0.7rem', fontWeight: '700', color: '#D97706', backgroundColor: '#FEF3C7', padding: '2px 8px', borderRadius: '6px' }}>Stock bajo</span>;
  return <span style={{ fontSize: '0.7rem', fontWeight: '700', color: '#059669', backgroundColor: '#D1FAE5', padding: '2px 8px', borderRadius: '6px' }}>En stock</span>;
}

function ModalProducto({ producto, departamentos, onClose, onSave }: { producto: Producto | null; departamentos: Departamento[]; onClose: () => void; onSave: (data: Partial<Producto>) => Promise<void> }) {
  const [nombre, setNombre] = useState(producto?.nombre || '');
  const [descripcion, setDescripcion] = useState(producto?.descripcion || '');
  const [precio, setPrecio] = useState(producto?.precio?.toString() || '');
  const [precioOriginal, setPrecioOriginal] = useState(producto?.precio_original?.toString() || '');
  const [departamentoId, setDepartamentoId] = useState(producto?.departamento_id || '');
  const [imagenPrincipal, setImagenPrincipal] = useState(producto?.imagen_principal || '');
  const [estado, setEstado] = useState(producto?.estado || 'activo');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await onSave({
        nombre,
        descripcion,
        precio: parseFloat(precio) || 0,
        precio_original: precioOriginal ? parseFloat(precioOriginal) : undefined,
        departamento_id: departamentoId || undefined,
        imagen_principal: imagenPrincipal || undefined,
        estado,
      });
      onClose();
    } catch (error) {
      console.error('Error guardando producto:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ backgroundColor: '#fff', borderRadius: '14px', padding: '24px', width: '600px', maxWidth: '90vw', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '700', color: '#1A1A2E' }}>
            {producto ? 'Editar Producto' : 'Nuevo Producto'}
          </h3>
          <button onClick={onClose} style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: '4px' }}>
            <X size={20} color="#6B7280" />
          </button>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Nombre *</label>
            <input
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              style={{ width: '100%', padding: '10px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '0.9rem', outline: 'none' }}
              placeholder="Ej: Auriculares Bluetooth Pro"
            />
          </div>
          
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Descripción</label>
            <textarea
              value={descripcion}
              onChange={e => setDescripcion(e.target.value)}
              style={{ width: '100%', padding: '10px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '0.9rem', outline: 'none', minHeight: '80px', resize: 'vertical' }}
              placeholder="Descripción del producto"
            />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Precio *</label>
              <input
                type="number"
                value={precio}
                onChange={e => setPrecio(e.target.value)}
                style={{ width: '100%', padding: '10px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '0.9rem', outline: 'none' }}
                placeholder="0"
                step="0.01"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Precio Original</label>
              <input
                type="number"
                value={precioOriginal}
                onChange={e => setPrecioOriginal(e.target.value)}
                style={{ width: '100%', padding: '10px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '0.9rem', outline: 'none' }}
                placeholder="0"
                step="0.01"
              />
            </div>
          </div>
          
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Departamento</label>
            <select
              value={departamentoId}
              onChange={e => setDepartamentoId(e.target.value)}
              style={{ width: '100%', padding: '10px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '0.9rem', outline: 'none', backgroundColor: '#fff' }}
            >
              <option value="">Seleccionar...</option>
              {departamentos.map(d => (
                <option key={d.id} value={d.id}>{d.nombre}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Imagen Principal (URL)</label>
            <input
              value={imagenPrincipal}
              onChange={e => setImagenPrincipal(e.target.value)}
              style={{ width: '100%', padding: '10px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '0.9rem', outline: 'none' }}
              placeholder="https://..."
            />
          </div>
          
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Estado</label>
            <select
              value={estado}
              onChange={e => setEstado(e.target.value)}
              style={{ width: '100%', padding: '10px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '0.9rem', outline: 'none', backgroundColor: '#fff' }}
            >
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '10px', marginTop: '24px', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{ padding: '10px 20px', border: '1px solid #E5E7EB', borderRadius: '8px', backgroundColor: '#fff', color: '#6B7280', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600' }}
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={loading || !nombre.trim() || !precio}
            style={{ padding: '10px 20px', border: 'none', borderRadius: '8px', backgroundColor: ORANGE, color: '#fff', cursor: loading || !nombre.trim() || !precio ? 'not-allowed' : 'pointer', fontSize: '0.85rem', fontWeight: '600', opacity: loading || !nombre.trim() || !precio ? 0.6 : 1, display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            {loading && <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />}
            {producto ? 'Guardar' : 'Crear'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function ERPInventarioView({ onNavigate }: Props) {
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('Todos');
  const [estadoFilter, setEstadoFilter] = useState('Todos');
  const [tab, setTab] = useState<'todos' | 'alertas'>('todos');
  const [productos, setProductos] = useState<Producto[]>([]);
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProducto, setEditingProducto] = useState<Producto | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [productosRes, deptosRes] = await Promise.all([
        api.articulos.getProductos('market', { page: 1, limit: 50 }),
        api.departamentos.getDepartamentos(),
      ]);

      if (productosRes.ok && productosRes.data) {
        const data = productosRes.data as { items?: Producto[]; data?: Producto[] };
        // La API devuelve { items: Producto[], total: number, page: number, limit: number }
        if (data && 'items' in data) {
          setProductos(data.items || []);
        } else if (Array.isArray(data)) {
          setProductos(data);
        } else if (data && 'data' in data && Array.isArray(data.data)) {
          setProductos(data.data);
        } else {
          setProductos([]);
        }
      }

      if (deptosRes.ok && deptosRes.data) {
        setDepartamentos(Array.isArray(deptosRes.data) ? deptosRes.data : []);
      }
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStockTotal = (producto: Producto): number => {
    if (!producto.producto_stock || !Array.isArray(producto.producto_stock)) return 0;
    return producto.producto_stock.reduce((acc, s) => acc + (s.cantidad || 0), 0);
  };

  const getVariantesCount = (producto: Producto): number => {
    if (!producto.producto_variantes || !Array.isArray(producto.producto_variantes)) return 0;
    return producto.producto_variantes.length;
  };

  const getSKU = (producto: Producto): string => {
    if (producto.producto_variantes && producto.producto_variantes.length > 0) {
      return producto.producto_variantes[0].sku || `PRD-${producto.id.slice(0, 8)}`;
    }
    return `PRD-${producto.id.slice(0, 8)}`;
  };

  const totalProductos = productos.length;
  const enStock = productos.filter(p => getStockTotal(p) > 0).length;
  const stockBajo = productos.filter(p => {
    const stock = getStockTotal(p);
    return stock > 0 && stock < 10; // Asumiendo mínimo de 10
  }).length;
  const sinStock = productos.filter(p => getStockTotal(p) === 0).length;

  const kpis = [
    { label: 'Total Productos', value: totalProductos.toString(), icon: Package, color: '#3B82F6' },
    { label: 'En Stock', value: enStock.toString(), icon: CheckCircle, color: '#10B981' },
    { label: 'Stock Bajo', value: stockBajo.toString(), icon: AlertTriangle, color: '#D97706' },
    { label: 'Sin Stock', value: sinStock.toString(), icon: XCircle, color: '#EF4444' },
  ];

  const filtered = useMemo(() => {
    let list = productos;
    if (tab === 'alertas') {
      list = list.filter(p => {
        const stock = getStockTotal(p);
        return stock === 0 || stock < 10;
      });
    }
    return list.filter(p => {
      const matchSearch = p.nombre.toLowerCase().includes(search.toLowerCase())
        || getSKU(p).toLowerCase().includes(search.toLowerCase());
      const matchCat = catFilter === 'Todos' || p.departamento_id === catFilter;
      const matchEstado = estadoFilter === 'Todos' || p.estado === estadoFilter;
      return matchSearch && matchCat && matchEstado;
    });
  }, [search, catFilter, estadoFilter, tab, productos]);

  const handleSave = async (data: Partial<Producto>) => {
    try {
      if (editingProducto) {
        await api.articulos.updateProducto(editingProducto.id, data, 'market');
      } else {
        await api.articulos.createProducto(data, 'market');
      }
      await loadData();
      setModalOpen(false);
      setEditingProducto(null);
    } catch (error) {
      console.error('Error guardando producto:', error);
      throw error;
    }
  };

  const handleEdit = (producto: Producto) => {
    setEditingProducto(producto);
    setModalOpen(true);
  };

  const handleNew = () => {
    setEditingProducto(null);
    setModalOpen(true);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', backgroundColor: '#F8F9FA', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 size={32} color={ORANGE} style={{ animation: 'spin 1s linear infinite' }} />
        <p style={{ marginTop: '16px', color: '#6B7280', fontSize: '0.9rem' }}>Cargando productos...</p>
      </div>
    );
  }

  const productosConStockBajo = productos.filter(p => {
    const stock = getStockTotal(p);
    return stock > 0 && stock < 10;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', backgroundColor: '#F8F9FA' }}>
      <OrangeHeader
        icon={Package}
        title="Catálogo de Artículos"
        subtitle="Inventario y stock en tiempo real · ERP"
        actions={[
          { label: '← Volver', onClick: () => onNavigate('gestion') },
          { label: '+ Nuevo Producto', primary: true, onClick: handleNew },
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
        {productosConStockBajo.length > 0 && (
          <div style={{ backgroundColor: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '12px', padding: '14px 18px', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <AlertTriangle size={18} color="#D97706" />
            <p style={{ margin: 0, fontSize: '0.83rem', color: '#92400E' }}>
              <strong>{productosConStockBajo.length} productos</strong> tienen stock por debajo del mínimo configurado. Revisá la pestaña "Alertas".
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
                <option value="Todos">Todos</option>
                {departamentos.map(d => (
                  <option key={d.id} value={d.id}>{d.nombre}</option>
                ))}
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
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ padding: '40px', textAlign: 'center', color: '#9CA3AF' }}>
                    No se encontraron productos
                  </td>
                </tr>
              ) : (
                filtered.map((p, i) => {
                  const stock = getStockTotal(p);
                  const variantes = getVariantesCount(p);
                  const sku = getSKU(p);
                  const margen = p.precio_original && p.precio ? Math.round(((p.precio - (p.precio_original * 0.7)) / p.precio) * 100) : 0;
                  const minStock = 10; // Valor por defecto
                  
                  return (
                    <tr key={p.id}
                      style={{ borderBottom: i < filtered.length - 1 ? '1px solid #F3F4F6' : 'none' }}
                      onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.backgroundColor = '#F9FAFB'}
                      onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.backgroundColor = ''}
                    >
                      <td style={{ padding: '13px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 36, height: 36, borderRadius: '9px', backgroundColor: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0, overflow: 'hidden' }}>
                            {p.imagen_principal ? (
                              <img src={p.imagen_principal} alt={p.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                              <span>📦</span>
                            )}
                          </div>
                          <div>
                            <p style={{ margin: 0, fontSize: '0.84rem', fontWeight: '700', color: '#1F2937' }}>{p.nombre}</p>
                            <p style={{ margin: 0, fontSize: '0.71rem', color: '#9CA3AF' }}>{variantes} variante{variantes !== 1 ? 's' : ''}</p>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '13px 16px' }}>
                        <span style={{ fontSize: '0.78rem', fontFamily: 'monospace', backgroundColor: '#F3F4F6', padding: '2px 7px', borderRadius: '5px', color: '#374151' }}>{sku}</span>
                      </td>
                      <td style={{ padding: '13px 16px' }}>
                        <span style={{ fontSize: '0.78rem', color: '#374151' }}>{p.departamento_nombre || 'Sin categoría'}</span>
                      </td>
                      <td style={{ padding: '13px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ fontSize: '0.9rem', fontWeight: '800', color: stock === 0 ? '#DC2626' : stock < minStock ? '#D97706' : '#1F2937' }}>
                            {stock}
                          </span>
                          <StockBadge stock={stock} min={minStock} />
                        </div>
                      </td>
                      <td style={{ padding: '13px 16px' }}>
                        <span style={{ fontSize: '0.8rem', color: '#6B7280' }}>{minStock}</span>
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
                            <div style={{ width: `${Math.min(margen, 100)}%`, height: '100%', backgroundColor: margen > 40 ? '#10B981' : '#F59E0B', borderRadius: '3px' }} />
                          </div>
                          <span style={{ fontSize: '0.78rem', fontWeight: '600', color: '#6B7280' }}>{margen}%</span>
                        </div>
                      </td>
                      <td style={{ padding: '13px 16px' }}>
                        <div style={{ display: 'flex', gap: 5 }}>
                          <button onClick={() => handleEdit(p)} style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #E5E7EB', backgroundColor: 'transparent', color: '#6B7280', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                            <Edit2 size={13} />
                          </button>
                          <button style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #E5E7EB', backgroundColor: 'transparent', color: '#6B7280', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                            <Eye size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
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
      
      {modalOpen && (
        <ModalProducto
          producto={editingProducto}
          departamentos={departamentos}
          onClose={() => { setModalOpen(false); setEditingProducto(null); }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

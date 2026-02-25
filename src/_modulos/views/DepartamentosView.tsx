/* =====================================================
   DepartamentosView — Árbol de Departamentos y Categorías
   ===================================================== */
import React, { useState, useEffect } from 'react';
import { OrangeHeader } from '@/app/components/admin/OrangeHeader';
import type { MainSection } from '@/app/AdminDashboard';
import { FolderTree, ChevronDown, ChevronRight, Plus, Edit2, Trash2, FolderOpen, Folder, Tag, Search, X, Loader2 } from 'lucide-react';
import { api } from '@/app/services/supabaseApi';

const ORANGE = '#FF6835';
interface Props { onNavigate: (s: MainSection) => void; }

interface Departamento {
  id: string;
  nombre: string;
  color: string;
  icono: string | null;
  orden: number;
  activo: boolean;
  created_at: string;
  conteo_market?: number;
  conteo_secondhand?: number;
  conteo_total: number;
}

function NodoDept({ dept, onEdit }: { dept: Departamento; onEdit: (dept: Departamento) => void }) {
  const [abierto, setAbierto] = useState(false);
  const icono = dept.icono || '📁';
  const slug = dept.nombre.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  const color = dept.color || ORANGE;
  
  return (
    <div>
      <div
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 8, 
          padding: '9px 16px', 
          borderBottom: '1px solid #F9FAFB',
          borderLeft: `4px solid ${color}`,
          cursor: 'pointer' 
        }}
        onClick={() => setAbierto(!abierto)}
      >
        <div style={{ color: '#9CA3AF', width: 14 }}>
          {abierto ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
        </div>
        <span style={{ fontSize: '1.1rem' }}>{icono}</span>
        <span style={{ fontWeight: '700', color: '#1A1A2E', fontSize: '0.9rem', flex: 1 }}>{dept.nombre}</span>
        <span style={{ fontSize: '0.72rem', color: '#9CA3AF', fontFamily: 'monospace' }}>/{slug}</span>
        <span style={{ fontSize: '0.78rem', color: '#374151', marginLeft: 8, minWidth: 50, textAlign: 'right' }}>{dept.conteo_total || 0} prods.</span>
        <span style={{ marginLeft: 8, fontSize: '0.68rem', fontWeight: '700', padding: '1px 7px', borderRadius: '5px', backgroundColor: dept.activo ? '#D1FAE5' : '#F3F4F6', color: dept.activo ? '#059669' : '#9CA3AF' }}>
          {dept.activo ? 'activa' : 'inactiva'}
        </span>
        <div style={{ display: 'flex', gap: 4, marginLeft: 8, opacity: 0.7 }}>
          <button onClick={e => { e.stopPropagation(); onEdit(dept); }} style={{ padding: '3px', border: '1px solid #E5E7EB', borderRadius: '5px', backgroundColor: '#F9FAFB', cursor: 'pointer' }}><Edit2 size={11} color="#6B7280" /></button>
        </div>
      </div>
    </div>
  );
}

function ModalDepartamento({ dept, onClose, onSave }: { dept: Departamento | null; onClose: () => void; onSave: (data: Partial<Departamento>) => Promise<void> }) {
  const [nombre, setNombre] = useState(dept?.nombre || '');
  const [color, setColor] = useState(dept?.color || '#FF6835');
  const [icono, setIcono] = useState(dept?.icono || '');
  const [orden, setOrden] = useState(dept?.orden || 0);
  const [activo, setActivo] = useState(dept?.activo ?? true);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await onSave({ nombre, color, icono, orden, activo });
      onClose();
    } catch (error) {
      console.error('Error guardando departamento:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ backgroundColor: '#fff', borderRadius: '14px', padding: '24px', width: '500px', maxWidth: '90vw' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '700', color: '#1A1A2E' }}>
            {dept ? 'Editar Departamento' : 'Nuevo Departamento'}
          </h3>
          <button onClick={onClose} style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: '4px' }}>
            <X size={20} color="#6B7280" />
          </button>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Nombre</label>
            <input
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              style={{ width: '100%', padding: '10px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '0.9rem', outline: 'none' }}
              placeholder="Ej: Electrónica"
            />
          </div>
          
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Color</label>
            <input
              type="color"
              value={color}
              onChange={e => setColor(e.target.value)}
              style={{ width: '100%', height: '40px', border: '1px solid #E5E7EB', borderRadius: '8px', cursor: 'pointer' }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Icono (emoji)</label>
            <input
              value={icono}
              onChange={e => setIcono(e.target.value)}
              style={{ width: '100%', padding: '10px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '0.9rem', outline: 'none' }}
              placeholder="Ej: 💻"
              maxLength={2}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Orden</label>
            <input
              type="number"
              value={orden}
              onChange={e => setOrden(parseInt(e.target.value) || 0)}
              style={{ width: '100%', padding: '10px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '0.9rem', outline: 'none' }}
            />
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              checked={activo}
              onChange={e => setActivo(e.target.checked)}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
            <label style={{ fontSize: '0.85rem', color: '#374151', cursor: 'pointer' }}>Activo</label>
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
            disabled={loading || !nombre.trim()}
            style={{ padding: '10px 20px', border: 'none', borderRadius: '8px', backgroundColor: ORANGE, color: '#fff', cursor: loading || !nombre.trim() ? 'not-allowed' : 'pointer', fontSize: '0.85rem', fontWeight: '600', opacity: loading || !nombre.trim() ? 0.6 : 1, display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            {loading && <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />}
            {dept ? 'Guardar' : 'Crear'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function DepartamentosView({ onNavigate }: Props) {
  const [search, setSearch] = useState('');
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Departamento | null>(null);

  useEffect(() => {
    loadDepartamentos();
  }, []);

  const loadDepartamentos = async () => {
    setLoading(true);
    try {
      const response = await api.departamentos.getDepartamentos(true);
      if (response.ok && response.data) {
        setDepartamentos(Array.isArray(response.data) ? response.data : []);
      } else {
        console.error('Error cargando departamentos:', response.error);
      }
    } catch (error) {
      console.error('Error cargando departamentos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data: Partial<Departamento>) => {
    try {
      if (editingDept) {
        await api.departamentos.updateDepartamento(editingDept.id, data);
      } else {
        await api.departamentos.createDepartamento(data);
      }
      await loadDepartamentos();
      setModalOpen(false);
      setEditingDept(null);
    } catch (error) {
      console.error('Error guardando departamento:', error);
      throw error;
    }
  };

  const handleEdit = (dept: Departamento) => {
    setEditingDept(dept);
    setModalOpen(true);
  };

  const handleNew = () => {
    setEditingDept(null);
    setModalOpen(true);
  };

  const filtered = departamentos.filter(d => 
    d.nombre.toLowerCase().includes(search.toLowerCase())
  );

  const totalProds = departamentos.reduce((acc, d) => acc + (d.conteo_total || 0), 0);
  const inactivas = departamentos.filter(d => !d.activo).length;

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', backgroundColor: '#F8F9FA', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 size={32} color={ORANGE} style={{ animation: 'spin 1s linear infinite' }} />
        <p style={{ marginTop: '16px', color: '#6B7280', fontSize: '0.9rem' }}>Cargando departamentos...</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', backgroundColor: '#F8F9FA' }}>
      <OrangeHeader
        icon={FolderTree}
        title="Departamentos y Categorías"
        subtitle="Árbol jerárquico de categorías · SEO integrado"
        actions={[
          { label: '← Volver', onClick: () => onNavigate('ecommerce') },
          { label: '+ Nueva Categoría', primary: true, onClick: handleNew },
        ]}
      />
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 22 }}>
          {[
            { label: 'Categorías raíz', value: departamentos.length, color: '#3B82F6' },
            { label: 'Total categorías', value: departamentos.length, color: ORANGE },
            { label: 'Productos catalogados', value: totalProds, color: '#10B981' },
            { label: 'Inactivas', value: inactivas, color: '#9CA3AF' },
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
            {filtered.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#9CA3AF' }}>
                {search ? 'No se encontraron departamentos' : 'No hay departamentos'}
              </div>
            ) : (
              filtered.map(d => <NodoDept key={d.id} dept={d} onEdit={handleEdit} />)
            )}
          </div>

          {/* SEO panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '18px' }}>
              <div style={{ fontWeight: '700', color: '#1A1A2E', marginBottom: 12, fontSize: '0.88rem' }}>🔍 SEO por Categoría</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {departamentos.map(d => {
                  const slug = d.nombre.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                  const icono = d.icono || '📁';
                  return (
                    <div key={d.id} style={{ padding: '10px', backgroundColor: '#F9FAFB', borderRadius: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                        <span>{icono}</span>
                        <span style={{ fontWeight: '600', fontSize: '0.83rem' }}>{d.nombre}</span>
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#9CA3AF', marginBottom: 6 }}>/{slug}</div>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#10B981', alignSelf: 'center' }} />
                        <span style={{ fontSize: '0.7rem', color: '#059669' }}>Meta title OK</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '18px' }}>
              <div style={{ fontWeight: '700', color: '#1A1A2E', marginBottom: 12, fontSize: '0.88rem' }}>📊 Distribución</div>
              {departamentos.map((d, i) => {
                const icono = d.icono || '📁';
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <span style={{ fontSize: '0.85rem' }}>{icono}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                        <span style={{ fontSize: '0.78rem', color: '#374151' }}>{d.nombre}</span>
                        <span style={{ fontSize: '0.78rem', fontWeight: '600', color: '#374151' }}>{d.conteo_total || 0}</span>
                      </div>
                      <div style={{ width: '100%', height: 5, backgroundColor: '#F3F4F6', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ width: `${totalProds > 0 ? ((d.conteo_total || 0) / totalProds) * 100 : 0}%`, height: '100%', backgroundColor: ORANGE, borderRadius: 3 }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      
      {modalOpen && (
        <ModalDepartamento
          dept={editingDept}
          onClose={() => { setModalOpen(false); setEditingDept(null); }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

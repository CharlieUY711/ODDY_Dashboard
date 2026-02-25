/* =====================================================
   MetodosEnvioView — Zonas y Tarifas de Entrega
   ===================================================== */
import React, { useState, useEffect } from 'react';
import { OrangeHeader } from '@/app/components/admin/OrangeHeader';
import type { MainSection } from '@/app/AdminDashboard';
import { api } from '@/app/services/supabaseApi';
import { MapPin, Truck, DollarSign, Plus, Edit2, Trash2, ChevronDown, ChevronRight, Loader2, AlertCircle } from 'lucide-react';

const ORANGE = '#FF6835';
interface Props { onNavigate: (s: MainSection) => void; }

interface MetodoEnvio {
  id: string;
  nombre: string;
  tipo: string;
  precio: number;
  config?: Record<string, unknown>;
  activo: boolean;
  created_at?: string;
}

export function MetodosEnvioView({ onNavigate }: Props) {
  const [metodos, setMetodos] = useState<MetodoEnvio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<Record<string, boolean>>({});
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadMetodos();
  }, []);

  const loadMetodos = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.checkout.getMetodosEnvio();
      if (res.ok && res.data) {
        const data = res.data as MetodoEnvio[];
        setMetodos(data);
        if (data.length > 0) {
          setExpanded(new Set([data[0].id]));
        }
      } else {
        setError(res.error || 'Error al cargar métodos de envío');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const toggleActivo = async (id: string, nuevoEstado: boolean) => {
    setUpdating(p => ({ ...p, [id]: true }));
    try {
      // Nota: La API actual no tiene endpoint para actualizar, pero podemos simularlo
      // En producción, necesitarías agregar api.checkout.updateMetodoEnvio(id, { activo: nuevoEstado })
      setMetodos(prev => prev.map(m => m.id === id ? { ...m, activo: nuevoEstado } : m));
      // Aquí iría la llamada real a la API cuando esté disponible
      // const res = await api.checkout.updateMetodoEnvio(id, { activo: nuevoEstado });
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al actualizar método');
      await loadMetodos(); // Recargar en caso de error
    } finally {
      setUpdating(p => ({ ...p, [id]: false }));
    }
  };

  const toggle = (id: string) => setExpanded(p => { const s = new Set(p); s.has(id) ? s.delete(id) : s.add(id); return s; });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', backgroundColor: '#F8F9FA' }}>
      <OrangeHeader
        icon={MapPin}
        title="Métodos de Envío"
        subtitle="Zonas geográficas · Tarifas por peso · Opciones de entrega"
        actions={[
          { label: '← Volver', onClick: () => onNavigate('sistema') },
          { label: '+ Nueva Zona', primary: true },
        ]}
      />
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 22 }}>
          {[
            { label: 'Métodos activos', value: metodos.filter(m => m.activo).length, color: '#10B981' },
            { label: 'Total métodos', value: metodos.length, color: ORANGE },
            { label: 'Tipos únicos', value: new Set(metodos.map(m => m.tipo)).size, color: '#3B82F6' },
            { label: 'Precio promedio', value: metodos.length > 0 ? `$${Math.round(metodos.reduce((sum, m) => sum + m.precio, 0) / metodos.length)}` : '$0', color: '#8B5CF6' },
          ].map((k, i) => (
            <div key={i} style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '18px 20px' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: k.color, lineHeight: 1 }}>{k.value}</div>
              <div style={{ fontSize: '0.75rem', color: '#6C757D', marginTop: 4 }}>{k.label}</div>
            </div>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div style={{ backgroundColor: '#FEE2E2', border: '1px solid #FCA5A5', borderRadius: '12px', padding: '12px 16px', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertCircle size={18} color="#DC2626" />
            <span style={{ fontSize: '0.85rem', color: '#DC2626' }}>{error}</span>
            <button 
              onClick={loadMetodos}
              style={{ marginLeft: 'auto', padding: '4px 12px', borderRadius: '6px', border: '1px solid #DC2626', backgroundColor: '#fff', color: '#DC2626', fontSize: '0.75rem', cursor: 'pointer' }}
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#9CA3AF' }}>
            <Loader2 size={32} color="#9CA3AF" style={{ marginBottom: 12, animation: 'spin 1s linear infinite' }} />
            <p style={{ margin: 0, fontSize: '0.9rem' }}>Cargando métodos de envío...</p>
          </div>
        ) : metodos.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#9CA3AF' }}>
            <Truck size={32} color="#E5E7EB" style={{ marginBottom: 12 }} />
            <p style={{ margin: 0, fontSize: '0.9rem' }}>No hay métodos de envío configurados</p>
          </div>
        ) : (
          /* Lista de métodos */
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {metodos.map(m => (
              <div key={m.id} style={{ backgroundColor: '#fff', borderRadius: '14px', border: `1px solid ${m.activo ? '#E5E7EB' : '#F3F4F6'}`, padding: '20px', opacity: m.activo ? 1 : 0.7 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
                  <div style={{ width: 48, height: 48, borderRadius: '12px', backgroundColor: `${ORANGE}14`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Truck size={24} color={ORANGE} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                      <span style={{ fontWeight: '800', color: '#1A1A2E', fontSize: '1rem' }}>{m.nombre}</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>
                      Tipo: {m.tipo} · Precio: ${m.precio.toLocaleString()}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <label style={{ position: 'relative', display: 'inline-block', width: 44, height: 24, cursor: updating[m.id] ? 'wait' : 'pointer', opacity: updating[m.id] ? 0.6 : 1 }}>
                      <input 
                        type="checkbox" 
                        checked={m.activo} 
                        onChange={() => toggleActivo(m.id, !m.activo)} 
                        disabled={updating[m.id]}
                        style={{ opacity: 0, width: 0, height: 0 }} 
                      />
                      <span style={{ position: 'absolute', inset: 0, borderRadius: 12, backgroundColor: m.activo ? '#10B981' : '#D1D5DB', transition: '0.3s' }} />
                      <span style={{ position: 'absolute', height: 18, width: 18, left: m.activo ? 23 : 3, bottom: 3, backgroundColor: '#fff', borderRadius: '50%', transition: '0.3s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
                    </label>
                    {updating[m.id] && (
                      <Loader2 size={16} color="#9CA3AF" style={{ animation: 'spin 1s linear infinite' }} />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

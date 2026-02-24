/* =====================================================
   OrquestadorView — Gestión de Clientes de la Plataforma
   Conectado a Supabase: qhnmxvexkizcsmivfuam (Orquestador.Core)
   ===================================================== */
import React, { useState, useEffect } from 'react';
import { OrangeHeader } from '@/app/components/admin/OrangeHeader';
import type { MainSection } from '@/app/AdminDashboard';
import {
  Plus, Settings, Globe, Database, Layers, CheckCircle,
  XCircle, ChevronDown, ChevronUp, Trash2, Edit, Eye,
  RefreshCw, Server, Package, Palette, Plug,
} from 'lucide-react';

const ORANGE = '#FF6835';

const SUPABASE_URL = 'https://qhnmxvexkizcsmivfuam.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFobm14dmV4a2l6Y3NtaXZmdWFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyMjEyODEsImV4cCI6MjA4Njc5NzI4MX0.Ifz4fJYldIGZFzhBK5PPxQeqdYzO2ZKNQ5uo8j2mYmM'; // reemplazar con la anon key real

interface Props { onNavigate: (s: MainSection) => void; }

interface Cliente {
  id: string;
  slug: string;
  nombre: string;
  dominio: string;
  activo: boolean;
  created_at: string;
}

interface ClienteConfig {
  id: string;
  cliente_id: string;
  shell: string;
  theme: Record<string, string>;
  modulos: string[];
  backend: Record<string, string>;
}

interface ModuloDisponible {
  id: string;
  slug: string;
  nombre: string;
  categoria: string;
  activo: boolean;
}

const categoriaColors: Record<string, { bg: string; color: string }> = {
  core:          { bg: '#EDE9FE', color: '#7C3AED' },
  ecommerce:     { bg: '#FEF3C7', color: '#D97706' },
  crm:           { bg: '#DBEAFE', color: '#2563EB' },
  erp:           { bg: '#D1FAE5', color: '#059669' },
  logistica:     { bg: '#FEE2E2', color: '#DC2626' },
  marketing:     { bg: '#FCE7F3', color: '#DB2777' },
  pagos:         { bg: '#E0F2FE', color: '#0284C7' },
  sistema:       { bg: '#F3F4F6', color: '#374151' },
  integraciones: { bg: '#F0FDF4', color: '#16A34A' },
  herramientas:  { bg: '#FFF7ED', color: '#EA580C' },
  gestion:       { bg: '#F5F3FF', color: '#6D28D9' },
  auth:          { bg: '#FDF4FF', color: '#9333EA' },
};

async function supabaseFetch(path: string, options?: RequestInit) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation',
      ...(options?.headers || {}),
    },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export function OrquestadorView({ onNavigate }: Props) {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [modulos, setModulos] = useState<ModuloDisponible[]>([]);
  const [configs, setConfigs] = useState<ClienteConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'clientes' | 'modulos' | 'nuevo'>('clientes');
  const [expandido, setExpandido] = useState<string | null>(null);

  // Form nuevo cliente
  const [form, setForm] = useState({
    slug: '', nombre: '', dominio: '', shell: 'DashboardShell',
    primaryColor: '#6366F1', supabaseUrl: '', supabaseKey: '',
    modulosSeleccionados: [] as string[],
  });
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => { cargarDatos(); }, []);

  async function cargarDatos() {
    setLoading(true);
    try {
      const [cls, mods, cfgs] = await Promise.all([
        supabaseFetch('clientes?select=*&order=created_at.desc'),
        supabaseFetch('modulos_disponibles?select=*&order=categoria,nombre'),
        supabaseFetch('cliente_config?select=*'),
      ]);
      setClientes(cls);
      setModulos(mods);
      setConfigs(cfgs);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function crearCliente() {
    if (!form.slug || !form.nombre) {
      setMensaje('Slug y nombre son obligatorios');
      return;
    }
    setGuardando(true);
    setMensaje('');
    try {
      // 1. Crear cliente
      const [cliente] = await supabaseFetch('clientes', {
        method: 'POST',
        body: JSON.stringify({
          slug: form.slug,
          nombre: form.nombre,
          dominio: form.dominio,
          activo: true,
        }),
      });
      // 2. Crear config
      await supabaseFetch('cliente_config', {
        method: 'POST',
        body: JSON.stringify({
          cliente_id: cliente.id,
          shell: form.shell,
          theme: {
            primary: form.primaryColor,
            nombre: form.nombre,
          },
          modulos: form.modulosSeleccionados,
          backend: {
            supabaseUrl: form.supabaseUrl,
            supabaseKey: form.supabaseKey,
          },
        }),
      });
      setMensaje(`✅ Cliente ${form.nombre} creado correctamente`);
      setForm({ slug: '', nombre: '', dominio: '', shell: 'DashboardShell', primaryColor: '#6366F1', supabaseUrl: '', supabaseKey: '', modulosSeleccionados: [] });
      await cargarDatos();
      setTab('clientes');
    } catch (e: any) {
      setMensaje(`❌ Error: ${e.message}`);
    } finally {
      setGuardando(false);
    }
  }

  async function toggleCliente(id: string, activo: boolean) {
    await supabaseFetch(`clientes?id=eq.${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ activo: !activo }),
    });
    await cargarDatos();
  }

  function toggleModulo(slug: string) {
    setForm(f => ({
      ...f,
      modulosSeleccionados: f.modulosSeleccionados.includes(slug)
        ? f.modulosSeleccionados.filter(m => m !== slug)
        : [...f.modulosSeleccionados, slug],
    }));
  }

  const modulosPorCategoria = modulos.reduce((acc, m) => {
    if (!acc[m.categoria]) acc[m.categoria] = [];
    acc[m.categoria].push(m);
    return acc;
  }, {} as Record<string, ModuloDisponible[]>);

  const getConfigCliente = (clienteId: string) =>
    configs.find(c => c.cliente_id === clienteId);

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', minHeight: '100vh', background: '#F8F9FA' }}>
      <OrangeHeader
        title="Orquestador"
        subtitle={`${clientes.length} clientes · ${modulos.length} módulos disponibles`}
        onNavigate={onNavigate}
      />

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, padding: '16px 20px 0', borderBottom: '1px solid #E5E7EB', background: '#fff' }}>
        {[
          { id: 'clientes', label: 'Clientes', icon: Globe },
          { id: 'modulos', label: 'Módulos', icon: Package },
          { id: 'nuevo', label: '+ Nuevo Cliente', icon: Plus },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id as any)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '10px 16px', border: 'none', background: 'none', cursor: 'pointer',
              borderBottom: tab === id ? `2px solid ${ORANGE}` : '2px solid transparent',
              color: tab === id ? ORANGE : '#6B7280',
              fontWeight: tab === id ? 600 : 400, fontSize: 14,
            }}
          >
            <Icon size={15} /> {label}
          </button>
        ))}
        <button
          onClick={cargarDatos}
          style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', padding: 8 }}
        >
          <RefreshCw size={16} />
        </button>
      </div>

      <div style={{ padding: 20 }}>

        {/* TAB: CLIENTES */}
        {tab === 'clientes' && (
          <div>
            {loading ? (
              <div style={{ textAlign: 'center', padding: 60, color: '#9CA3AF' }}>Cargando clientes...</div>
            ) : clientes.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 60 }}>
                <Globe size={48} color="#E5E7EB" style={{ margin: '0 auto 16px' }} />
                <p style={{ color: '#9CA3AF' }}>No hay clientes registrados todavía</p>
                <button onClick={() => setTab('nuevo')} style={{ marginTop: 12, padding: '8px 20px', background: ORANGE, color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
                  Crear primer cliente
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {clientes.map(cliente => {
                  const config = getConfigCliente(cliente.id);
                  const abierto = expandido === cliente.id;
                  return (
                    <div key={cliente.id} style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E7EB', overflow: 'hidden' }}>
                      {/* Header cliente */}
                      <div
                        style={{ display: 'flex', alignItems: 'center', padding: '16px 20px', cursor: 'pointer', gap: 12 }}
                        onClick={() => setExpandido(abierto ? null : cliente.id)}
                      >
                        <div style={{
                          width: 40, height: 40, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
                          background: config?.theme?.primary || ORANGE, color: '#fff', fontWeight: 700, fontSize: 16,
                        }}>
                          {cliente.nombre.charAt(0)}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, color: '#111', fontSize: 15 }}>{cliente.nombre}</div>
                          <div style={{ color: '#9CA3AF', fontSize: 13 }}>{cliente.dominio || 'Sin dominio'} · slug: {cliente.slug}</div>
                        </div>
                        <span style={{
                          padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                          background: cliente.activo ? '#D1FAE5' : '#FEE2E2',
                          color: cliente.activo ? '#059669' : '#DC2626',
                        }}>
                          {cliente.activo ? 'Activo' : 'Inactivo'}
                        </span>
                        {abierto ? <ChevronUp size={16} color="#9CA3AF" /> : <ChevronDown size={16} color="#9CA3AF" />}
                      </div>

                      {/* Detalle expandido */}
                      {abierto && config && (
                        <div style={{ borderTop: '1px solid #F3F4F6', padding: '16px 20px', background: '#FAFAFA' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                            {/* Shell */}
                            <div style={{ background: '#fff', borderRadius: 8, padding: 12, border: '1px solid #E5E7EB' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#6B7280', fontSize: 12, marginBottom: 6 }}>
                                <Layers size={13} /> SHELL
                              </div>
                              <div style={{ fontWeight: 600, fontSize: 14 }}>{config.shell}</div>
                            </div>
                            {/* Theme */}
                            <div style={{ background: '#fff', borderRadius: 8, padding: 12, border: '1px solid #E5E7EB' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#6B7280', fontSize: 12, marginBottom: 6 }}>
                                <Palette size={13} /> THEME
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <div style={{ width: 20, height: 20, borderRadius: 4, background: config.theme?.primary || '#ccc' }} />
                                <span style={{ fontWeight: 600, fontSize: 14 }}>{config.theme?.primary || 'Sin color'}</span>
                              </div>
                            </div>
                            {/* Backend */}
                            <div style={{ background: '#fff', borderRadius: 8, padding: 12, border: '1px solid #E5E7EB' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#6B7280', fontSize: 12, marginBottom: 6 }}>
                                <Database size={13} /> BACKEND
                              </div>
                              <div style={{ fontWeight: 600, fontSize: 12, wordBreak: 'break-all', color: config.backend?.supabaseUrl ? '#059669' : '#9CA3AF' }}>
                                {config.backend?.supabaseUrl ? '✓ Supabase configurado' : 'Sin backend'}
                              </div>
                            </div>
                          </div>

                          {/* Módulos */}
                          <div style={{ marginTop: 12 }}>
                            <div style={{ color: '#6B7280', fontSize: 12, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                              <Package size={13} /> MÓDULOS ACTIVOS ({config.modulos?.length || 0})
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                              {(config.modulos || []).map(m => (
                                <span key={m} style={{ padding: '3px 10px', background: '#EDE9FE', color: '#7C3AED', borderRadius: 20, fontSize: 12 }}>
                                  {m}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Acciones */}
                          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                            <button
                              onClick={() => toggleCliente(cliente.id, cliente.activo)}
                              style={{
                                padding: '7px 14px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13,
                                background: cliente.activo ? '#FEE2E2' : '#D1FAE5',
                                color: cliente.activo ? '#DC2626' : '#059669',
                              }}
                            >
                              {cliente.activo ? 'Desactivar' : 'Activar'}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB: MÓDULOS */}
        {tab === 'modulos' && (
          <div>
            <div style={{ marginBottom: 16, color: '#6B7280', fontSize: 14 }}>
              {modulos.length} módulos disponibles en la plataforma
            </div>
            {Object.entries(modulosPorCategoria).map(([cat, mods]) => {
              const colors = categoriaColors[cat] || { bg: '#F3F4F6', color: '#374151' };
              return (
                <div key={cat} style={{ marginBottom: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                    <span style={{ padding: '3px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700, background: colors.bg, color: colors.color }}>
                      {cat.toUpperCase()}
                    </span>
                    <span style={{ color: '#9CA3AF', fontSize: 13 }}>{mods.length} módulos</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8 }}>
                    {mods.map(m => (
                      <div key={m.id} style={{
                        background: '#fff', borderRadius: 8, padding: '10px 14px',
                        border: '1px solid #E5E7EB', fontSize: 13,
                      }}>
                        <div style={{ fontWeight: 600, color: '#111' }}>{m.nombre}</div>
                        <div style={{ color: '#9CA3AF', fontSize: 11, marginTop: 2 }}>{m.slug}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB: NUEVO CLIENTE */}
        {tab === 'nuevo' && (
          <div style={{ maxWidth: 700 }}>
            <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E7EB', padding: 24 }}>
              <h3 style={{ margin: '0 0 20px', fontSize: 18, fontWeight: 700 }}>Registrar nuevo cliente</h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Nombre *</label>
                  <input
                    value={form.nombre}
                    onChange={e => setForm(f => ({ ...f, nombre: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') }))}
                    placeholder="ODDY Market"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #D1D5DB', fontSize: 14, boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Slug *</label>
                  <input
                    value={form.slug}
                    onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                    placeholder="oddy-market"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #D1D5DB', fontSize: 14, boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Dominio</label>
                  <input
                    value={form.dominio}
                    onChange={e => setForm(f => ({ ...f, dominio: e.target.value }))}
                    placeholder="dashboard.oddy.com.uy"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #D1D5DB', fontSize: 14, boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Color primario</label>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <input type="color" value={form.primaryColor} onChange={e => setForm(f => ({ ...f, primaryColor: e.target.value }))}
                      style={{ width: 40, height: 38, borderRadius: 8, border: '1px solid #D1D5DB', cursor: 'pointer' }} />
                    <input value={form.primaryColor} onChange={e => setForm(f => ({ ...f, primaryColor: e.target.value }))}
                      style={{ flex: 1, padding: '9px 12px', borderRadius: 8, border: '1px solid #D1D5DB', fontSize: 14 }} />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Supabase URL</label>
                  <input
                    value={form.supabaseUrl}
                    onChange={e => setForm(f => ({ ...f, supabaseUrl: e.target.value }))}
                    placeholder="https://xxx.supabase.co"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #D1D5DB', fontSize: 14, boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Supabase Anon Key</label>
                  <input
                    value={form.supabaseKey}
                    onChange={e => setForm(f => ({ ...f, supabaseKey: e.target.value }))}
                    placeholder="eyJ..."
                    type="password"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #D1D5DB', fontSize: 14, boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              {/* Selección de módulos */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 10 }}>
                  Módulos habilitados ({form.modulosSeleccionados.length} seleccionados)
                </label>
                {Object.entries(modulosPorCategoria).map(([cat, mods]) => {
                  const colors = categoriaColors[cat] || { bg: '#F3F4F6', color: '#374151' };
                  return (
                    <div key={cat} style={{ marginBottom: 12 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: colors.color, marginBottom: 6 }}>{cat.toUpperCase()}</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {mods.map(m => {
                          const sel = form.modulosSeleccionados.includes(m.slug);
                          return (
                            <button
                              key={m.slug}
                              onClick={() => toggleModulo(m.slug)}
                              style={{
                                padding: '4px 12px', borderRadius: 20, fontSize: 12, cursor: 'pointer',
                                border: sel ? `2px solid ${colors.color}` : '2px solid #E5E7EB',
                                background: sel ? colors.bg : '#fff',
                                color: sel ? colors.color : '#6B7280',
                                fontWeight: sel ? 600 : 400,
                              }}
                            >
                              {m.nombre}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {mensaje && (
                <div style={{ padding: '10px 14px', borderRadius: 8, marginBottom: 16, background: mensaje.includes('✅') ? '#D1FAE5' : '#FEE2E2', color: mensaje.includes('✅') ? '#065F46' : '#991B1B', fontSize: 14 }}>
                  {mensaje}
                </div>
              )}

              <button
                onClick={crearCliente}
                disabled={guardando}
                style={{
                  width: '100%', padding: '12px', borderRadius: 10, border: 'none',
                  background: guardando ? '#D1D5DB' : ORANGE, color: '#fff',
                  fontWeight: 700, fontSize: 15, cursor: guardando ? 'not-allowed' : 'pointer',
                }}
              >
                {guardando ? 'Creando cliente...' : 'Crear Cliente'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

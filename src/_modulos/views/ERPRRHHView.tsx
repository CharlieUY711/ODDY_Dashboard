/* =====================================================
   ERPRRHHView — Recursos Humanos
   ===================================================== */
import React, { useState, useMemo } from 'react';
import { OrangeHeader } from '@/app/components/admin/OrangeHeader';
import type { MainSection } from '@/app/AdminDashboard';
import {
  UserCheck, Users, Clock, DollarSign, Search,
  CheckCircle, AlertCircle, Plus, Download,
  Mail, Phone, Calendar, TrendingUp, Briefcase,
} from 'lucide-react';

const ORANGE = '#FF6835';
interface Props { onNavigate: (s: MainSection) => void; }

type EstadoEmp = 'activo' | 'licencia' | 'baja';

interface Empleado {
  id: number;
  nombre: string;
  avatar: string;
  cargo: string;
  departamento: string;
  email: string;
  telefono: string;
  ingreso: string;
  salario: number;
  estado: EstadoEmp;
  color: string;
}

const empleados: Empleado[] = [
  { id: 1, nombre: 'Ana García', avatar: 'AG', cargo: 'Product Manager', departamento: 'Producto', email: 'ana@company.com', telefono: '+598 91 111 001', ingreso: '2023-03-15', salario: 85000, estado: 'activo', color: ORANGE },
  { id: 2, nombre: 'Carlos Méndez', avatar: 'CM', cargo: 'Full Stack Dev', departamento: 'Tecnología', email: 'carlos@company.com', telefono: '+598 91 111 002', ingreso: '2022-08-01', salario: 92000, estado: 'activo', color: '#3B82F6' },
  { id: 3, nombre: 'María Torres', avatar: 'MT', cargo: 'UX/UI Designer', departamento: 'Diseño', email: 'maria@company.com', telefono: '+598 91 111 003', ingreso: '2024-01-10', salario: 72000, estado: 'activo', color: '#EC4899' },
  { id: 4, nombre: 'Diego López', avatar: 'DL', cargo: 'Marketing Lead', departamento: 'Marketing', email: 'diego@company.com', telefono: '+598 91 111 004', ingreso: '2021-05-20', salario: 78000, estado: 'activo', color: '#8B5CF6' },
  { id: 5, nombre: 'Valentina Cruz', avatar: 'VC', cargo: 'Sales Executive', departamento: 'Ventas', email: 'vale@company.com', telefono: '+598 91 111 005', ingreso: '2023-09-01', salario: 65000, estado: 'activo', color: '#10B981' },
  { id: 6, nombre: 'Roberto Silva', avatar: 'RS', cargo: 'DevOps Engineer', departamento: 'Tecnología', email: 'roberto@company.com', telefono: '+598 91 111 006', ingreso: '2022-02-14', salario: 95000, estado: 'activo', color: '#0EA5E9' },
  { id: 7, nombre: 'Laura Pérez', avatar: 'LP', cargo: 'Contadora', departamento: 'Finanzas', email: 'laura@company.com', telefono: '+598 91 111 007', ingreso: '2020-07-01', salario: 68000, estado: 'licencia', color: '#F59E0B' },
  { id: 8, nombre: 'Juan Vargas', avatar: 'JV', cargo: 'Customer Support', departamento: 'Soporte', email: 'juan@company.com', telefono: '+598 91 111 008', ingreso: '2024-03-01', salario: 52000, estado: 'activo', color: '#14B8A6' },
  { id: 9, nombre: 'Sofía Ramírez', avatar: 'SR', cargo: 'Data Analyst', departamento: 'Tecnología', email: 'sofia@company.com', telefono: '+598 91 111 009', ingreso: '2023-11-15', salario: 82000, estado: 'activo', color: '#6366F1' },
  { id: 10, nombre: 'Andrés Morales', avatar: 'AM', cargo: 'Logística Coord.', departamento: 'Operaciones', email: 'andres@company.com', telefono: '+598 91 111 010', ingreso: '2021-12-01', salario: 60000, estado: 'baja', color: '#6B7280' },
];

const estadoConfig: Record<EstadoEmp, { label: string; color: string; bg: string }> = {
  activo: { label: 'Activo', color: '#059669', bg: '#D1FAE5' },
  licencia: { label: 'Licencia', color: '#D97706', bg: '#FEF3C7' },
  baja: { label: 'Baja', color: '#6B7280', bg: '#F3F4F6' },
};

const deptos = ['Todos', ...Array.from(new Set(empleados.map(e => e.departamento)))];

export function ERPRRHHView({ onNavigate }: Props) {
  const [search, setSearch] = useState('');
  const [deptoFilter, setDeptoFilter] = useState('Todos');
  const [estadoFilter, setEstadoFilter] = useState('Todos');

  const activos = empleados.filter(e => e.estado === 'activo').length;
  const masaNominal = empleados.filter(e => e.estado === 'activo').reduce((a, e) => a + e.salario, 0);

  const filtered = useMemo(() => {
    return empleados.filter(e => {
      const matchSearch = e.nombre.toLowerCase().includes(search.toLowerCase())
        || e.cargo.toLowerCase().includes(search.toLowerCase());
      const matchDepto = deptoFilter === 'Todos' || e.departamento === deptoFilter;
      const matchEstado = estadoFilter === 'Todos' || e.estado === estadoFilter;
      return matchSearch && matchDepto && matchEstado;
    });
  }, [search, deptoFilter, estadoFilter]);

  const kpis = [
    { label: 'Total Empleados', value: `${empleados.length}`, icon: Users, color: '#3B82F6' },
    { label: 'Activos', value: `${activos}`, icon: CheckCircle, color: '#10B981' },
    { label: 'En Licencia', value: `${empleados.filter(e => e.estado === 'licencia').length}`, icon: Clock, color: '#D97706' },
    { label: 'Masa Salarial', value: `$${(masaNominal / 1000).toFixed(0)}k`, icon: DollarSign, color: ORANGE },
  ];

  // Distribución por departamento
  const deptoCounts = deptos.slice(1).map(d => ({
    nombre: d,
    count: empleados.filter(e => e.departamento === d).length,
    color: empleados.find(e => e.departamento === d)?.color || '#6B7280',
  }));
  const maxCount = Math.max(...deptoCounts.map(d => d.count));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', backgroundColor: '#F8F9FA' }}>
      <OrangeHeader
        icon={UserCheck}
        title="Recursos Humanos"
        subtitle="Empleados, nómina, asistencia y legajos"
        actions={[
          { label: '← Volver', onClick: () => onNavigate('gestion') },
          { label: '+ Nuevo Empleado', primary: true },
        ]}
      />

      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>

        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '20px' }}>
          {kpis.map((k, i) => (
            <div key={i} style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: '10px', backgroundColor: `${k.color}14`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <k.icon size={19} color={k.color} strokeWidth={2} />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '0.72rem', color: '#6B7280' }}>{k.label}</p>
                <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: '800', color: '#111827', lineHeight: 1 }}>{k.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '16px', marginBottom: '20px' }}>
          {/* Filtros + Tabla */}
          <div>
            <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid #F0F0F0', display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, backgroundColor: '#F9FAFB', borderRadius: '8px', border: '1px solid #E5E7EB', padding: '6px 12px', flex: 1, minWidth: 160 }}>
                  <Search size={13} color="#9CA3AF" />
                  <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Buscar por nombre o cargo..."
                    style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.8rem', color: '#374151', width: '100%' }}
                  />
                </div>
                <select
                  value={deptoFilter}
                  onChange={e => setDeptoFilter(e.target.value)}
                  style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '0.78rem', color: '#374151', backgroundColor: '#F9FAFB', outline: 'none' }}
                >
                  {deptos.map(d => <option key={d}>{d}</option>)}
                </select>
                <select
                  value={estadoFilter}
                  onChange={e => setEstadoFilter(e.target.value)}
                  style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '0.78rem', color: '#374151', backgroundColor: '#F9FAFB', outline: 'none' }}
                >
                  {['Todos', 'activo', 'licencia', 'baja'].map(v => <option key={v}>{v}</option>)}
                </select>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                    {['Empleado', 'Cargo', 'Depto.', 'Ingreso', 'Salario', 'Estado'].map(h => (
                      <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '0.7rem', fontWeight: '700', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((e, i) => {
                    const ec = estadoConfig[e.estado];
                    const antiguedad = Math.floor((new Date().getTime() - new Date(e.ingreso).getTime()) / (1000 * 60 * 60 * 24 * 365));
                    return (
                      <tr key={e.id}
                        style={{ borderBottom: i < filtered.length - 1 ? '1px solid #F3F4F6' : 'none' }}
                        onMouseEnter={ev => (ev.currentTarget as HTMLTableRowElement).style.backgroundColor = '#F9FAFB'}
                        onMouseLeave={ev => (ev.currentTarget as HTMLTableRowElement).style.backgroundColor = ''}
                      >
                        <td style={{ padding: '12px 14px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ width: 34, height: 34, borderRadius: '50%', backgroundColor: e.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <span style={{ fontSize: '0.65rem', fontWeight: '800', color: '#fff' }}>{e.avatar}</span>
                            </div>
                            <div>
                              <p style={{ margin: 0, fontSize: '0.83rem', fontWeight: '700', color: '#1F2937' }}>{e.nombre}</p>
                              <p style={{ margin: 0, fontSize: '0.68rem', color: '#9CA3AF' }}>{e.email}</p>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{ fontSize: '0.8rem', color: '#374151' }}>{e.cargo}</span>
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{ fontSize: '0.75rem', backgroundColor: `${e.color}14`, color: e.color, padding: '2px 7px', borderRadius: '5px', fontWeight: '600' }}>{e.departamento}</span>
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <p style={{ margin: 0, fontSize: '0.75rem', color: '#374151' }}>{e.ingreso}</p>
                          <p style={{ margin: 0, fontSize: '0.68rem', color: '#9CA3AF' }}>{antiguedad}a</p>
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1F2937' }}>${e.salario.toLocaleString()}</span>
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{ fontSize: '0.7rem', fontWeight: '700', color: ec.color, backgroundColor: ec.bg, padding: '2px 8px', borderRadius: '6px' }}>{ec.label}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Panel derecho: distribución por depto */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '18px 20px' }}>
              <h3 style={{ margin: '0 0 14px', fontSize: '0.88rem', fontWeight: '700', color: '#111827' }}>Por Departamento</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {deptoCounts.map((d, i) => (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: '0.75rem', color: '#374151', fontWeight: '600' }}>{d.nombre}</span>
                      <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>{d.count} personas</span>
                    </div>
                    <div style={{ height: 6, backgroundColor: '#F3F4F6', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${(d.count / maxCount) * 100}%`, height: '100%', backgroundColor: d.color, borderRadius: '3px' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '18px 20px' }}>
              <h3 style={{ margin: '0 0 14px', fontSize: '0.88rem', fontWeight: '700', color: '#111827' }}>Próximos eventos</h3>
              {[
                { emoji: '🎂', texto: 'Cumpleaños Laura Pérez', fecha: 'Mar 02' },
                { emoji: '📅', texto: 'Evaluación Q1', fecha: 'Mar 15' },
                { emoji: '📋', texto: 'Liquidación de sueldos', fecha: 'Feb 28' },
                { emoji: '🏖️', texto: 'Licencia: Diego López', fecha: 'Mar 01–10' },
              ].map((ev, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center', paddingBottom: i < 3 ? '10px' : 0, marginBottom: i < 3 ? '10px' : 0, borderBottom: i < 3 ? '1px solid #F3F4F6' : 'none' }}>
                  <span style={{ fontSize: '1.1rem' }}>{ev.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontSize: '0.78rem', color: '#374151' }}>{ev.texto}</p>
                  </div>
                  <span style={{ fontSize: '0.7rem', color: ORANGE, fontWeight: '700' }}>{ev.fecha}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

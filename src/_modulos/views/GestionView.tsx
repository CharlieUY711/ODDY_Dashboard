import React from 'react';
import { HubView, HubCardDef, HubComingSoonItem } from '@/app/components/admin/HubView';
import type { MainSection } from '@/app/AdminDashboard';
import {
  Database, Package, FolderTree, ShoppingBag, User, Building2,
  Receipt, ClipboardList, Users, UserCheck, FolderKanban,
  TrendingUp, BarChart2, CheckCircle, Tag, AlertCircle, Clock,
  Layers, BookOpen, DollarSign, ScanLine,
} from 'lucide-react';

interface Props { onNavigate: (s: MainSection) => void; }

export function GestionView({ onNavigate }: Props) {
  const nav = (s: MainSection) => () => onNavigate(s);

  const cards: HubCardDef[] = [
    {
      id: 'pos', icon: ScanLine, onClick: nav('pos'),
      gradient: 'linear-gradient(135deg, #FF6835 0%, #e04e20 100%)', color: '#FF6835',
      badge: 'Ventas · Caja', label: 'Punto de Venta (POS)',
      description: 'Terminal de caja estilo supermercado. Búsqueda de productos, carrito, descuentos, métodos de pago y ticket imprimible.',
      stats: [{ icon: ScanLine, value: '—', label: 'Ventas hoy' }, { icon: DollarSign, value: '—', label: 'Total hoy' }, { icon: Receipt, value: '—', label: 'Ticket prom.' }],
    },
    {
      id: 'erp-inventario', icon: Package, onClick: nav('erp-inventario'),
      gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)', color: '#F59E0B',
      badge: 'Catálogo', label: 'Catálogo de Artículos',
      description: 'Gestión de productos, stock, lotes, variantes y movimientos de inventario en tiempo real.',
      stats: [{ icon: Package, value: '—', label: 'Productos' }, { icon: Tag, value: '—', label: 'Sin stock' }, { icon: BarChart2, value: '—', label: 'Categorías' }],
    },
    {
      id: 'departamentos', icon: FolderTree, onClick: nav('departamentos'),
      gradient: 'linear-gradient(135deg, #14B8A6 0%, #0F766E 100%)', color: '#14B8A6',
      badge: 'Estructura', label: 'Departamentos y Categorías',
      description: 'Árbol jerárquico de departamentos, categorías y subcategorías con iconos y SEO integrado.',
      stats: [{ icon: FolderTree, value: '—', label: 'Deptos' }, { icon: Tag, value: '—', label: 'Categorías' }, { icon: CheckCircle, value: '—', label: 'Activos' }],
    },
    {
      id: 'clientes', icon: ShoppingBag, onClick: nav('clientes'),
      gradient: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)', color: '#3B82F6',
      badge: 'Clientes', label: 'Clientes',
      description: 'Compradores con historial de pedidos, saldo, etiquetas y segmentación por comportamiento.',
      stats: [{ icon: Users, value: '—', label: 'Total' }, { icon: TrendingUp, value: '—', label: 'Activos' }, { icon: ShoppingBag, value: '—', label: 'Nuevos' }],
    },
    {
      id: 'personas', icon: User, onClick: nav('personas'),
      gradient: 'linear-gradient(135deg, #6366F1 0%, #4338CA 100%)', color: '#6366F1',
      badge: 'Base de datos', label: 'Personas',
      description: 'Base de personas naturales del sistema. Perfiles unificados con roles y vinculaciones.',
      stats: [{ icon: User, value: '—', label: 'Registradas' }, { icon: CheckCircle, value: '—', label: 'Activas' }, { icon: Users, value: '—', label: 'Con roles' }],
    },
    {
      id: 'organizaciones', icon: Building2, onClick: nav('organizaciones'),
      gradient: 'linear-gradient(135deg, #FF6835 0%, #e04e20 100%)', color: '#FF6835',
      badge: 'Empresas', label: 'Organizaciones',
      description: 'Empresas, cooperativas y entidades registradas con jerarquía, contactos y documentos.',
      stats: [{ icon: Building2, value: '—', label: 'Registradas' }, { icon: CheckCircle, value: '—', label: 'Activas' }, { icon: Users, value: '—', label: 'Contactos' }],
    },
    {
      id: 'erp-facturacion', icon: Receipt, onClick: nav('erp-facturacion'),
      gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', color: '#10B981',
      badge: 'Finanzas', label: 'Facturación',
      description: 'Emisión de facturas, comprobantes y cobros. Historial completo con estado de pago.',
      stats: [{ icon: Receipt, value: '—', label: 'Emitidas' }, { icon: Clock, value: '—', label: 'Pendientes' }, { icon: DollarSign, value: '—', label: 'Cobradas' }],
    },
    {
      id: 'erp-compras', icon: ClipboardList, onClick: nav('erp-compras'),
      gradient: 'linear-gradient(135deg, #F97316 0%, #C2410C 100%)', color: '#F97316',
      badge: 'Compras · Proveedores', label: 'Compras',
      description: 'Órdenes de compra, gestión de proveedores, recepción de mercadería y control de costos.',
      stats: [{ icon: ClipboardList, value: '—', label: 'OC activas' }, { icon: AlertCircle, value: '—', label: 'Pendientes' }, { icon: Users, value: '—', label: 'Proveedores' }],
    },
    {
      id: 'erp-crm', icon: Users, onClick: nav('erp-crm'),
      gradient: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)', color: '#8B5CF6',
      badge: 'CRM', label: 'CRM',
      description: 'Contactos, pipeline de ventas Kanban y actividades del equipo con vista por etapa.',
      stats: [{ icon: Users, value: '8', label: 'Contactos' }, { icon: TrendingUp, value: '$1M', label: 'Pipeline' }, { icon: CheckCircle, value: '2', label: 'Cerrados' }],
    },
    {
      id: 'erp-rrhh', icon: UserCheck, onClick: nav('erp-rrhh'),
      gradient: 'linear-gradient(135deg, #EC4899 0%, #BE185D 100%)', color: '#EC4899',
      badge: 'RRHH', label: 'Recursos Humanos',
      description: 'Empleados, nómina, asistencia y gestión de personal con legajos y documentos.',
      stats: [{ icon: UserCheck, value: '—', label: 'Empleados' }, { icon: CheckCircle, value: '—', label: 'Activos' }, { icon: Clock, value: '—', label: 'Ausencias' }],
    },
    {
      id: 'proyectos', icon: FolderKanban, onClick: nav('proyectos'),
      gradient: 'linear-gradient(135deg, #0EA5E9 0%, #0369A1 100%)', color: '#0EA5E9',
      badge: 'Proyectos · Kanban', label: 'Proyectos',
      description: 'Tablero Kanban, tareas, asignaciones y seguimiento de proyectos internos y externos.',
      stats: [{ icon: FolderKanban, value: '—', label: 'Proyectos' }, { icon: Clock, value: '—', label: 'En curso' }, { icon: CheckCircle, value: '—', label: 'Completados' }],
    },
  ];

  const comingSoon: HubComingSoonItem[] = [
    { icon: Layers,   label: 'ERP Central',  desc: 'Sistema empresarial integrado completo' },
    { icon: BookOpen, label: 'Contabilidad', desc: 'Plan de cuentas, asientos y balances'    },
  ];

  return (
    <HubView
      hubIcon={Database}
      title="Gestión"
      subtitle="ERP · Base de Personas · Organizaciones · CRM · RRHH · Proyectos"
      sections={[{ cards }]}
      comingSoon={comingSoon}
    />
  );
}

import React from 'react';
import { HubView, HubCardDef, HubComingSoonItem } from '@/app/components/admin/HubView';
import type { MainSection } from '@/app/AdminDashboard';
import {
  Settings, Sparkles, CreditCard, Truck, Plug, CheckSquare,
  Activity, Shield, BarChart2, Eye, Clock, BookOpen,
  Box, DollarSign, Monitor, Zap, TrendingUp, LogIn, Users,
  LayoutDashboard, UserCircle, Lock,
} from 'lucide-react';

interface Props { onNavigate: (s: MainSection) => void; }

export function SistemaView({ onNavigate }: Props) {
  const nav = (s: MainSection) => () => onNavigate(s);

  const cards: HubCardDef[] = [
    {
      id: 'diseno', icon: Sparkles, onClick: nav('diseno'),
      gradient: 'linear-gradient(135deg, #FF6835 0%, #e04e20 100%)', color: '#FF6835',
      badge: 'UI · Visual', label: 'Diseño & Pruebas',
      description: 'Espacio de diseño y pruebas visuales. Módulos, departamentos, artículos y herramientas en vista previa.',
      stats: [{ icon: Monitor, value: '4', label: 'Vistas' }, { icon: Sparkles, value: '5', label: 'Paleta' }, { icon: Eye, value: '—', label: 'Previews' }],
    },
    {
      id: 'metodos-pago', icon: CreditCard, onClick: nav('metodos-pago'),
      gradient: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)', color: '#8B5CF6',
      badge: 'Pagos · Cobros', label: 'Métodos de Pago',
      description: 'Configuración de pasarelas, transferencias y formas de cobro habilitadas para el checkout.',
      stats: [{ icon: CreditCard, value: '—', label: 'Métodos' }, { icon: Zap, value: '—', label: 'Activos' }, { icon: TrendingUp, value: '—', label: 'Cobros/día' }],
    },
    {
      id: 'metodos-envio', icon: Truck, onClick: nav('metodos-envio'),
      gradient: 'linear-gradient(135deg, #EC4899 0%, #BE185D 100%)', color: '#EC4899',
      badge: 'Envío · Zonas', label: 'Métodos de Envío',
      description: 'Configuración de zonas, tarifas y opciones de entrega habilitadas para los pedidos.',
      stats: [{ icon: Truck, value: '—', label: 'Métodos' }, { icon: Zap, value: '—', label: 'Activos' }, { icon: Shield, value: '—', label: 'Zonas' }],
    },
    {
      id: 'integraciones', icon: Plug, onClick: nav('integraciones'),
      gradient: 'linear-gradient(135deg, #14B8A6 0%, #0F766E 100%)', color: '#14B8A6',
      badge: 'Conectores', label: 'Integraciones',
      description: 'RRSS, Mercado Libre, pagos, logística y más. 65 proveedores disponibles en 6 módulos.',
      stats: [{ icon: Plug, value: '6', label: 'Módulos' }, { icon: Zap, value: '1', label: 'Conectadas' }, { icon: Shield, value: '65', label: 'Disponibles' }],
    },
    {
      id: 'checklist', icon: CheckSquare, onClick: nav('checklist'),
      gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)', color: '#F59E0B',
      badge: 'Roadmap · Progreso', label: 'Checklist & Roadmap',
      description: 'Estado de todos los módulos y progreso de Charlie. Cola de ejecución y auditoría del manifest.',
      stats: [{ icon: CheckSquare, value: '—', label: 'Módulos' }, { icon: TrendingUp, value: '—', label: 'Progreso' }, { icon: Clock, value: '—', label: 'Pendientes' }],
    },
    {
      id: 'auth-registro', icon: LogIn, onClick: nav('auth-registro'),
      gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', color: '#10B981',
      badge: 'Auth · Supabase', label: 'Registro y Login',
      description: 'Módulo de autenticación completo: Login, registro, recuperación, OAuth (Google, Meta, GitHub). Vista previa + test en vivo.',
      stats: [{ icon: Users, value: '—', label: 'Usuarios' }, { icon: Shield, value: '4', label: 'Providers' }, { icon: Zap, value: 'JWT', label: 'Tokens' }],
    },
    {
      id: 'dashboard-admin', icon: LayoutDashboard, onClick: nav('dashboard-admin'),
      gradient: 'linear-gradient(135deg, #FF6835 0%, #ff8c42 100%)', color: '#FF6835',
      badge: 'Admin · Sistema', label: 'Dashboard de Admin',
      description: 'Panel de administración: usuarios por rol, estado de servicios, alertas del sistema y actividad de administración.',
      stats: [{ icon: Shield, value: '5', label: 'Roles' }, { icon: Activity, value: '6', label: 'Servicios' }, { icon: Users, value: '153', label: 'Usuarios' }],
    },
    {
      id: 'dashboard-usuario', icon: UserCircle, onClick: nav('dashboard-usuario'),
      gradient: 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)', color: '#7C3AED',
      badge: 'Roles · Personalizado', label: 'Dashboard de Usuario',
      description: 'Vista personalizada según el rol del usuario: KPIs, módulos accesibles, actividad reciente. Simulador de 5 roles.',
      stats: [{ icon: UserCircle, value: '5', label: 'Roles' }, { icon: Eye, value: '—', label: 'Módulos/rol' }, { icon: Activity, value: 'Live', label: 'Simulador' }],
    },
    {
      id: 'config-vistas', icon: Lock, onClick: nav('config-vistas'),
      gradient: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)', color: '#3B82F6',
      badge: 'Permisos · Granular', label: 'Config. de Vistas por Rol',
      description: 'Define qué puede ver y hacer cada rol. Toggles granulares por módulo y sub-acción. Pasarelas, integraciones y más.',
      stats: [{ icon: Users, value: '5', label: 'Roles' }, { icon: Lock, value: '7', label: 'Grupos' }, { icon: Shield, value: '40+', label: 'Permisos' }],
    },
    {
      id: 'documentacion', icon: BookOpen, onClick: nav('documentacion'),
      gradient: 'linear-gradient(135deg, #6B7280 0%, #374151 100%)', color: '#6B7280',
      badge: 'Docs · Versiones', label: 'Documentación',
      description: 'Manual de usuario y documentación técnica editable. Control de versiones, historial de cambios. Nivel 1 de auto-actualización.',
      stats: [{ icon: BookOpen, value: '5', label: 'Sec. usuario' }, { icon: BarChart2, value: '4', label: 'Sec. técnica' }, { icon: Clock, value: 'v1.5', label: 'Versión' }],
    },
  ];

  const comingSoon: HubComingSoonItem[] = [
    { icon: Box,        label: 'Module Marketplace', desc: 'Módulos enterprise portables'          },
    { icon: Activity,   label: 'Diagnóstico Backend', desc: 'Estado de servicios backend'          },
    { icon: DollarSign, label: 'Gen. Presupuestos',   desc: 'Presupuestos para clientes'           },
    { icon: Shield,     label: 'Auditoría Sistema',   desc: 'Evaluación de funcionalidades'        },
    { icon: BarChart2,  label: 'Analíticas',          desc: 'Reportes y métricas avanzadas'        },
  ];

  return (
    <HubView
      hubIcon={Settings}
      title="Sistema"
      subtitle="Configuración · Integraciones · Diseño · Auditoría · Roadmap · Documentación"
      sections={[{ cards }]}
      comingSoon={comingSoon}
    />
  );
}

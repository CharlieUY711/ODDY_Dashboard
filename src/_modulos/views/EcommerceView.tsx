import React from 'react';
import { HubView, HubCardDef, HubQuickLink, HubComingSoonItem } from '@/app/components/admin/HubView';
import type { MainSection } from '@/app/AdminDashboard';
import {
  ShoppingCart, DollarSign, Truck, Package, FolderTree, ShoppingBag,
  RefreshCw, CreditCard, TrendingUp, Users, Clock, CheckCircle,
  AlertCircle, BarChart2, Tag, Percent, Box, MapPin,
} from 'lucide-react';

interface Props { onNavigate: (s: MainSection) => void; }

export function EcommerceView({ onNavigate }: Props) {
  const nav = (s: MainSection) => () => onNavigate(s);

  const cards: HubCardDef[] = [
    {
      id: 'pedidos', icon: ShoppingCart, onClick: nav('pedidos'),
      gradient: 'linear-gradient(135deg, #FF6835 0%, #e04e20 100%)', color: '#FF6835',
      badge: 'Operaciones', label: 'Pedidos',
      description: 'Árbol madre → hijos, flujo de estados, documentos y seguimiento integral de cada orden.',
      stats: [{ icon: ShoppingCart, value: '—', label: 'Total órdenes' }, { icon: Clock, value: '—', label: 'Pendientes' }, { icon: Truck, value: '—', label: 'En camino' }],
    },
    {
      id: 'pagos', icon: DollarSign, onClick: nav('pagos'),
      gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', color: '#10B981',
      badge: 'Finanzas', label: 'Pagos & Transacciones',
      description: 'Intentos de pago, estados, cobros, reembolsos y conciliación vinculados al pedido.',
      stats: [{ icon: DollarSign, value: '—', label: 'Cobros' }, { icon: RefreshCw, value: '—', label: 'Reembolsos' }, { icon: TrendingUp, value: '—', label: 'Tasa éxito' }],
    },
    {
      id: 'envios', icon: Truck, onClick: nav('envios'),
      gradient: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)', color: '#8B5CF6',
      badge: 'Logística', label: 'Seguimiento de Envíos',
      description: 'Despacho, tránsito y entrega. Tracking multi-tramo con acuse de recibo.',
      stats: [{ icon: Truck, value: '—', label: 'Activos' }, { icon: CheckCircle, value: '—', label: 'Entregados' }, { icon: AlertCircle, value: '—', label: 'Devoluciones' }],
    },
    {
      id: 'erp-inventario', icon: Package, onClick: nav('erp-inventario'),
      gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)', color: '#F59E0B',
      badge: 'Catálogo', label: 'Catálogo de Artículos',
      description: 'Gestión de productos, stock, lotes, variantes y movimientos de inventario en tiempo real.',
      stats: [{ icon: Box, value: '—', label: 'Productos' }, { icon: Tag, value: '—', label: 'Sin stock' }, { icon: BarChart2, value: '—', label: 'Categorías' }],
    },
    {
      id: 'departamentos', icon: FolderTree, onClick: nav('departamentos'),
      gradient: 'linear-gradient(135deg, #0EA5E9 0%, #0369A1 100%)', color: '#0EA5E9',
      badge: 'Estructura', label: 'Departamentos y Categorías',
      description: 'Árbol jerárquico de departamentos, categorías y subcategorías con iconos y SEO.',
      stats: [{ icon: FolderTree, value: '—', label: 'Deptos' }, { icon: Tag, value: '—', label: 'Categorías' }, { icon: CheckCircle, value: '—', label: 'Activos' }],
    },
    {
      id: 'clientes', icon: ShoppingBag, onClick: nav('clientes'),
      gradient: 'linear-gradient(135deg, #6366F1 0%, #4338CA 100%)', color: '#6366F1',
      badge: 'Clientes', label: 'Clientes',
      description: 'Compradores con historial de pedidos, saldo, etiquetas y segmentación por comportamiento.',
      stats: [{ icon: Users, value: '—', label: 'Total' }, { icon: TrendingUp, value: '—', label: 'Activos' }, { icon: ShoppingBag, value: '—', label: 'Nuevos' }],
    },
    {
      id: 'secondhand', icon: RefreshCw, onClick: nav('secondhand'),
      gradient: 'linear-gradient(135deg, #65A30D 0%, #4D7C0F 100%)', color: '#65A30D',
      badge: 'Marketplace', label: 'Segunda Mano',
      description: 'Marketplace interno de artículos usados con publicaciones, moderación y estadísticas.',
      stats: [{ icon: Tag, value: '—', label: 'Publicaciones' }, { icon: CheckCircle, value: '—', label: 'Activas' }, { icon: ShoppingCart, value: '—', label: 'Vendidos' }],
    },
  ];

  const quickLinks: HubQuickLink[] = [
    { label: 'Métodos de Pago',  icon: CreditCard,  color: '#EC4899', onClick: nav('metodos-pago')     },
    { label: 'Métodos de Envío', icon: MapPin,       color: '#14B8A6', onClick: nav('metodos-envio')    },
    { label: 'Facturación',      icon: BarChart2,    color: '#3B82F6', onClick: nav('erp-facturacion')  },
    { label: 'SEO',              icon: TrendingUp,   color: '#8B5CF6', onClick: nav('seo')              },
  ];

  const comingSoon: HubComingSoonItem[] = [
    { icon: TrendingUp, label: 'Recomendaciones IA',    desc: 'Motor de recomendaciones personalizadas' },
    { icon: ShoppingCart, label: 'Carrito abandonado',  desc: 'Recuperación automática de carritos'     },
    { icon: Percent,    label: 'Upselling automático',  desc: 'Ofertas en el checkout basadas en IA'    },
    { icon: Users,      label: 'Fidelización nativa',   desc: 'Programa de puntos integrado'            },
  ];

  return (
    <HubView
      hubIcon={ShoppingCart}
      title="eCommerce"
      subtitle="Hub de operaciones comerciales · Multi-moneda · Multi-país"
      sections={[{ cards }]}
      quickLinks={quickLinks}
      comingSoon={comingSoon}
      comingSoonText="Motor de recomendaciones por IA, carrito abandonado, upselling automático y programa de fidelización nativo."
    />
  );
}

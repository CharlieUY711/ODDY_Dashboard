import React from 'react';
import { HubView, HubCardDef, HubComingSoonItem } from '@/app/components/admin/HubView';
import type { MainSection } from '@/app/AdminDashboard';
import {
  Megaphone, Mail, Share2, ArrowLeftRight, RotateCcw, Target, QrCode,
  TrendingUp, Users, BarChart2, Heart, MousePointerClick, Send, Star,
  Trophy, Zap, MessageCircle, Ticket, MessageSquare, FlaskConical,
} from 'lucide-react';

interface Props { onNavigate: (s: MainSection) => void; }

export function MarketingView({ onNavigate }: Props) {
  const nav = (s: MainSection) => () => onNavigate(s);

  const cards: HubCardDef[] = [
    {
      id: 'etiqueta-emotiva', icon: QrCode, onClick: nav('etiqueta-emotiva'),
      gradient: 'linear-gradient(135deg, #FF6835 0%, #e04e20 100%)', color: '#FF6835',
      badge: 'Emotivo · QR', label: 'Etiqueta Emotiva ✨',
      description: 'Mensajes personalizados con QR en cada envío. Prueba de entrega real y conexión emocional con el destinatario.',
      stats: [{ icon: QrCode, value: '—', label: 'QRs generados' }, { icon: MousePointerClick, value: '—', label: 'Escaneos' }, { icon: Heart, value: '—', label: 'NPS promedio' }],
    },
    {
      id: 'mailing', icon: Mail, onClick: nav('mailing'),
      gradient: 'linear-gradient(135deg, #6366F1 0%, #4338CA 100%)', color: '#6366F1',
      badge: 'Email Marketing', label: 'Mailing & Email',
      description: 'Campañas de email, suscriptores, segmentación dinámica y A/B Testing con Resend.',
      stats: [{ icon: Users, value: '—', label: 'Suscriptores' }, { icon: BarChart2, value: '—', label: 'Apertura' }, { icon: Send, value: '—', label: 'Enviados' }],
    },
    {
      id: 'google-ads', icon: TrendingUp, onClick: nav('google-ads'),
      gradient: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)', color: '#3B82F6',
      badge: 'Publicidad', label: 'Google Ads',
      description: 'Gestión y análisis de campañas publicitarias en Google. Métricas, ROI y optimización en tiempo real.',
      stats: [{ icon: Megaphone, value: '—', label: 'Campañas' }, { icon: TrendingUp, value: '—', label: 'CTR' }, { icon: Zap, value: '—', label: 'Inversión' }],
    },
    {
      id: 'rueda-sorteos', icon: RotateCcw, onClick: nav('rueda-sorteos'),
      gradient: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)', color: '#8B5CF6',
      badge: 'Gamificación', label: 'Rueda de Sorteos',
      description: 'Sorteos interactivos con rueda animada, descuentos y engagement en tiempo real para campañas y eventos.',
      stats: [{ icon: RotateCcw, value: '—', label: 'Sorteos' }, { icon: Users, value: '—', label: 'Participantes' }, { icon: Trophy, value: '—', label: 'Premios' }],
    },
    {
      id: 'fidelizacion', icon: Target, onClick: nav('fidelizacion'),
      gradient: 'linear-gradient(135deg, #F59E0B 0%, #B45309 100%)', color: '#F59E0B',
      badge: 'Loyalty', label: 'Fidelización',
      description: 'Programa de puntos y membresías Bronce / Plata / Oro / Platino. Recompensas automáticas por compra.',
      stats: [{ icon: Users, value: '—', label: 'Miembros' }, { icon: Star, value: '—', label: 'Puntos activos' }, { icon: Trophy, value: '—', label: 'Nivel Oro+' }],
    },
  ];

  const comingSoon: HubComingSoonItem[] = [
    { icon: Users,         label: 'CRM',              desc: 'Gestión de clientes y pipeline de ventas'    },
    { icon: Ticket,        label: 'Cupones',           desc: 'Descuentos, promociones y códigos especiales' },
    { icon: MessageSquare, label: 'Pop-ups & Banners', desc: 'Mensajes promocionales y captura de leads'   },
    { icon: FlaskConical,  label: 'A/B Testing',       desc: 'Experimenta y optimiza conversiones'         },
    { icon: Megaphone,     label: 'Campañas',          desc: 'Gestión de campañas multicanal unificadas'   },
  ];

  return (
    <HubView
      hubIcon={Megaphone}
      title="Marketing"
      subtitle="Campañas, fidelización, redes sociales y herramientas de crecimiento"
      sections={[{ cards }]}
      comingSoon={comingSoon}
    />
  );
}

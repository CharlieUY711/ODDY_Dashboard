/* =====================================================
   RRSSHubView — Hub Central de Redes Sociales
   Centro de comando completo para Meta Business Suite
   Charlie Marketplace Builder v1.5
   ===================================================== */
import React, { useState, useEffect } from 'react';
import { OrangeHeader } from '@/app/components/admin/OrangeHeader';
import type { MainSection } from '@/app/AdminDashboard';
import {
  Share2, BarChart2, ArrowLeftRight, Monitor, Zap, Calendar,
  BookOpen, CheckCircle, Settings, Rocket, Star, HelpCircle,
  Facebook, Instagram, MessageCircle, Wrench, ExternalLink,
  ChevronRight, AlertCircle, Loader,
} from 'lucide-react';
import { getStatus, type AllStatus, type PlatformStatus } from '@/app/services/rrssApi';

const ORANGE   = '#FF6835';
const FB_BLUE  = '#1877F2';
const IG_PINK  = '#E1306C';
const WA_GREEN = '#25D366';

interface Props { onNavigate: (s: MainSection) => void; }

/* ── Platform status chip ── */
function PlatformChip({ icon: Icon, platform, status, statusColor, onClick }: {
  icon: React.ElementType; platform: string; status: string; statusColor: string; onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        flex: 1, padding: '12px 16px', borderRadius: '10px',
        backgroundColor: 'rgba(255,255,255,0.12)',
        border: '1px solid rgba(255,255,255,0.2)',
        backdropFilter: 'blur(8px)', cursor: onClick ? 'pointer' : 'default',
        transition: 'background 0.15s', textAlign: 'left',
      }}
      onMouseEnter={e => onClick && ((e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.2)')}
      onMouseLeave={e => onClick && ((e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.12)')}
    >
      <Icon size={16} color='#fff' />
      <div>
        <p style={{ margin: 0, fontSize: '0.68rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1 }}>{platform}</p>
        <p style={{ margin: '3px 0 0', fontSize: '0.82rem', fontWeight: '800', color: '#fff', lineHeight: 1 }}>{status}</p>
      </div>
    </button>
  );
}

/* ── Main tool card ── */
interface MainCardProps {
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
  badge: string;
  badgeColor: string;
  badgeBg: string;
  features: string[];
  statusLabel: string;
  statusColor: string;
  statusBg: string;
  onClick: () => void;
}
function MainToolCard({ icon: Icon, iconBg, iconColor, title, description, badge, badgeColor, badgeBg, features, statusLabel, statusColor, statusBg, onClick }: MainCardProps) {
  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: '#fff', borderRadius: '14px',
        border: '1px solid #E5E7EB', overflow: 'hidden',
        cursor: 'pointer', transition: 'all 0.18s',
        display: 'flex', flexDirection: 'column',
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(0,0,0,0.1)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'none'; (e.currentTarget as HTMLElement).style.transform = 'none'; }}
    >
      <div style={{ height: '3px', backgroundColor: iconColor }} />
      <div style={{ padding: '20px 20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ width: 44, height: 44, borderRadius: '12px', backgroundColor: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={22} color={iconColor} />
        </div>
        <span style={{ fontSize: '0.65rem', fontWeight: '800', color: badgeColor, backgroundColor: badgeBg, padding: '3px 8px', borderRadius: '5px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {badge}
        </span>
      </div>
      <div style={{ padding: '14px 20px 0' }}>
        <h3 style={{ margin: '0 0 5px', fontSize: '1rem', fontWeight: '900', color: '#111827' }}>{title}</h3>
        <p style={{ margin: '0 0 14px', fontSize: '0.77rem', color: '#6B7280', lineHeight: 1.5 }}>{description}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '18px' }}>
          {features.map(f => (
            <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
              <CheckCircle size={13} color='#10B981' />
              <span style={{ fontSize: '0.77rem', color: '#374151' }}>{f}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ marginTop: 'auto', padding: '14px 20px', borderTop: '1px solid #F3F4F6' }}>
        <div style={{ width: '100%', padding: '9px', borderRadius: '8px', backgroundColor: statusBg, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          <CheckCircle size={14} color={statusColor} />
          <span style={{ fontSize: '0.8rem', fontWeight: '700', color: statusColor }}>{statusLabel}</span>
        </div>
      </div>
    </div>
  );
}

/* ── Additional tool card ── */
interface AdditionalCardProps {
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
  statusLabel: string;
  statusColor: string;
  statusBg: string;
  onClick?: () => void;
}
function AdditionalCard({ icon: Icon, iconBg, iconColor, title, description, statusLabel, statusColor, statusBg, onClick }: AdditionalCardProps) {
  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: '#fff', borderRadius: '12px',
        border: '1px solid #E5E7EB', padding: '18px',
        cursor: onClick ? 'pointer' : 'default', transition: 'all 0.15s',
      }}
      onMouseEnter={e => onClick && ((e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)')}
      onMouseLeave={e => onClick && ((e.currentTarget as HTMLElement).style.boxShadow = 'none')}
    >
      <div style={{ width: 38, height: 38, borderRadius: '10px', backgroundColor: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
        <Icon size={18} color={iconColor} />
      </div>
      <p style={{ margin: '0 0 3px', fontSize: '0.88rem', fontWeight: '800', color: '#111827' }}>{title}</p>
      <p style={{ margin: '0 0 12px', fontSize: '0.72rem', color: '#6B7280', lineHeight: 1.4 }}>{description}</p>
      <span style={{ fontSize: '0.7rem', fontWeight: '700', color: statusColor, backgroundColor: statusBg, padding: '3px 9px', borderRadius: '5px' }}>
        {statusLabel}
      </span>
    </div>
  );
}

/* ── Main export ── */
export function RRSSHubView({ onNavigate }: Props) {
  const [platformStatus, setPlatformStatus] = useState<AllStatus | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoadingStatus(true);
    getStatus().then(s => {
      if (!cancelled) { setPlatformStatus(s); setLoadingStatus(false); }
    });
    return () => { cancelled = true; };
  }, []);
}

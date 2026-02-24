import React from 'react';
import { HubView, HubCardDef, HubComingSoonItem } from '@/app/components/admin/HubView';
import type { MainSection } from '@/app/AdminDashboard';
import {
  Wrench, Image, FolderOpen, FileText, DollarSign, ScanLine, Printer,
  QrCode, RotateCcw, Lightbulb, Zap, Download, CheckCircle, Star,
  Package, Users, BarChart2, Layout, Upload, LayoutGrid,
} from 'lucide-react';

interface Props { onNavigate: (s: MainSection) => void; }

export function HerramientasView({ onNavigate }: Props) {
  const nav = (s: MainSection) => () => onNavigate(s);

  const workspaceCards: HubCardDef[] = [
    {
      id: 'editor-imagenes', icon: Image, onClick: nav('editor-imagenes'),
      gradient: 'linear-gradient(135deg, #FF6835 0%, #e04e20 100%)', color: '#FF6835',
      badge: 'Workspace · Editor', label: 'Editor de Imágenes',
      description: 'Filtros CSS en tiempo real, rotación, flip, 8 presets y export PNG/JPG con transformaciones aplicadas.',
      stats: [{ icon: Zap, value: '8', label: 'Filtros' }, { icon: Layout, value: '3', label: 'Presets' }, { icon: Download, value: 'PNG', label: 'Export' }],
    },
    {
      id: 'biblioteca', icon: FolderOpen, onClick: nav('biblioteca'),
      gradient: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)', color: '#3B82F6',
      badge: 'Workspace · Assets', label: 'Biblioteca de Assets',
      description: 'Repositorio centralizado de imágenes, documentos y archivos. Upload drag & drop, colecciones y tags.',
      stats: [{ icon: Package, value: '—', label: 'Archivos' }, { icon: FolderOpen, value: '—', label: 'Colecciones' }, { icon: Star, value: '—', label: 'Destacados' }],
    },
    {
      id: 'gen-documentos', icon: FileText, onClick: nav('gen-documentos'),
      gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', color: '#10B981',
      badge: 'Workspace · Docs', label: 'Generador de Documentos',
      description: 'Editor WYSIWYG con bloques arrastrables. Crea contratos, cartas e informes en formato A4 imprimible.',
      stats: [{ icon: Layout, value: '8', label: 'Tipos bloque' }, { icon: FileText, value: 'A4', label: 'Plantilla' }, { icon: Download, value: 'PDF', label: 'Export' }],
    },
    {
      id: 'gen-presupuestos', icon: DollarSign, onClick: nav('gen-presupuestos'),
      gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)', color: '#F59E0B',
      badge: 'Workspace · Finanzas', label: 'Generador de Presupuestos',
      description: 'Presupuestos profesionales con ítems, IVA configurable, descuentos y export PDF multi-moneda.',
      stats: [{ icon: CheckCircle, value: '—', label: 'Generados' }, { icon: Zap, value: 'IVA', label: 'Multi-IVA' }, { icon: Download, value: 'PDF', label: 'Export' }],
    },
    {
      id: 'ocr', icon: ScanLine, onClick: nav('ocr'),
      gradient: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)', color: '#8B5CF6',
      badge: 'Workspace · OCR · Browser', label: 'OCR — Texto desde Imagen',
      description: 'Convierte fotos de facturas y documentos escaneados a texto editable. 100% en el browser con Tesseract.js.',
      stats: [{ icon: ScanLine, value: '3', label: 'Idiomas' }, { icon: Zap, value: '0', label: 'APIs externas' }, { icon: Download, value: 'TXT', label: 'Export' }],
    },
    {
      id: 'impresion', icon: Printer, onClick: nav('impresion'),
      gradient: 'linear-gradient(135deg, #EC4899 0%, #BE185D 100%)', color: '#EC4899',
      badge: 'Workspace · Print', label: 'Módulo de Impresión',
      description: 'Configurá papel, orientación, copias y modo color. Preview A4 antes de imprimir cualquier documento.',
      stats: [{ icon: Layout, value: '4', label: 'Formatos' }, { icon: Star, value: '2', label: 'Modos color' }, { icon: CheckCircle, value: 'A4', label: 'Preview' }],
    },
  ];

  const quickCards: HubCardDef[] = [
    {
      id: 'qr-generator', icon: QrCode, onClick: nav('qr-generator'),
      gradient: 'linear-gradient(135deg, #18181B 0%, #3F3F46 100%)', color: '#111827',
      badge: 'Herramienta rápida', label: 'Generador de QR',
      description: 'QR personalizado sin APIs. Export PNG y SVG vectorial. Colores y logo personalizable.',
      stats: [{ icon: QrCode, value: '—', label: 'Generados' }, { icon: Zap, value: '0', label: 'APIs' }, { icon: Download, value: 'SVG', label: 'Export' }],
    },
    {
      id: 'rueda-sorteos', icon: RotateCcw, onClick: nav('rueda-sorteos'),
      gradient: 'linear-gradient(135deg, #6D28D9 0%, #4C1D95 100%)', color: '#6D28D9',
      badge: 'Herramienta rápida', label: 'Rueda de Sorteos',
      description: 'Sorteos interactivos con rueda animada para campañas, concursos y eventos en vivo.',
      stats: [{ icon: RotateCcw, value: '—', label: 'Sorteos' }, { icon: Users, value: '—', label: 'Participantes' }, { icon: Star, value: '—', label: 'Premios' }],
    },
    {
      id: 'ideas-board', icon: Lightbulb, onClick: nav('ideas-board'),
      gradient: 'linear-gradient(135deg, #0EA5E9 0%, #0369A1 100%)', color: '#0EA5E9',
      badge: 'Herramienta rápida', label: 'Ideas Board',
      description: 'Canvas visual tipo pizarrón con stickers, conectores y notas. Brainstorming visual libre.',
      stats: [{ icon: Layout, value: '—', label: 'Tableros' }, { icon: Lightbulb, value: '—', label: 'Ideas' }, { icon: BarChart2, value: '—', label: 'Conectores' }],
    },
    {
      id: 'carga-masiva', icon: Upload, onClick: nav('carga-masiva'),
      gradient: 'linear-gradient(135deg, #FF6835 0%, #e04e20 100%)', color: '#FF6835',
      badge: 'Storage · Supabase', label: 'Carga Masiva de Archivos',
      description: 'Upload masivo con drag & drop. CSV, imágenes, docs. Queue de archivos con progreso y Supabase Storage.',
      stats: [{ icon: Upload, value: '∞', label: 'Archivos' }, { icon: Zap, value: 'Auto', label: 'Queue' }, { icon: Download, value: 'URL', label: 'Signed URL' }],
    },
    {
      id: 'unified-workspace', icon: LayoutGrid, onClick: nav('unified-workspace'),
      gradient: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)', color: '#8B5CF6',
      badge: 'Workspace · Suite', label: 'Unified Workspace',
      description: 'Docs, tareas kanban, notas sticky, calendario mensual y chat interno en un único espacio de trabajo.',
      stats: [{ icon: LayoutGrid, value: '5', label: 'Secciones' }, { icon: Users, value: 'Multi', label: 'Usuario' }, { icon: Zap, value: 'RT', label: 'Realtime' }],
    },
  ];

  const comingSoon: HubComingSoonItem[] = [
    { icon: FileText,   label: 'Editor de video',    desc: 'Videos cortos y reels'                },
    { icon: Download,   label: 'Conversor formatos', desc: 'Conversión entre formatos de archivo' },
    { icon: CheckCircle,label: 'Firma digital',      desc: 'Firma digital de documentos PDF'      },
    { icon: Zap,        label: 'Contratos con IA',   desc: 'Generación de contratos inteligentes' },
  ];

  return (
    <HubView
      hubIcon={Wrench}
      title="Suite de Herramientas"
      subtitle="6 workspaces especializados · 3 herramientas rápidas · Export nativo · Sin APIs externas"
      sections={[
        {
          label: 'Workspace Suite',
          count: '6 herramientas',
          subtitle: 'Comparten el mismo layout profesional con panel izquierdo, derecho y barra de herramientas',
          cards: workspaceCards,
        },
        {
          label: 'Herramientas Rápidas',
          count: '5 herramientas',
          subtitle: 'Utilitarios ligeros · Carga masiva de archivos · Workspace unificado',
          cards: quickCards,
        },
      ]}
      hideSeleccionar
      comingSoon={comingSoon}
      comingSoonText="Editor de videos cortos, conversor de formatos, firma digital de documentos y generador de contratos con IA."
    />
  );
}

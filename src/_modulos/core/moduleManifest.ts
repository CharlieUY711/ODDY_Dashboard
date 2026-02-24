/**
 * MODULE MANIFEST — Charlie Marketplace Builder v1.5
 * ═══════════════════════════════════════════════════
 * FUENTE ÚNICA DE VERDAD sobre qué vistas existen y qué IDs del checklist cubren.
 *
 * ┌─ REGLA ──────────────────────────────────────────────────────────────────────┐
 * │  Cuando construís una vista nueva, SOLO tenés que agregar/editar UNA entrada │
 * │  aquí. moduleRegistry.ts y el ChecklistRoadmap se actualizan solos.          │
 * └──────────────────────────────────────────────────────────────────────────────┘
 *
 * isReal = true  → Vista funcional con UI completa (puede ser mock o real Supabase)
 * isReal = false → Hub de navegación o placeholder; no cuenta como completado
 */

import type { MainSection } from '../AdminDashboard';

export interface ManifestEntry {
  /** IDs exactos en MODULES_DATA que esta vista cubre (vacío = hub, no mapea nada) */
  checklistIds: string[];
  /** Sección en AdminDashboard / sidebar */
  section: MainSection;
  /** Nombre del archivo de vista (solo informativo) */
  viewFile: string;
  /** true = vista funcional real | false = hub de navegación o placeholder */
  isReal: boolean;
  /** ¿Conecta con Supabase/backend? */
  hasSupabase?: boolean;
  /** Nota descriptiva */
  notes?: string;
}

export const MODULE_MANIFEST: ManifestEntry[] = [

  // ══════════════════════════════════════════════════════
  // ADMIN / SISTEMA
  // ══════════════════════════════════════════════════════
  {
    checklistIds: ['admin-settings', 'admin-users'],
    section: 'dashboard',
    viewFile: 'DashboardView.tsx',
    isReal: true,
    notes: 'Dashboard con métricas, charts y navegación rápida',
  },
  {
    checklistIds: ['admin-settings', 'admin-users'],
    section: 'sistema',
    viewFile: 'SistemaView.tsx',
    isReal: true,
    notes: 'Configuración del sistema — hub con cards de config',
  },
  {
    checklistIds: ['admin-users'],
    section: 'departamentos',
    viewFile: 'DepartamentosView.tsx',
    isReal: true,
    notes: 'Gestión de departamentos, roles y permisos',
  },
  {
    checklistIds: ['admin-settings'],
    section: 'checklist',
    viewFile: 'ChecklistView.tsx',
    isReal: true,
    notes: 'Vista del checklist / roadmap con audit integrado',
  },
  {
    checklistIds: [],
    section: 'diseno',
    viewFile: 'DisenoView.tsx',
    isReal: false,
    notes: 'Hub de diseño y branding (tabs de navegación)',
  },

  // ══════════════════════════════════════════════════════
  // BASE DE PERSONAS
  // ══════════════════════════════════════════════════════
  {
    checklistIds: ['base-personas'],
    section: 'personas',
    viewFile: 'PersonasView.tsx',
    isReal: true,
    hasSupabase: true,
    notes: 'CRUD completo de personas físicas y jurídicas',
  },
  {
    checklistIds: ['base-personas'],
    section: 'organizaciones',
    viewFile: 'OrganizacionesView.tsx',
    isReal: true,
    hasSupabase: true,
    notes: 'CRUD completo de empresas y organizaciones',
  },
  {
    checklistIds: ['base-personas'],
    section: 'clientes',
    viewFile: 'ClientesView.tsx',
    isReal: true,
    hasSupabase: true,
    notes: 'Vista filtrada de personas/organizaciones con rol cliente',
  },

  // ══════════════════════════════════════════════════════
  // eCOMMERCE
  // ══════════════════════════════════════════════════════
  {
    checklistIds: [],
    section: 'ecommerce',
    viewFile: 'EcommerceView.tsx',
    isReal: false,
    notes: 'Hub de navegación eCommerce (cards a sub-módulos)',
  },
  {
    checklistIds: ['ecommerce-pedidos'],
    section: 'pedidos',
    viewFile: 'PedidosView.tsx',
    isReal: true,
    hasSupabase: true,
    notes: 'CRUD de pedidos con estados, filtros y árbol madre/hijos',
  },
  {
    checklistIds: ['ecommerce-pedidos'],
    section: 'pagos',
    viewFile: 'PagosView.tsx',
    isReal: true,
    hasSupabase: true,
    notes: 'Transacciones y estados de pago operativos',
  },
  {
    checklistIds: ['ecommerce-metodos-pago'],
    section: 'metodos-pago',
    viewFile: 'MetodosPagoView.tsx',
    isReal: true,
    hasSupabase: true,
    notes: 'Configuración de pasarelas y métodos de pago',
  },
  {
    checklistIds: ['ecommerce-metodos-envio'],
    section: 'metodos-envio',
    viewFile: 'MetodosEnvioView.tsx',
    isReal: true,
    hasSupabase: true,
    notes: 'Configuración de métodos de envío y tarifas',
  },

  // ══════════════════════════════════════════════════════
  // LOGÍSTICA
  // ══════════════════════════════════════════════════════
  {
    checklistIds: ['logistics-hub'],
    section: 'logistica',
    viewFile: 'LogisticaView.tsx',
    isReal: false,
    notes: 'Hub con diagrama de flujo logístico 7 pasos y cards a todos los sub-módulos',
  },
  {
    checklistIds: ['logistics-shipping'],
    section: 'envios',
    viewFile: 'EnviosView.tsx',
    isReal: true,
    hasSupabase: false,
    notes: 'Vista árbol PedidoMadre→EnvíosHijos · estados · multi-tramo · panel detalle + timeline',
  },
  {
    checklistIds: ['logistics-carriers'],
    section: 'transportistas',
    viewFile: 'TransportistasView.tsx',
    isReal: true,
    hasSupabase: false,
    notes: 'Catálogo carriers · tramos y zonas · simulador de tarifas',
  },
  {
    checklistIds: ['logistics-routes'],
    section: 'rutas',
    viewFile: 'RutasView.tsx',
    isReal: true,
    hasSupabase: false,
    notes: 'Rutas standard y por proyecto · vista detalle con paradas · progreso de entrega',
  },
  {
    checklistIds: ['logistics-fulfillment'],
    section: 'fulfillment',
    viewFile: 'FulfillmentView.tsx',
    isReal: true,
    hasSupabase: false,
    notes: 'Wave picking · lotes · cola de órdenes · empaque · materiales de packaging',
  },
  {
    checklistIds: ['logistics-production'],
    section: 'produccion',
    viewFile: 'ProduccionView.tsx',
    isReal: true,
    hasSupabase: false,
    notes: 'BOM · órdenes de armado · catálogo de kits / canastas / combos / packs',
  },
  {
    checklistIds: ['logistics-supply'],
    section: 'abastecimiento',
    viewFile: 'AbastecimientoView.tsx',
    isReal: true,
    hasSupabase: false,
    notes: 'Alertas de stock · OC sugeridas · MRP con cálculo de componentes necesarios',
  },
  {
    checklistIds: ['logistics-map'],
    section: 'mapa-envios',
    viewFile: 'MapaEnviosView.tsx',
    isReal: true,
    hasSupabase: false,
    notes: 'Mapa SVG de Argentina con puntos de envíos activos · filtro por estado · tooltip detalle',
  },
  {
    checklistIds: ['logistics-tracking'],
    section: 'tracking-publico',
    viewFile: 'TrackingPublicoView.tsx',
    isReal: true,
    hasSupabase: false,
    notes: 'Búsqueda por número de envío · timeline de estados · link público para destinatarios',
  },

  // ══════════════════════════════════════════════════════
  // MARKETING
  // ══════════════════════════════════════════════════════
  {
    checklistIds: [],
    section: 'marketing',
    viewFile: 'MarketingView.tsx',
    isReal: false,
    notes: 'Hub de navegación Marketing (cards a sub-módulos)',
  },
  {
    checklistIds: ['marketing-campaigns'],
    section: 'google-ads',
    viewFile: 'GoogleAdsView.tsx',
    isReal: true,
    notes: 'Dashboard Google Ads con charts recharts, KPIs y tabla de campañas',
  },
  {
    checklistIds: ['marketing-email', 'marketing-email-bulk'],
    section: 'mailing',
    viewFile: 'MailingView.tsx',
    isReal: true,
    hasSupabase: false,
    notes: 'UI completa (5 tabs: Campañas, Suscriptores, Segmentación, A/B Testing, Analíticas) — MOCK DATA.',
  },
  {
    checklistIds: ['marketing-seo'],
    section: 'seo',
    viewFile: 'SEOView.tsx',
    isReal: true,
    hasSupabase: false,
    notes: 'Dashboard SEO · Keywords + rankings · análisis on-page de páginas · backlinks · salud SEO',
  },
  {
    checklistIds: ['marketing-loyalty'],
    section: 'fidelizacion',
    viewFile: 'FidelizacionView.tsx',
    isReal: true,
    notes: 'Programa de fidelización con niveles y charts',
  },
  {
    checklistIds: ['marketing-loyalty'],
    section: 'rueda-sorteos',
    viewFile: 'RuedaSorteosView.tsx',
    isReal: true,
    notes: 'Rueda de sorteos interactiva con premios configurables',
  },
  {
    checklistIds: ['rrss-centro-operativo'],
    section: 'redes-sociales',
    viewFile: 'RedesSocialesView.tsx',
    isReal: true,
    notes: 'Centro Operativo RRSS — métricas, programación de posts y análisis de audiencia',
  },
  {
    checklistIds: ['rrss-migracion'],
    section: 'migracion-rrss',
    viewFile: 'MigracionRRSSView.tsx',
    isReal: true,
    notes: 'Herramienta de migración/rebranding Instagram + Facebook',
  },
  {
    checklistIds: ['marketing-etiqueta-emotiva'],
    section: 'etiqueta-emotiva',
    viewFile: 'EtiquetaEmotivaView.tsx',
    isReal: true,
    hasSupabase: true,
    notes: 'Mensajes personalizados con QR para envíos · Supabase + QR real',
  },

  // ══════════════════════════════════════════════════════
  // RRSS
  // ══════════════════════════════════════════════════════
  {
    checklistIds: [],
    section: 'rrss',
    viewFile: 'RRSSHubView.tsx',
    isReal: false,
    notes: 'Hub de navegación RRSS — Centro Operativo + Migración RRSS',
  },

  // ══════════════════════════════════════════════════════
  // HERRAMIENTAS
  // ══════════════════════════════════════════════════════
  {
    checklistIds: [],
    section: 'herramientas',
    viewFile: 'HerramientasView.tsx',
    isReal: false,
    notes: 'Hub de navegación — 6 workspace tools + 3 herramientas rápidas',
  },
  {
    checklistIds: ['tools-library'],
    section: 'biblioteca',
    viewFile: 'BibliotecaWorkspace.tsx',
    isReal: true,
    hasSupabase: false,
    notes: 'Biblioteca de assets — upload drag&drop, colecciones, tags, grid/lista, export',
  },
  {
    checklistIds: ['tools-image-editor'],
    section: 'editor-imagenes',
    viewFile: 'EditorImagenesWorkspace.tsx',
    isReal: true,
    hasSupabase: false,
    notes: 'Editor de imágenes — filtros CSS, rotación, flip, 8 presets, export PNG/JPG',
  },
  {
    checklistIds: ['tools-documents'],
    section: 'gen-documentos',
    viewFile: 'GenDocumentosWorkspace.tsx',
    isReal: true,
    hasSupabase: false,
    notes: 'Generador de documentos WYSIWYG — 8 tipos de bloque, A4, export PDF',
  },
  {
    checklistIds: ['tools-quotes'],
    section: 'gen-presupuestos',
    viewFile: 'GenPresupuestosWorkspace.tsx',
    isReal: true,
    hasSupabase: false,
    notes: 'Generador de presupuestos — ítems, IVA, descuentos, multi-moneda, export PDF',
  },
  {
    checklistIds: ['tools-ocr'],
    section: 'ocr',
    viewFile: 'OCRWorkspace.tsx',
    isReal: true,
    hasSupabase: false,
    notes: 'OCR con Tesseract.js — 100% browser, sin API key, Español/Inglés/PT, export TXT',
  },
  {
    checklistIds: ['tools-print'],
    section: 'impresion',
    viewFile: 'ImpresionWorkspace.tsx',
    isReal: true,
    hasSupabase: false,
    notes: 'Módulo de impresión — cola de trabajos, A4 preview, papel/orientación/color/calidad',
  },
  {
    checklistIds: ['tools-qr'],
    section: 'qr-generator',
    viewFile: 'QrGeneratorView.tsx',
    isReal: true,
    notes: 'Generador QR — sin APIs externas, genera PNG y SVG vectorial',
  },
  {
    checklistIds: ['tools-ideas-board'],
    section: 'ideas-board',
    viewFile: 'IdeasBoardView.tsx',
    isReal: true,
    hasSupabase: true,
    notes: 'Canvas visual de módulos e ideas — stickers, conectores, canvases jerárquicos',
  },

  // ══════════════════════════════════════════════════════
  // ERP
  // ══════════════════════════════════════════════════════
  {
    checklistIds: [],
    section: 'gestion',
    viewFile: 'GestionView.tsx',
    isReal: false,
    notes: 'Hub de navegación ERP (cards a Inventario, Facturación, Compras, CRM, etc.)',
  },
  {
    checklistIds: ['erp-inventory'],
    section: 'erp-inventario',
    viewFile: 'ERPInventarioView.tsx',
    isReal: true,
    notes: 'Inventario con tabs: Artículos, Stock, Movimientos, Alertas',
  },
  {
    checklistIds: ['erp-invoicing'],
    section: 'erp-facturacion',
    viewFile: 'ERPFacturacionView.tsx',
    isReal: true,
    notes: 'Facturación con tabs: Facturas, Tickets, Nueva factura',
  },
  {
    checklistIds: ['erp-purchasing'],
    section: 'erp-compras',
    viewFile: 'ERPComprasView.tsx',
    isReal: true,
    notes: 'Compras con tabs: Órdenes, Proveedores, Nueva orden',
  },
  {
    checklistIds: ['crm-contacts', 'crm-opportunities', 'crm-activities'],
    section: 'erp-crm',
    viewFile: 'ERPCRMView.tsx',
    isReal: true,
    notes: 'CRM completo: Contactos, Pipeline de oportunidades, Actividades y seguimiento',
  },
  {
    checklistIds: ['erp-accounting'],
    section: 'erp-contabilidad',
    viewFile: 'ERPContabilidadView.tsx',
    isReal: true,
    notes: 'Contabilidad: Plan de cuentas, Asientos, Cobrar/Pagar, Bancos',
  },
  {
    checklistIds: ['erp-hr'],
    section: 'erp-rrhh',
    viewFile: 'ERPRRHHView.tsx',
    isReal: true,
    notes: 'RRHH: Empleados, Asistencia y Nómina',
  },

  // ══════════════════════════════════════════════════════
  // PROYECTOS
  // ══════════════════════════════════════════════════════
  {
    checklistIds: ['projects-management', 'projects-tasks', 'projects-time'],
    section: 'proyectos',
    viewFile: 'ProyectosView.tsx',
    isReal: true,
    notes: 'Proyectos con Gantt simplificado y tablero Kanban',
  },

  // ══════════════════════════════════════════════════════
  // MARKETPLACE
  // ══════════════════════════════════════════════════════
  {
    checklistIds: ['marketplace-secondhand', 'marketplace-secondhand-mediacion'],
    section: 'secondhand',
    viewFile: 'SecondHandView.tsx',
    isReal: true,
    notes: 'Marketplace Segunda Mano: Estadísticas, Moderación, Publicaciones y Mediación',
  },

  // ══════════════════════════════════════════════════════
  // INTEGRACIONES
  // ══════════════════════════════════════════════════════
  {
    checklistIds: [
      'integrations-mercadolibre',
      'integrations-mercadopago',
      'integrations-plexo',
      'integrations-paypal',
      'integrations-stripe',
      'integrations-meta',
      'integrations-twilio',
    ],
    section: 'integraciones',
    viewFile: 'IntegracionesView.tsx',
    isReal: true,
    notes: 'Hub de 5 módulos de integración — Uruguay first, Latam progresivo',
  },
  {
    checklistIds: ['integrations-plexo', 'integrations-mercadopago', 'integrations-paypal', 'integrations-stripe'],
    section: 'integraciones-pagos',
    viewFile: 'IntegracionesPagosView.tsx',
    isReal: true,
    notes: 'Pasarela de pagos — Plexo, OCA, Abitab, RedPagos, MP, PayPal, Stripe',
  },
  {
    checklistIds: ['integrations-logistics'],
    section: 'integraciones-logistica',
    viewFile: 'IntegracionesLogisticaView.tsx',
    isReal: true,
    notes: 'Logística — Carriers con y sin API. URL de tracking configurable',
  },
  {
    checklistIds: ['integrations-mercadolibre'],
    section: 'integraciones-tiendas',
    viewFile: 'IntegracionesTiendasView.tsx',
    isReal: true,
    notes: 'Tiendas — ML, TiendaNube, WooCommerce, Shopify, VTEX, Magento',
  },
  {
    checklistIds: ['integrations-meta'],
    section: 'integraciones-rrss',
    viewFile: 'IntegracionesRRSSView.tsx',
    isReal: true,
    notes: 'Redes Sociales — Meta, Instagram Shopping, WhatsApp, Facebook Shops, TikTok, Pinterest',
  },
  {
    checklistIds: ['integrations-twilio'],
    section: 'integraciones-servicios',
    viewFile: 'IntegracionesServiciosView.tsx',
    isReal: true,
    notes: 'Servicios — Twilio, Resend, SendGrid, GA4, GTM, Zapier, n8n',
  },
  // ══════════════════════════════════════════════════════
  // AUDITORÍA & DIAGNÓSTICO
  // ══════════════════════════════════════════════════════
  {
    checklistIds: ['audit-hub'],
    section: 'auditoria',
    viewFile: 'AuditoriaHubView.tsx',
    isReal: true,
    hasSupabase: false,
    notes: 'Hub Auditoría — métricas de estado, diagnóstico rápido y acceso a herramientas',
  },
  {
    checklistIds: ['audit-health'],
    section: 'auditoria-health',
    viewFile: 'HealthMonitorView.tsx',
    isReal: true,
    hasSupabase: true,
    notes: 'Health Monitor — verifica en tiempo real Supabase DB/Auth/Edge/KV/Storage + APIs externas',
  },
  {
    checklistIds: ['audit-logs'],
    section: 'auditoria-logs',
    viewFile: 'SystemLogsView.tsx',
    isReal: true,
    hasSupabase: false,
    notes: 'Logs del Sistema — registro de actividad, errores y eventos con filtros y export TXT',
  },
  {
    checklistIds: ['audit-apis-repo'],
    section: 'integraciones-apis',
    viewFile: 'RepositorioAPIsView.tsx',
    isReal: true,
    hasSupabase: false,
    notes: 'Repositorio centralizado — 23 APIs con estado, credenciales, docs y test de conexión',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS (consumidos por moduleRegistry y AuditPanel)
// ─────────────────────────────────────────────────────────────────────────────

/** Set de todos los checklistIds cubiertos por vistas reales */
export const REAL_CHECKLIST_IDS = new Set<string>(
  MODULE_MANIFEST.filter(e => e.isReal).flatMap(e => e.checklistIds)
);

/** Map sección → entry del manifest */
export const MANIFEST_BY_SECTION = new Map<MainSection, ManifestEntry>(
  MODULE_MANIFEST.map(e => [e.section, e])
);

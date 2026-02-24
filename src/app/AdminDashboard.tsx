/* =====================================================
   Charlie Marketplace Builder v1.5
   AdminDashboard — Shell Principal
   ===================================================== */

import React, { useState } from 'react';
import { AdminSidebar }       from './components/admin/AdminSidebar';
import { DashboardView }      from '@modulos/views/DashboardView';
import { EcommerceView }      from '@modulos/views/EcommerceView';
import { MarketingView }      from '@modulos/views/MarketingView';
import { HerramientasView }   from '@modulos/views/HerramientasView';
import { QrGeneratorView }    from '@modulos/views/QrGeneratorView';
import { GestionView }        from '@modulos/views/GestionView';
import { SistemaView }        from '@modulos/views/SistemaView';
import { ChecklistView }      from '@modulos/views/ChecklistView';
import { IntegracionesView }  from '@modulos/views/IntegracionesView';
import { RRSSHubView }        from '@modulos/views/RRSSHubView';
import { ERPInventarioView }  from '@modulos/views/ERPInventarioView';
import { ERPFacturacionView } from '@modulos/views/ERPFacturacionView';
import { ERPCRMView }         from '@modulos/views/ERPCRMView';
import { ERPRRHHView }        from '@modulos/views/ERPRRHHView';
import { ProyectosView }      from '@modulos/views/ProyectosView';
import { ClientesView }       from '@modulos/views/ClientesView';
import { PedidosView }        from '@modulos/views/PedidosView';
import { LogisticaView }      from '@modulos/views/LogisticaView';
import { MetaBusinessView }   from '@modulos/views/MetaBusinessView';
import { AuditoriaHubView }   from '@modulos/views/AuditoriaHubView';
import { OrquestadorView } from '@modulos/views/OrquestadorView';

// ── Todas las vistas stub importadas desde stubs.tsx ──────────────────────────
import {
  POSView,
  DisenoView,
  MigracionRRSSView,
  MailingView,
  GoogleAdsView,
  RuedaSorteosView,
  FidelizacionView,
  RedesSocialesView,
  DepartamentosView,
  SecondHandView,
  ERPComprasView,
  ERPContabilidadView,
  PersonasView,
  OrganizacionesView,
  MetodosPagoView,
  MetodosEnvioView,
  PagosView,
  EnviosView,
  EtiquetaEmotivaView,
  TransportistasView,
  RutasView,
  FulfillmentView,
  ProduccionView,
  AbastecimientoView,
  MapaEnviosView,
  TrackingPublicoView,
  SEOView,
  IdeasBoardView,
  IntegracionesPagosView,
  IntegracionesLogisticaView,
  IntegracionesTiendasView,
  IntegracionesRRSSView,
  IntegracionesServiciosView,
  BibliotecaWorkspace,
  EditorImagenesWorkspace,
  GenDocumentosWorkspace,
  GenPresupuestosWorkspace,
  OCRWorkspace,
  ImpresionWorkspace,
  HealthMonitorView,
  SystemLogsView,
  RepositorioAPIsView,
  ConstructorView,
  AuthRegistroView,
  CargaMasivaView,
  UnifiedWorkspaceView,
  AdminDashboardView,
  UserDashboardView,
  ConfigVistasPorRolView,
  DocumentacionView,
  MetaMapView,
} from '@modulos/views/stubs';

import { Toaster } from 'sonner';

export type MainSection =
  | 'orquestador'
  | 'dashboard'
  | 'ecommerce'
  | 'marketing'
  | 'herramientas'
  | 'qr-generator'
  | 'gestion'
  | 'pos'
  | 'sistema'
  | 'diseno'
  | 'checklist'
  | 'integraciones'
  | 'migracion-rrss'
  | 'mailing'
  | 'google-ads'
  | 'rueda-sorteos'
  | 'fidelizacion'
  | 'redes-sociales'
  | 'rrss'
  | 'departamentos'
  | 'secondhand'
  | 'erp-inventario'
  | 'erp-facturacion'
  | 'erp-compras'
  | 'erp-crm'
  | 'erp-contabilidad'
  | 'erp-rrhh'
  | 'proyectos'
  | 'personas'
  | 'organizaciones'
  | 'clientes'
  | 'pedidos'
  | 'metodos-pago'
  | 'metodos-envio'
  | 'pagos'
  | 'envios'
  | 'logistica'
  | 'transportistas'
  | 'rutas'
  | 'produccion'
  | 'abastecimiento'
  | 'mapa-envios'
  | 'tracking-publico'
  | 'fulfillment'
  | 'seo'
  | 'etiqueta-emotiva'
  | 'roadmap'
  | 'ideas-board'
  | 'integraciones-pagos'
  | 'integraciones-logistica'
  | 'integraciones-tiendas'
  | 'integraciones-rrss'
  | 'integraciones-servicios'
  // ── Workspace Suite ──────────────────────────────────────────────────────────
  | 'biblioteca'
  | 'editor-imagenes'
  | 'gen-documentos'
  | 'gen-presupuestos'
  | 'ocr'
  | 'impresion'
  // ── Auditoría & Diagnóstico ───────────────────────────────────────────────────
  | 'auditoria'
  | 'auditoria-health'
  | 'auditoria-logs'
  // ── Repositorio de APIs ───────────────────────────────────────────────────────
  | 'integraciones-apis'
  // ── Constructor ───────────────────────────────────────────────────────────────
  | 'constructor'
  // ── Nuevos módulos v2 ─────────────────────────────────────────────────────────
  | 'auth-registro'
  | 'carga-masiva'
  | 'meta-business'
  | 'unified-workspace'
  // ── Sistema: Dashboards + Config + Docs ───────────────────────────────────────
  | 'dashboard-admin'
  | 'dashboard-usuario'
  | 'config-vistas'
  | 'documentacion'
  | 'metamap-config';

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState<MainSection>('dashboard');
  const nav = (s: MainSection) => setActiveSection(s);

  return (
    <>
      <Toaster position="top-right" richColors />
      <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', backgroundColor: '#F8F9FA', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif' }}>
        <AdminSidebar activeSection={activeSection} onNavigate={nav} />
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
          {activeSection === 'dashboard'       && <DashboardView      onNavigate={nav} />}
          {activeSection === 'ecommerce'       && <EcommerceView      onNavigate={nav} />}
          {activeSection === 'marketing'       && <MarketingView      onNavigate={nav} />}
          {activeSection === 'herramientas'    && <HerramientasView   onNavigate={nav} />}
          {activeSection === 'qr-generator'    && <QrGeneratorView    onNavigate={nav} />}
          {activeSection === 'gestion'         && <GestionView        onNavigate={nav} />}
          {activeSection === 'pos'             && <POSView            onNavigate={nav} />}
          {activeSection === 'sistema'         && <SistemaView        onNavigate={nav} />}
          {activeSection === 'diseno'          && <DisenoView         onNavigate={nav} />}
          {activeSection === 'checklist'       && <ChecklistView      onNavigate={nav} />}
          {activeSection === 'roadmap'         && <ChecklistView      onNavigate={nav} />}
          {activeSection === 'integraciones'   && <IntegracionesView  onNavigate={nav} />}
          {activeSection === 'migracion-rrss'  && <MigracionRRSSView  onNavigate={nav} />}
          {activeSection === 'mailing'         && <MailingView        onNavigate={nav} />}
          {activeSection === 'google-ads'      && <GoogleAdsView      onNavigate={nav} />}
          {activeSection === 'rueda-sorteos'   && <RuedaSorteosView   onNavigate={nav} />}
          {activeSection === 'fidelizacion'    && <FidelizacionView   onNavigate={nav} />}
          {activeSection === 'redes-sociales'  && <RedesSocialesView  onNavigate={nav} />}
          {activeSection === 'rrss'            && <RRSSHubView        onNavigate={nav} />}
          {activeSection === 'departamentos'   && <DepartamentosView  onNavigate={nav} />}
          {activeSection === 'secondhand'      && <SecondHandView     onNavigate={nav} />}
          {activeSection === 'erp-inventario'  && <ERPInventarioView  onNavigate={nav} />}
          {activeSection === 'erp-facturacion' && <ERPFacturacionView onNavigate={nav} />}
          {activeSection === 'erp-compras'     && <ERPComprasView     onNavigate={nav} />}
          {activeSection === 'erp-crm'         && <ERPCRMView         onNavigate={nav} />}
          {activeSection === 'erp-contabilidad'&& <ERPContabilidadView onNavigate={nav} />}
          {activeSection === 'erp-rrhh'        && <ERPRRHHView        onNavigate={nav} />}
          {activeSection === 'proyectos'       && <ProyectosView      onNavigate={nav} />}
          {activeSection === 'personas'        && <PersonasView        onNavigate={nav} />}
          {activeSection === 'organizaciones'  && <OrganizacionesView  onNavigate={nav} />}
          {activeSection === 'clientes'        && <ClientesView        onNavigate={nav} />}
          {activeSection === 'pedidos'         && <PedidosView         onNavigate={nav} />}
          {activeSection === 'metodos-pago'    && <MetodosPagoView     onNavigate={nav} />}
          {activeSection === 'metodos-envio'   && <MetodosEnvioView    onNavigate={nav} />}
          {activeSection === 'pagos'           && <PagosView           onNavigate={nav} />}
          {activeSection === 'envios'          && <EnviosView          onNavigate={nav} />}
          {activeSection === 'logistica'       && <LogisticaView       onNavigate={nav} />}
          {activeSection === 'transportistas'  && <TransportistasView  onNavigate={nav} />}
          {activeSection === 'rutas'           && <RutasView           onNavigate={nav} />}
          {activeSection === 'produccion'      && <ProduccionView      onNavigate={nav} />}
          {activeSection === 'abastecimiento'  && <AbastecimientoView  onNavigate={nav} />}
          {activeSection === 'mapa-envios'     && <MapaEnviosView      onNavigate={nav} />}
          {activeSection === 'tracking-publico'&& <TrackingPublicoView onNavigate={nav} />}
          {activeSection === 'fulfillment'     && <FulfillmentView     onNavigate={nav} />}
          {activeSection === 'seo'             && <SEOView             onNavigate={nav} />}
          {activeSection === 'etiqueta-emotiva'&& <EtiquetaEmotivaView onNavigate={nav} />}
          {activeSection === 'ideas-board'             && <IdeasBoardView             onNavigate={nav} />}
          {activeSection === 'integraciones-pagos'     && <IntegracionesPagosView     onNavigate={nav} />}
          {activeSection === 'integraciones-logistica' && <IntegracionesLogisticaView onNavigate={nav} />}
          {activeSection === 'integraciones-tiendas'   && <IntegracionesTiendasView   onNavigate={nav} />}
          {activeSection === 'integraciones-rrss'      && <IntegracionesRRSSView      onNavigate={nav} />}
          {activeSection === 'integraciones-servicios' && <IntegracionesServiciosView onNavigate={nav} />}
          {/* ── Workspace Suite ── */}
          {activeSection === 'biblioteca'              && <BibliotecaWorkspace        onNavigate={nav} />}
          {activeSection === 'editor-imagenes'         && <EditorImagenesWorkspace    onNavigate={nav} />}
          {activeSection === 'gen-documentos'          && <GenDocumentosWorkspace     onNavigate={nav} />}
          {activeSection === 'gen-presupuestos'        && <GenPresupuestosWorkspace   onNavigate={nav} />}
          {activeSection === 'ocr'                     && <OCRWorkspace               onNavigate={nav} />}
          {activeSection === 'impresion'               && <ImpresionWorkspace         onNavigate={nav} />}
          {/* ── Auditoría & Diagnóstico ── */}
          {activeSection === 'auditoria'               && <AuditoriaHubView           onNavigate={nav} />}
          {activeSection === 'auditoria-health'        && <HealthMonitorView          onNavigate={nav} />}
          {activeSection === 'auditoria-logs'          && <SystemLogsView             onNavigate={nav} />}
          {/* ── Repositorio de APIs ── */}
          {activeSection === 'integraciones-apis'      && <RepositorioAPIsView        onNavigate={nav} />}
          {/* ── Constructor ── */}
          {activeSection === 'constructor'             && <ConstructorView            onNavigate={nav} />}
          {/* ── Nuevos módulos v2 ── */}
          {activeSection === 'auth-registro'           && <AuthRegistroView           onNavigate={nav} />}
          {activeSection === 'carga-masiva'            && <CargaMasivaView            onNavigate={nav} />}
          {activeSection === 'meta-business'           && <MetaBusinessView           onNavigate={nav} />}
          {activeSection === 'unified-workspace'       && <UnifiedWorkspaceView       onNavigate={nav} />}
          {/* ── Sistema: Dashboards + Config + Docs ── */}
          {activeSection === 'dashboard-admin'         && <AdminDashboardView         onNavigate={nav} />}
          {activeSection === 'dashboard-usuario'       && <UserDashboardView          onNavigate={nav} />}
          {activeSection === 'config-vistas'           && <ConfigVistasPorRolView     onNavigate={nav} />}
          {activeSection === 'documentacion'           && <DocumentacionView          onNavigate={nav} />}
          {activeSection === 'metamap-config'          && <MetaMapView                onNavigate={nav} />}
          {activeSection === 'orquestador' && <OrquestadorView onNavigate={nav} />}
        </main>
      </div>
    </>
  );
}

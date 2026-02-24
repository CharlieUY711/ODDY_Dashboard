/* =====================================================
   stubs.tsx — Re-exports & fallback stubs
   ===================================================== */
import React from 'react';
import { GenericView } from '@/app/components/admin/GenericView';
import type { MainSection } from '@/app/AdminDashboard';
import { Sparkles } from 'lucide-react';

// ── Re-exportamos las vistas ya implementadas ──────────────
export { ClientesView }              from './ClientesView';
export { ERPInventarioView }         from './ERPInventarioView';
export { ERPCRMView }                from './ERPCRMView';
export { ProyectosView }             from './ProyectosView';
export { ChecklistView }             from './ChecklistView';
export { MetaBusinessView }          from './MetaBusinessView';
export { ERPFacturacionView }        from './ERPFacturacionView';
export { ERPRRHHView }               from './ERPRRHHView';
export { PedidosView }               from './PedidosView';

// ── Vistas con implementación real en sus propios archivos ─
export { POSView }                   from './POSView';
export { MailingView }               from './MailingView';
export { GoogleAdsView }             from './GoogleAdsView';
export { RuedaSorteosView }          from './RuedaSorteosView';
export { FidelizacionView }          from './FidelizacionView';
export { RedesSocialesView }         from './RedesSocialesView';
export { DepartamentosView }         from './DepartamentosView';
export { SecondHandView }            from './SecondHandView';
export { ERPComprasView }            from './ERPComprasView';
export { ERPContabilidadView }       from './ERPContabilidadView';
export { PersonasView }              from './PersonasView';
export { OrganizacionesView }        from './OrganizacionesView';
export { MetodosPagoView }           from './MetodosPagoView';
export { MetodosEnvioView }          from './MetodosEnvioView';
export { PagosView }                 from './PagosView';
export { EnviosView }                from './EnviosView';
export { EtiquetaEmotivaView }       from './EtiquetaEmotivaView';
export { TransportistasView }        from './TransportistasView';
export { RutasView }                 from './RutasView';
export { FulfillmentView }           from './FulfillmentView';
export { ProduccionView }            from './ProduccionView';
export { AbastecimientoView }        from './AbastecimientoView';
export { MapaEnviosView }            from './MapaEnviosView';
export { TrackingPublicoView }       from './TrackingPublicoView';
export { SEOView }                   from './SEOView';
export { MigracionRRSSView }         from './MigracionRRSSView';
export { IntegracionesPagosView }    from './IntegracionesPagosView';
export { IntegracionesLogisticaView } from './IntegracionesLogisticaView';
export { IntegracionesTiendasView }  from './IntegracionesTiendasView';
export { HealthMonitorView }         from './HealthMonitorView';
export { SystemLogsView }            from './SystemLogsView';
export { BibliotecaWorkspace }       from './BibliotecaWorkspaceView';
export { GenPresupuestosWorkspace }  from './GenPresupuestosView';
export { QrGeneratorView }           from './QrGeneratorView';

// ── Nuevas vistas implementadas en sus propios archivos ────
export { IntegracionesRRSSView }     from './IntegracionesRRSSView';
export { IntegracionesServiciosView } from './IntegracionesServiciosView';
export { IdeasBoardView }            from './IdeasBoardView';
export { EditorImagenesWorkspace }   from './EditorImagenesWorkspace';
export { GenDocumentosWorkspace }    from './GenDocumentosWorkspace';
export { OCRWorkspace }              from './OCRWorkspace';
export { ImpresionWorkspace }        from './ImpresionWorkspace';
export { RepositorioAPIsView }       from './RepositorioAPIsView';
export { ConstructorView }           from './ConstructorView';
export { AuthRegistroView }          from './AuthRegistroView';
export { CargaMasivaView }           from './CargaMasivaView';
export { UnifiedWorkspaceView }      from './UnifiedWorkspaceView';
export { AdminDashboardView }        from './AdminDashboardView';
export { UserDashboardView }         from './UserDashboardView';
export { ConfigVistasPorRolView }    from './ConfigVistasPorRolView';
export { DocumentacionView }         from './DocumentacionView';
export { MetaMapView }               from './MetaMapView';

// ── Único stub restante sin archivo propio ─────────────────
interface Props { onNavigate: (s: MainSection) => void; }

export function DisenoView({ onNavigate }: Props) {
  return <GenericView icon={Sparkles} title="Diseño & Pruebas" subtitle="Espacio visual de pruebas del sistema" backSection="sistema" onNavigate={onNavigate}
    features={['Vista previa de módulos', 'Paleta de colores', 'Componentes UI', 'Modo dark/light']} status="beta" />;
}

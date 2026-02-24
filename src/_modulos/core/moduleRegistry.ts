/**
 * MODULE REGISTRY — Charlie Marketplace Builder v1.5
 * ═══════════════════════════════════════════════════
 * ⚠️  NO EDITAR ESTE ARCHIVO MANUALMENTE.
 *
 * Todo se auto-genera desde /src/app/utils/moduleManifest.ts.
 * Para agregar un módulo nuevo:
 *   1. Agregar la entrada en MODULE_MANIFEST (moduleManifest.ts)
 *   2. Listo — BUILT_SECTIONS, SECTION_TO_MODULE_IDS y BUILT_MODULE_IDS
 *      se actualizan solos en el próximo render.
 */

import type { MainSection } from '../AdminDashboard';
import { MODULE_MANIFEST } from './moduleManifest';

/** Todas las secciones que tienen una entrada en el manifest (hub o real) */
export const BUILT_SECTIONS: MainSection[] = MODULE_MANIFEST.map(e => e.section);

/**
 * Mapeo MainSection → IDs exactos de MODULES_DATA.
 * Solo incluye secciones marcadas como isReal=true con checklistIds no vacíos.
 */
export const SECTION_TO_MODULE_IDS: Partial<Record<MainSection, string[]>> =
  MODULE_MANIFEST
    .filter(e => e.isReal && e.checklistIds.length > 0)
    .reduce<Partial<Record<MainSection, string[]>>>((acc, e) => {
      const existing = acc[e.section] ?? [];
      const merged = Array.from(new Set([...existing, ...e.checklistIds]));
      return { ...acc, [e.section]: merged };
    }, {});

/** Set de IDs de módulos construidos — O(1) lookup en applyBuiltStatus() */
export const BUILT_MODULE_IDS = new Set<string>(
  MODULE_MANIFEST
    .filter(e => e.isReal)
    .flatMap(e => e.checklistIds)
);

/**
 * Set de IDs que además tienen hasSupabase=true en el manifest.
 */
export const SUPABASE_MODULE_IDS = new Set<string>(
  MODULE_MANIFEST
    .filter(e => e.isReal && e.hasSupabase === true)
    .flatMap(e => e.checklistIds)
);

/** true si la sección tiene una entrada en el manifest */
export const isBuilt = (s: MainSection) => BUILT_SECTIONS.includes(s);

/** Estadísticas globales del registry */
export const getBuildProgress = () => {
  const total   = BUILT_SECTIONS.length;
  const mapped  = BUILT_SECTIONS.filter(s => s in SECTION_TO_MODULE_IDS).length;
  const hubs    = MODULE_MANIFEST.filter(e => !e.isReal).length;
  const real    = MODULE_MANIFEST.filter(e => e.isReal).length;
  const withDB  = MODULE_MANIFEST.filter(e => e.isReal && e.hasSupabase).length;
  return { builtSections: total, mappedToChecklist: mapped, hubs, real, withDB };
};

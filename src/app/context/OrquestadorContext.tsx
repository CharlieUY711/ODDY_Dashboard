/* =====================================================
   OrquestadorContext — Configuración dinámica del shell
   ===================================================== */
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface OrcConfig {
  cliente: string;
  nombre: string;
  shell: string;
  theme: {
    primary: string;
    secondary: string;
    nombre: string;
  };
  modulos: string[];
  backend: Record<string, any>;
}

interface OrquestadorContextType {
  config: OrcConfig | null;
  loading: boolean;
  error: string | null;
}

const OrquestadorContext = createContext<OrquestadorContextType | null>(null);

interface OrquestadorProviderProps {
  children: ReactNode;
}

export function OrquestadorProvider({ children }: OrquestadorProviderProps) {
  const [config, setConfig] = useState<OrcConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const domain = window.location.hostname;
        const url = `https://qhnmxvexkizcsmivfuam.supabase.co/functions/v1/get-config?domain=${domain}`;
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFobm14dmV4a2l6Y3NtaXZmdWFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyMjEyODEsImV4cCI6MjA4Njc5NzI4MX0.Ifz4fJYldIGZFzhBK5PPxQeqdYzO2ZKNQ5uo8j2mYmM';

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Error al obtener configuración: ${response.status}`);
        }

        const data = await response.json();
        // Asegurar que modulos sea siempre un array
        if (data && typeof data === 'object') {
          if (!Array.isArray(data.modulos)) {
            // Si modulos no es un array, usar array vacío (fallback)
            data.modulos = [];
          }
        }
        setConfig(data);
        setError(null);
      } catch (err) {
        console.error('Error al cargar configuración del orquestador:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
        // En caso de error, config se mantiene en null para usar fallback
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  return (
    <OrquestadorContext.Provider value={{ config, loading, error }}>
      {children}
    </OrquestadorContext.Provider>
  );
}

export function useOrquestador() {
  const context = useContext(OrquestadorContext);
  if (!context) {
    throw new Error('useOrquestador debe usarse dentro de OrquestadorProvider');
  }
  return context;
}

/* =====================================================
   Charlie Marketplace Builder v1.5
   App Root — React Router v7 Data Mode
   ===================================================== */
import { RouterProvider } from 'react-router';
import { router } from './routes';
import { OrquestadorProvider, useOrquestador } from './context/OrquestadorContext';

function LoadingScreen() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      width: '100vw',
      backgroundColor: '#F8F9FA',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
    }}>
      <div style={{
        width: '48px',
        height: '48px',
        border: '4px solid #E5E7EB',
        borderTop: '4px solid #FF6835',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        marginBottom: '16px',
      }} />
      <p style={{
        color: '#6B7280',
        fontSize: '0.875rem',
        fontWeight: '500',
        margin: 0,
      }}>
        Cargando configuración...
      </p>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

function AppContent() {
  const { loading } = useOrquestador();

  if (loading) {
    return <LoadingScreen />;
  }

  return <RouterProvider router={router} />;
}

export default function App() {
  return (
    <OrquestadorProvider>
      <AppContent />
    </OrquestadorProvider>
  );
}

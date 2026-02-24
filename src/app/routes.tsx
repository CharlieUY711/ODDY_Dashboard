/* =====================================================
   Charlie Marketplace Builder — Router Config (React Router v7)
   ===================================================== */
import { createBrowserRouter, Navigate } from 'react-router';
import AdminDashboard from './AdminDashboard';

export const router = createBrowserRouter([
  /* ── Raíz — redirige a admin ─────────────────── */
  {
    path: '/',
    element: <Navigate to="/admin" replace />,
  },

  /* ── Admin ─────────────────────────────────── */
  {
    path: '/admin',
    Component: AdminDashboard,
  },
]);

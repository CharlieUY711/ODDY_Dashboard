/* =====================================================
   Charlie Marketplace Builder v1.5
   App Root — React Router v7 Data Mode
   ===================================================== */
import { RouterProvider } from 'react-router';
import { router } from './routes';

export default function App() {
  return <RouterProvider router={router} />;
}

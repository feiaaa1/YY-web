import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Layout from '@/components/Layout';

// Lazy loading pages
const HomePage = lazy(() => import('@/pages/Home/index'));
const CasesPage = lazy(() => import('@/pages/Cases/index'));
const CaseDetailPage = lazy(() => import('@/pages/CaseDetail/index'));
const NotFoundPage = lazy(() => import('@/pages/NotFound/index'));

// Helper for lazy loading fallback
const Lazy = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--ink)' }}>
      <div className="w-8 h-8 rounded-full border-2 animate-spin" style={{ borderColor: 'var(--gold)', borderTopColor: 'transparent' }} />
    </div>
  }>
    {children}
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Lazy><HomePage /></Lazy>,
      },
      {
        path: '/cases',
        element: <Lazy><CasesPage /></Lazy>,
      },
      {
        path: '/case/:id',
        element: <Lazy><CaseDetailPage /></Lazy>,
      },
    ],
  },
  {
    path: '*',
    element: <Lazy><NotFoundPage /></Lazy>,
  },
]);

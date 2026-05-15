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
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
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

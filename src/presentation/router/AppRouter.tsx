import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '../views/components/MainLayout';
import { ThreadListPage } from '../views/pages/ThreadListPage';
import { ThreadDetailPage } from '../views/pages/ThreadDetailPage';

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/inbox" replace />} />
          <Route path="/:grouping" element={<ThreadListPage />} />
          <Route path="/:grouping/thread/:threadId" element={<ThreadDetailPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
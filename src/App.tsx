import { Route, Routes } from 'react-router-dom';
import { AppLayout } from '@/app/layout/AppLayout';
import { Home } from '@/features/home/Home';
import { Items } from '@/features/items/Items';

export function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/items" element={<Items />} />
      </Routes>
    </AppLayout>
  );
}

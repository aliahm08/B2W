import { Navigate, Route, Routes } from 'react-router-dom';
import SiteLayout from './components/SiteLayout';
import BusinessOwnersPage from './pages/BusinessOwnersPage';
import EnterprisesPage from './pages/EnterprisesPage';
import FederalAgenciesPage from './pages/FederalAgenciesPage';
import HomePage from './pages/HomePage';

export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/business-owners" element={<BusinessOwnersPage />} />
        <Route path="/enterprises" element={<EnterprisesPage />} />
        <Route path="/federal-agencies" element={<FederalAgenciesPage />} />
        <Route path="/individuals" element={<Navigate to="/business-owners" replace />} />
        <Route path="/government-solutions" element={<Navigate to="/federal-agencies" replace />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

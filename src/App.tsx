import { Navigate, Route, Routes } from 'react-router-dom';
import SiteLayout from './components/SiteLayout';
import EnterprisesPage from './pages/EnterprisesPage';
import GovernmentPage from './pages/GovernmentPage';
import HomePage from './pages/HomePage';
import IndividualsPage from './pages/IndividualsPage';

export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/individuals" element={<IndividualsPage />} />
        <Route path="/enterprises" element={<EnterprisesPage />} />
        <Route path="/government" element={<GovernmentPage />} />

        <Route path="/business-owners" element={<Navigate to="/individuals" replace />} />
        <Route path="/federal-agencies" element={<Navigate to="/government" replace />} />
        <Route path="/government-solutions" element={<Navigate to="/government" replace />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

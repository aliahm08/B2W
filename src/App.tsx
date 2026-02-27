import { Navigate, Route, Routes } from 'react-router-dom';
import SiteLayout from './components/SiteLayout';
import EnterprisesPage from './pages/EnterprisesPage';
import GovernmentSolutionsPage from './pages/GovernmentSolutionsPage';
import HomePage from './pages/HomePage';
import IndividualsPage from './pages/IndividualsPage';

export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/individuals" element={<IndividualsPage />} />
        <Route path="/enterprises" element={<EnterprisesPage />} />
        <Route path="/government-solutions" element={<GovernmentSolutionsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MenuPage from './pages/MenuPage';
import OwnerDashboard from './pages/OwnerDashboard';
import KitchenDisplay from './pages/KitchenDisplay';
import AdminPanel from './pages/AdminPanel';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import QRCodeGenerator from './pages/QRCodeGenerator';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Navigate to="/menu" replace />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/admin" element={<OwnerDashboard />} />
          <Route path="/manage" element={<AdminPanel />} />
          <Route path="/analytics" element={<AnalyticsDashboard />} />
          <Route path="/qr" element={<QRCodeGenerator />} />
          <Route path="/kitchen" element={<KitchenDisplay />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing.jsx';
import WesLayout from './components/WesLayout.jsx';
import WesNationalLayout from './components/WesNationalLayout.jsx';
import WesHome from './pages/wes-lab/WesHome.jsx';
import WesResponse from './pages/wes-lab/WesResponse.jsx';
import WesSummary from './pages/wes-lab/WesSummary.jsx';
import WesNationalHome from './pages/wes-national/WesNationalHome.jsx';
import WesNationalResponse from './pages/wes-national/WesNationalResponse.jsx';
import WesNationalSummary from './pages/wes-national/WesNationalSummary.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />

        {/* WES Laboratory */}
        <Route path="/wes-lab"          element={<WesLayout><WesHome /></WesLayout>} />
        <Route path="/wes-lab/response" element={<WesLayout><WesResponse /></WesLayout>} />
        <Route path="/wes-lab/summary"  element={<WesLayout><WesSummary /></WesLayout>} />

        {/* WES National */}
        <Route path="/wes-national"          element={<WesNationalLayout><WesNationalHome /></WesNationalLayout>} />
        <Route path="/wes-national/response" element={<WesNationalLayout><WesNationalResponse /></WesNationalLayout>} />
        <Route path="/wes-national/summary"  element={<WesNationalLayout><WesNationalSummary /></WesNationalLayout>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

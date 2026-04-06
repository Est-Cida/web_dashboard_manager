import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing.jsx';
import WesLayout from './components/WesLayout.jsx';
import WesHome from './pages/wes-lab/WesHome.jsx';
import WesResponse from './pages/wes-lab/WesResponse.jsx';
import WesSummary from './pages/wes-lab/WesSummary.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/wes-lab" element={<WesLayout><WesHome /></WesLayout>} />
        <Route path="/wes-lab/response" element={<WesLayout><WesResponse /></WesLayout>} />
        <Route path="/wes-lab/summary" element={<WesLayout><WesSummary /></WesLayout>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

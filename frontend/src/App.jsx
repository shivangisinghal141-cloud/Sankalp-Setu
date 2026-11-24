import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { EcosystemProvider } from './context/EcosystemContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { LandingPage } from './pages/LandingPage';
import { CitizenDashboard } from './pages/CitizenDashboard';
import { GovernmentDashboard } from './pages/GovernmentDashboard';
import { UniversityDashboard } from './pages/UniversityDashboard';
import { CsrDashboard } from './pages/CsrDashboard';
import { AdminDashboard } from './pages/AdminDashboard';

export function App() {
  return (
    <EcosystemProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans selection:bg-gov-navy selection:text-white">
          <Header />
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/citizen/dashboard" element={<CitizenDashboard />} />
              <Route path="/government/dashboard" element={<GovernmentDashboard />} />
              <Route path="/university/dashboard" element={<UniversityDashboard />} />
              <Route path="/csr/dashboard" element={<CsrDashboard />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </EcosystemProvider>
  );
}

export default App;

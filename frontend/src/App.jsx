// Main App Component
// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import Editor from './components/Editor';
import Contact from './pages/support/Contact';
import Terms from './pages/legal/Terms';
import HelpCenter from './pages/support/HelpCenter';
import TemplatesPage from './pages/marketing/TemplatePage';
import FeaturesPage from './pages/marketing/FeaturesPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/help" element={<HelpCenter />} />
        <Route path="/templates" element={<TemplatesPage />} />
        <Route path="/features" element={<FeaturesPage />} />

        <Route path="/login" element={<AuthPage />} />
        <Route path="/register" element={<AuthPage />} />
        <Route path="/editor" element={<Editor />} />

        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </BrowserRouter>
  );
}
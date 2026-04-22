// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GlobalStyles } from '@mui/material';

// Pages
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import Contact from './pages/support/Contact';
import Terms from './pages/legal/Terms';
import HelpCenter from './pages/support/HelpCenter';
import TemplatesPage from './pages/marketing/TemplatePage';
import FeaturesPage from './pages/marketing/FeaturesPage';

// Components
import Editor from './components/Editor';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <>
      <GlobalStyles
        styles={{
          html: {
            margin: 0,
            padding: 0,
            overscrollBehaviorY: 'none',
            backgroundColor: '#050505',
          },
          body: {
            margin: 0,
            padding: 0,
            overscrollBehaviorY: 'none',
          },
        }}
      />
      <BrowserRouter>
        <Routes>
          {/* Marketing & Support Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/templates" element={<TemplatesPage />} />
          <Route path="/features" element={<FeaturesPage />} />

          {/* Auth Routes */}
          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<AuthPage />} />
          <Route path="/forgot-password" element={<AuthPage />} />

          {/* Protected Routes */}
          <Route
            path="/editor"
            element={
              <ProtectedRoute>
                <Editor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/editor/:id"
            element={
              <ProtectedRoute>
                <Editor />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

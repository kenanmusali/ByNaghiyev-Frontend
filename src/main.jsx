import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './assets/root.css';
import App from './App.jsx';
import NotFound from './components/notfound.jsx';
import { LanguageProvider } from './context/LanguageContext.jsx';  

function AdminRedirect() {
  window.location.href = 'https://bynaghiyev-admin.vercel.app/';
  return null;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LanguageProvider>
      <Router>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/admin" element={<AdminRedirect />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </LanguageProvider>
  </StrictMode>
);
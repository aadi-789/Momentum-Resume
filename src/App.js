import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';

import { ThemeProvider } from './context/ThemeContext';
import LandingPage from './LandingPage';
import ResumeEditor from './features/resume/ResumeEditor';

const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <div style={{ backgroundColor: 'var(--color-background)', minHeight: '100vh' }}>
          <Routes>
            {/* Default route - LandingPage */}
            <Route path="/" element={<LandingPage />} />

            {/* Resume builder route */}
            <Route path="/builder" element={<ResumeEditor />} />

            {/* Redirect any unknown routes to home */}
            <Route path="*" element={<Navigate replace to="/" />} />
          </Routes>
        </div>

        <Analytics />
      </Router>
    </ThemeProvider>
  );
};

export default App;

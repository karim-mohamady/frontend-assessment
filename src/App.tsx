/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { Assessment } from './pages/Assessment';
import { Report } from './pages/Report';
import { CodingSandbox } from './pages/CodingSandbox';

export default function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans transition-colors duration-200">
          
          {/* Header Navigation Bar */}
          <Navbar />

          {/* Main Routing Stage */}
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<RouteTransition><Dashboard /></RouteTransition>} />
              <Route path="/assessment" element={<RouteTransition><Assessment /></RouteTransition>} />
              <Route path="/report" element={<RouteTransition><Report /></RouteTransition>} />
              <Route path="/sandbox" element={<RouteTransition><CodingSandbox /></RouteTransition>} />
            </Routes>
          </main>

          {/* Persistent Site Footer */}
          <Footer />

        </div>
      </Router>
    </AppProvider>
  );
}

// Quick micro-fade transition wrapper using Tailwind transitions
const RouteTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="animate-fade-in transition-opacity duration-300">
      {children}
    </div>
  );
};

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
import { InterviewPrep } from './pages/InterviewPrep';
import { Revision } from './pages/Revision';
import { SystemDesignStudio } from './pages/SystemDesignStudio';
import { GlobalEnglishPlacement } from './pages/GlobalEnglishPlacement';
import { WebTestingStudio } from './pages/WebTestingStudio';
import { DatabaseSchemaStudio } from './pages/DatabaseSchemaStudio';
import { DevOpsStudio } from './pages/DevOpsStudio';
import { Web3Studio } from './pages/Web3Studio';
import { AlgorithmVisualizer } from './pages/AlgorithmVisualizer';
import { CyberSecurityStudio } from './pages/CyberSecurityStudio';

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
              <Route path="/revision" element={<RouteTransition><Revision /></RouteTransition>} />
              <Route path="/report" element={<RouteTransition><Report /></RouteTransition>} />
              <Route path="/sandbox" element={<RouteTransition><CodingSandbox /></RouteTransition>} />
              <Route path="/interview" element={<RouteTransition><InterviewPrep /></RouteTransition>} />
              <Route path="/system-design" element={<RouteTransition><SystemDesignStudio /></RouteTransition>} />
              <Route path="/english-placement" element={<RouteTransition><GlobalEnglishPlacement /></RouteTransition>} />
              <Route path="/qa-testing" element={<RouteTransition><WebTestingStudio /></RouteTransition>} />
              <Route path="/db-designer" element={<RouteTransition><DatabaseSchemaStudio /></RouteTransition>} />
              <Route path="/devops" element={<RouteTransition><DevOpsStudio /></RouteTransition>} />
              <Route path="/web3" element={<RouteTransition><Web3Studio /></RouteTransition>} />
              <Route path="/algorithms" element={<RouteTransition><AlgorithmVisualizer /></RouteTransition>} />
              <Route path="/cyber-security" element={<RouteTransition><CyberSecurityStudio /></RouteTransition>} />
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

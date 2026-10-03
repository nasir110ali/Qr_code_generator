/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { QrGenerator } from './components/QrGenerator';
import { HowItWorks } from './components/HowItWorks';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { AdPlaceholder } from './components/AdPlaceholder';
import { StaticPageModal } from './components/StaticPageModal';
import { PageId } from './types';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId | null>(null);

  // Sync with URL Hash for direct linking (e.g., #about, #privacy)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (['about', 'contact', 'privacy', 'terms'].includes(hash)) {
        setCurrentPage(hash as PageId);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleOpenPage = (page: PageId) => {
    setCurrentPage(page);
    window.location.hash = page;
  };

  const handleClosePage = () => {
    setCurrentPage(null);
    if (window.location.hash && ['#about', '#contact', '#privacy', '#terms'].includes(window.location.hash)) {
      history.pushState('', document.title, window.location.pathname + window.location.search);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Top Navigation */}
      <Navbar onOpenPage={handleOpenPage} />

      {/* Top Banner Advertisement Placeholder */}
      <div className="w-full bg-white border-b border-slate-100">
        <AdPlaceholder slot="leaderboard" />
      </div>

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Core QR Generator */}
        <QrGenerator />

        {/* Middle Advertisement Placeholder */}
        <div className="bg-slate-50 py-2">
          <AdPlaceholder slot="leaderboard" />
        </div>

        {/* How QR Codes Work Section */}
        <HowItWorks />

        {/* FAQ Section */}
        <FaqSection />

        {/* Bottom Pre-Footer Advertisement Placeholder */}
        <div className="bg-white py-6 border-t border-slate-200">
          <AdPlaceholder slot="leaderboard" />
        </div>
      </main>

      {/* Footer */}
      <Footer onOpenPage={handleOpenPage} />

      {/* Static Pages Modal (About, Contact, Privacy, Terms) */}
      <StaticPageModal currentPage={currentPage} onClose={handleClosePage} />
    </div>
  );
}

import React, { useState } from 'react';
import { QrCode, Menu, X, Sparkles, HelpCircle, Info, Mail } from 'lucide-react';
import { PageId } from '../types';

interface NavbarProps {
  onOpenPage: (page: PageId) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenPage }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-500 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-900">
                  Quick<span className="text-blue-600">QR</span>
                </span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                  Free
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Instant QR Code Generator
              </p>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <a href="#generator" className="hover:text-blue-600 transition-colors">
              Generator
            </a>
            <a href="#how-it-works" className="hover:text-blue-600 transition-colors">
              How It Works
            </a>
            <a href="#faq" className="hover:text-blue-600 transition-colors">
              FAQ
            </a>
            <button
              onClick={() => onOpenPage('about')}
              className="hover:text-blue-600 transition-colors cursor-pointer"
            >
              About
            </button>
            <button
              onClick={() => onOpenPage('contact')}
              className="hover:text-blue-600 transition-colors cursor-pointer"
            >
              Contact
            </button>
          </nav>

          {/* Right Action */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href="#generator"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all shadow-blue-500/20 hover:shadow-blue-500/30"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Create QR Now</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2 text-sm font-medium">
          <a
            href="#generator"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100"
          >
            QR Generator
          </a>
          <a
            href="#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100"
          >
            How It Works
          </a>
          <a
            href="#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100"
          >
            FAQ
          </a>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenPage('about');
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100"
          >
            About
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenPage('contact');
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100"
          >
            Contact
          </button>
          <div className="pt-2">
            <a
              href="#generator"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-center py-2.5 bg-blue-600 text-white rounded-lg font-medium text-sm"
            >
              Generate Free QR Code
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

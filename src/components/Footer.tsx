import React from 'react';
import { QrCode, Heart, Shield, Lock, ExternalLink } from 'lucide-react';
import { PageId } from '../types';

interface FooterProps {
  onOpenPage: (page: PageId) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPage }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-400 text-sm border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Column */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-lg">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <QrCode className="w-5 h-5" />
              </div>
              <span>QuickQR</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Fast, free, and private QR code generator. Create high-resolution custom color QR codes for digital displays and physical prints.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>100% Client-Side Privacy</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">
              Generator
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#generator" className="hover:text-white transition-colors">
                  Create URL QR Code
                </a>
              </li>
              <li>
                <a href="#generator" className="hover:text-white transition-colors">
                  Text & Notes QR Code
                </a>
              </li>
              <li>
                <a href="#generator" className="hover:text-white transition-colors">
                  Wi-Fi Login QR Code
                </a>
              </li>
              <li>
                <a href="#generator" className="hover:text-white transition-colors">
                  Contact vCard QR Code
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">
              Resources
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#how-it-works" className="hover:text-white transition-colors">
                  How QR Codes Work
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors">
                  Frequently Asked Questions
                </a>
              </li>
              <li>
                <button
                  onClick={() => onOpenPage('about')}
                  className="hover:text-white transition-colors text-left"
                >
                  About QuickQR
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPage('contact')}
                  className="hover:text-white transition-colors text-left"
                >
                  Contact & Support
                </button>
              </li>
            </ul>
          </div>

          {/* Legal Pages */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">
              Legal & Privacy
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onOpenPage('privacy')}
                  className="hover:text-white transition-colors text-left"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPage('terms')}
                  className="hover:text-white transition-colors text-left"
                >
                  Terms of Use
                </button>
              </li>
              <li className="pt-2 text-[11px] text-slate-400">
                Static codes generated are owned exclusively by you with zero royalties.
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="pt-8 mt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © {currentYear} QuickQR. Free & Open QR Code Generator. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => onOpenPage('privacy')}
              className="hover:text-slate-200 transition-colors"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button
              onClick={() => onOpenPage('terms')}
              className="hover:text-slate-200 transition-colors"
            >
              Terms of Use
            </button>
            <span>•</span>
            <button
              onClick={() => onOpenPage('contact')}
              className="hover:text-slate-200 transition-colors"
            >
              Contact
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

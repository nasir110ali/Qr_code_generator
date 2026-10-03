import React, { useState } from 'react';
import { X, ShieldCheck, Mail, FileText, Info, CheckCircle2, Send } from 'lucide-react';
import { PageId } from '../types';

interface StaticPageModalProps {
  currentPage: PageId | null;
  onClose: () => void;
}

export const StaticPageModal: React.FC<StaticPageModalProps> = ({ currentPage, onClose }) => {
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });

  if (!currentPage) return null;

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.email || !contactForm.message) return;
    setContactSubmitted(true);
    setTimeout(() => {
      setContactForm({ name: '', email: '', subject: '', message: '' });
      setContactSubmitted(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            {currentPage === 'about' && <Info className="w-5 h-5 text-blue-600" />}
            {currentPage === 'contact' && <Mail className="w-5 h-5 text-blue-600" />}
            {currentPage === 'privacy' && <ShieldCheck className="w-5 h-5 text-blue-600" />}
            {currentPage === 'terms' && <FileText className="w-5 h-5 text-blue-600" />}
            <h2 className="text-xl font-bold text-slate-900 capitalize">
              {currentPage === 'about' && 'About QuickQR'}
              {currentPage === 'contact' && 'Contact Us'}
              {currentPage === 'privacy' && 'Privacy Policy'}
              {currentPage === 'terms' && 'Terms of Use'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 text-slate-600 text-sm leading-relaxed space-y-4">
          {currentPage === 'about' && (
            <div className="space-y-4">
              <p className="text-base text-slate-700 font-medium">
                QuickQR was built to provide a modern, completely free, privacy-first QR code generator for creators, small businesses, educators, and everyday users.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-4 my-4">
                <div className="p-4 bg-blue-50/60 border border-blue-100 rounded-xl">
                  <h4 className="font-semibold text-blue-900 text-sm mb-1">⚡ 100% Client-Side Speed</h4>
                  <p className="text-xs text-blue-800">
                    Your QR codes are computed instantly in your browser. No slow round-trips to distant servers.
                  </p>
                </div>
                <div className="p-4 bg-emerald-50/60 border border-emerald-100 rounded-xl">
                  <h4 className="font-semibold text-emerald-900 text-sm mb-1">🔒 Zero Data Collection</h4>
                  <p className="text-xs text-emerald-800">
                    We never log your URLs, passwords, or contact cards. What you generate stays strictly on your device.
                  </p>
                </div>
                <div className="p-4 bg-amber-50/60 border border-amber-100 rounded-xl">
                  <h4 className="font-semibold text-amber-900 text-sm mb-1">♾️ Permanent & Non-Expiring</h4>
                  <p className="text-xs text-amber-800">
                    All generated QR codes are static standard codes. They will never redirect or expire after a trial period.
                  </p>
                </div>
                <div className="p-4 bg-purple-50/60 border border-purple-100 rounded-xl">
                  <h4 className="font-semibold text-purple-900 text-sm mb-1">🎨 Custom Color & High-Res</h4>
                  <p className="text-xs text-purple-800">
                    Pick brand colors and export high-resolution PNGs ready for digital screens or print marketing.
                  </p>
                </div>
              </div>

              <h3 className="font-semibold text-slate-900 text-base pt-2">Our Mission</h3>
              <p>
                Too many QR generators lure users with &quot;free&quot; promises, only to lock their codes behind a paid subscription weeks later. QuickQR believes basic utility tools should be open, perpetual, and transparent.
              </p>
            </div>
          )}

          {currentPage === 'contact' && (
            <div>
              {contactSubmitted ? (
                <div className="text-center py-10 space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                  <h3 className="text-lg font-bold text-slate-900">Message Received!</h3>
                  <p className="text-slate-600 max-w-sm mx-auto">
                    Thank you for reaching out. We will get back to your inquiry as soon as possible.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <p className="text-slate-600">
                    Have questions, suggestions, or advertising inquiries? Send us a message and our team will get back to you shortly.
                  </p>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name</label>
                      <input
                        type="text"
                        required
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        placeholder="Jane Doe"
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        placeholder="jane@example.com"
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Subject</label>
                    <input
                      type="text"
                      required
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                      placeholder="e.g. Feature Suggestion or Sponsorship"
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Message</label>
                    <textarea
                      rows={4}
                      required
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      placeholder="Write your message here..."
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg shadow-sm transition-colors cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      Send Message
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {currentPage === 'privacy' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600">Last updated: October 2026</p>
              
              <h3 className="font-semibold text-slate-900 text-base">1. Introduction</h3>
              <p>
                At QuickQR, we consider your privacy of utmost importance. This Privacy Policy outlines our procedures regarding the collection, use, and disclosure of information when you use our website.
              </p>

              <h3 className="font-semibold text-slate-900 text-base">2. Client-Side QR Processing</h3>
              <p>
                Unlike many other web-based QR generators that upload your input data to a remote server, QuickQR processes all QR code calculations <strong>entirely within your browser&apos;s JavaScript environment</strong>. Your URLs, passwords, Wi-Fi keys, contact cards, and text content never leave your device.
              </p>

              <h3 className="font-semibold text-slate-900 text-base">3. Data We Do Not Collect</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>We do NOT track the destination URLs you encode.</li>
                <li>We do NOT record scan events, visitor IPs of people who scan your QR codes, or geographic locations.</li>
                <li>We do NOT require user account creation or personal login credentials.</li>
              </ul>

              <h3 className="font-semibold text-slate-900 text-base">4. Advertising and Cookies</h3>
              <p>
                We may display non-intrusive third-party advertisements (such as Google AdSense) to support hosting costs. These advertising partners may use cookies and web beacons to serve ads based on prior visits to our or other websites. You may opt out of personalized advertising by visiting your browser&apos;s cookie settings or Google Ad Settings.
              </p>

              <h3 className="font-semibold text-slate-900 text-base">5. Contact Information</h3>
              <p>
                If you have any questions or feedback about this Privacy Policy, please contact us via our Contact form.
              </p>
            </div>
          )}

          {currentPage === 'terms' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600">Last updated: October 2026</p>

              <h3 className="font-semibold text-slate-900 text-base">1. Acceptance of Terms</h3>
              <p>
                By accessing or using QuickQR, you agree to be bound by these Terms of Use and all applicable laws and regulations. If you disagree with any part of these terms, you may not use the service.
              </p>

              <h3 className="font-semibold text-slate-900 text-base">2. Permitted Use</h3>
              <p>
                QuickQR is provided free of charge for both personal and commercial use. You are fully permitted to download, reproduce, print, and distribute QR codes generated using this tool for packaging, brochures, digital marketing, signage, and merchandise.
              </p>

              <h3 className="font-semibold text-slate-900 text-base">3. Prohibited Content</h3>
              <p>
                You agree not to use QuickQR to generate QR codes leading to:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Malicious software, phishing schemes, trojans, or ransomware.</li>
                <li>Hate speech, harassment, or illegal content.</li>
                <li>Deceptive schemes intended to mislead users regarding credential theft.</li>
              </ul>

              <h3 className="font-semibold text-slate-900 text-base">4. Disclaimer of Warranty</h3>
              <p>
                The services and generated codes are provided &quot;as is&quot; without warranties of any kind, express or implied. While we employ rigorous standard error correction protocols, you are solely responsible for testing your printed QR codes across various smartphone cameras and scanning apps prior to mass commercial printing.
              </p>

              <h3 className="font-semibold text-slate-900 text-base">5. Limitation of Liability</h3>
              <p>
                In no event shall QuickQR or its maintainers be liable for any printing costs, lost profits, or consequential damages resulting from defective codes, scanner incompatibility, or downtime.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

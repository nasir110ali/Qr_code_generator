import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_DATA: FaqItem[] = [
  {
    question: "Is this QR code generator truly free to use?",
    answer: "Yes, QuickQR is 100% free with no hidden paywalls, no watermark, and no credit card required. You can generate unlimited QR codes for both personal and commercial purposes."
  },
  {
    question: "Do the generated QR codes ever expire?",
    answer: "No. QuickQR creates static QR codes where your content (e.g., URL or text) is encoded directly into the pattern of black and white squares. Because there is no intermediary redirect server, the QR code will work perpetually as long as the destination URL remains active."
  },
  {
    question: "Can I choose custom colors for my QR code?",
    answer: "Absolutely! You can customize both the foreground (pattern) color and the background color using our curated palette presets or your own custom HEX color picker. We also advise keeping high contrast (dark foreground on light background) for reliable scanning across all camera models."
  },
  {
    question: "How do I download the QR code as PNG?",
    answer: "Once you enter your text or URL, the QR code is generated instantly. Simply click the 'Download PNG' button. You can also pick resolutions from 256px up to 2048px for professional high-definition printing."
  },
  {
    question: "Can I use these QR codes on business cards and printed menus?",
    answer: "Yes! Thousands of users print QuickQR codes on business cards, restaurant menus, product packaging, flyers, and event tickets. For printed materials, we recommend downloading at 1024px or 2048px resolution and leaving at least 2cm × 2cm (0.8in × 0.8in) physical dimensions."
  },
  {
    question: "Is my personal data or entered URL saved or tracked?",
    answer: "No. All QR code generation is performed locally in your web browser using client-side JavaScript. Your text, passwords, Wi-Fi credentials, and links are never transmitted to our servers or stored in any database."
  },
  {
    question: "Why is my QR code not scanning?",
    answer: "The most common reason is low color contrast (e.g., light yellow on white background). Ensure the QR code pattern is significantly darker than the background. Also verify that the destination URL begins with https:// or http:// and that the code has adequate clear space (quiet zone) around its border."
  }
];

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-full mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base">
            Everything you need to know about creating, customizing, and printing QR codes.
          </p>
        </div>

        <div className="space-y-3">
          {FAQ_DATA.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="border border-slate-200 rounded-xl overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left bg-white hover:bg-slate-50/80 transition-colors focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="font-semibold text-slate-900 text-sm sm:text-base pr-4">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform duration-200 shrink-0 ${
                      isOpen ? 'transform rotate-180 text-blue-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-5 sm:px-5 sm:pb-5 text-slate-600 text-sm leading-relaxed border-t border-slate-100 bg-slate-50/50 pt-3 animate-in fade-in duration-150">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

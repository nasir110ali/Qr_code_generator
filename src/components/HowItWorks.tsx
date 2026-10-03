import React from 'react';
import { Scan, ShieldAlert, Cpu, Eye, Smartphone, ArrowRight, Layers, Sparkles } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-16 bg-slate-50 border-y border-slate-200/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Technology Explained</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            How QR Codes Work
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base">
            QR stands for &quot;Quick Response&quot;. Invented in 1994, these two-dimensional barcodes store hundreds of times more information than classic horizontal barcodes and decode in milliseconds.
          </p>
        </div>

        {/* 4 Architectural Components of a QR Code */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg mb-4">
              <Eye className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1.5">
              1. Finder Patterns
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              The three large square targets in the corners tell phone cameras where the code begins, its scale, and exact rotational orientation—even if scanned upside down or at an angle.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg mb-4">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1.5">
              2. Binary Data Matrix
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Your URL or text is converted into binary data (0s and 1s). Black squares signify binary 1 and light spaces represent 0, forming an efficient compact 2D grid.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg mb-4">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1.5">
              3. Error Correction
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Using mathematical Reed-Solomon algorithms, backup parity blocks are woven into the code. This enables scanners to reconstruct 100% of data even if up to 30% is scratched or smudged.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-lg mb-4">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1.5">
              4. Quiet Zone Margin
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              The blank border surrounding the code isolates the barcode modules from adjacent text, patterns, or graphic backgrounds, ensuring immediate camera lock-on.
            </p>
          </div>
        </div>

        {/* 3 Step Interactive Workflow */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
          <h3 className="text-center font-bold text-slate-900 text-lg sm:text-xl mb-6">
            Simple 3-Step Process
          </h3>
          <div className="grid md:grid-cols-3 gap-6 relative">
            <div className="flex flex-col items-center text-center p-4">
              <div className="w-12 h-12 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-lg mb-3 shadow-sm">
                1
              </div>
              <h4 className="font-semibold text-slate-900 text-sm mb-1">Enter URL or Plain Text</h4>
              <p className="text-xs text-slate-600">
                Type or paste any website address, note, Wi-Fi credentials, or contact info into the generator.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-4">
              <div className="w-12 h-12 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-lg mb-3 shadow-sm">
                2
              </div>
              <h4 className="font-semibold text-slate-900 text-sm mb-1">Pick Color & Style</h4>
              <p className="text-xs text-slate-600">
                Choose custom foreground and background colors to match your brand identity with instant contrast checking.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-4">
              <div className="w-12 h-12 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-lg mb-3 shadow-sm">
                3
              </div>
              <h4 className="font-semibold text-slate-900 text-sm mb-1">Download & Distribute</h4>
              <p className="text-xs text-slate-600">
                Save crystal-clear PNG images ready for stickers, flyers, product labels, restaurant menus, or screens.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

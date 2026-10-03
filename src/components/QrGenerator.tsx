import React, { useState, useEffect, useRef, useMemo } from 'react';
import QRCode from 'qrcode';
import {
  Link as LinkIcon,
  FileText,
  Wifi,
  Mail,
  Phone,
  User,
  Download,
  Copy,
  Check,
  RefreshCw,
  Palette,
  Sliders,
  AlertTriangle,
  Sparkles,
  Share2,
  Maximize2
} from 'lucide-react';
import { QrType, ErrorCorrectionLevel } from '../types';

interface ColorPreset {
  name: string;
  fg: string;
  bg: string;
}

const COLOR_PRESETS: ColorPreset[] = [
  { name: 'Classic Black', fg: '#000000', bg: '#ffffff' },
  { name: 'Navy Blue', fg: '#1e3a8a', bg: '#ffffff' },
  { name: 'Forest Green', fg: '#064e3b', bg: '#ffffff' },
  { name: 'Deep Purple', fg: '#581c87', bg: '#ffffff' },
  { name: 'Burgundy Red', fg: '#881337', bg: '#ffffff' },
  { name: 'Charcoal Dark', fg: '#0f172a', bg: '#f8fafc' },
  { name: 'Dark Mode', fg: '#38bdf8', bg: '#0f172a' },
  { name: 'Warm Amber', fg: '#78350f', bg: '#fffbeb' },
];

function calculateContrast(hex1: string, hex2: string): number {
  const getLum = (hex: string) => {
    const clean = hex.replace('#', '');
    if (clean.length !== 6) return 0.5;
    const r = parseInt(clean.substring(0, 2), 16) / 255;
    const g = parseInt(clean.substring(2, 4), 16) / 255;
    const b = parseInt(clean.substring(4, 6), 16) / 255;
    const a = [r, g, b].map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  };

  try {
    const lum1 = getLum(hex1);
    const lum2 = getLum(hex2);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
  } catch {
    return 10;
  }
}

export const QrGenerator: React.FC = () => {
  // Mode Selection
  const [activeTab, setActiveTab] = useState<QrType>('url');

  // Input States
  const [urlInput, setUrlInput] = useState('https://');
  const [textInput, setTextInput] = useState('');
  
  // Wi-Fi inputs
  const [wifiSsid, setWifiSsid] = useState('');
  const [wifiPassword, setWifiPassword] = useState('');
  const [wifiEncryption, setWifiEncryption] = useState<'WPA' | 'WEP' | 'nopass'>('WPA');
  const [wifiHidden, setWifiHidden] = useState(false);

  // Email inputs
  const [emailTo, setEmailTo] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');

  // Phone input
  const [phoneNumber, setPhoneNumber] = useState('');

  // vCard Contact inputs
  const [vcardName, setVcardName] = useState('');
  const [vcardPhone, setVcardPhone] = useState('');
  const [vcardEmail, setVcardEmail] = useState('');
  const [vcardOrg, setVcardOrg] = useState('');

  // Customization Options
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [errorCorrection, setErrorCorrection] = useState<ErrorCorrectionLevel>('M');
  const [margin, setMargin] = useState(2);
  const [downloadSize, setDownloadSize] = useState<number>(1024);

  // Generation & Canvas state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [downloading, setDownloading] = useState<boolean>(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  // Computed QR raw payload
  const rawQrValue = useMemo(() => {
    switch (activeTab) {
      case 'url':
        return urlInput.trim() || 'https://example.com';
      case 'text':
        return textInput.trim() || 'Hello, world!';
      case 'wifi': {
        const ssid = wifiSsid.trim() || 'MyHomeWiFi';
        const pass = wifiPassword.trim();
        const enc = wifiEncryption;
        const hidden = wifiHidden ? 'H:true;' : '';
        return `WIFI:T:${enc};S:${ssid};P:${pass};${hidden};`;
      }
      case 'email': {
        const to = emailTo.trim();
        const sub = encodeURIComponent(emailSubject.trim());
        const body = encodeURIComponent(emailBody.trim());
        return `mailto:${to}?subject=${sub}&body=${body}`;
      }
      case 'phone': {
        const tel = phoneNumber.trim() || '+1234567890';
        return `tel:${tel}`;
      }
      case 'vcard': {
        const name = vcardName.trim() || 'John Doe';
        const tel = vcardPhone.trim();
        const email = vcardEmail.trim();
        const org = vcardOrg.trim();
        return `BEGIN:VCARD\nVERSION:3.0\nFN:${name}\nORG:${org}\nTEL:${tel}\nEMAIL:${email}\nEND:VCARD`;
      }
      default:
        return 'https://example.com';
    }
  }, [
    activeTab,
    urlInput,
    textInput,
    wifiSsid,
    wifiPassword,
    wifiEncryption,
    wifiHidden,
    emailTo,
    emailSubject,
    emailBody,
    phoneNumber,
    vcardName,
    vcardPhone,
    vcardEmail,
    vcardOrg,
  ]);

  // Contrast check
  const contrastRatio = useMemo(() => {
    return calculateContrast(fgColor, bgColor);
  }, [fgColor, bgColor]);

  const isLowContrast = contrastRatio < 2.8;

  // Generate QR Code onto canvas and as data URL
  useEffect(() => {
    let isCancelled = false;
    setIsGenerating(true);
    setGenerationError(null);

    const generate = async () => {
      try {
        // High-res preview canvas (512px)
        const previewCanvas = document.createElement('canvas');
        await QRCode.toCanvas(previewCanvas, rawQrValue, {
          width: 512,
          margin: margin,
          color: {
            dark: fgColor,
            light: bgColor,
          },
          errorCorrectionLevel: errorCorrection,
        });

        if (!isCancelled) {
          const url = previewCanvas.toDataURL('image/png');
          setQrDataUrl(url);

          // Update visible canvas if mounted
          if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            if (ctx) {
              canvasRef.current.width = 512;
              canvasRef.current.height = 512;
              ctx.drawImage(previewCanvas, 0, 0);
            }
          }
          setIsGenerating(false);
        }
      } catch (err: unknown) {
        if (!isCancelled) {
          console.error(err);
          setGenerationError('Text is too long or contains unsupported characters for this error correction level.');
          setIsGenerating(false);
        }
      }
    };

    generate();

    return () => {
      isCancelled = true;
    };
  }, [rawQrValue, fgColor, bgColor, errorCorrection, margin]);

  // Download Handler (PNG)
  const handleDownloadPng = async () => {
    setDownloading(true);
    try {
      const exportCanvas = document.createElement('canvas');
      await QRCode.toCanvas(exportCanvas, rawQrValue, {
        width: downloadSize,
        margin: margin,
        color: {
          dark: fgColor,
          light: bgColor,
        },
        errorCorrectionLevel: errorCorrection,
      });

      const dataUrl = exportCanvas.toDataURL('image/png');
      const link = document.createElement('a');
      const timestamp = new Date().toISOString().slice(0, 10);
      link.download = `quickqr-${activeTab}-${timestamp}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error(err);
    } finally {
      setDownloading(false);
    }
  };

  // Download Handler (SVG)
  const handleDownloadSvg = async () => {
    try {
      const svgString = await QRCode.toString(rawQrValue, {
        type: 'svg',
        margin: margin,
        color: {
          dark: fgColor,
          light: bgColor,
        },
        errorCorrectionLevel: errorCorrection,
      });

      const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `quickqr-${activeTab}.svg`;
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    }
  };

  // Copy Image to Clipboard
  const handleCopyImage = async () => {
    try {
      const exportCanvas = document.createElement('canvas');
      await QRCode.toCanvas(exportCanvas, rawQrValue, {
        width: 1024,
        margin: margin,
        color: {
          dark: fgColor,
          light: bgColor,
        },
        errorCorrectionLevel: errorCorrection,
      });

      exportCanvas.toBlob(async (blob) => {
        if (!blob) return;
        try {
          if (navigator.clipboard && window.ClipboardItem) {
            await navigator.clipboard.write([
              new ClipboardItem({ 'image/png': blob }),
            ]);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
          } else {
            // Fallback: Copy URL text
            await navigator.clipboard.writeText(rawQrValue);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
          }
        } catch {
          // If direct image write fails due to browser permissions, copy text
          await navigator.clipboard.writeText(rawQrValue);
          setCopied(true);
          setTimeout(() => setCopied(false), 2500);
        }
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Reset colors to default
  const handleResetColors = () => {
    setFgColor('#000000');
    setBgColor('#ffffff');
  };

  return (
    <section id="generator" className="py-8 sm:py-12 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold rounded-full mb-3 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Instant & Unlimited • 100% Free</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Free QR Code Generator
          </h1>
          <p className="mt-3 text-slate-600 text-sm sm:text-base">
            Create high-resolution custom QR codes for your website, Wi-Fi, text, or business cards in seconds. Download as high-quality PNG with zero watermark.
          </p>
        </div>

        {/* Content Type Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          <button
            onClick={() => setActiveTab('url')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'url'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80'
            }`}
          >
            <LinkIcon className="w-4 h-4" />
            <span>Website URL</span>
          </button>

          <button
            onClick={() => setActiveTab('text')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'text'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Plain Text</span>
          </button>

          <button
            onClick={() => setActiveTab('wifi')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'wifi'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80'
            }`}
          >
            <Wifi className="w-4 h-4" />
            <span>Wi-Fi Network</span>
          </button>

          <button
            onClick={() => setActiveTab('email')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'email'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Email</span>
          </button>

          <button
            onClick={() => setActiveTab('phone')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'phone'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80'
            }`}
          >
            <Phone className="w-4 h-4" />
            <span>Phone Call</span>
          </button>

          <button
            onClick={() => setActiveTab('vcard')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'vcard'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80'
            }`}
          >
            <User className="w-4 h-4" />
            <span>vCard Contact</span>
          </button>
        </div>

        {/* Main Workspace (Split Grid) */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form Inputs & Customization (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Input Card */}
            <div className="bg-slate-50/70 border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs">
              <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span>1. Enter Content</span>
                <span className="text-xs font-normal text-slate-500">(Updates instantly)</span>
              </h2>

              {/* URL Input */}
              {activeTab === 'url' && (
                <div className="space-y-3">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide">
                    Website or Destination URL
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      placeholder="https://yourwebsite.com"
                      className="w-full px-4 py-3 bg-white text-slate-900 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm shadow-xs font-mono"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1 text-xs text-slate-500">
                    <span>Try examples:</span>
                    <button
                      type="button"
                      onClick={() => setUrlInput('https://google.com')}
                      className="text-blue-600 hover:underline cursor-pointer"
                    >
                      google.com
                    </button>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={() => setUrlInput('https://youtube.com')}
                      className="text-blue-600 hover:underline cursor-pointer"
                    >
                      youtube.com
                    </button>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={() => setUrlInput('https://instagram.com/yourbrand')}
                      className="text-blue-600 hover:underline cursor-pointer"
                    >
                      instagram.com
                    </button>
                  </div>
                </div>
              )}

              {/* Plain Text Input */}
              {activeTab === 'text' && (
                <div className="space-y-3">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide">
                    Plain Text / Notes / Promo Code
                  </label>
                  <textarea
                    rows={4}
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="Enter any text, instructions, discount code, or secret message..."
                    className="w-full px-4 py-3 bg-white text-slate-900 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm shadow-xs"
                  />
                  <div className="text-right text-xs text-slate-500">
                    {textInput.length} characters
                  </div>
                </div>
              )}

              {/* Wi-Fi Input */}
              {activeTab === 'wifi' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Network Name (SSID)
                    </label>
                    <input
                      type="text"
                      value={wifiSsid}
                      onChange={(e) => setWifiSsid(e.target.value)}
                      placeholder="e.g. CoffeeShop_Guest_WiFi"
                      className="w-full px-3.5 py-2.5 bg-white text-slate-900 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Password
                      </label>
                      <input
                        type="text"
                        value={wifiPassword}
                        onChange={(e) => setWifiPassword(e.target.value)}
                        placeholder="Network password"
                        disabled={wifiEncryption === 'nopass'}
                        className="w-full px-3.5 py-2.5 bg-white text-slate-900 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:bg-slate-100 disabled:text-slate-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Security Type
                      </label>
                      <select
                        value={wifiEncryption}
                        onChange={(e) => setWifiEncryption(e.target.value as any)}
                        className="w-full px-3.5 py-2.5 bg-white text-slate-900 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
                      >
                        <option value="WPA">WPA / WPA2 / WPA3 (Standard)</option>
                        <option value="WEP">WEP (Legacy)</option>
                        <option value="nopass">None (Open Network)</option>
                      </select>
                    </div>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={wifiHidden}
                      onChange={(e) => setWifiHidden(e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                    />
                    <span className="text-xs text-slate-700 font-medium">
                      Hidden Network (SSID is not broadcasted)
                    </span>
                  </label>
                </div>
              )}

              {/* Email Input */}
              {activeTab === 'email' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Recipient Email
                    </label>
                    <input
                      type="email"
                      value={emailTo}
                      onChange={(e) => setEmailTo(e.target.value)}
                      placeholder="support@company.com"
                      className="w-full px-3.5 py-2.5 bg-white text-slate-900 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={emailSubject}
                      onChange={(e) => setEmailSubject(e.target.value)}
                      placeholder="e.g. Customer Feedback"
                      className="w-full px-3.5 py-2.5 bg-white text-slate-900 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Pre-filled Message Body (Optional)
                    </label>
                    <textarea
                      rows={3}
                      value={emailBody}
                      onChange={(e) => setEmailBody(e.target.value)}
                      placeholder="Hi, I would like to inquire about..."
                      className="w-full px-3.5 py-2.5 bg-white text-slate-900 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>
              )}

              {/* Phone Input */}
              {activeTab === 'phone' && (
                <div className="space-y-3">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone Number (with Country Code)
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className="w-full px-3.5 py-2.5 bg-white text-slate-900 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <p className="text-xs text-slate-500">
                    Scanning this QR code will automatically open the phone dialer.
                  </p>
                </div>
              )}

              {/* vCard Input */}
              {activeTab === 'vcard' && (
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={vcardName}
                        onChange={(e) => setVcardName(e.target.value)}
                        placeholder="Sarah Jenkins"
                        className="w-full px-3.5 py-2.5 bg-white text-slate-900 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Company / Organization
                      </label>
                      <input
                        type="text"
                        value={vcardOrg}
                        onChange={(e) => setVcardOrg(e.target.value)}
                        placeholder="Apex Innovations"
                        className="w-full px-3.5 py-2.5 bg-white text-slate-900 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={vcardPhone}
                        onChange={(e) => setVcardPhone(e.target.value)}
                        placeholder="+1 800 555 0199"
                        className="w-full px-3.5 py-2.5 bg-white text-slate-900 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={vcardEmail}
                        onChange={(e) => setVcardEmail(e.target.value)}
                        placeholder="sarah@example.com"
                        className="w-full px-3.5 py-2.5 bg-white text-slate-900 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Customization Card: Colors & Presets */}
            <div className="bg-slate-50/70 border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Palette className="w-4 h-4 text-blue-600" />
                  <span>2. Choose Colors</span>
                </h2>
                {(fgColor !== '#000000' || bgColor !== '#ffffff') && (
                  <button
                    onClick={handleResetColors}
                    className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Reset to Classic
                  </button>
                )}
              </div>

              {/* Color Presets */}
              <div className="mb-5">
                <span className="text-xs font-semibold text-slate-700 block mb-2">
                  Color Palettes
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {COLOR_PRESETS.map((preset) => {
                    const isSelected = fgColor === preset.fg && bgColor === preset.bg;
                    return (
                      <button
                        key={preset.name}
                        onClick={() => {
                          setFgColor(preset.fg);
                          setBgColor(preset.bg);
                        }}
                        className={`flex items-center gap-2 p-2 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'border-blue-600 ring-2 ring-blue-500/20 bg-blue-50/50'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="flex -space-x-1 shrink-0">
                          <div
                            className="w-4 h-4 rounded-full border border-black/10"
                            style={{ backgroundColor: preset.fg }}
                          />
                          <div
                            className="w-4 h-4 rounded-full border border-black/10"
                            style={{ backgroundColor: preset.bg }}
                          />
                        </div>
                        <span className="text-xs font-medium text-slate-800 truncate">
                          {preset.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Hex Inputs */}
              <div className="grid sm:grid-cols-2 gap-4">
                {/* Foreground */}
                <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <label className="block text-xs font-bold text-slate-800">
                      QR Code Color (Foreground)
                    </label>
                    <span className="text-xs font-mono text-slate-500 uppercase">{fgColor}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={fgColor}
                      onChange={(e) => setFgColor(e.target.value)}
                      className="w-9 h-9 rounded-lg border border-slate-300 cursor-pointer p-0.5 bg-white"
                      title="Select QR foreground color"
                    />
                  </div>
                </div>

                {/* Background */}
                <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <label className="block text-xs font-bold text-slate-800">
                      Background Color
                    </label>
                    <span className="text-xs font-mono text-slate-500 uppercase">{bgColor}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-9 h-9 rounded-lg border border-slate-300 cursor-pointer p-0.5 bg-white"
                      title="Select QR background color"
                    />
                  </div>
                </div>
              </div>

              {/* Low Contrast Warning */}
              {isLowContrast && (
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5 text-xs text-amber-800 animate-in fade-in">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Low Contrast Warning: </span>
                    The contrast between your QR color and background is low. Some smartphone cameras may have difficulty scanning this code. Consider using darker foreground on lighter background.
                  </div>
                </div>
              )}
            </div>

            {/* Advanced Settings Card */}
            <div className="bg-slate-50/70 border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs">
              <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-blue-600" />
                <span>3. Quality & Resolution Settings</span>
              </h2>

              <div className="grid sm:grid-cols-3 gap-4">
                {/* Error Correction */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Error Correction
                  </label>
                  <select
                    value={errorCorrection}
                    onChange={(e) => setErrorCorrection(e.target.value as ErrorCorrectionLevel)}
                    className="w-full px-3 py-2 bg-white text-slate-800 border border-slate-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-blue-600 cursor-pointer"
                  >
                    <option value="L">Level L (7% Recovery)</option>
                    <option value="M">Level M (15% Standard)</option>
                    <option value="Q">Level Q (25% High)</option>
                    <option value="H">Level H (30% Maximum)</option>
                  </select>
                </div>

                {/* Quiet Zone Margin */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Margin (Quiet Zone)
                  </label>
                  <select
                    value={margin}
                    onChange={(e) => setMargin(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white text-slate-800 border border-slate-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-blue-600 cursor-pointer"
                  >
                    <option value={1}>Compact (1 module)</option>
                    <option value={2}>Standard (2 modules)</option>
                    <option value={4}>Wide (4 modules)</option>
                  </select>
                </div>

                {/* PNG Download Resolution */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    PNG Export Size
                  </label>
                  <select
                    value={downloadSize}
                    onChange={(e) => setDownloadSize(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white text-slate-800 border border-slate-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-blue-600 cursor-pointer"
                  >
                    <option value={512}>512 × 512 px (Web standard)</option>
                    <option value={1024}>1024 × 1024 px (HD Print)</option>
                    <option value={2048}>2048 × 2048 px (Ultra Print)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Live Sticky Preview & Download Card (5 cols) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
            <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl text-center relative overflow-hidden">
              {/* Subtle top indicator */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Live Preview
                </span>
                <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold border border-emerald-200">
                  Instant Output
                </span>
              </div>

              {/* QR Canvas Box */}
              <div className="relative mx-auto my-2 p-4 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-center min-h-[280px]">
                {/* Hidden canvas for direct generation */}
                <canvas ref={canvasRef} className="hidden" />

                {qrDataUrl ? (
                  <div
                    className="p-3 rounded-xl shadow-xs transition-transform duration-200 hover:scale-[1.02]"
                    style={{ backgroundColor: bgColor }}
                  >
                    <img
                      src={qrDataUrl}
                      alt="Generated QR Code"
                      className="w-56 h-56 sm:w-64 sm:h-64 object-contain rounded-lg"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-400 py-12">
                    <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mb-2" />
                    <span className="text-xs font-medium">Generating QR Code...</span>
                  </div>
                )}

                {generationError && (
                  <div className="absolute inset-4 bg-red-50/95 border border-red-200 rounded-xl p-4 flex flex-col items-center justify-center text-center text-red-700 text-xs">
                    <AlertTriangle className="w-6 h-6 text-red-600 mb-2" />
                    <span>{generationError}</span>
                  </div>
                )}
              </div>

              {/* Scan Info label */}
              <p className="text-xs text-slate-500 mt-3 mb-6 line-clamp-1 truncate font-mono px-2" title={rawQrValue}>
                Encodes: {rawQrValue}
              </p>

              {/* Download Buttons Area */}
              <div className="space-y-2.5">
                {/* Main Download PNG Button (Highlighted) */}
                <button
                  onClick={handleDownloadPng}
                  disabled={downloading || Boolean(generationError)}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/25 transition-all transform active:scale-[0.99] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download className="w-4 h-4 stroke-[2.5]" />
                  <span>Download QR Code (PNG)</span>
                </button>

                {/* Secondary Actions: Copy & SVG */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleCopyImage}
                    disabled={Boolean(generationError)}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-slate-100 hover:bg-slate-200/80 text-slate-800 font-semibold text-xs rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                        <span className="text-emerald-700">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-600" />
                        <span>Copy Image</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleDownloadSvg}
                    disabled={Boolean(generationError)}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-slate-100 hover:bg-slate-200/80 text-slate-800 font-semibold text-xs rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                    title="Download vector SVG format"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-600" />
                    <span>Download SVG</span>
                  </button>
                </div>
              </div>

              {/* Feature bullet checklist */}
              <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px] text-slate-500 text-left">
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Zero Watermark</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>High-Res PNG</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Never Expires</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Commercial Use OK</span>
                </div>
              </div>
            </div>

            {/* In-sidebar Ad Placeholder */}
            <div className="border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 rounded-2xl p-4 text-center">
              <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-2">
                Advertisement Space
              </div>
              <div className="h-32 flex flex-col items-center justify-center text-xs text-slate-500">
                <span>Sidebar Ad Slot (300 × 250)</span>
                <span className="text-[10px] text-slate-500 mt-1">Non-intrusive banner zone</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

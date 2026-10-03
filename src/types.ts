export type QrType = 'url' | 'text' | 'wifi' | 'email' | 'phone' | 'vcard';

export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export interface QrOptions {
  fgColor: string;
  bgColor: string;
  size: number;
  errorCorrection: ErrorCorrectionLevel;
  margin: number;
}

export type PageId = 'about' | 'contact' | 'privacy' | 'terms';

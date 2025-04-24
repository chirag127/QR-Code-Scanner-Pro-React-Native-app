/**
 * QR code content types
 */
export type QRCodeType = 
  | 'URL' 
  | 'TEXT' 
  | 'WIFI' 
  | 'CONTACT' 
  | 'GEO' 
  | 'SMS' 
  | 'PHONE' 
  | 'EMAIL' 
  | 'OTHER';

/**
 * Scan history item structure
 */
export interface ScanHistoryItem {
  id: string;
  content: string;
  type: QRCodeType;
  timestamp: number;
}

/**
 * Parsed QR code result
 */
export interface ParsedQRCode {
  type: QRCodeType;
  content: string;
}

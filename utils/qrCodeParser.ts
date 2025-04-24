import { QRCodeType, ParsedQRCode } from './types';

/**
 * Parse QR code content and determine its type
 * @param data Raw QR code content
 * @returns Object containing the detected type and original content
 */
export const parseQRCode = (data: string): ParsedQRCode => {
  // Trim the data
  const trimmedData = data.trim();
  
  // URL detection
  if (
    trimmedData.startsWith('http://') || 
    trimmedData.startsWith('https://') ||
    trimmedData.startsWith('www.')
  ) {
    return { type: 'URL', content: trimmedData };
  }
  
  // Wi-Fi detection
  if (trimmedData.startsWith('WIFI:')) {
    return { type: 'WIFI', content: trimmedData };
  }
  
  // Contact detection (vCard/meCard)
  if (
    trimmedData.startsWith('BEGIN:VCARD') || 
    trimmedData.startsWith('MECARD:')
  ) {
    return { type: 'CONTACT', content: trimmedData };
  }
  
  // Geo location detection
  if (trimmedData.startsWith('geo:')) {
    return { type: 'GEO', content: trimmedData };
  }
  
  // SMS detection
  if (trimmedData.startsWith('sms:')) {
    return { type: 'SMS', content: trimmedData };
  }
  
  // Phone number detection
  if (trimmedData.startsWith('tel:')) {
    return { type: 'PHONE', content: trimmedData };
  }
  
  // Email detection
  if (trimmedData.startsWith('mailto:')) {
    return { type: 'EMAIL', content: trimmedData };
  }
  
  // If no specific format is detected, treat as plain text
  return { type: 'TEXT', content: trimmedData };
};

/**
 * Get an icon representation for a QR code type
 * @param type QR code type
 * @returns Emoji icon representing the type
 */
export const getQRCodeTypeIcon = (type: QRCodeType): string => {
  switch (type) {
    case 'URL': return '🔗';
    case 'WIFI': return '📶';
    case 'CONTACT': return '👤';
    case 'GEO': return '🗺️';
    case 'SMS': return '💬';
    case 'PHONE': return '📞';
    case 'EMAIL': return '✉️';
    case 'TEXT': return '📝';
    default: return '📱';
  }
};

/**
 * Get a human-readable label for a QR code type
 * @param type QR code type
 * @returns Human-readable label
 */
export const getQRCodeTypeLabel = (type: QRCodeType): string => {
  switch (type) {
    case 'URL': return 'Website URL';
    case 'WIFI': return 'Wi-Fi Network';
    case 'CONTACT': return 'Contact Information';
    case 'GEO': return 'Geographic Location';
    case 'SMS': return 'SMS Message';
    case 'PHONE': return 'Phone Number';
    case 'EMAIL': return 'Email Address';
    case 'TEXT': return 'Plain Text';
    default: return 'Unknown Type';
  }
};

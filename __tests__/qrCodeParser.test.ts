import { parseQRCode, getQRCodeTypeIcon, getQRCodeTypeLabel } from '../utils/qrCodeParser';

describe('QR Code Parser', () => {
  // Test parseQRCode function
  describe('parseQRCode', () => {
    test('should detect URL type', () => {
      const result = parseQRCode('https://example.com');
      expect(result.type).toBe('URL');
      expect(result.content).toBe('https://example.com');
    });

    test('should detect URL type with www', () => {
      const result = parseQRCode('www.example.com');
      expect(result.type).toBe('URL');
      expect(result.content).toBe('www.example.com');
    });

    test('should detect Wi-Fi type', () => {
      const result = parseQRCode('WIFI:S:MyNetwork;T:WPA;P:password123;;');
      expect(result.type).toBe('WIFI');
      expect(result.content).toBe('WIFI:S:MyNetwork;T:WPA;P:password123;;');
    });

    test('should detect Contact type (vCard)', () => {
      const result = parseQRCode('BEGIN:VCARD\nVERSION:3.0\nFN:John Doe\nTEL:123456789\nEMAIL:john@example.com\nEND:VCARD');
      expect(result.type).toBe('CONTACT');
    });

    test('should detect Contact type (meCard)', () => {
      const result = parseQRCode('MECARD:N:Doe,John;TEL:123456789;EMAIL:john@example.com;;');
      expect(result.type).toBe('CONTACT');
    });

    test('should detect Geo location type', () => {
      const result = parseQRCode('geo:37.786971,-122.399677');
      expect(result.type).toBe('GEO');
    });

    test('should detect SMS type', () => {
      const result = parseQRCode('sms:+123456789:Hello there!');
      expect(result.type).toBe('SMS');
    });

    test('should detect Phone type', () => {
      const result = parseQRCode('tel:+123456789');
      expect(result.type).toBe('PHONE');
    });

    test('should detect Email type', () => {
      const result = parseQRCode('mailto:john@example.com?subject=Hello&body=How are you?');
      expect(result.type).toBe('EMAIL');
    });

    test('should default to TEXT type for plain text', () => {
      const result = parseQRCode('This is just some plain text');
      expect(result.type).toBe('TEXT');
    });
  });

  // Test getQRCodeTypeIcon function
  describe('getQRCodeTypeIcon', () => {
    test('should return correct icon for URL type', () => {
      expect(getQRCodeTypeIcon('URL')).toBe('🔗');
    });

    test('should return correct icon for WIFI type', () => {
      expect(getQRCodeTypeIcon('WIFI')).toBe('📶');
    });

    test('should return correct icon for CONTACT type', () => {
      expect(getQRCodeTypeIcon('CONTACT')).toBe('👤');
    });

    test('should return correct icon for GEO type', () => {
      expect(getQRCodeTypeIcon('GEO')).toBe('🗺️');
    });

    test('should return correct icon for SMS type', () => {
      expect(getQRCodeTypeIcon('SMS')).toBe('💬');
    });

    test('should return correct icon for PHONE type', () => {
      expect(getQRCodeTypeIcon('PHONE')).toBe('📞');
    });

    test('should return correct icon for EMAIL type', () => {
      expect(getQRCodeTypeIcon('EMAIL')).toBe('✉️');
    });

    test('should return correct icon for TEXT type', () => {
      expect(getQRCodeTypeIcon('TEXT')).toBe('📝');
    });

    test('should return default icon for unknown type', () => {
      expect(getQRCodeTypeIcon('OTHER')).toBe('📱');
    });
  });

  // Test getQRCodeTypeLabel function
  describe('getQRCodeTypeLabel', () => {
    test('should return correct label for URL type', () => {
      expect(getQRCodeTypeLabel('URL')).toBe('Website URL');
    });

    test('should return correct label for WIFI type', () => {
      expect(getQRCodeTypeLabel('WIFI')).toBe('Wi-Fi Network');
    });

    test('should return correct label for CONTACT type', () => {
      expect(getQRCodeTypeLabel('CONTACT')).toBe('Contact Information');
    });

    test('should return correct label for GEO type', () => {
      expect(getQRCodeTypeLabel('GEO')).toBe('Geographic Location');
    });

    test('should return correct label for SMS type', () => {
      expect(getQRCodeTypeLabel('SMS')).toBe('SMS Message');
    });

    test('should return correct label for PHONE type', () => {
      expect(getQRCodeTypeLabel('PHONE')).toBe('Phone Number');
    });

    test('should return correct label for EMAIL type', () => {
      expect(getQRCodeTypeLabel('EMAIL')).toBe('Email Address');
    });

    test('should return correct label for TEXT type', () => {
      expect(getQRCodeTypeLabel('TEXT')).toBe('Plain Text');
    });

    test('should return default label for unknown type', () => {
      expect(getQRCodeTypeLabel('OTHER')).toBe('Unknown Type');
    });
  });
});

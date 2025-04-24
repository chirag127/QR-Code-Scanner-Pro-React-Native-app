import { formatDate, truncateText } from '../utils/helpers';

describe('Helpers', () => {
  // Test formatDate function
  describe('formatDate', () => {
    beforeAll(() => {
      // Mock Date.now() to return a fixed timestamp
      const now = new Date('2025-04-24T12:00:00Z').getTime();
      jest.spyOn(Date, 'now').mockImplementation(() => now);
      
      // Mock new Date() to return consistent dates based on timestamp
      const RealDate = global.Date;
      global.Date = class extends RealDate {
        constructor(arg: any) {
          if (arg === undefined) {
            super(now);
          } else {
            super(arg);
          }
        }
      } as any;
    });

    afterAll(() => {
      // Restore original Date implementation
      jest.restoreAllMocks();
    });

    test('should format today\'s date correctly', () => {
      const today = new Date();
      const result = formatDate(today.getTime());
      expect(result).toContain('Today');
    });

    test('should format yesterday\'s date correctly', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const result = formatDate(yesterday.getTime());
      expect(result).toContain('Yesterday');
    });

    test('should format older dates with full date', () => {
      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 2);
      const result = formatDate(oldDate.getTime());
      expect(result).not.toContain('Today');
      expect(result).not.toContain('Yesterday');
      expect(result).toContain(oldDate.toLocaleDateString());
    });
  });

  // Test truncateText function
  describe('truncateText', () => {
    test('should not truncate text shorter than maxLength', () => {
      const text = 'Short text';
      const result = truncateText(text, 20);
      expect(result).toBe(text);
    });

    test('should truncate text longer than maxLength', () => {
      const text = 'This is a very long text that should be truncated';
      const maxLength = 20;
      const result = truncateText(text, maxLength);
      expect(result.length).toBe(maxLength + 3); // +3 for the ellipsis
      expect(result).toBe('This is a very long...');
    });

    test('should add ellipsis to truncated text', () => {
      const text = 'Truncate me please';
      const result = truncateText(text, 10);
      expect(result).toBe('Truncate m...');
    });
  });
});

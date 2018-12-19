import { toHour } from './hours.utils';

describe('Hours utils', () => {
  beforeEach(() => {});
  describe('toHour', () => {
    it('should return hour object for 09:00', () => {
      const result = toHour('09:00');
      expect(result).toEqual({ hour: 9, min: 0 });
    });

    it('should return hour object for 14:53', () => {
      const result = toHour('14:53');
      expect(result).toEqual({ hour: 14, min: 53 });
    });

    it('should return null for invalid hour', () => {
      const result = toHour('55:00');
      expect(result).toBeNull();
    });
  });
});

import { toHour, parseHourStringFromDate } from './hours.utils';

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

  describe('parseHourStringFromDate', () => {
    it('should parse hour string from date for 09:00', () => {
      const date = new Date('Tue, 11 Dec 2018 07:00:00 GMT');
      const result = parseHourStringFromDate(date);
      expect(result).toEqual('09:00');
    });

    it('should parse hour string from date for 14:53', () => {
      const date = new Date('Tue, 11 Dec 2018 12:53:00 GMT');
      const result = parseHourStringFromDate(date);
      expect(result).toEqual('14:53');
    });
  });
});

const { APIError, processOffsetLimit } = require('../../app/helpers');

describe('processOffsetLimit()', () => {
  it('should return a number if a valid limit and offset are passed', () => {
    const { offset, limit } = processOffsetLimit('5', '6');
    expect(offset).toBe(5);
    expect(limit).toBe(6);
  });
  it('should return an API Error if a non-numeric offset is passed with an undefined limit', () => {
    const { offset, limit } = processOffsetLimit('foo');
    expect(offset).toBeInstanceOf(APIError);
  });
  it('should return an API Error if zero is passed for "limit"', () => {
    const { offset, limit } = processOffsetLimit('5', '0');
    expect(limit).toBeInstanceOf(APIError);
  });
  it('should return an API Error if a negative limit is passed', () => {
    const { offset, limit } = processOffsetLimit(undefined, '-1');
    expect(limit).toBeInstanceOf(APIError);
  });
});

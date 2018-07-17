const { APIError, processOffsetLimit } = require('../../app/helpers');

describe('processOffsetLimit()', () => {
  it('should return a number if a valid limit is passed', () => {
    const limit = '6';
    const validatedLimit = processOffsetLimit(limit);
    expect(validatedLimit).toBe(6);
  });
  it('should return an API Error if a non-numeric limit is passed', () => {
    const limit = 'foo';
    const validatedLimit = processOffsetLimit(limit);
    expect(validatedLimit).toBeInstanceOf(APIError);
  });
  it('should return an API Error if zero is passed when type is "limit"', () => {
    const limit = '0';
    const validatedLimit = processOffsetLimit(limit);
    expect(validatedLimit).toBeInstanceOf(APIError);
  });
  it('should return zero if zero is passed when the type is "offset"', () => {
    const offset = '0';
    const validatedLimit = processOffsetLimit(offset, 1000, 'offset');
    expect(validatedLimit).toBe(0);
  });
  it('should return an API Error if a negative limit is passed', () => {
    const limit = '-1';
    const validatedLimit = processOffsetLimit(limit);
    expect(validatedLimit).toBeInstanceOf(APIError);
  });
  it('should return an API Error if a limit > max is passed', () => {
    const maximum = 100;
    const limit = '101';
    const validatedLimit = processOffsetLimit(limit, maximum);
    expect(validatedLimit).toBeInstanceOf(APIError);
  });
  it('should return a number if a valid numeric limit is passed', () => {
    const limit = '5';
    const validatedLimit = processOffsetLimit(limit);
    expect(validatedLimit).toBe(5);
  });
});

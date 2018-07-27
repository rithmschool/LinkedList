const { partialUpdate } = require('../../app/helpers');

describe('partialUpdate()', () => {
  it('should generate a proper partial update query with just 1 field', () => {
    const { query, values } = partialUpdate(
      'users',
      { first_name: 'Test' },
      'username',
      'testuser'
    );
    expect(query).toBe(
      'UPDATE users SET first_name=$1 WHERE username=$2 RETURNING *'
    );
    expect(values).toEqual(['Test', 'testuser']);
  });
});

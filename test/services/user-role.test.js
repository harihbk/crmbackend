const assert = require('assert');
const app = require('../../src/app');

describe('\'User_Role\' service', () => {
  it('registered the service', () => {
    const service = app.service('user_role');

    assert.ok(service, 'Registered the service');
  });
});

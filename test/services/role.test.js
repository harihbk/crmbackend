const assert = require('assert');
const app = require('../../src/app');

describe('\'Role\' service', () => {
  it('registered the service', () => {
    const service = app.service('Role');

    assert.ok(service, 'Registered the service');
  });
});

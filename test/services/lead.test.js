const assert = require('assert');
const app = require('../../src/app');

describe('\'lead\' service', () => {
  it('registered the service', () => {
    const service = app.service('lead');

    assert.ok(service, 'Registered the service');
  });
});

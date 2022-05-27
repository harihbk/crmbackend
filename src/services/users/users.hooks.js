const { authenticate } = require('@feathersjs/authentication').hooks;
const { populate } = require('feathers-hooks-common');


const {
  hashPassword, protect
} = require('@feathersjs/authentication-local').hooks;


const userRoleSchema = {
  include: {
    service: 'Role',
    nameAs: 'role',
    parentField: 'role',
    childField: '_id',
  }
}


module.exports = {
  before: {
    all: [],
    find: [  ],
    get: [  ],
    create: [ hashPassword('password') ],
    update: [ hashPassword('password'),  authenticate('jwt') ],
    patch: [ hashPassword('password'),  authenticate('jwt') ],
    remove: [  ]
  },

  after: {
    all: [
      // Make sure the password field is never sent to the client
      // Always must be the last hook
      protect('password'),
      populate({
        schema: userRoleSchema
      })
    ],
    find: [
    ],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};

const { authenticate } = require('@feathersjs/authentication').hooks;
const search = require('feathers-mongodb-fuzzy-search')

//authenticate('jwt')
module.exports = {
  before: {
    all: [
      search({  // regex search on given fields
        fields: ['leadname', 'leadstatus']
      })
     ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
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

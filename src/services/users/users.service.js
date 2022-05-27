// Initializes the `users` service on path `/users`
const { Users } = require('./users.class');
const createModel = require('../../models/users.model');
const hooks = require('./users.hooks');
const { Forgot } = require("./forgot")
const { CustomUsers } = require('./customUsers.class');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
    whitelist: ['$populate'],
    multi: true


  };

  // Initialize our service with any options it requires
  app.use('/users', new Users(options, app));
  app.use('/_users', new CustomUsers(options, app));

  app.use('/forgot',new Forgot(options ,app))


  // Get our initialized service so that we can register hooks
  const service = app.service('users');


  service.hooks(hooks);
};

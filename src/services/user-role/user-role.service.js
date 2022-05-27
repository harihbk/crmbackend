// Initializes the `User_Role` service on path `/user_role`
const { UserRole } = require('./user-role.class');
const createModel = require('../../models/user-role.model');
const hooks = require('./user-role.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/user_role', new UserRole(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('user_role');

  service.hooks(hooks);
};

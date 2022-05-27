// Initializes the `otp` service on path `/otp`
const { Otp } = require('./otp.class');
const createModel = require('../../models/otp.model');
const hooks = require('./otp.hooks');
const Crud = require('./crud')
const { authenticate } = require('@feathersjs/express');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/otp', new Otp(options, app));
  app.use('/ottp',authenticate('jwt'),Crud.insert(app))

  // Get our initialized service so that we can register hooks
  const service = app.service('otp');

  service.hooks(hooks);
};

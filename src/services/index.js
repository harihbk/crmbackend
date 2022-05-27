const users = require('./users/users.service.js');
const role = require('./role/role.service.js');
const lead = require('./lead/lead.service.js');
const userRole = require('./user-role/user-role.service.js');
const otp = require('./otp/otp.service.js');
const log = require('./log/log.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(users);
  app.configure(role);
  app.configure(lead);
  app.configure(userRole);
  app.configure(otp);
  app.configure(log);
};

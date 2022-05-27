const nodemailer = require('nodemailer')

exports.MailConfig = () => {
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: 'hari95nn@gmail.com',
        pass: 'Hari@123N',
    },
})
}

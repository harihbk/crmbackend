const { Service } = require('feathers-mongoose');
const { NotFound, GeneralError, BadRequest } = require('@feathersjs/errors');
const otpGenerator = require('./generateotp')
const mail = require('../../mail')
let dotenv = require('dotenv').config()
const jwt = require('jsonwebtoken');
const secret = 'hnlukn';
var bcrypt = require('bcryptjs');

const {
  hashPassword, protect
} = require('@feathersjs/authentication-local').hooks;



exports.Forgot = class Forgot extends Service {

  constructor(options ,app){
    super(options)
    this.options =options
    this.app = app;
}

 async create(data){
   const { username } = data
  const result = await this.app.service('users').find({
    query: {
      $select: [ 'email' ],
      email : username
    }
  });
  var _data = result.data || result
  const findOne = Array.isArray(_data) ? _data[0] : ''


  // OTP generate
  const otp = otpGenerator.generateotp();
  const obj = {
    code : otp,
    email : username
  }

  const mailOptions = {
    from: `CRM`,
    to: `harihbk95@gmail.com`,
    subject: "OTP",
    text: "DO not share your OTP "+otp ,
  };
   mail.MailConfig().sendMail(mailOptions)

   await this.app.service('otp').Model.deleteMany({
    email : username
   })

   await this.app.service('otp').create(obj)


   return findOne


 }

 async get(id,params){
  const { otp , _id , token} = params.query

  const result = await this.app.service('users').find({_id:_id})
  var _data = result.data || result
  const findOne = Array.isArray(_data) ? _data[0] : ''

  const res =  await this.app.service('otp').find({
    query : {
      code : otp,
      email : findOne.email
    }
  });

   console.log(res.data);
  if(res.data.length > 0 ){
    const token = jwt.sign({
      data: 'foobar'
    }, secret,{
      expiresIn: "120s"
    });

    return {...res , ...{token : token}}

  } else {
    return res;
  }



 }

 async patch(id, data, params){
  const { token , _id , password } = data
//   var salt = bcrypt.genSaltSync(10);
// var hash = bcrypt.hashSync(password, salt);
// console.log(hash);
  try {
    const decoded = jwt.verify(token, secret);
   console.log('123');
   await this.app.service('users').patch(_id,{ password : password} )
   return "success"
  }
  catch(ex){
    return "token expired"
  }


 }



}


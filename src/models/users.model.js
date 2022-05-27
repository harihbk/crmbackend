// users-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const modelName = 'users';
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;

  const schema = new mongooseClient.Schema({


    email: { type: String, unique: true,required: true, lowercase: true },
    password: { type: String,required: true, },
    designation : { type : String },
    empno        : { type : String },
    first_name  : { type : String ,required: true,},
    last_name  : { type : String },
    mobile_number : { type : String ,required: true,unique: true},
    username : { type : String,required: true,unique: true },
    status : {
      type : String,
      enum : ['active','inactive'],
      default : 'active'
    },
    role : { type : Schema.Types.ObjectId , rel : 'role'}

  }, {
    timestamps: true
  });

  // This is necessary to avoid model compilation errors in watch mode
  // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
  if (mongooseClient.modelNames().includes(modelName)) {
    mongooseClient.deleteModel(modelName);
  }
  return mongooseClient.model(modelName, schema);

};
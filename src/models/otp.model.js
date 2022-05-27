// otp-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const modelName = 'otp';
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const schema = new Schema({
    code: { type: String, required: true },
    email : { type : String , required: true },
    expiration_time : { type : Date , defaultValue: false },
    verified : {
			type: Boolean,
			defaultValue: false,
			allowNull: true
		}
  }, {
    timestamps: true
  });

  // This is necessary to avoid model compilation errors in watch mode
  // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
  if (mongooseClient.modelNames().includes(modelName)) {
    mongooseClient.deleteModel(modelName);
  }
  schema.index({createdAt: 1},{expireAfterSeconds: 50});

  return mongooseClient.model(modelName, schema);

};

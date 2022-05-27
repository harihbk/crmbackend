// lead-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const modelName = 'lead';
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const schema = new Schema({
    leadname: { type: String, required: true ,text: true },
    leadstatus: { type: String, required: true , enum : ['Assigned' , 'Not Assigned'] ,default : 'Not Assigned' ,text: true},
    contactdetails: [
     { name : { type : String ,text: true} ,
     email : { type : String ,text: true} ,
     phone : { type : String ,text: true},

    },

    ],
    log : [
      {
        meeting_notes : { type : String },
        schedule : { type : String },
        date : { type : String },
      }
   ],
   meeting : [{
     date :  { type : String },
     agenda_meeting : { type : String },
     contact_person :  { type : String },
     meeting_link :  { type : String },
   }],
    companyname : { type : String ,text: true} ,
    companyaddress : { type : String } ,
    area : { type : String } ,
    region : { type : String } ,
    category : { type : String } ,
    status : { type : String ,enum : ['Active' , 'InActive'] ,default : 'InActive'} ,
    type : { type : String ,enum : ['Active' , 'InActive'] ,default : 'InActive'} ,
    product_group : { type : String } ,
    reponsible_person : { type : String } ,
    notes_field : { type : String } ,
    //notes_field : { type : String } ,






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

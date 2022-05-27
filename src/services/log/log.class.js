const { Service } = require('feathers-mongoose');
var mongoose = require('mongoose');

exports.Log = class Log extends Service {

  constructor(options,app){
    super(options, app);
    this.app = app;
  }

   async find(params){
     const { contactdetails , lead } =  params.query

     const pipeline = [
       {
         $match : { contactdetails : new mongoose.Types.ObjectId(contactdetails) }
       },
       {
        $lookup: {
          from: "leads",
          localField: "lead",
          foreignField: "_id",
          as: "authors", // Pull lookup result into 'author' field
        },
      },
      {"$unwind":"$authors"},
      {"$unwind":"$authors.contactdetails"},
      {"$match":{"authors.contactdetails._id":new mongoose.Types.ObjectId(contactdetails)}}




     ]

    const data = await this.app.service('log').Model.aggregate(pipeline)
    return data;
   }

};

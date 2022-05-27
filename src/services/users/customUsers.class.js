const { Service } = require('feathers-mongoose');
const { populate } = require('feathers-hooks-common');

exports.CustomUsers = class CustomUsers extends Service {

    constructor(options ,app){
        super(options)
        this.options =options
        this.app = app;
    }

    async find(data,params){

        let limit = parseInt(data.query.limit);
        let skip = data.query.page * limit;
        let page = data.query.page;
        const users = this.app.service('users').Model;

       let obj =
       [
         {
           $project : {
             password : 0
           }
         },
        {
         $lookup: {
           from: 'roles',
           localField: 'role',
           foreignField: '_id',
           as: 'role'
         }
        },
        {
           $match: {
               'role.slug' : {
                 $nin : ['admin']
               }
             }
           },
      ];
       let hn = await users.aggregate(obj).skip(skip).limit(limit);
        let cnt = await users.aggregate(obj);
        let h = { ...{page : parseInt(page) , total :  cnt.length} , ...{data:hn}}
        return h;


    }



};

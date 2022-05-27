const { Service } = require('feathers-mongoose');

exports.Lead = class Lead extends Service {

  constructor(options,app){
    super(options, app);
    this.app = app;
  }

  // async find(name){
  //   const { page , limit } = name.query
  //  const pipeline =  { $text: { $search: "nnnn" } }

  //   const data = await this.app.service('lead').Model.find().skip(page*limit).limit(limit)
  //   return data

  // }

  async find(name){
    const { page , limit , search} = name.query
    console.log(search);

    const params = {}
    params['query'] = {}

    params['query'].$skip=page*limit
    params['query'].$limit=limit
    if(search){
      params['query'].$text={ $search: search }
    }

    const sub = await super.find(params);
    return {...sub, ...{ page : Number(page) } }
  }

};

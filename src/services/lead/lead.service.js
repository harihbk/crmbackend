// Initializes the `lead` service on path `/lead`
const { Lead } = require('./lead.class');
const createModel = require('../../models/lead.model');
const hooks = require('./lead.hooks');
var mongoose = require('mongoose');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
    whitelist: ['$text', '$search'],
  };

  // Initialize our service with any options it requires
  app.use('/lead', new Lead(options, app));

  app.use('/leadsubdocs/:_id',async(req,res)=>{
    const _id = req.params._id;
    const body = req.body;
    try {
      await app.service('lead').Model.update({ _id:new mongoose.Types.ObjectId(_id)},{
        $push:  body
      })
      return res.status(200).send({
        message: 'Update Record'
     });


    } catch(err){
      return res.status(400).send({
        message: 'update failed'
     });
    }


  })

  // app.patch('/log/:_id', (req, res) => {
  //   const _id = req.params._id
  //   const data = req.body
  //   app.service('lead').


  // });

  // Get our initialized service so that we can register hooks
  const service = app.service('lead');



  service.hooks(hooks);
};

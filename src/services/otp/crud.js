exports.insert = function (app){
  return async function (req, res, next) {
  const gg =  await app.service('users').find()
  console.log(gg);
    res.send('dfsd')
  }
}

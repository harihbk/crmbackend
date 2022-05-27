var express = require('express');
const router = express.Router()
 const crud   = require('./crud')

router.get('/insert/:id',crud.insert)


module.exports = router

var express = require('express');
var router = express.Router();
var ImapController = require('../imap/imap');
var ImapgController = require('../imap/imapg');



router.get('/imap',ImapController.Imap);
router.get('/getBoxes',ImapController.getBoxes);
router.get('/getmessage/:folder/:start/:end',ImapController.getmessage);
router.get('/getcount/:folder',ImapController.getcount);
router.get('/getmessage',ImapgController.Imap);
router.get('/testemail/:page',ImapgController.TestMail);
router.get('/getmess/:uid',ImapgController.getmess);

router.get('/getmessagebody/:uid',ImapController.getmessagebody);





module.exports = router;

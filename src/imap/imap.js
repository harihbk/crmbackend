var imaps = require('imap-simple');
const _ = require('lodash');
const simpleParser = require('mailparser').simpleParser;
const imap_config = require('./configure');
const express = require('express');
const app = express();


var data =[]

let hello = async function(data , flag ) {
    var obj = [];
  return  new Promise((resolve,reject)=>{
        simpleParser(data).then(res=>{


            obj = {
                subject : res.subject,
                body    : res.html,
                date    : res.date,
                to      : {
                    value : res?.to?.value,
                    html  : res?.to?.html,
                    text  : res?.to?.text
                },
                from     :{
                    value : res?.from?.value,
                    html  : res?.from?.html,
                    text  : res?.from?.text
                },
                flag : flag

            }
            resolve(obj)
        })
    })
 };


const _Invokeimap=async (req,res) => {

    let config = imap_config.configure()

    imaps.connect(config).then(function (connection) {
        return connection.openBox('INBOX').then(function () {
            let searchCriteria = ['119:120',''];
            let fetchOptions = {
                bodies: ['HEADER', 'TEXT', ["HEADER","FROM", "solomon@webdads2u.in"]],
                struct: true
            };
            var promises = [];
            return connection.search(searchCriteria, fetchOptions).then(function (messages) {
                    messages.forEach(function (item) {
                        var all = _.find(item.parts, { "which": "" })
                        var id = item.attributes.uid;
                        var idHeader = "Imap-Id: "+id+"\r\n";
                        data = []

                        promises.push(hello(idHeader+all.body))
                    });
                Promise.all(promises)
                .then((result) => {
                    res.send(result)
                })


        });
        });
    });

}


var _getBoxes= async(req,res)=>{

    const p1 =  await imap_config.configure(req,res)
                await imap_config.getFolder(p1).then(r=>{
                  return res.status(200).json(r)
                    }).catch(e=>{
                      return   res.status(403).json('Imap Error !')
                    })


}

// var getmessage123 = async(req,res,next) => {

//     var folder = req.params.folder
//     var start = req.params.start
//     var end = req.params.end

//     var config = await imap_config.configure(req,res)
//     await imap_config.getFolder(config).then(result=>{

//        let check_if_folder = result.find(o => o.name.toLowerCase() == folder.toLowerCase())
//        if(_.isEmpty(check_if_folder)){
//         return res.status(403).json({error : 'Folder Not Found 2!'}).end();
//        }
//        else
//        {
//          let connection =  await imaps.connect(config)
//          console.log(connection);




//             // imaps.connect(config).then(function (connection) {
//             //     return connection.openBox(folder).then(function () {
//             //         var searchCriteria = [start+":"+end];
//             //         var fetchOptions = {
//             //             bodies: ['HEADER', 'TEXT', ''],
//             //         };
//             //         var promises = [];
//             //          return connection.search(searchCriteria, fetchOptions).then(function (messages) {
//             //                 messages.forEach(function (item) {
//             //                     var all = _.find(item.parts, { "which": "" })
//             //                     var id = item.attributes.uid;
//             //                     var idHeader = "Imap-Id: "+id+"\r\n";
//             //                     data = []
//             //                     promises.push(hello(idHeader+all.body))
//             //                 });
//             //             Promise.all(promises)
//             //             .then((result) => {
//             //             return res.status(200).json(result);
//             //             })
//             //         });


//             //     });
//             // });
//        }
//     }).catch(e=>{
//       console.log(e);
//       return res.status(403).json('imap error 1')
//     })

// }


var getcount = async(req,res,next) => {
  var folder = req.params.folder
  var config = await imap_config.configure(req,res)
  let folders = await imap_config.getFolder(config)
  let connection =  await imaps.connect(config)
  let openbox =  await connection.openBox(folder)
  return res.status(200).json(openbox.message.total);
}



var getmessage = async(req,res,next) => {

  var folder = req.params.folder
  var _start = req.params.start
  var _end = req.params.end

  var config = await imap_config.configure(req,res)
   let folders = await imap_config.getFolder(config)
   let connection =  await imaps.connect(config)
   let openbox =  await connection.openBox(folder)
   var searchCriteria = ['1:*'];
                       var fetchOptions = {
                           bodies: ['HEADER', 'TEXT', ''],
                       };
   let uidList = await connection.search(searchCriteria,fetchOptions);
   uidList = !uidList ? [] : uidList.sort((a, b) => b.attributes.uid - a.attributes.uid); // newer first
  // let Result = uidList.map(choice => (choice.attributes.uid));

   let messageCount = uidList.length;

   let page = Number(_start) || 0;
   let pageSize = Number(_end) || 20;

   let pages = Math.ceil(messageCount / pageSize) || 1;

   if (page < 0) {
       page = 0;
   }

   if (page >= pages) {
       page = pages - 1;
   }

   let messages = [];
   let seqMax, seqMin, range;

   let start = page * pageSize;
    let uidRange = uidList.slice(start, start + pageSize);
    var promises = [];



      uidRange.forEach(function (item) {
        var all = _.find(item.parts, { "which": "" })
        var id = item.attributes.uid;
        var attr = item.attributes;
        var idHeader = "Imap-Id: "+id+"\r\n";
        promises.push(hello(idHeader+all.body,item.attributes.flags))
    })

     Promise.all(promises).then(f=>{
      return res.status(200).json(f);

     })

}


const getmessagebody = async(req,res) => {
  var config = await imap_config.configure(req,res)
   let connection =  await imaps.connect(config)
   let openbox =  await connection.openBox('INBOX')

   var searchCriteria =  [['UID', req.params.uid]]
   var fetchOptions = {
       bodies: ['HEADER', 'TEXT', ''],
   };
  let uidList = await connection.search(searchCriteria,fetchOptions);

   var all = _.find(uidList[0].parts, { "which": "" })
   var id = uidList[0].attributes.uid;
   var attr = uidList[0].attributes;
   var idHeader = "Imap-Id: "+id+"\r\n";
   var promises = [];
   hello(idHeader+all.body).then(ress=>{
    return res.status(200).json(ress.body)
   }).catch(e=>{
    return res.status(403).json(e)

   })




}







module.exports = {
    Imap : _Invokeimap,
    getBoxes : _getBoxes,
    getmessage : getmessage,
    getcount : getcount,
    getmessagebody:getmessagebody

}

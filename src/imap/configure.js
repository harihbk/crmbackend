var imaps = require('imap-simple');
const simpleParser = require('mailparser').simpleParser;

var self = module.exports={
    configure:async(req,res)=>{
          //   let obj = {
          //     user: "hari95nn@gmail.com",
          //     password: "Hari@123N",
          //     host: 'imap.gmail.com',
          //     port: 993,
          //     tls: true,
          //     tlsOptions: {
          //         rejectUnauthorized: false
          //     },
          //     authTimeout: 3000
          // }
        //   let obj = {
        //         user: "crmtestingforu@gmail.com",
        //         password: "Testing@123",
        //         host: 'imap.gmail.com',
        //         port: 993,
        //         tls: true,
        //         tlsOptions: {
        //             rejectUnauthorized: false
        //         },
        //         authTimeout: 3000
        //     }

        let obj = {
            user: "hari95nn@gmail.com",
            password: "hfpfqsrraecdravl",
            host: 'imap.gmail.com',
            port: 993,
            tls: true,
            tlsOptions: {
                rejectUnauthorized: false
            },
            authTimeout: 3000
        }


        return {imap : obj}
     },
     checkfolder : ()=>{

     },
     imapNestedFolders : (folders) => {
        var FOLDERS = [];
        var folder  = {};
        for (var key in folders) {
            if (folders[key].attribs.indexOf('\\HasChildren') > -1) {
                var children = self.imapNestedFolders(folders[key].children);
                folder = {
                    name        : key,
                    children    : children
                };
            } else {
                folder = {
                    name        : key,
                    children    : null
                };
            }
            FOLDERS.push(folder);
        }
        return FOLDERS;
        },
     getFolder:(config)=>{
        var folders = [];
            return new Promise((resolve,reject)=>{
                imaps.connect(config).then(function (connection) {
                    connection.getBoxes((err,boxes)=>{
                        if (err) {
                            reject(err)
                        } else {
                            folders = self.imapNestedFolders(boxes);
                        }
                       resolve(folders)
                    },err=>{
                        reject(err)
                    })
                }).catch(e=>{
                    reject(e)
                 });
            })
     }

}
